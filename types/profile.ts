export interface FarmerProfile {
  id: string;
  user_id: string;

  // Basic Info
  full_name: string;
  age: number | null;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null;
  phone: string | null;
  profile_photo_url: string | null;

  // Location
  village_or_city: string;
  taluk: string | null;
  district: string;
  state: string;
  pincode: string | null;
  gps_lat: number | null;
  gps_lng: number | null;

  // Farm Details
  land_size_acres: number;
  land_ownership: 'owned' | 'leased' | 'both' | null;
  primary_crops: string[];
  farming_type: 'traditional' | 'organic' | 'mixed' | 'commercial' | null;
  irrigation_source: 'rainfed' | 'canal' | 'borewell' | 'drip' | 'sprinkler' | 'multiple' | null;

  // Financial
  yearly_income_range: 'under_1_lakh' | '1_to_2_lakh' | '2_to_5_lakh' | '5_to_10_lakh' | 'above_10_lakh' | null;
  has_kisan_credit_card: boolean;
  has_crop_insurance: boolean;
  bank_account_linked: boolean;

  // Preferences
  preferred_language: 'en' | 'hi' | 'kn' | 'te' | 'ta' | 'mr';
  notification_preference: 'app' | 'sms' | 'both' | 'none';

  // Meta
  profile_completed: boolean;
  onboarding_step_completed: number;
  created_at: string;
  updated_at: string;
}
