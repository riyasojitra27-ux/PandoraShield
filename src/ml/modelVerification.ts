import * as ort from 'onnxruntime-web';
import { configureOrt, getModelAssetUrl } from './ortConfig';

export interface ModelVerificationReport {
  ortLoaded: boolean;
  textModelUrl: string;
  urlModelUrl: string;
  textModelFetchable?: boolean;
  urlModelFetchable?: boolean;
  textSessionCreated?: boolean;
  urlSessionCreated?: boolean;
  error?: string;
}

/**
 * Development-only utility to verify ONNX Runtime Web asset paths and session creation in the browser.
 */
export async function verifyModelInfrastructure(): Promise<ModelVerificationReport> {
  configureOrt();

  const textModelUrl = getModelAssetUrl('models/text/model_quantized.onnx');
  const urlModelUrl = getModelAssetUrl('models/url/model.onnx');

  const report: ModelVerificationReport = {
    ortLoaded: typeof ort !== 'undefined' && !!ort.InferenceSession,
    textModelUrl,
    urlModelUrl,
  };

  try {
    // Verify text model is fetchable
    const textRes = await fetch(textModelUrl, { method: 'HEAD' });
    report.textModelFetchable = textRes.ok;

    // Verify url model is fetchable
    const urlRes = await fetch(urlModelUrl, { method: 'HEAD' });
    report.urlModelFetchable = urlRes.ok;

    // Verify sessions can be initialized
    if (report.textModelFetchable) {
      const textSession = await ort.InferenceSession.create(textModelUrl);
      report.textSessionCreated = textSession.inputNames.length > 0;
    }

    if (report.urlModelFetchable) {
      const urlSession = await ort.InferenceSession.create(urlModelUrl);
      report.urlSessionCreated = urlSession.inputNames.length > 0;
    }
  } catch (err: any) {
    report.error = err?.message || String(err);
  }

  return report;
}
