import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { enIN } from 'date-fns/locale';
import type { Language } from '@/types';

/**
 * Merge Tailwind classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency in Indian Rupees
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date to readable string: "15 Jun 2026"
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'dd MMM yyyy', { locale: enIN });
}

/**
 * Format date to short form: "15 Jun"
 */
export function formatDateShort(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'dd MMM', { locale: enIN });
}

/**
 * Format relative time: "2 hours ago"
 */
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true, locale: enIN });
}

/**
 * Get human-readable language label
 */
export function getLanguageLabel(lang: Language): string {
  const labels: Record<Language, string> = {
    en: 'English',
    hi: 'हिन्दी',
    kn: 'ಕನ್ನಡ',
  };
  return labels[lang];
}

/**
 * Get short language label
 */
export function getLanguageLabelShort(lang: Language): string {
  const labels: Record<Language, string> = {
    en: 'EN',
    hi: 'हिं',
    kn: 'ಕ',
  };
  return labels[lang];
}

/**
 * Truncate string to specified length
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

/**
 * Capitalize first letter
 */
export function capitalizeFirst(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Get greeting based on time of day
 */
export function getGreeting(lang: Language): string {
  const hour = new Date().getHours();
  if (hour < 12) {
    return lang === 'hi' ? 'शुभ प्रभात' : lang === 'kn' ? 'ಶುಭೋದಯ' : 'Good morning';
  } else if (hour < 17) {
    return lang === 'hi' ? 'नमस्ते' : lang === 'kn' ? 'ನಮಸ್ಕಾರ' : 'Good afternoon';
  } else {
    return lang === 'hi' ? 'शुभ संध्या' : lang === 'kn' ? 'ಶುಭ ಸಂಜೆ' : 'Good evening';
  }
}

/**
 * Get severity color class
 */
export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'low': return 'bg-green-100 text-green-800 border-green-200';
    case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'critical': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

/**
 * Get season color
 */
export function getSeasonColor(season: string): string {
  switch (season) {
    case 'kharif': return 'bg-emerald-100 text-emerald-800';
    case 'rabi': return 'bg-amber-100 text-amber-800';
    case 'zaid': return 'bg-cyan-100 text-cyan-800';
    case 'annual': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Get crop emoji from name
 */
export function getCropEmoji(cropName: string): string {
  const emojiMap: Record<string, string> = {
    rice: '🌾', wheat: '🌾', jowar: '🌾', ragi: '🌾',
    cotton: '🌿', tomato: '🍅', onion: '🧅', potato: '🥔',
    groundnut: '🥜', sunflower: '🌻', sugarcane: '🎋', mango: '🥭',
  };
  return emojiMap[cropName.toLowerCase()] || '🌱';
}

/**
 * Weather code to description (WMO codes)
 */
export function getWeatherDescription(code: number): { condition: string; icon: string } {
  const weatherMap: Record<number, { condition: string; icon: string }> = {
    0: { condition: 'Clear sky', icon: '☀️' },
    1: { condition: 'Mainly clear', icon: '🌤️' },
    2: { condition: 'Partly cloudy', icon: '⛅' },
    3: { condition: 'Overcast', icon: '☁️' },
    45: { condition: 'Foggy', icon: '🌫️' },
    48: { condition: 'Depositing rime fog', icon: '🌫️' },
    51: { condition: 'Light drizzle', icon: '🌦️' },
    53: { condition: 'Moderate drizzle', icon: '🌦️' },
    55: { condition: 'Dense drizzle', icon: '🌧️' },
    61: { condition: 'Slight rain', icon: '🌧️' },
    63: { condition: 'Moderate rain', icon: '🌧️' },
    65: { condition: 'Heavy rain', icon: '🌧️' },
    71: { condition: 'Slight snowfall', icon: '🌨️' },
    73: { condition: 'Moderate snowfall', icon: '🌨️' },
    75: { condition: 'Heavy snowfall', icon: '❄️' },
    80: { condition: 'Slight rain showers', icon: '🌦️' },
    81: { condition: 'Moderate rain showers', icon: '🌧️' },
    82: { condition: 'Violent rain showers', icon: '⛈️' },
    95: { condition: 'Thunderstorm', icon: '⛈️' },
    96: { condition: 'Thunderstorm with hail', icon: '⛈️' },
    99: { condition: 'Thunderstorm with heavy hail', icon: '⛈️' },
  };
  return weatherMap[code] || { condition: 'Unknown', icon: '🌡️' };
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
