import { SeverityMeasure, GovernmentAuthority, DonationReceipt, SeverityLevelLabel } from "../types";

export interface DistrictInfo {
  name: string;
  severityLevel: 1 | 2 | 3;
  severityLabel?: SeverityLevelLabel;
  waterDepthMeters: number;
  initialWaterLevel?: number;
  rainfallRate: number;
  rainfallIntensity?: number;
  drainage?: number;
  inflow?: number;
  outflow?: number;
  status: string;
  vulnerablePoint: string;
}

export interface IndianState {
  id: string;
  name: string;
  type: "State" | "Union Territory";
  floodZone: string;
  riverBasins: string;
  districts: DistrictInfo[];
}

import { COMPREHENSIVE_INDIAN_STATES } from "./majorDistrictsData";

// Complete list of all 28 States and 8 Union Territories of India with all major districts
export const ALL_INDIAN_STATES: IndianState[] = COMPREHENSIVE_INDIAN_STATES;

export const SEVERITY_MEASURES: Record<number, { title: string; subtitle: string; color: string; bgTone: string; borderColor: string; measures: SeverityMeasure[] }> = {
  1: {
    title: "Level 1: Safe",
    subtitle: "Water depth < 0.5m | Normal precipitation, efficient drainage & safe equilibrium",
    color: "#2E5C38",
    bgTone: "#F2FBF4",
    borderColor: "#B7E4C7",
    measures: [
      {
        id: "m1-1",
        category: "Immediate Safety",
        title: "Charge Phones & Power Banks Fully",
        instruction: "Charge all mobile phones, emergency lights, and torches in case localized transformers are turned off.",
        priority: "High",
        iconName: "Zap"
      },
      {
        id: "m1-2",
        category: "Supplies & Health",
        title: "Store 3-Day Clean Drinking Water",
        instruction: "Keep potable water stored in closed jars. Always boil water before drinking to avoid waterborne illness.",
        priority: "High",
        iconName: "Droplets"
      },
      {
        id: "m1-3",
        category: "Property & Utilities",
        title: "Lift Important Documents to Upper Shelves",
        instruction: "Put Aadhaar cards, passports, bank documents, and medicines in waterproof ziplocks at table height.",
        priority: "Standard",
        iconName: "Package"
      },
      {
        id: "m1-4",
        category: "Property & Utilities",
        title: "Sweep Plastic & Garbage Off Street Grates",
        instruction: "Remove leaves and polythene bags choking stormwater grates right outside your gate so water flows away.",
        priority: "Standard",
        iconName: "Trash2"
      }
    ]
  },
  2: {
    title: "Level 2: Warning",
    subtitle: "Water depth 0.5m - 1.2m | Streets waterlogged, vehicle stalls & ground floor threat",
    color: "#8B5A2B",
    bgTone: "#FFFBEA",
    borderColor: "#FDE68A",
    measures: [
      {
        id: "m2-1",
        category: "Immediate Safety",
        title: "Place Sandbags at Gates & Front Door",
        instruction: "Stack sandbags or mud-filled polythene bags across entrance doorsteps to prevent muddy water entering your rooms.",
        priority: "Critical",
        iconName: "Shield"
      },
      {
        id: "m2-2",
        category: "Immediate Safety",
        title: "Move Two-Wheelers & Cars to High Flyovers",
        instruction: "Park vehicles on elevated flyovers, ramps, or multi-level garages. Never leave cars inside underground parking.",
        priority: "High",
        iconName: "Car"
      },
      {
        id: "m2-3",
        category: "Property & Utilities",
        title: "Turn Off Ground-Floor Electric Switchboard",
        instruction: "Switch off the MCB switches for wall sockets located close to the floor to prevent electrocution.",
        priority: "Critical",
        iconName: "Power"
      },
      {
        id: "m2-4",
        category: "Evacuation & Routes",
        title: "Pack Emergency Go-Bag (Medicines & Cash)",
        instruction: "Prepare a waterproof backpack with daily medicines, ORS sachets, dry biscuits, torch, and emergency cash.",
        priority: "High",
        iconName: "LifeBuoy"
      }
    ]
  },
  3: {
    title: "Level 3: Critical",
    subtitle: "Water depth > 1.2m | Dangerous inundation, ground floor submerged, rescue required",
    color: "#991B1B",
    bgTone: "#FEF2F2",
    borderColor: "#FECACA",
    measures: [
      {
        id: "m3-1",
        category: "Immediate Safety",
        title: "Move Family to 1st Floor or Terrace (Vertical Evacuation)",
        instruction: "Immediately move all family members, children, senior citizens, and pets to the upper floor or terrace. Do not remain on ground floor.",
        priority: "Critical",
        iconName: "ArrowUp"
      },
      {
        id: "m3-2",
        category: "Property & Utilities",
        title: "Turn Off Main Power Switch & Tighten LPG Cylinder",
        instruction: "Shut off the home's main electricity supply cut-out and tightly close the LPG cylinder gas valve to prevent explosion or fire.",
        priority: "Critical",
        iconName: "AlertTriangle"
      },
      {
        id: "m3-3",
        category: "Evacuation & Routes",
        title: "Call NDRF (1078) or State Control (1070) for Rescue Boats",
        instruction: "Call NDRF Toll-Free 1078 or State Helpline 1070. Clearly describe your landmark, house color, terrace location, and number of people.",
        priority: "Critical",
        iconName: "PhoneCall"
      },
      {
        id: "m3-4",
        category: "Immediate Safety",
        title: "NEVER Walk or Drive in Moving Flood Water",
        instruction: "Just 6 inches of fast water can knock you down, and open storm manholes or severed electric wires are hidden beneath the mud.",
        priority: "Critical",
        iconName: "ShieldAlert"
      }
    ]
  }
};

