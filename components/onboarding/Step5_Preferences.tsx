'use client';

import { AlertCircle, Camera } from 'lucide-react';

interface Step5Props {
  formData: any;
  setFormData: (data: any) => void;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
  goToStep: (step: number) => void;
}

const INTERESTS = [
  { id: 'disease', title: 'Crop Disease Detection', desc: 'Identify and treat crop diseases', icon: '🔬' },
  { id: 'mandi', title: 'Mandi Price Tracking', desc: 'Get best prices for my produce', icon: '📈' },
  { id: 'schemes', title: 'Government Schemes', desc: 'Find schemes I am eligible for', icon: '🏛️' },
  { id: 'irrigation', title: 'Irrigation Planning', desc: 'Optimize water usage', icon: '💧' },
  { id: 'labor', title: 'Labor Management', desc: 'Track workers and wages', icon: '👥' },
  { id: 'buy', title: 'Buy Farm Inputs', desc: 'Fertilizers, seeds, machinery', icon: '🛒' },
  { id: 'planning', title: 'Crop Planning', desc: 'Plan sowing and harvest schedules', icon: '📅' },
  { id: 'advice', title: 'AI Farm Advice', desc: 'Chat with KisanSarthi', icon: '💬' },
];

export default function Step5_Preferences({ formData, setFormData, errors, setErrors, goToStep }: Step5Props) {
  
  const handleInterestToggle = (id: string) => {
    let newInterests = [...(formData.interests || [])];
    if (newInterests.includes(id)) {
      newInterests = newInterests.filter(i => i !== id);
    } else {
      newInterests.push(id);
    }
    setFormData({ ...formData, interests: newInterests });
    if (newInterests.length > 0) {
      const newErrors = { ...errors };
      delete newErrors.interests;
      setErrors(newErrors);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center md:text-left">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#111827] mb-2">Almost Done! 🎉</h2>
        <p className="text-[#6b7280] text-base md:text-lg">Set your preferences to personalize KrishiSetu for you</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-[15px] font-medium text-[#374151] mb-3">How would you like to receive alerts? *</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'app', label: 'App Notifications', desc: 'In-app alerts and updates', icon: '📱' },
              { id: 'sms', label: 'SMS Alerts', desc: 'Text messages for critical alerts', icon: '💬' },
              { id: 'both', label: 'Both', desc: 'App + SMS', icon: '🔔', badge: 'Recommended' },
              { id: 'none', label: 'None', desc: 'No notifications', icon: '🔕' }
            ].map((n) => (
              <button
                key={n.id}
                onClick={() => {
                  setFormData({ ...formData, notification_preference: n.id });
                  const newErrors = { ...errors };
                  delete newErrors.notification_preference;
                  setErrors(newErrors);
                }}
                className={`relative flex flex-col items-start p-4 border-2 rounded-xl transition-all duration-200 text-left ${
                  formData.notification_preference === n.id 
                    ? 'border-[#166534] bg-[#f0fdf4] shadow-sm' 
                    : 'border-gray-200 bg-white hover:bg-[#f0fdf4]/50'
                } ${errors.notification_preference && !formData.notification_preference ? 'border-red-300 bg-red-50' : ''}`}
              >
                {n.badge && (
                  <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/2 bg-[#166534] text-white text-[9px] font-bold px-2 py-0.5 rounded-full z-10">
                    {n.badge}
                  </span>
                )}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{n.icon}</span>
                  <span className={`text-sm font-semibold ${formData.notification_preference === n.id ? 'text-[#166534]' : 'text-[#111827]'}`}>{n.label}</span>
                </div>
                <span className="text-xs text-[#6b7280]">{n.desc}</span>
              </button>
            ))}
          </div>
          {errors.notification_preference && (
            <p className="flex items-center gap-1.5 mt-1.5 text-[13px] text-red-500">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.notification_preference}
            </p>
          )}
        </div>

        <div>
          <label className="block text-[15px] font-medium text-[#374151] mb-3">Select your main goals with KrishiSetu: *</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {INTERESTS.map((interest) => {
              const isChecked = (formData.interests || []).includes(interest.id);
              return (
                <button
                  key={interest.id}
                  onClick={() => handleInterestToggle(interest.id)}
                  className={`flex items-center gap-3 p-3 border-2 rounded-xl transition-all duration-200 text-left w-full ${
                    isChecked ? 'border-[#166534] bg-[#f0fdf4]' : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className={`w-6 h-6 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isChecked ? 'bg-[#166534] border-[#166534]' : 'bg-white border-gray-300'
                  }`}>
                    {isChecked && <span className="text-white text-xs font-bold">✓</span>}
                  </div>
                  <div>
                    <h4 className={`text-sm font-semibold ${isChecked ? 'text-[#166534]' : 'text-[#374151]'}`}>
                      <span className="mr-1">{interest.icon}</span> {interest.title}
                    </h4>
                    <p className="text-xs text-[#6b7280]">{interest.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
          {errors.interests && (
            <p className="flex items-center gap-1.5 mt-1.5 text-[13px] text-red-500">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.interests}
            </p>
          )}
        </div>

        {!formData.profile_photo_url && (
          <div className="bg-white border-1.5 border-dashed border-[#d1fae5] rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Camera className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#374151]">Add a profile photo</p>
                <p className="text-xs text-[#6b7280]">Personalize your account</p>
              </div>
            </div>
            <button 
              onClick={() => goToStep(1)}
              className="px-4 py-1.5 text-sm font-medium text-[#166534] border border-[#166534] rounded-lg hover:bg-[#f0fdf4] transition-colors"
            >
              Add Photo
            </button>
          </div>
        )}

        <div className="bg-[#f0fdf4] border border-[#166534] rounded-2xl p-5 relative mt-6">
          <button 
            onClick={() => {
              if (confirm('Go back to edit your info?')) goToStep(1);
            }}
            className="absolute top-4 right-4 text-sm font-semibold text-[#166534] hover:underline"
          >
            Edit
          </button>
          <div className="space-y-1.5 font-medium text-sm text-[#111827]">
            <p>👤 {formData.full_name || 'Name'}, {formData.age || 'Age'} years</p>
            <p>📍 {formData.village_or_city || 'City'}, {formData.state || 'State'}</p>
            <p>🌾 {formData.land_size_acres || '0'} acres | {(formData.primary_crops || []).join(', ') || 'Crops'}</p>
            <p>💧 {formData.irrigation_source ? formData.irrigation_source.replace('_', ' ') : 'Irrigation'} irrigation</p>
            <p>💰 {formData.yearly_income_range ? formData.yearly_income_range.replace(/_/g, ' ') : 'Income'}</p>
            <p>🌐 {formData.preferred_language === 'en' ? 'English' : formData.preferred_language === 'hi' ? 'Hindi' : formData.preferred_language === 'kn' ? 'Kannada' : formData.preferred_language} preferred</p>
          </div>
        </div>
      </div>
    </div>
  );
}
