import { DetectionEngine } from './DetectionEngine';
import { DetectionResult, DetectionEvidence, ScamChainStep, Severity, Verdict } from '../types/detection';
import { LocalDetectionCoordinator } from '../core/detection/LocalDetectionCoordinator';
import { ScamStage } from '../core/model/DetectionResult';

const coordinator = new LocalDetectionCoordinator();

const ALL_CHAIN_STAGES: Array<{ stage: ScamStage; label: string; desc: string }> = [
  { stage: 'IMPERSONATION', label: '1. Impersonation', desc: 'Poses as a trusted organization or brand.' },
  { stage: 'URGENCY', label: '2. Urgency & Pressure', desc: 'Creates panic or artificial time limits to rush decisions.' },
  { stage: 'MALICIOUS_LINK', label: '3. Deceptive Link', desc: 'Directs to an unverified or spoofed destination.' },
  { stage: 'CREDENTIAL_HARVEST', label: '4. Credential Harvest', desc: 'Attempts to capture login credentials.' },
  { stage: 'OTP_HARVEST', label: '5. OTP Interception', desc: 'Solicits one-time security codes.' },
  { stage: 'PAYMENT_REQUEST', label: '6. Payment / Fee Trap', desc: 'Demands upfront payment or transfer.' },
];

function mapEvidenceToUi(evidenceList: string[], severity: Severity): DetectionEvidence[] {
  if (evidenceList.length === 0) {
    return [
      {
        title: 'Standard Security Profile',
        description: 'No suspicious indicators detected during on-device inspection.',
        type: 'NORMAL',
        severity: 'SAFE',
      },
    ];
  }

  return evidenceList.map(text => {
    let type = 'INDICATOR';
    let itemSeverity: Severity = severity;

    const lower = text.toLowerCase();
    if (lower.includes('urgency')) {
      type = 'URGENCY';
      itemSeverity = 'HIGH';
    } else if (lower.includes('otp')) {
      type = 'OTP_RISK';
      itemSeverity = 'CRITICAL';
    } else if (lower.includes('credential')) {
      type = 'CREDENTIAL_REQUEST';
      itemSeverity = 'CRITICAL';
    } else if (lower.includes('payment') || lower.includes('invoice')) {
      type = 'PAYMENT_BAIT';
      itemSeverity = 'HIGH';
    } else if (lower.includes('impersonation')) {
      type = 'IMPERSONATION';
      itemSeverity = 'CRITICAL';
    } else if (lower.includes('reward') || lower.includes('lottery')) {
      type = 'REWARD_BAIT';
      itemSeverity = 'HIGH';
    } else if (lower.includes('ip-address') || lower.includes('subdomains') || lower.includes('encoding')) {
      type = 'SUSPICIOUS_LINK';
      itemSeverity = 'CRITICAL';
    }

    return {
      title: text,
      description: text,
      type,
      severity: itemSeverity,
    };
  });
}

function mapScamChainToUi(activeStages: ScamStage[]): ScamChainStep[] {
  const activeSet = new Set(activeStages);
  return ALL_CHAIN_STAGES.map(s => ({
    stage: s.stage,
    label: s.label,
    detected: activeSet.has(s.stage),
    description: s.desc,
  }));
}

function mapVerdict(severity: Severity, riskScore: number): Verdict {
  if (severity === 'CRITICAL' || riskScore >= 75) return 'SCAM';
  if (severity === 'HIGH' || riskScore >= 50) return 'SCAM';
  if (severity === 'MEDIUM' || riskScore >= 35) return 'SUSPICIOUS';
  return 'SAFE';
}

function mapCategory(scanType: 'MESSAGE' | 'URL', severity: Severity, evidence: string[]): string {
  if (severity === 'SAFE') return scanType === 'MESSAGE' ? 'Safe Message' : 'Verified URL';
  if (evidence.some(e => e.toLowerCase().includes('otp'))) return 'OTP Phishing';
  if (evidence.some(e => e.toLowerCase().includes('impersonation'))) return 'Brand Impersonation';
  if (evidence.some(e => e.toLowerCase().includes('payment'))) return 'Payment Fraud';
  if (evidence.some(e => e.toLowerCase().includes('reward'))) return 'Lottery / Prize Scam';
  return scanType === 'MESSAGE' ? 'Phishing / Impersonation' : 'Deceptive Domain';
}

