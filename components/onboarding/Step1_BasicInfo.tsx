'use client';

import { useRef, useState } from 'react';
import { Camera, AlertCircle } from 'lucide-react';

interface Step1Props {
  formData: any;
  setFormData: (data: any) => void;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
}

export default function Step1_BasicInfo({ formData, setFormData, errors, setErrors }: Step1Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(formData.profile_photo_url || null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        setFormData({ ...formData, profile_photo_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBlur = (field: string) => {
    if (!formData[field] && field !== 'phone' && field !== 'profile_photo_url') {
      setErrors({ ...errors, [field]: 'This field is required' });
    } else {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center md:text-left">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#111827] mb-2">Tell Us About Yourself</h2>
        <p className="text-[#6b7280] text-base md:text-lg">This helps us personalize your farming experience</p>
      </div>

      <div className="flex flex-col items-center justify-center">
        <div 
          className="relative w-24 h-24 rounded-full border-2 border-dashed border-[#22c55e] bg-gray-50 flex items-center justify-center cursor-pointer overflow-hidden hover:bg-green-50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          {photoPreview ? (
            <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <Camera className="w-8 h-8 text-[#9ca3af]" />
          )}
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          accept="image/*" 
          className="hidden" 
          onChange={handlePhotoUpload} 
        />
        <p className="mt-3 text-sm text-[#6b7280]">Upload Photo (optional)</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-[15px] font-medium text-[#374151] mb-1.5">Full Name / पूरा नाम / ಹೆಸರು *</label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={formData.full_name}
            onChange={(e) => {
              // Auto-capitalize
              const val = e.target.value.replace(/\b\w/g, c => c.toUpperCase());
              setFormData({ ...formData, full_name: val });
            }}
            onBlur={() => handleBlur('full_name')}
            className={`w-full px-4 py-3.5 bg-white border-1.5 rounded-xl text-base text-[#111827] outline-none transition-all duration-200 ${
              errors.full_name ? 'border-red-500 focus:ring-4 focus:ring-red-500/10' : 'border-[#d1fae5] focus:border-[#166534] focus:ring-4 focus:ring-[#166534]/10'
            }`}
          />
          {errors.full_name && (
            <p className="flex items-center gap-1.5 mt-1.5 text-[13px] text-red-500">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.full_name}
            </p>
          )}
        </div>

        <div>
          <label className="block text-[15px] font-medium text-[#374151] mb-1.5">Your Age *</label>
          <input
            type="number"
            min="18"
            max="100"
            placeholder="Enter your age"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            onBlur={() => {
              handleBlur('age');
              if (formData.age && (Number(formData.age) < 18 || Number(formData.age) > 100)) {
                setErrors({ ...errors, age: 'Must be between 18 and 100' });
              }
            }}
            className={`w-full px-4 py-3.5 bg-white border-1.5 rounded-xl text-base text-[#111827] outline-none transition-all duration-200 ${
              errors.age ? 'border-red-500 focus:ring-4 focus:ring-red-500/10' : 'border-[#d1fae5] focus:border-[#166534] focus:ring-4 focus:ring-[#166534]/10'
            }`}
          />
          {errors.age ? (
            <p className="flex items-center gap-1.5 mt-1.5 text-[13px] text-red-500">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.age}
            </p>
          ) : (
            <p className="mt-1.5 text-[13px] text-[#6b7280]">Must be 18 or above</p>
          )}
        </div>

        <div>
          <label className="block text-[15px] font-medium text-[#374151] mb-3">Gender *</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'male', label: 'Male', icon: '👨' },
              { id: 'female', label: 'Female', icon: '👩' },
              { id: 'other', label: 'Other', icon: '🧑' },
              { id: 'prefer_not_to_say', label: 'Prefer not to say', icon: '🤐' }
            ].map((g) => (
              <button
                key={g.id}
                onClick={() => {
                  setFormData({ ...formData, gender: g.id });
                  const newErrors = { ...errors };
                  delete newErrors.gender;
                  setErrors(newErrors);
                }}
                className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all duration-200 ${
                  formData.gender === g.id 
                    ? 'border-[#166534] bg-[#f0fdf4] shadow-sm' 
                    : 'border-gray-200 bg-white hover:bg-[#f0fdf4]/50'
                } ${errors.gender && !formData.gender ? 'border-red-300 bg-red-50' : ''}`}
              >
                <span className="text-2xl mb-1">{g.icon}</span>
                <span className={`text-sm font-medium ${formData.gender === g.id ? 'text-[#166534]' : 'text-[#4b5563]'}`}>{g.label}</span>
              </button>
            ))}
          </div>
          {errors.gender && (
            <p className="flex items-center gap-1.5 mt-1.5 text-[13px] text-red-500">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.gender}
            </p>
          )}
        </div>

        <div>
          <label className="block text-[15px] font-medium text-[#374151] mb-1.5">Mobile Number (optional)</label>
          <div className={`flex items-center w-full bg-white border-1.5 rounded-xl transition-all duration-200 overflow-hidden ${
            errors.phone ? 'border-red-500 focus-within:ring-4 focus-within:ring-red-500/10' : 'border-[#d1fae5] focus-within:border-[#166534] focus-within:ring-4 focus-within:ring-[#166534]/10'
          }`}>
            <div className="px-4 py-3.5 bg-gray-50 border-r border-[#d1fae5] text-[#6b7280] font-medium">
              +91
            </div>
            <input
              type="tel"
              maxLength={10}
              placeholder="9876543210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
              onBlur={() => {
                if (formData.phone && formData.phone.length !== 10) {
                  setErrors({ ...errors, phone: 'Must be exactly 10 digits' });
                } else {
                  const newErrors = { ...errors };
                  delete newErrors.phone;
                  setErrors(newErrors);
                }
              }}
              className="flex-1 px-4 py-3.5 bg-transparent text-base text-[#111827] outline-none"
            />
          </div>
          {errors.phone ? (
            <p className="flex items-center gap-1.5 mt-1.5 text-[13px] text-red-500">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.phone}
            </p>
          ) : (
            <p className="mt-1.5 text-[13px] text-[#6b7280]">For SMS alerts on mandi prices and weather</p>
          )}
        </div>

        <div>
          <label className="block text-[15px] font-medium text-[#374151] mb-3">Preferred Language / पसंदीदा भाषा / ಆದ್ಯತೆ ಭಾಷೆ *</label>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {[
              { id: 'en', label: 'English', flag: '🇬🇧' },
              { id: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
              { id: 'kn', label: 'ಕನ್ನಡ', flag: '🏳️' },
              { id: 'te', label: 'తెలుగు', flag: '🏳️' },
              { id: 'ta', label: 'தமிழ்', flag: '🏳️' },
              { id: 'mr', label: 'मराठी', flag: '🏳️' }
            ].map((l) => (
              <button
                key={l.id}
                onClick={() => setFormData({ ...formData, preferred_language: l.id })}
                className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl transition-all duration-200 ${
                  formData.preferred_language === l.id 
                    ? 'border-[#166534] bg-[#f0fdf4] shadow-sm' 
                    : 'border-gray-200 bg-white hover:bg-[#f0fdf4]/50'
                }`}
              >
                <span className="text-xl mb-1">{l.flag}</span>
                <span className={`text-xs font-semibold ${formData.preferred_language === l.id ? 'text-[#166534]' : 'text-[#4b5563]'}`}>{l.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
