export type UserRole = "Citizen" | "Volunteer" | "Authority";

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  location: string;
  smsAlertsEnabled: boolean;
  isSignedIn: boolean;
}

export type SeverityLevel = 1 | 2 | 3;
export type SeverityLevelLabel = "Level 1 Safe" | "Level 2 Warning" | "Level 3 Critical";

export interface TelemetryStats {
  rainfallIntensity: number; // mm/hr
  initialWaterLevel: number; // meters
  drainage: number; // drainage capacity in % (0 - 100%)
  inflow: number; // m3/s
  outflow: number; // m3/s
  netAccumulation?: number; // m3/s
  severityLevel?: SeverityLevel;
  severityLabel?: SeverityLevelLabel;
}

export interface SeverityMeasure {
  id: string;
  category: "Immediate Safety" | "Property & Utilities" | "Evacuation & Routes" | "Supplies & Health";
  title: string;
  instruction: string;
  priority: "High" | "Critical" | "Standard";
  iconName: string;
}

export interface RegionTelemetry {
  id: string;
  name: string;
  elevationMeters: number;
  currentWaterDepth: number; // in meters
  rainfallRate: number; // mm/hr
  drainageCapacity: number; // 0 - 100%
  inflowRate: number; // m3/s
  outflowRate: number; // m3/s
  severityLevel: SeverityLevel;
  riskFactor: "Low" | "Medium" | "High" | "Catastrophic";
  description: string;
  vulnerablePoints: string[];
}

export interface DrainageNode {
  id: string;
  name: string;
  type: "catchment" | "basin" | "canal" | "culvert" | "riverbank" | "outfall";
  elevation: number;
  capacityLPS: number; // Liters per second
  currentWaterLevel: number; // 0 to 100%
  isClogged: boolean;
  connectedTo: string[]; // Node IDs downstream
  status: "normal" | "warning" | "overflow";
}

export interface CommunityReport {
  id: string;
  authorName: string;
  authorRole: UserRole;
  location: string;
  severityLevel: SeverityLevel;
  waterDepthCm: number;
  hazardType: "Road Submerged" | "Drainage Blocked" | "Power Line Down" | "Stranded Persons" | "Structural Risk" | "General Warning";
  description: string;
  timestamp: string;
  verifiedCount: number;
  hasUserVerified?: boolean;
  urgentHelpRequested: boolean;
}

export interface DonationPackage {
  id: string;
  amount: number;
  title: string;
  impactDesc: string;
  suppliesProvided: string;
}

export interface DonationReceipt {
  transactionId: string;
  donorName: string;
  amount: number;
  currency: string;
  date: string;
  cause: string;
  taxExemptId: string;
}

export interface GovernmentAuthority {
  agencyName: string;
  jurisdiction: string;
  role: string;
  hotline: string;
  alternativePhone: string;
  emergencyEmail: string;
  operatingHours: string;
  hqLocation: string;
}

export type SimulationScenarioKey = "normal" | "heavy" | "drainage_failure";

export interface SimulationScenario {
  id: SimulationScenarioKey;
  title: string;
  tagline: string;
  rainfallIntensity: number; // mm/hr
  waterLevel: number; // meters
  drainageCapacity: number; // %
  inflow: number; // m3/s
  outflow: number; // m3/s
  channelBlockagePercent: number; // % culvert blocked
  timeToSubmergenceMin: number; // minutes before street level flooding
  runoffCoefficient: number; // 0.0 to 1.0
  floodVelocityMs: number; // meters per second
  inundationRisk: "Low / Negligible" | "High / Severe" | "Extreme / Catastrophic";
  colorHex: string;
  description: string;
  physicalPhenomena: string[];
}

export interface AffectedPopulationData {
  districtName: string;
  stateName: string;
  totalDistrictPopulation: number;
  // Current active scenario numbers
  estimatedAffected: number;
  percentageOfDistrict: number;
  childrenAtRisk: number;
  seniorsAtRisk: number;
  displacedHouseholds: number;
  pregnantAndInfants: number;
  farmersAndLivestockHolders: number;
  // Infrastructure at risk
  submergedRoadwaysKm: number;
  healthcareClinicsAtRisk: number;
  drinkingWaterPumpsRisk: number;
  submergedElectricalGrids: number;
  designatedSheltersAvailable: number;
  // Scenario comparison numbers
  scenarioBreakdown: {
    normalAffected: number;
    heavyAffected: number;
    drainageFailureAffected: number;
  };
}