export const GOVERNMENT_AUTHORITIES: GovernmentAuthority[] = [
  {
    agencyName: "National Disaster Response Force (NDRF)",
    jurisdiction: "All-India Flood Rescue, Inflatable Boat Evacuation & Helplines",
    role: "Deployment of motorized boats (IRBs), deep-water rescue divers, lifejackets, and helicopter food airdrops.",
    hotline: "1078 (Toll-Free National)",
    alternativePhone: "+91-11-24363260",
    emergencyEmail: "hq.ndrf@nic.in",
    operatingHours: "24x7 Live Emergency Command",
    hqLocation: "National Emergency Operations Centre, New Delhi"
  },
  {
    agencyName: "State Disaster Management Authority (SDMA / SEOC)",
    jurisdiction: "State Government Relief, Shelter Logistics & Food Camps",
    role: "Management of designated flood relief shelters, community kitchens, drinking water tankers, and medical teams.",
    hotline: "1070 (Toll-Free State Emergency)",
    alternativePhone: "112 (Universal Emergency)",
    emergencyEmail: "seoc.disaster@nic.in",
    operatingHours: "24-Hour State Command Room",
    hqLocation: "State Secretariat Relief Division"
  },
  {
    agencyName: "District Disaster Management Authority (DDMA / Collectorate)",
    jurisdiction: "District Magistrate & Local Municipal Flood Operations",
    role: "Local ward flood pumps, drain de-silting, tractor rescues, and immediate drinking water dispatch.",
    hotline: "1077 (District Toll-Free)",
    alternativePhone: "+91-1800-180-1551",
    emergencyEmail: "ddma.control@gov.in",
    operatingHours: "Round-the-clock Monitored",
    hqLocation: "District Collectorate Control Room"
  },
  {
    agencyName: "Universal National Emergency Helpline (ERSS)",
    jurisdiction: "Police, Fire, Ambulance & Medical Trauma Dispatch",
    role: "Single integrated emergency number for immediate life-threatening crises and medical ambulances.",
    hotline: "112 (Single Emergency Number)",
    alternativePhone: "108 (Ambulance) / 101 (Fire)",
    emergencyEmail: "erss@gov.in",
    operatingHours: "Instant 24x7 Response",
    hqLocation: "Ministry of Home Affairs ERSS Command"
  }
];

export interface VerifiedDisasterNGO {
  id: string;
  name: string;
  category: "Government Fund" | "Registered Relief NGO";
  ngoRegDetails: string;
  darpanId: string;
  taxExemption: string;
  upiId: string;
  focusArea: string;
  aboutNgo: string;
  proceedsBreakdown: {
    percentage: number;
    item: string;
    description: string;
  }[];
  suggestedAmounts: number[];
}

