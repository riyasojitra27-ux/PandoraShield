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
  stage?: string;
  label?: string;
  detected: boolean;
  description?: string;
  type?: string;
  title?: string;
}

export interface DetectionResult {
  id: string;
  timestamp: number | string;

  inputType: InputType;
  originalInput?: string;

  riskScore: number; // 0 - 100
  severity: Severity;
  verdict: Verdict | string;
  category?: string;

  explanation: string;
  recommendation?: string;
  recommendations?: string[];

  evidence: DetectionEvidence[];
  scamChain: ScamChainStep[];

  technicalDetails?:
    | {
        model?: string;
        confidence?: number;
        indicators?: string[];
        threatIntelMatch?: boolean;
        textRisk?: number | null;
        urlRisk?: number | null;
      }
    | string[];

  source?: 'LOCAL' | 'BACKEND' | 'HYBRID';

  // Backwards compatibility properties used across existing UI
  confidence?: number;
  detectedSignals?: string[];
  titleSnippet?: string;
  success?: boolean;
  textRisk?: number | null;
  urlRisk?: number | null;
  threatIntelMatch?: boolean;
  extractedText?: string;
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
