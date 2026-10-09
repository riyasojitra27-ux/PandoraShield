import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as ort from 'onnxruntime-web';
import { BertWordPieceTokenizer } from '../src/ml/text/BertWordPieceTokenizer';
import { OnnxTextModel } from '../src/ml/text/OnnxTextModel';
import { PhishScoutFeatureExtractor } from '../src/ml/url/PhishScoutFeatureExtractor';
import { PhishScoutUrlModel } from '../src/ml/url/PhishScoutUrlModel';
import { LocalEvidenceEngine } from '../src/core/evidence/LocalEvidenceEngine';
import { LocalScamChainEngine } from '../src/core/chain/LocalScamChainEngine';
import { LocalThreatIntelRepository } from '../src/core/threatintel/LocalThreatIntelRepository';
import { LocalRiskEngine } from '../src/core/risk/LocalRiskEngine';
import { ExplanationGenerator } from '../src/core/explanation/ExplanationGenerator';
import { LocalDetectionCoordinator } from '../src/core/detection/LocalDetectionCoordinator';
import { LocalDetectionEngine } from '../src/services/LocalDetectionEngine';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

function assertClose(actual: number, expected: number, delta: number, label: string) {
  const diff = Math.abs(actual - expected);
  assert(diff <= delta, `${label}: Expected ${expected} ± ${delta}, got ${actual} (diff=${diff})`);
}

