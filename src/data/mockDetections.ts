import { DetectionResult, ProtectionEvent } from '../types/detection';

export const DEMO_SCENARIOS: Record<string, DetectionResult> = {
  'bank-kyc': {
    id: 'demo-bank-kyc',
    inputType: 'message',
    originalInput: 'URGENT: Your HDFC Bank account is temporarily blocked due to pending KYC update. Verify immediately via http://hdfc-kyc-verify-portal.net/update or your account will be suspended within 24 hours. OTP: 8492.',
    riskScore: 94,
    severity: 'CRITICAL',
    verdict: 'SCAM',
    confidence: 99,
    category: 'Phishing / Impersonation',
    titleSnippet: 'Urgent Bank KYC Suspension Alert',
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    explanation: 'Someone is pretending to be your bank and trying to make you panic. They want you to click a fake link so they can steal your login details and OTP code.',
    technicalDetails: [
      'Typosquatted domain mismatch (hdfc-kyc-verify-portal.net vs hdfcbank.com)',
      'High-urgency artificial time constraint (24-hour suspension threat)',
      'Credential harvesting form signatures detected in linked target',
      'One-Time Password (OTP) solicitation pattern'
    ],
    evidence: [
      {
        type: 'IMPERSIONATION',
        title: 'Banking Brand Impersonation',
        description: 'Claims to represent your bank to establish false trust.',
        severity: 'CRITICAL'
      },
      {
        type: 'URGENCY',
        title: 'Extreme Pressure & Time Limit',
        description: 'Pressures you to act immediately to avoid account blocking.',
        severity: 'HIGH'
      },
      {
        type: 'CREDENTIAL_REQUEST',
        title: 'Credential Harvesting',
        description: 'Attempts to obtain your account login credentials.',
        severity: 'CRITICAL'
      },
      {
        type: 'OTP_RISK',
        title: 'OTP Theft Attempt',
        description: 'Asks for a One-Time Password to authorize unauthorized transactions.',
        severity: 'CRITICAL'
      },
      {
        type: 'SUSPICIOUS_LINK',
        title: 'Deceptive Link',
        description: 'The link does not match the official financial institution website.',
        severity: 'CRITICAL'
      }
    ],
    scamChain: [
      { type: 'IMPERSONATION', title: '1. Impersonation', description: 'Attacker poses as a trusted financial institution.', detected: true },
      { type: 'URGENCY', title: '2. Urgency & Fear', description: 'Creates panic over account suspension.', detected: true },
      { type: 'MALICIOUS_LINK', title: '3. Fake Link', description: 'Provides a deceptive URL mimicking official portals.', detected: true },
      { type: 'CREDENTIAL_THEFT', title: '4. Credential Theft', description: 'Collects login IDs, PINs, and personal details.', detected: true },
      { type: 'OTP_THEFT', title: '5. OTP Theft', description: 'Steals OTP codes to finalize fraudulent transfers.', detected: true }
    ],
    recommendation: 'Do not click the link or reply. Call your bank using the official number on your debit card or statement if you are concerned.'
  },
  'courier-delivery': {
    id: 'demo-courier',
    inputType: 'message',
    originalInput: 'FedEx: Your package delivery failed because of incorrect address details. Pay $2.99 customs fee to reschedule delivery at https://fedex-express-update-track.com/parcel',
    riskScore: 82,
    severity: 'HIGH',
    verdict: 'SCAM',
    confidence: 96,
    category: 'Delivery Fraud',
    titleSnippet: 'FedEx Delivery Fee Scam',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    explanation: 'Scammers are exploiting online shopping expectations by claiming your package delivery is stuck, asking for a tiny fee to steal your credit card details.',
    technicalDetails: [
      'Courier brand spoofing pattern',
      'Small nominal fee bait ($2.99) designed for credit card scraping',
      'Non-official tracking domain'
    ],
    evidence: [
      {
        type: 'IMPERSIONATION',
        title: 'Courier Brand Spoofing',
        description: 'Pretends to be FedEx to exploit expected package deliveries.',
        severity: 'HIGH'
      },
      {
        type: 'SMALL_FEE_TRAP',
        title: 'Small Payment Request',
        description: 'Asks for a trivial customs fee to harvest credit card details.',
        severity: 'HIGH'
      },
      {
        type: 'SUSPICIOUS_LINK',
        title: 'Deceptive Tracking URL',
        description: 'Uses a non-official subdomain designed to steal payment card data.',
        severity: 'CRITICAL'
      }
    ],
    scamChain: [
      { type: 'IMPERSONATION', title: '1. Impersonation', description: 'Poses as a major shipping courier.', detected: true },
      { type: 'FEAR_OF_LOSS', title: '2. Package Retention', description: 'Claims delivery is stalled indefinitely.', detected: true },
      { type: 'MALICIOUS_LINK', title: '3. Phishing Checkout', description: 'Redirects to a fake payment gateway.', detected: true },
      { type: 'CARD_THEFT', title: '4. Card Harvesting', description: 'Steals credit card numbers and CVV codes.', detected: true }
    ],
    recommendation: 'Do not click the link or enter credit card info. Check tracking status inside the official courier app.'
  },
  'job-offer': {
    id: 'demo-job-offer',
    inputType: 'message',
    originalInput: 'Congratulations! You have been selected for a Work From Home Data Entry job earning $55/hr. No experience needed. Contact our HR manager on WhatsApp: +1 (555) 019-2834 to start immediately.',
    riskScore: 78,
    severity: 'HIGH',
    verdict: 'SUSPICIOUS',
    confidence: 91,
    category: 'Employment Scam',
    titleSnippet: 'Work From Home Data Entry Scam',
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    explanation: 'An unrealistic job offer designed to lure you into communicating via untraceable messaging apps before asking for upfront training fees.',
    technicalDetails: [
      'Too-good-to-be-true hourly salary ($55/hr for unskilled work)',
      'Off-platform communication redirection (WhatsApp shift)',
      'Known task-scam initial hook pattern'
    ],
    evidence: [
      {
        type: 'UNREALISTIC_PROMISE',
        title: 'Unrealistic Pay',
        description: 'Offers exceptionally high pay for minimal unskilled work.',
        severity: 'HIGH'
      },
      {
        type: 'OFF_PLATFORM',
        title: 'Messaging App Diversion',
        description: 'Diverts professional hiring to personal messaging apps.',
        severity: 'MEDIUM'
      }
    ],
    scamChain: [
      { type: 'LURE', title: '1. High Income Bait', description: 'Lures victims with easy remote earnings.', detected: true },
      { type: 'DIVERSION', title: '2. WhatsApp Shift', description: 'Moves chat to untraceable messaging apps.', detected: true },
      { type: 'UPFRONT_FEE', title: '3. Deposit Trap', description: 'Demands fees or crypto deposits to unlock tasks.', detected: false }
    ],
    recommendation: 'Ignore the message. Legitimate employers never charge candidates money to get hired or require communication exclusively through WhatsApp.'
  },
  'lottery-reward': {
    id: 'demo-lottery',
    inputType: 'message',
    originalInput: 'WINNER! Your mobile number won $500,000 in the Global Telecom Sweepstakes 2026! Claim your prize now by sending your full name, ID copy, and a $25 processing fee to claimswin@secure-prize-dept.com',
    riskScore: 91,
    severity: 'CRITICAL',
    verdict: 'SCAM',
    confidence: 98,
    category: 'Advance Fee Fraud',
    titleSnippet: 'Global Sweepstakes & Prize Scam',
    timestamp: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
    explanation: 'A classic advance-fee lottery scam. You cannot win a prize you never entered. They want your identity documents and processing fees.',
    technicalDetails: [
      'Unsolicited sweepstakes win notification',
      'Advance fee fraud requirement ($25 processing fee)',
      'Identity theft document harvesting request'
    ],
    evidence: [
      {
        type: 'UNSOLICITED_WIN',
        title: 'Unsolicited Prize Claim',
        description: 'Claims you won a lottery or sweepstakes you never entered.',
        severity: 'CRITICAL'
      },
      {
        type: 'ADVANCE_FEE',
        title: 'Advance Fee Fraud',
        description: 'Requires a processing fee before releasing winnings.',
        severity: 'HIGH'
      },
      {
        type: 'IDENTITY_THEFT',
        title: 'ID Document Request',
        description: 'Demands copies of your government ID for fraud.',
        severity: 'CRITICAL'
      }
    ],
    scamChain: [
      { type: 'LURE', title: '1. False Prize', description: 'Manufactures excitement over massive winnings.', detected: true },
      { type: 'FEE_DEMAND', title: '2. Advance Fee', description: 'Asks for processing fees or wire transfers.', detected: true },
      { type: 'IDENTITY_HARVEST', title: '3. Identity Theft', description: 'Harvests ID documents for fraudulent accounts.', detected: true }
    ],
    recommendation: 'Do not respond, send money, or share identity documents. Block the sender immediately.'
  },
  'otp-scam': {
    id: 'demo-otp-scam',
    inputType: 'message',
    originalInput: 'Alert: Someone is trying to access your PayPal wallet from IP 192.168.4.12. If this was NOT you, reply immediately with the 6-digit OTP code sent to your phone to secure your account.',
    riskScore: 95,
    severity: 'CRITICAL',
    verdict: 'SCAM',
    confidence: 99,
    category: 'OTP Theft',
    titleSnippet: 'PayPal Unauthorized Access Alert',
    timestamp: new Date(Date.now() - 1000 * 60 * 400).toISOString(),
    explanation: 'An attacker is trying to trick you into handing over your security verification code so they can log into your account and steal your funds.',
    technicalDetails: [
      'Direct OTP harvesting prompt via reply message',
      'Artificial fear induction using fake unauthorized IP address',
      'Impersonation of payment gateway security'
    ],
    evidence: [
      {
        type: 'OTP_SOLICITATION',
        title: 'OTP Theft Request',
        description: 'Directly asks for your security code over text message.',
        severity: 'CRITICAL'
      },
      {
        type: 'FEAR_TACTIC',
        title: 'Unauthorized Access Panic',
        description: 'Fabricates security breaches to force quick compliance.',
        severity: 'CRITICAL'
      }
    ],
    scamChain: [
      { type: 'ALERT', title: '1. Fake Breach Alert', description: 'Scares victim with unauthorized login claims.', detected: true },
      { type: 'OTP_DEMAND', title: '2. OTP Demand', description: 'Tricks victim into replying with security code.', detected: true },
      { type: 'ACCOUNT_TAKEOVER', title: '3. Account Takeover', description: 'Attacker accesses financial account.', detected: true }
    ],
    recommendation: 'Never share your OTP with anyone, even if they claim to be company support. Legitimate companies never ask for your OTP.'
  },
  'payment-scam': {
    id: 'demo-payment-scam',
    inputType: 'message',
    originalInput: 'Zelle Payment Notification: You received a pending transfer of $450.00 from John Doe. To accept payment, login and verify your debit card at https://zelle-quick-secure-claim.com/accept',
    riskScore: 89,
    severity: 'CRITICAL',
    verdict: 'SCAM',
    confidence: 97,
    category: 'Payment Phishing',
    titleSnippet: 'Zelle Pending Transfer Phishing',
    timestamp: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
    explanation: 'A fake payment notification designed to make you think money is waiting for you, driving you to a phishing site to steal your banking credentials.',
    technicalDetails: [
      'Zelle brand spoofing',
      'Typosquatted phishing domain (zelle-quick-secure-claim.com)',
      'Debit card harvest trap'
    ],
    evidence: [
      {
        type: 'PAYMENT_BAIT',
        title: 'Pending Transfer Bait',
        description: 'Pretends money is waiting for you to encourage clicking.',
        severity: 'HIGH'
      },
      {
        type: 'PHISHING_LINK',
        title: 'Deceptive Claim Link',
        description: 'Redirects to a fake portal harvesting debit card and banking login details.',
        severity: 'CRITICAL'
      }
    ],
    scamChain: [
      { type: 'LURE', title: '1. Pending Funds', description: 'Creates anticipation of incoming money.', detected: true },
      { type: 'MALICIOUS_LINK', title: '2. Phishing Portal', description: 'Sends victim to fake banking login page.', detected: true },
      { type: 'CREDENTIAL_THEFT', title: '3. Bank Compromise', description: 'Steals account access and card data.', detected: true }
    ],
    recommendation: 'Check your official banking app directly. Do not click external links claiming to accept transfers.'
  },
  'safe-bank': {
    id: 'demo-safe-bank',
    inputType: 'message',
    originalInput: 'Alert: Your Chase debit card ending in 4921 was used for a $14.50 purchase at Starbucks on Oct 7. If this was you, no action needed. To lock card, open the official Chase Mobile App.',
    riskScore: 8,
    severity: 'SAFE',
    verdict: 'SAFE',
    confidence: 97,
    category: 'Bank Alert',
    titleSnippet: 'Chase Fraud Alert Notification',
    timestamp: new Date(Date.now() - 1000 * 60 * 1200).toISOString(),
    explanation: 'This is a legitimate transaction notification. It includes your specific card ending digits and directs you to your official banking app without links.',
    technicalDetails: [
      'Standard transaction notification format',
      'No external links or URLs included',
      'Directs user to official mobile app'
    ],
    evidence: [
      {
        type: 'VERIFIED_SENDER',
        title: 'Legitimate Notice Pattern',
        description: 'Provides specific card last 4 digits without urgent threats or links.',
        severity: 'SAFE'
      }
    ],
    scamChain: [
      { type: 'ALERT', title: '1. Transaction Notice', description: 'Standard security notification.', detected: true },
      { type: 'SAFE_ACTION', title: '2. Official App Guidance', description: 'Recommends checking official banking app.', detected: true }
    ],
    recommendation: 'Your transaction is normal. You can safely ignore or review in your banking app.'
  },
  'safe-delivery': {
    id: 'demo-safe-delivery',
    inputType: 'message',
    originalInput: 'Amazon.com Update: Your package containing "Wireless Earbuds" has been delivered to your front porch. Track or rate your delivery in Your Orders.',
    riskScore: 16,
    severity: 'LOW',
    verdict: 'SAFE',
    confidence: 95,
    category: 'Delivery Notice',
    titleSnippet: 'Amazon Package Delivery Confirmation',
    timestamp: new Date(Date.now() - 1000 * 60 * 2000).toISOString(),
    explanation: 'This message matches normal automated delivery notifications from online retailers with no pressure tactics or suspicious URLs.',
    technicalDetails: [
      'Standard delivery receipt',
      'No requests for payment, fees, or passwords'
    ],
    evidence: [
      {
        type: 'STANDARD_NOTIFICATION',
        title: 'Standard Delivery Receipt',
        description: 'Confirms completed delivery without requesting fees or sensitive details.',
        severity: 'SAFE'
      }
    ],
    scamChain: [
      { type: 'DELIVERY', title: '1. Package Drop', description: 'Standard order status update.', detected: true }
    ],
    recommendation: 'Enjoy your purchase! You can check your account orders directly if needed.'
  }
};

