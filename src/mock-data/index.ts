export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: 'FARMER' | 'OFFICER' | 'ADMIN';
  phone: string;
  district?: string;
  state?: string;
}

export interface MockFarm {
  id: string;
  name: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  lat: number;
  lng: number;
  address: string;
  district: string;
  state: string;
  biosecurityScore: number; // 0 to 100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  totalAnimals: number;
  healthyCount: number;
  sickCount: number;
  mortalityCount: number; // deaths today
  symptoms: string[];
}

export interface MockBiosecurityRecord {
  id: string;
  farmId: string;
  date: string;
  disinfection: boolean;
  footbath: boolean;
  quarantine: boolean;
  ppe: boolean;
  otherChecks: boolean;
  complianceRate: number;
  photoProofUrl?: string;
}

export interface MockHealthRecord {
  id: string;
  farmId: string;
  date: string;
  totalAnimals: number;
  healthyCount: number;
  sickCount: number;
  mortalityCount: number;
  symptoms: string[];
  notes?: string;
}

export interface MockRiskAssessment {
  id: string;
  farmId: string;
  date: string;
  score: number;
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  factors: string[];
  details: string;
}

export interface MockRiskAlert {
  id: string;
  farmId: string;
  farmName: string;
  district: string;
  date: string;
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'PENDING' | 'INVESTIGATED' | 'RESOLVED';
  message: string;
}

export interface MockVisitor {
  id: string;
  farmId: string;
  name: string;
  phone: string;
  purpose: string;
  entryTime: string;
  exitTime?: string;
  qrCode: string;
  status: 'ACTIVE' | 'EXITED';
  plateNumber?: string;
  vehicleType?: string;
  disinfectionStatus?: boolean;
}

export interface MockDiseaseReport {
  id: string;
  farmId: string;
  farmName: string;
  reportedBy: string;
  symptoms: string[];
  notes: string;
  photoUrl?: string;
  voiceUrl?: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'INVESTIGATION' | 'RESOLVED';
  date: string;
}

export interface MockInspection {
  id: string;
  farmId: string;
  farmName: string;
  officerName: string;
  date: string;
  notes: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  actionsTaken?: string;
}

export interface MockNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  type: 'RISK_ALERT' | 'COMPLIANCE_REMINDER' | 'GOVERNMENT_ADVISORY' | 'INSPECTION_UPDATE';
  date: string;
}

// Users
export const mockUsers: MockUser[] = [
  { id: "usr-1", name: "Ramesh Kumar", email: "ramesh@farm.com", role: "FARMER", phone: "+91 98765 43210", district: "Namakkal", state: "Tamil Nadu" },
  { id: "usr-2", name: "Rajesh Selvan", email: "rajesh@farm.com", role: "FARMER", phone: "+91 98765 43211", district: "Namakkal", state: "Tamil Nadu" },
  { id: "usr-3", name: "Suresh Pillai", email: "suresh@farm.com", role: "FARMER", phone: "+91 98765 43212", district: "Namakkal", state: "Tamil Nadu" },
  { id: "usr-4", name: "Mohan Lal", email: "mohan@farm.com", role: "FARMER", phone: "+91 98765 43213", district: "Namakkal", state: "Tamil Nadu" },
  { id: "usr-5", name: "Ram Swaroop", email: "ramswaroop@farm.com", role: "FARMER", phone: "+91 98765 43214", district: "Namakkal", state: "Tamil Nadu" },
  { id: "usr-6", name: "Gopal Sundaram", email: "gopal@farm.com", role: "FARMER", phone: "+91 98765 43215", district: "Namakkal", state: "Tamil Nadu" },
  { id: "usr-7", name: "Dr. Amit Patel", email: "amit.patel@govt.in", role: "OFFICER", phone: "+91 99887 76655", district: "Namakkal", state: "Tamil Nadu" },
  { id: "usr-8", name: "Dr. Saranya Devi", email: "saranya.devi@govt.in", role: "OFFICER", phone: "+91 99887 76656", district: "Namakkal", state: "Tamil Nadu" },
  { id: "usr-9", name: "State Director Admin", email: "director.poultry@tn.gov.in", role: "ADMIN", phone: "+91 90000 11111", district: "Chennai", state: "Tamil Nadu" }
];

