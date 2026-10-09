import * as ort from 'onnxruntime-web';
import { BertWordPieceTokenizer } from './BertWordPieceTokenizer';
import { configureOrt, getModelAssetUrl } from '../ortConfig';

export interface TextModel {
  predict(text: string): Promise<number>;
}

export class OnnxTextModel implements TextModel {
  private modelAssetPath: string;
  private vocabAssetPath: string;
  private tokenizer: BertWordPieceTokenizer | null = null;
  private session: ort.InferenceSession | null = null;
  private initPromise: Promise<void> | null = null;

  constructor(
    modelAssetPath: string = 'models/text/model_quantized.onnx',
    vocabAssetPath: string = 'models/text/vocab.txt'
  ) {
    this.modelAssetPath = modelAssetPath;
    this.vocabAssetPath = vocabAssetPath;
  }

  private async initialize(): Promise<void> {
    if (this.session && this.tokenizer) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      configureOrt();

      const vocabUrl = getModelAssetUrl(this.vocabAssetPath);
      const modelUrl = getModelAssetUrl(this.modelAssetPath);

      // Load vocab
      const vocabRes = await fetch(vocabUrl);
      if (!vocabRes.ok) {
        throw new Error(`Failed to load vocabulary from ${vocabUrl}: ${vocabRes.statusText}`);
      }
      const vocabText = await vocabRes.text();
      this.tokenizer = BertWordPieceTokenizer.fromVocabText(vocabText, 96);

      // Create session
      this.session = await ort.InferenceSession.create(modelUrl);
    })();

    return this.initPromise;
  }

  async predict(text: string): Promise<number> {
    const trimmed = text.trim();
    if (trimmed.length === 0) {
      throw new Error('Input text cannot be empty');
    }

    await this.initialize();

    if (!this.tokenizer || !this.session) {
      throw new Error('Text model failed to initialize');
    }

    const encoded = this.tokenizer.encode(trimmed);
    const seqLen = encoded.inputIds.length;

    const feeds: Record<string, ort.Tensor> = {
      input_ids: new ort.Tensor('int64', encoded.inputIds, [1, seqLen]),
      attention_mask: new ort.Tensor('int64', encoded.attentionMask, [1, seqLen]),
      token_type_ids: new ort.Tensor('int64', encoded.tokenTypeIds, [1, seqLen]),
    };

    const results = await this.session.run(feeds, ['logits']);
    const logits = Array.from(results.logits.data as Float32Array);
    if (logits.length < 2) {
      throw new Error(`Model returned unexpected logits length: ${logits.length}`);
    }

    const logit0 = logits[0];
    const logit1 = logits[1];
    const maxLogit = Math.max(logit0, logit1);
    const exp0 = Math.exp(logit0 - maxLogit);
    const exp1 = Math.exp(logit1 - maxLogit);
    const sumExp = exp0 + exp1;

    const pSpam = exp1 / sumExp;
    return Math.min(1.0, Math.max(0.0, pSpam));
  }
}
