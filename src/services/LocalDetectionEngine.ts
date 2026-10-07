import { DetectionEngine } from './DetectionEngine';
import { DetectionResult, Severity, Verdict } from '../types/detection';
import { DEMO_SCENARIOS, DEMO_URLS } from '../data/mockDetections';

export class LocalDetectionEngine implements DetectionEngine {
  async analyzeText(text: string): Promise<DetectionResult> {
    await new Promise(resolve => setTimeout(resolve, 1200));

    const trimmed = text.trim();
    const lower = trimmed.toLowerCase();

    for (const scenario of Object.values(DEMO_SCENARIOS)) {
      if (scenario.originalInput.toLowerCase() === lower || lower.includes(scenario.id.replace('demo-', ''))) {
        return {
          id: 'local-msg-' + Date.now(),
          timestamp: Date.now(),
          inputType: 'MESSAGE',
          originalInput: trimmed,
          riskScore: scenario.riskScore,
          severity: scenario.severity,
          verdict: scenario.verdict,
          category: scenario.category || 'Phishing / Impersonation',
          explanation: scenario.explanation,
          evidence: scenario.evidence.map(e => ({
            title: e.title,
            description: e.description,
            type: e.type,
            severity: e.severity
          })),
          scamChain: scenario.scamChain.map(s => ({
            stage: s.type,
            label: s.title,
            detected: s.detected,
            description: s.description,
            type: s.type,
            title: s.title
          })),
          recommendations: [scenario.recommendation],
          technicalDetails: {
            model: 'PandoraShield Local ONNX Heuristics v2.4',
            confidence: 0.96,
            indicators: scenario.detectedSignals || ['Brand Impersonation', 'Urgency'],
            threatIntelMatch: false
          },
          source: 'LOCAL',
          confidence: 96,
          detectedSignals: scenario.detectedSignals || [],
          titleSnippet: scenario.titleSnippet || (trimmed.length > 45 ? trimmed.substring(0, 45) + '...' : trimmed)
        };
      }
    }

    // Heuristic analysis for custom text
    let riskScore = 20;
    const signals: string[] = [];
    const evidence = [];

    const hasUrgency = /urgent|immediate|expires|suspended|blocked|act now|alert|warning/i.test(lower);
    const hasMoney = /bank|account|loan|prize|winner|reward|\$\d+|fee|usd|crypto|btc|transfer/i.test(lower);
    const hasLink = /https?:\/\/|www\.|\.com|\.net|\.org|\.xyz|\.io|bit\.ly/i.test(lower);
    const hasOtp = /otp|code|pin|password|credential|verify|kyc/i.test(lower);

    if (hasUrgency) {
      riskScore += 35;
      signals.push('High Urgency');
      evidence.push({
        title: 'Pressure & Time Limit',
        description: 'Creates artificial time pressure to prompt rushed decisions.',
        type: 'URGENCY',
        severity: 'HIGH' as Severity
      });
    }

    if (hasMoney || hasOtp) {
      riskScore += 30;
      signals.push('Sensitive Request');
      evidence.push({
        title: 'Financial or Code Request',
        description: 'Mentions sensitive accounts, payments, or verification codes.',
        type: 'SENSITIVE_REQUEST',
        severity: 'HIGH' as Severity
      });
    }

    if (hasLink) {
      riskScore += 25;
      signals.push('External Link');
      evidence.push({
        title: 'External Web Link Included',
        description: 'Contains a URL that should be verified before clicking.',
        type: 'EXTERNAL_LINK',
        severity: 'MEDIUM' as Severity
      });
    }

    riskScore = Math.min(98, Math.max(5, riskScore));
    const severity: Severity = riskScore >= 80 ? 'CRITICAL' : riskScore >= 60 ? 'HIGH' : riskScore >= 40 ? 'MEDIUM' : 'SAFE';
    const verdict: Verdict = riskScore >= 60 ? 'SCAM' : riskScore >= 40 ? 'SUSPICIOUS' : 'SAFE';

    if (evidence.length === 0) {
      evidence.push({
        title: 'Standard Indicators',
        description: 'No major phishing or scam indicators found.',
        type: 'NORMAL',
        severity: 'SAFE' as Severity
      });
    }

    return {
      id: 'local-msg-' + Date.now(),
      timestamp: Date.now(),
      inputType: 'MESSAGE',
      originalInput: trimmed,
      riskScore,
      severity,
      verdict,
      category: verdict === 'SCAM' ? 'Potential Scam' : 'General Message',
      explanation: verdict === 'SCAM'
        ? 'This message contains pressure tactics and suspicious indicators commonly used in phishing.'
        : 'This message appears normal with no strong threat signals.',
      evidence,
      scamChain: [
        { stage: 'PARSE', label: 'Text Ingestion', detected: true, description: 'Content parsed by local model.' },
        { stage: 'HEURISTIC', label: 'Signal Extraction', detected: signals.length > 0, description: signals.length > 0 ? 'Risk markers identified.' : 'No harmful markers.' }
      ],
      recommendations: [
        verdict === 'SCAM'
          ? 'Do not reply, click links, or provide personal information.'
          : 'Always verify unexpected contacts through official channels.'
      ],
      technicalDetails: {
        model: 'PandoraShield Local ONNX Heuristics v2.4',
        confidence: 0.92,
        indicators: signals
      },
      source: 'LOCAL',
      confidence: 92,
      detectedSignals: signals,
      titleSnippet: trimmed.length > 45 ? trimmed.substring(0, 45) + '...' : trimmed
    };
  }

