'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { Play, Microscope, MessageCircle, TrendingUp, FileText } from 'lucide-react';
import CountUp from 'react-countup';

const mandiCrops = [
  { emoji: '🍅', name: 'Tomato', prices: [2240, 2310, 2180, 2290], change: 5.2 },
  { emoji: '🧅', name: 'Onion', prices: [1180, 1150, 1200, 1165], change: -1.8 },
  { emoji: '🌻', name: 'Sunflower', prices: [5820, 5890, 5780, 5850], change: 2.1 },
];

const mobileFeatures = [
  { icon: Microscope, label: 'Crop Doctor', emoji: '🔬', color: 'bg-emerald-50' },
  { icon: MessageCircle, label: 'AI Chat', emoji: '🤖', color: 'bg-green-50' },
  { icon: TrendingUp, label: 'Mandi Prices', emoji: '📊', color: 'bg-amber-50' },
  { icon: FileText, label: 'Schemes', emoji: '📋', color: 'bg-blue-50' },
];

export default function HeroSection() {
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true });
  const [priceIdx, setPriceIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPriceIdx((i) => (i + 1) % mandiCrops[0].prices.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden pt-14 lg:pt-[72px]"
      style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #f0fdf4 100%)' }}
    >
      {/* Dotted grid bg */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle, #bbf7d0 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      {/* Soft green circle — hidden on mobile for perf */}
      <div className="hidden md:block absolute -top-20 -right-20 w-[600px] h-[600px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)' }} />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 md:py-12 lg:py-20 flex flex-col lg:flex-row items-center gap-8 lg:gap-8 relative z-10">
        {/* Left content — 55% */}
        <div className="flex-1 lg:max-w-[55%] text-center lg:text-left">
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full bg-[#dcfce7] text-[#166534] text-xs md:text-sm font-semibold border border-[#bbf7d0] mb-4 md:mb-6"
          >
            🌾 India&apos;s #1 AI Farm Platform
          </motion.div>

          {/* Headline — static on mobile, animated on desktop */}
          <h1 className="text-display">
            {/* Mobile: static text */}
            <span className="block text-[#111827] md:hidden">
              Smart Farming Starts with{' '}
              <span className="hero-gradient-text">KrishiSetu</span>
            </span>

            {/* Desktop: animated word-by-word */}
            <span className="hidden md:block">
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="block text-[#111827]"
              >
                Smart Farming
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="block text-[#111827]"
              >
                Starts with
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="block relative"
              >
                <span className="hero-gradient-text">KrishiSetu</span>
                <svg
                  className="absolute -bottom-2 left-0 w-full h-4 hero-underline"
                  viewBox="0 0 300 12"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 8C60 2 120 4 150 6C180 8 240 3 298 7"
                    stroke="url(#underline-grad)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <defs>
                    <linearGradient id="underline-grad" x1="0" y1="0" x2="300" y2="0">
                      <stop stopColor="#166534" />
                      <stop offset="0.5" stopColor="#22c55e" />
                      <stop offset="1" stopColor="#16a34a" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.span>
            </span>
          </h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="text-[0.9375rem] md:text-body-lg text-[#4b5563] max-w-full md:max-w-[480px] mt-4 md:mt-6 mx-auto lg:mx-0"
          >
            AI-powered crop diagnosis, government schemes, live mandi prices, and farm management — free for every Indian farmer.
          </motion.p>

          {/* Trust signals — horizontal scroll on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.5 }}
            className="flex items-center gap-3 md:gap-4 mt-4 md:mt-5 text-xs md:text-sm text-[#4b5563] justify-center lg:justify-start overflow-x-auto no-scrollbar whitespace-nowrap"
          >
            <span>🇮🇳 Made for India</span>
            <span className="w-px h-4 bg-[#d1fae5] flex-shrink-0" />
            <span>🔒 100% Free Forever</span>
            <span className="w-px h-4 bg-[#d1fae5] flex-shrink-0" />
            <span>🌐 3 Languages</span>
          </motion.div>

          {/* CTA Buttons — stacked on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-6 md:mt-8"
          >
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 md:px-10 py-3.5 md:py-4 text-base md:text-[1.0625rem] font-semibold text-white rounded-2xl md:rounded-full shadow-[0_4px_20px_rgba(22,101,52,0.35)] hover:scale-[1.03] hover:shadow-[0_6px_28px_rgba(22,101,52,0.45)] transition-all duration-200 will-change-transform press-effect"
              style={{ background: 'linear-gradient(135deg, #166534 0%, #16a34a 100%)' }}
            >
              Start Farming Smarter →
            </Link>
            <Link href="/login" className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3.5 md:py-4 text-base md:text-[1.0625rem] font-semibold text-[#166534] border-2 border-[#166534] rounded-2xl md:rounded-full hover:bg-[#dcfce7] transition-all duration-200 press-effect">
              <Play className="w-4 h-4 fill-current" />
              Watch How It Works
            </Link>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            ref={statsRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="flex items-center gap-4 md:gap-6 mt-8 md:mt-10 justify-center lg:justify-start"
          >
            <div className="text-center lg:text-left">
              <p className="text-xl md:text-2xl font-extrabold text-[#166534]">
                {statsInView ? <CountUp end={10} suffix="+" duration={2} /> : '0'}
              </p>
              <p className="text-xs md:text-sm text-[#6b7280]">AI Features</p>
            </div>
            <div className="w-px h-8 md:h-10 bg-[#bbf7d0]" />
            <div className="text-center lg:text-left">
              <p className="text-xl md:text-2xl font-extrabold text-[#166534]">₹0</p>
              <p className="text-xs md:text-sm text-[#6b7280]">Monthly Cost</p>
            </div>
            <div className="w-px h-8 md:h-10 bg-[#bbf7d0]" />
            <div className="text-center lg:text-left">
              <p className="text-xl md:text-2xl font-extrabold text-[#166534]">
                {statsInView ? <CountUp end={3} duration={1.5} /> : '0'}
              </p>
              <p className="text-xs md:text-sm text-[#6b7280]">Languages</p>
            </div>
          </motion.div>
        </div>

        {/* Mobile: Mini feature preview grid (replaces mockup) */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-[320px] mx-auto md:hidden">
          {mobileFeatures.map((feat) => (
            <div key={feat.label} className={`flex flex-col items-center justify-center gap-2 py-4 px-3 rounded-2xl ${feat.color} border border-white/60 press-effect`}>
              <span className="text-2xl">{feat.emoji}</span>
              <span className="text-xs font-semibold text-[#374151]">{feat.label}</span>
            </div>
          ))}
        </div>

        {/* Desktop: Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, x: 60, rotateY: -5 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: [0.21, 1.11, 0.81, 0.99] }}
          className="relative flex-1 lg:max-w-[45%] w-full max-w-[420px] hidden md:block"
        >
          {/* Floating badges */}
          <div className="absolute -top-4 -right-4 z-20 px-3 py-1.5 bg-white rounded-full text-xs font-semibold text-[#166534] border border-[#bbf7d0] shadow-md rotate-[12deg] animate-float-badge-1">
            🌾 AI Powered
          </div>
          <div className="absolute bottom-12 -left-6 z-20 px-3 py-1.5 bg-white rounded-full text-xs font-semibold text-[#92400e] border border-[#fde68a] shadow-md -rotate-[8deg] animate-float-badge-2">
            ₹0 Forever Free
          </div>
          <div className="absolute top-1/2 -right-8 z-20 px-3 py-1.5 bg-white rounded-full text-xs font-semibold text-[#166534] shadow-lg rotate-[6deg] animate-float-badge-3 hidden lg:block">
            🏆 10 Features
          </div>

          {/* Mockup card */}
          <div
            className="bg-white rounded-3xl border border-[#bbf7d0] p-4 space-y-3 animate-mockup-float"
            style={{ boxShadow: '0 32px 80px rgba(22,101,52,0.20), 0 8px 24px rgba(0,0,0,0.08)' }}
          >
            {/* Weather card */}
            <div className="bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] rounded-2xl p-3.5">
              <div className="flex items-center justify-between text-xs text-[#6b7280] mb-2">
                <span className="font-semibold text-[#166534]">🌤 Today&apos;s Advisory</span>
                <span className="flex items-center gap-1">📍 Bangalore</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-xl font-bold text-[#111827]">28°C</span>
                <span className="text-[#6b7280]">Sunny</span>
                <span className="w-px h-4 bg-[#bbf7d0]" />
                <span className="text-[#6b7280]">💧 72%</span>
                <span className="w-px h-4 bg-[#bbf7d0]" />
                <span className="text-xs text-[#6b7280]">🌧 3 days</span>
              </div>
              <div className="mt-2 px-2.5 py-1 bg-[#166534] text-white text-[10px] font-medium rounded-full inline-block">
                Good day to spray pesticides
              </div>
            </div>

            {/* Crop Doctor card */}
            <div className="bg-white border border-[#d1fae5] rounded-2xl p-3.5">
              <p className="text-xs font-semibold text-[#111827] mb-2">📷 Tomato Leaf Scan</p>
              <div className="w-full h-2 bg-[#dcfce7] rounded-full overflow-hidden mb-2">
                <div className="h-full bg-gradient-to-r from-[#166534] to-[#22c55e] rounded-full animate-progress-bar" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-semibold rounded-full">🔴 Early Blight Detected — 94%</span>
              </div>
              <div className="flex gap-2">
                <span className="px-2.5 py-1 bg-[#dcfce7] text-[#166534] text-[10px] font-medium rounded-full cursor-pointer hover:bg-[#bbf7d0] transition-colors">Organic Fix</span>
                <span className="px-2.5 py-1 bg-[#dcfce7] text-[#166534] text-[10px] font-medium rounded-full cursor-pointer hover:bg-[#bbf7d0] transition-colors">Buy Remedy</span>
              </div>
            </div>

            {/* Mandi prices card */}
            <div className="bg-white border border-[#d1fae5] rounded-2xl p-3.5">
              <p className="text-xs font-semibold text-[#111827] mb-2">📊 Live Mandi Prices</p>
              <div className="space-y-1.5">
                {mandiCrops.map((crop) => (
                  <div key={crop.name} className="flex items-center justify-between text-xs">
                    <span className="text-[#4b5563]">{crop.emoji} {crop.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-[#111827] transition-all duration-500">
                        ₹{crop.prices[priceIdx].toLocaleString()}/q
                      </span>
                      <span className={`font-semibold ${crop.change > 0 ? 'text-[#16a34a]' : 'text-[#ef4444]'}`}>
                        {crop.change > 0 ? '▲' : '▼'} {Math.abs(crop.change)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat preview */}
            <div className="bg-gradient-to-br from-[#f0fdf4] to-white border border-[#d1fae5] rounded-2xl p-3.5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-[#111827]">🤖 KisanSarthi</span>
                <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
              </div>
              <div className="bg-[#dcfce7] px-3 py-2 rounded-xl rounded-tl-sm text-[11px] text-[#14532d] leading-relaxed">
                ನಿಮ್ಮ ಟೊಮ್ಯಾಟೊ ಬೆಳೆಗೆ ನೀರಾವರಿ ಸಲಹೆ:
                <br />• ಬೆಳಿಗ್ಗೆ 6-8 ಗಂಟೆಗೆ ನೀರು ಕೊಡಿ
                <br />• ಪ್ರತಿ ಎಕರೆಗೆ 2000L
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Leaf decorations — fewer on mobile */}
      {[15, 45, 75].map((top, i) => (
        <svg
          key={i}
          className="absolute pointer-events-none opacity-[0.06] hidden md:block"
          style={{
            top: `${top}%`,
            left: `${[5, 90, 70][i]}%`,
            width: `${20 + i * 4}px`,
            transform: `rotate(${i * 60}deg)`,
            animation: `spin-leaf ${15 + i * 3}s linear infinite`,
          }}
          viewBox="0 0 24 24" fill="#166534"
        >
          <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75" />
        </svg>
      ))}
    </section>
  );
}