// Farms (Distributing around Namakkal, Tamil Nadu: 11.2189, 78.1672)
export const mockFarms: MockFarm[] = [
  {
    id: "frm-1",
    name: "Sri Murugan Layer Farm",
    farmerId: "usr-1",
    farmerName: "Ramesh Kumar",
    farmerPhone: "+91 98765 43210",
    lat: 11.2215,
    lng: 78.1560,
    address: "12/4, Sendamangalam Road, Namakkal",
    district: "Namakkal",
    state: "Tamil Nadu",
    biosecurityScore: 92,
    riskLevel: "LOW",
    totalAnimals: 10000,
    healthyCount: 9980,
    sickCount: 20,
    mortalityCount: 1,
    symptoms: []
  },
  {
    id: "frm-2",
    name: "Karthik Broiler Farm",
    farmerId: "usr-2",
    farmerName: "Rajesh Selvan",
    farmerPhone: "+91 98765 43211",
    lat: 11.2420,
    lng: 78.1750,
    address: "SF-212, Mohanur Road, Lathuvadi, Namakkal",
    district: "Namakkal",
    state: "Tamil Nadu",
    biosecurityScore: 85,
    riskLevel: "LOW",
    totalAnimals: 12000,
    healthyCount: 11950,
    sickCount: 48,
    mortalityCount: 2,
    symptoms: []
  },
  {
    id: "frm-3",
    name: "Selvam Breeder Poultry",
    farmerId: "usr-3",
    farmerName: "Suresh Pillai",
    farmerPhone: "+91 98765 43212",
    lat: 11.2050,
    lng: 78.1250,
    address: "Plot 42, Paramathi Velur Main Road, Namakkal",
    district: "Namakkal",
    state: "Tamil Nadu",
    biosecurityScore: 72,
    riskLevel: "MEDIUM",
    totalAnimals: 8500,
    healthyCount: 8410,
    sickCount: 82,
    mortalityCount: 8,
    symptoms: ["Cough", "Loss of appetite"]
  },
  {
    id: "frm-4",
    name: "Green Valley Country Chicken",
    farmerId: "usr-4",
    farmerName: "Mohan Lal",
    farmerPhone: "+91 98765 43213",
    lat: 11.1890,
    lng: 78.2040,
    address: "Gudalur Panchayat, Rasipuram Taluk, Namakkal",
    district: "Namakkal",
    state: "Tamil Nadu",
    biosecurityScore: 54,
    riskLevel: "HIGH",
    totalAnimals: 5000,
    healthyCount: 4850,
    sickCount: 125,
    mortalityCount: 25,
    symptoms: ["Cough", "Fever", "Breathing difficulty"]
  },
  {
    id: "frm-5",
    name: "Ponni Poultry Farm",
    farmerId: "usr-5",
    farmerName: "Ram Swaroop",
    farmerPhone: "+91 98765 43214",
    lat: 11.2650,
    lng: 78.1120,
    address: "15-B, Tiruchengodu Road, Namakkal",
    district: "Namakkal",
    state: "Tamil Nadu",
    biosecurityScore: 32,
    riskLevel: "CRITICAL",
    totalAnimals: 15000,
    healthyCount: 14200,
    sickCount: 650,
    mortalityCount: 150,
    symptoms: ["Sudden death", "Diarrhea", "Breathing difficulty"]
  },
  {
    id: "frm-6",
    name: "Kaveri Egg Haven",
    farmerId: "usr-6",
    farmerName: "Gopal Sundaram",
    farmerPhone: "+91 98765 43215",
    lat: 11.1540,
    lng: 78.1430,
    address: "Trichy Road, Puduchatram, Namakkal",
    district: "Namakkal",
    state: "Tamil Nadu",
    biosecurityScore: 80,
    riskLevel: "LOW",
    totalAnimals: 9000,
    healthyCount: 8975,
    sickCount: 22,
    mortalityCount: 3,
    symptoms: []
  },
  // Sub-district 2
  {
    id: "frm-7",
    name: "Kongu Hatchery & Farm",
    farmerId: "usr-1",
    farmerName: "Ramesh Kumar",
    farmerPhone: "+91 98765 43210",
    lat: 11.2850,
    lng: 78.2430,
    address: "Erumapatty, Namakkal",
    district: "Namakkal",
    state: "Tamil Nadu",
    biosecurityScore: 88,
    riskLevel: "LOW",
    totalAnimals: 22000,
    healthyCount: 21960,
    sickCount: 35,
    mortalityCount: 5,
    symptoms: []
  },
  {
    id: "frm-8",
    name: "Malar Poultry Centre",
    farmerId: "usr-2",
    farmerName: "Rajesh Selvan",
    farmerPhone: "+91 98765 43211",
    lat: 11.2310,
    lng: 78.2250,
    address: "Kalappanaickenpatty, Namakkal",
    district: "Namakkal",
    state: "Tamil Nadu",
    biosecurityScore: 68,
    riskLevel: "MEDIUM",
    totalAnimals: 7500,
    healthyCount: 7420,
    sickCount: 72,
    mortalityCount: 8,
    symptoms: ["Diarrhea"]
  },
  {
    id: "frm-9",
    name: "Apex Broilers",
    farmerId: "usr-3",
    farmerName: "Suresh Pillai",
    farmerPhone: "+91 98765 43212",
    lat: 11.2580,
    lng: 78.0820,
    address: "Pallipalayam Road, Tiruchengodu, Namakkal",
    district: "Namakkal",
    state: "Tamil Nadu",
    biosecurityScore: 42,
    riskLevel: "HIGH",
    totalAnimals: 11000,
    healthyCount: 10750,
    sickCount: 210,
    mortalityCount: 40,
    symptoms: ["Breathing difficulty", "Loss of appetite"]
  },
  {
    id: "frm-10",
    name: "Raja Layer & Pullets",
    farmerId: "usr-4",
    farmerName: "Mohan Lal",
    farmerPhone: "+91 98765 43213",
    lat: 11.1680,
    lng: 78.0610,
    address: "Mohanur Panchayat, Namakkal",
    district: "Namakkal",
    state: "Tamil Nadu",
    biosecurityScore: 78,
    riskLevel: "LOW",
    totalAnimals: 13500,
    healthyCount: 13455,
    sickCount: 40,
    mortalityCount: 5,
    symptoms: []
  },
  {
    id: "frm-11",
    name: "Sowmya Duck & Poultry",
    farmerId: "usr-5",
    farmerName: "Ram Swaroop",
    farmerPhone: "+91 98765 43214",
    lat: 11.2980,
    lng: 78.1990,
    address: "Senthamangalam Taluk, Namakkal",
    district: "Namakkal",
    state: "Tamil Nadu",
    biosecurityScore: 94,
    riskLevel: "LOW",
    totalAnimals: 4000,
    healthyCount: 3995,
    sickCount: 5,
    mortalityCount: 0,
    symptoms: []
  },
  {
    id: "frm-12",
    name: "Coimbatore Pioneer Farm",
    farmerId: "usr-6",
    farmerName: "Gopal Sundaram",
    farmerPhone: "+91 98765 43215",
    lat: 11.0180,
    lng: 76.9550, // Coimbatore
    address: "Pollachi Road, Coimbatore",
    district: "Coimbatore",
    state: "Tamil Nadu",
    biosecurityScore: 82,
    riskLevel: "LOW",
    totalAnimals: 18000,
    healthyCount: 17920,
    sickCount: 75,
    mortalityCount: 5,
    symptoms: []
  },
  {
    id: "frm-13",
    name: "Vellore Layer Grid",
    farmerId: "usr-1",
    farmerName: "Ramesh Kumar",
    farmerPhone: "+91 98765 43210",
    lat: 12.9160,
    lng: 79.1320, // Vellore
    address: "Katpadi Road, Vellore",
    district: "Vellore",
    state: "Tamil Nadu",
    biosecurityScore: 50,
    riskLevel: "HIGH",
    totalAnimals: 14000,
    healthyCount: 13620,
    sickCount: 310,
    mortalityCount: 70,
    symptoms: ["Sudden death", "Fever"]
  },
  {
    id: "frm-14",
    name: "Salem Broiler Trust",
    farmerId: "usr-2",
    farmerName: "Rajesh Selvan",
    farmerPhone: "+91 98765 43211",
    lat: 11.6640,
    lng: 78.1460, // Salem
    address: "Omalur Bypass Road, Salem",
    district: "Salem",
    state: "Tamil Nadu",
    biosecurityScore: 70,
    riskLevel: "MEDIUM",
    totalAnimals: 9500,
    healthyCount: 9415,
    sickCount: 70,
    mortalityCount: 15,
    symptoms: ["Cough"]
  },
  {
    id: "frm-15",
    name: "Dr. Amit's Experimental Farm",
    farmerId: "usr-7",
    farmerName: "Dr. Amit Patel",
    farmerPhone: "+91 99887 76655",
    lat: 11.2330,
    lng: 78.1420,
    address: "KVK Campus, Namakkal",
    district: "Namakkal",
    state: "Tamil Nadu",
    biosecurityScore: 98,
    riskLevel: "LOW",
    totalAnimals: 2000,
    healthyCount: 1999,
    sickCount: 1,
    mortalityCount: 0,
    symptoms: []
  }
];