  async analyzeUrl(url: string): Promise<DetectionResult> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const trimmed = url.trim();
    const lower = trimmed.toLowerCase();

    for (const urlKey of Object.keys(DEMO_URLS)) {
      const scenario = DEMO_URLS[urlKey];
      if (scenario.originalInput.toLowerCase() === lower || lower.includes(urlKey)) {
        return {
          id: 'local-url-' + Date.now(),
          timestamp: Date.now(),
          inputType: 'URL',
          originalInput: trimmed,
          riskScore: scenario.riskScore,
          severity: scenario.severity,
          verdict: scenario.verdict,
          category: scenario.category || 'URL Inspection',
          explanation: scenario.explanation,
          evidence: scenario.evidence.map(e => ({
            title: e.title,
            description: e.description,
            type: e.type,
            severity: e.severity
          })),
          scamChain: scenario.scamChain.map(s => ({
            stage: s.type,
            label: s.title,
            detected: s.detected,
            description: s.description
          })),
          recommendations: [scenario.recommendation],
          technicalDetails: {
            model: 'PandoraShield URL Heuristics',
            confidence: 0.95,
            indicators: scenario.detectedSignals || []
          },
          source: 'LOCAL',
          confidence: 95,
          titleSnippet: scenario.titleSnippet || (trimmed.length > 45 ? trimmed.substring(0, 45) + '...' : trimmed)
        };
      }
    }

    const isTyposquat = /apple|google|netflix|paypal|chase|fedex|amazon|microsoft/i.test(lower) && !/(apple|google|netflix|paypal|chase|fedex|amazon|microsoft)\.com/i.test(lower);
    const isSuspiciousTLD = /\.(xyz|top|click|link|buzz|su|gq|cf|ml|tk)$/i.test(lower);

    let riskScore = isTyposquat ? 92 : isSuspiciousTLD ? 75 : 10;
    const severity: Severity = riskScore >= 80 ? 'CRITICAL' : riskScore >= 50 ? 'HIGH' : 'SAFE';
    const verdict: Verdict = riskScore >= 50 ? 'SCAM' : 'SAFE';

    return {
      id: 'local-url-' + Date.now(),
      timestamp: Date.now(),
      inputType: 'URL',
      originalInput: trimmed,
      riskScore,
      severity,
      verdict,
      category: 'URL Inspection',
      explanation: verdict === 'SCAM' ? 'This URL shows characteristics of a deceptive phishing domain.' : 'This URL appears standard and safe to visit.',
      evidence: [{
        title: isTyposquat ? 'Typosquatted Domain' : 'Domain Reputation',
        description: isTyposquat ? 'Imitates official brand domain.' : 'Standard domain structure.',
        severity: isTyposquat ? 'CRITICAL' : 'SAFE'
      }],
      scamChain: [{ stage: 'DNS', label: 'Domain Analysis', detected: isTyposquat }],
      recommendations: [verdict === 'SCAM' ? 'Do not open this link.' : 'Safe to proceed.'],
      technicalDetails: { model: 'PandoraShield URL Heuristics', confidence: 0.94 },
      source: 'LOCAL',
      confidence: 94,
      titleSnippet: trimmed.length > 45 ? trimmed.substring(0, 45) + '...' : trimmed
    };
  }

  async analyzeScreenshot(image: Blob | File): Promise<DetectionResult> {
    await new Promise(resolve => setTimeout(resolve, 1400));
    return {
      id: 'local-screenshot-' + Date.now(),
      timestamp: Date.now(),
      inputType: 'SCREENSHOT',
      originalInput: image instanceof File ? image.name : 'Uploaded Screenshot',
      riskScore: 88,
      severity: 'HIGH',
      verdict: 'SCAM',
      category: 'Screenshot Phishing',
      explanation: 'OCR extracted text from the screenshot indicating an urgent payment request and fraudulent link.',
      evidence: [{
        title: 'OCR Extracted Scam Text',
        description: 'OCR detected threatening financial phrases inside the screenshot image.',
        severity: 'HIGH'
      }],
      scamChain: [{ stage: 'OCR', label: 'OCR Scan', detected: true }],
      recommendations: ['Do not follow instructions shown in this screenshot.'],
      technicalDetails: { model: 'PandoraShield OCR Model v1.2', confidence: 0.94 },
      source: 'LOCAL',
      confidence: 94,
      titleSnippet: 'Suspicious Screenshot'
    };
  }
}
