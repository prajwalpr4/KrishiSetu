'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const initialPrices = [
  { emoji: '🍅', name: 'Tomato', market: 'Bangalore APMC', price: 2240, change: 5.2 },
  { emoji: '🧅', name: 'Onion', market: 'Hubli', price: 1180, change: -1.8 },
  { emoji: '🥔', name: 'Potato', market: 'Mysore', price: 1560, change: 0.9 },
  { emoji: '🌾', name: 'Ragi', market: 'Davangere', price: 3420, change: 0.0 },
  { emoji: '🌻', name: 'Sunflower', market: 'Belgaum', price: 5820, change: 2.1 },
  { emoji: '🥜', name: 'Groundnut', market: 'Tumkur', price: 5640, change: -0.7 },
  { emoji: '🌿', name: 'Jowar', market: 'Raichur', price: 2890, change: 1.3 },
  { emoji: '🪴', name: 'Cotton', market: 'Dharwad', price: 7180, change: -2.4 },
];

const chartDataSets: Record<string, { day: string; price: number }[]> = {
  Tomato: [
    { day: 'Mon', price: 2100 }, { day: 'Tue', price: 2150 }, { day: 'Wed', price: 2080 },
    { day: 'Thu', price: 2200 }, { day: 'Fri', price: 2180 }, { day: 'Sat', price: 2260 }, { day: 'Sun', price: 2240 },
  ],
  Onion: [
    { day: 'Mon', price: 1220 }, { day: 'Tue', price: 1200 }, { day: 'Wed', price: 1210 },
    { day: 'Thu', price: 1190 }, { day: 'Fri', price: 1175 }, { day: 'Sat', price: 1185 }, { day: 'Sun', price: 1180 },
  ],
  Ragi: [
    { day: 'Mon', price: 3380 }, { day: 'Tue', price: 3400 }, { day: 'Wed', price: 3390 },
    { day: 'Thu', price: 3410 }, { day: 'Fri', price: 3420 }, { day: 'Sat', price: 3415 }, { day: 'Sun', price: 3420 },
  ],
};

export default function MandiLiveSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [prices, setPrices] = useState(initialPrices);
  const [flashIdx, setFlashIdx] = useState<number | null>(null);
  const [chartCrop, setChartCrop] = useState('Tomato');

  const updatePrices = useCallback(() => {
    const idx = Math.floor(Math.random() * prices.length);
    setPrices((prev) =>
      prev.map((p, i) => {
        if (i !== idx) return p;
        const delta = (Math.random() * 0.03 - 0.015) * p.price;
        const newPrice = Math.round(p.price + delta);
        const changePercent = parseFloat(((delta / p.price) * 100).toFixed(1));
        return { ...p, price: newPrice, change: parseFloat((p.change + changePercent).toFixed(1)) };
      })
    );
    setFlashIdx(idx);
    setTimeout(() => setFlashIdx(null), 500);
  }, [prices.length]);

  useEffect(() => {
    const interval = setInterval(updatePrices, 3000);
    return () => clearInterval(interval);
  }, [updatePrices]);

  return (
    <section id="mandi-live" className="py-12 md:py-24" style={{ background: 'linear-gradient(135deg, #052e16 0%, #14532d 60%, #052e16 100%)' }}>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8 md:mb-16">
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-eyebrow text-white/60 mb-3">
            Live Market Intelligence
          </motion.p>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-h1 text-white">
            Know the Price<br />Before You Go to Mandi
          </motion.h2>
        </div>

        <div ref={ref} className="flex flex-col lg:flex-row gap-8">
          {/* Left — Price table */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex-1 lg:w-[60%]"
          >
            <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
              {/* Header row — hidden on mobile (card layout instead) */}
              <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_80px] px-4 py-3 text-xs font-semibold text-white/50 border-b border-white/10">
                <span>Commodity</span>
                <span>Market</span>
                <span className="text-right">Price (₹/Qtl)</span>
                <span className="text-right">Change</span>
              </div>

              {/* Rows */}
              {prices.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className={`px-4 py-3 text-sm items-center transition-all duration-500 hover:bg-white/[0.08] border-b border-white/5 ${flashIdx === i ? 'bg-[#22c55e]/10' : ''}
                    grid grid-cols-[auto_1fr] md:grid-cols-[1fr_1fr_1fr_80px] gap-1 md:gap-0
                  `}
                >
                  {/* Mobile: 2-col card layout / Desktop: 4-col table */}
                  <span className="text-white font-medium">{item.emoji} {item.name}</span>
                  <div className="flex items-center justify-end md:justify-start gap-2 md:contents">
                    <span className="text-white/60 text-xs hidden md:inline">{item.market}</span>
                    <span className="text-white font-mono font-semibold md:text-right">
                      ₹{item.price.toLocaleString()}
                    </span>
                    <span className={`text-xs font-semibold md:text-right ${
                      item.change > 0 ? 'text-[#4ade80]' : item.change < 0 ? 'text-[#f87171]' : 'text-white/50'
                    }`}>
                      {item.change > 0 ? '▲' : item.change < 0 ? '▼' : '—'} {item.change !== 0 ? `${Math.abs(item.change)}%` : '0.0%'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Live indicator */}
            <div className="mt-4 flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-white/10">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Live — Updates every few seconds
              </span>
            </div>
          </motion.div>

          {/* Right — Chart + Insight */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 lg:w-[40%] space-y-4"
          >
            {/* Chart */}
            <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">📈 7-Day Price Trend</h3>
                <select
                  value={chartCrop}
                  onChange={(e) => setChartCrop(e.target.value)}
                  className="bg-white/10 text-white text-xs rounded-lg px-2 py-1 border border-white/20 outline-none"
                >
                  {['Tomato', 'Onion', 'Ragi'].map((c) => <option key={c} value={c} className="text-black">{c}</option>)}
                </select>
              </div>
              <div className="h-[180px] md:h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartDataSets[chartCrop] || chartDataSets.Tomato}>
                    <defs>
                      <linearGradient id="mandi-area-fill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4ade80" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#4ade80" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
                    <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }} axisLine={false} tickLine={false} width={50} />
                    <Tooltip
                      contentStyle={{ background: '#14532d', border: '1px solid #22c55e', borderRadius: '0.5rem', fontSize: '12px', color: 'white' }}
                      labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
                      formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, 'Price']}
                    />
                    <Area type="monotone" dataKey="price" stroke="#4ade80" strokeWidth={2} fill="url(#mandi-area-fill)" dot={{ fill: '#4ade80', r: 3 }} activeDot={{ r: 5, fill: '#22c55e' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Insight */}
            <div className="rounded-2xl p-5 border-l-4 border-[#22c55e]" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <p className="text-sm font-semibold text-white mb-2">🤖 AI Market Insight:</p>
              <p className="text-sm text-white/80 leading-relaxed">
                Tomato prices are trending up. Consider holding stock 3–5 more days. Bangalore APMC showing strongest demand.
              </p>
              <span className="inline-block mt-3 px-2.5 py-1 bg-white/10 text-white/60 text-[10px] font-semibold rounded-full">
                Powered by KrishiSetu AI
              </span>
            </div>

            {/* CTA */}
            <Link
              href="/login"
              className="inline-flex items-center justify-center w-full py-3 text-sm font-semibold text-white border border-white/30 rounded-full hover:bg-white hover:text-[#14532d] transition-all duration-200"
            >
              Check All Mandi Prices →
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
