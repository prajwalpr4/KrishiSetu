import type { MandiPrice } from '@/types';
import * as cheerio from 'cheerio';

const DATA_GOV_ENDPOINT = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';

// In-memory cache for ZERO lag
let cachedScrapedPrices: MandiPrice[] | null = null;
let lastScrapeTime = 0;

// Featured Karnataka crops for dashboard
export const FEATURED_CROPS = [
  { name: 'Tomato', emoji: '🍅', name_hi: 'टमाटर', name_kn: 'ಟೊಮೇಟೋ' },
  { name: 'Onion', emoji: '🧅', name_hi: 'प्याज', name_kn: 'ಈರುಳ್ಳಿ' },
  { name: 'Potato', emoji: '🥔', name_hi: 'आलू', name_kn: 'ಆಲೂಗೆಡ್ಡೆ' },
  { name: 'Ragi (Finger Millet)', emoji: '🌾', name_hi: 'रागी', name_kn: 'ರಾಗಿ' },
  { name: 'Jowar (Sorghum)', emoji: '🌾', name_hi: 'ज्वार', name_kn: 'ಜೋಳ' },
  { name: 'Sunflower', emoji: '🌻', name_hi: 'सूरजमुखी', name_kn: 'ಸೂರ್ಯಕಾಂತಿ' },
  { name: 'Groundnut', emoji: '🥜', name_hi: 'मूंगफली', name_kn: 'ಕಡಲೆಕಾಯಿ' },
  { name: 'Cotton', emoji: '🌿', name_hi: 'कपास', name_kn: 'ಹತ್ತಿ' },
];

// Karnataka districts
export const KARNATAKA_DISTRICTS = [
  'Bangalore', 'Belgaum', 'Bellary', 'Bidar', 'Bijapur', 'Chamarajnagar',
  'Chikballapur', 'Chikmagalur', 'Chitradurga', 'Dakshina Kannada', 'Davangere',
  'Dharwad', 'Gadag', 'Gulbarga', 'Hassan', 'Haveri', 'Hubli', 'Kodagu',
  'Kolar', 'Koppal', 'Mandya', 'Mysore', 'Raichur', 'Shimoga', 'Tumkur',
  'Udupi', 'Uttara Kannada',
];

// Indian states list
export const INDIAN_STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

async function scrapeLivePrices(state: string): Promise<MandiPrice[]> {
  // Return cached prices instantly if less than 1 hour old (ZERO lag)
  if (cachedScrapedPrices && Date.now() - lastScrapeTime < 3600000) {
    return cachedScrapedPrices;
  }

  try {
    const formattedState = state.toLowerCase().replace(' ', '');
    const res = await fetch(`https://vegetablemarketprice.com/market/${formattedState}/today`, { next: { revalidate: 3600 } });
    const html = await res.text();
    const $ = cheerio.load(html);
    
    const results: MandiPrice[] = [];
    const today = new Date().toLocaleDateString('en-IN');
    
    $('table tr').each((i, row) => {
      if (i === 0) return; // Skip header
      const cols = $(row).find('td');
      if (cols.length >= 4) {
        let commodity = $(cols[1]).text().replace(/\(.*?\)/g, '').trim(); // Remove brackets
        if (commodity === 'Onion Big') commodity = 'Onion';
        
        let price = $(cols[2]).text().replace('₹', '').trim();
        let retailStr = $(cols[3]).text().replace(/₹/g, '').trim();
        let max_price = retailStr.split('-')[1]?.trim() || price;

        // Multiply by 100 to convert /kg to /Quintal for standard Mandi formats
        let minNum = parseInt(price) * 100 || 0;
        let maxNum = parseInt(max_price) * 100 || 0;

        results.push({
          state: state,
          district: 'Statewide',
          market: 'Major Wholesale',
          commodity: commodity,
          crop_name: commodity,
          variety: 'Local',
          grade: 'FAQ',
          arrival_date: today,
          min_price: String(minNum),
          max_price: String(maxNum),
          modal_price: String(Math.floor((minNum + maxNum) / 2)),
        });
      }
    });

    if (results.length > 0) {
      cachedScrapedPrices = results;
      lastScrapeTime = Date.now();
      return results;
    }
  } catch (err) {
    console.error("Scraper failed:", err);
  }
  
  // Ultimate fallback if scraper fails (no internet)
  return getSampleMandiPrices();
}

/**
 * Fetch mandi prices (Live Scraper overriding Data.gov API)
 */
