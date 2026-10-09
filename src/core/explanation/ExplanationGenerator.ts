import { Severity } from '../model/DetectionResult';

export class ExplanationGenerator {
  static generateExplanation(severity: Severity, evidence: string[]): string {
    if (evidence.length === 0) {
      return 'No suspicious indicators were detected in the analysis.';
    }

    let intro = '';
    switch (severity) {
      case 'SAFE':
        intro = 'This content appears safe, though minor indicators were noted:';
        break;
      case 'LOW':
        intro = 'This content requires caution due to the following indicators:';
        break;
      case 'MEDIUM':
        intro = 'This content is suspicious due to multiple indicators:';
        break;
      case 'HIGH':
        intro = 'This content is highly suspicious and likely malicious due to these indicators:';
        break;
      case 'CRITICAL':
        intro = 'This content is critical risk and exhibits clear attack patterns:';
        break;
    }

    const evidenceList = evidence.map(e => `• ${e}`).join('\n');
    return `${intro}\n${evidenceList}`;
  }

  static generateRecommendation(severity: Severity): string {
    switch (severity) {
      case 'SAFE':
        return 'No specific action is required, but always remain vigilant.';
      case 'LOW':
        return 'Some suspicious indicators were detected. Verify the sender before taking action.';
      case 'MEDIUM':
        return 'Multiple suspicious indicators were detected. Do not share sensitive information until the request is independently verified.';
      case 'HIGH':
        return 'Strong scam indicators were detected. Do not open suspicious links or provide credentials, OTPs, or payment information.';
      case 'CRITICAL':
        return 'Multiple high-risk indicators were detected. Do not interact with the message, link, OTP request, credentials request, or payment request. Verify through an official channel.';
    }
  }
}
