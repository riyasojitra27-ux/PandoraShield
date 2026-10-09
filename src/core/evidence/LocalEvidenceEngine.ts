export interface EvidenceEngine {
  analyzeText(text: string): string[];
  analyzeUrl(url: string): string[];
}

export class LocalEvidenceEngine implements EvidenceEngine {
  analyzeText(text: string): string[] {
    const evidenceList: string[] = [];
    const lowerText = text.toLowerCase();

    if (
      lowerText.includes('urgent') ||
      lowerText.includes('immediately') ||
      lowerText.includes('action required') ||
      lowerText.includes('within 24 hours')
    ) {
      evidenceList.push('Urgency language detected');
    }

    if (
      lowerText.includes('otp') ||
      lowerText.includes('one time password') ||
      lowerText.includes('verification code')
    ) {
      evidenceList.push('Request for OTP detected');
    }

    if (
      lowerText.includes('password') ||
      lowerText.includes('login') ||
      lowerText.includes('credentials') ||
      lowerText.includes('sign in')
    ) {
      evidenceList.push('Credential request detected');
    }

    if (
      lowerText.includes('pay') ||
      lowerText.includes('payment') ||
      lowerText.includes('invoice') ||
      lowerText.includes('transfer') ||
      lowerText.includes('bank account')
    ) {
      evidenceList.push('Suspicious payment request');
    }

    if (
      lowerText.includes('bank') ||
      lowerText.includes('support') ||
      lowerText.includes('admin') ||
      lowerText.includes('official')
    ) {
      evidenceList.push('Potential impersonation indicator');
    }

    if (
      lowerText.includes('won') ||
      lowerText.includes('lottery') ||
      lowerText.includes('prize') ||
      lowerText.includes('claim your reward') ||
      lowerText.includes('free gift')
    ) {
      evidenceList.push('Reward/lottery language detected');
    }

    if (
      lowerText.includes('suspend') ||
      lowerText.includes('block') ||
      lowerText.includes('terminate') ||
      lowerText.includes('unauthorized access')
    ) {
      evidenceList.push('Threatening/fear language detected');
    }

    if (
      lowerText.includes('security alert') ||
      lowerText.includes('account verification') ||
      lowerText.includes('verify your account')
    ) {
      evidenceList.push('Suspicious account/security claims detected');
    }

    return evidenceList;
  }

  analyzeUrl(url: string): string[] {
    const evidenceList: string[] = [];
    const lowerUrl = url.toLowerCase();

    const withoutProtocol = lowerUrl.replace(/^https?:\/\//, '');
    const domainAndPath = withoutProtocol.split('/', 2);
    const domain = domainAndPath[0] || '';

    // IP-address host instead of normal domain
    const ipRegex = /^([0-9]{1,3}\.){3}[0-9]{1,3}(:[0-9]{1,5})?$/;
    if (ipRegex.test(domain)) {
      evidenceList.push('IP-address host detected instead of normal domain');
    }

    // Excessive subdomains
    if (domain.split('.').length > 4) {
      evidenceList.push('Excessive subdomains detected');
    }

    // Suspicious encoding
    if (lowerUrl.includes('%') && (lowerUrl.match(/%/g) || []).length > 3) {
      evidenceList.push('Suspicious excessive URL encoding detected');
    }

    // Unusual URL length
    if (url.length > 150) {
      evidenceList.push('Unusual URL length detected');
    }

    // Suspicious keywords in URL
    if (
      lowerUrl.includes('login') ||
      lowerUrl.includes('verify') ||
      lowerUrl.includes('secure') ||
      lowerUrl.includes('update') ||
      lowerUrl.includes('account') ||
      lowerUrl.includes('billing')
    ) {
      evidenceList.push('Suspicious keywords detected in URL path or domain');
    }

    if (domain.includes('-') && (domain.match(/-/g) || []).length > 2) {
      evidenceList.push('Suspicious domain structure with multiple hyphens');
    }

    return evidenceList;
  }
}