// Daily Biosecurity Records for FRM-1 to FRM-5 (last 7 days)
export const mockBiosecurityRecords: MockBiosecurityRecord[] = [];
const days = 7;
for (let d = 0; d < days; d++) {
  const dateStr = new Date(Date.now() - d * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  mockBiosecurityRecords.push(
    { id: `bio-1-${d}`, farmId: "frm-1", date: dateStr, disinfection: true, footbath: true, quarantine: true, ppe: true, otherChecks: true, complianceRate: 100 },
    { id: `bio-2-${d}`, farmId: "frm-2", date: dateStr, disinfection: true, footbath: true, quarantine: false, ppe: true, otherChecks: true, complianceRate: 80 },
    { id: `bio-3-${d}`, farmId: "frm-3", date: dateStr, disinfection: true, footbath: false, quarantine: false, ppe: true, otherChecks: false, complianceRate: 40 },
    { id: `bio-4-${d}`, farmId: "frm-4", date: dateStr, disinfection: false, footbath: false, quarantine: true, ppe: false, otherChecks: false, complianceRate: 20 },
    { id: `bio-5-${d}`, farmId: "frm-5", date: dateStr, disinfection: false, footbath: false, quarantine: false, ppe: false, otherChecks: false, complianceRate: 0 }
  );
}

// Daily Health Records (last 7 days)
export const mockHealthRecords: MockHealthRecord[] = [];
for (let d = 0; d < days; d++) {
  const dateStr = new Date(Date.now() - d * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  mockHealthRecords.push(
    { id: `hlth-1-${d}`, farmId: "frm-1", date: dateStr, totalAnimals: 10000, healthyCount: 9980, sickCount: 19, mortalityCount: 1, symptoms: [] },
    { id: `hlth-2-${d}`, farmId: "frm-2", date: dateStr, totalAnimals: 12000, healthyCount: 11950, sickCount: 48, mortalityCount: 2, symptoms: [] },
    { id: `hlth-3-${d}`, farmId: "frm-3", date: dateStr, totalAnimals: 8500, healthyCount: 8410, sickCount: 82, mortalityCount: d === 0 ? 8 : 2, symptoms: d === 0 ? ["Cough", "Loss of appetite"] : [] },
    { id: `hlth-4-${d}`, farmId: "frm-4", date: dateStr, totalAnimals: 5000, healthyCount: 4850, sickCount: 125, mortalityCount: d === 0 ? 25 : 5, symptoms: d === 0 ? ["Cough", "Fever", "Breathing difficulty"] : ["Cough"] },
    { id: `hlth-5-${d}`, farmId: "frm-5", date: dateStr, totalAnimals: 15000, healthyCount: 14200, sickCount: 650, mortalityCount: d === 0 ? 150 : 25, symptoms: ["Sudden death", "Diarrhea", "Breathing difficulty"] }
  );
}

// Risk Assessments (Generated by Risk Engine)
export const mockRiskAssessments: MockRiskAssessment[] = [
  {
    id: "risk-1",
    farmId: "frm-5",
    date: new Date().toISOString(),
    score: 95,
    level: "CRITICAL",
    factors: ["High Mortality Anomaly (+150 deaths today)", "Critical Symptoms: Sudden Death", "Zero Biosecurity Compliance today", "Unregistered vehicle visited in quarantine zone"],
    details: "Mortality is 10x standard average. Major risk of Avian Influenza or Newcastle disease. Quarantine recommended immediately."
  },
  {
    id: "risk-2",
    farmId: "frm-4",
    date: new Date().toISOString(),
    score: 74,
    level: "HIGH",
    factors: ["Increased Mortality (25 deaths today)", "Breathing Difficulty & Fever detected", "Low Biosecurity Compliance (20%)"],
    details: "Elevated risk of infectious bronchitis. Increase disinfection and limit farm entries."
  },
  {
    id: "risk-3",
    farmId: "frm-3",
    date: new Date().toISOString(),
    score: 45,
    level: "MEDIUM",
    factors: ["Minor Mortality rise (8 deaths)", "Coughing detected in flock", "Moderate Biosecurity (40%)"],
    details: "Early indicators of respiratory distress. Monitor closely for next 24 hours."
  },
  {
    id: "risk-4",
    farmId: "frm-1",
    date: new Date().toISOString(),
    score: 12,
    level: "LOW",
    factors: ["Minimal mortality within norms", "Excellent biosecurity score (92%)"],
    details: "All parameters are standard. Keep maintaining disinfection protocols."
  }
];

// Active Alerts for Vet Dashboard
export const mockRiskAlerts: MockRiskAlert[] = [
  {
    id: "alt-1",
    farmId: "frm-5",
    farmName: "Ponni Poultry Farm",
    district: "Namakkal",
    date: new Date().toISOString(),
    level: "CRITICAL",
    status: "PENDING",
    message: "CRITICAL ALERT: Sudden death cases (150 dead) with severe biosecurity failure."
  },
  {
    id: "alt-2",
    farmId: "frm-4",
    farmName: "Green Valley Country Chicken",
    district: "Namakkal",
    date: new Date().toISOString(),
    level: "HIGH",
    status: "PENDING",
    message: "HIGH ALERT: Anomaly in mortality rate (25 dead today) with breathing difficulty."
  },
  {
    id: "alt-3",
    farmId: "frm-13",
    farmName: "Vellore Layer Grid",
    district: "Vellore",
    date: new Date().toISOString(),
    level: "HIGH",
    status: "PENDING",
    message: "HIGH ALERT: Mortality spike (70 dead) in Vellore border zone."
  },
  {
    id: "alt-4",
    farmId: "frm-3",
    farmName: "Selvam Breeder Poultry",
    district: "Namakkal",
    date: new Date().toISOString(),
    level: "MEDIUM",
    status: "INVESTIGATED",
    message: "MEDIUM ALERT: Cough and loss of appetite detected in flock."
  }
];

// Visitors & Contact Tracing log
export const mockVisitors: MockVisitor[] = [
  {
    id: "vis-1",
    farmId: "frm-5",
    name: "Arun Swaminathan",
    phone: "+91 95432 10987",
    purpose: "Feed Delivery",
    entryTime: new Date(Date.now() - 4 * 3600000).toISOString(), // 4h ago
    qrCode: "QR_VIS_ARUN_FEED_5",
    status: "ACTIVE",
    plateNumber: "TN-28-AH-4521",
    vehicleType: "Truck",
    disinfectionStatus: false
  },
  {
    id: "vis-2",
    farmId: "frm-1",
    name: "Dr. Amit Patel",
    phone: "+91 99887 76655",
    purpose: "Routine Vet Visit",
    entryTime: new Date(Date.now() - 24 * 3600000).toISOString(),
    exitTime: new Date(Date.now() - 23 * 3600000).toISOString(),
    qrCode: "QR_VIS_AMIT_VET_1",
    status: "EXITED",
    plateNumber: "TN-28-G-0021",
    vehicleType: "Jeep",
    disinfectionStatus: true
  },
  {
    id: "vis-3",
    farmId: "frm-3",
    name: "Palanisamy G.",
    phone: "+91 94444 88888",
    purpose: "Egg Collection",
    entryTime: new Date(Date.now() - 36 * 3600000).toISOString(),
    exitTime: new Date(Date.now() - 35 * 3600000).toISOString(),
    qrCode: "QR_VIS_PALANI_EGG_3",
    status: "EXITED",
    plateNumber: "TN-28-BD-9824",
    vehicleType: "Mini Truck",
    disinfectionStatus: true
  },
  {
    id: "vis-4",
    farmId: "frm-5",
    name: "Kumar Feed Depot",
    phone: "+91 94432 23456",
    purpose: "Feed Supply",
    entryTime: new Date(Date.now() - 48 * 3600000).toISOString(),
    exitTime: new Date(Date.now() - 47 * 3600000).toISOString(),
    qrCode: "QR_VIS_KUMAR_FEED_5",
    status: "EXITED",
    plateNumber: "TN-30-W-8742",
    vehicleType: "Truck",
    disinfectionStatus: false
  }
];

// Disease Suspect Reports
export const mockDiseaseReports: MockDiseaseReport[] = [
  {
    id: "rep-1",
    farmId: "frm-5",
    farmName: "Ponni Poultry Farm",
    reportedBy: "Ram Swaroop",
    symptoms: ["Sudden death", "Diarrhea"],
    notes: "Sudden increase in death count since morning. Swollen combs and wattles. Requesting immediate investigation.",
    status: "SUBMITTED",
    date: new Date().toISOString(),
    photoUrl: "/images/mock-symptom-poultry.jpg"
  },
  {
    id: "rep-2",
    farmId: "frm-3",
    farmName: "Selvam Breeder Poultry",
    reportedBy: "Suresh Pillai",
    symptoms: ["Cough", "Loss of appetite"],
    notes: "Birds are gasping for air and making a gurgling sound. Feeding has dropped by 30%.",
    status: "INVESTIGATION",
    date: new Date(Date.now() - 24 * 3600000).toISOString()
  }
];

// Inspections
export const mockInspections: MockInspection[] = [
  {
    id: "ins-1",
    farmId: "frm-5",
    farmName: "Ponni Poultry Farm",
    officerName: "Dr. Amit Patel",
    date: new Date(Date.now() + 18000000).toISOString(), // in 5 hours
    notes: "Inspect sudden mortality spike. Check quarantine protocols, disinfection records. Collect blood and swab samples for lab confirmation.",
    status: "SCHEDULED"
  },
  {
    id: "ins-2",
    farmId: "frm-3",
    farmName: "Selvam Breeder Poultry",
    officerName: "Dr. Saranya Devi",
    date: new Date(Date.now() - 12 * 3600000).toISOString(), // 12 hours ago
    notes: "Investigate chronic respiratory gurgling symptoms.",
    status: "COMPLETED",
    actionsTaken: "Administered antibiotics in drinking water. Footbath disinfection renewed. Instructed farmer to sanitize surrounding foliage."
  }
];

// Notifications
export const mockNotifications: MockNotification[] = [
  {
    id: "not-1",
    userId: "usr-1",
    title: "Complete Your Daily Checklist",
    message: "You haven't completed your daily biosecurity verification today. Please log disinfection status.",
    read: false,
    type: "COMPLIANCE_REMINDER",
    date: new Date().toISOString()
  },
  {
    id: "not-2",
    userId: "usr-7",
    title: "CRITICAL: Anomaly at Ponni Farm",
    message: "Risk engine detected CRITICAL levels at Ponni Poultry Farm (Namakkal) due to sudden mortality spike.",
    read: false,
    type: "RISK_ALERT",
    date: new Date().toISOString()
  },
  {
    id: "not-3",
    userId: "usr-1",
    title: "Government Advisory: Avian Influenza",
    message: "High risk of seasonal Avian Influenza reported in neighbouring districts. Strengthen footbath sanitation.",
    read: true,
    type: "GOVERNMENT_ADVISORY",
    date: new Date(Date.now() - 3 * 24 * 3600000).toISOString()
  }
];
