import { ScamStage, Severity } from '../model/DetectionResult';

export interface RiskAssessment {
  riskScore: number;
  severity: Severity;
}

export interface RiskEngine {
  calculate(
    textRisk: number | null,
    urlRisk: number | null,
    threatIntelMatch: boolean,
    evidence: string[],
    chainStages: ScamStage[]
  ): RiskAssessment;
}

export class LocalRiskEngine implements RiskEngine {
  calculate(
    textRisk: number | null,
    urlRisk: number | null,
    threatIntelMatch: boolean,
    evidence: string[],
    chainStages: ScamStage[]
  ): RiskAssessment {
    let score = 0.0;

    // 1. Text ML Risk
    if (textRisk !== null && textRisk !== undefined) {
      score += textRisk * 40; // Up to 40 points
    }

    // 2. URL ML Risk
    if (urlRisk !== null && urlRisk !== undefined) {
      score += urlRisk * 30; // Up to 30 points
    }

    // 3. Local Threat Intelligence Match
    if (threatIntelMatch) {
      score += 25; // 25 points flat if threat intel match is found
    }

    // 4. Evidence count
    const evidencePoints = evidence.length * 5.0;
    score += Math.min(25.0, evidencePoints); // Up to 25 points from evidence

    // 5. ScamChain critical stages
    const criticalStages: Set<ScamStage> = new Set([
      'CREDENTIAL_HARVEST',
      'OTP_HARVEST',
      'PAYMENT_REQUEST',
      'MALICIOUS_LINK',
    ]);
    const highRiskStagesCount = chainStages.filter(s => criticalStages.has(s)).length;
    const chainPoints = highRiskStagesCount * 10.0;
    score += Math.min(20.0, chainPoints); // Up to 20 points from critical stages

    const finalScoreInt = Math.min(100, Math.max(0, Math.floor(score)));

    let severity: Severity;
    if (finalScoreInt <= 19) {
      severity = 'SAFE';
    } else if (finalScoreInt <= 39) {
      severity = 'LOW';
    } else if (finalScoreInt <= 59) {
      severity = 'MEDIUM';
    } else if (finalScoreInt <= 79) {
      severity = 'HIGH';
    } else {
      severity = 'CRITICAL';
    }

    return { riskScore: finalScoreInt, severity };
  }
}