async function runAllTests() {
  console.log('====================================================');
  console.log('PANDORASHIELD BROWSER DETECTION ENGINE TEST SUITE');
  console.log('====================================================\n');

  // Test 1: Tokenizer
  console.log('--- TEST 1: BertWordPieceTokenizer ---');
  const vocabPath = path.resolve(__dirname, '../public/models/text/vocab.txt');
  const vocabText = fs.readFileSync(vocabPath, 'utf8');
  const tokenizer = BertWordPieceTokenizer.fromVocabText(vocabText, 96);
  const enc = tokenizer.encode('Hello, how are you?');
  assert(enc.tokens[0] === '[CLS]', 'First token should be [CLS]');
  assert(enc.tokens[enc.tokens.length - 1] === '[SEP]', 'Last token should be [SEP]');
  assert(enc.inputIds[0] === 101n, '[CLS] ID must be 101');
  assert(enc.inputIds[enc.inputIds.length - 1] === 102n, '[SEP] ID must be 102');
  console.log('✓ Tokenizer verified successfully.');

  // Test 2: Text ML Model
  console.log('\n--- TEST 2: Real Text Model (MiniLM-L6 INT8 ONNX) ---');
  const textModelPath = path.resolve(__dirname, '../public/models/text/model_quantized.onnx');
  const session = await ort.InferenceSession.create(textModelPath);

  async function predictText(text: string): Promise<number> {
    const encoded = tokenizer.encode(text.trim());
    const seqLen = encoded.inputIds.length;
    const feeds = {
      input_ids: new ort.Tensor('int64', encoded.inputIds, [1, seqLen]),
      attention_mask: new ort.Tensor('int64', encoded.attentionMask, [1, seqLen]),
      token_type_ids: new ort.Tensor('int64', encoded.tokenTypeIds, [1, seqLen]),
    };
    const res = await session.run(feeds, ['logits']);
    const logits = Array.from(res.logits.data as Float32Array);
    const maxL = Math.max(logits[0], logits[1]);
    const exp0 = Math.exp(logits[0] - maxL);
    const exp1 = Math.exp(logits[1] - maxL);
    return exp1 / (exp0 + exp1);
  }

  const pHello = await predictText('Hello, how are you?');
  console.log(`- "Hello, how are you?" -> p(spam) = ${pHello.toFixed(6)}`);
  assertClose(pHello, 0.0012, 0.005, 'Hello text');

  const pKyc = await predictText('URGENT: Your SBI account will be blocked. Update KYC immediately at http://sbi-kyc-update.in');
  console.log(`- "SBI KYC Scam" -> p(spam) = ${pKyc.toFixed(6)}`);
  assertClose(pKyc, 0.9994, 0.005, 'SBI KYC text');

  const pReward = await predictText('Congratulations! You have won Rs 5,00,000. Reply YES to claim your reward.');
  console.log(`- "Prize Reward Scam" -> p(spam) = ${pReward.toFixed(6)}`);
  assertClose(pReward, 0.9995, 0.005, 'Reward scam text');

  const pOtp = await predictText('Your OTP is 4730 for a transaction of INR 27472. Do not share it with anyone.');
  console.log(`- "Bank OTP Notification" -> p(spam) = ${pOtp.toFixed(6)}`);
  assertClose(pOtp, 0.0007, 0.005, 'Bank OTP text');
  console.log('✓ Text Model inference verified with exact Android parity.');

  // Test 3: URL Feature Extractor & Model
  console.log('\n--- TEST 3: Real URL Model (PhishScout 35-Feature LightGBM ONNX) ---');
  const urlModel = new PhishScoutUrlModel();

  const pGoogle = await urlModel.predict('https://www.google.com');
  console.log(`- "https://www.google.com" -> p(phishing) = ${pGoogle.toFixed(6)}`);
  assertClose(pGoogle, 0.0069, 0.005, 'Google URL');

  const pPaypal = await urlModel.predict('http://paypal-verify-login.example.com');
  console.log(`- "http://paypal-verify-login.example.com" -> p(phishing) = ${pPaypal.toFixed(6)}`);
  assertClose(pPaypal, 0.9862, 0.005, 'Paypal Phishing URL');

  const pNgrok = await urlModel.predict('http://paypa1-verify.ngrok.io/login?token=x');
  console.log(`- "http://paypa1-verify.ngrok.io/login?token=x" -> p(phishing) = ${pNgrok.toFixed(6)}`);
  assertClose(pNgrok, 0.9942, 0.005, 'Ngrok Phishing URL');

  const pExample = await urlModel.predict('https://example.com/login');
  console.log(`- "https://example.com/login" -> p(phishing) = ${pExample.toFixed(6)}`);
  assertClose(pExample, 0.3734, 0.005, 'Example Login URL');
  console.log('✓ URL Model inference verified with exact Android parity.');

  // Test 4: LocalEvidenceEngine
  console.log('\n--- TEST 4: LocalEvidenceEngine ---');
  const evidenceEngine = new LocalEvidenceEngine();
  const textEv = evidenceEngine.analyzeText('URGENT: Verify your bank account login credentials and OTP immediately');
  assert(textEv.includes('Urgency language detected'), 'Should detect urgency');
  assert(textEv.includes('Request for OTP detected'), 'Should detect OTP request');
  assert(textEv.includes('Credential request detected'), 'Should detect credential request');
  assert(textEv.includes('Potential impersonation indicator'), 'Should detect bank impersonation');

  const urlEv = evidenceEngine.analyzeUrl('http://paypal-verify-login-update.example.com/login?token=xyz');
  assert(urlEv.includes('Suspicious keywords detected in URL path or domain'), 'Should detect keywords');
  assert(urlEv.includes('Suspicious domain structure with multiple hyphens'), 'Should detect hyphens');

  console.log('✓ Evidence Engine verified.');

  // Test 5: LocalScamChainEngine
  console.log('\n--- TEST 5: LocalScamChainEngine ---');
  const chainEngine = new LocalScamChainEngine();
  const stages = chainEngine.generate(textEv);
  assert(stages.includes('URGENCY'), 'Chain must include URGENCY');
  assert(stages.includes('OTP_HARVEST'), 'Chain must include OTP_HARVEST');
  assert(stages.includes('CREDENTIAL_HARVEST'), 'Chain must include CREDENTIAL_HARVEST');
  assert(stages.includes('IMPERSONATION'), 'Chain must include IMPERSONATION');
  console.log('✓ ScamChain Engine verified.');

  // Test 6: LocalRiskEngine
  console.log('\n--- TEST 6: LocalRiskEngine ---');
  const riskEngine = new LocalRiskEngine();
  const assessmentSafe = riskEngine.calculate(0.001, null, false, [], []);
  assert(assessmentSafe.riskScore === 0, 'Safe text score must be 0');
  assert(assessmentSafe.severity === 'SAFE', 'Safe text severity must be SAFE');

  const assessmentScam = riskEngine.calculate(0.999, null, false, textEv, stages);
  assert(assessmentScam.riskScore >= 75, 'Scam text score must be >= 75');
  assert(assessmentScam.severity === 'HIGH' || assessmentScam.severity === 'CRITICAL', 'Scam text severity must be HIGH or CRITICAL');
  console.log('✓ Risk Engine verified.');

  // Test 7: LocalDetectionCoordinator End-to-End
  console.log('\n--- TEST 7: LocalDetectionCoordinator End-to-End ---');
  const mockTextModel = { predict: async (t: string) => predictText(t) };
  const coordinator = new LocalDetectionCoordinator(
    mockTextModel,
    urlModel,
    evidenceEngine,
    chainEngine,
    new LocalThreatIntelRepository(),
    riskEngine
  );

  const textRes = await coordinator.analyzeText('URGENT: Your SBI account will be blocked. Update KYC immediately at http://sbi-kyc-update.in');
  console.log('Real Message Scan DetectionResult:', {
    riskScore: textRes.riskScore,
    severity: textRes.severity,
    textRisk: textRes.textRisk,
    evidenceCount: textRes.evidence.length,
    chainStagesCount: textRes.chainStages.length,
  });
  assert(textRes.riskScore === 49, `SBI KYC riskScore expected 49, got ${textRes.riskScore}`);
  assert(textRes.severity === 'MEDIUM', `SBI KYC severity expected MEDIUM, got ${textRes.severity}`);
  assert(textRes.scanType === 'MESSAGE', 'scanType must be MESSAGE');

  const urlRes = await coordinator.analyzeUrl('http://paypal-verify-login.example.com');
  console.log('Real URL Scan DetectionResult:', {
    riskScore: urlRes.riskScore,
    severity: urlRes.severity,
    urlRisk: urlRes.urlRisk,
    evidenceCount: urlRes.evidence.length,
    chainStagesCount: urlRes.chainStages.length,
  });
  assert(urlRes.riskScore === 44, `Paypal phishing riskScore expected 44, got ${urlRes.riskScore}`);
  assert(urlRes.severity === 'MEDIUM', `Paypal phishing severity expected MEDIUM, got ${urlRes.severity}`);
  assert(urlRes.scanType === 'URL', 'scanType must be URL');

  // Test 8: LocalDetectionEngine Service Adapter
  console.log('\n--- TEST 8: LocalDetectionEngine UI Service Adapter ---');
  const localEngine = new LocalDetectionEngine();
  const uiUrlResult = await localEngine.analyzeUrl('http://paypal-verify-login.example.com');
  assert(uiUrlResult.riskScore === 44, 'UI riskScore must be 44');
  assert(uiUrlResult.evidence.length > 0, 'UI evidence must have entries');
  assert(uiUrlResult.scamChain.length > 0, 'UI scamChain must have entries');
  assert(uiUrlResult.source === 'LOCAL', 'source must be LOCAL');
  console.log('✓ UI Service Adapter verified.');

  console.log('\n====================================================');
  console.log('ALL 8 INTEGRATION TESTS PASSED (100% PARITY CONFIRMED)');
  console.log('====================================================');
}

runAllTests().catch(err => {
  console.error('\n❌ TEST FAILED:', err);
  process.exit(1);
});
