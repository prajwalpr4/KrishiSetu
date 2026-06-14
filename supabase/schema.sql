-- ============================================
-- KrishiSetu Database Schema (Supabase/PostgreSQL)
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================
-- 1. Farmer Profiles
-- ============================================
create table if not exists farmer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,

  -- Basic Info
  full_name VARCHAR(200) NOT NULL,
  age INTEGER CHECK (age >= 18 AND age <= 100),
  gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  phone VARCHAR(15),
  profile_photo_url TEXT,

  -- Location
  village_or_city VARCHAR(200) NOT NULL,
  taluk VARCHAR(200),
  district VARCHAR(200) NOT NULL,
  state VARCHAR(100) NOT NULL,
  pincode VARCHAR(10),
  gps_lat DECIMAL(10, 8),
  gps_lng DECIMAL(11, 8),

  -- Farm Details
  land_size_acres DECIMAL(8, 2) NOT NULL,
  land_ownership VARCHAR(30) CHECK (land_ownership IN ('owned', 'leased', 'both')),
  primary_crops TEXT[] DEFAULT '{}',
  farming_type VARCHAR(30) CHECK (farming_type IN ('traditional', 'organic', 'mixed', 'commercial')),
  irrigation_source VARCHAR(50) CHECK (irrigation_source IN ('rainfed', 'canal', 'borewell', 'drip', 'sprinkler', 'multiple')),

  -- Financial
  yearly_income_range VARCHAR(50) CHECK (yearly_income_range IN (
    'under_1_lakh',
    '1_to_2_lakh',
    '2_to_5_lakh',
    '5_to_10_lakh',
    'above_10_lakh'
  )),
  has_kisan_credit_card BOOLEAN DEFAULT false,
  has_crop_insurance BOOLEAN DEFAULT false,
  bank_account_linked BOOLEAN DEFAULT false,

  -- Preferences
  preferred_language VARCHAR(5) DEFAULT 'en' CHECK (preferred_language IN ('en', 'hi', 'kn', 'te', 'ta', 'mr')),
  notification_preference VARCHAR(20) DEFAULT 'both' CHECK (notification_preference IN ('app', 'sms', 'both', 'none')),

  -- Meta
  profile_completed BOOLEAN DEFAULT false,
  onboarding_step_completed INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. Crop Plans
