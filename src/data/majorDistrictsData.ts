import { DistrictInfo, IndianState } from "./floodData";

/**
 * Comprehensive database of all 28 States and 8 Union Territories
 * with all major districts of India and their 5 key hydrological telemetry parameters:
 * 1. rainfallIntensity (mm/hr)
 * 2. initialWaterLevel (meters)
 * 3. drainage (capacity %)
 * 4. inflow (m3/s)
 * 5. outflow (m3/s)
 * and severity levels divided as:
 * - Level 1 Safe
 * - Level 2 Warning
 * - Level 3 Critical
 */
export const COMPREHENSIVE_INDIAN_STATES: IndianState[] = [
  {
    id: "andhra-pradesh",
    name: "Andhra Pradesh",
    type: "State",
    floodZone: "Godavari, Krishna & Penna Delta",
    riverBasins: "Godavari, Krishna, Penna, Tungabhadra",
    districts: [
      { name: "Vijayawada (NTR)", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 1.85, initialWaterLevel: 1.85, rainfallRate: 135, rainfallIntensity: 135, drainage: 25, inflow: 480, outflow: 190, status: "Budameru Diversion Channel Breach", vulnerablePoint: "Ajit Singh Nagar & Payakapuram" },
      { name: "Rajahmundry (East Godavari)", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 1.70, initialWaterLevel: 1.70, rainfallRate: 120, rainfallIntensity: 120, drainage: 30, inflow: 440, outflow: 210, status: "Dowleswaram Barrage 2nd Warning Spill", vulnerablePoint: "Godavari River Bund & Sitanagaram" },
      { name: "Visakhapatnam", severityLevel: 1, severityLabel: "Level 1 Safe", waterDepthMeters: 0.35, initialWaterLevel: 0.35, rainfallRate: 45, rainfallIntensity: 45, drainage: 85, inflow: 80, outflow: 110, status: "Normal Urban Catchment Equilibrium", vulnerablePoint: "Gajuwaka Industrial Channel" },
      { name: "Guntur", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.85, initialWaterLevel: 0.85, rainfallRate: 85, rainfallIntensity: 85, drainage: 52, inflow: 220, outflow: 170, status: "Kondaveeti Vagu Stream Overwash", vulnerablePoint: "Old Amaravati Road Causeway" },
      { name: "Tirupati", severityLevel: 1, severityLabel: "Level 1 Safe", waterDepthMeters: 0.40, initialWaterLevel: 0.40, rainfallRate: 50, rainfallIntensity: 50, drainage: 80, inflow: 95, outflow: 115, status: "Swarnamukhi Canal Controlled Runoff", vulnerablePoint: "Renigunta Low Causeway" },
      { name: "Kakinada", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.80, initialWaterLevel: 0.80, rainfallRate: 90, rainfallIntensity: 90, drainage: 48, inflow: 240, outflow: 185, status: "Coringa Estuary Tidal Lock & Runoff", vulnerablePoint: "Jagannaickpur Canal" },
      { name: "Nellore", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.90, initialWaterLevel: 0.90, rainfallRate: 95, rainfallIntensity: 95, drainage: 45, inflow: 260, outflow: 195, status: "Penna River Barrage High Discharge", vulnerablePoint: "Ranganayakulapeta Bund" },
      { name: "Kurnool", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.75, initialWaterLevel: 0.75, rainfallRate: 80, rainfallIntensity: 80, drainage: 55, inflow: 210, outflow: 180, status: "Tungabhadra River Surge", vulnerablePoint: "Joharapuram Flood Wall" },
      { name: "Eluru", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 1.60, initialWaterLevel: 1.60, rainfallRate: 125, rainfallIntensity: 125, drainage: 28, inflow: 390, outflow: 160, status: "Tammileru Stream Surge into Kolleru", vulnerablePoint: "Sanivarapupeta Lowlands" },
      { name: "Kadapa (YSR)", severityLevel: 1, severityLabel: "Level 1 Safe", waterDepthMeters: 0.30, initialWaterLevel: 0.30, rainfallRate: 40, rainfallIntensity: 40, drainage: 82, inflow: 70, outflow: 95, status: "Kundur River Safe Levels", vulnerablePoint: "Mylavaram Spillway" },
      { name: "Anantapur", severityLevel: 1, severityLabel: "Level 1 Safe", waterDepthMeters: 0.25, initialWaterLevel: 0.25, rainfallRate: 35, rainfallIntensity: 35, drainage: 88, inflow: 50, outflow: 75, status: "Pennar Basin Normal Flow", vulnerablePoint: "Bukkarayasamudram Tank Sluice" },
      { name: "Srikakulam", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.85, initialWaterLevel: 0.85, rainfallRate: 90, rainfallIntensity: 90, drainage: 50, inflow: 230, outflow: 180, status: "Nagavali & Vamsadhara River Swell", vulnerablePoint: "Madduvalasa Spill Basin" }
    ]
  },
  {
    id: "arunachal-pradesh",
    name: "Arunachal Pradesh",
    type: "State",
    floodZone: "Eastern Himalayan Foothills",
    riverBasins: "Siang, Subansiri, Lohit, Kameng",
    districts: [
      { name: "Pasighat (East Siang)", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 1.95, initialWaterLevel: 1.95, rainfallRate: 165, rainfallIntensity: 165, drainage: 22, inflow: 550, outflow: 210, status: "Siang River Flash Overtopping", vulnerablePoint: "Raneghat Bridge Approaches" },
      { name: "Itanagar (Papum Pare)", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.75, initialWaterLevel: 0.75, rainfallRate: 110, rainfallIntensity: 110, drainage: 50, inflow: 280, outflow: 220, status: "Hillside Cloudburst & Gully Surge", vulnerablePoint: "Chander Nagar Riverbed" },
      { name: "Namsai", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 1.75, initialWaterLevel: 1.75, rainfallRate: 145, rainfallIntensity: 145, drainage: 26, inflow: 490, outflow: 180, status: "Noa-Dehing Embankment Erosion", vulnerablePoint: "Mahadevpur Causeway" },
      { name: "Tawang", severityLevel: 1, severityLabel: "Level 1 Safe", waterDepthMeters: 0.30, initialWaterLevel: 0.30, rainfallRate: 50, rainfallIntensity: 50, drainage: 85, inflow: 90, outflow: 120, status: "Glacial Headwaters Stable", vulnerablePoint: "Tawang Chu Riverbank" },
      { name: "Ziro (Lower Subansiri)", severityLevel: 1, severityLabel: "Level 1 Safe", waterDepthMeters: 0.35, initialWaterLevel: 0.35, rainfallRate: 55, rainfallIntensity: 55, drainage: 82, inflow: 110, outflow: 135, status: "Valley Stream Gentle Flow", vulnerablePoint: "Kele Stream Sump" },
      { name: "Changlang", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.80, initialWaterLevel: 0.80, rainfallRate: 115, rainfallIntensity: 115, drainage: 45, inflow: 310, outflow: 230, status: "Tirap River Swell", vulnerablePoint: "Miao River Island Road" }
    ]
  },
  {
    id: "assam",
    name: "Assam",
    type: "State",
    floodZone: "Brahmaputra & Barak Valley",
    riverBasins: "Brahmaputra, Barak, Subansiri, Manas, Beki",
    districts: [
      { name: "Silchar (Cachar)", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 2.15, initialWaterLevel: 2.15, rainfallRate: 160, rainfallIntensity: 160, drainage: 18, inflow: 620, outflow: 190, status: "Barak River Bethukandi Dyke Breach", vulnerablePoint: "Rangirkhari Sluice & Tarapur" },
      { name: "Guwahati (Kamrup Metro)", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.90, initialWaterLevel: 0.90, rainfallRate: 95, rainfallIntensity: 95, drainage: 42, inflow: 320, outflow: 240, status: "Bharalu River Backflow & Urban Waterlogging", vulnerablePoint: "Anil Nagar & RG Baruah Road" },
      { name: "Kaziranga (Golaghat)", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 2.25, initialWaterLevel: 2.25, rainfallRate: 170, rainfallIntensity: 170, drainage: 15, inflow: 680, outflow: 200, status: "Brahmaputra Overtopping Wildlife Corridor", vulnerablePoint: "NH-715 Low Animal Corridors" },
      { name: "Dibrugarh", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.80, initialWaterLevel: 0.80, rainfallRate: 100, rainfallIntensity: 100, drainage: 48, inflow: 330, outflow: 260, status: "Brahmaputra Embankment Heavy Discharge", vulnerablePoint: "Graham Bazar Town Protection Drain" },
      { name: "Barpeta", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 1.90, initialWaterLevel: 1.90, rainfallRate: 135, rainfallIntensity: 135, drainage: 24, inflow: 510, outflow: 200, status: "Beki & Manas Rivers Spilling", vulnerablePoint: "Kalgachia Ring Bund" },
      { name: "Jorhat (Majuli Belt)", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 1.80, initialWaterLevel: 1.80, rainfallRate: 130, rainfallIntensity: 130, drainage: 25, inflow: 490, outflow: 210, status: "Brahmaputra Ferry Ghat Overwash", vulnerablePoint: "Nimati Ghat Embankment" },
      { name: "Nagaon", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.85, initialWaterLevel: 0.85, rainfallRate: 90, rainfallIntensity: 90, drainage: 50, inflow: 290, outflow: 230, status: "Kopili River High Water Mark", vulnerablePoint: "Kampur Railway Line Causeway" },
      { name: "Dhemaji", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 2.10, initialWaterLevel: 2.10, rainfallRate: 150, rainfallIntensity: 150, drainage: 20, inflow: 580, outflow: 190, status: "Jiadhal River Torrent Flash Flooding", vulnerablePoint: "Samarajan Embankment Cut" },
      { name: "Lakhimpur", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 1.95, initialWaterLevel: 1.95, rainfallRate: 145, rainfallIntensity: 145, drainage: 22, inflow: 530, outflow: 195, status: "Ranganadi River Dam Water Release", vulnerablePoint: "No. 1 Boginadi Embankment" },
      { name: "Dhubri", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.85, initialWaterLevel: 0.85, rainfallRate: 95, rainfallIntensity: 95, drainage: 45, inflow: 310, outflow: 240, status: "Brahmaputra Red Mark Caution", vulnerablePoint: "Bilasipara Low Banks" },
      { name: "Tezpur (Sonitpur)", severityLevel: 1, severityLabel: "Level 1 Safe", waterDepthMeters: 0.40, initialWaterLevel: 0.40, rainfallRate: 55, rainfallIntensity: 55, drainage: 82, inflow: 140, outflow: 175, status: "Jia Bharali Flow Controlled", vulnerablePoint: "Jahajghat Embankment" }
    ]
  },
  {
    id: "bihar",
    name: "Bihar",
    type: "State",
    floodZone: "North Gangetic Plain & Kosi Belt",
    riverBasins: "Kosi, Gandak, Bagmati, Burhi Gandak, Ganga",
    districts: [
      { name: "Supaul (Kosi Belt)", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 2.45, initialWaterLevel: 2.45, rainfallRate: 145, rainfallIntensity: 145, drainage: 16, inflow: 710, outflow: 230, status: "Kosi Barrage Discharge Crosses 4.5 Lakh Cusecs", vulnerablePoint: "Eastern Kosi Afflux Bund" },
      { name: "Patna", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.95, initialWaterLevel: 0.95, rainfallRate: 85, rainfallIntensity: 85, drainage: 44, inflow: 340, outflow: 260, status: "Ganga Ghats Inflow & Sump Siltation", vulnerablePoint: "Rajendra Nagar Low Sump & Saidpur Nala" },
      { name: "Darbhanga", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 1.85, initialWaterLevel: 1.85, rainfallRate: 125, rainfallIntensity: 125, drainage: 25, inflow: 490, outflow: 210, status: "Kamla Balan River Flash Surge", vulnerablePoint: "Jhanjharpur Railway Span Bund" },
      { name: "Bhagalpur", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.85, initialWaterLevel: 0.85, rainfallRate: 80, rainfallIntensity: 80, drainage: 50, inflow: 280, outflow: 220, status: "Diara Island Submersion & Ganga Swell", vulnerablePoint: "Barari Ghat Cut" },
      { name: "Muzaffarpur", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.80, initialWaterLevel: 0.80, rainfallRate: 90, rainfallIntensity: 90, drainage: 48, inflow: 300, outflow: 230, status: "Burhi Gandak Sluice Overflow", vulnerablePoint: "Bahuara Sluice Gate & Sikandarpur" },
      { name: "Purnia", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.85, initialWaterLevel: 0.85, rainfallRate: 95, rainfallIntensity: 95, drainage: 46, inflow: 310, outflow: 235, status: "Saura River Bank Spill", vulnerablePoint: "Baisi River Causeway" },
      { name: "Katihar", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 1.90, initialWaterLevel: 1.90, rainfallRate: 130, rainfallIntensity: 130, drainage: 22, inflow: 530, outflow: 210, status: "Mahananda & Ganga Confluence Backwash", vulnerablePoint: "Manihari Embankment Low Point" },
      { name: "Gaya", severityLevel: 1, severityLabel: "Level 1 Safe", waterDepthMeters: 0.35, initialWaterLevel: 0.35, rainfallRate: 45, rainfallIntensity: 45, drainage: 85, inflow: 90, outflow: 125, status: "Falgu River Controlled Inflow", vulnerablePoint: "Bishnupad Ghat Spillway" },
      { name: "Saharsa", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 1.80, initialWaterLevel: 1.80, rainfallRate: 135, rainfallIntensity: 135, drainage: 24, inflow: 480, outflow: 200, status: "Kosi Eastern Canal Bank Erosion", vulnerablePoint: "Mahishi Embankment Ring" },
      { name: "Begusarai", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.75, initialWaterLevel: 0.75, rainfallRate: 80, rainfallIntensity: 80, drainage: 52, inflow: 250, outflow: 205, status: "Ganga Backwater in Lowland Crops", vulnerablePoint: "Matihani Ghat Bund" },
      { name: "Samastipur", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.80, initialWaterLevel: 0.80, rainfallRate: 85, rainfallIntensity: 85, drainage: 48, inflow: 270, outflow: 215, status: "Bagmati River Overflow", vulnerablePoint: "Hayaghat Rail Bridge Span" },
      { name: "Nalanda (Bihar Sharif)", severityLevel: 1, severityLabel: "Level 1 Safe", waterDepthMeters: 0.30, initialWaterLevel: 0.30, rainfallRate: 40, rainfallIntensity: 40, drainage: 88, inflow: 65, outflow: 95, status: "Panchanan River Equilibrium", vulnerablePoint: "Khandakpar Lowland Sump" }
    ]
  },
  {
    id: "chhattisgarh",
    name: "Chhattisgarh",
    type: "State",
    floodZone: "Central Mahanadi Basin",
    riverBasins: "Mahanadi, Shivnath, Indravati, Hasdeo",
    districts: [
      { name: "Raipur", severityLevel: 1, severityLabel: "Level 1 Safe", waterDepthMeters: 0.40, initialWaterLevel: 0.40, rainfallRate: 65, rainfallIntensity: 65, drainage: 80, inflow: 120, outflow: 155, status: "Kharun River Normal Runoff", vulnerablePoint: "Mahadev Ghat Road" },
      { name: "Bastar (Jagdalpur)", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.95, initialWaterLevel: 0.95, rainfallRate: 110, rainfallIntensity: 110, drainage: 46, inflow: 340, outflow: 250, status: "Indravati River Heavy Catchment Spate", vulnerablePoint: "Chitrakote Low Causeway" },
      { name: "Bilaspur", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.75, initialWaterLevel: 0.75, rainfallRate: 85, rainfallIntensity: 85, drainage: 52, inflow: 240, outflow: 195, status: "Arpa River Channel Rise", vulnerablePoint: "Torwa Low Sump" },
      { name: "Durg-Bhilai", severityLevel: 1, severityLabel: "Level 1 Safe", waterDepthMeters: 0.35, initialWaterLevel: 0.35, rainfallRate: 50, rainfallIntensity: 50, drainage: 85, inflow: 95, outflow: 130, status: "Shivnath River Moderate Runoff", vulnerablePoint: "Mohara Water Works Causeway" },
      { name: "Korba", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.80, initialWaterLevel: 0.80, rainfallRate: 95, rainfallIntensity: 95, drainage: 50, inflow: 270, outflow: 215, status: "Hasdeo Bango Dam High Sluice Spill", vulnerablePoint: "Darri Barrage Downstream Bank" }
    ]
  },
  {
    id: "goa",
    name: "Goa",
    type: "State",
    floodZone: "Konkan Coastal Belt",
    riverBasins: "Mandovi, Zuari, Chapora, Sal",
    districts: [
      { name: "North Goa (Panaji)", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.70, initialWaterLevel: 0.70, rainfallRate: 100, rainfallIntensity: 100, drainage: 48, inflow: 280, outflow: 215, status: "High Tide Seawall Choke & Mandovi Swell", vulnerablePoint: "Patto Plaza Underpass & Miramar" },
      { name: "South Goa (Margao)", severityLevel: 1, severityLabel: "Level 1 Safe", waterDepthMeters: 0.40, initialWaterLevel: 0.40, rainfallRate: 70, rainfallIntensity: 70, drainage: 78, inflow: 140, outflow: 170, status: "Sal River Basin Slow Runoff", vulnerablePoint: "Old Station Low Bridge" },
      { name: "Ponda", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.75, initialWaterLevel: 0.75, rainfallRate: 105, rainfallIntensity: 105, drainage: 52, inflow: 290, outflow: 230, status: "Khandepar River High Spill", vulnerablePoint: "Opa Water Works Causeway" },
      { name: "Mapusa", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.80, initialWaterLevel: 0.80, rainfallRate: 95, rainfallIntensity: 95, drainage: 45, inflow: 270, outflow: 205, status: "Tar River Backflow into Municipal Market", vulnerablePoint: "Mapusa Sub-Yard Culvert" }
    ]
  },
  {
    id: "gujarat",
    name: "Gujarat",
    type: "State",
    floodZone: "Central Gujarat, Saurashtra & South Gujarat",
    riverBasins: "Vishwamitri, Tapi, Narmada, Sabarmati, Mahi",
    districts: [
      { name: "Vadodara", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 1.85, initialWaterLevel: 1.85, rainfallRate: 140, rainfallIntensity: 140, drainage: 22, inflow: 510, outflow: 195, status: "Vishwamitri River Ajwa Dam Water Overtopping", vulnerablePoint: "Sayajiganj, Sama & Kala Ghoda" },
      { name: "Surat", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.90, initialWaterLevel: 0.90, rainfallRate: 95, rainfallIntensity: 95, drainage: 48, inflow: 340, outflow: 260, status: "Tapi River Ukai Dam High Release", vulnerablePoint: "Rander Causeway & Adajan Lowlands" },
      { name: "Bharuch", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.95, initialWaterLevel: 0.95, rainfallRate: 100, rainfallIntensity: 100, drainage: 45, inflow: 360, outflow: 270, status: "Narmada River Golden Bridge Near 31 ft", vulnerablePoint: "Dandia Bazar Low Promenade" },
      { name: "Ahmedabad", severityLevel: 1, severityLabel: "Level 1 Safe", waterDepthMeters: 0.35, initialWaterLevel: 0.35, rainfallRate: 55, rainfallIntensity: 55, drainage: 82, inflow: 130, outflow: 165, status: "Controlled Vasna Barrage Release", vulnerablePoint: "Subhash Bridge Lower Riverfront" },
      { name: "Rajkot", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.75, initialWaterLevel: 0.75, rainfallRate: 85, rainfallIntensity: 85, drainage: 55, inflow: 230, outflow: 190, status: "Aji Dam Gates Lifted", vulnerablePoint: "Chunarwad Low-Lying Bridge" },
      { name: "Bhavnagar", severityLevel: 1, severityLabel: "Level 1 Safe", waterDepthMeters: 0.40, initialWaterLevel: 0.40, rainfallRate: 60, rainfallIntensity: 60, drainage: 80, inflow: 120, outflow: 150, status: "Kansara Nala Controlled Flow", vulnerablePoint: "Kumbharwada Low Causeway" },
      { name: "Navsari", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 1.70, initialWaterLevel: 1.70, rainfallRate: 130, rainfallIntensity: 130, drainage: 26, inflow: 460, outflow: 190, status: "Purna River Water Crosses Danger Mark", vulnerablePoint: "Kashibawa Mandir Causeway" },
      { name: "Junagadh", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.85, initialWaterLevel: 0.85, rainfallRate: 110, rainfallIntensity: 110, drainage: 46, inflow: 320, outflow: 240, status: "Girnar Foothills Flash Torrent Runoff", vulnerablePoint: "Kalwa Chowk Underpass" },
      { name: "Jamnagar", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.80, initialWaterLevel: 0.80, rainfallRate: 90, rainfallIntensity: 90, drainage: 50, inflow: 260, outflow: 210, status: "Rangmati & Nagmati River Inflow", vulnerablePoint: "Bedi Gate Low Sump" },
      { name: "Kutch (Bhuj)", severityLevel: 1, severityLabel: "Level 1 Safe", waterDepthMeters: 0.30, initialWaterLevel: 0.30, rainfallRate: 40, rainfallIntensity: 40, drainage: 85, inflow: 75, outflow: 105, status: "Hamirsar Lake Basin Normal", vulnerablePoint: "Khatri Chowk Outfall" }
    ]
  },
  {
    id: "haryana",
    name: "Haryana",
    type: "State",
    floodZone: "Yamuna, Ghaggar & Tangri Plains",
    riverBasins: "Yamuna, Ghaggar, Tangri, Markanda",
    districts: [
      { name: "Ambala", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 1.65, initialWaterLevel: 1.65, rainfallRate: 125, rainfallIntensity: 125, drainage: 25, inflow: 450, outflow: 185, status: "Tangri River Breach Inundation", vulnerablePoint: "Cloth Market & Ring Road Bund" },
      { name: "Yamunanagar", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.85, initialWaterLevel: 0.85, rainfallRate: 100, rainfallIntensity: 100, drainage: 48, inflow: 320, outflow: 250, status: "Hathnikund Barrage Discharge 1.8 Lakh Cusecs", vulnerablePoint: "Tajewala Low Embankment" },
      { name: "Gurugram", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.80, initialWaterLevel: 0.80, rainfallRate: 90, rainfallIntensity: 90, drainage: 45, inflow: 290, outflow: 210, status: "Badshahpur Drain Overcapacity & Waterlogging", vulnerablePoint: "Hero Honda Chowk Underpass & Subhash Chowk" },
      { name: "Faridabad", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.75, initialWaterLevel: 0.75, rainfallRate: 85, rainfallIntensity: 85, drainage: 52, inflow: 260, outflow: 210, status: "Yamuna Khadar Floodplain Swell", vulnerablePoint: "Basantpur Ring Road" },
      { name: "Karnal", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.70, initialWaterLevel: 0.70, rainfallRate: 80, rainfallIntensity: 80, drainage: 54, inflow: 240, outflow: 195, status: "Gharaunda Riverbank Low Inflow", vulnerablePoint: "Kunjpura Yamuna Bund" },
      { name: "Panipat", severityLevel: 1, severityLabel: "Level 1 Safe", waterDepthMeters: 0.35, initialWaterLevel: 0.35, rainfallRate: 50, rainfallIntensity: 50, drainage: 82, inflow: 110, outflow: 140, status: "Drainage Sump Working Efficiently", vulnerablePoint: "Assandh Road Drain" },
      { name: "Sonipat", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.75, initialWaterLevel: 0.75, rainfallRate: 85, rainfallIntensity: 85, drainage: 50, inflow: 260, outflow: 205, status: "Yamuna Overflow into Khadar Farm Areas", vulnerablePoint: "Rai Industrial Culvert" },
      { name: "Rohtak", severityLevel: 1, severityLabel: "Level 1 Safe", waterDepthMeters: 0.40, initialWaterLevel: 0.40, rainfallRate: 60, rainfallIntensity: 60, drainage: 78, inflow: 130, outflow: 160, status: "JLN Canal Stable Flow", vulnerablePoint: "Sukhpura Chowk" }
    ]
  },
  {
    id: "himachal-pradesh",
    name: "Himachal Pradesh",
    type: "State",
    floodZone: "Western Himalayan Torrent & Gorge Valleys",
    riverBasins: "Beas, Sutlej, Ravi, Chenab, Yamuna",
    districts: [
      { name: "Kullu & Manali", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 2.30, initialWaterLevel: 2.30, rainfallRate: 180, rainfallIntensity: 180, drainage: 18, inflow: 740, outflow: 240, status: "Beas River Flash Debris Flood & Highway Collapse", vulnerablePoint: "Green Tax Barrier & Aloo Ground" },
      { name: "Mandi", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 1.95, initialWaterLevel: 1.95, rainfallRate: 155, rainfallIntensity: 155, drainage: 22, inflow: 580, outflow: 220, status: "Suketi Khad & Beas River Confluence Surge", vulnerablePoint: "Victoria Suspension Bridge Low Bank" },
      { name: "Shimla", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.70, initialWaterLevel: 0.70, rainfallRate: 110, rainfallIntensity: 110, drainage: 55, inflow: 290, outflow: 240, status: "Hillside Cloudburst Runoff & Silt Slides", vulnerablePoint: "Tutikandi Bypass Gully" },
      { name: "Kangra (Dharamshala)", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.85, initialWaterLevel: 0.85, rainfallRate: 125, rainfallIntensity: 125, drainage: 50, inflow: 350, outflow: 270, status: "Manjhi Khad Spate Overtopping Road", vulnerablePoint: "Bhagsunag Causeway" },
      { name: "Solan", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.75, initialWaterLevel: 0.75, rainfallRate: 105, rainfallIntensity: 105, drainage: 52, inflow: 280, outflow: 225, status: "Giri River Swell & Highway Mud Slurry", vulnerablePoint: "Kumarhatti Low Bridge" },
      { name: "Chamba", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.80, initialWaterLevel: 0.80, rainfallRate: 115, rainfallIntensity: 115, drainage: 48, inflow: 320, outflow: 245, status: "Ravi River High Headwaters", vulnerablePoint: "Chamera Dam Catchment Bank" }
    ]
  },
  {
    id: "jharkhand",
    name: "Jharkhand",
    type: "State",
    floodZone: "Chota Nagpur Plateau River Basin",
    riverBasins: "Subarnarekha, Damodar, Barakar, Kharkai",
    districts: [
      { name: "Jamshedpur (East Singhbhum)", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.90, initialWaterLevel: 0.90, rainfallRate: 100, rainfallIntensity: 100, drainage: 48, inflow: 330, outflow: 250, status: "Subarnarekha & Kharkai Confluence Swell", vulnerablePoint: "Baghbera Lowland Colony & Kadma Marine Drive" },
      { name: "Ranchi", severityLevel: 1, severityLabel: "Level 1 Safe", waterDepthMeters: 0.40, initialWaterLevel: 0.40, rainfallRate: 65, rainfallIntensity: 65, drainage: 80, inflow: 130, outflow: 165, status: "Subarnarekha Headwater Stable", vulnerablePoint: "Namkum Causeway Bridge" },
      { name: "Dhanbad", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.75, initialWaterLevel: 0.75, rainfallRate: 85, rainfallIntensity: 85, drainage: 52, inflow: 260, outflow: 205, status: "Damodar Basin Drainage Backwash", vulnerablePoint: "Katras Sump Drain" },
      { name: "Bokaro", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.70, initialWaterLevel: 0.70, rainfallRate: 80, rainfallIntensity: 80, drainage: 55, inflow: 240, outflow: 195, status: "Tenughat Dam Gates Discharging", vulnerablePoint: "Chas Low-Lying Culvert" },
      { name: "Deoghar", severityLevel: 1, severityLabel: "Level 1 Safe", waterDepthMeters: 0.35, initialWaterLevel: 0.35, rainfallRate: 50, rainfallIntensity: 50, drainage: 85, inflow: 95, outflow: 130, status: "Mayurakshi Stream Flow Safe", vulnerablePoint: "Jasidih Low Sump" }
    ]
  },
  {
    id: "karnataka",
    name: "Karnataka",
    type: "State",
    floodZone: "Western Ghats, Coastal & Krishna-Cauvery Basins",
    riverBasins: "Krishna, Cauvery, Tungabhadra, Sharavathi, Netravati",
    districts: [
      { name: "Belagavi", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 1.75, initialWaterLevel: 1.75, rainfallRate: 130, rainfallIntensity: 130, drainage: 24, inflow: 470, outflow: 190, status: "Krishna & Malaprabha Rivers Heavy Inflow", vulnerablePoint: "Chikkodi Bridge Causeway & Kallol Barrage" },
      { name: "Kodagu (Coorg)", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 1.95, initialWaterLevel: 1.95, rainfallRate: 170, rainfallIntensity: 170, drainage: 20, inflow: 580, outflow: 210, status: "Cauvery River Headwater Surge & Debris Runoff", vulnerablePoint: "Bhagamandala Triveni Sangam" },
      { name: "Mangaluru (Dakshina Kannada)", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.85, initialWaterLevel: 0.85, rainfallRate: 115, rainfallIntensity: 115, drainage: 50, inflow: 340, outflow: 270, status: "Netravati River Swell & Coastal Tidal Ponding", vulnerablePoint: "Jeppinamogaru Low Embankment" },
      { name: "Bengaluru Urban", severityLevel: 1, severityLabel: "Level 1 Safe", waterDepthMeters: 0.45, initialWaterLevel: 0.45, rainfallRate: 70, rainfallIntensity: 70, drainage: 75, inflow: 160, outflow: 190, status: "Stormwater Raja Kaluve Managed Flow", vulnerablePoint: "Bellandur Lake Outfall & Rainbow Drive" },
      { name: "Udupi", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.90, initialWaterLevel: 0.90, rainfallRate: 120, rainfallIntensity: 120, drainage: 46, inflow: 350, outflow: 260, status: "Swarna & Sita Rivers High Discharge", vulnerablePoint: "Manipal Sump Bypass & Kalsanka" },
      { name: "Mysuru", severityLevel: 1, severityLabel: "Level 1 Safe", waterDepthMeters: 0.40, initialWaterLevel: 0.40, rainfallRate: 60, rainfallIntensity: 60, drainage: 82, inflow: 130, outflow: 160, status: "Kabini Dam Controlled Spill", vulnerablePoint: "Nanjangud Low Temple Ghats" },
      { name: "Hubballi-Dharwad", severityLevel: 1, severityLabel: "Level 1 Safe", waterDepthMeters: 0.35, initialWaterLevel: 0.35, rainfallRate: 55, rainfallIntensity: 55, drainage: 84, inflow: 110, outflow: 140, status: "Unkal Lake Sluice Open", vulnerablePoint: "Old Hubli Low Sump" },
      { name: "Kalaburagi", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.80, initialWaterLevel: 0.80, rainfallRate: 90, rainfallIntensity: 90, drainage: 48, inflow: 270, outflow: 210, status: "Bhima River Barrage Release", vulnerablePoint: "Sonthi Barrage Low Bank" },
      { name: "Shivamogga", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.85, initialWaterLevel: 0.85, rainfallRate: 110, rainfallIntensity: 110, drainage: 48, inflow: 330, outflow: 250, status: "Tunga Dam 10 Gates Lifted", vulnerablePoint: "Mandagadde Bird Sanctuary Causeway" },
      { name: "Ballari", severityLevel: 1, severityLabel: "Level 1 Safe", waterDepthMeters: 0.30, initialWaterLevel: 0.30, rainfallRate: 40, rainfallIntensity: 40, drainage: 85, inflow: 80, outflow: 110, status: "Tungabhadra Dam Downstream Normal", vulnerablePoint: "Kampli Bridge" }
    ]
  },
  {
    id: "kerala",
    name: "Kerala",
    type: "State",
    floodZone: "Western Ghats Slopes & Coastal Plain",
    riverBasins: "Periyar, Pamba, Bharathapuzha, Meenachil, Chaliyar",
    districts: [
      { name: "Wayanad", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 2.25, initialWaterLevel: 2.25, rainfallRate: 185, rainfallIntensity: 185, drainage: 18, inflow: 710, outflow: 220, status: "Iruvaipuzha Stream Overflow & Debris Flash Surge", vulnerablePoint: "Meppadi & Chooralmala Lowlands" },
      { name: "Alappuzha (Kuttanad)", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 1.45, initialWaterLevel: 1.45, rainfallRate: 120, rainfallIntensity: 120, drainage: 22, inflow: 420, outflow: 160, status: "Sub-Sea Level Delta Flooding & Vembanad Lake Swell", vulnerablePoint: "Thanneermukkom Bund Channel & AC Road" },
      { name: "Ernakulam (Kochi & Aluva)", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.90, initialWaterLevel: 0.90, rainfallRate: 95, rainfallIntensity: 95, drainage: 50, inflow: 340, outflow: 265, status: "Periyar River Dam Release Waterlogging", vulnerablePoint: "Aluva Manappuram Ghats & Eloor Industrial Island" },
      { name: "Idukki", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.65, initialWaterLevel: 0.65, rainfallRate: 90, rainfallIntensity: 90, drainage: 55, inflow: 290, outflow: 240, status: "Cheruthoni Reservoir Controlled Runoff", vulnerablePoint: "Lower Periyar Spillway Basin" },
      { name: "Thiruvananthapuram", severityLevel: 1, severityLabel: "Level 1 Safe", waterDepthMeters: 0.35, initialWaterLevel: 0.35, rainfallRate: 60, rainfallIntensity: 60, drainage: 82, inflow: 120, outflow: 155, status: "Killi River Controlled Level", vulnerablePoint: "Thekkummoodu Bund" },
      { name: "Thrissur", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.75, initialWaterLevel: 0.75, rainfallRate: 85, rainfallIntensity: 85, drainage: 52, inflow: 260, outflow: 210, status: "Karuvannur River Rise & Kole Wetlands Choke", vulnerablePoint: "Arattupuzha Low Causeway" },
      { name: "Kozhikode", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.80, initialWaterLevel: 0.80, rainfallRate: 105, rainfallIntensity: 105, drainage: 48, inflow: 310, outflow: 240, status: "Chaliyar River Swell", vulnerablePoint: "Mavoor Lowland Embankment" },
      { name: "Kottayam", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.85, initialWaterLevel: 0.85, rainfallRate: 95, rainfallIntensity: 95, drainage: 46, inflow: 320, outflow: 245, status: "Meenachil River Overwash", vulnerablePoint: "Pala Town Low Bypass" },
      { name: "Palakkad", severityLevel: 1, severityLabel: "Level 1 Safe", waterDepthMeters: 0.40, initialWaterLevel: 0.40, rainfallRate: 65, rainfallIntensity: 65, drainage: 80, inflow: 140, outflow: 175, status: "Malampuzha Dam Regulated Spill", vulnerablePoint: "Kalpathy River Ghats" },
      { name: "Pathanamthitta", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 1.70, initialWaterLevel: 1.70, rainfallRate: 135, rainfallIntensity: 135, drainage: 26, inflow: 480, outflow: 200, status: "Pamba River Crosses Danger Level", vulnerablePoint: "Ranni Town Low Bridge" }
    ]
  },
  {
    id: "madhya-pradesh",
    name: "Madhya Pradesh",
    type: "State",
    floodZone: "Narmada, Chambal & Betwa Basins",
    riverBasins: "Narmada, Chambal, Betwa, Son, Tapti",
    districts: [
      { name: "Hoshangabad (Narmadapuram)", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 1.65, initialWaterLevel: 1.65, rainfallRate: 115, rainfallIntensity: 115, drainage: 28, inflow: 460, outflow: 210, status: "Narmada River Sethani Ghat Inundation", vulnerablePoint: "Tawa Dam Outflow Confluence" },
      { name: "Jabalpur", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.80, initialWaterLevel: 0.80, rainfallRate: 90, rainfallIntensity: 90, drainage: 50, inflow: 300, outflow: 235, status: "Bargi Dam 15 Spillway Gates Open", vulnerablePoint: "Gwarighat Riverside Walk" },
      { name: "Bhopal", severityLevel: 1, severityLabel: "Level 1 Safe", waterDepthMeters: 0.35, initialWaterLevel: 0.35, rainfallRate: 60, rainfallIntensity: 60, drainage: 82, inflow: 120, outflow: 155, status: "Upper Lake Sluice Controlled Spill", vulnerablePoint: "Bhadbhada Dam Outlet" },
      { name: "Indore", severityLevel: 1, severityLabel: "Level 1 Safe", waterDepthMeters: 0.40, initialWaterLevel: 0.40, rainfallRate: 65, rainfallIntensity: 65, drainage: 80, inflow: 130, outflow: 160, status: "Kanh & Saraswati Rivers Cleaned Runoff", vulnerablePoint: "Bada Ganpati Underpass" },
      { name: "Gwalior", severityLevel: 1, severityLabel: "Level 1 Safe", waterDepthMeters: 0.30, initialWaterLevel: 0.30, rainfallRate: 45, rainfallIntensity: 45, drainage: 85, inflow: 85, outflow: 120, status: "Swarnrekha Nala Normal Level", vulnerablePoint: "Lashkar Sump Basin" },
      { name: "Ujjain", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.85, initialWaterLevel: 0.85, rainfallRate: 95, rainfallIntensity: 95, drainage: 48, inflow: 310, outflow: 240, status: "Shipra River Ramghat Submerged", vulnerablePoint: "Chintaman Bridge Bank" }
    ]
  },
  {
    id: "maharashtra",
    name: "Maharashtra",
    type: "State",
    floodZone: "Konkan Coast, Western Ghats & Krishna Basin",
    riverBasins: "Mithi, Vashishti, Krishna, Panchganga, Godavari, Mutha",
    districts: [
      { name: "Mumbai City", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 1.50, initialWaterLevel: 1.50, rainfallRate: 135, rainfallIntensity: 135, drainage: 24, inflow: 450, outflow: 180, status: "Mithi River & High Tide Seawall Choke", vulnerablePoint: "Kurla Kranti Nagar, Sion & Milan Subway" },
      { name: "Chiplun (Ratnagiri)", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 2.35, initialWaterLevel: 2.35, rainfallRate: 190, rainfallIntensity: 190, drainage: 16, inflow: 760, outflow: 230, status: "Vashishti River Valley Cloudburst Flash Flood", vulnerablePoint: "Khed Bridge & Shivaji Market" },
      { name: "Kolhapur", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 1.65, initialWaterLevel: 1.65, rainfallRate: 125, rainfallIntensity: 125, drainage: 26, inflow: 490, outflow: 210, status: "Panchganga River Crosses 43 ft Danger Mark", vulnerablePoint: "Rajaram Barrage & Shirol Lowlands" },
      { name: "Sangli", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.95, initialWaterLevel: 0.95, rainfallRate: 100, rainfallIntensity: 100, drainage: 45, inflow: 350, outflow: 260, status: "Krishna River Almatti Backwater Threat", vulnerablePoint: "Irwin Bridge Low Ghats & Haripur" },
      { name: "Pune", severityLevel: 1, severityLabel: "Level 1 Safe", waterDepthMeters: 0.45, initialWaterLevel: 0.45, rainfallRate: 70, rainfallIntensity: 70, drainage: 76, inflow: 160, outflow: 190, status: "Khadakwasla Dam Spillway Regulated Discharge", vulnerablePoint: "Sinhagad Road Riverside Society" },
      { name: "Thane", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.85, initialWaterLevel: 0.85, rainfallRate: 110, rainfallIntensity: 110, drainage: 46, inflow: 320, outflow: 245, status: "Ulhas River & Creek Tidal Ponding", vulnerablePoint: "Kalyan Retibunder & Diva" },
      { name: "Raigad", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 1.80, initialWaterLevel: 1.80, rainfallRate: 155, rainfallIntensity: 155, drainage: 22, inflow: 540, outflow: 210, status: "Savitri River Crosses High Flood Line", vulnerablePoint: "Mahad Town Market & Mahad Bridge" },
      { name: "Nagpur", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.80, initialWaterLevel: 0.80, rainfallRate: 90, rainfallIntensity: 90, drainage: 50, inflow: 270, outflow: 215, status: "Nag River Basin Urban Surge", vulnerablePoint: "Mor Bhavan Underpass & Ambazari Lake Overflow" },
      { name: "Nashik", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.85, initialWaterLevel: 0.85, rainfallRate: 95, rainfallIntensity: 95, drainage: 50, inflow: 300, outflow: 235, status: "Godavari River Ramkund Submerged", vulnerablePoint: "Holkar Bridge Low Road" },
      { name: "Solapur", severityLevel: 1, severityLabel: "Level 1 Safe", waterDepthMeters: 0.35, initialWaterLevel: 0.35, rainfallRate: 50, rainfallIntensity: 50, drainage: 82, inflow: 100, outflow: 130, status: "Ujjani Dam Downstream Controlled", vulnerablePoint: "Bale Low Causeway" }
    ]
  },
  {
    id: "manipur",
    name: "Manipur",
    type: "State",
    floodZone: "Imphal Valley & Barak Basin",
    riverBasins: "Imphal, Iril, Thoubal, Nambul",
    districts: [
      { name: "Imphal West", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 1.70, initialWaterLevel: 1.70, rainfallRate: 140, rainfallIntensity: 140, drainage: 24, inflow: 490, outflow: 195, status: "Imphal River Embankment Breach at Khurai", vulnerablePoint: "Sanjenthong Bridge & Minuthong" },
      { name: "Imphal East", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 1.65, initialWaterLevel: 1.65, rainfallRate: 135, rainfallIntensity: 135, drainage: 25, inflow: 470, outflow: 190, status: "Kongba & Iril River Overwash", vulnerablePoint: "Kongba Bazar Lowlands" },
      { name: "Thoubal", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.85, initialWaterLevel: 0.85, rainfallRate: 100, rainfallIntensity: 100, drainage: 48, inflow: 310, outflow: 235, status: "Thoubal River Spill", vulnerablePoint: "Lilong Low Bridge" },
      { name: "Bishnupur", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.80, initialWaterLevel: 0.80, rainfallRate: 95, rainfallIntensity: 95, drainage: 50, inflow: 280, outflow: 220, status: "Loktak Lake Silt Retention", vulnerablePoint: "Moirang Canal Gate" }
    ]
  },
  {
    id: "meghalaya",
    name: "Meghalaya",
    type: "State",
    floodZone: "Southern Khasi & Garo Foothills",
    riverBasins: "Someshwari, Ganol, Umngot, Simsang",
    districts: [
      { name: "West Garo Hills (Tura)", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 1.85, initialWaterLevel: 1.85, rainfallRate: 175, rainfallIntensity: 175, drainage: 20, inflow: 560, outflow: 210, status: "Ganol River Spate & Mountain Flash Flood", vulnerablePoint: "Tikrikilla Low Valley & Phulbari" },
      { name: "Sohra (Cherrapunji & Mawsynram)", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.95, initialWaterLevel: 0.95, rainfallRate: 250, rainfallIntensity: 250, drainage: 65, inflow: 620, outflow: 510, status: "Extreme Cloudburst Runoff Down Southern Cliffs", vulnerablePoint: "Shella Border Causeway" },
      { name: "East Khasi Hills (Shillong)", severityLevel: 1, severityLabel: "Level 1 Safe", waterDepthMeters: 0.35, initialWaterLevel: 0.35, rainfallRate: 75, rainfallIntensity: 75, drainage: 82, inflow: 130, outflow: 165, status: "Wah Umkhrah Stream Inundation Cleared", vulnerablePoint: "Polo Ground Drainage Sump" }
    ]
  },
  {
    id: "mizoram",
    name: "Mizoram",
    type: "State",
    floodZone: "Barak & Kaladan River Valleys",
    riverBasins: "Tlawng, Chhimtuipui, Tuirial",
    districts: [
      { name: "Aizawl", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.65, initialWaterLevel: 0.65, rainfallRate: 110, rainfallIntensity: 110, drainage: 55, inflow: 280, outflow: 230, status: "Tlawng River Swell & Gully Runoff", vulnerablePoint: "Sairang Riverbank Sump" },
      { name: "Lunglei", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.70, initialWaterLevel: 0.70, rainfallRate: 120, rainfallIntensity: 120, drainage: 52, inflow: 300, outflow: 240, status: "Khawthlangtuipui River Rise", vulnerablePoint: "Tlabung Border Low Ghat" }
    ]
  },
  {
    id: "nagaland",
    name: "Nagaland",
    type: "State",
    floodZone: "Dhansiri & Doyang Basin",
    riverBasins: "Dhansiri, Doyang, Tizu",
    districts: [
      { name: "Dimapur", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 1.55, initialWaterLevel: 1.55, rainfallRate: 130, rainfallIntensity: 130, drainage: 26, inflow: 440, outflow: 190, status: "Dhansiri River Flood Plain Inflow", vulnerablePoint: "Nagarjan & Burma Camp" },
      { name: "Kohima", severityLevel: 1, severityLabel: "Level 1 Safe", waterDepthMeters: 0.30, initialWaterLevel: 0.30, rainfallRate: 70, rainfallIntensity: 70, drainage: 85, inflow: 95, outflow: 130, status: "Ridge Stream Runoff Stable", vulnerablePoint: "Zubza Causeway" }
    ]
  },
  {
    id: "odisha",
    name: "Odisha",
    type: "State",
    floodZone: "Mahanadi, Baitarani & Brahmani Delta",
    riverBasins: "Mahanadi, Brahmani, Baitarani, Subarnarekha, Rushikulya",
    districts: [
      { name: "Cuttack", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 1.75, initialWaterLevel: 1.75, rainfallRate: 120, rainfallIntensity: 120, drainage: 25, inflow: 490, outflow: 205, status: "Mundali Barrage High Outflow Spill", vulnerablePoint: "Kathajodi Ring Road Sluice" },
      { name: "Bhubaneswar (Khordha)", severityLevel: 1, severityLabel: "Level 1 Safe", waterDepthMeters: 0.40, initialWaterLevel: 0.40, rainfallRate: 65, rainfallIntensity: 65, drainage: 80, inflow: 130, outflow: 165, status: "Gangua Canal Moderate Flow", vulnerablePoint: "Acharya Vihar Underpass" },
      { name: "Puri", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.85, initialWaterLevel: 0.85, rainfallRate: 95, rainfallIntensity: 95, drainage: 48, inflow: 310, outflow: 240, status: "Coastal Storm Surge Backwash", vulnerablePoint: "Brahmagiri Low Drains & Daya River Bund" },
      { name: "Kendrapara", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.90, initialWaterLevel: 0.90, rainfallRate: 105, rainfallIntensity: 105, drainage: 44, inflow: 330, outflow: 245, status: "Baitarani Tidal Backwater Overflow", vulnerablePoint: "Aul River Bund" },
      { name: "Jagatsinghpur", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.80, initialWaterLevel: 0.80, rainfallRate: 90, rainfallIntensity: 90, drainage: 50, inflow: 280, outflow: 220, status: "Devi River Delta Swell", vulnerablePoint: "Machhagaon Canal Sluice" },
      { name: "Balasore", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 1.80, initialWaterLevel: 1.80, rainfallRate: 135, rainfallIntensity: 135, drainage: 24, inflow: 510, outflow: 200, status: "Subarnarekha River Heavy Inflow from Jharkhand", vulnerablePoint: "Rajghat Embankment Breach" },
      { name: "Sambalpur", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.85, initialWaterLevel: 0.85, rainfallRate: 100, rainfallIntensity: 100, drainage: 52, inflow: 360, outflow: 290, status: "Hirakud Dam 20 Sluice Gates Discharging", vulnerablePoint: "Mahanadi Riverside Ring Road" }
    ]
  },
  {
    id: "punjab",
    name: "Punjab",
    type: "State",
    floodZone: "Sutlej, Beas & Ravi Plains",
    riverBasins: "Sutlej, Beas, Ravi, Ghaggar",
    districts: [
      { name: "Rupnagar (Ropar)", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 1.60, initialWaterLevel: 1.60, rainfallRate: 120, rainfallIntensity: 120, drainage: 26, inflow: 450, outflow: 195, status: "Sutlej River High Release from Bhakra Dam", vulnerablePoint: "Sirhind Canal Sluice & Anandpur Sahib" },
      { name: "Ferozepur", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 1.75, initialWaterLevel: 1.75, rainfallRate: 115, rainfallIntensity: 115, drainage: 24, inflow: 480, outflow: 200, status: "Harike Barrage Spill Inundation", vulnerablePoint: "Border Villages Enclosure Bund" },
      { name: "Patiala", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.90, initialWaterLevel: 0.90, rainfallRate: 95, rainfallIntensity: 95, drainage: 45, inflow: 320, outflow: 240, status: "Badi Nadi Overwash into Urban Areas", vulnerablePoint: "Tafazalpura Low Drain & Urban Estate" },
      { name: "Ludhiana", severityLevel: 1, severityLabel: "Level 1 Safe", waterDepthMeters: 0.40, initialWaterLevel: 0.40, rainfallRate: 60, rainfallIntensity: 60, drainage: 80, inflow: 130, outflow: 165, status: "Buddha Nullah Dredged Discharge", vulnerablePoint: "Tajpur Road Culvert" },
      { name: "Amritsar", severityLevel: 1, severityLabel: "Level 1 Safe", waterDepthMeters: 0.35, initialWaterLevel: 0.35, rainfallRate: 55, rainfallIntensity: 55, drainage: 84, inflow: 110, outflow: 145, status: "Tung Dhab Drain Equilibrium", vulnerablePoint: "Batala Road Low Sump" },
      { name: "Jalandhar", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.80, initialWaterLevel: 0.80, rainfallRate: 85, rainfallIntensity: 85, drainage: 50, inflow: 270, outflow: 215, status: "Sutlej River Phillaur Embankment Warning", vulnerablePoint: "Lohian Khas Bund" }
    ]
  },
  {
    id: "rajasthan",
    name: "Rajasthan",
    type: "State",
    floodZone: "Chambal, Banas & Luni Flash Basins",
    riverBasins: "Chambal, Banas, Luni, Mahi",
    districts: [
      { name: "Kota", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 1.65, initialWaterLevel: 1.65, rainfallRate: 125, rainfallIntensity: 125, drainage: 26, inflow: 470, outflow: 200, status: "Kota Barrage Gates Opened", vulnerablePoint: "Nayapura & Chambal Heritage Ghat" },
      { name: "Jodhpur", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.80, initialWaterLevel: 0.80, rainfallRate: 85, rainfallIntensity: 85, drainage: 52, inflow: 260, outflow: 205, status: "Desert Flash Inundation & Drain Ponding", vulnerablePoint: "Surpura Dam Canal & Mandore Road" },
      { name: "Jaipur", severityLevel: 1, severityLabel: "Level 1 Safe", waterDepthMeters: 0.40, initialWaterLevel: 0.40, rainfallRate: 65, rainfallIntensity: 65, drainage: 82, inflow: 130, outflow: 165, status: "Dravyavati River Basin Runoff Managed", vulnerablePoint: "Sanganer Low Causeway" },
      { name: "Udaipur", severityLevel: 1, severityLabel: "Level 1 Safe", waterDepthMeters: 0.35, initialWaterLevel: 0.35, rainfallRate: 55, rainfallIntensity: 55, drainage: 84, inflow: 110, outflow: 140, status: "Pichola & Fateh Sagar Lakes Sluices Controlled", vulnerablePoint: "Swaroop Sagar Gates" },
      { name: "Bharatpur", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.85, initialWaterLevel: 0.85, rainfallRate: 90, rainfallIntensity: 90, drainage: 48, inflow: 290, outflow: 225, status: "Banganga River Flood Spill", vulnerablePoint: "Keoladeo Park Buffer Canal" }
    ]
  },
  {
    id: "sikkim",
    name: "Sikkim",
    type: "State",
    floodZone: "Teesta Glacial Lake Outburst (GLOF) Basin",
    riverBasins: "Teesta, Rangit",
    districts: [
      { name: "Mangan (North Sikkim)", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 2.35, initialWaterLevel: 2.35, rainfallRate: 185, rainfallIntensity: 185, drainage: 16, inflow: 780, outflow: 230, status: "Teesta River Glacial Runoff Surge", vulnerablePoint: "Chungthang Dam Spill Basin & Toong" },
      { name: "Gangtok", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.70, initialWaterLevel: 0.70, rainfallRate: 125, rainfallIntensity: 125, drainage: 52, inflow: 310, outflow: 250, status: "Ranichu River Inundation & Soil Creep", vulnerablePoint: "Singtam Low Bazaar & Dikchu" },
      { name: "Pakyong", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.75, initialWaterLevel: 0.75, rainfallRate: 120, rainfallIntensity: 120, drainage: 50, inflow: 300, outflow: 240, status: "Rorathang River High Current", vulnerablePoint: "Rangpo Border Bridge" }
    ]
  },
  {
    id: "tamil-nadu",
    name: "Tamil Nadu",
    type: "State",
    floodZone: "Coromandel Coastal Delta & Cauvery Basin",
    riverBasins: "Adyar, Cooum, Kosasthalaiyar, Cauvery, Vaigai, Thamirabarani",
    districts: [
      { name: "Chennai", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 1.55, initialWaterLevel: 1.55, rainfallRate: 140, rainfallIntensity: 140, drainage: 25, inflow: 480, outflow: 195, status: "Adyar & Cooum Estuary Tidal Lock & Chembarambakkam Spill", vulnerablePoint: "Velachery Lake Cut & Mudichur Lowlands" },
      { name: "Cuddalore", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.95, initialWaterLevel: 0.95, rainfallRate: 110, rainfallIntensity: 110, drainage: 45, inflow: 340, outflow: 255, status: "Pennaiyar & Gedilam Rivers Discharge", vulnerablePoint: "Kollidam Delta Causeway" },
      { name: "Thanjavur", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.80, initialWaterLevel: 0.80, rainfallRate: 90, rainfallIntensity: 90, drainage: 50, inflow: 270, outflow: 215, status: "Grand Anicut Canal Overflow", vulnerablePoint: "Vennar River Branch Cut" },
      { name: "Madurai", severityLevel: 1, severityLabel: "Level 1 Safe", waterDepthMeters: 0.40, initialWaterLevel: 0.40, rainfallRate: 60, rainfallIntensity: 60, drainage: 82, inflow: 130, outflow: 165, status: "Vaigai River Surplus Inflow Regulated", vulnerablePoint: "Goripalayam Causeway" },
      { name: "Coimbatore", severityLevel: 1, severityLabel: "Level 1 Safe", waterDepthMeters: 0.35, initialWaterLevel: 0.35, rainfallRate: 55, rainfallIntensity: 55, drainage: 85, inflow: 110, outflow: 145, status: "Noyyal River Managed Flow", vulnerablePoint: "Singanallur Lake Sluice" },
      { name: "Tirunelveli", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 1.70, initialWaterLevel: 1.70, rainfallRate: 135, rainfallIntensity: 135, drainage: 26, inflow: 460, outflow: 190, status: "Thamirabarani River Flash Inundation", vulnerablePoint: "Kurukkuthurai Murugan Temple Low Steps" },
      { name: "Thoothukudi", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 1.65, initialWaterLevel: 1.65, rainfallRate: 130, rainfallIntensity: 130, drainage: 24, inflow: 450, outflow: 185, status: "Buckle Canal Overtopping & Salt Pan Flooding", vulnerablePoint: "Antonyarpuram Low Causeway" },
      { name: "Kanchipuram", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.85, initialWaterLevel: 0.85, rainfallRate: 95, rainfallIntensity: 95, drainage: 48, inflow: 300, outflow: 235, status: "Vegavathi River Swell", vulnerablePoint: "Orikkai Low Bridge" }
    ]
  },
  {
    id: "telangana",
    name: "Telangana",
    type: "State",
    floodZone: "Godavari, Krishna & Musi Catchments",
    riverBasins: "Godavari, Krishna, Musi, Manair, Wardha",
    districts: [
      { name: "Bhadradri Kothagudem (Bhadrachalam)", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 2.25, initialWaterLevel: 2.25, rainfallRate: 150, rainfallIntensity: 150, drainage: 20, inflow: 670, outflow: 210, status: "Godavari River Crossed 3rd Danger Mark (53 ft)", vulnerablePoint: "Kalyanakatta Temple Steps & Subhash Nagar" },
      { name: "Hyderabad", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.90, initialWaterLevel: 0.90, rainfallRate: 95, rainfallIntensity: 95, drainage: 48, inflow: 340, outflow: 260, status: "Musi River Himayat Sagar Dam Release", vulnerablePoint: "Moosarambagh Bridge & Chaderghat Causeway" },
      { name: "Warangal", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.80, initialWaterLevel: 0.80, rainfallRate: 90, rainfallIntensity: 90, drainage: 50, inflow: 280, outflow: 220, status: "Bhadrakali Lake Spillway Overflow", vulnerablePoint: "Nayeemnagar Sluice Nala" },
      { name: "Karimnagar", severityLevel: 1, severityLabel: "Level 1 Safe", waterDepthMeters: 0.40, initialWaterLevel: 0.40, rainfallRate: 60, rainfallIntensity: 60, drainage: 82, inflow: 130, outflow: 165, status: "Lower Manair Dam Controlled Outflow", vulnerablePoint: "Kothapalli Culvert" },
      { name: "Khammam", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 1.85, initialWaterLevel: 1.85, rainfallRate: 140, rainfallIntensity: 140, drainage: 24, inflow: 520, outflow: 200, status: "Munneru River Overflow Crosses Danger Mark", vulnerablePoint: "Karunagiri & Danavaigudem" },
      { name: "Nizamabad", severityLevel: 1, severityLabel: "Level 1 Safe", waterDepthMeters: 0.35, initialWaterLevel: 0.35, rainfallRate: 55, rainfallIntensity: 55, drainage: 85, inflow: 110, outflow: 145, status: "Sriramsagar Dam Discharging via Canals", vulnerablePoint: "Pochampad Spillway" }
    ]
  },
  {
    id: "tripura",
    name: "Tripura",
    type: "State",
    floodZone: "Gumti & Howrah River Valleys",
    riverBasins: "Howrah, Gumti, Manu, Khowai",
    districts: [
      { name: "West Tripura (Agartala)", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 1.65, initialWaterLevel: 1.65, rainfallRate: 135, rainfallIntensity: 135, drainage: 25, inflow: 460, outflow: 190, status: "Howrah River Embankment Overflow", vulnerablePoint: "Katakhall Canal Basin & Pratapgarh" },
      { name: "Gomati (Udaipur)", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.85, initialWaterLevel: 0.85, rainfallRate: 100, rainfallIntensity: 100, drainage: 48, inflow: 310, outflow: 240, status: "Gumti Dam High Reservoir Discharge", vulnerablePoint: "Amarpur Sluice Barrier" },
      { name: "Unakoti (Kailashahar)", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 1.75, initialWaterLevel: 1.75, rainfallRate: 140, rainfallIntensity: 140, drainage: 22, inflow: 490, outflow: 195, status: "Manu River Overwash across Town Bund", vulnerablePoint: "Chantail Low Causeway" }
    ]
  },
  {
    id: "uttar-pradesh",
    name: "Uttar Pradesh",
    type: "State",
    floodZone: "Central Gangetic Plains & Terai Belt",
    riverBasins: "Ganga, Yamuna, Rapti, Ghaghra, Saryu, Gomti",
    districts: [
      { name: "Gorakhpur", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 1.85, initialWaterLevel: 1.85, rainfallRate: 125, rainfallIntensity: 125, drainage: 24, inflow: 510, outflow: 200, status: "Rapti & Rohin River Ring Bund Breach", vulnerablePoint: "Tiwari Kalan Bandh & Domingarh" },
      { name: "Varanasi", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.95, initialWaterLevel: 0.95, rainfallRate: 85, rainfallIntensity: 85, drainage: 46, inflow: 340, outflow: 260, status: "Ganga Ghats Submerged Above Red Mark", vulnerablePoint: "Assi Ghat & Varuna Sluice Confluence" },
      { name: "Prayagraj (Allahabad)", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.90, initialWaterLevel: 0.90, rainfallRate: 80, rainfallIntensity: 80, drainage: 48, inflow: 320, outflow: 245, status: "Sangam Confluence Inundation", vulnerablePoint: "Daraganj Low Road & Beli Hospital Bund" },
      { name: "Ayodhya", severityLevel: 1, severityLabel: "Level 1 Safe", waterDepthMeters: 0.40, initialWaterLevel: 0.40, rainfallRate: 60, rainfallIntensity: 60, drainage: 82, inflow: 130, outflow: 165, status: "Saryu River Surplus Discharge Regulated", vulnerablePoint: "Ram Ki Paidi Perimeter" },
      { name: "Lucknow", severityLevel: 1, severityLabel: "Level 1 Safe", waterDepthMeters: 0.45, initialWaterLevel: 0.45, rainfallRate: 65, rainfallIntensity: 65, drainage: 80, inflow: 140, outflow: 175, status: "Gomti River Barrage Sluices Managed", vulnerablePoint: "Kudiya Ghat Low Walkway" },
      { name: "Kanpur Nagar", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.85, initialWaterLevel: 0.85, rainfallRate: 90, rainfallIntensity: 90, drainage: 48, inflow: 310, outflow: 240, status: "Ganga Barrage Heavy Discharge", vulnerablePoint: "Shuklaganj Low Bund" },
      { name: "Agra", severityLevel: 1, severityLabel: "Level 1 Safe", waterDepthMeters: 0.35, initialWaterLevel: 0.35, rainfallRate: 50, rainfallIntensity: 50, drainage: 85, inflow: 100, outflow: 135, status: "Yamuna Low Flood Level", vulnerablePoint: "Mehtab Bagh Low Riverbed" },
      { name: "Meerut", severityLevel: 1, severityLabel: "Level 1 Safe", waterDepthMeters: 0.30, initialWaterLevel: 0.30, rainfallRate: 45, rainfallIntensity: 45, drainage: 86, inflow: 85, outflow: 120, status: "Hindon River Normal Runoff", vulnerablePoint: "Kanker Khera Drain" }
    ]
  },
  {
    id: "uttarakhand",
    name: "Uttarakhand",
    type: "State",
    floodZone: "Upper Himalayan Torrent & Gorge Valleys",
    riverBasins: "Alaknanda, Bhagirathi, Mandakini, Ganga, Yamuna",
    districts: [
      { name: "Chamoli (Joshimath)", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 2.35, initialWaterLevel: 2.35, rainfallRate: 175, rainfallIntensity: 175, drainage: 18, inflow: 760, outflow: 240, status: "Alaknanda River Torrential Flash Surge", vulnerablePoint: "Raini Bridge Confluence & Vishnuprayag" },
      { name: "Haridwar & Rishikesh", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.95, initialWaterLevel: 0.95, rainfallRate: 105, rainfallIntensity: 105, drainage: 50, inflow: 360, outflow: 280, status: "Ganga Bhimgoda Barrage Warning Discharge", vulnerablePoint: "Triveni Ghat & Har Ki Pauri Low Steps" },
      { name: "Uttarkashi", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.85, initialWaterLevel: 0.85, rainfallRate: 100, rainfallIntensity: 100, drainage: 48, inflow: 320, outflow: 250, status: "Bhagirathi Gorge Spate", vulnerablePoint: "Tiloth Causeway & Joshiyara" },
      { name: "Dehradun", severityLevel: 1, severityLabel: "Level 1 Safe", waterDepthMeters: 0.40, initialWaterLevel: 0.40, rainfallRate: 70, rainfallIntensity: 70, drainage: 80, inflow: 140, outflow: 175, status: "Rispana & Bindal Rivers Runoff Managed", vulnerablePoint: "Harrawala Culvert" },
      { name: "Nainital", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.75, initialWaterLevel: 0.75, rainfallRate: 110, rainfallIntensity: 110, drainage: 52, inflow: 290, outflow: 235, status: "Naini Lake Overflow Sluice Active", vulnerablePoint: "Mall Road Lake Sump" },
      { name: "Rudraprayag", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 2.10, initialWaterLevel: 2.10, rainfallRate: 160, rainfallIntensity: 160, drainage: 20, inflow: 630, outflow: 215, status: "Mandakini & Alaknanda Confluence High Spill", vulnerablePoint: "Sangam Ghat Steps" }
    ]
  },
  {
    id: "west-bengal",
    name: "West Bengal",
    type: "State",
    floodZone: "Lower Gangetic Delta & North Bengal Plains",
    riverBasins: "Hooghly, Teesta, Damodar, Bhagirathi, Jaldhaka",
    districts: [
      { name: "Malda", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 1.90, initialWaterLevel: 1.90, rainfallRate: 130, rainfallIntensity: 130, drainage: 22, inflow: 530, outflow: 210, status: "Ganga & Fulhar River Severe Erosion", vulnerablePoint: "Manikchak Embankment & Bhutni Diara" },
      { name: "Murshidabad", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 1.85, initialWaterLevel: 1.85, rainfallRate: 125, rainfallIntensity: 125, drainage: 24, inflow: 510, outflow: 200, status: "Bhagirathi River Bank Breach", vulnerablePoint: "Farakka Downstream Spits & Samserganj" },
      { name: "Jalpaiguri", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 2.15, initialWaterLevel: 2.15, rainfallRate: 170, rainfallIntensity: 170, drainage: 18, inflow: 660, outflow: 210, status: "Teesta Barrage High Discharge Flood", vulnerablePoint: "Gajoldoba Barrage Cut & Malbazar" },
      { name: "Kolkata", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.90, initialWaterLevel: 0.90, rainfallRate: 100, rainfallIntensity: 100, drainage: 45, inflow: 340, outflow: 250, status: "Hooghly Lock Gates Closed & Sump Overload", vulnerablePoint: "Thanthania, Central Ave & Behala Chowrasta" },
      { name: "Howrah", severityLevel: 1, severityLabel: "Level 1 Safe", waterDepthMeters: 0.45, initialWaterLevel: 0.45, rainfallRate: 70, rainfallIntensity: 70, drainage: 78, inflow: 150, outflow: 185, status: "Drainage Canal Overflow Cleared", vulnerablePoint: "Tikiapara Sluice Basin" },
      { name: "North 24 Parganas", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.85, initialWaterLevel: 0.85, rainfallRate: 95, rainfallIntensity: 95, drainage: 48, inflow: 310, outflow: 240, status: "Ichamati River Spate", vulnerablePoint: "Bongaon Lowlands" },
      { name: "South 24 Parganas (Sundarbans)", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 1.80, initialWaterLevel: 1.80, rainfallRate: 140, rainfallIntensity: 140, drainage: 22, inflow: 520, outflow: 195, status: "Tidal Bore Embankment Breach in Estuary", vulnerablePoint: "Gosaba & Kakdwip River Bunds" },
      { name: "Darjeeling (Siliguri)", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.80, initialWaterLevel: 0.80, rainfallRate: 115, rainfallIntensity: 115, drainage: 52, inflow: 330, outflow: 260, status: "Mahananda River Spate", vulnerablePoint: "Champasari Low Bridge" }
    ]
  },

  // 8 Union Territories
  {
    id: "andaman-and-nicobar",
    name: "Andaman and Nicobar Islands",
    type: "Union Territory",
    floodZone: "Bay of Bengal Island Lowlands",
    riverBasins: "Kalpong River & Coastal Estuaries",
    districts: [
      { name: "Port Blair (South Andaman)", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.75, initialWaterLevel: 0.75, rainfallRate: 115, rainfallIntensity: 115, drainage: 50, inflow: 290, outflow: 225, status: "Tropical Cloudburst Tidal Ponding", vulnerablePoint: "Aberdeen Jetty Drain & Bathubasti" },
      { name: "Diglipur (North Andaman)", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.85, initialWaterLevel: 0.85, rainfallRate: 125, rainfallIntensity: 125, drainage: 46, inflow: 320, outflow: 240, status: "Kalpong River Overflow", vulnerablePoint: "Subhash Gram Causeway" }
    ]
  },
  {
    id: "chandigarh",
    name: "Chandigarh",
    type: "Union Territory",
    floodZone: "Shivalik Foothills Basin",
    riverBasins: "Sukhna Choe, Patiala Ki Rao",
    districts: [
      { name: "Chandigarh City", severityLevel: 1, severityLabel: "Level 1 Safe", waterDepthMeters: 0.40, initialWaterLevel: 0.40, rainfallRate: 70, rainfallIntensity: 70, drainage: 85, inflow: 130, outflow: 170, status: "Sukhna Lake Sluice Spill Regulated", vulnerablePoint: "Sukhna Choe Causeway" }
    ]
  },
  {
    id: "dadra-and-nagar-haveli-and-daman-and-diu",
    name: "Dadra and Nagar Haveli and Daman and Diu",
    type: "Union Territory",
    floodZone: "Arabian Sea Coastal Estuary",
    riverBasins: "Damanganga River",
    districts: [
      { name: "Daman", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.85, initialWaterLevel: 0.85, rainfallRate: 110, rainfallIntensity: 110, drainage: 48, inflow: 310, outflow: 235, status: "Damanganga High Tide Swell", vulnerablePoint: "Nani Daman Jetty Road" },
      { name: "Silvassa", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.75, initialWaterLevel: 0.75, rainfallRate: 95, rainfallIntensity: 95, drainage: 52, inflow: 270, outflow: 215, status: "Madhuban Dam Surplus Flow", vulnerablePoint: "Naroli Causeway" }
    ]
  },
  {
    id: "delhi",
    name: "Delhi (NCT)",
    type: "Union Territory",
    floodZone: "Yamuna Floodplain Corridor",
    riverBasins: "Yamuna River, Najafgarh Drain, Shahdara Drain",
    districts: [
      { name: "Central Delhi (Yamuna Banks)", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 1.65, initialWaterLevel: 1.65, rainfallRate: 115, rainfallIntensity: 115, drainage: 24, inflow: 470, outflow: 190, status: "Yamuna Crosses 208.6m Danger Mark", vulnerablePoint: "Old Railway Bridge & Monastery Market" },
      { name: "East Delhi (Mayur Vihar)", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 1.50, initialWaterLevel: 1.50, rainfallRate: 105, rainfallIntensity: 105, drainage: 25, inflow: 430, outflow: 185, status: "Floodplain Khadar Submersion", vulnerablePoint: "Yamuna Bazar & ISBT Kashmere Gate" },
      { name: "North Delhi (Civil Lines)", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.85, initialWaterLevel: 0.85, rainfallRate: 90, rainfallIntensity: 90, drainage: 48, inflow: 300, outflow: 230, status: "Ring Road Seepage near Bela Road", vulnerablePoint: "Bela Road Low Wall" },
      { name: "South West Delhi (Najafgarh)", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.75, initialWaterLevel: 0.75, rainfallRate: 85, rainfallIntensity: 85, drainage: 52, inflow: 270, outflow: 215, status: "Najafgarh Drain Backwater", vulnerablePoint: "Kakrola Regulator" },
      { name: "New Delhi", severityLevel: 1, severityLabel: "Level 1 Safe", waterDepthMeters: 0.30, initialWaterLevel: 0.30, rainfallRate: 50, rainfallIntensity: 50, drainage: 88, inflow: 85, outflow: 125, status: "NDMC Underground Storm Sump Safe", vulnerablePoint: "Connaught Place Outer Ring" }
    ]
  },
  {
    id: "jammu-and-kashmir",
    name: "Jammu and Kashmir",
    type: "Union Territory",
    floodZone: "Kashmir Valley & Chenab-Tawi Basins",
    riverBasins: "Jhelum, Chenab, Tawi, Sindh",
    districts: [
      { name: "Srinagar", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 1.80, initialWaterLevel: 1.80, rainfallRate: 125, rainfallIntensity: 125, drainage: 22, inflow: 510, outflow: 195, status: "Jhelum Crossed Ram Munshi Bagh Warning Mark", vulnerablePoint: "Rajbagh & Jawahar Nagar Bund" },
      { name: "Jammu City", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.85, initialWaterLevel: 0.85, rainfallRate: 100, rainfallIntensity: 100, drainage: 48, inflow: 320, outflow: 245, status: "Tawi River Flash Overflow", vulnerablePoint: "Gujjar Nagar Riverbank" },
      { name: "Anantnag", severityLevel: 3, severityLabel: "Level 3 Critical", waterDepthMeters: 1.70, initialWaterLevel: 1.70, rainfallRate: 115, rainfallIntensity: 115, drainage: 25, inflow: 460, outflow: 190, status: "Sangam Measuring Gauge High Spill", vulnerablePoint: "Padgampora Lowlands" },
      { name: "Baramulla", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.80, initialWaterLevel: 0.80, rainfallRate: 95, rainfallIntensity: 95, drainage: 50, inflow: 290, outflow: 225, status: "Wular Lake Outflow Choked", vulnerablePoint: "Sopore Low Bridge" }
    ]
  },
  {
    id: "ladakh",
    name: "Ladakh",
    type: "Union Territory",
    floodZone: "Trans-Himalayan Glacial Basins",
    riverBasins: "Indus, Zanskar, Nubra, Suru",
    districts: [
      { name: "Leh", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.65, initialWaterLevel: 0.65, rainfallRate: 60, rainfallIntensity: 60, drainage: 55, inflow: 260, outflow: 215, status: "Glacial Stream Flash Debris Run", vulnerablePoint: "Saboo Valley Nallah" },
      { name: "Kargil", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.70, initialWaterLevel: 0.70, rainfallRate: 70, rainfallIntensity: 70, drainage: 52, inflow: 280, outflow: 225, status: "Suru River Swell from Snowmelt", vulnerablePoint: "Baroo Bridge Approaches" }
    ]
  },
  {
    id: "lakshadweep",
    name: "Lakshadweep",
    type: "Union Territory",
    floodZone: "Arabian Sea Coral Atolls",
    riverBasins: "Lagoon Tidal Channels",
    districts: [
      { name: "Kavaratti", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.65, initialWaterLevel: 0.65, rainfallRate: 95, rainfallIntensity: 95, drainage: 52, inflow: 270, outflow: 220, status: "High Tide Seawall Overflow", vulnerablePoint: "Eastern Jetty Lagoon" },
      { name: "Agatti", severityLevel: 1, severityLabel: "Level 1 Safe", waterDepthMeters: 0.35, initialWaterLevel: 0.35, rainfallRate: 75, rainfallIntensity: 75, drainage: 80, inflow: 130, outflow: 165, status: "Reef Tidal Inundation Cleared", vulnerablePoint: "Airstrip Low Berm" }
    ]
  },
  {
    id: "puducherry",
    name: "Puducherry",
    type: "Union Territory",
    floodZone: "Coromandel Coastal Canal Zone",
    riverBasins: "Sankaraparani, Gingee River, Grand Canal",
    districts: [
      { name: "Puducherry Town", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.85, initialWaterLevel: 0.85, rainfallRate: 100, rainfallIntensity: 100, drainage: 48, inflow: 310, outflow: 235, status: "Grand Canal Tidal Lock & Urban Ponding", vulnerablePoint: "Rainbow Nagar Low Sump" },
      { name: "Karaikal", severityLevel: 2, severityLabel: "Level 2 Warning", waterDepthMeters: 0.80, initialWaterLevel: 0.80, rainfallRate: 95, rainfallIntensity: 95, drainage: 50, inflow: 280, outflow: 220, status: "Arasalar River Spate", vulnerablePoint: "Keezhakasakudy Causeway" }
    ]
  }
];
