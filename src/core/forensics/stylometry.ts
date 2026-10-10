// Stylometry & Linguistic Forensics (Imposter Detector)

export interface LinguisticFingerprint {
  avgWordLength: number;
  lexicalRichness: number; // unique words / total words
  punctuationDensity: number; // punctuation chars / total chars
  capitalizationRate: number; // uppercase / total chars
}

export interface StylometryResult {
  baseline: LinguisticFingerprint;
  suspect: LinguisticFingerprint;
  matchScore: number; // 0-100%
  deviations: {
    metric: string;
    baselineValue: number;
    suspectValue: number;
    difference: number;
    isAnomalous: boolean;
  }[];
  verdict: 'MATCH' | 'INCONCLUSIVE' | 'IMPOSTER';
}

function computeFingerprint(text: string): LinguisticFingerprint {
  if (!text.trim()) {
    return { avgWordLength: 0, lexicalRichness: 0, punctuationDensity: 0, capitalizationRate: 0 };
  }

  const chars = text.length;
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  const uniqueWords = new Set(words);
  const punctuationMatch = text.match(/[.,!?;:'"()-]/g);
  const uppercaseMatch = text.match(/[A-Z]/g);

  const totalWords = words.length || 1; // Prevent div by zero
  const totalWordLengths = words.reduce((sum, w) => sum + w.length, 0);

  return {
    avgWordLength: totalWordLengths / totalWords,
    lexicalRichness: uniqueWords.size / totalWords,
    punctuationDensity: (punctuationMatch?.length || 0) / chars,
    capitalizationRate: (uppercaseMatch?.length || 0) / chars,
  };
}

export function compareStylometry(baselineText: string, suspectText: string): StylometryResult {
  const baseline = computeFingerprint(baselineText);
  const suspect = computeFingerprint(suspectText);

  const deviations = [
    {
      metric: 'Average Word Length',
      baselineValue: baseline.avgWordLength,
      suspectValue: suspect.avgWordLength,
      difference: Math.abs(baseline.avgWordLength - suspect.avgWordLength),
      isAnomalous: Math.abs(baseline.avgWordLength - suspect.avgWordLength) > 1.5,
    },
    {
      metric: 'Lexical Richness (Unique Words)',
      baselineValue: baseline.lexicalRichness * 100,
      suspectValue: suspect.lexicalRichness * 100,
      difference: Math.abs(baseline.lexicalRichness - suspect.lexicalRichness) * 100,
      isAnomalous: Math.abs(baseline.lexicalRichness - suspect.lexicalRichness) > 0.25,
    },
    {
      metric: 'Punctuation Density',
      baselineValue: baseline.punctuationDensity * 100,
      suspectValue: suspect.punctuationDensity * 100,
      difference: Math.abs(baseline.punctuationDensity - suspect.punctuationDensity) * 100,
      isAnomalous: Math.abs(baseline.punctuationDensity - suspect.punctuationDensity) > 0.05,
    },
    {
      metric: 'Capitalization Rate',
      baselineValue: baseline.capitalizationRate * 100,
      suspectValue: suspect.capitalizationRate * 100,
      difference: Math.abs(baseline.capitalizationRate - suspect.capitalizationRate) * 100,
      isAnomalous: Math.abs(baseline.capitalizationRate - suspect.capitalizationRate) > 0.08,
    },
  ];

  const anomalousCount = deviations.filter((d) => d.isAnomalous).length;
  
  // Base score is 100, subtract 25 for every major anomaly
  const matchScore = Math.max(0, 100 - (anomalousCount * 25));

  let verdict: StylometryResult['verdict'] = 'MATCH';
  if (matchScore <= 25) {
    verdict = 'IMPOSTER';
  } else if (matchScore <= 75) {
    verdict = 'INCONCLUSIVE';
  }

  return {
    baseline,
    suspect,
    matchScore,
    deviations,
    verdict,
  };
}
