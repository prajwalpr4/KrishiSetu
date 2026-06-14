import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import type { ChatMessage, Language, DiagnosisResult, IrrigationAdvisory, MandiAnalysis } from '@/types';

// =====================
// Client Initialization
// =====================
let genAI: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

// =====================
// System Prompts
// =====================
const CHATBOT_SYSTEM_PROMPT = `You are KisanSarthi (ಕಿಸಾನ್ ಸಾರಥಿ / किसान सारथी), an expert AI agricultural assistant built for Indian farmers.

LANGUAGE RULE: ALWAYS detect the user's language from their message and respond in the EXACT same language.
- If user writes in Hindi (हिंदी) → respond entirely in Hindi
- If user writes in Kannada (ಕನ್ನಡ) → respond entirely in Kannada  
- If user writes in English → respond in English

DOMAIN RESTRICTION: You ONLY answer questions about:
- Crops, farming, agriculture, horticulture, animal husbandry, dairy, poultry
- Soil, seeds, fertilizers, pesticides, crop protection
- Weather impact on farming, irrigation, water management
- Agricultural machinery, equipment, tools
- Indian government agricultural schemes (PM-KISAN, PMFBY, KCC, Soil Health Card, PM-KMY, RKVY, etc.)
- Mandi prices, APMC markets, crop selling advice
- Farm labor, wages, attendance
- Crop calendar, sowing/harvesting timing, crop rotation
- Post-harvest storage, grading, value addition

If asked about anything outside this domain, respond:
- English: "Sorry, I can only help with farming and agriculture. How can I assist with your farm today? 🌾"
- Hindi: "माफ़ कीजिए, मैं केवल खेती-बाड़ी के बारे में मदद कर सकता हूँ। आज आपकी खेती में कैसे मदद करूँ? 🌾"
- Kannada: "ಕ್ಷಮಿಸಿ, ನಾನು ಕೇವಲ ಕೃಷಿ ಮತ್ತು ರೈತಾಂಗಕ್ಕೆ ಮಾತ್ರ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ. ಇಂದು ನಿಮ್ಮ ಕೃಷಿಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ? 🌾"

KNOWLEDGE CONTEXT:
- You know Karnataka farming well: ragi, jowar, sunflower, cotton, groundnut, tomato, onion, potato, mango, sugarcane
- You know Kharif (June-November), Rabi (November-April), and Zaid (April-June) seasons
- You know major Karnataka APMCs: Bangalore (APMC), Hubli, Davangere, Mysore, Belgaum, Tumkur, Shimoga
- Current Karnataka minimum wage for agriculture: ₹425/day (unskilled), ₹512/day (skilled) as of 2024

FORMAT: Do NOT use any Markdown formatting like asterisks (**) or hashes (#). Use PLAIN TEXT only. Use simple dashes (-) for bullet points. Use emoji (🌾🌿💧🌦️🚜💰📋). Keep responses practical and actionable.
Limit each response to under 500 words.`;

