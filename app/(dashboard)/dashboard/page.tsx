'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/app.store';
import { UI_TEXT } from '@/types';
import type { WeatherData, MandiPrice } from '@/types';
import { getGreeting, formatCurrency, getCropEmoji } from '@/lib/utils';
import {
  Microscope, MessageCircle, TrendingUp, FileText,
  ShoppingBag, Calendar, Package, Users, Droplets,
  Sun, CloudRain, Wind, Droplet, ArrowUpRight,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

const quickActions = [
  { href: '/crop-doctor', icon: Microscope, labelKey: 'cropDoctor', color: 'bg-emerald-500', emoji: '🔬' },
  { href: '/chat', icon: MessageCircle, labelKey: 'chat', color: 'bg-green-600', emoji: '🤖' },
  { href: '/mandi', icon: TrendingUp, labelKey: 'mandi', color: 'bg-amber-500', emoji: '📊' },
  { href: '/schemes', icon: FileText, labelKey: 'schemes', color: 'bg-blue-500', emoji: '📋' },
  { href: '/marketplace', icon: ShoppingBag, labelKey: 'marketplace', color: 'bg-purple-500', emoji: '🛒' },
  { href: '/planner', icon: Calendar, labelKey: 'planner', color: 'bg-teal-500', emoji: '📅' },
  { href: '/inventory', icon: Package, labelKey: 'inventory', color: 'bg-orange-500', emoji: '📦' },
  { href: '/majdoor', icon: Users, labelKey: 'majdoor', color: 'bg-rose-500', emoji: '👷' },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const { language, farmerProfile } = useAppStore();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [mandiPrices, setMandiPrices] = useState<MandiPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [serverProfile, setServerProfile] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      try {
        let lat = 12.9716;
        let lng = 77.5946;
        let profileData = null;

        // Fetch user profile
        const profileRes = await fetch('/api/profile');
        if (profileRes.ok) {
          const { profile } = await profileRes.json();
          if (profile) {
            setServerProfile(profile);
            profileData = profile;
            if (profile.gps_lat && profile.gps_lng) {
              lat = profile.gps_lat;
              lng = profile.gps_lng;
            }
          }
        }

        // Fetch weather
        const weatherRes = await fetch(`/api/weather?lat=${lat}&lng=${lng}`);
        if (weatherRes.ok) {
          const data = await weatherRes.json();
          setWeather(data);
        }

        // Fetch featured mandi prices (filter if state exists)
        let mandiUrl = '/api/mandi?featured=true';
        if (profileData && profileData.state) {
          mandiUrl += `&state=${encodeURIComponent(profileData.state)}`;
        }
        const mandiRes = await fetch(mandiUrl);
        if (mandiRes.ok) {
          const data = await mandiRes.json();
          setMandiPrices(data.prices || []);
        }
      } catch (err) {
        console.error('Dashboard data load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const greeting = getGreeting(language);
  const name = serverProfile?.full_name?.split(' ')[0] || farmerProfile?.full_name?.split(' ')[0] || (language === 'hi' ? 'किसान' : language === 'kn' ? 'ರೈತ' : 'Farmer');

  const showCompletionBanner = serverProfile && !serverProfile.profile_completed;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Profile Completion Banner */}
      {showCompletionBanner && (
        <motion.div variants={item} className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <p className="text-amber-800 text-sm font-medium">Complete your profile to unlock personalized features</p>
          </div>
          <Link href="/profile/edit" className="text-amber-700 text-sm font-bold hover:underline">
            Edit Profile →
          </Link>
        </motion.div>
      )}

      {/* Greeting */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl md:text-3xl font-bold text-krishisetu-text-primary">
            {greeting}, {name} 👋🌾
          </h1>
          <div className="flex items-center gap-2 mt-1">
            {serverProfile?.village_or_city && (
              <span className="inline-flex items-center gap-1 text-sm text-[#166534] bg-[#f0fdf4] px-2 py-0.5 rounded-md font-medium border border-[#d1fae5]">
                📍 {serverProfile.village_or_city}, {serverProfile.state}
              </span>
            )}
            <p className="text-sm text-krishisetu-text-muted">
              {language === 'hi' ? 'आज आपकी खेती की जानकारी' : language === 'kn' ? 'ಇಂದಿನ ಕೃಷಿ ಮಾಹಿತಿ' : 'Your farming overview for today'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Weather Widget */}
      <motion.div variants={item}>
        <div className="card-krishisetu overflow-hidden">
          <div className="gradient-primary p-4 md:p-5">
            <div className="flex items-center justify-between text-white">
              <div>
                <p className="text-white/80 text-sm mb-1">
                  {language === 'hi' ? 'आज का मौसम' : language === 'kn' ? 'ಇಂದಿನ ಹವಾಮಾನ' : "Today's Weather"}
                </p>
                {weather ? (
                  <>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl md:text-4xl">{weather.current.icon}</span>
                      <div>
                        <p className="text-2xl md:text-3xl font-bold">{Math.round(weather.current.temperature)}°C</p>
                        <p className="text-sm text-white/80">{weather.current.condition}</p>
                      </div>
                    </div>
                    <div className="flex gap-4 mt-3 text-sm text-white/80">
                      <span className="flex items-center gap-1"><Droplet className="w-3.5 h-3.5" />{weather.current.humidity}%</span>
                      <span className="flex items-center gap-1"><Wind className="w-3.5 h-3.5" />{weather.current.wind_speed} km/h</span>
                      <span className="flex items-center gap-1"><CloudRain className="w-3.5 h-3.5" />{weather.current.precipitation} mm</span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sun className="w-8 h-8 animate-pulse" />
                    <span className="text-white/80">
                      {loading ? (UI_TEXT.loading[language]) : '—'}
                    </span>
                  </div>
                )}
              </div>
              {weather && weather.forecast.length > 0 && (
                <div className="hidden md:flex gap-3">
                  {weather.forecast.slice(0, 3).map((day, i) => (
                    <div key={i} className="text-center bg-white/10 rounded-lg px-3 py-2 backdrop-blur-sm">
                      <p className="text-xs text-white/70">
                        {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                      </p>
                      <p className="text-lg my-0.5">{day.icon}</p>
                      <p className="text-xs font-medium">
                        {Math.round(day.temp_max)}° / {Math.round(day.temp_min)}°
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions Grid */}
      <motion.div variants={item}>
        <h2 className="font-heading text-lg font-semibold text-krishisetu-text-primary mb-3">
          {language === 'hi' ? 'त्वरित कार्रवाई' : language === 'kn' ? 'ತ್ವರಿತ ಕ್ರಿಯೆ' : 'Quick Actions'}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {quickActions.map((action) => {
            const label = UI_TEXT[action.labelKey]?.[language] || action.labelKey;
            return (
              <Link key={action.href} href={action.href}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  className="feature-card flex flex-col items-center gap-2 p-3 md:p-4"
                >
                  <div className={`w-11 h-11 rounded-xl ${action.color} flex items-center justify-center text-white shadow-sm`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] md:text-xs font-medium text-krishisetu-text-body text-center leading-tight">
                    {label}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* Mandi Prices */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading text-lg font-semibold text-krishisetu-text-primary">
            {UI_TEXT.mandi[language]} 📈
          </h2>
          <Link href="/mandi" className="text-sm text-primary font-medium flex items-center gap-0.5 hover:underline">
            {language === 'hi' ? 'सब देखें' : language === 'kn' ? 'ಎಲ್ಲಾ ನೋಡಿ' : 'View All'}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {mandiPrices.length > 0
            ? mandiPrices.map((price) => (
                <motion.div
                  key={price.id}
                  whileHover={{ y: -2 }}
                  className="card-krishisetu p-3.5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg">{getCropEmoji(price.crop_name)}</span>
                    <span className="flex items-center text-xs font-medium text-green-600">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <p className="text-sm font-medium text-krishisetu-text-body truncate">
                    {price.crop_name}
                  </p>
                  <p className="font-mono text-lg font-bold text-krishisetu-text-primary mt-0.5">
                    {formatCurrency(price.modal_price)}
                  </p>
                  <p className="text-[10px] text-krishisetu-text-muted mt-1">
                    /quintal • {(price.market || (price as any).market_name || 'Market').split(' ')[0]}
                  </p>
                </motion.div>
              ))
            : Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card-krishisetu p-3.5 animate-pulse">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg mb-2" />
                  <div className="w-16 h-4 bg-gray-200 rounded mb-1" />
                  <div className="w-20 h-5 bg-gray-200 rounded" />
                </div>
              ))}
        </div>
      </motion.div>

      {/* Government Scheme Alert */}
      <motion.div variants={item}>
        <Link href="/schemes">
          <div className="card-krishisetu p-4 gradient-gold border-amber-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm text-amber-900">
                  {language === 'hi'
                    ? '📋 PM-KISAN योजना के लिए पात्र हो सकते हैं!'
                    : language === 'kn'
                      ? '📋 ನೀವು PM-KISAN ಯೋಜನೆಗೆ ಅರ್ಹರಾಗಬಹುದು!'
                      : '📋 You may be eligible for PM-KISAN. Check now!'}
                </p>
                <p className="text-xs text-amber-700 mt-0.5">
                  {language === 'hi' ? '₹6,000/वर्ष सीधे बैंक में' : language === 'kn' ? '₹6,000/ವರ್ಷ ನೇರ ಬ್ಯಾಂಕ್ ವರ್ಗಾವಣೆ' : '₹6,000/year direct bank transfer'}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-amber-600" />
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Pending Labor Wages */}
      <motion.div variants={item}>
        <Link href="/majdoor">
          <div className="card-krishisetu p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm text-krishisetu-text-body">
                  {language === 'hi'
                    ? '💰 ₹1,131 बकाया मजदूरी - 3 मजदूर'
                    : language === 'kn'
                      ? '💰 ₹1,131 ಬಾಕಿ ಕೂಲಿ - 3 ಕೆಲಸಗಾರರು'
                      : '💰 ₹1,131 pending wages — 3 workers'}
                </p>
                <p className="text-xs text-krishisetu-text-muted mt-0.5">
                  {language === 'hi' ? 'भुगतान विवरण देखें →' : language === 'kn' ? 'ಪಾವತಿ ವಿವರ ನೋಡಿ →' : 'View payment details →'}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-krishisetu-text-muted" />
            </div>
          </div>
        </Link>
      </motion.div>

      {/* JalSathi Quick Widget */}
      <motion.div variants={item}>
        <Link href="/jalsathi">
          <div className="card-krishisetu p-4 bg-blue-50 border-blue-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                <Droplets className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm text-blue-900">
                  {language === 'hi'
                    ? '💧 जलसाथी - सिंचाई सलाह लें'
                    : language === 'kn'
                      ? '💧 ಜಲಸಾಥಿ - ನೀರಾವರಿ ಸಲಹೆ ಪಡೆಯಿರಿ'
                      : '💧 JalSathi — Get irrigation advice'}
                </p>
                <p className="text-xs text-blue-700 mt-0.5">
                  {language === 'hi' ? 'AI-आधारित पानी प्रबंधन' : language === 'kn' ? 'AI-ಆಧಾರಿತ ನೀರು ನಿರ್ವಹಣೆ' : 'AI-powered water management'}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
