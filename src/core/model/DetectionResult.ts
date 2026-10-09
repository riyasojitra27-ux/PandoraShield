export type ScanType = 'MESSAGE' | 'URL';
export type Severity = 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ScamStage =
  | 'IMPERSONATION'
  | 'URGENCY'
  | 'FEAR'
  | 'REWARD_BAIT'
  | 'PHISHING'
  | 'CREDENTIAL_HARVEST'
  | 'OTP_HARVEST'
  | 'PAYMENT_REQUEST'
  | 'MALICIOUS_LINK'
  | 'DATA_THEFT';

export interface DetectionResult {
  id?: string;
  timestamp?: number;
  riskScore: number;
  severity: Severity;
  scanType: ScanType;
  textRisk: number | null;
  urlRisk: number | null;
  threatIntelMatch: boolean;
  evidence: string[];
  chainStages: ScamStage[];
  explanation: string;
  recommendation: string;

  // UI mapping fields for backwards compatibility with UI rendering
  inputType?: string;
  originalInput?: string;
  verdict?: string;
  category?: string;
  confidence?: number;
  titleSnippet?: string;
  source?: 'LOCAL' | 'BACKEND' | 'HYBRID';
  recommendations?: string[];
  scamChain?: Array<{
    stage: string;
    label: string;
    detected: boolean;
    description?: string;
  }>;
  technicalDetails?: {
    model?: string;
    confidence?: number;
    indicators?: string[];
    threatIntelMatch?: boolean;
  };
}