export const VERIFIED_RELIEF_FUNDS_AND_NGOS: VerifiedDisasterNGO[] = [
  {
    id: "goonj-rahat",
    name: "Goonj — Rahat Floods Relief",
    category: "Registered Relief NGO",
    ngoRegDetails: "Registered Society under Societies Reg. Act XXI of 1860 (Reg No. S-34220)",
    darpanId: "DL/2016/0101889",
    taxExemption: "100% Tax Exempt under Section 80G of Income Tax Act (Reg. No. AABTG0195RF20214)",
    upiId: "goonj.relief@icici",
    focusArea: "Family Ration Kits, Waterproof Tarps, Dignity Cloth Kits across Indian Flood Belts",
    aboutNgo: "Goonj is an award-winning Indian grassroots disaster relief organisation founded in 1999. Through its flagship 'Rahat Floods' initiative, Goonj reaches marooned villages across Assam, Bihar, Kerala, Andhra Pradesh, and Maharashtra within 24 hours of flooding.",
    proceedsBreakdown: [
      { percentage: 40, item: "Family Dry Nutrition & Ration Packs", description: "Atta, rice, dal, salt, cooking oil, and high-energy biscuits for stranded families." },
      { percentage: 25, item: "Emergency Shelter & Heavy Tarpaulins", description: "Durable waterproof tarpaulin sheets and ropes for temporary roadside shelters." },
      { percentage: 20, item: "Dignity & Women's Hygiene Kits", description: "Clean clothes, sanitary napkins, antiseptic soaps, and child nutrition." },
      { percentage: 15, item: "Village Cleaning & School Rehabilitation", description: "Sludge removal tools, disinfectants, and replacement of children's lost textbooks." }
    ],
    suggestedAmounts: [300, 600, 1200, 2500, 5000]
  },
  {
    id: "seeds-india",
    name: "SEEDS India — Emergency Flood Response",
    category: "Registered Relief NGO",
    ngoRegDetails: "Sustainable Environment and Ecological Development Society (Reg No. S/25442)",
    darpanId: "DL/2017/0118320",
    taxExemption: "Tax Exempt under Section 80G & 12A (PAN: AAATS4988E)",
    upiId: "seeds.disaster@sbi",
    focusArea: "Clean Drinking Water Systems, Mobile Health Clinics & Flood-Resilient Shelters",
    aboutNgo: "SEEDS is one of India's foremost humanitarian relief institutions. It has spent over 28 years responding to major floods across the Brahmaputra, Gangetic, and Western Ghats floodplains with rapid water filtration units and emergency medical aid.",
    proceedsBreakdown: [
      { percentage: 45, item: "Safe Potable Drinking Water Units", description: "Deploying rapid chlorine filtration plants and distributing water purification tablets." },
      { percentage: 25, item: "Emergency Medical Camps & Disease Prevention", description: "Preventing outbreaks of waterborne cholera, leptospirosis, and fungal infections." },
      { percentage: 20, item: "Safe Habitat & Family Rest Packs", description: "Dry sleeping mats, mosquito nets, water buckets, and emergency lanterns." },
      { percentage: 10, item: "Local Volunteer Rescue Logistics", description: "Fuel for inflatable dewatering pumps and volunteer community rescue boats." }
    ],
    suggestedAmounts: [500, 1000, 2000, 4000, 8000]
  },
  {
    id: "cmrf-fund",
    name: "Chief Minister's Relief Fund (CMRF)",
    category: "Government Fund",
    ngoRegDetails: "Official State Government Disaster Response Division",
    darpanId: "GOVT-STATE-DISASTER-01",
    taxExemption: "100% Tax Deductible under Section 80G(2)(a)(v) of Income Tax Act",
    upiId: "cmrelieffund@sbi",
    focusArea: "Statewide Emergency Evacuation, Ex-Gratia Relief & Reconstruction",
    aboutNgo: "The Chief Minister's Relief Fund provides direct financial compensation and state relief machinery deployment. Every rupee donated is audited by the Comptroller and Auditor General (CAG) and directed to affected citizens in flood-declared taluks.",
    proceedsBreakdown: [
      { percentage: 50, item: "Direct Financial Ex-Gratia for Flood-Hit Families", description: "Immediate direct benefit transfers (DBT) for rebuilding damaged huts and crops." },
      { percentage: 30, item: "Free Community Kitchens & Relief Camps", description: "Hot meals and clean drinking water provided at government school relief camps." },
      { percentage: 20, item: "De-watering Pumps & Embankment Reinforcement", description: "High-capacity diesel pumps deployed by irrigation departments to drain towns." }
    ],
    suggestedAmounts: [250, 500, 1000, 2500, 5000]
  },
  {
    id: "pmnrf-fund",
    name: "Prime Minister's National Relief Fund (PMNRF)",
    category: "Government Fund",
    ngoRegDetails: "Prime Minister's Office, South Block, New Delhi",
    darpanId: "GOVT-CENTRAL-PMNRF",
    taxExemption: "100% Deduction under Section 80G without Any Upper Limit",
    upiId: "pmnrf@centralbank",
    focusArea: "National Disaster Relief & Armed Forces / NDRF Rescue Support",
    aboutNgo: "Established in 1948, the PMNRF provides immediate relief to people affected by natural calamities like severe floods, cyclones, and landslides across all Indian States and Union Territories.",
    proceedsBreakdown: [
      { percentage: 60, item: "National Flood Relief & Ex-Gratia Compensation", description: "Sanctioned directly for families of deceased, injured, and totally damaged homes." },
      { percentage: 25, item: "NDRF Joint Flood Rescue Operations", description: "Aviation fuel, amphibious vehicles, and specialized air rescue infrastructure." },
      { percentage: 15, item: "Emergency Medical Relief Supplies", description: "Bulk emergency medicines and pediatric care dispatch to disaster areas." }
    ],
    suggestedAmounts: [500, 1000, 2000, 5000, 10000]
  }
];