// =====================
// Chat Function
// =====================
export async function sendChatMessage(
  messages: ChatMessage[],
  userMessage: string,
  language: Language = 'en'
): Promise<string> {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('Groq API key not configured');
    }

    // Build conversation history
    const history = messages.slice(-10).map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content,
    }));

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // Groq's current recommended LLaMA 3.3 model
        messages: [
          { 
            role: "system", 
            content: `${CHATBOT_SYSTEM_PROMPT}\n\nCRITICAL INSTRUCTION: You MUST respond entirely in ${
              language === 'hi' ? 'Hindi' : language === 'kn' ? 'Kannada' : 'English'
            }. Do NOT use any other language.`
          },
          ...history,
          { role: "user", content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 1024,
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq API Error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    let text = data.choices[0].message.content;
    
    // Strip raw markdown asterisks and hashes so they don't show up in the UI
    text = text.replace(/\*\*/g, '').replace(/\*/g, '').replace(/### /g, '').replace(/## /g, '').replace(/# /g, '');
    
    return text;
  } catch (error: any) {
    console.error('Groq API Error:', error);
    
    // ULTIMATE FALLBACK: If the API key is completely invalid, return a mock response so the UI doesn't break
    return "This is an automated fallback response from KisanSarthi because your Groq API key is either invalid or missing. If this were live, I would give you expert advice on crops, weather, and government schemes in your preferred language! Please generate a new key from console.groq.com to unlock full AI capabilities.";
  }
}

// =====================
// Crop Disease Analysis (Vision)
// =====================
export async function analyzeCropDisease(
  imageBase64: string,
  mimeType: string,
  cropName?: string,
  language: Language = 'en'
): Promise<DiagnosisResult> {
  try {
    const client = getClient();
    const model = client.getGenerativeModel({
      model: 'gemini-flash-latest',
      safetySettings,
      generationConfig: {
        temperature: 0.3,
        topP: 0.9,
        maxOutputTokens: 2048,
        responseMimeType: 'application/json',
      },
    });

    const langInstruction = language === 'hi'
      ? 'Respond with description, remedy, and prevention text in Hindi.'
      : language === 'kn'
        ? 'Respond with description, remedy, and prevention text in Kannada.'
        : 'Respond in English.';

    const cropContext = cropName ? `The farmer indicates this is a ${cropName} crop.` : '';

    const prompt = `You are an expert agricultural pathologist. Analyze this crop/plant image carefully.
${cropContext}
${langInstruction}

Identify:
1. Disease, pest, or nutrient deficiency (or state if the plant is healthy)
2. Severity level
3. Confidence percentage
4. Detailed description
5. Organic/natural remedy
6. Chemical treatment with specific product names, dosage, and application frequency
7. Prevention tips for future

Respond ONLY in valid JSON format (no markdown code blocks):
{
  "disease": "Name of disease/pest/deficiency",
  "severity": "low|medium|high|critical",
  "confidence_percent": 85,
  "description": "Detailed description of what you see",
  "organic_remedy": "Natural/organic treatment steps",
  "chemical_treatment": [
    {"product": "Product Name", "dose": "dosage info", "frequency": "application frequency"}
  ],
  "prevention": "Prevention measures",
  "is_healthy": false
}

If the plant appears healthy, set is_healthy to true, severity to "low", and disease to "Healthy Plant".`;

    const result = await model.generateContent([
      { text: prompt },
      {
        inlineData: {
          mimeType,
          data: imageBase64,
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();
    
    // Attempt to extract JSON from the response text
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr) as DiagnosisResult;
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    
    // ULTIMATE FALLBACK: If the API key is completely invalid, return a mock response so the UI doesn't break
    return {
      disease: "API Key Invalid or Missing",
      severity: "high",
      confidence_percent: 0,
      description: "This is an automated fallback response. Your Gemini API key is either invalid, missing, or lacks access to the required vision model. Please generate a fresh key from Google AI Studio.",
      organic_remedy: "1. Go to aistudio.google.com/app/apikey\n2. Generate a new API Key\n3. Paste it into your .env.local file as GEMINI_API_KEY\n4. Restart the server",
      chemical_treatment: [
        { product: "Provide a valid Gemini API Key", dose: "1 Key", frequency: "Once" }
      ],
      prevention: "Ensure your API key is active and correctly placed in .env.local.",
      is_healthy: false
    } as DiagnosisResult;
  }
}

// =====================
// Irrigation Advice (JalSathi)
// =====================
export async function getIrrigationAdvice(
  crop: string,
  stage: string,
  soilType: string,
  weatherData: { temperature: number; humidity: number; precipitation: number; forecast_rain_mm: number },
  pumpHP: number = 5,
  language: Language = 'en'
): Promise<IrrigationAdvisory> {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('Groq API key not configured');
    }

    const langInstruction = language === 'hi'
      ? 'Provide reason and weather_summary in Hindi.'
      : language === 'kn'
        ? 'Provide reason and weather_summary in Kannada.'
        : 'Respond in English.';

    const prompt = `You are an expert irrigation engineer using CROPWAT methodology.

CROP: ${crop}
GROWTH STAGE: ${stage}
SOIL TYPE: ${soilType}
PUMP CAPACITY: ${pumpHP} HP

CURRENT WEATHER:
- Temperature: ${weatherData.temperature}°C
- Humidity: ${weatherData.humidity}%
- Today's precipitation: ${weatherData.precipitation} mm
- Forecast rain (next 3 days): ${weatherData.forecast_rain_mm} mm

${langInstruction}

Calculate the irrigation advisory. Consider:
1. Crop water requirement (ETc) based on crop and growth stage
2. Effective rainfall
3. Soil type water holding capacity
4. Pump flow rate (approximate: 1 HP ≈ 3000 liters/hour for Indian pumps)

Respond ONLY in valid JSON format matching this structure perfectly. Do NOT include markdown blocks:
{
  "should_irrigate": true,
  "water_mm": 25,
  "water_liters_per_acre": 101250,
  "pump_runtime_minutes": 120,
  "best_time": "6:00 AM - 9:00 AM",
  "reason": "explanation of why to irrigate or wait",
  "next_check_days": 3,
  "crop": "${crop}",
  "stage": "${stage}",
  "weather_summary": "brief weather summary"
}`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "system", content: prompt }],
        temperature: 0.2,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      throw new Error('Groq API failed');
    }

    const data = await response.json();
    let text = data.choices[0].message.content;
    
    // In case Groq wraps it in markdown despite json_object mode
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(text);
  } catch (error) {
    console.error('Irrigation advice error:', error);
    return {
      should_irrigate: false,
      water_mm: 0,
      water_liters_per_acre: 0,
      pump_runtime_minutes: 0,
      best_time: '6:00 AM - 9:00 AM',
      reason: language === 'hi'
        ? 'सलाह प्राप्त करने में त्रुटि। कृपया अपना API कुंजी जांचें।'
        : language === 'kn'
          ? 'ಸಲಹೆ ಪಡೆಯುವಲ್ಲಿ ದೋಷ. ನಿಮ್ಮ API ಕೀಯನ್ನು ಪರಿಶೀಲಿಸಿ.'
          : 'Error getting advice. Please check your API key.',
      next_check_days: 1,
      crop,
      stage,
      weather_summary: 'Unable to fetch weather data'
    };
  }
}

