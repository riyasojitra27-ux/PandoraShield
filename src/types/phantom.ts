export interface PhantomProfile {
  id: string;
  name: string;
  label: string;
  avatar: string;
  username: string;
  workplace: string;
  locationPhoto: {
    filename: string;
    gpsCoordinates: string;
    locationName: string;
  };
  travelAnnouncement: string;
  sharedDocument: {
    filename: string;
    accessLevel: string;
  };
}

export interface PhantomPrivacyControls {
  profilePrivate: boolean;
  stripExif: boolean;
  hideWorkplace: boolean;
  removeTravelPost: boolean;
  restrictDocSharing: boolean;
}

export type PhantomRiskCategory =
  | 'PHYSICAL_SECURITY'
  | 'SPEAR_PHISHING'
  | 'OSINT_PROFILING'
  | 'DATA_LEAKAGE';

export interface PhantomFinding {
  id: string;
  category: PhantomRiskCategory;
  categoryLabel: string;
  title: string;
  triggerInfo: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  whyItMatters: string;
  recommendation: string;
  mitigatedBy: keyof PhantomPrivacyControls;
  isCombination?: boolean;
}

export interface PhantomSimulationResult {
  beforeScore: number; // 0 (safe) - 100 (critical exposure)
  afterScore: number;
  reductionPercentage: number;
  totalRisks: number;
  remainingRisks: number;
  mitigatedCount: number;
  allFindings: PhantomFinding[];
  activeFindings: PhantomFinding[];
  mitigatedFindings: PhantomFinding[];
}
