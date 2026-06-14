'use client';

import { useState } from 'react';
import { AlertCircle } from 'lucide-react';

interface Step3Props {
  formData: any;
  setFormData: (data: any) => void;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
}

const ALL_CROPS = [
  { id: 'tomato', label: 'Tomato', icon: '🍅' },
  { id: 'onion', label: 'Onion', icon: '🧅' },
  { id: 'potato', label: 'Potato', icon: '🥔' },
  { id: 'rice', label: 'Rice', icon: '🌾' },
  { id: 'wheat', label: 'Wheat', icon: '🌾' },
  { id: 'ragi', label: 'Ragi', icon: '🌿' },
  { id: 'jowar', label: 'Jowar', icon: '🌾' },
  { id: 'sunflower', label: 'Sunflower', icon: '🌻' },
  { id: 'groundnut', label: 'Groundnut', icon: '🥜' },
  { id: 'cotton', label: 'Cotton', icon: '🪴' },
  { id: 'sugarcane', label: 'Sugarcane', icon: '🎋' },
  { id: 'chilli', label: 'Chilli', icon: '🌶️' },
  { id: 'garlic', label: 'Garlic', icon: '🧄' },
  { id: 'cabbage', label: 'Cabbage', icon: '🥦' },
  { id: 'brinjal', label: 'Brinjal', icon: '🍆' },
  { id: 'mango', label: 'Mango', icon: '🥭' },
  { id: 'banana', label: 'Banana', icon: '🍌' },
  { id: 'capsicum', label: 'Capsicum', icon: '🫑' },
  { id: 'turmeric', label: 'Turmeric', icon: '🌿' },
];

