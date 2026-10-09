import { DetectionEngine } from './DetectionEngine';
import { DetectionResult, DetectionEvidence, ScamChainStep, Severity } from '../types/detection';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() || null;

export class HybridDetectionEngine implements DetectionEngine {
  constructor(
    private localEngine: DetectionEngine,
    private backendEngine: DetectionEngine
  ) {}

  private mergeResults(local: DetectionResult, backend: DetectionResult): DetectionResult {
    const severityRanks: Record<Severity, number> = {
      SAFE: 0,
      LOW: 1,
      MEDIUM: 2,
      HIGH: 3,
      CRITICAL: 4
    };

    const localRank = severityRanks[local.severity] || 0;
    const backendRank = severityRanks[backend.severity] || 0;

    const chosenSeverity = backendRank > localRank ? backend.severity : local.severity;
    const chosenScore = Math.max(local.riskScore, backend.riskScore);

    const evidenceMap = new Map<string, DetectionEvidence>();
    local.evidence.forEach(e => evidenceMap.set(e.title.toLowerCase(), e));
    backend.evidence.forEach(e => evidenceMap.set(e.title.toLowerCase(), e));

    const chainMap = new Map<string, ScamChainStep>();
    local.scamChain.forEach(s => chainMap.set(s.stage || s.label || 'step', s));
    backend.scamChain.forEach(s => chainMap.set(s.stage || s.label || 'step', s));

    const backendRecs = backend.recommendations || [];
    const localRecs = local.recommendations || [];

    return {
      ...local,
      ...backend,
      riskScore: chosenScore,
      severity: chosenSeverity,
      evidence: Array.from(evidenceMap.values()),
      scamChain: Array.from(chainMap.values()),
      recommendations: backendRecs.length > 0 ? backendRecs : localRecs,
      technicalDetails: Array.isArray(local.technicalDetails) ? local.technicalDetails : ['Hybrid Threat Verification'],
      source: 'HYBRID'
    };

  }

  async analyzeText(text: string): Promise<DetectionResult> {
    const localResult = await this.localEngine.analyzeText(text);

    if (!API_BASE_URL) {
      return localResult;
    }

    try {
      const backendResult = await this.backendEngine.analyzeText(text);
      return this.mergeResults(localResult, backendResult);
    } catch {
      return localResult;
    }
  }

  async analyzeUrl(url: string): Promise<DetectionResult> {
    const localResult = await this.localEngine.analyzeUrl(url);

    if (!API_BASE_URL) {
      return localResult;
    }

    try {
      const backendResult = await this.backendEngine.analyzeUrl(url);
      return this.mergeResults(localResult, backendResult);
    } catch {
      return localResult;
    }
  }

  async analyzeScreenshot(image: Blob | File): Promise<DetectionResult> {
    const localResult = await this.localEngine.analyzeScreenshot(image);

    if (!API_BASE_URL) {
      return localResult;
    }

    try {
      const backendResult = await this.backendEngine.analyzeScreenshot(image);
      return this.mergeResults(localResult, backendResult);
    } catch {
      return localResult;
    }
  }
}