export const INITIAL_COMMUNITY_WARNINGS = [
  {
    id: "cw-1",
    authorName: "Anil Bordoloi",
    authorRole: "Citizen",
    location: "Silchar Bypass, Assam",
    state: "Assam",
    hazardType: "Road Submerged",
    waterDepthCm: 140,
    description: "Barak river breached local embankment road. 4 feet water on highway. Two-wheelers and cars cannot pass. Boats required.",
    timestamp: "12 mins ago",
    verifiedCount: 22,
    hasUserVerified: false,
    urgentHelpRequested: true
  },
  {
    id: "cw-2",
    authorName: "Kavitha Menon",
    authorRole: "Volunteer",
    location: "Aluva Manappuram Road, Ernakulam, Kerala",
    state: "Kerala",
    hazardType: "Road Submerged",
    waterDepthCm: 75,
    description: "Periyar water entered ground-floor shops near temple bridge. Electricity turned off. Take bypass flyover instead.",
    timestamp: "35 mins ago",
    verifiedCount: 19,
    hasUserVerified: false,
    urgentHelpRequested: false
  },
  {
    id: "cw-3",
    authorName: "Raju Yadav",
    authorRole: "Citizen",
    location: "Ajit Singh Nagar, Vijayawada, Andhra Pradesh",
    state: "Andhra Pradesh",
    hazardType: "Stranded Persons",
    waterDepthCm: 160,
    description: "Budameru flood water overflowing into colonies. Senior citizens stranded on first floors. Drinking water packets needed.",
    timestamp: "1 hour ago",
    verifiedCount: 45,
    hasUserVerified: false,
    urgentHelpRequested: true
  },
  {
    id: "cw-4",
    authorName: "Karthik Subramanian",
    authorRole: "Citizen",
    location: "Velachery Main Road, Chennai, Tamil Nadu",
    state: "Tamil Nadu",
    hazardType: "Drainage Blocked",
    waterDepthCm: 60,
    description: "Stormwater drain blocked near bus terminus. Water waist deep in inner streets. Municipal pump working.",
    timestamp: "2 hours ago",
    verifiedCount: 16,
    hasUserVerified: false,
    urgentHelpRequested: false
  }
];
