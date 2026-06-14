'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/app.store';
import type { MandiPrice } from '@/types';
import { FEATURED_CROPS, INDIAN_STATES } from '@/lib/mandi';
import { formatCurrency } from '@/lib/utils';
import { Search, TrendingUp, Loader2, BarChart3, MapPin } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function MandiPage() {
  const { language } = useAppStore();
  const [prices, setPrices] = useState<MandiPrice[]>([]);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState('Karnataka');
  const [commodity, setCommodity] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);

  const fetchPrices = async (searchState?: string, searchCommodity?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('state', searchState || state);
      if (searchCommodity || commodity) params.set('commodity', searchCommodity || commodity);
      const res = await fetch(`/api/mandi?${params.toString()}`);
      const data = await res.json();
      setPrices(data.prices || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchPrices(); }, []);

  // Selected crop data
  const selectedData = prices.find(p => p.crop_name === selectedCrop);
  const chartData = selectedData
    ? [
        { name: language === 'hi' ? 'न्यूनतम (Min)' : language === 'kn' ? 'ಕನಿಷ್ಠ (Min)' : 'Min Price', price: selectedData.min_price, fill: '#f87171' },
        { name: language === 'hi' ? 'औसत (Modal)' : language === 'kn' ? 'ಮಾದರಿ (Modal)' : 'Modal Price', price: selectedData.modal_price, fill: '#4ade80' },
        { name: language === 'hi' ? 'अधिकतम (Max)' : language === 'kn' ? 'ಗರಿಷ್ಠ (Max)' : 'Max Price', price: selectedData.max_price, fill: '#60a5fa' },
      ]
    : [];

  const title = language === 'hi' ? 'मंडी भाव 📊' : language === 'kn' ? 'ಮಂಡಿ ಬೆಲೆ 📊' : 'Mandi Prices 📊';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h1 className="font-heading text-xl md:text-2xl font-bold text-krishisetu-text-primary">{title}</h1>

      {prices.length > 0 && prices[0].source === 'sample' && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
          <TrendingUp className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>
            <strong>Showing Demo Prices.</strong> To see exact live government data, you need to add your free <code className="bg-amber-100 px-1 rounded">DATA_GOV_API_KEY</code> from data.gov.in into your <code>.env.local</code> file.
          </p>
        </div>
      )}

      {/* Quick Crop Chips — horizontal scroll on mobile */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {FEATURED_CROPS.map((crop) => (
          <button
            key={crop.name}
            onClick={() => { setCommodity(crop.name); fetchPrices(state, crop.name); setSelectedCrop(crop.name); }}
            className={`px-3 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
              commodity === crop.name
                ? 'bg-primary text-white shadow-sm'
                : 'bg-primary-light text-primary hover:bg-green-200'
            }`}
          >
            {crop.emoji} {crop.name}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-3 flex-col sm:flex-row">
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="w-full rounded-xl border border-krishisetu-border bg-white px-3 py-3 text-base focus:ring-2 focus:ring-primary/30"
        >
          {INDIAN_STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-krishisetu-text-muted" />
          <input
            value={commodity}
            onChange={(e) => setCommodity(e.target.value)}
            placeholder={language === 'hi' ? 'फसल खोजें...' : language === 'kn' ? 'ಬೆಳೆ ಹುಡುಕಿ...' : 'Search crop...'}
            className="w-full rounded-xl border border-krishisetu-border bg-white pl-9 pr-3 py-3 text-base focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <button onClick={() => fetchPrices()} className="btn-primary flex items-center gap-2" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          {language === 'hi' ? 'खोजें' : language === 'kn' ? 'ಹುಡುಕಿ' : 'Search'}
        </button>
      </div>

      {/* Price Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {prices.map((price) => (
          <motion.div
            key={price.id}
            whileHover={{ y: -2 }}
            onClick={() => setSelectedCrop(price.crop_name)}
            className={`card-krishisetu p-4 cursor-pointer transition-all ${
              selectedCrop === price.crop_name ? 'ring-2 ring-primary' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-heading text-base font-semibold text-krishisetu-text-primary">
                {price.crop_name}
              </h3>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <p className="font-mono text-2xl font-bold text-krishisetu-text-primary">
              {formatCurrency(price.modal_price)}
            </p>
            <p className="text-xs text-krishisetu-text-muted mt-1">/quintal (modal price)</p>
            <div className="flex justify-between mt-3 text-xs text-krishisetu-text-muted">
              <span>Min: {formatCurrency(price.min_price)}</span>
              <span>Max: {formatCurrency(price.max_price)}</span>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-krishisetu-text-muted">
              <MapPin className="w-3 h-3" />
              {price.market_name}
            </div>
          </motion.div>
        ))}
      </div>

      {prices.length === 0 && !loading && (
        <div className="text-center py-12">
          <BarChart3 className="w-12 h-12 mx-auto text-krishisetu-text-muted mb-3" />
          <p className="text-krishisetu-text-muted">
            {language === 'hi' ? 'कोई मंडी भाव उपलब्ध नहीं' : language === 'kn' ? 'ಮಂಡಿ ಬೆಲೆ ಲಭ್ಯವಿಲ್ಲ' : 'No mandi prices found'}
          </p>
        </div>
      )}

      {/* Price Chart */}
      {selectedCrop && chartData.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-krishisetu p-4">
          <h3 className="font-heading text-base font-semibold text-krishisetu-text-primary mb-4">
            📈 {selectedCrop} — {language === 'hi' ? 'मूल्य सीमा' : language === 'kn' ? 'ಬೆಲೆ ಶ್ರೇಣಿ' : 'Price Range'}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="name" fontSize={12} tick={{ fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <YAxis fontSize={12} tick={{ fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  formatter={(value: unknown) => [formatCurrency(Number(value || 0)), 'Price']}
                  cursor={{ fill: 'transparent' }}
                />
                <Bar dataKey="price" radius={[4, 4, 0, 0]} maxBarSize={60}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
