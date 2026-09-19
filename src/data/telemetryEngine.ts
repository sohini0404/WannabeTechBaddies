import { 
  SeverityLevel, 
  SeverityLevelLabel, 
  TelemetryStats, 
  SimulationScenario, 
  SimulationScenarioKey, 
  AffectedPopulationData 
} from "../types";

export interface FloodCalculationResult {
  level: SeverityLevel;
  levelLabel: SeverityLevelLabel;
  riskScore: number; // 0 - 100
  netAccumulation: number; // m3/s surplus
  color: string;
  badgeBg: string;
  borderColor: string;
  explanation: string;
}

/**
 * Calculates flood severity level (Level 1 Safe, Level 2 Warning, Level 3 Critical)
 * based on the 5 key hydrological metrics:
 * 1. rainfallIntensity: Rainfall intensity in mm/hr
 * 2. initialWaterLevel: Initial river/water gauge depth in meters
 * 3. drainage: Stormwater/river drainage capacity in % (0 - 100%)
 * 4. inflow: Upstream inflow rate in m³/s
 * 5. outflow: Sluice/downstream discharge rate in m³/s
 */
export function calculateFloodSeverity(stats: {
  rainfallIntensity: number;
  initialWaterLevel: number;
  drainage: number;
  inflow: number;
  outflow: number;
}): FloodCalculationResult {
  const rainfall = Math.max(0, stats.rainfallIntensity);
  const waterLevel = Math.max(0, stats.initialWaterLevel);
  const drainageCap = Math.min(100, Math.max(5, stats.drainage));
  const inflowRate = Math.max(0, stats.inflow);
  const outflowRate = Math.max(0, stats.outflow);

  // Net inflow surplus/deficit (m³/s)
  const netInflow = inflowRate - outflowRate;

  // Hydrological Risk Index computation (0 to 100)
  // - Initial Water Level (0 - 3m+): weight ~30%
  const levelPoints = Math.min(30, (waterLevel / 2.5) * 30);

  // - Rainfall Intensity (0 - 200 mm/hr): weight ~25%
  const rainPoints = Math.min(25, (rainfall / 150) * 25);

  // - Inflow vs Outflow Surplus: weight ~25%
  let flowPoints = 0;
  if (netInflow > 0) {
    const ratio = inflowRate > 0 ? netInflow / inflowRate : 0;
    flowPoints = Math.min(25, ratio * 25);
  } else {
    // Healthy outflow relieves pressure
    flowPoints = -Math.min(10, Math.abs(netInflow) / (outflowRate || 1) * 8);
  }

  // - Drainage Deficiency (100% is safe, 20% is choked): weight ~20%
  const drainagePoints = ((100 - drainageCap) / 100) * 20;

  let totalScore = Math.round(levelPoints + rainPoints + flowPoints + drainagePoints);
  totalScore = Math.max(5, Math.min(99, totalScore));

  // Determine Level 1 Safe, Level 2 Warning, Level 3 Critical
  if (totalScore >= 64 || waterLevel >= 1.5 || (rainfall >= 120 && netInflow > 30)) {
    return {
      level: 3,
      levelLabel: "Level 3 Critical",
      riskScore: totalScore,
      netAccumulation: Number(netInflow.toFixed(1)),
      color: "#DC2626", // Red
      badgeBg: "#FEF2F2",
      borderColor: "#FECACA",
      explanation: "Severe hydrological surplus: Catchment inflow and intense rainfall heavily surpass drainage and discharge capacity. Critical inundation alert."
    };
  } else if (totalScore >= 38 || waterLevel >= 0.75 || rainfall >= 75 || netInflow > 0) {
    return {
      level: 2,
      levelLabel: "Level 2 Warning",
      riskScore: totalScore,
      netAccumulation: Number(netInflow.toFixed(1)),
      color: "#D97706", // Amber
      badgeBg: "#FFFBEA",
      borderColor: "#FDE68A",
      explanation: "Elevated water accumulation: Strained urban drains and positive net inflow create moderate flood danger for low-lying ground floors."
    };
  } else {
    return {
      level: 1,
      levelLabel: "Level 1 Safe",
      riskScore: totalScore,
      netAccumulation: Number(netInflow.toFixed(1)),
      color: "#16A34A", // Green
      badgeBg: "#F2FBF4",
      borderColor: "#B7E4C7",
      explanation: "Hydrological equilibrium maintained: Outflow and municipal culverts are discharging precipitation efficiently with low submersion risk."
    };
  }
}

export interface DistrictTelemetryData {
  name: string;
  rainfallIntensity: number; // mm/hr
  initialWaterLevel: number; // meters
  drainage: number; // %
  inflow: number; // m3/s
  outflow: number; // m3/s
  netAccumulation: number; // m3/s
  severityLevel: SeverityLevel;
  severityLabel: SeverityLevelLabel;
  riskScore: number;
  status: string;
  vulnerablePoint: string;
}

