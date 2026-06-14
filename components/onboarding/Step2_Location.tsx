'use client';

import { useState, useEffect } from 'react';
import { MapPin, AlertCircle, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamic import for Leaflet map to avoid SSR issues
const MapPreview = dynamic(() => import('./MapPreview'), { ssr: false });

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 
  'Uttarakhand', 'West Bengal', 'Andaman & Nicobar Islands', 'Chandigarh', 
  'Dadra & Nagar Haveli', 'Daman & Diu', 'Delhi', 'Jammu & Kashmir', 'Ladakh', 
  'Lakshadweep', 'Puducherry'
];

interface Step2Props {
  formData: any;
  setFormData: (data: any) => void;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
}

export default function Step2_Location({ formData, setFormData, errors, setErrors }: Step2Props) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleBlur = (field: string) => {
    if (!formData[field] && field !== 'taluk' && field !== 'pincode' && field !== 'gps_lat' && field !== 'gps_lng') {
      setErrors({ ...errors, [field]: 'This field is required' });
    } else {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };


  const fetchSuggestions = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&countrycodes=in&format=json&limit=5`);
      const data = await res.json();
      setSuggestions(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePincodeChange = async (val: string) => {
    setFormData({ ...formData, pincode: val });
    if (val.length === 6 && !formData.state) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${val}`);
        const data = await res.json();
        if (data && data[0] && data[0].Status === 'Success') {
          const state = data[0].PostOffice[0].State;
          const district = data[0].PostOffice[0].District;
          setFormData(prev => ({
            ...prev,
            pincode: val,
            state: state || prev.state,
            district: district || prev.district
          }));
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center md:text-left">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#111827] mb-2">Where is Your Farm?</h2>
        <p className="text-[#6b7280] text-base md:text-lg">We use this to show local mandi prices, weather, and nearby schemes</p>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <label className="block text-[15px] font-medium text-[#374151] mb-1.5">Village / City Name / ಊರು / गाँव *</label>
          <input
            type="text"
            placeholder="e.g. Dharwad, Hubli, Ramdurg"
            value={formData.village_or_city}
            onChange={(e) => {
              setFormData({ ...formData, village_or_city: e.target.value });
              fetchSuggestions(e.target.value);
              setShowSuggestions(true);
            }}
            onBlur={() => setTimeout(() => { setShowSuggestions(false); handleBlur('village_or_city'); }, 200)}
            className={`w-full px-4 py-3.5 bg-white border-1.5 rounded-xl text-base text-[#111827] outline-none transition-all duration-200 ${
              errors.village_or_city ? 'border-red-500 focus:ring-4 focus:ring-red-500/10' : 'border-[#d1fae5] focus:border-[#166534] focus:ring-4 focus:ring-[#166534]/10'
            }`}
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
              {suggestions.map((s, i) => (
                <div 
                  key={i} 
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm text-[#374151]"
                  onClick={() => {
                    setFormData({ ...formData, village_or_city: s.name, gps_lat: parseFloat(s.lat), gps_lng: parseFloat(s.lon) });
                    setShowSuggestions(false);
                  }}
                >
                  {s.display_name}
                </div>
              ))}
            </div>
          )}
          {errors.village_or_city ? (
            <p className="flex items-center gap-1.5 mt-1.5 text-[13px] text-red-500">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.village_or_city}
            </p>
          ) : (
            <p className="mt-1.5 text-[13px] text-[#6b7280]">Enter the name of your village or nearest city</p>
          )}
        </div>

        <div>
          <label className="block text-[15px] font-medium text-[#374151] mb-1.5">Taluk / Block (optional)</label>
          <input
            type="text"
            placeholder="e.g. Dharwad Taluk"
            value={formData.taluk}
            onChange={(e) => setFormData({ ...formData, taluk: e.target.value })}
            className="w-full px-4 py-3.5 bg-white border-1.5 border-[#d1fae5] focus:border-[#166534] focus:ring-4 focus:ring-[#166534]/10 rounded-xl text-base text-[#111827] outline-none transition-all duration-200"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[15px] font-medium text-[#374151] mb-1.5">District / ಜಿಲ್ಲೆ / जिला *</label>
            <input
              type="text"
              placeholder="e.g. Dharwad"
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              onBlur={() => handleBlur('district')}
              className={`w-full px-4 py-3.5 bg-white border-1.5 rounded-xl text-base text-[#111827] outline-none transition-all duration-200 ${
                errors.district ? 'border-red-500 focus:ring-4 focus:ring-red-500/10' : 'border-[#d1fae5] focus:border-[#166534] focus:ring-4 focus:ring-[#166534]/10'
              }`}
            />
            {errors.district && (
              <p className="flex items-center gap-1.5 mt-1.5 text-[13px] text-red-500">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.district}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[15px] font-medium text-[#374151] mb-1.5">State / ರಾಜ್ಯ / राज्य *</label>
            <select
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              onBlur={() => handleBlur('state')}
              className={`w-full px-4 py-3.5 bg-white border-1.5 rounded-xl text-base text-[#111827] outline-none transition-all duration-200 appearance-none ${
                errors.state ? 'border-red-500 focus:ring-4 focus:ring-red-500/10' : 'border-[#d1fae5] focus:border-[#166534] focus:ring-4 focus:ring-[#166534]/10'
              }`}
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236b7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em' }}
            >
              <option value="">Select State</option>
              {INDIAN_STATES.map(state => <option key={state} value={state}>{state}</option>)}
            </select>
            {errors.state && (
              <p className="flex items-center gap-1.5 mt-1.5 text-[13px] text-red-500">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.state}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-[15px] font-medium text-[#374151] mb-1.5">PIN Code (optional)</label>
          <input
            type="text"
            maxLength={6}
            placeholder="e.g. 580001"
            value={formData.pincode}
            onChange={(e) => handlePincodeChange(e.target.value.replace(/\D/g, ''))}
            className="w-full md:w-1/2 px-4 py-3.5 bg-white border-1.5 border-[#d1fae5] focus:border-[#166534] focus:ring-4 focus:ring-[#166534]/10 rounded-xl text-base text-[#111827] outline-none transition-all duration-200"
          />
        </div>

        {formData.gps_lat && formData.gps_lng && (
          <div className="mt-6 rounded-xl overflow-hidden border-2 border-gray-100 shadow-sm">
            <MapPreview lat={formData.gps_lat} lng={formData.gps_lng} />
          </div>
        )}
      </div>
    </div>
  );
}
