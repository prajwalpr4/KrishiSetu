'use client';

import { motion } from 'framer-motion';
import { AlertCircle, Lock } from 'lucide-react';

interface Step4Props {
  formData: any;
  setFormData: (data: any) => void;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
}

const INCOME_RANGES = [
  { id: 'under_1_lakh', label: 'Under ₹1 Lakh/year', desc: 'Small farmer, subsistence farming', schemes: '5+', icon: '💼' },
  { id: '1_to_2_lakh', label: '₹1 Lakh – ₹2 Lakh/year', desc: 'Small to marginal farmer', schemes: '4+', icon: '💰' },
  { id: '2_to_5_lakh', label: '₹2 Lakh – ₹5 Lakh/year', desc: 'Marginal to medium farmer', schemes: '3+', icon: '💵' },
  { id: '5_to_10_lakh', label: '₹5 Lakh – ₹10 Lakh/year', desc: 'Medium scale farmer', schemes: '2+', icon: '🏦' },
  { id: 'above_10_lakh', label: 'Above ₹10 Lakh/year', desc: 'Large commercial farmer', schemes: '1+', icon: '🏭' },
];

export default function Step4_Financial({ formData, setFormData, errors, setErrors }: Step4Props) {
  
  const Toggle = ({ label, helper, checked, onChange }: { label: string, helper: string, checked: boolean, onChange: (v: boolean) => void }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
      <div className="pr-4">
        <p className="text-[15px] font-medium text-[#111827]">{label}</p>
        <p className="text-xs text-[#6b7280] mt-0.5">{helper}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${
          checked ? 'bg-[#166534]' : 'bg-gray-300'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-300 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center md:text-left">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#111827] mb-2">Your Financial Profile</h2>
        <p className="text-[#6b7280] text-base md:text-lg">We use this to find the best government schemes and credit options</p>
      </div>

      <div className="bg-[#f0fdf4] border-l-4 border-[#166534] rounded-r-xl p-4 flex items-start gap-3">
        <Lock className="w-5 h-5 text-[#166534] flex-shrink-0 mt-0.5" />
        <p className="text-sm text-[#166534] font-medium">Your financial information is stored securely and never shared with third parties.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-[15px] font-medium text-[#374151] mb-3">Approximate Yearly Income from Farming *</label>
          <div className="space-y-3">
            {INCOME_RANGES.map((inc) => (
              <button
                key={inc.id}
                onClick={() => {
                  setFormData({ ...formData, yearly_income_range: inc.id });
                  const newErrors = { ...errors };
                  delete newErrors.yearly_income_range;
                  setErrors(newErrors);
                }}
                className={`w-full flex items-center justify-between p-4 border-2 rounded-xl transition-all duration-200 text-left ${
                  formData.yearly_income_range === inc.id 
                    ? 'border-[#166534] bg-[#f0fdf4] shadow-sm' 
                    : 'border-gray-200 bg-white hover:bg-[#f0fdf4]/30'
                } ${errors.yearly_income_range && !formData.yearly_income_range ? 'border-red-300 bg-red-50' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{inc.icon}</span>
                  <div>
                    <h4 className={`font-semibold text-[15px] ${formData.yearly_income_range === inc.id ? 'text-[#166534]' : 'text-[#111827]'}`}>{inc.label}</h4>
                    <p className="text-xs text-[#6b7280] mt-0.5">{inc.desc}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="bg-[#dcfce7] text-[#166534] text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Eligible for {inc.schemes} schemes
                  </span>
                  {formData.yearly_income_range === inc.id && (
                    <div className="w-5 h-5 rounded-full bg-[#166534] flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
          {errors.yearly_income_range && (
            <p className="flex items-center gap-1.5 mt-1.5 text-[13px] text-red-500">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.yearly_income_range}
            </p>
          )}
        </div>

        {formData.yearly_income_range && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#166534] to-[#15803d] rounded-2xl p-5 text-white shadow-lg"
          >
            <h4 className="font-bold mb-4 flex items-center gap-2">💡 Based on your profile, you may receive:</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-white/10 rounded-xl p-3">
                <span className="text-xl">📋</span>
                <div>
                  <p className="font-semibold text-sm">PM-KISAN</p>
                  <p className="text-white/70 text-xs">₹6,000/year direct to bank</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/10 rounded-xl p-3">
                <span className="text-xl">🛡️</span>
                <div>
                  <p className="font-semibold text-sm">PMFBY</p>
                  <p className="text-white/70 text-xs">Crop insurance at 2% premium</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/10 rounded-xl p-3">
                <span className="text-xl">💳</span>
                <div>
                  <p className="font-semibold text-sm">Kisan Credit Card</p>
                  <p className="text-white/70 text-xs">Up to ₹3 lakh loan at 4%</p>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-white/50 mt-4 italic">Final eligibility verified by respective portals</p>
          </motion.div>
        )}

        <div className="bg-white border-1.5 border-[#d1fae5] rounded-xl p-4">
          <Toggle 
            label="Do you have a Kisan Credit Card?" 
            helper="KCC gives crop loans at 4% interest"
            checked={formData.has_kisan_credit_card}
            onChange={(v) => setFormData({ ...formData, has_kisan_credit_card: v })}
          />
          <Toggle 
            label="Do you have crop insurance?" 
            helper="Enrolled in PM Fasal Bima Yojana"
            checked={formData.has_crop_insurance}
            onChange={(v) => setFormData({ ...formData, has_crop_insurance: v })}
          />
          <Toggle 
            label="Is your bank account linked to Aadhaar?" 
            helper="Required for PM-KISAN direct benefit transfer"
            checked={formData.bank_account_linked}
            onChange={(v) => setFormData({ ...formData, bank_account_linked: v })}
          />
        </div>

      </div>
    </div>
  );
}
