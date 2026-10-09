export interface TokenizedInput {
  tokens: string[];
  inputIds: BigInt64Array;
  attentionMask: BigInt64Array;
  tokenTypeIds: BigInt64Array;
}

export class BertWordPieceTokenizer {
  public static readonly PAD_TOKEN = '[PAD]';
  public static readonly UNK_TOKEN = '[UNK]';
  public static readonly CLS_TOKEN = '[CLS]';
  public static readonly SEP_TOKEN = '[SEP]';
  public static readonly MASK_TOKEN = '[MASK]';

  public static readonly PAD_ID = 0n;
  public static readonly UNK_ID = 100n;
  public static readonly CLS_ID = 101n;
  public static readonly SEP_ID = 102n;
  public static readonly MASK_ID = 103n;

  private vocab: Map<string, number>;
  public maxSequenceLength: number;

  constructor(vocab: Map<string, number>, maxSequenceLength: number = 96) {
    this.vocab = vocab;
    this.maxSequenceLength = maxSequenceLength;
  }

  static fromVocabText(text: string, maxSequenceLength: number = 96): BertWordPieceTokenizer {
    const vocab = new Map<string, number>();
    const lines = text.split(/\r?\n/);
    let idx = 0;
    for (const line of lines) {
      const token = line.trim();
      if (token.length > 0) {
        vocab.set(token, idx);
      }
      idx++;
    }
    return new BertWordPieceTokenizer(vocab, maxSequenceLength);
  }

  private isPunctuation(cp: number): boolean {
    if ((cp >= 33 && cp <= 47) || (cp >= 58 && cp <= 64) || (cp >= 91 && cp <= 96) || (cp >= 123 && cp <= 126)) {
      return true;
    }
    if (
      (cp >= 0x2000 && cp <= 0x206f) ||
      (cp >= 0x2e00 && cp <= 0x2e7f) ||
      (cp >= 0x3000 && cp <= 0x303f) ||
      (cp >= 0xff00 && cp <= 0xff0f) ||
      (cp >= 0xff1a && cp <= 0xff20) ||
      (cp >= 0xff3b && cp <= 0xff40) ||
      (cp >= 0xff5b && cp <= 0xff65)
    ) {
      return true;
    }
    return false;
  }

  private isWhitespace(c: string): boolean {
    return c === ' ' || c === '\t' || c === '\n' || c === '\r' || /\s/.test(c);
  }

  private isControl(c: string, cp: number): boolean {
    if (c === '\t' || c === '\n' || c === '\r') return false;
    return cp < 32 || (cp >= 127 && cp <= 159);
  }

  private isChineseChar(cp: number): boolean {
    return (
      (cp >= 0x4e00 && cp <= 0x9fff) ||
      (cp >= 0x3400 && cp <= 0x4dbf) ||
      (cp >= 0x20000 && cp <= 0x2a6df) ||
      (cp >= 0x2a700 && cp <= 0x2b73f) ||
      (cp >= 0x2b740 && cp <= 0x2b81f) ||
      (cp >= 0x2b820 && cp <= 0x2ceaf) ||
      (cp >= 0xf900 && cp <= 0xfaff) ||
      (cp >= 0x2f800 && cp <= 0x2fa1f)
    );
  }

  private cleanAndNormalize(text: string): string {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      const cp = c.charCodeAt(0);
      if (cp === 0 || cp === 0xfffd || this.isControl(c, cp)) {
        continue;
      }
      if (this.isWhitespace(c)) {
        result += ' ';
      } else if (this.isChineseChar(cp)) {
        result += ' ' + c + ' ';
      } else {
        result += c;
      }
    }
    return result.toLowerCase();
  }

  private basicTokenize(text: string): string[] {
    const cleanText = this.cleanAndNormalize(text);
    const origTokens = cleanText.split(' ').filter(t => t.length > 0);
    const splitTokens: string[] = [];

    for (const token of origTokens) {
      let start = 0;
      for (let i = 0; i < token.length; i++) {
        const cp = token.charCodeAt(i);
        if (this.isPunctuation(cp)) {
          if (i > start) {
            splitTokens.push(token.substring(start, i));
          }
          splitTokens.push(token[i]);
          start = i + 1;
        }
      }
      if (start < token.length) {
        splitTokens.push(token.substring(start));
      }
    }
    return splitTokens;
  }

  private wordpieceTokenize(tokens: string[]): string[] {
    const outputTokens: string[] = [];
    const maxInputCharsPerWord = 200;

    for (const token of tokens) {
      if (token.length > maxInputCharsPerWord) {
        outputTokens.push(BertWordPieceTokenizer.UNK_TOKEN);
        continue;
      }

      let isBad = false;
      let start = 0;
      const subTokens: string[] = [];

      while (start < token.length) {
        let end = token.length;
        let curSubStr: string | null = null;

        while (start < end) {
          let subStr = token.substring(start, end);
          if (start > 0) {
            subStr = '##' + subStr;
          }
          if (this.vocab.has(subStr)) {
            curSubStr = subStr;
            break;
          }
          end--;
        }

        if (curSubStr === null) {
          isBad = true;
          break;
        }

        subTokens.push(curSubStr);
        start = end;
      }

      if (isBad) {
        outputTokens.push(BertWordPieceTokenizer.UNK_TOKEN);
      } else {
        outputTokens.push(...subTokens);
      }
    }
    return outputTokens;
  }

  encode(text: string): TokenizedInput {
    const rawTokens = this.basicTokenize(text);
    const wpTokens = this.wordpieceTokenize(rawTokens);

    const maxBodyTokens = this.maxSequenceLength - 2;
    const truncatedWp = wpTokens.length > maxBodyTokens ? wpTokens.slice(0, maxBodyTokens) : wpTokens;

    const fullTokens = [BertWordPieceTokenizer.CLS_TOKEN, ...truncatedWp, BertWordPieceTokenizer.SEP_TOKEN];
    const seqLen = fullTokens.length;

    const inputIds = new BigInt64Array(seqLen);
    const attentionMask = new BigInt64Array(seqLen);
    const tokenTypeIds = new BigInt64Array(seqLen);

    for (let i = 0; i < seqLen; i++) {
      const token = fullTokens[i];
      const id = this.vocab.get(token) ?? Number(BertWordPieceTokenizer.UNK_ID);
      inputIds[i] = BigInt(id);
      attentionMask[i] = 1n;
      tokenTypeIds[i] = 0n;
    }

    return { tokens: fullTokens, inputIds, attentionMask, tokenTypeIds };
  }
}
