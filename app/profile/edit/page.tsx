'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';

import Step1_BasicInfo from '@/components/onboarding/Step1_BasicInfo';
import Step2_Location from '@/components/onboarding/Step2_Location';
import Step3_FarmDetails from '@/components/onboarding/Step3_FarmDetails';
import Step4_Financial from '@/components/onboarding/Step4_Financial';
import Step5_Preferences from '@/components/onboarding/Step5_Preferences';

export default function ProfileEditPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    full_name: '', age: '', gender: '', phone: '', profile_photo_url: '', preferred_language: 'en',
    village_or_city: '', taluk: '', district: '', state: 'Karnataka', pincode: '', gps_lat: null, gps_lng: null,
    land_size_acres: '', land_ownership: '', primary_crops: [] as string[], farming_type: '', irrigation_source: '',
    yearly_income_range: '', has_kisan_credit_card: false, has_crop_insurance: false, bank_account_linked: false,
    notification_preference: 'both', interests: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const { profile } = await res.json();
          if (profile) {
            setFormData(prev => ({ ...prev, ...profile }));
            if (profile.updated_at) {
              setLastUpdated(new Date(profile.updated_at).toLocaleString());
            }
          }
        }
      } catch (error) {
        toast.error('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const validateAll = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.full_name) newErrors.full_name = 'Name is required';
    if (!formData.age || Number(formData.age) < 18 || Number(formData.age) > 100) newErrors.age = 'Valid age required (18-100)';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (formData.phone && formData.phone.length !== 10) newErrors.phone = 'Must be exactly 10 digits';
    if (!formData.village_or_city) newErrors.village_or_city = 'Village/City is required';
    if (!formData.district) newErrors.district = 'District is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.land_size_acres) newErrors.land_size_acres = 'Land size is required';
    if (!formData.land_ownership) newErrors.land_ownership = 'Land ownership is required';
    if (!formData.primary_crops || formData.primary_crops.length === 0) newErrors.primary_crops = 'Select at least one crop';
    if (!formData.farming_type) newErrors.farming_type = 'Farming type is required';
    if (!formData.irrigation_source) newErrors.irrigation_source = 'Irrigation source is required';
    if (!formData.yearly_income_range) newErrors.yearly_income_range = 'Yearly income is required';
    if (!formData.notification_preference) newErrors.notification_preference = 'Preference is required';
    if (!formData.interests || formData.interests.length === 0) newErrors.interests = 'Select at least one interest';

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      toast.error('⚠️ Please fix the errors before saving');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateAll()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, profile_completed: true })
      });

      if (!res.ok) throw new Error('Failed to save');
      
      toast.success('Profile updated successfully! ✅');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9fafb]">
        <Loader2 className="w-10 h-10 animate-spin text-[#166534]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] pb-24 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <button 
              onClick={() => router.push('/dashboard')}
              className="flex items-center text-sm font-medium text-[#6b7280] hover:text-[#111827] mb-2"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
            </button>
            <h1 className="text-2xl md:text-3xl font-bold font-heading text-[#111827]">Edit Profile</h1>
            {lastUpdated && <p className="text-sm text-[#6b7280] mt-1">Last updated: {lastUpdated}</p>}
          </div>
          
          <div className="flex gap-3 hidden md:flex">
            <button 
              onClick={() => router.push('/dashboard')}
              className="px-6 py-2.5 rounded-xl border-2 border-gray-200 text-[#374151] font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#166534] text-white font-semibold hover:bg-[#15803d] transition-colors disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </div>
        </div>

        <div className="space-y-8 md:space-y-12 bg-white p-4 md:p-10 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100">
          <section className="pb-12 border-b border-gray-100">
            <Step1_BasicInfo formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />
          </section>
          
          <section className="pb-12 border-b border-gray-100">
            <Step2_Location formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />
          </section>

          <section className="pb-12 border-b border-gray-100">
            <Step3_FarmDetails formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />
          </section>

          <section className="pb-12 border-b border-gray-100">
            <Step4_Financial formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />
          </section>

          <section>
            <Step5_Preferences formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} goToStep={(s) => document.querySelectorAll('section')[s-1]?.scrollIntoView({ behavior: 'smooth' })} />
          </section>
        </div>

        {/* Mobile Sticky Action Bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg flex gap-3 z-50 safe-bottom">
          <button 
            onClick={() => router.push('/dashboard')}
            className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-[#374151] font-semibold"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 flex justify-center items-center gap-2 py-3 rounded-xl bg-[#166534] text-white font-semibold"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save
          </button>
        </div>

      </div>
    </div>
  );
}