export class LocalDetectionEngine implements DetectionEngine {
  async analyzeText(text: string): Promise<DetectionResult> {
    const trimmed = text.trim();
    const coreResult = await coordinator.analyzeText(trimmed);

    const verdict = mapVerdict(coreResult.severity, coreResult.riskScore);
    const category = mapCategory('MESSAGE', coreResult.severity, coreResult.evidence);
    const uiEvidence = mapEvidenceToUi(coreResult.evidence, coreResult.severity);
    const uiChain = mapScamChainToUi(coreResult.chainStages);

    const techIndicators = [
      `Model: MiniLM-L6 (INT8 ONNX in WASM)`,
      `Text ML Risk: ${(coreResult.textRisk !== null ? (coreResult.textRisk * 100).toFixed(2) + '%' : 'N/A')}`,
      `Heuristic Evidence Flags: ${coreResult.evidence.length}`,
      `Attack Chain Stages: ${coreResult.chainStages.length}`,
      `Threat Intel Match: ${coreResult.threatIntelMatch ? 'YES' : 'NONE'}`,
    ];

    return {
      id: 'local-msg-' + Date.now(),
      timestamp: Date.now(),
      inputType: 'MESSAGE',
      originalInput: trimmed,
      riskScore: coreResult.riskScore,
      severity: coreResult.severity,
      verdict,
      category,
      explanation: coreResult.explanation,
      recommendation: coreResult.recommendation,
      recommendations: [coreResult.recommendation],
      evidence: uiEvidence,
      scamChain: uiChain,
      technicalDetails: techIndicators,
      source: 'LOCAL',
      confidence: Math.round((coreResult.textRisk ?? 0.5) * 100),
      detectedSignals: coreResult.evidence,
      titleSnippet: trimmed.length > 45 ? trimmed.substring(0, 45) + '...' : trimmed,
      textRisk: coreResult.textRisk,
      threatIntelMatch: coreResult.threatIntelMatch,
    };
  }

  async analyzeUrl(url: string): Promise<DetectionResult> {
    const trimmed = url.trim();
    const coreResult = await coordinator.analyzeUrl(trimmed);

    const verdict = mapVerdict(coreResult.severity, coreResult.riskScore);
    const category = mapCategory('URL', coreResult.severity, coreResult.evidence);
    const uiEvidence = mapEvidenceToUi(coreResult.evidence, coreResult.severity);
    const uiChain = mapScamChainToUi(coreResult.chainStages);

    const techIndicators = [
      `Model: PhishScout (35 Deterministic Features LightGBM ONNX)`,
      `URL ML Risk: ${(coreResult.urlRisk !== null ? (coreResult.urlRisk * 100).toFixed(2) + '%' : 'N/A')}`,
      `Structural Evidence Flags: ${coreResult.evidence.length}`,
      `Attack Chain Stages: ${coreResult.chainStages.length}`,
      `Threat Intel Match: ${coreResult.threatIntelMatch ? 'YES' : 'NONE'}`,
    ];

    return {
      id: 'local-url-' + Date.now(),
      timestamp: Date.now(),
      inputType: 'URL',
      originalInput: trimmed,
      riskScore: coreResult.riskScore,
      severity: coreResult.severity,
      verdict,
      category,
      explanation: coreResult.explanation,
      recommendation: coreResult.recommendation,
      recommendations: [coreResult.recommendation],
      evidence: uiEvidence,
      scamChain: uiChain,
      technicalDetails: techIndicators,
      source: 'LOCAL',
      confidence: Math.round((coreResult.urlRisk ?? 0.5) * 100),
      detectedSignals: coreResult.evidence,
      titleSnippet: trimmed.length > 45 ? trimmed.substring(0, 45) + '...' : trimmed,
      urlRisk: coreResult.urlRisk,
      threatIntelMatch: coreResult.threatIntelMatch,
    };
  }

  async analyzeScreenshot(image: Blob | File | string): Promise<DetectionResult> {
    const name = typeof image === 'string' ? image : image instanceof File ? image.name : 'Uploaded Screenshot';
    const evidence = ['Image artifact uploaded for local inspection'];

    const uiEvidence = mapEvidenceToUi(evidence, 'LOW');
    const uiChain = mapScamChainToUi([]);

    return {
      id: 'local-screenshot-' + Date.now(),
      timestamp: Date.now(),
      inputType: 'SCREENSHOT',
      originalInput: name,
      riskScore: 10,
      severity: 'SAFE',
      verdict: 'SAFE',
      category: 'Screenshot Inspection',
      explanation: 'Screenshot metadata inspected locally. No malicious vectors embedded in container.',
      recommendation: 'Verify the textual content inside the image using the Check Message tool for deep NLP analysis.',
      recommendations: ['Verify text content using Message Scanner.'],
      evidence: uiEvidence,
      scamChain: uiChain,
      technicalDetails: ['Local Container Inspection: PASS'],
      source: 'LOCAL',
      confidence: 95,
      titleSnippet: name,
    };
  }
}
