export * from './profile';
// =====================
// Language & Core Types
// =====================
export type Language = 'en' | 'hi' | 'kn';

export type Season = 'kharif' | 'rabi' | 'zaid' | 'annual';

export type Severity = 'low' | 'medium' | 'high' | 'critical';

export type CropPlanStatus = 'planned' | 'sowing' | 'growing' | 'harvested' | 'sold';

export type InventoryCategory = 'seed' | 'fertilizer' | 'pesticide' | 'produce' | 'equipment' | 'other';

export type TransactionType = 'in' | 'out';

export type AttendanceStatus = 'present' | 'absent' | 'half_day';

export type PaymentStatus = 'pending' | 'paid';

export type SchemeCategory = 'insurance' | 'credit' | 'subsidy' | 'income_support' | 'soil' | 'irrigation' | 'pension';

export type ProductCategory = 'machinery' | 'fertilizer' | 'pesticide' | 'seed' | 'tool' | 'irrigation';

// =====================
// User & Profile
// =====================
export interface FarmerProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  preferred_language: Language;
  state: string;
  district: string | null;
  taluk: string | null;
  village: string | null;
  pincode: string | null;
  gps_lat: number | null;
  gps_lng: number | null;
  land_area_acres: number | null;
  primary_crops: string[] | null;
  created_at: string;
  updated_at: string;
}

// =====================
// Chat
// =====================
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  language?: Language;
}

export interface ChatSession {
  id: string;
  user_id: string;
  title: string | null;
  language: Language;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}

// =====================
// Crop Doctor
// =====================
export interface DiagnosisResult {
  disease: string;
  severity: Severity;
  confidence_percent: number;
  description: string;
  organic_remedy: string;
  chemical_treatment: ChemicalTreatment[];
  prevention: string;
  is_healthy: boolean;
}

export interface ChemicalTreatment {
  product: string;
  dose: string;
  frequency: string;
}

export interface CropScan {
  id: string;
  user_id: string;
  image_url: string | null;
  crop_name: string | null;
  disease_name: string | null;
  severity: Severity | null;
  diagnosis: DiagnosisResult | null;
  prescription: Prescription | null;
  location_lat: number | null;
  location_lng: number | null;
  is_community_shared: boolean;
  created_at: string;
}

export interface Prescription {
  products: PrescriptionProduct[];
  nearby_shops: NearbyShop[];
}

export interface PrescriptionProduct {
  name: string;
  type: string;
  quantity: string;
  price_range: string;
}

export interface NearbyShop {
  name: string;
  distance_km: number;
  lat: number;
  lng: number;
  address?: string;
}

// =====================
// Government Schemes
// =====================
export interface GovernmentScheme {
  id: string;
  scheme_code: string;
  name_en: string;
  name_hi: string | null;
  name_kn: string | null;
  ministry: string | null;
  category: SchemeCategory | null;
  description_en: string | null;
  description_hi: string | null;
  description_kn: string | null;
  eligibility_criteria: Record<string, unknown> | null;
  benefits: Record<string, unknown> | null;
  documents_required: string[] | null;
  application_url: string | null;
  portal_name: string | null;
  is_central: boolean;
  applicable_states: string[] | null;
  deadline_info: string | null;
  is_active: boolean;
  created_at: string;
}

export interface SchemeMatchResult {
  scheme: GovernmentScheme;
  eligibility: 'eligible' | 'not_eligible' | 'verify';
  explanation: string;
  matchScore: number;
}

// =====================
// Products / Marketplace
// =====================
export interface Product {
  id: string;
  name: string;
  name_hi: string | null;
  name_kn: string | null;
  category: ProductCategory;
  subcategory: string | null;
  description: string | null;
  image_url: string | null;
  mrp: number | null;
  subsidy_price: number | null;
  unit: string | null;
  amazon_search_query: string | null;
  flipkart_search_query: string | null;
  related_scheme_codes: string[] | null;
  tags: string[] | null;
  is_active: boolean;
  created_at: string;
}

// =====================
// Crop Planner
// =====================
export interface CropPlan {
  id: string;
  user_id: string;
  crop_name: string;
  variety: string | null;
  field_name: string | null;
  area_acres: number | null;
  season: Season;
  sowing_date: string | null;
  expected_harvest_date: string | null;
  actual_harvest_date: string | null;
  status: CropPlanStatus;
  notes: string | null;
  reminders: CropReminder[];
  created_at: string;
  updated_at: string;
}

export interface CropReminder {
  date: string;
  title: string;
  description: string;
  type: 'fertilizer' | 'pesticide' | 'irrigation' | 'harvest' | 'other';
  completed: boolean;
}

