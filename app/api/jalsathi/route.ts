import { NextRequest, NextResponse } from 'next/server';
import { getIrrigationAdvice } from '@/lib/gemini';
import { fetchWeather } from '@/lib/weather';
import type { Language } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { crop, stage, soilType, lat, lng, pumpHP, language } = body as {
      crop: string;
      stage: string;
      soilType: string;
      lat: number;
      lng: number;
      pumpHP?: number;
      language?: Language;
    };

    if (!crop || !stage || !soilType) {
      return NextResponse.json(
        { error: 'crop, stage, and soilType are required' },
        { status: 400 }
      );
    }

    // Fetch current weather
    const weather = await fetchWeather(lat || 12.9716, lng || 77.5946);

    // Calculate forecast rain for next 3 days
    const forecastRain = weather.forecast
      .slice(0, 3)
      .reduce((sum, day) => sum + day.precipitation_sum, 0);

    // Get AI irrigation advice
    const advisory = await getIrrigationAdvice(
      crop,
      stage,
      soilType,
      {
        temperature: weather.current.temperature,
        humidity: weather.current.humidity,
        precipitation: weather.current.precipitation,
        forecast_rain_mm: forecastRain,
      },
      pumpHP || 5,
      language || 'en'
    );

    return NextResponse.json({
      advisory,
      weather: weather.current,
      forecast: weather.forecast.slice(0, 3),
    });
  } catch (error) {
    console.error('JalSathi API error:', error);
    return NextResponse.json(
      { error: 'Failed to get irrigation advisory' },
      { status: 500 }
    );
  }
}
