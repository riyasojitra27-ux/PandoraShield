export type Severity = 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type Verdict = 'SAFE' | 'SUSPICIOUS' | 'SCAM' | 'LIKELY_SCAM';
export type InputType = 'MESSAGE' | 'URL' | 'SCREENSHOT' | 'SAFETY_CHECK' | 'message' | 'url' | 'screenshot' | 'safety-check';

export interface DetectionEvidence {
  title: string;
  description: string;
  type?: string;
  severity?: Severity;
}

export interface ScamChainStep {
  stage: string;
  label: string;
  detected: boolean;
  description?: string;
  type?: string;
  title?: string;
}

export interface DetectionResult {
  id: string;
  timestamp: number;

  inputType: InputType;
  originalInput?: string;

  riskScore: number; // 0 - 100
  severity: Severity;
  verdict: Verdict | string;
  category: string;

  explanation: string;

  evidence: DetectionEvidence[];

  scamChain: ScamChainStep[];

  recommendations: string[];

  technicalDetails?: {
    model?: string;
    confidence?: number;
    indicators?: string[];
    threatIntelMatch?: boolean;
  };

  source: 'LOCAL' | 'BACKEND' | 'HYBRID';

  // Backwards compatibility properties used across existing UI
  confidence?: number;
  detectedSignals?: string[];
  titleSnippet?: string;
  success?: boolean;
}

export interface ProtectionEvent {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  timestamp: string;
  isSimulated: boolean;
}

export type ScanFilter = 'all' | 'messages' | 'urls' | 'screenshots' | 'safe' | 'risky';
