// Zero-Width, Homoglyph, and Invisible Character Detection

export interface XRayFinding {
  type: 'ZERO_WIDTH' | 'DIRECTION_OVERRIDE' | 'HOMOGLYPH' | 'MIXED_SCRIPT';
  char: string;
  index: number;
  description: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

export interface XRayResult {
  originalText: string;
  isClean: boolean;
  findings: XRayFinding[];
  highlightedNodes: { text: string; isMalicious: boolean; finding?: XRayFinding }[];
}

const ZW_REGEX = /[\u200B-\u200D\uFEFF]/;
const DIR_REGEX = /[\u200E\u200F\u202A-\u202E\u2066-\u2069]/;

// Basic Cyrillic/Greek that look like Latin (Homoglyphs)
const HOMOGLYPH_MAP: Record<string, string> = {
  'а': 'Cyrillic "a"',
  'с': 'Cyrillic "c"',
  'е': 'Cyrillic "e"',
  'о': 'Cyrillic "o"',
  'р': 'Cyrillic "p"',
  'х': 'Cyrillic "x"',
  'у': 'Cyrillic "y"',
  'ο': 'Greek "o"',
  'ν': 'Greek "v"',
};

export function analyzeXRay(text: string): XRayResult {
  const findings: XRayFinding[] = [];
  const highlightedNodes: XRayResult['highlightedNodes'] = [];

  let hasLatin = false;
  let hasCyrillic = false;

  let currentSafeChunk = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    let finding: XRayFinding | null = null;

    if (ZW_REGEX.test(char)) {
      finding = {
        type: 'ZERO_WIDTH',
        char,
        index: i,
        description: 'Zero-Width Character (Invisible)',
        severity: 'CRITICAL',
      };
    } else if (DIR_REGEX.test(char)) {
      finding = {
        type: 'DIRECTION_OVERRIDE',
        char,
        index: i,
        description: 'Directional Override (Reverses Text)',
        severity: 'CRITICAL',
      };
    } else if (HOMOGLYPH_MAP[char]) {
      finding = {
        type: 'HOMOGLYPH',
        char,
        index: i,
        description: `Homoglyph Spoof: ${HOMOGLYPH_MAP[char]} used instead of Latin.`,
        severity: 'HIGH',
      };
      hasCyrillic = true;
    } else {
      if (/[a-zA-Z]/.test(char)) hasLatin = true;
      if (/[\u0400-\u04FF]/.test(char)) hasCyrillic = true;
    }

    if (finding) {
      if (currentSafeChunk) {
        highlightedNodes.push({ text: currentSafeChunk, isMalicious: false });
        currentSafeChunk = '';
      }
      findings.push(finding);
      highlightedNodes.push({ text: char, isMalicious: true, finding });
    } else {
      currentSafeChunk += char;
    }
  }

  if (currentSafeChunk) {
    highlightedNodes.push({ text: currentSafeChunk, isMalicious: false });
  }

  // Detect Mixed Script (e.g., pаypal.com using cyrillic 'а')
  if (hasLatin && hasCyrillic) {
    findings.push({
      type: 'MIXED_SCRIPT',
      char: 'MIXED',
      index: -1,
      description: 'Mixed Script Attack: Text mixes Latin and Cyrillic alphabets to spoof legitimate domains/words.',
      severity: 'CRITICAL',
    });
  }

  return {
    originalText: text,
    isClean: findings.length === 0,
    findings,
    highlightedNodes,
  };
}
