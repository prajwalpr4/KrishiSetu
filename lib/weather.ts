import type { WeatherData, WeatherForecast } from '@/types';
import { getWeatherDescription } from '@/lib/utils';

const OPEN_METEO_BASE = 'https://api.open-meteo.com/v1/forecast';

/**
 * Fetch weather data from Open-Meteo API (no API key needed)
 */
export async function fetchWeather(lat: number, lng: number): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lng.toString(),
    current: 'temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code',
    daily: 'precipitation_sum,temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code',
    timezone: 'Asia/Kolkata',
    forecast_days: '7',
  });

  const response = await fetch(`${OPEN_METEO_BASE}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }

  const data = await response.json();

  const { condition, icon } = getWeatherDescription(data.current.weather_code);

  const forecast: WeatherForecast[] = data.daily.time.map((date: string, i: number) => {
    const dayWeather = getWeatherDescription(data.daily.weather_code[i]);
    return {
      date,
      temp_max: data.daily.temperature_2m_max[i],
      temp_min: data.daily.temperature_2m_min[i],
      precipitation_sum: data.daily.precipitation_sum[i],
      precipitation_probability: data.daily.precipitation_probability_max[i],
      condition: dayWeather.condition,
      icon: dayWeather.icon,
    };
  });

  return {
    current: {
      temperature: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      precipitation: data.current.precipitation,
      wind_speed: data.current.wind_speed_10m,
      weather_code: data.current.weather_code,
      condition,
      icon,
    },
    forecast,
    location: { lat, lng },
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Get farming weather tip based on conditions
 */
export function getWeatherFarmingTip(
  weatherCode: number,
  temperature: number,
  humidity: number,
  lang: 'en' | 'hi' | 'kn' = 'en'
): string {
  const tips: Record<string, { en: string; hi: string; kn: string }> = {
    hot_dry: {
      en: '🌡️ Hot & dry conditions. Irrigate early morning or evening. Avoid spraying pesticides.',
      hi: '🌡️ गर्म और शुष्क मौसम। सुबह जल्दी या शाम को सिंचाई करें। कीटनाशक छिड़काव से बचें।',
      kn: '🌡️ ಬಿಸಿ ಮತ್ತು ಶುಷ್ಕ ಪರಿಸ್ಥಿತಿ. ಬೆಳಗ್ಗೆ ಅಥವಾ ಸಂಜೆ ನೀರಾವರಿ ಮಾಡಿ.',
    },
    rainy: {
      en: '🌧️ Rain expected. Delay fertilizer application. Check field drainage.',
      hi: '🌧️ बारिश की संभावना। खाद डालना टालें। खेत की जल निकासी जांचें।',
      kn: '🌧️ ಮಳೆ ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ. ಗೊಬ್ಬರ ಹಾಕುವುದನ್ನು ತಡ ಮಾಡಿ. ಕ್ಷೇತ್ರ ಒಳಚರಂಡಿ ಪರಿಶೀಲಿಸಿ.',
    },
    humid: {
      en: '💧 High humidity. Watch for fungal diseases. Ensure good air circulation in crops.',
      hi: '💧 उच्च नमी। फफूंद रोगों पर नज़र रखें। फसलों में अच्छी हवा सुनिश्चित करें।',
      kn: '💧 ಹೆಚ್ಚಿನ ಆರ್ದ್ರತೆ. ಶಿಲೀಂಧ್ರ ರೋಗಗಳನ್ನು ಗಮನಿಸಿ.',
    },
    mild: {
      en: '🌤️ Good weather for farming. Ideal for sowing, spraying, and field work.',
      hi: '🌤️ खेती के लिए अच्छा मौसम। बुआई, छिड़काव और खेत के काम के लिए आदर्श।',
      kn: '🌤️ ಕೃಷಿಗೆ ಒಳ್ಳೆ ಹವಾಮಾನ. ಬಿತ್ತನೆ, ಸಿಂಪಡಿಸುವಿಕೆ ಮತ್ತು ಕ್ಷೇತ್ರ ಕೆಲಸಕ್ಕೆ ಸೂಕ್ತ.',
    },
    cold: {
      en: '❄️ Cold conditions. Protect young plants. Consider mulching to retain soil warmth.',
      hi: '❄️ ठंडा मौसम। छोटे पौधों की रक्षा करें। मल्चिंग पर विचार करें।',
      kn: '❄️ ಶೀತ ಪರಿಸ್ಥಿತಿ. ಎಳೆ ಸಸಿಗಳನ್ನು ರಕ್ಷಿಸಿ. ಮಲ್ಚಿಂಗ್ ಪರಿಗಣಿಸಿ.',
    },
  };

  // Determine category
  if ([61, 63, 65, 80, 81, 82, 95, 96, 99].includes(weatherCode)) {
    return tips.rainy[lang];
  }
  if (temperature > 38 && humidity < 40) {
    return tips.hot_dry[lang];
  }
  if (humidity > 80) {
    return tips.humid[lang];
  }
  if (temperature < 10) {
    return tips.cold[lang];
  }
  return tips.mild[lang];
}
