import { DetectionEngine } from './DetectionEngine';
import { DetectionResult, DetectionEvidence, ScamChainStep, Severity, Verdict } from '../types/detection';
import Tesseract from 'tesseract.js';
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
    let ocrInput: Blob | File | string = image;
    let name = 'Uploaded Screenshot';

    if (typeof image === 'string' && image.startsWith('__IMAGE_DATA__')) {
      // Data URL from ScreenshotScannerScreen
      ocrInput = image.slice('__IMAGE_DATA__'.length);
      name = 'Uploaded Screenshot';
    } else if (typeof image === 'string') {
      name = image;
    } else if (image instanceof File) {
      name = image.name;
    }

    let extractedText = '';
    try {
      // Run Tesseract.js directly in the browser
      const result = await Tesseract.recognize(ocrInput, 'eng', {
        logger: m => console.log('Tesseract:', m.status, Math.round(m.progress * 100) + '%')
      });
      extractedText = result.data.text.trim();
    } catch (e) {
      console.error('OCR Extraction failed:', e);
      throw new Error('Failed to extract text from the image using local OCR.');
    }

    if (!extractedText) {
      return {
        id: 'local-screenshot-' + Date.now(),
        timestamp: Date.now(),
        inputType: 'SCREENSHOT',
        originalInput: name,
        riskScore: 10,
        severity: 'SAFE',
        verdict: 'SAFE',
        category: 'Screenshot Inspection',
        explanation: 'Local OCR completed but no readable text was found in the image.',
        recommendation: 'Ensure the image contains clear, readable English text.',
        recommendations: ['Upload a clearer image.'],
        evidence: mapEvidenceToUi(['No readable text found via OCR'], 'LOW'),
        scamChain: mapScamChainToUi([]),
        technicalDetails: ['Local OCR: No text'],
        source: 'LOCAL',
        confidence: 90,
        titleSnippet: name,
      };
    }

    // Run the extracted text through the standard text pipeline
    const coreResult = await coordinator.analyzeText(extractedText);

    const verdict = mapVerdict(coreResult.severity, coreResult.riskScore);
    const category = mapCategory('MESSAGE', coreResult.severity, coreResult.evidence);
    
    // Prepend OCR evidence
    const combinedEvidence = ['Text extracted locally via WebAssembly OCR', ...coreResult.evidence];
    const uiEvidence = mapEvidenceToUi(combinedEvidence, coreResult.severity);
    const uiChain = mapScamChainToUi(coreResult.chainStages);

    const techIndicators = [
      `Model: MiniLM-L6 (INT8 ONNX in WASM)`,
      `OCR Engine: Tesseract.js (WASM)`,
      `Text ML Risk: ${(coreResult.textRisk !== null ? (coreResult.textRisk * 100).toFixed(2) + '%' : 'N/A')}`,
      `Heuristic Evidence Flags: ${coreResult.evidence.length}`,
      `Attack Chain Stages: ${coreResult.chainStages.length}`
    ];

    return {
      id: 'local-screenshot-' + Date.now(),
      timestamp: Date.now(),
      inputType: 'SCREENSHOT',
      originalInput: name,
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
      confidence: 95,
      titleSnippet: name,
      extractedText: extractedText // Include so UI can display it
    };
  }
}