-- ============================================
create table if not exists crop_plans (
  id uuid primary key default uuid_generate_v4(),
  farmer_id uuid references farmer_profiles(id) on delete cascade,
  crop_name text not null,
  variety text,
  field_name text,
  area_acres numeric(6,2),
  season text check (season in ('kharif', 'rabi', 'zaid', 'annual')),
  sowing_date date,
  expected_harvest_date date,
  actual_harvest_date date,
  status text default 'planned' check (status in ('planned', 'sowing', 'growing', 'harvested', 'sold')),
  yield_kg numeric(10,2),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- 3. Crop Scans (Disease Detection)
-- ============================================
create table if not exists crop_scans (
  id uuid primary key default uuid_generate_v4(),
  farmer_id uuid references farmer_profiles(id) on delete cascade,
  crop_name text,
  image_url text,
  disease_name text,
  severity text check (severity in ('low', 'medium', 'high', 'critical')),
  confidence_percent numeric(5,2),
  diagnosis_json jsonb,
  is_healthy boolean default false,
  share_with_community boolean default false,
  created_at timestamptz default now()
);

-- ============================================
-- 4. Chat History
-- ============================================
create table if not exists chat_messages (
  id uuid primary key default uuid_generate_v4(),
  farmer_id uuid references farmer_profiles(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  language text default 'en',
  created_at timestamptz default now()
);

-- ============================================
-- 5. Government Schemes
-- ============================================
create table if not exists government_schemes (
  id uuid primary key default uuid_generate_v4(),
  scheme_code text unique not null,
  name_en text not null,
  name_hi text,
  name_kn text,
  ministry text,
  category text,
  description_en text,
  description_hi text,
  description_kn text,
  eligibility_criteria jsonb,
  benefits jsonb,
  documents_required text[],
  application_url text,
  portal_name text,
  is_central boolean default true,
  applicable_states text[],
  deadline_info text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ============================================
-- 6. Mandi Prices Cache
-- ============================================
create table if not exists mandi_prices (
  id uuid primary key default uuid_generate_v4(),
  market_name text not null,
  state text,
  district text,
  crop_name text not null,
  variety text,
  min_price numeric(10,2),
  max_price numeric(10,2),
  modal_price numeric(10,2),
  price_date date,
  arrivals_tonnes numeric(10,2),
  source text default 'agmarknet',
  created_at timestamptz default now()
);

-- ============================================
-- 7. Inventory
-- ============================================
create table if not exists inventory_items (
  id uuid primary key default uuid_generate_v4(),
  farmer_id uuid references farmer_profiles(id) on delete cascade,
  name text not null,
  category text check (category in ('Seed', 'Fertilizer', 'Pesticide', 'Produce', 'Equipment', 'Other')),
  quantity numeric(10,2) default 0,
  unit text default 'kg',
  purchase_price numeric(10,2),
  low_stock_alert numeric(10,2) default 1,
  supplier text,
  expiry_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists inventory_transactions (
  id uuid primary key default uuid_generate_v4(),
  farmer_id uuid references farmer_profiles(id) on delete cascade,
  item_id uuid references inventory_items(id) on delete cascade,
  type text check (type in ('in', 'out')),
  quantity numeric(10,2),
  reason text,
  created_at timestamptz default now()
);

-- ============================================
-- 8. Farm Workers (Digital Majdoor)
-- ============================================
create table if not exists farm_workers (
  id uuid primary key default uuid_generate_v4(),
  farmer_id uuid references farmer_profiles(id) on delete cascade,
  name text not null,
  phone text,
  aadhaar_last4 text,
  daily_wage numeric(8,2) default 425,
  skill_type text default 'general',
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists worker_attendance (
  id uuid primary key default uuid_generate_v4(),
  farmer_id uuid references farmer_profiles(id) on delete cascade,
  worker_id uuid references farm_workers(id) on delete cascade,
  attendance_date date not null,
  status text check (status in ('present', 'half_day', 'absent')),
  task text,
  hours_worked numeric(4,1),
  wage_earned numeric(8,2),
  payment_status text default 'pending' check (payment_status in ('pending', 'paid')),
  paid_at timestamptz,
  notes text,
  created_at timestamptz default now()
);

-- ============================================
-- Row Level Security Policies
-- ============================================
alter table farmer_profiles enable row level security;
alter table crop_plans enable row level security;
alter table crop_scans enable row level security;
alter table chat_messages enable row level security;
alter table inventory_items enable row level security;
alter table inventory_transactions enable row level security;
alter table farm_workers enable row level security;
alter table worker_attendance enable row level security;

-- Farmer can only see/edit their own data
ALTER TABLE farmer_profiles ENABLE ROW LEVEL SECURITY;
create policy "Users manage own profile"
  on farmer_profiles for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS farmer_profiles_updated_at ON farmer_profiles;
CREATE TRIGGER farmer_profiles_updated_at
  BEFORE UPDATE ON farmer_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

create policy "Farmer sees own crop plans"
  on crop_plans for all using (farmer_id in (select id from farmer_profiles where user_id = auth.uid()));

create policy "Farmer sees own scans"
  on crop_scans for all using (farmer_id in (select id from farmer_profiles where user_id = auth.uid()));

create policy "Farmer sees own chat"
  on chat_messages for all using (farmer_id in (select id from farmer_profiles where user_id = auth.uid()));

create policy "Farmer sees own inventory"
  on inventory_items for all using (farmer_id in (select id from farmer_profiles where user_id = auth.uid()));

create policy "Farmer sees own transactions"
  on inventory_transactions for all using (farmer_id in (select id from farmer_profiles where user_id = auth.uid()));

create policy "Farmer sees own workers"
  on farm_workers for all using (farmer_id in (select id from farmer_profiles where user_id = auth.uid()));

create policy "Farmer sees own attendance"
  on worker_attendance for all using (farmer_id in (select id from farmer_profiles where user_id = auth.uid()));

-- Government schemes are public read
alter table government_schemes enable row level security;
create policy "Schemes are public read"
  on government_schemes for select using (true);

alter table mandi_prices enable row level security;
create policy "Mandi prices are public read"
  on mandi_prices for select using (true);

-- ============================================
-- Indexes for Performance
-- ============================================
create index if not exists idx_crop_plans_farmer on crop_plans(farmer_id);
create index if not exists idx_crop_scans_farmer on crop_scans(farmer_id);
create index if not exists idx_chat_farmer on chat_messages(farmer_id);
create index if not exists idx_mandi_crop on mandi_prices(crop_name);
create index if not exists idx_mandi_state on mandi_prices(state);
create index if not exists idx_inventory_farmer on inventory_items(farmer_id);
create index if not exists idx_workers_farmer on farm_workers(farmer_id);
create index if not exists idx_attendance_farmer on worker_attendance(farmer_id);
create index if not exists idx_attendance_date on worker_attendance(attendance_date);

-- ============================================
-- Seed Government Schemes
-- ============================================
insert into government_schemes (scheme_code, name_en, name_hi, name_kn, ministry, category, description_en, description_hi, description_kn, eligibility_criteria, benefits, documents_required, application_url, portal_name) values
('PM-KISAN', 'PM Kisan Samman Nidhi', 'पीएम किसान सम्मान निधि', 'ಪಿಎಂ ಕಿಸಾನ್ ಸಮ್ಮಾನ್ ನಿಧಿ', 'Ministry of Agriculture & Farmers Welfare', 'income_support', 'Income support of ₹6,000/year to all landholding farmer families in 3 equal installments of ₹2,000 each.', 'सभी भूमिधारक किसान परिवारों को ₹2,000 की 3 समान किस्तों में ₹6,000/वर्ष की आय सहायता।', 'ಎಲ್ಲಾ ಭೂ ಹಿಡುವಳಿದಾರ ರೈತ ಕುಟುಂಬಗಳಿಗೆ ₹2,000 ರ 3 ಸಮಾನ ಕಂತುಗಳಲ್ಲಿ ₹6,000/ವರ್ಷ ಆದಾಯ ಬೆಂಬಲ.', '{"land_required": true}', '{"amount": 6000, "type": "direct_benefit_transfer", "frequency": "annual"}', '{"Aadhaar Card", "Land records", "Bank passbook", "Mobile linked to Aadhaar"}', 'https://pmkisan.gov.in', 'PM-Kisan Portal'),
('PMFBY', 'Pradhan Mantri Fasal Bima Yojana', 'प्रधानमंत्री फसल बीमा योजना', 'ಪ್ರಧಾನ ಮಂತ್ರಿ ಫಸಲ್ ಬಿಮಾ ಯೋಜನೆ', 'Ministry of Agriculture & Farmers Welfare', 'insurance', 'Crop insurance scheme. Premium: 2% Kharif, 1.5% Rabi, 5% horticulture.', 'फसल बीमा योजना। प्रीमियम: खरीफ 2%, रबी 1.5%, बागवानी 5%।', 'ಬೆಳೆ ವಿಮಾ ಯೋಜನೆ. ಪ್ರೀಮಿಯಂ: ಖರೀಫ್ 2%, ರಬಿ 1.5%, ತೋಟಗಾರಿಕೆ 5%.', '{"all_farmers": true}', '{"type": "crop_insurance", "premium_kharif": 2, "premium_rabi": 1.5}', '{"Aadhaar Card", "Bank details", "Land records", "Sowing certificate"}', 'https://pmfby.gov.in', 'PMFBY Portal'),
('KCC', 'Kisan Credit Card', 'किसान क्रेडिट कार्ड', 'ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್', 'Ministry of Agriculture / RBI', 'credit', 'Short-term credit up to ₹3 lakh at 4% interest for crop cultivation.', 'फसल खेती के लिए 4% ब्याज पर ₹3 लाख तक की ऋण।', 'ಬೆಳೆ ಕೃಷಿಗೆ 4% ಬಡ್ಡಿಯಲ್ಲಿ ₹3 ಲಕ್ಷ ಸಾಲ.', '{"land_required": true}', '{"credit_limit": 300000, "interest_rate": 4}', '{"Aadhaar Card", "Land records", "Passport photos", "Bank account"}', 'https://www.nabard.org/kcc', 'Bank/NABARD'),
('SHC', 'Soil Health Card Scheme', 'मृदा स्वास्थ्य कार्ड योजना', 'ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಕಾರ್ಡ್ ಯೋಜನೆ', 'Ministry of Agriculture', 'soil', 'Free soil testing and nutrient recommendation card every 2 years.', 'हर 2 साल में मुफ्त मृदा परीक्षण और पोषक तत्व कार्ड।', 'ಪ್ರತಿ 2 ವರ್ಷಗಳಿಗೊಮ್ಮೆ ಉಚಿತ ಮಣ್ಣು ಪರೀಕ್ಷೆ ಕಾರ್ಡ್.', '{"all_farmers": true}', '{"type": "free_soil_testing", "frequency_years": 2}', '{"Land records", "Aadhaar Card"}', 'https://soilhealth.dac.gov.in', 'Soil Health Card Portal'),
('PMKMY', 'PM Kisan Maandhan Yojana', 'पीएम किसान मानधन योजना', 'ಪಿಎಂ ಕಿಸಾನ್ ಮಾನಧನ್ ಯೋಜನೆ', 'Ministry of Agriculture', 'pension', 'Pension scheme for small farmers. ₹3,000/month after age 60.', 'छोटे किसानों के लिए पेंशन। 60 के बाद ₹3,000/माह।', 'ಸಣ್ಣ ರೈತರಿಗೆ ಪಿಂಚಣಿ. 60 ವರ್ಷದ ನಂತರ ₹3,000/ತಿಂಗಳು.', '{"age_min": 18, "age_max": 40, "land_max_acres": 5}', '{"pension": 3000, "eligible_age": 60}', '{"Aadhaar Card", "Bank account", "Land records", "Age proof"}', 'https://pmkmy.gov.in', 'PM-KMY Portal')
on conflict (scheme_code) do nothing;