export function getDistrictTelemetry(district: {
  name: string;
  severityLevel: 1 | 2 | 3;
  waterDepthMeters?: number;
  initialWaterLevel?: number;
  rainfallRate?: number;
  rainfallIntensity?: number;
  drainage?: number;
  inflow?: number;
  outflow?: number;
  status?: string;
  vulnerablePoint?: string;
}): DistrictTelemetryData {
  const initialWaterLevel = district.initialWaterLevel ?? district.waterDepthMeters ?? (district.severityLevel === 3 ? 1.8 : district.severityLevel === 2 ? 0.8 : 0.35);
  const rainfallIntensity = district.rainfallIntensity ?? district.rainfallRate ?? (district.severityLevel === 3 ? 135 : district.severityLevel === 2 ? 85 : 50);
  
  // Realistic drainage capacity based on severity & urbanization
  let drainage = district.drainage;
  if (drainage === undefined) {
    drainage = district.severityLevel === 3 ? 28 : district.severityLevel === 2 ? 55 : 82;
  }

  // Realistic river/catchment inflow (m³/s)
  let inflow = district.inflow;
  if (inflow === undefined) {
    inflow = district.severityLevel === 3 
      ? Math.round(rainfallIntensity * 2.8 + initialWaterLevel * 45)
      : district.severityLevel === 2
      ? Math.round(rainfallIntensity * 1.8 + initialWaterLevel * 30)
      : Math.round(rainfallIntensity * 1.1 + initialWaterLevel * 20);
  }

  // Realistic sluice/river outflow (m³/s)
  let outflow = district.outflow;
  if (outflow === undefined) {
    outflow = district.severityLevel === 3
      ? Math.round(inflow * 0.55)
      : district.severityLevel === 2
      ? Math.round(inflow * 0.82)
      : Math.round(inflow * 1.15);
  }

  const result = calculateFloodSeverity({
    rainfallIntensity,
    initialWaterLevel,
    drainage,
    inflow,
    outflow
  });

  return {
    name: district.name,
    rainfallIntensity,
    initialWaterLevel,
    drainage,
    inflow,
    outflow,
    netAccumulation: result.netAccumulation,
    severityLevel: result.level,
    severityLabel: result.levelLabel,
    riskScore: result.riskScore,
    status: district.status || "Monitored Catchment Basin",
    vulnerablePoint: district.vulnerablePoint || "Low-lying embankment"
  };
}

export const SIMULATION_SCENARIOS: Record<SimulationScenarioKey, SimulationScenario> = {
  normal: {
    id: "normal",
    title: "Normal Rainfall Conditions",
    tagline: "Typical seasonal showers with fully functioning storm drains",
    rainfallIntensity: 28, // mm/hr
    waterLevel: 0.38, // meters
    drainageCapacity: 90, // %
    inflow: 115, // m3/s
    outflow: 130, // m3/s
    channelBlockagePercent: 5,
    timeToSubmergenceMin: 0, // No submergence
    runoffCoefficient: 0.22,
    floodVelocityMs: 0.3,
    inundationRisk: "Low / Negligible",
    colorHex: "#16A34A",
    description: "Standard monsoon showers within design limits. Storm channels, culverts, and barrages flow unobstructed. Water discharge exceeds inflow, preventing street stagnation.",
    physicalPhenomena: [
      "Smooth laminar flow in concrete storm drains and culverts",
      "Zero road surface pooling; catchbasins operating at 90% clearance",
      "Natural river embankment absorption buffer intact",
      "No backflow through municipal manholes or household sumps"
    ]
  },
  heavy: {
    id: "heavy",
    title: "Heavy Rainfall Scenario",
    tagline: "Intense torrential downpour pushing catchment channels to capacity",
    rainfallIntensity: 145, // mm/hr
    waterLevel: 1.85, // meters
    drainageCapacity: 52, // % (stressed)
    inflow: 530, // m3/s
    outflow: 310, // m3/s
    channelBlockagePercent: 25,
    timeToSubmergenceMin: 45,
    runoffCoefficient: 0.78,
    floodVelocityMs: 1.9,
    inundationRisk: "High / Severe",
    colorHex: "#D97706",
    description: "Cloudburst-scale downpour saturating soil runoff. The surge pushes river gauge heights past the warning threshold. Outflow sluices reach maximum release capacity, causing water to pool in low-elevation wards.",
    physicalPhenomena: [
      "Turbulent, fast-moving surface runoff exceeding secondary gutters",
      "Inflow surge (+220 m³/s surplus) causing riverbank cresting",
      "Ground floor submergence in designated low-elevation wards",
      "Erosion along unlined mud embankments and agricultural bunds"
    ]
  },
  drainage_failure: {
    id: "drainage_failure",
    title: "Drainage Failure & Blocked Channel",
    tagline: "Severe culvert siltation and choked trash racks triggering violent backwater",
    rainfallIntensity: 85, // mm/hr (even moderate rain causes disaster when drains fail!)
    waterLevel: 2.45, // meters
    drainageCapacity: 12, // % (88% choked!)
    inflow: 410, // m3/s
    outflow: 52, // m3/s
    channelBlockagePercent: 88,
    timeToSubmergenceMin: 18,
    runoffCoefficient: 0.94,
    floodVelocityMs: 2.8,
    inundationRisk: "Extreme / Catastrophic",
    colorHex: "#DC2626",
    description: "Silt, non-biodegradable debris, and silted culvert barrels choke stormwater outfalls. Discharge drops by nearly 90%, creating extreme hydraulic backpressure that erupts backward through city manholes.",
    physicalPhenomena: [
      "Severe culvert choke (88% cross-sectional blockage) by silt and plastic debris",
      "Violent hydraulic backwater head: water forces backward out of road manholes",
      "Rapid flash inundation: streets submerge under 1-2 meters in less than 20 minutes",
      "Electrical transformers submerged, causing widespread urban blackouts"
    ]
  }
};