// =====================
// Mandi Price Analysis
// =====================
export async function analyzeMandiPrice(
  crop: string,
  currentPrice: number,
  historicalPrices: { date: string; price: number }[],
  location: string,
  language: Language = 'en'
): Promise<MandiAnalysis> {
  try {
    const client = getClient();
    const model = client.getGenerativeModel({
      model: 'gemini-1.5-flash',
      safetySettings,
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 1024,
        responseMimeType: 'application/json',
      },
    });

    const langInstruction = language === 'hi'
      ? 'Respond in Hindi.'
      : language === 'kn'
        ? 'Respond in Kannada.'
        : 'Respond in English.';

    const priceHistory = historicalPrices
      .map((p) => `${p.date}: ₹${p.price}`)
      .join('\n');

    const prompt = `You are a commodity market analyst specializing in Indian agricultural markets (APMCs/Mandis).

CROP: ${crop}
CURRENT MODAL PRICE: ₹${currentPrice}/quintal
LOCATION: ${location}
PRICE HISTORY:
${priceHistory || 'No historical data available'}

${langInstruction}

Analyze and respond in JSON format (no markdown):
{
  "trend": "rising|falling|stable",
  "prediction_7d": "brief prediction for next 7 days with expected price range",
  "recommendation": "should farmer sell now, hold, or wait - with reasoning",
  "buyer_advice": "which mandi or buyer type to approach",
  "storage_advice": "storage recommendations if holding"
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    return JSON.parse(responseText);
  } catch (error) {
    console.error('Mandi analysis error:', error);
    return {
      trend: 'stable',
      prediction_7d: 'Unable to generate prediction. Please try again.',
      recommendation: 'Monitor prices for 2-3 days before deciding.',
      buyer_advice: 'Contact your local APMC for current buyer information.',
      storage_advice: 'Store in a cool, dry place if holding.',
    };
  }
}

// =====================
// Scheme Eligibility Matching
// =====================
export async function matchSchemes(
  farmerProfile: {
    land_area_acres?: number | null;
    state?: string;
    district?: string | null;
    primary_crops?: string[] | null;
    age?: number;
  },
  schemes: { name: string; eligibility_criteria: Record<string, unknown>; benefits: Record<string, unknown> }[],
  language: Language = 'en'
): Promise<{ scheme_name: string; eligibility: 'eligible' | 'not_eligible' | 'verify'; explanation: string; match_score: number }[]> {
  try {
    const client = getClient();
    const model = client.getGenerativeModel({
      model: 'gemini-1.5-flash',
      safetySettings,
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2048,
        responseMimeType: 'application/json',
      },
    });

    const langInstruction = language === 'hi'
      ? 'Provide explanations in Hindi.'
      : language === 'kn'
        ? 'Provide explanations in Kannada.'
        : 'Provide explanations in English.';

    const prompt = `You are an Indian agricultural policy expert. Match this farmer's profile against government schemes.

FARMER PROFILE:
- Land: ${farmerProfile.land_area_acres ?? 'Not specified'} acres
- State: ${farmerProfile.state ?? 'Not specified'}
- District: ${farmerProfile.district ?? 'Not specified'}
- Primary crops: ${farmerProfile.primary_crops?.join(', ') ?? 'Not specified'}

AVAILABLE SCHEMES:
${schemes.map((s, i) => `${i + 1}. ${s.name}\n   Eligibility: ${JSON.stringify(s.eligibility_criteria)}\n   Benefits: ${JSON.stringify(s.benefits)}`).join('\n\n')}

${langInstruction}

For each scheme, determine eligibility and provide explanation.
Respond as JSON array (no markdown):
[
  {
    "scheme_name": "Scheme Name",
    "eligibility": "eligible|not_eligible|verify",
    "explanation": "why eligible/not eligible, what documents needed",
    "match_score": 85
  }
]

Sort by match_score descending.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    return JSON.parse(responseText);
  } catch (error) {
    console.error('Scheme matching error:', error);
    return [];
  }
}
