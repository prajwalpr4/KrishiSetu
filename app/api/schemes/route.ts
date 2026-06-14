import { NextRequest, NextResponse } from 'next/server';
import { matchSchemes } from '@/lib/gemini';
import type { Language } from '@/types';

// Seed scheme data (also in Supabase, but available for demo without DB)
const schemesData = [
  {
    id: '1', scheme_code: 'PM-KISAN', name_en: 'PM Kisan Samman Nidhi', name_hi: 'पीएम किसान सम्मान निधि', name_kn: 'ಪಿಎಂ ಕಿಸಾನ್ ಸಮ್ಮಾನ್ ನಿಧಿ',
    ministry: 'Ministry of Agriculture', category: 'income_support',
    description_en: 'Income support of ₹6,000/year to all landholding farmer families in 3 equal installments of ₹2,000 each.',
    description_hi: 'सभी भूमिधारक किसान परिवारों को ₹2,000 की 3 समान किस्तों में ₹6,000/वर्ष की आय सहायता।',
    description_kn: 'ಎಲ್ಲಾ ಭೂ ಹಿಡುವಳಿದಾರ ರೈತ ಕುಟುಂಬಗಳಿಗೆ ₹2,000 ರ 3 ಸಮಾನ ಕಂತುಗಳಲ್ಲಿ ₹6,000/ವರ್ಷ ಆದಾಯ ಬೆಂಬಲ.',
    eligibility_criteria: { land_required: true, exclude_institutional_land: true },
    benefits: { amount: 6000, type: 'direct_benefit_transfer', frequency: 'annual' },
    documents_required: ['Aadhaar Card', 'Land ownership documents', 'Bank passbook', 'Mobile number'],
    application_url: 'https://pmkisan.gov.in', portal_name: 'PM-Kisan Portal',
  },
  {
    id: '2', scheme_code: 'PMFBY', name_en: 'Pradhan Mantri Fasal Bima Yojana', name_hi: 'प्रधानमंत्री फसल बीमा योजना', name_kn: 'ಪ್ರಧಾನ ಮಂತ್ರಿ ಫಸಲ್ ಬಿಮಾ ಯೋಜನೆ',
    ministry: 'Ministry of Agriculture', category: 'insurance',
    description_en: 'Crop insurance scheme. Premium: 2% for Kharif, 1.5% for Rabi, 5% for horticultural crops.',
    description_hi: 'फसल बीमा योजना। प्रीमियम: खरीफ के लिए 2%, रबी के लिए 1.5%, बागवानी के लिए 5%।',
    description_kn: 'ಬೆಳೆ ವಿಮಾ ಯೋಜನೆ. ಪ್ರೀಮಿಯಂ: ಖರೀಫ್ 2%, ರಬಿ 1.5%, ತೋಟಗಾರಿಕೆ 5%.',
    eligibility_criteria: { crops_covered: ['all_notified_crops'] },
    benefits: { type: 'crop_insurance', coverage: 'natural_calamities' },
    documents_required: ['Aadhaar Card', 'Bank details', 'Land records', 'Sowing certificate'],
    application_url: 'https://pmfby.gov.in', portal_name: 'PMFBY Portal',
  },
  {
    id: '3', scheme_code: 'KCC', name_en: 'Kisan Credit Card', name_hi: 'किसान क्रेडिट कार्ड', name_kn: 'ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್',
    ministry: 'Ministry of Agriculture / RBI', category: 'credit',
    description_en: 'Short-term credit up to ₹3 lakh at 4% interest rate for crop cultivation.',
    description_hi: 'फसल खेती के लिए 4% ब्याज दर पर ₹3 लाख तक की ऋण।',
    description_kn: 'ಬೆಳೆ ಕೃಷಿಗೆ 4% ಬಡ್ಡಿ ದರದಲ್ಲಿ ₹3 ಲಕ್ಷದವರೆಗೆ ಸಾಲ.',
    eligibility_criteria: { land_ownership_or_tenant: true },
    benefits: { credit_limit_max: 300000, interest_rate_percent: 4 },
    documents_required: ['Aadhaar Card', 'Land records', 'Two passport photos', 'Bank account'],
    application_url: 'https://www.nabard.org/kcc', portal_name: 'Bank/NABARD',
  },
  {
    id: '4', scheme_code: 'SHC', name_en: 'Soil Health Card Scheme', name_hi: 'मृदा स्वास्थ्य कार्ड योजना', name_kn: 'ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಕಾರ್ಡ್ ಯೋಜನೆ',
    ministry: 'Ministry of Agriculture', category: 'soil',
    description_en: 'Free soil testing and personalized nutrient recommendation card every 2 years.',
    description_hi: 'हर 2 साल में मुफ्त मृदा परीक्षण और पोषक तत्व सिफारिश कार्ड।',
    description_kn: 'ಪ್ರತಿ 2 ವರ್ಷಗಳಿಗೊಮ್ಮೆ ಉಚಿತ ಮಣ್ಣು ಪರೀಕ್ಷೆ ಕಾರ್ಡ್.',
    eligibility_criteria: { all_farmers_eligible: true },
    benefits: { type: 'free_soil_testing', frequency_years: 2 },
    documents_required: ['Land records', 'Aadhaar Card'],
    application_url: 'https://soilhealth.dac.gov.in', portal_name: 'Soil Health Card Portal',
  },
  {
    id: '5', scheme_code: 'PMKMY', name_en: 'PM Kisan Maandhan Yojana', name_hi: 'पीएम किसान मानधन योजना', name_kn: 'ಪಿಎಂ ಕಿಸಾನ್ ಮಾನಧನ್ ಯೋಜನೆ',
    ministry: 'Ministry of Agriculture', category: 'pension',
    description_en: 'Pension scheme for small farmers. ₹3,000/month pension after age 60.',
    description_hi: 'छोटे किसानों के लिए पेंशन। 60 वर्ष के बाद ₹3,000/माह पेंशन।',
    description_kn: 'ಸಣ್ಣ ರೈತರಿಗೆ ಪಿಂಚಣಿ. 60 ವರ್ಷದ ನಂತರ ₹3,000/ತಿಂಗಳು.',
    eligibility_criteria: { age_range: { min: 18, max: 40 }, land_max_acres: 5 },
    benefits: { pension_amount_per_month: 3000, eligible_age: 60 },
    documents_required: ['Aadhaar Card', 'Bank account', 'Land records', 'Age proof'],
    application_url: 'https://pmkmy.gov.in', portal_name: 'PM-KMY Portal',
  },
  {
    id: '6', scheme_code: 'PM-KUSUM', name_en: 'PM-KUSUM Yojana', name_hi: 'पीएम-कुसुम योजना', name_kn: 'ಪಿಎಂ-ಕುಸುಮ್ ಯೋಜನೆ',
    ministry: 'MNRE', category: 'irrigation',
    description_en: 'Subsidy up to 60% for setting up standalone solar pumps and solarizing grid-connected agricultural pumps.',
    description_hi: 'सोलर पंप लगाने के लिए 60% तक की सब्सिडी।',
    description_kn: 'ಸೌರ ಪಂಪ್‌ಗಳನ್ನು ಸ್ಥಾಪಿಸಲು 60% ವರೆಗೆ ಸಬ್ಸಿಡಿ.',
    eligibility_criteria: { requires_water_source: true },
    benefits: { subsidy_percent: 60, type: 'solar_pump' },
    documents_required: ['Aadhaar Card', 'Land Documents', 'Bank Passbook', 'Passport Size Photo'],
    application_url: 'https://pmkusum.mnre.gov.in', portal_name: 'PM-KUSUM Portal',
  },
  {
    id: '7', scheme_code: 'MIDH', name_en: 'Mission for Integrated Development of Horticulture', name_hi: 'बागवानी विकास मिशन', name_kn: 'ತೋಟಗಾರಿಕೆ ಅಭಿವೃದ್ಧಿ ಮಿಷನ್',
    ministry: 'Ministry of Agriculture', category: 'subsidy',
    description_en: 'Financial assistance for fruits, vegetables, mushrooms, spices, flowers, and bamboo cultivation. Green house setup subsidy.',
    description_hi: 'फल, सब्जी और ग्रीन हाउस के लिए वित्तीय सहायता।',
    description_kn: 'ಹಣ್ಣು, ತರಕಾರಿ ಮತ್ತು ಹಸಿರು ಮನೆ ಸ್ಥಾಪನೆಗೆ ಆರ್ಥಿಕ ಸಹಾಯ.',
    eligibility_criteria: { horticulture_farmers: true },
    benefits: { subsidy_range: '35% to 50%', type: 'horticulture' },
    documents_required: ['Aadhaar', 'Land Details', 'Project Report (for large setups)'],
    application_url: 'https://midh.gov.in', portal_name: 'MIDH Portal',
  },
];

export async function GET() {
  try {
    return NextResponse.json({ schemes: schemesData });
  } catch (error) {
    console.error('Schemes API error:', error);
    return NextResponse.json({ error: 'Failed to fetch schemes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { farmerProfile, language } = body as {
      farmerProfile: {
        land_area_acres?: number | null;
        state?: string;
        district?: string | null;
        primary_crops?: string[] | null;
      };
      language: Language;
    };

    const schemesForMatching = schemesData.map((s) => ({
      name: s.name_en,
      eligibility_criteria: s.eligibility_criteria as Record<string, unknown>,
      benefits: s.benefits as Record<string, unknown>,
    }));

    const matches = await matchSchemes(farmerProfile, schemesForMatching, language || 'en');

    // Merge full scheme data with match results
    const results = matches.map((match) => {
      const scheme = schemesData.find((s) => s.name_en === match.scheme_name);
      return {
        scheme: scheme || null,
        eligibility: match.eligibility,
        explanation: match.explanation,
        matchScore: match.match_score,
      };
    });

    return NextResponse.json({ matches: results });
  } catch (error) {
    console.error('Scheme matching error:', error);
    return NextResponse.json({ error: 'Failed to match schemes' }, { status: 500 });
  }
}
