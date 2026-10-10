import { PhantomProfile, PhantomPrivacyControls, PhantomFinding, PhantomSimulationResult } from '../types/phantom';

export const DEFAULT_PRESETS: PhantomProfile[] = [
  {
    id: 'tech_pro',
    name: 'Alex Rivera',
    label: 'Tech Professional',
    avatar: '👨‍💻',
    username: 'alex_rivera99',
    workplace: 'Senior Engineer at FinTech Corp (Stanford Alum)',
    locationPhoto: {
      filename: 'home_office_setup.jpg',
      gpsCoordinates: '37.7749° N, 122.4194° W',
      locationName: 'San Francisco, CA (Home Residence)',
    },
    travelAnnouncement: 'Heading to Tokyo for 14 days starting tomorrow! ✈️🇯🇵',
    sharedDocument: {
      filename: 'Q3_Tax_And_Banking_Summary.pdf',
      accessLevel: 'Anyone with link can view (Public Link)',
    },
  },
  {
    id: 'frequent_traveler',
    name: 'Jordan Lee',
    label: 'Travel Creator',
    avatar: '✈️',
    username: '@jordan_explores',
    workplace: 'Digital Nomad / Freelance Photographer',
    locationPhoto: {
      filename: 'baloon_ride.jpg',
      gpsCoordinates: '36.8848° N, 30.7050° E',
      locationName: 'Antalya, Turkey',
    },
    travelAnnouncement: 'Off on a 3-week backpacking trip across SE Asia! Home locked up tight 🔒',
    sharedDocument: {
      filename: 'Passport_Scan_And_Insurance.pdf',
      accessLevel: 'Public Web Searchable',
    },
  },
  {
    id: 'student_jobseeker',
    name: 'Sam Chen',
    label: 'Student / Job Seeker',
    avatar: '🎓',
    username: 'samchen_2026',
    workplace: 'CS Senior at State University',
    locationPhoto: {
      filename: 'campus_dorm_desk.jpg',
      gpsCoordinates: '40.7128° N, 74.0060° W',
      locationName: 'Campus Housing Block B',
    },
    travelAnnouncement: 'Home for winter break! Dorm will be empty until Jan 15th 🎉',
    sharedDocument: {
      filename: 'Resume_With_SSN_And_Address.pdf',
      accessLevel: 'Anyone with link can view',
    },
  },
];

export const INITIAL_CONTROLS: PhantomPrivacyControls = {
  profilePrivate: false,
  stripExif: false,
  hideWorkplace: false,
  removeTravelPost: false,
  restrictDocSharing: false,
};