// =====================
// Inventory
// =====================
export interface InventoryItem {
  id: string;
  user_id: string;
  name: string;
  category: InventoryCategory;
  quantity: number;
  unit: string;
  purchase_date: string | null;
  purchase_price: number | null;
  supplier: string | null;
  low_stock_alert: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface InventoryTransaction {
  id: string;
  item_id: string;
  user_id: string;
  type: TransactionType;
  quantity: number;
  reason: string | null;
  date: string;
  created_at: string;
}

// =====================
// Labor Management (Digital Majdoor)
// =====================
export interface LaborWorker {
  id: string;
  farmer_id: string;
  name: string;
  phone: string | null;
  aadhaar_last4: string | null;
  daily_wage: number;
  skill_type: string;
  is_active: boolean;
  created_at: string;
}

export interface AttendanceRecord {
  id: string;
  farmer_id: string;
  worker_id: string;
  attendance_date: string;
  status: AttendanceStatus;
  task: string | null;
  hours_worked: number;
  wage_earned: number;
  payment_status: PaymentStatus;
  notes: string | null;
  created_at: string;
  worker?: LaborWorker;
}

export interface LaborLedgerSummary {
  worker: LaborWorker;
  total_days: number;
  total_earned: number;
  total_paid: number;
  total_pending: number;
  attendance: AttendanceRecord[];
}

export interface MinimumWage {
  id: string;
  state: string;
  category: string;
  daily_wage: number;
  effective_from: string;
  notification_ref: string | null;
  created_at: string;
}

// =====================
// Mandi Prices
// =====================
export interface MandiPrice {
  id: string;
  market_name: string;
  state: string;
  district: string | null;
  crop_name: string;
  variety: string | null;
  min_price: number;
  max_price: number;
  modal_price: number;
  price_date: string;
  arrivals_tonnes: number | null;
  source: string;
  created_at: string;
}

export interface MandiAnalysis {
  trend: 'rising' | 'falling' | 'stable';
  prediction_7d: string;
  recommendation: string;
  buyer_advice: string;
  storage_advice: string;
}

// =====================
// Weather
// =====================
export interface WeatherCurrent {
  temperature: number;
  humidity: number;
  precipitation: number;
  wind_speed: number;
  weather_code: number;
  condition: string;
  icon: string;
}

export interface WeatherForecast {
  date: string;
  temp_max: number;
  temp_min: number;
  precipitation_sum: number;
  precipitation_probability: number;
  condition: string;
  icon: string;
}

export interface WeatherData {
  current: WeatherCurrent;
  forecast: WeatherForecast[];
  location: {
    lat: number;
    lng: number;
  };
  lastUpdated: string;
}

// =====================
// Irrigation (JalSathi)
// =====================
export interface IrrigationAdvisory {
  should_irrigate: boolean;
  water_mm: number;
  water_liters_per_acre: number;
  pump_runtime_minutes: number;
  best_time: string;
  reason: string;
  next_check_days: number;
  crop: string;
  stage: string;
  weather_summary: string;
}

export interface IrrigationLog {
  id: string;
  user_id: string;
  crop_plan_id: string | null;
  crop_name: string;
  crop_stage: string | null;
  advisory_date: string;
  water_requirement_mm: number | null;
  pump_runtime_minutes: number | null;
  recommended_time: string | null;
  weather_data: Record<string, unknown> | null;
  soil_moisture_percent: number | null;
  was_irrigated: boolean | null;
  actual_irrigation_date: string | null;
  created_at: string;
}

// =====================
// App State (Zustand)
// =====================
export interface AppState {
  user: { id: string; email?: string } | null;
  farmerProfile: FarmerProfile | null;
  language: Language;
  setUser: (user: { id: string; email?: string } | null) => void;
  setFarmerProfile: (profile: FarmerProfile | null) => void;
  setLanguage: (lang: Language) => void;
}

// =====================
// Translation Map
// =====================
export interface TranslationMap {
  [key: string]: {
    en: string;
    hi: string;
    kn: string;
  };
}

// =====================
// Crop Data
// =====================
export interface CropInfo {
  name: string;
  name_hi: string;
  name_kn: string;
  emoji: string;
  duration_days: number;
  seasons: Season[];
  water_requirement_mm_per_day: number;
}

export const CROPS: CropInfo[] = [
  { name: 'Rice', name_hi: 'चावल', name_kn: 'ಅಕ್ಕಿ', emoji: '🌾', duration_days: 120, seasons: ['kharif'], water_requirement_mm_per_day: 6 },
  { name: 'Wheat', name_hi: 'गेहूँ', name_kn: 'ಗೋಧಿ', emoji: '🌾', duration_days: 130, seasons: ['rabi'], water_requirement_mm_per_day: 4 },
  { name: 'Jowar', name_hi: 'ज्वार', name_kn: 'ಜೋಳ', emoji: '🌾', duration_days: 110, seasons: ['kharif', 'rabi'], water_requirement_mm_per_day: 4 },
  { name: 'Ragi', name_hi: 'रागी', name_kn: 'ರಾಗಿ', emoji: '🌾', duration_days: 100, seasons: ['kharif'], water_requirement_mm_per_day: 3.5 },
  { name: 'Cotton', name_hi: 'कपास', name_kn: 'ಹತ್ತಿ', emoji: '🌿', duration_days: 160, seasons: ['kharif'], water_requirement_mm_per_day: 5 },
  { name: 'Tomato', name_hi: 'टमाटर', name_kn: 'ಟೊಮೇಟೋ', emoji: '🍅', duration_days: 90, seasons: ['kharif', 'rabi'], water_requirement_mm_per_day: 4.5 },
  { name: 'Onion', name_hi: 'प्याज', name_kn: 'ಈರುಳ್ಳಿ', emoji: '🧅', duration_days: 120, seasons: ['rabi', 'kharif'], water_requirement_mm_per_day: 3.5 },
  { name: 'Groundnut', name_hi: 'मूंगफली', name_kn: 'ಕಡಲೆಕಾಯಿ', emoji: '🥜', duration_days: 110, seasons: ['kharif'], water_requirement_mm_per_day: 4 },
  { name: 'Sunflower', name_hi: 'सूरजमुखी', name_kn: 'ಸೂರ್ಯಕಾಂತಿ', emoji: '🌻', duration_days: 95, seasons: ['rabi', 'kharif'], water_requirement_mm_per_day: 4.5 },
  { name: 'Potato', name_hi: 'आलू', name_kn: 'ಆಲೂಗೆಡ್ಡೆ', emoji: '🥔', duration_days: 90, seasons: ['rabi'], water_requirement_mm_per_day: 4 },
  { name: 'Sugarcane', name_hi: 'गन्ना', name_kn: 'ಕಬ್ಬು', emoji: '🎋', duration_days: 365, seasons: ['annual'], water_requirement_mm_per_day: 6 },
  { name: 'Mango', name_hi: 'आम', name_kn: 'ಮಾವಿನ ಹಣ್ಣು', emoji: '🥭', duration_days: 365, seasons: ['annual'], water_requirement_mm_per_day: 3 },
];

// =====================
// UI Translations
// =====================
export const UI_TEXT: TranslationMap = {
  appName: { en: 'KrishiSetu', hi: 'कृषि सेतु', kn: 'ಕೃಷಿ ಸೇತು' },
  dashboard: { en: 'Dashboard', hi: 'डैशबोर्ड', kn: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್' },
  cropDoctor: { en: 'Crop Doctor', hi: 'फसल डॉक्टर', kn: 'ಬೆಳೆ ವೈದ್ಯ' },
  chat: { en: 'KisanSarthi', hi: 'किसान सारथी', kn: 'ಕಿಸಾನ್ ಸಾರಥಿ' },
  mandi: { en: 'Mandi Prices', hi: 'मंडी भाव', kn: 'ಮಂಡಿ ಬೆಲೆ' },
  schemes: { en: 'Govt Schemes', hi: 'सरकारी योजना', kn: 'ಸರ್ಕಾರಿ ಯೋಜನೆ' },
  marketplace: { en: 'Marketplace', hi: 'बाज़ार', kn: 'ಮಾರುಕಟ್ಟೆ' },
  planner: { en: 'Crop Planner', hi: 'फसल योजना', kn: 'ಬೆಳೆ ಯೋಜನೆ' },
  inventory: { en: 'Inventory', hi: 'स्टॉक', kn: 'ದಾಸ್ತಾನು' },
  majdoor: { en: 'Digital Majdoor', hi: 'डिजिटल मजदूर', kn: 'ಡಿಜಿಟಲ್ ಮಜ್ದೂರ್' },
  jalsathi: { en: 'JalSathi', hi: 'जलसाथी', kn: 'ಜಲಸಾಥಿ' },
  login: { en: 'Login', hi: 'लॉगिन', kn: 'ಲಾಗಿನ್' },
  logout: { en: 'Logout', hi: 'लॉगआउट', kn: 'ಲಾಗ್ ಔಟ್' },
  profile: { en: 'Profile', hi: 'प्रोफ़ाइल', kn: 'ಪ್ರೊಫೈಲ್' },
  greeting: { en: 'Good morning', hi: 'शुभ प्रभात', kn: 'ಶುಭೋದಯ' },
  welcome: { en: 'Welcome to KrishiSetu', hi: 'कृषि सेतु में आपका स्वागत है', kn: 'ಕೃಷಿ ಸೇತುಗೆ ಸ್ವಾಗತ' },
  search: { en: 'Search', hi: 'खोजें', kn: 'ಹುಡುಕಿ' },
  save: { en: 'Save', hi: 'सहेजें', kn: 'ಉಳಿಸಿ' },
  cancel: { en: 'Cancel', hi: 'रद्द करें', kn: 'ರದ್ದುಮಾಡಿ' },
  delete: { en: 'Delete', hi: 'हटाएं', kn: 'ಅಳಿಸಿ' },
  add: { en: 'Add', hi: 'जोड़ें', kn: 'ಸೇರಿಸಿ' },
  edit: { en: 'Edit', hi: 'बदलें', kn: 'ಬದಲಿಸಿ' },
  loading: { en: 'Loading...', hi: 'लोड हो रहा है...', kn: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...' },
  noData: { en: 'No data available', hi: 'कोई डेटा उपलब्ध नहीं', kn: 'ಡೇಟಾ ಲಭ್ಯವಿಲ್ಲ' },
  error: { en: 'Something went wrong', hi: 'कुछ गड़बड़ हुई', kn: 'ಏನೋ ತಪ್ಪಾಗಿದೆ' },
};