export default function Step3_FarmDetails({ formData, setFormData, errors, setErrors }: Step3Props) {
  const [unit, setUnit] = useState<'acres' | 'hectares'>('acres');
  const [otherCrop, setOtherCrop] = useState('');
  const [showOther, setShowOther] = useState(false);

  const displayLandSize = unit === 'hectares' && formData.land_size_acres 
    ? (Number(formData.land_size_acres) / 2.471).toFixed(2) 
    : formData.land_size_acres;

  const handleLandSizeChange = (val: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      setFormData({ ...formData, land_size_acres: '' });
      return;
    }
    const acres = unit === 'hectares' ? num * 2.471 : num;
    setFormData({ ...formData, land_size_acres: acres.toString() });
  };

  const handleBlur = (field: string) => {
    if (!formData[field]) {
      setErrors({ ...errors, [field]: 'This field is required' });
    } else {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const handleCropToggle = (cropLabel: string) => {
    let newCrops = [...(formData.primary_crops || [])];
    if (newCrops.includes(cropLabel)) {
      newCrops = newCrops.filter(c => c !== cropLabel);
    } else {
      newCrops.push(cropLabel);
    }
    setFormData({ ...formData, primary_crops: newCrops });
    if (newCrops.length > 0) {
      const newErrors = { ...errors };
      delete newErrors.primary_crops;
      setErrors(newErrors);
    }
  };

  const landCategory = !formData.land_size_acres ? null :
    Number(formData.land_size_acres) < 2 ? 'small' :
    Number(formData.land_size_acres) <= 10 ? 'medium' : 'large';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center md:text-left">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#111827] mb-2">About Your Farm</h2>
        <p className="text-[#6b7280] text-base md:text-lg">Help us understand your farming setup</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-[15px] font-medium text-[#374151] mb-1.5">Total Land Size / ಭೂಮಿ ಗಾತ್ರ / ज़मीन का आकार *</label>
          <div className="flex gap-3">
            <input
              type="number"
              step="0.1"
              placeholder="e.g. 3.5"
              value={displayLandSize}
              onChange={(e) => handleLandSizeChange(e.target.value)}
              onBlur={() => handleBlur('land_size_acres')}
              className={`flex-1 px-4 py-3.5 bg-white border-1.5 rounded-xl text-base text-[#111827] outline-none transition-all duration-200 ${
                errors.land_size_acres ? 'border-red-500 focus:ring-4 focus:ring-red-500/10' : 'border-[#d1fae5] focus:border-[#166534] focus:ring-4 focus:ring-[#166534]/10'
              }`}
            />
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setUnit('acres')}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${unit === 'acres' ? 'bg-white shadow text-[#166534]' : 'text-[#6b7280]'}`}
              >
                Acres
              </button>
              <button
                onClick={() => setUnit('hectares')}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${unit === 'hectares' ? 'bg-white shadow text-[#166534]' : 'text-[#6b7280]'}`}
              >
                Hectares
              </button>
            </div>
          </div>
          {errors.land_size_acres && (
            <p className="flex items-center gap-1.5 mt-1.5 text-[13px] text-red-500">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.land_size_acres}
            </p>
          )}

          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className={`p-2 rounded-lg text-center text-xs font-medium border ${landCategory === 'small' ? 'border-[#166534] bg-[#f0fdf4] text-[#166534]' : 'border-gray-200 text-gray-400'}`}>Small (&lt; 2 acres) 🏡</div>
            <div className={`p-2 rounded-lg text-center text-xs font-medium border ${landCategory === 'medium' ? 'border-[#166534] bg-[#f0fdf4] text-[#166534]' : 'border-gray-200 text-gray-400'}`}>Medium (2–10 acres) 🌾</div>
            <div className={`p-2 rounded-lg text-center text-xs font-medium border ${landCategory === 'large' ? 'border-[#166534] bg-[#f0fdf4] text-[#166534]' : 'border-gray-200 text-gray-400'}`}>Large (10+ acres) 🏭</div>
          </div>
        </div>

        <div>
          <label className="block text-[15px] font-medium text-[#374151] mb-3">Land Ownership *</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { id: 'owned', label: 'Own Land', desc: 'You own the land', icon: '📜' },
              { id: 'leased', label: 'Leased Land', desc: 'You lease from others', icon: '📋' },
              { id: 'both', label: 'Both', desc: 'Own + Leased', icon: '🤝' }
            ].map((o) => (
              <button
                key={o.id}
                onClick={() => {
                  setFormData({ ...formData, land_ownership: o.id });
                  const newErrors = { ...errors };
                  delete newErrors.land_ownership;
                  setErrors(newErrors);
                }}
                className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all duration-200 text-center ${
                  formData.land_ownership === o.id 
                    ? 'border-[#166534] bg-[#f0fdf4] shadow-sm' 
                    : 'border-gray-200 bg-white hover:bg-[#f0fdf4]/50'
                } ${errors.land_ownership && !formData.land_ownership ? 'border-red-300 bg-red-50' : ''}`}
              >
                <span className="text-2xl mb-2">{o.icon}</span>
                <span className={`text-sm font-semibold mb-1 ${formData.land_ownership === o.id ? 'text-[#166534]' : 'text-[#111827]'}`}>{o.label}</span>
                <span className="text-xs text-[#6b7280]">{o.desc}</span>
              </button>
            ))}
          </div>
          {errors.land_ownership && (
            <p className="flex items-center gap-1.5 mt-1.5 text-[13px] text-red-500">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.land_ownership}
            </p>
          )}
        </div>

        <div>
          <label className="block text-[15px] font-medium text-[#374151] mb-3">What do you grow? (select all that apply) *</label>
          <div className="flex flex-wrap gap-2">
            {ALL_CROPS.map((crop) => {
              const isSelected = (formData.primary_crops || []).includes(crop.label);
              return (
                <button
                  key={crop.id}
                  onClick={() => handleCropToggle(crop.label)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 text-sm font-medium transition-all ${
                    isSelected ? 'border-[#166534] bg-[#166534] text-white' : 'border-gray-200 bg-white text-[#4b5563] hover:border-[#166534]/50'
                  }`}
                >
                  <span>{crop.icon}</span> {crop.label}
                </button>
              );
            })}
            <button
              onClick={() => setShowOther(!showOther)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 text-sm font-medium transition-all ${
                showOther ? 'border-[#166534] bg-[#f0fdf4] text-[#166534]' : 'border-gray-200 bg-white text-[#4b5563]'
              }`}
            >
              <span>➕</span> Other
            </button>
          </div>
          
          {showOther && (
            <div className="mt-3 flex gap-2">
              <input 
                type="text" 
                placeholder="Type crop name and press enter"
                value={otherCrop}
                onChange={(e) => setOtherCrop(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && otherCrop.trim()) {
                    e.preventDefault();
                    handleCropToggle(otherCrop.trim());
                    setOtherCrop('');
                  }
                }}
                className="flex-1 px-4 py-2 border-1.5 border-[#d1fae5] focus:border-[#166534] outline-none rounded-xl text-sm"
              />
              <button 
                onClick={() => {
                  if (otherCrop.trim()) {
                    handleCropToggle(otherCrop.trim());
                    setOtherCrop('');
                  }
                }}
                className="px-4 bg-[#166534] text-white rounded-xl text-sm font-medium"
              >
                Add
              </button>
            </div>
          )}

          {(formData.primary_crops || []).length > 0 && (
            <p className="mt-2 text-sm font-medium text-[#166534]">{(formData.primary_crops || []).length} crops selected</p>
          )}

          {errors.primary_crops && (
            <p className="flex items-center gap-1.5 mt-1.5 text-[13px] text-red-500">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.primary_crops}
            </p>
          )}
        </div>

        <div>
          <label className="block text-[15px] font-medium text-[#374151] mb-3">How do you farm? *</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'traditional', label: 'Traditional', desc: 'Local seeds, conventional methods', icon: '🌱' },
              { id: 'organic', label: 'Organic', desc: 'No chemical pesticides', icon: '🌿' },
              { id: 'mixed', label: 'Mixed', desc: 'Combination of both', icon: '🔄' },
              { id: 'commercial', label: 'Commercial', desc: 'Large scale, export-oriented', icon: '🏭' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  setFormData({ ...formData, farming_type: f.id });
                  const newErrors = { ...errors };
                  delete newErrors.farming_type;
                  setErrors(newErrors);
                }}
                className={`flex flex-col items-start p-4 border-2 rounded-xl transition-all duration-200 text-left ${
                  formData.farming_type === f.id 
                    ? 'border-[#166534] bg-[#f0fdf4] shadow-sm' 
                    : 'border-gray-200 bg-white hover:bg-[#f0fdf4]/50'
                } ${errors.farming_type && !formData.farming_type ? 'border-red-300 bg-red-50' : ''}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{f.icon}</span>
                  <span className={`text-sm font-semibold ${formData.farming_type === f.id ? 'text-[#166534]' : 'text-[#111827]'}`}>{f.label}</span>
                </div>
                <span className="text-xs text-[#6b7280]">{f.desc}</span>
              </button>
            ))}
          </div>
          {errors.farming_type && (
            <p className="flex items-center gap-1.5 mt-1.5 text-[13px] text-red-500">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.farming_type}
            </p>
          )}
        </div>

        <div>
          <label className="block text-[15px] font-medium text-[#374151] mb-3">Water source for your farm *</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { id: 'rainfed', label: 'Rain-fed Only', icon: '🌧️' },
              { id: 'canal', label: 'Canal / River', icon: '💧' },
              { id: 'borewell', label: 'Borewell', icon: '🔧' },
              { id: 'drip', label: 'Drip Irrigation', icon: '💦' },
              { id: 'sprinkler', label: 'Sprinkler', icon: '🌀' },
              { id: 'multiple', label: 'Multiple Sources', icon: '🔄' }
            ].map((i) => (
              <button
                key={i.id}
                onClick={() => {
                  setFormData({ ...formData, irrigation_source: i.id });
                  const newErrors = { ...errors };
                  delete newErrors.irrigation_source;
                  setErrors(newErrors);
                }}
                className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl transition-all duration-200 text-center ${
                  formData.irrigation_source === i.id 
                    ? 'border-[#166534] bg-[#f0fdf4] shadow-sm' 
                    : 'border-gray-200 bg-white hover:bg-[#f0fdf4]/50'
                } ${errors.irrigation_source && !formData.irrigation_source ? 'border-red-300 bg-red-50' : ''}`}
              >
                <span className="text-2xl mb-1.5">{i.icon}</span>
                <span className={`text-xs font-semibold ${formData.irrigation_source === i.id ? 'text-[#166534]' : 'text-[#4b5563]'}`}>{i.label}</span>
              </button>
            ))}
          </div>
          {errors.irrigation_source && (
            <p className="flex items-center gap-1.5 mt-1.5 text-[13px] text-red-500">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.irrigation_source}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
