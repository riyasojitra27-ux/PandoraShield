import { DetectionCoordinator } from './DetectionCoordinator';
import { DetectionResult } from '../model/DetectionResult';
import { TextModel, OnnxTextModel } from '../../ml/text/OnnxTextModel';
import { UrlModel, PhishScoutUrlModel } from '../../ml/url/PhishScoutUrlModel';
import { EvidenceEngine, LocalEvidenceEngine } from '../evidence/LocalEvidenceEngine';
import { ScamChainEngine, LocalScamChainEngine } from '../chain/LocalScamChainEngine';
import { ThreatIntelRepository, LocalThreatIntelRepository } from '../threatintel/LocalThreatIntelRepository';
import { RiskEngine, LocalRiskEngine } from '../risk/LocalRiskEngine';
import { ExplanationGenerator } from '../explanation/ExplanationGenerator';

export class LocalDetectionCoordinator implements DetectionCoordinator {
  private textModel: TextModel;
  private urlModel: UrlModel;
  private evidenceEngine: EvidenceEngine;
  private scamChainEngine: ScamChainEngine;
  private threatIntelRepository: ThreatIntelRepository;
  private riskEngine: RiskEngine;

  constructor(
    textModel: TextModel = new OnnxTextModel(),
    urlModel: UrlModel = new PhishScoutUrlModel(),
    evidenceEngine: EvidenceEngine = new LocalEvidenceEngine(),
    scamChainEngine: ScamChainEngine = new LocalScamChainEngine(),
    threatIntelRepository: ThreatIntelRepository = new LocalThreatIntelRepository(),
    riskEngine: RiskEngine = new LocalRiskEngine()
  ) {
    this.textModel = textModel;
    this.urlModel = urlModel;
    this.evidenceEngine = evidenceEngine;
    this.scamChainEngine = scamChainEngine;
    this.threatIntelRepository = threatIntelRepository;
    this.riskEngine = riskEngine;
  }

  async analyzeText(text: string): Promise<DetectionResult> {
    const trimmed = text.trim();
    if (trimmed.length === 0) {
      throw new Error('Input text cannot be empty');
    }

    const textRisk = await this.textModel.predict(trimmed);
    const evidence = this.evidenceEngine.analyzeText(trimmed);
    const chainStages = this.scamChainEngine.generate(evidence);
    const threatIntelEntry = await this.threatIntelRepository.lookup(trimmed);
    const threatIntelMatch = threatIntelEntry !== null;

    const assessment = this.riskEngine.calculate(
      textRisk,
      null,
      threatIntelMatch,
      evidence,
      chainStages
    );

    const explanation = ExplanationGenerator.generateExplanation(assessment.severity, evidence);
    const recommendation = ExplanationGenerator.generateRecommendation(assessment.severity);

    return {
      riskScore: assessment.riskScore,
      severity: assessment.severity,
      scanType: 'MESSAGE',
      textRisk,
      urlRisk: null,
      threatIntelMatch,
      evidence,
      chainStages,
      explanation,
      recommendation,
    };
  }

  async analyzeUrl(url: string): Promise<DetectionResult> {
    const trimmed = url.trim();
    if (trimmed.length === 0) {
      throw new Error('URL cannot be empty');
    }

    const urlRisk = await this.urlModel.predict(trimmed);
    const evidence = this.evidenceEngine.analyzeUrl(trimmed);
    const chainStages = this.scamChainEngine.generate(evidence);
    const threatIntelEntry = await this.threatIntelRepository.lookup(trimmed);
    const threatIntelMatch = threatIntelEntry !== null;

    const assessment = this.riskEngine.calculate(
      null,
      urlRisk,
      threatIntelMatch,
      evidence,
      chainStages
    );

    const explanation = ExplanationGenerator.generateExplanation(assessment.severity, evidence);
    const recommendation = ExplanationGenerator.generateRecommendation(assessment.severity);

    return {
      riskScore: assessment.riskScore,
      severity: assessment.severity,
      scanType: 'URL',
      textRisk: null,
      urlRisk,
      threatIntelMatch,
      evidence,
      chainStages,
      explanation,
      recommendation,
    };
  }
}