export const DEMO_URLS: Record<string, DetectionResult> = {
  'phishing-login': {
    id: 'demo-url-phish',
    inputType: 'url',
    originalInput: 'https://secure-login-apple-id-verify.com/auth/signin',
    riskScore: 96,
    severity: 'CRITICAL',
    verdict: 'SCAM',
    confidence: 99,
    category: 'Phishing Domain',
    titleSnippet: 'Apple ID Phishing Login Portal',
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    explanation: 'This URL is a fraudulent phishing site mimicking Apple. Entering your credentials here will instantly compromise your cloud account and devices.',
    technicalDetails: [
      'Typosquatted domain (secure-login-apple-id-verify.com)',
      'Unauthorized credential collection portal',
      'SSL certificate issued by untrusted authority'
    ],
    evidence: [
      {
        type: 'TYPOSQUATTING',
        title: 'Typosquatted Domain',
        description: 'Uses hyphenated subdomains to impersonate Apple.',
        severity: 'CRITICAL'
      },
      {
        type: 'CREDENTIAL_HARVEST',
        title: 'Fake Authentication Form',
        description: 'Hosted on an unverified third-party server designed to capture passwords.',
        severity: 'CRITICAL'
      }
    ],
    scamChain: [
      { type: 'DECEPTION', title: '1. Deceptive Domain', description: 'Imitates official brand domain.', detected: true },
      { type: 'HARVEST', title: '2. Credential Capture', description: 'Steals account login credentials.', detected: true }
    ],
    recommendation: 'Close this tab immediately. Never enter account passwords on sites reached via unverified links.'
  },
  'safe-site': {
    id: 'demo-url-safe',
    inputType: 'url',
    originalInput: 'https://github.com/settings/security',
    riskScore: 3,
    severity: 'SAFE',
    verdict: 'SAFE',
    confidence: 99,
    category: 'Verified Domain',
    titleSnippet: 'GitHub Official Security Settings',
    timestamp: new Date(Date.now() - 1000 * 60 * 500).toISOString(),
    explanation: 'This URL points to an authentic, verified domain with valid security certificates and no known malicious signatures.',
    technicalDetails: [
      'Official verified domain (github.com)',
      'Valid EV SSL certificate',
      'Trusted reputation'
    ],
    evidence: [
      {
        type: 'VALID_DOMAIN',
        title: 'Verified Official Domain',
        description: 'Belongs to github.com with valid TLS security certificates.',
        severity: 'SAFE'
      }
    ],
    scamChain: [
      { type: 'LEGIT', title: '1. Verified Site', description: 'Recognized legitimate domain.', detected: true }
    ],
    recommendation: 'This link is safe to visit.'
  }
};

export const INITIAL_PROTECTION_EVENTS: ProtectionEvent[] = [
  {
    id: 'evt-1',
    title: 'Blocked suspicious URL',
    description: 'Prevented navigation to known phishing domain secure-login-apple-id-verify.com',
    severity: 'CRITICAL',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    isSimulated: true
  },
  {
    id: 'evt-2',
    title: 'Detected phishing message',
    description: 'Flagged fake bank KYC SMS containing credential harvesting indicators',
    severity: 'HIGH',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    isSimulated: true
  },
  {
    id: 'evt-3',
    title: 'Suspicious payment request detected',
    description: 'Identified fake Zelle transfer notification',
    severity: 'HIGH',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    isSimulated: true
  }
];
