import { ScamStage } from '../model/DetectionResult';

export interface ScamChainEngine {
  generate(evidence: string[]): ScamStage[];
}

export class LocalScamChainEngine implements ScamChainEngine {
  generate(evidence: string[]): ScamStage[] {
    const stages: ScamStage[] = [];

    for (const item of evidence) {
      const lowerItem = item.toLowerCase();
      if (lowerItem.includes('impersonation') || lowerItem.includes('grandparent')) {
        stages.push('IMPERSONATION');
      } else if (lowerItem.includes('urgency')) {
        stages.push('URGENCY');
      } else if (lowerItem.includes('fear') || lowerItem.includes('threat') || lowerItem.includes('legal action') || lowerItem.includes('arrest')) {
        stages.push('FEAR');
      } else if (lowerItem.includes('reward') || lowerItem.includes('lottery')) {
        stages.push('REWARD_BAIT');
      } else if (
        lowerItem.includes('link') ||
        lowerItem.includes('url') ||
        lowerItem.includes('domain') ||
        lowerItem.includes('host')
      ) {
        stages.push('MALICIOUS_LINK');
      } else if (lowerItem.includes('credential')) {
        stages.push('CREDENTIAL_HARVEST');
      } else if (lowerItem.includes('otp')) {
        stages.push('OTP_HARVEST');
      } else if (lowerItem.includes('payment') || lowerItem.includes('cryptocurrency') || lowerItem.includes('bitcoin')) {
        stages.push('PAYMENT_REQUEST');
      } else if (lowerItem.includes('data')) {
        stages.push('DATA_THEFT');
      } else if (lowerItem.includes('account') || lowerItem.includes('security claims')) {
        stages.push('PHISHING');
      }
    }

    return Array.from(new Set(stages));
  }
}