export function evaluatePhantomExposure(
  profile: PhantomProfile,
  controls: PhantomPrivacyControls
): PhantomSimulationResult {
  const allFindings: PhantomFinding[] = [];

  // Finding 1: Public Travel Announcement + Location Metadata Combination
  if (profile.travelAnnouncement) {
    allFindings.push({
      id: 'f_travel_burglary',
      category: 'PHYSICAL_SECURITY',
      categoryLabel: 'Physical Security & Burglary Risk',
      title: 'Public Vacancy Alert (Physical Burglary Risk)',
      triggerInfo: `Post: "${profile.travelAnnouncement}" + Photo Location: "${profile.locationPhoto.locationName}"`,
      severity: 'CRITICAL',
      whyItMatters:
        'Broadcasting that you are away combined with residential GPS coordinates alerts physical intruders that your home is unoccupied.',
      recommendation:
        'Delete public travel announcements until you return home and strip GPS metadata from uploaded photos.',
      mitigatedBy: 'removeTravelPost',
      isCombination: true,
    });
  }

  // Finding 2: Reused Public Username + Workplace Info Combination
  if (profile.username && profile.workplace) {
    allFindings.push({
      id: 'f_spear_phishing',
      category: 'SPEAR_PHISHING',
      categoryLabel: 'Spear-Phishing & Social Engineering',
      title: 'Corporate Impersonation & Targeted Spear-Phishing',
      triggerInfo: `Handle: "${profile.username}" + Employer: "${profile.workplace}"`,
      severity: 'HIGH',
      whyItMatters:
        'Reusing a handle across platforms with employer details lets scammers cross-reference your LinkedIn/GitHub to craft ultra-convincing CEO/HR phishing scams.',
      recommendation:
        'Hide employer details on public social accounts and use separate handles for professional vs personal platforms.',
      mitigatedBy: 'hideWorkplace',
      isCombination: true,
    });
  }

  // Finding 3: Photo EXIF GPS Metadata
  if (profile.locationPhoto?.gpsCoordinates) {
    allFindings.push({
      id: 'f_exif_gps',
      category: 'OSINT_PROFILING',
      categoryLabel: 'OSINT Location Tracking',
      title: 'Exact Residential GPS Metadata Exposure',
      triggerInfo: `Embedded EXIF GPS: ${profile.locationPhoto.gpsCoordinates} (${profile.locationPhoto.filename})`,
      severity: 'HIGH',
      whyItMatters:
        'Digital photos often contain hidden EXIF metadata revealing your exact latitude and longitude, allowing anyone to pinpoint your home or work.',
      recommendation:
        'Enable automatic EXIF metadata stripping in your camera settings or privacy software before uploading images online.',
      mitigatedBy: 'stripExif',
    });
  }

  // Finding 4: Shared Sensitive Document
  if (profile.sharedDocument?.accessLevel) {
    allFindings.push({
      id: 'f_doc_leak',
      category: 'DATA_LEAKAGE',
      categoryLabel: 'Sensitive Document Exposure',
      title: 'Unrestricted Public Access to Confidential File',
      triggerInfo: `File: "${profile.sharedDocument.filename}" (${profile.sharedDocument.accessLevel})`,
      severity: 'CRITICAL',
      whyItMatters:
        'Publicly shared links indexed by search engines can expose tax numbers, financial summaries, or identity scans to automated web crawlers.',
      recommendation:
        'Change document sharing settings from "Anyone with link" to explicit email invites with expiration dates.',
      mitigatedBy: 'restrictDocSharing',
    });
  }

  // Finding 5: Public Social Profile Cross-Referencing
  if (profile.username) {
    allFindings.push({
      id: 'f_osint_scraping',
      category: 'OSINT_PROFILING',
      categoryLabel: 'Digital Footprint Aggregation',
      title: 'Public OSINT Profile Scraping & Doxxing',
      triggerInfo: `Public Handle: "${profile.username}"`,
      severity: 'MEDIUM',
      whyItMatters:
        'Automated OSINT tools scrape public profiles to assemble detailed dossiers on your daily routines, contacts, and personal preferences.',
      recommendation:
        'Switch personal profiles to Private mode to prevent automated web crawlers from indexing your activity.',
      mitigatedBy: 'profilePrivate',
    });
  }

  // Calculate BEFORE score (inherent risk of profile without controls)
  const totalPossibleRisk = 100;
  const severityWeights = { CRITICAL: 28, HIGH: 22, MEDIUM: 14, LOW: 8 };
  
  const beforeScore = Math.min(
    95,
    Math.max(
      45,
      allFindings.reduce((acc, f) => acc + severityWeights[f.severity], 0)
    )
  );

  // Filter active vs mitigated findings based on current privacy controls
  const activeFindings = allFindings.filter((f) => !controls[f.mitigatedBy]);
  const mitigatedFindings = allFindings.filter((f) => controls[f.mitigatedBy]);

  const activeRiskPoints = activeFindings.reduce(
    (acc, f) => acc + severityWeights[f.severity],
    0
  );

  const afterScore = activeFindings.length === 0
    ? 5
    : Math.min(beforeScore, Math.max(10, Math.round((activeRiskPoints / (beforeScore * 0.9)) * beforeScore)));

  const reductionPercentage = Math.round(
    ((beforeScore - afterScore) / beforeScore) * 100
  );

  return {
    beforeScore,
    afterScore,
    reductionPercentage: Math.max(0, reductionPercentage),
    totalRisks: allFindings.length,
    remainingRisks: activeFindings.length,
    mitigatedCount: mitigatedFindings.length,
    allFindings,
    activeFindings,
    mitigatedFindings,
  };
}
