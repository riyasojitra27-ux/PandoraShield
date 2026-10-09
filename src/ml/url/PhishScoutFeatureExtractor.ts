export class PhishScoutFeatureExtractor {
  private static readonly SUSPICIOUS_KEYWORDS = [
    'login', 'signin', 'verify', 'verification', 'secure', 'security', 'account',
    'update', 'confirm', 'banking', 'password', 'webscr', 'delivery', 'invoice',
    'wallet', 'authenticate', 'unlock', 'recover', 'suspended', 'limited', 'alert',
    'dispute', 'refund', 'billing', 'bonus', 'prize', 'lottery', 'free'
  ];

  private static readonly BRANDS = [
    'paypal', 'apple', 'icloud', 'microsoft', 'office365', 'outlook', 'google',
    'gmail', 'amazon', 'netflix', 'facebook', 'instagram', 'whatsapp', 'chase',
    'wellsfargo', 'citibank', 'bankofamerica', 'hsbc', 'barclays', 'amex',
    'americanexpress', 'visa', 'mastercard', 'coinbase', 'binance', 'steam',
    'spotify', 'dropbox', 'dhl', 'fedex', 'usps', 'ups', 'payoneer'
  ];

  private static readonly SENSITIVE_EXTENSIONS = [
    '.exe', '.scr', '.apk', '.zip', '.jar', '.bat', '.cmd', '.js', '.docm'
  ];

  private static readonly TRUSTED_TLDS = new Set([
    '.com', '.org', '.net', '.edu', '.gov', '.mil', '.int'
  ]);

  private static readonly MULTI_PART_SUFFIXES = [
    'ngrok.io', 'co.uk', 'org.uk', 'gov.uk', 'ac.uk', 'co.in', 'net.in', 'org.in',
    'gen.in', 'com.au', 'net.au', 'org.au', 'edu.au', 'gov.au', 'co.nz', 'net.nz',
    'co.jp', 'ne.jp', 'com.br', 'net.br', 'com.mx', 'co.za', 'com.sg'
  ];

  private static countOccurrences(str: string, sub: string): number {
    if (!sub || !str) return 0;
    let count = 0;
    let idx = 0;
    while (true) {
      const next = str.indexOf(sub, idx);
      if (next === -1) break;
      count++;
      idx = next + sub.length;
    }
    return count;
  }

  private static computeEntropy(s: string): number {
    if (!s || s.length === 0) return 0;
    const len = s.length;
    const freq = new Map<string, number>();
    for (let i = 0; i < len; i++) {
      const c = s[i];
      freq.set(c, (freq.get(c) || 0) + 1);
    }
    let ent = 0.0;
    for (const count of freq.values()) {
      const p = count / len;
      ent -= p * Math.log2(p);
    }
    return ent;
  }

  private static extractTld(host: string): string {
    if (!host) return '';
    const lowerHost = host.toLowerCase();
    for (const suffix of this.MULTI_PART_SUFFIXES) {
      if (lowerHost === suffix || lowerHost.endsWith('.' + suffix)) {
        return suffix;
      }
    }
    const lastDot = lowerHost.lastIndexOf('.');
    if (lastDot !== -1 && lastDot < lowerHost.length - 1) {
      return lowerHost.substring(lastDot + 1);
    }
    return '';
  }

  /**
   * Extracts the exact 35 URL features in the strict verified order expected by PhishScout.
   */
  static extract(urlRaw: string): Float32Array {
    const rawTrimmed = urlRaw.trim();
    const url = rawTrimmed.toLowerCase();
    const hasProto = url.startsWith('http://') || url.startsWith('https://');
    const full = hasProto ? url : `http://${url}`;

    const withoutScheme = full.substring(full.indexOf('://') + 3);
    const hostPart = withoutScheme.split('/')[0].split('?')[0].split('#')[0];
    const host = hostPart.split(':')[0];

    const hasSlash = withoutScheme.includes('/');
    const afterHost = hasSlash ? withoutScheme.substring(withoutScheme.indexOf('/')) : '';
    const path = afterHost ? afterHost.split('?')[0].split('#')[0] : '';
    const query = full.includes('?') ? full.substring(full.indexOf('?') + 1).split('#')[0] : '';
    const netloc = hostPart;

    const features = new Float32Array(35);

    // 0: url_length
    features[0] = full.length;

    // 1: hyphen_count
    features[1] = (url.match(/-/g) || []).length;

    // 2: digit_count
    features[2] = (url.match(/\d/g) || []).length;

    // 3: subdomain_count
    const hostLabels = host.length > 0 ? host.split('.') : [];
    features[3] = Math.max(0, hostLabels.length - 2);

    // 4: protocol_exists
    features[4] = /^https?:\/\/.*/i.test(rawTrimmed) ? 1.0 : 0.0;

    // 5: special_char_count: @-_.,;:#~!$&'()*+/:=?
    const specialChars = "@-_.,;:#~!$&'()*+/:=?";
    let specCount = 0;
    for (let i = 0; i < url.length; i++) {
      if (specialChars.includes(url[i])) specCount++;
    }
    features[5] = specCount;

    // 6: entropy
    features[6] = this.computeEntropy(full);

    // 7: path_depth
    features[7] = path.split('/').filter(p => p.length > 0).length;

    // 8: domain_length
    features[8] = host.length;

    // 9: is_domain_ip
    features[9] = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host) ? 1.0 : 0.0;

    // 10: has_at_symbol
    features[10] = url.includes('@') ? 1.0 : 0.0;

    // 11: has_double_slash_redirect
    let dslashCount = 0;
    let dIdx = 0;
    while ((dIdx = url.indexOf('//', dIdx)) !== -1) {
      dslashCount++;
      dIdx += 2;
    }
    features[11] = dslashCount > 1 ? 1.0 : 0.0;

    // 12: tld_length & 13: trusted_tld
    const tld = this.extractTld(host);
    features[12] = tld.length;
    features[13] = tld.length > 0 && this.TRUSTED_TLDS.has('.' + tld) ? 1.0 : 0.0;

    // 14: query_param_count
    features[14] = query.length > 0 ? query.split('&').length : 0.0;

    // 15: path_length
    features[15] = path.length;

    // 16: keyword_count
    let kwCount = 0;
    for (const kw of this.SUSPICIOUS_KEYWORDS) {
      let kIdx = 0;
      while ((kIdx = url.indexOf(kw, kIdx)) !== -1) {
        kwCount++;
        kIdx += kw.length;
      }
    }
    features[16] = kwCount;

    // 17: brand_in_host, 18: brand_in_path, 19: brand_count
    let hostBrands = 0;
    let pathBrands = 0;
    for (const b of this.BRANDS) {
      if (host.includes(b)) hostBrands++;
      if (path.includes(b)) pathBrands++;
    }
    features[17] = hostBrands > 0 ? 1.0 : 0.0;
    features[18] = pathBrands > 0 ? 1.0 : 0.0;
    features[19] = hostBrands + pathBrands;

    // 20: has_punycode
    features[20] = host.includes('xn--') ? 1.0 : 0.0;

    // 21: has_nonstandard_port
    features[21] = /:(?!80|443)(\d+)/.test(netloc) ? 1.0 : 0.0;

    // 22: percent_encoding_count
    features[22] = (url.match(/%/g) || []).length;

    // 23: has_hex_ip
    features[23] = /0x[0-9a-f]{1,8}/.test(url) ? 1.0 : 0.0;

    // 24: uppercase_ratio (rounded to 4 decimal places)
    let upperCount = 0;
    for (let i = 0; i < rawTrimmed.length; i++) {
      if (rawTrimmed[i] >= 'A' && rawTrimmed[i] <= 'Z') upperCount++;
    }
    features[24] = rawTrimmed.length === 0 ? 0.0 : Math.round((upperCount / rawTrimmed.length) * 10000) / 10000;

    // 25: www_count
    let wwwCount = 0;
    let wIdx = 0;
    while ((wIdx = url.indexOf('www.', wIdx)) !== -1) {
      wwwCount++;
      wIdx += 4;
    }
    features[25] = wwwCount;

    // 26: max_digit_run
    const digitRuns = (url.match(/\d+/g) || []).map(d => d.length);
    features[26] = digitRuns.length > 0 ? Math.max(...digitRuns) : 0.0;

    // 27: max_label_len
    features[27] = hostLabels.length > 0 ? Math.max(...hostLabels.map(l => l.length)) : 0.0;

    // 28: host_label_count
    features[28] = hostLabels.length;

    // 29: has_domain_in_path
    features[29] = /\/[a-z0-9-]+\.[a-z]{2,}\//.test(path) ? 1.0 : 0.0;

    // 30: query_length
    features[30] = query.length;

    // 31: equals_count
    features[31] = (query.match(/=/g) || []).length;

    // 32: sensitive_extension
    features[32] = this.SENSITIVE_EXTENSIONS.some(ext => url.endsWith(ext)) ? 1.0 : 0.0;

    // 33: has_multiple_tlds
    const tldMatches = url.match(/\.[a-z]{2,}\//g) || [];
    features[33] = tldMatches.length > 1 ? 1.0 : 0.0;

    // 34: consecutive_punct
    features[34] = /[@_.:;,]{3,}/.test(url) ? 1.0 : 0.0;

    return features;
  }
}