export async function fetchMandiPrices(
  state: string = 'Karnataka',
  commodity?: string,
  limit: number = 50
): Promise<MandiPrice[]> {
  try {
    const apiKey = process.env.DATA_GOV_API_KEY;
    
    // If no API key, use the ultra-fast live scraper
    if (!apiKey || apiKey === 'your-data-gov-api-key') {
      let prices = await scrapeLivePrices(state);
      if (commodity) {
        prices = prices.filter(p => p.commodity.toLowerCase().includes(commodity.toLowerCase()));
      }
      return prices.slice(0, limit);
    }

    // Official data.gov route (only runs if user has actual API key)
    const params = new URLSearchParams({
      'api-key': apiKey,
      format: 'json',
      limit: limit.toString(),
      'filters[State]': state,
    });

    if (commodity) {
      params.append('filters[Commodity]', commodity);
    }

    const response = await fetch(`${DATA_GOV_ENDPOINT}?${params.toString()}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error(`Agmarknet API error: ${response.status}`);
      return getSampleMandiPrices(commodity);
    }

    const data = await response.json();

    if (!data.records || !Array.isArray(data.records)) {
      return getSampleMandiPrices(commodity);
    }

    return data.records.map((record: Record<string, string>) => ({
      id: crypto.randomUUID(),
      market_name: record.market || record.Market || 'Unknown Market',
      state: record.state || record.State || state,
      district: record.district || record.District || '',
      crop_name: record.commodity || record.Commodity || 'Unknown',
      variety: record.variety || record.Variety || '',
      min_price: parseFloat(record.min_price || record.Min_Price || '0'),
      max_price: parseFloat(record.max_price || record.Max_Price || '0'),
      modal_price: parseFloat(record.modal_price || record.Modal_Price || '0'),
      price_date: record.arrival_date || record.Arrival_Date || new Date().toISOString().split('T')[0],
      arrivals_tonnes: parseFloat(record.arrivals_tonnes || '0') || null,
      source: 'agmarknet',
      created_at: new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Mandi price fetch error:', error);
    return getSampleMandiPrices(commodity);
  }
}

/**
 * Sample mandi prices for demo/fallback
 */
function getSampleMandiPrices(commodity?: string): MandiPrice[] {
  const today = new Date().toISOString().split('T')[0];
  const allPrices: MandiPrice[] = [
    { id: '1', market_name: 'Bangalore (APMC)', state: 'Karnataka', district: 'Bangalore', crop_name: 'Tomato', variety: 'Local', min_price: 1200, max_price: 2800, modal_price: 2100, price_date: today, arrivals_tonnes: 450, source: 'sample', created_at: new Date().toISOString() },
    { id: '2', market_name: 'Hubli (APMC)', state: 'Karnataka', district: 'Dharwad', crop_name: 'Onion', variety: 'Nasik Red', min_price: 800, max_price: 1600, modal_price: 1200, price_date: today, arrivals_tonnes: 320, source: 'sample', created_at: new Date().toISOString() },
    { id: '3', market_name: 'Davangere (APMC)', state: 'Karnataka', district: 'Davangere', crop_name: 'Ragi (Finger Millet)', variety: 'Local', min_price: 3200, max_price: 3800, modal_price: 3500, price_date: today, arrivals_tonnes: 180, source: 'sample', created_at: new Date().toISOString() },
    { id: '4', market_name: 'Mysore (APMC)', state: 'Karnataka', district: 'Mysore', crop_name: 'Jowar (Sorghum)', variety: 'Maldandi', min_price: 2800, max_price: 3400, modal_price: 3100, price_date: today, arrivals_tonnes: 95, source: 'sample', created_at: new Date().toISOString() },
    { id: '5', market_name: 'Belgaum (APMC)', state: 'Karnataka', district: 'Belgaum', crop_name: 'Groundnut', variety: 'Bold', min_price: 5000, max_price: 6200, modal_price: 5600, price_date: today, arrivals_tonnes: 210, source: 'sample', created_at: new Date().toISOString() },
    { id: '6', market_name: 'Tumkur (APMC)', state: 'Karnataka', district: 'Tumkur', crop_name: 'Potato', variety: 'Jyoti', min_price: 1500, max_price: 2200, modal_price: 1800, price_date: today, arrivals_tonnes: 175, source: 'sample', created_at: new Date().toISOString() },
    { id: '7', market_name: 'Shimoga (APMC)', state: 'Karnataka', district: 'Shimoga', crop_name: 'Sunflower', variety: 'KBSH-44', min_price: 5400, max_price: 6100, modal_price: 5700, price_date: today, arrivals_tonnes: 85, source: 'sample', created_at: new Date().toISOString() },
    { id: '8', market_name: 'Raichur (APMC)', state: 'Karnataka', district: 'Raichur', crop_name: 'Cotton', variety: 'H-4', min_price: 6200, max_price: 7000, modal_price: 6500, price_date: today, arrivals_tonnes: 310, source: 'sample', created_at: new Date().toISOString() },
    { id: '9', market_name: 'Bangalore (APMC)', state: 'Karnataka', district: 'Bangalore', crop_name: 'Potato', variety: 'Local', min_price: 1400, max_price: 2000, modal_price: 1700, price_date: today, arrivals_tonnes: 220, source: 'sample', created_at: new Date().toISOString() },
    { id: '10', market_name: 'Hubli (APMC)', state: 'Karnataka', district: 'Dharwad', crop_name: 'Tomato', variety: 'Hybrid', min_price: 1000, max_price: 2500, modal_price: 1900, price_date: today, arrivals_tonnes: 380, source: 'sample', created_at: new Date().toISOString() },
  ];

  if (commodity) {
    return allPrices.filter((p) =>
      p.crop_name.toLowerCase().includes(commodity.toLowerCase())
    );
  }

  return allPrices;
}

/**
 * Get featured prices for dashboard (top 4 crops)
 */
export function getFeaturedPrices(prices: MandiPrice[]): MandiPrice[] {
  const featured = ['Tomato', 'Onion', 'Potato', 'Ragi'];
  const result: MandiPrice[] = [];

  for (const crop of featured) {
    const found = prices.find((p) =>
      p.crop_name.toLowerCase().includes(crop.toLowerCase())
    );
    if (found) result.push(found);
  }

  return result;
}
