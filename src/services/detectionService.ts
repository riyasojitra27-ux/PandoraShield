/**
 * @file detectionService.ts
 * @description Centralized detection service entry point for PandoraShield.
 * All detection requests run locally in-browser via LocalDetectionCoordinator.
 */

import { DetectionResult, ProtectionEvent, Severity, Verdict } from '../types/detection';
import { DEMO_SCENARIOS, DEMO_URLS, INITIAL_PROTECTION_EVENTS } from '../data/mockDetections';
import { LocalDetectionEngine } from './LocalDetectionEngine';

const HISTORY_STORAGE_KEY = 'pandora_shield_history_v3';
const EVENTS_STORAGE_KEY = 'pandora_shield_events_v3';

const localEngine = new LocalDetectionEngine();

export function getInitialHistory(): DetectionResult[] {
  return [
    DEMO_SCENARIOS['bank-kyc'],
    DEMO_SCENARIOS['courier-delivery'],
    DEMO_SCENARIOS['job-offer'],
    DEMO_SCENARIOS['otp-scam'],
    DEMO_URLS['phishing-login'],
    DEMO_SCENARIOS['safe-bank'],
  ].map(s => ({
    id: s.id,
    timestamp: Date.now(),
    inputType: s.inputType === 'url' ? 'URL' : 'MESSAGE',
    originalInput: s.originalInput,
    riskScore: s.riskScore,
    severity: s.severity,
    verdict: s.verdict,
    category: s.category || 'Threat',
    explanation: s.explanation,
    evidence: s.evidence.map(e => ({ title: e.title, description: e.description, type: e.type, severity: e.severity })),
    scamChain: s.scamChain.map(sc => ({ stage: sc.type || '', label: sc.title || '', detected: sc.detected, description: sc.description })),
    recommendation: s.recommendation,
    recommendations: s.recommendation ? [s.recommendation] : [],
    technicalDetails: { model: 'PandoraShield Local', confidence: 0.95 },
    source: 'LOCAL',
    confidence: 95,
    titleSnippet: s.titleSnippet,
  }));
}

export function getStoredHistory(): DetectionResult[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (raw === null) {
      // Key doesn't exist yet — first run. Seed with demo data.
      const initial = getInitialHistory();
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    // Key exists (even if empty array — user cleared it intentionally). Return as-is.
    return JSON.parse(raw);
  } catch {
    return getInitialHistory();
  }
}

export function saveResultToHistory(result: DetectionResult): void {
  try {
    const history = getStoredHistory();
    const filtered = history.filter(item => item.id !== result.id && item.originalInput !== result.originalInput);
    const updated = [result, ...filtered];
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save scan history', err);
  }
}

export function clearStoredHistory(): void {
  try {
    // Write an explicit empty array instead of removing the key.
    // If the key is removed, getStoredHistory() will re-seed with demo data on the next call.
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify([]));
  } catch (err) {
    console.error('Failed to clear history', err);
  }
}

export function getStoredProtectionEvents(): ProtectionEvent[] {
  try {
    const raw = localStorage.getItem(EVENTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(INITIAL_PROTECTION_EVENTS));
      return INITIAL_PROTECTION_EVENTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PROTECTION_EVENTS;
  }
}

export function addProtectionEvent(event: Omit<ProtectionEvent, 'id' | 'timestamp'>): ProtectionEvent {
  const events = getStoredProtectionEvents();
  const newEvt: ProtectionEvent = {
    ...event,
    id: 'evt-' + Date.now(),
    timestamp: new Date().toISOString(),
  };
  const updated = [newEvt, ...events];
  try {
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save protection event', err);
  }
  return newEvt;
}

export async function analyzeText(text: string): Promise<DetectionResult> {
  const result = await localEngine.analyzeText(text);
  saveResultToHistory(result);
  addProtectionEvent({
    title: `Detected ${result.category || 'Content Scan'}`,
    description: `Analyzed message "${result.titleSnippet || 'text input'}"`,
    severity: result.severity,
    isSimulated: false,
  });
  return result;
}

export async function analyzeUrl(url: string): Promise<DetectionResult> {
  const result = await localEngine.analyzeUrl(url);
  saveResultToHistory(result);
  addProtectionEvent({
    title: result.severity === 'SAFE' ? 'Verified safe link' : 'Flagged suspicious link',
    description: `Inspected domain "${result.titleSnippet || url}"`,
    severity: result.severity,
    isSimulated: false,
  });
  return result;
}

export async function analyzeScreenshot(image: Blob | File | string): Promise<DetectionResult> {
  const result = await localEngine.analyzeScreenshot(image);

  saveResultToHistory(result);
  addProtectionEvent({
    title: 'Analyzed screenshot',
    description: 'Inspected uploaded screenshot container locally',
    severity: result.severity,
    isSimulated: false,
  });
  return result;
}

export async function runSafetyCheck(actionType: string): Promise<DetectionResult> {
  let riskScore = 15;
  let verdict: Verdict = 'SAFE';
  let severity: Severity = 'SAFE';
  let explanation = 'This action appears safe based on local safety guidelines.';
  let recommendation = 'You may proceed with caution.';

  if (actionType.includes('link') || actionType.includes('APK') || actionType.includes('OTP')) {
    riskScore = 85;
    verdict = 'SCAM';
    severity = 'CRITICAL';
    explanation = 'Proceeding with this action carries a severe risk of account compromise or financial loss.';
    recommendation = 'Do not proceed. Verify through official channels before taking action.';
  } else if (actionType.includes('payment') || actionType.includes('personal')) {
    riskScore = 65;
    verdict = 'SUSPICIOUS';
    severity = 'HIGH';
    explanation = 'Sharing personal information or sending payments to unverified parties is risky.';
    recommendation = 'Confirm recipient identity through a trusted independent channel.';
  }

  const result: DetectionResult = {
    id: 'safety-' + Date.now(),
    timestamp: Date.now(),
    inputType: 'SAFETY_CHECK',
    originalInput: actionType,
    riskScore,
    severity,
    verdict,
    category: 'Safety Assessment',
    explanation,
    recommendation,
    recommendations: [recommendation],
    evidence: [
      {
        title: 'Intended Action Risk Analysis',
        description: explanation,
        severity,
      },
    ],
    scamChain: [
      { stage: 'EVAL', label: 'Intent Evaluation', detected: riskScore > 50, description: 'Assessed potential security consequences.' },
    ],
    technicalDetails: { model: 'PandoraShield Safety Engine' },
    source: 'LOCAL',
    titleSnippet: `Safety Check: ${actionType}`,
  };

  saveResultToHistory(result);
  return result;
}

export function simulateLiveProtectionEvent(): ProtectionEvent {
  const samples = [
    { title: 'Blocked malicious APK download', description: 'Prevented sideloading of trojanized banking app', severity: 'CRITICAL' as Severity },
    { title: 'Intercepted OTP phishing SMS', description: 'Detected automated credential harvester from unknown sender', severity: 'HIGH' as Severity },
    { title: 'Warning: Suspicious clipboard URL', description: 'Clipboard contained a flagged phishing redirect link', severity: 'MEDIUM' as Severity },
    { title: 'Safe link verified', description: 'Inspected and verified official google.com link', severity: 'SAFE' as Severity },
  ];
  const sample = samples[Math.floor(Math.random() * samples.length)];
  return addProtectionEvent({
    ...sample,
    isSimulated: true,
  });
}
