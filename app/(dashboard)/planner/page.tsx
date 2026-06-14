'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/stores/app.store';
import { CROPS } from '@/types';
import { getSeasonColor, getCropEmoji } from '@/lib/utils';
import { Plus, Clock, X } from 'lucide-react';
import { addDays, format, differenceInDays } from 'date-fns';

interface LocalPlan {
  id: string;
  crop_name: string;
  variety: string;
  field_name: string;
  area_acres: number;
  season: string;
  sowing_date: string;
  expected_harvest_date: string;
  status: string;
}

const statusSteps = ['planned', 'sowing', 'growing', 'harvested', 'sold'];

export default function PlannerPage() {
  const { language } = useAppStore();
  const [plans, setPlans] = useState<LocalPlan[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newPlan, setNewPlan] = useState({ crop_name: '', variety: '', field_name: '', area_acres: '', season: 'kharif', sowing_date: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/planner');
        const data = await res.json();
        if (data.plans) setPlans(data.plans);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const addPlan = async () => {
    const crop = CROPS.find((c) => c.name === newPlan.crop_name);
    const sowDate = newPlan.sowing_date || new Date().toISOString().split('T')[0];
    const harvestDate = format(addDays(new Date(sowDate), crop?.duration_days || 120), 'yyyy-MM-dd');
    
    try {
      const res = await fetch('/api/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_plan',
          crop_name: newPlan.crop_name,
          variety: newPlan.variety,
          field_name: newPlan.field_name,
          area_acres: parseFloat(newPlan.area_acres) || 1,
          season: newPlan.season,
          sowing_date: sowDate,
          expected_harvest_date: harvestDate
        })
      });
      const data = await res.json();
      if (data.success && data.plan) {
        setPlans([data.plan, ...plans]);
        setShowForm(false);
        setNewPlan({ crop_name: '', variety: '', field_name: '', area_acres: '', season: 'kharif', sowing_date: '' });
      }
    } catch (e) { console.error(e); }
  };

  const getProgress = (plan: LocalPlan) => {
    const idx = statusSteps.indexOf(plan.status);
    return ((idx + 1) / statusSteps.length) * 100;
  };

  const getDaysToHarvest = (plan: LocalPlan) => {
    const days = differenceInDays(new Date(plan.expected_harvest_date), new Date());
    return Math.max(0, days);
  };

  const title = language === 'hi' ? 'फसल योजना 📅' : language === 'kn' ? 'ಬೆಳೆ ಯೋಜನೆ 📅' : 'Crop Planner 📅';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-xl md:text-2xl font-bold text-krishisetu-text-primary">{title}</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-1.5 text-sm">
          <Plus className="w-4 h-4" />
          {language === 'hi' ? 'नई योजना' : language === 'kn' ? 'ಹೊಸ ಯೋಜನೆ' : 'New Plan'}
        </button>
      </div>

      {/* Add Plan Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded-xl p-5 w-full max-w-md shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-lg font-semibold text-krishisetu-text-primary">
                  {language === 'hi' ? 'नई फसल योजना' : language === 'kn' ? 'ಹೊಸ ಬೆಳೆ ಯೋಜನೆ' : 'New Crop Plan'}
                </h2>
                <button onClick={() => setShowForm(false)} className="p-1 rounded-full hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3">
                <select value={newPlan.crop_name} onChange={(e) => setNewPlan({ ...newPlan, crop_name: e.target.value })}
                  className="w-full rounded-lg border border-krishisetu-border px-3 py-2.5 text-sm">
                  <option value="">Select Crop</option>
                  {CROPS.map((c) => <option key={c.name} value={c.name}>{c.emoji} {c.name}</option>)}
                </select>
                <input placeholder="Variety" value={newPlan.variety} onChange={(e) => setNewPlan({ ...newPlan, variety: e.target.value })}
                  className="w-full rounded-lg border border-krishisetu-border px-3 py-2.5 text-sm" />
                <input placeholder="Field name" value={newPlan.field_name} onChange={(e) => setNewPlan({ ...newPlan, field_name: e.target.value })}
                  className="w-full rounded-lg border border-krishisetu-border px-3 py-2.5 text-sm" />
                <input placeholder="Area (acres)" type="number" value={newPlan.area_acres} onChange={(e) => setNewPlan({ ...newPlan, area_acres: e.target.value })}
                  className="w-full rounded-lg border border-krishisetu-border px-3 py-2.5 text-sm" />
                <select value={newPlan.season} onChange={(e) => setNewPlan({ ...newPlan, season: e.target.value })}
                  className="w-full rounded-lg border border-krishisetu-border px-3 py-2.5 text-sm">
                  <option value="kharif">Kharif</option>
                  <option value="rabi">Rabi</option>
                  <option value="zaid">Zaid</option>
                  <option value="annual">Annual</option>
                </select>
                <input type="date" value={newPlan.sowing_date} onChange={(e) => setNewPlan({ ...newPlan, sowing_date: e.target.value })}
                  className="w-full rounded-lg border border-krishisetu-border px-3 py-2.5 text-sm" />
                <button onClick={addPlan} disabled={!newPlan.crop_name} className="btn-primary w-full">
                  {language === 'hi' ? 'योजना जोड़ें' : language === 'kn' ? 'ಯೋಜನೆ ಸೇರಿಸಿ' : 'Add Plan'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Plan Cards */}
      <div className="space-y-3">
        {plans.map((plan) => (
          <motion.div key={plan.id} whileHover={{ y: -2 }} className="card-krishisetu p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getCropEmoji(plan.crop_name)}</span>
                <div>
                  <h3 className="font-heading text-base font-semibold text-krishisetu-text-primary">
                    {plan.crop_name} {plan.variety && `(${plan.variety})`}
                  </h3>
                  <p className="text-xs text-krishisetu-text-muted">{plan.field_name} • {plan.area_acres} acres</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${getSeasonColor(plan.season)}`}>
                {plan.season.toUpperCase()}
              </span>
            </div>

            {/* Progress bar */}
            <div className="mb-3">
              <div className="flex justify-between text-[10px] text-krishisetu-text-muted mb-1">
                {statusSteps.map((step) => (
                  <span key={step} className={statusSteps.indexOf(step) <= statusSteps.indexOf(plan.status) ? 'text-primary font-semibold' : ''}>
                    {step.charAt(0).toUpperCase() + step.slice(1)}
                  </span>
                ))}
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${getProgress(plan)}%` }}
                  className="h-full bg-primary rounded-full"
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1 text-krishisetu-text-muted">
                <Clock className="w-3.5 h-3.5" />
                <span>{getDaysToHarvest(plan)} days to harvest</span>
              </div>
              <span className="text-xs text-krishisetu-text-muted">
                Harvest: {format(new Date(plan.expected_harvest_date), 'dd MMM yyyy')}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