/**
 * Calculates estimated affected population and vulnerable demographic breakdown
 * for a selected district under a specific simulation scenario.
 */
export function getAffectedPopulation(
  districtName: string,
  stateName: string,
  scenarioKey: SimulationScenarioKey,
  baseTelemetry?: DistrictTelemetryData
): AffectedPopulationData {
  // Deterministic seed based on district name characters
  let seed = 0;
  for (let i = 0; i < districtName.length; i++) {
    seed += districtName.charCodeAt(i);
  }

  // Typical Indian district population ranges from 600k to 2.4M (mean ~1.2M)
  const baseDistrictPopulation = 850000 + (seed % 950000);

  // Proportions affected under each scenario
  // Normal: ~0.05% - 0.15% (e.g. 400 - 1,500 people in transient depressions)
  const normalAffected = Math.round(baseDistrictPopulation * 0.0008);

  // Heavy Rainfall: ~5% - 9% of district in riverine/floodplain belts
  const heavyAffected = Math.round(baseDistrictPopulation * 0.065);

  // Drainage Failure: ~18% - 28% of district because failure hits dense urban wards & arterial basins
  const drainageFailureAffected = Math.round(baseDistrictPopulation * 0.22);

  let currentAffected = normalAffected;
  if (scenarioKey === "heavy") currentAffected = heavyAffected;
  if (scenarioKey === "drainage_failure") currentAffected = drainageFailureAffected;

  // Demographic breakdowns
  const childrenAtRisk = Math.round(currentAffected * 0.16); // <10 yrs
  const seniorsAtRisk = Math.round(currentAffected * 0.12); // >65 yrs
  const pregnantAndInfants = Math.round(currentAffected * 0.05);
  const displacedHouseholds = Math.round(currentAffected / 4.4);
  const farmersAndLivestockHolders = Math.round(currentAffected * 0.19);

  // Infrastructure metrics scaled by scenario
  let submergedRoadwaysKm = 3;
  let healthcareClinicsAtRisk = 0;
  let drinkingWaterPumpsRisk = 2;
  let submergedElectricalGrids = 0;
  let designatedSheltersAvailable = 32 + (seed % 18);

  if (scenarioKey === "heavy") {
    submergedRoadwaysKm = 42 + (seed % 28);
    healthcareClinicsAtRisk = 5 + (seed % 4);
    drinkingWaterPumpsRisk = 18 + (seed % 12);
    submergedElectricalGrids = 4 + (seed % 3);
  } else if (scenarioKey === "drainage_failure") {
    submergedRoadwaysKm = 115 + (seed % 45);
    healthcareClinicsAtRisk = 14 + (seed % 8);
    drinkingWaterPumpsRisk = 48 + (seed % 20);
    submergedElectricalGrids = 11 + (seed % 5);
  }

  const percentageOfDistrict = Number(((currentAffected / baseDistrictPopulation) * 100).toFixed(1));

  return {
    districtName,
    stateName,
    totalDistrictPopulation: baseDistrictPopulation,
    estimatedAffected: currentAffected,
    percentageOfDistrict,
    childrenAtRisk,
    seniorsAtRisk,
    displacedHouseholds,
    pregnantAndInfants,
    farmersAndLivestockHolders,
    submergedRoadwaysKm,
    healthcareClinicsAtRisk,
    drinkingWaterPumpsRisk,
    submergedElectricalGrids,
    designatedSheltersAvailable,
    scenarioBreakdown: {
      normalAffected,
      heavyAffected,
      drainageFailureAffected
    }
  };
}
