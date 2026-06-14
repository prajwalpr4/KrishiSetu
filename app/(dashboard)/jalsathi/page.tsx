'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/stores/app.store';
import { CROPS } from '@/types';
import type { IrrigationAdvisory } from '@/types';
import { Droplets, Loader2, Clock, Thermometer, Wind, CloudRain, CheckCircle, Timer } from 'lucide-react';

const soilTypes = ['Sandy', 'Loamy', 'Clay', 'Black Cotton', 'Red Laterite'];
const stages = ['Germination', 'Vegetative', 'Flowering', 'Grain Filling', 'Maturity'];
const pumpOptions = [3, 5, 7.5, 10];

export default function JalSathiPage() {
  const { language } = useAppStore();
  const [crop, setCrop] = useState('');
  const [stage, setStage] = useState('');
  const [soilType, setSoilType] = useState('');
  const [pumpHP, setPumpHP] = useState(5);
  const [loading, setLoading] = useState(false);
  const [advisory, setAdvisory] = useState<IrrigationAdvisory | null>(null);
  const [weatherInfo, setWeatherInfo] = useState<{ temperature: number; humidity: number; precipitation: number } | null>(null);

  const getAdvisory = async () => {
    if (!crop || !stage || !soilType) return;
    setLoading(true);
    try {
      // Get GPS
      let lat = 12.9716, lng = 77.5946;
      if (navigator.geolocation) {
        try {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
          );
          lat = pos.coords.latitude;
          lng = pos.coords.longitude;
        } catch { /* use defaults */ }
      }

      const res = await fetch('/api/jalsathi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crop, stage, soilType, lat, lng, pumpHP, language }),
      });
      const data = await res.json();
      setAdvisory(data.advisory);
      if (data.weather) setWeatherInfo(data.weather);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const title = language === 'hi' ? 'जलसाथी 💧 सिंचाई सलाहकार' : language === 'kn' ? 'ಜಲಸಾಥಿ 💧 ನೀರಾವರಿ ಸಲಹೆಗಾರ' : 'JalSathi 💧 Irrigation Advisor';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-2xl mx-auto">
      <h1 className="font-heading text-xl md:text-2xl font-bold text-krishisetu-text-primary">{title}</h1>
      <p className="text-sm text-krishisetu-text-muted">
        {language === 'hi' ? 'AI-आधारित सिंचाई सलाह प्राप्त करें' : language === 'kn' ? 'AI-ಆಧಾರಿತ ನೀರಾವರಿ ಸಲಹೆ ಪಡೆಯಿರಿ' : 'Get AI-powered irrigation advice based on your crop, soil, and weather'}
      </p>

      {/* Input Form */}
      <div className="card-krishisetu p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-krishisetu-text-body mb-1.5">
            {language === 'hi' ? 'फसल' : language === 'kn' ? 'ಬೆಳೆ' : 'Crop'}
          </label>
          <select value={crop} onChange={(e) => setCrop(e.target.value)}
            className="w-full rounded-lg border border-krishisetu-border px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/30">
            <option value="">Select crop...</option>
            {CROPS.map((c) => <option key={c.name} value={c.name}>{c.emoji} {c.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-krishisetu-text-body mb-1.5">
            {language === 'hi' ? 'विकास अवस्था' : language === 'kn' ? 'ಬೆಳವಣಿಗೆ ಹಂತ' : 'Growth Stage'}
          </label>
          <div className="flex flex-wrap gap-2">
            {stages.map((s) => (
              <button key={s} onClick={() => setStage(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  stage === s ? 'bg-primary text-white' : 'bg-gray-100 text-krishisetu-text-muted hover:bg-gray-200'
                }`}>{s}</button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-krishisetu-text-body mb-1.5">
            {language === 'hi' ? 'मिट्टी का प्रकार' : language === 'kn' ? 'ಮಣ್ಣಿನ ಪ್ರಕಾರ' : 'Soil Type'}
          </label>
          <div className="flex flex-wrap gap-2">
            {soilTypes.map((s) => (
              <button key={s} onClick={() => setSoilType(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  soilType === s ? 'bg-primary text-white' : 'bg-gray-100 text-krishisetu-text-muted hover:bg-gray-200'
                }`}>{s}</button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-krishisetu-text-body mb-1.5">
            {language === 'hi' ? 'पंप क्षमता (HP)' : language === 'kn' ? 'ಪಂಪ್ ಸಾಮರ್ಥ್ಯ (HP)' : 'Pump Capacity (HP)'}
          </label>
          <div className="flex gap-2">
            {pumpOptions.map((hp) => (
              <button key={hp} onClick={() => setPumpHP(hp)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  pumpHP === hp ? 'bg-primary text-white' : 'bg-gray-100 text-krishisetu-text-muted hover:bg-gray-200'
                }`}>{hp} HP</button>
            ))}
          </div>
        </div>

        <button onClick={getAdvisory} disabled={!crop || !stage || !soilType || loading}
          className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-50">
          {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</> : <><Droplets className="w-5 h-5" /> {language === 'hi' ? 'सलाह प्राप्त करें' : language === 'kn' ? 'ಸಲಹೆ ಪಡೆಯಿರಿ' : 'Get Advisory'}</>}
        </button>
      </div>

      {/* Advisory Result */}
      <AnimatePresence>
        {advisory && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Main Recommendation */}
            <div className={`card-krishisetu p-5 text-center ${advisory.should_irrigate ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'}`}>
              <div className="flex items-center justify-center gap-2 mb-2">
                {advisory.should_irrigate ? (
                  <Droplets className="w-8 h-8 text-blue-600" />
                ) : (
                  <CheckCircle className="w-8 h-8 text-green-600" />
                )}
              </div>
              <h2 className={`font-heading text-2xl font-bold ${advisory.should_irrigate ? 'text-blue-700' : 'text-green-700'}`}>
                {advisory.should_irrigate
                  ? (language === 'hi' ? 'अभी सिंचाई करें! 💧' : language === 'kn' ? 'ಈಗ ನೀರಾವರಿ ಮಾಡಿ! 💧' : 'IRRIGATE NOW! 💧')
                  : (language === 'hi' ? `${advisory.next_check_days} दिन प्रतीक्षा करें ✅` : language === 'kn' ? `${advisory.next_check_days} ದಿನ ಕಾಯಿರಿ ✅` : `WAIT ${advisory.next_check_days} DAYS ✅`)}
              </h2>
              <p className="text-sm mt-2 text-krishisetu-text-body">{advisory.reason}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="card-krishisetu p-3 text-center">
                <Droplets className="w-5 h-5 mx-auto text-blue-500 mb-1" />
                <p className="font-mono text-lg font-bold text-krishisetu-text-primary">{advisory.water_mm} mm</p>
                <p className="text-xs text-krishisetu-text-muted">{language === 'hi' ? 'पानी की जरूरत' : 'Water Required'}</p>
              </div>
              <div className="card-krishisetu p-3 text-center">
                <Timer className="w-5 h-5 mx-auto text-amber-500 mb-1" />
                <p className="font-mono text-lg font-bold text-krishisetu-text-primary">{advisory.pump_runtime_minutes} min</p>
                <p className="text-xs text-krishisetu-text-muted">{language === 'hi' ? 'पंप चलाएं' : 'Pump Runtime'}</p>
              </div>
              <div className="card-krishisetu p-3 text-center">
                <Clock className="w-5 h-5 mx-auto text-green-500 mb-1" />
                <p className="font-mono text-sm font-bold text-krishisetu-text-primary">{advisory.best_time}</p>
                <p className="text-xs text-krishisetu-text-muted">{language === 'hi' ? 'सबसे अच्छा समय' : 'Best Time'}</p>
              </div>
              <div className="card-krishisetu p-3 text-center">
                <Droplets className="w-5 h-5 mx-auto text-cyan-500 mb-1" />
                <p className="font-mono text-lg font-bold text-krishisetu-text-primary">{(advisory.water_liters_per_acre || 0).toLocaleString()}</p>
                <p className="text-xs text-krishisetu-text-muted">{language === 'hi' ? 'लीटर/एकड़' : 'Liters/Acre'}</p>
              </div>
            </div>

            {/* Weather Info */}
            {weatherInfo && (
              <div className="card-krishisetu p-4">
                <h3 className="font-heading text-sm font-semibold text-krishisetu-text-primary mb-2">
                  🌦️ {language === 'hi' ? 'मौसम की जानकारी' : 'Weather Info'}
                </h3>
                <div className="flex gap-4 text-sm text-krishisetu-text-body">
                  <span className="flex items-center gap-1"><Thermometer className="w-3.5 h-3.5 text-red-400" /> {Math.round(weatherInfo.temperature)}°C</span>
                  <span className="flex items-center gap-1"><Wind className="w-3.5 h-3.5 text-blue-400" /> {weatherInfo.humidity}%</span>
                  <span className="flex items-center gap-1"><CloudRain className="w-3.5 h-3.5 text-gray-400" /> {weatherInfo.precipitation} mm</span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
