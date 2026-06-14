'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

import StepIndicator from '@/components/onboarding/StepIndicator';
import Step1_BasicInfo from '@/components/onboarding/Step1_BasicInfo';
import Step2_Location from '@/components/onboarding/Step2_Location';
import Step3_FarmDetails from '@/components/onboarding/Step3_FarmDetails';
import Step4_Financial from '@/components/onboarding/Step4_Financial';
import Step5_Preferences from '@/components/onboarding/Step5_Preferences';
import SuccessScreen from '@/components/onboarding/SuccessScreen';

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1
    full_name: '',
    age: '',
    gender: '',
    phone: '',
    profile_photo_url: '',
    preferred_language: 'en',
    // Step 2
    village_or_city: '',
    taluk: '',
    district: '',
    state: 'Karnataka',
    pincode: '',
    gps_lat: null,
    gps_lng: null,
    // Step 3
    land_size_acres: '',
    land_ownership: '',
    primary_crops: [] as string[],
    farming_type: '',
    irrigation_source: '',
    // Step 4
    yearly_income_range: '',
    has_kisan_credit_card: false,
    has_crop_insurance: false,
    bank_account_linked: false,
    // Step 5
    notification_preference: 'both',
    interests: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Fetch existing profile data to resume onboarding
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const { profile } = await res.json();
          if (profile) {
            if (profile.profile_completed) {
              router.push('/dashboard');
              return;
            }
            // Pre-fill
            setFormData(prev => ({ ...prev, ...profile }));
            if (profile.onboarding_step_completed) {
              const nextStep = Math.min(profile.onboarding_step_completed + 1, 5);
              setCurrentStep(nextStep);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch profile', error);
      } finally {
        setIsPageLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    if (currentStep === 1) {
      if (!formData.full_name) newErrors.full_name = 'Name is required';
      if (!formData.age || Number(formData.age) < 18 || Number(formData.age) > 100) newErrors.age = 'Valid age required (18-100)';
      if (!formData.gender) newErrors.gender = 'Gender is required';
      if (formData.phone && formData.phone.length !== 10) newErrors.phone = 'Must be exactly 10 digits';
    } else if (currentStep === 2) {
      if (!formData.village_or_city) newErrors.village_or_city = 'Village/City is required';
      if (!formData.district) newErrors.district = 'District is required';
      if (!formData.state) newErrors.state = 'State is required';
    } else if (currentStep === 3) {
      if (!formData.land_size_acres) newErrors.land_size_acres = 'Land size is required';
      if (!formData.land_ownership) newErrors.land_ownership = 'Land ownership is required';
      if (!formData.primary_crops || formData.primary_crops.length === 0) newErrors.primary_crops = 'Select at least one crop';
      if (!formData.farming_type) newErrors.farming_type = 'Farming type is required';
      if (!formData.irrigation_source) newErrors.irrigation_source = 'Irrigation source is required';
    } else if (currentStep === 4) {
      if (!formData.yearly_income_range) newErrors.yearly_income_range = 'Yearly income is required';
    } else if (currentStep === 5) {
      if (!formData.notification_preference) newErrors.notification_preference = 'Preference is required';
      if (!formData.interests || formData.interests.length === 0) newErrors.interests = 'Select at least one interest';
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      toast.error('⚠️ Please fill all required fields correctly');
      // Simple shake animation on window
      document.body.classList.add('shake-anim');
      setTimeout(() => document.body.classList.remove('shake-anim'), 400);
      return false;
    }
    return true;
  };

  const handleNext = async () => {
    if (!validateStep()) return;

    setIsLoading(true);
    try {
      // Auto-save draft
      const isComplete = currentStep === 5;
      const endpoint = '/api/profile';
      const method = isComplete ? 'POST' : 'PUT'; // For step 1-4, we can assume PUT if record exists or POST if not. Our API POST is upsert.
      
      const payload = {
        ...formData,
        profile_completed: isComplete,
        onboarding_step_completed: currentStep
      };

      const res = await fetch(endpoint, {
        method: 'POST', // the POST in our api handles UPSERT
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to save progress');

      if (isComplete) {
        setShowSuccess(true);
      } else {
        setCurrentStep(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      toast.error('Failed to save progress. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (isPageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-[#166534]" />
      </div>
    );
  }

  if (showSuccess) {
    return <SuccessScreen firstName={formData.full_name.split(' ')[0]} />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white font-sans">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .shake-anim { animation: shake 0.4s ease-in-out; }
      `}} />

      {/* Left Panel - Hidden on mobile */}
      <div className="hidden md:flex md:w-[38%] fixed top-0 bottom-0 left-0 bg-gradient-to-br from-[#052e16] via-[#166534] to-[#15803d] flex-col justify-between p-12 text-white">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight font-heading mb-16">
            Krishi<span className="text-green-300">Setu</span>
          </h1>
          <StepIndicator currentStep={currentStep} />
        </div>

        <div className="relative">
          <div className="flex gap-4 mb-8 text-4xl">
            <span className="animate-float" style={{ animationDelay: '0s' }}>🌾</span>
            <span className="animate-float" style={{ animationDelay: '0.5s' }}>🍅</span>
            <span className="animate-float" style={{ animationDelay: '1s' }}>🌿</span>
          </div>
          <p className="font-light italic text-green-100 text-lg">&quot;Kisan is the backbone of India 🇮🇳&quot;</p>
        </div>
      </div>

      {/* Right Panel - Scrollable Form */}
      <div className="w-full md:w-[62%] md:ml-[38%] min-h-screen flex flex-col">
        {/* Progress Bar (Top) */}
        <div className="h-1.5 w-full bg-[#d1fae5] sticky top-0 z-50">
          <div 
            className="h-full bg-[#166534] transition-all duration-600 ease-in-out"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>

        {/* Mobile Step Indicator */}
        <div className="md:hidden px-6 pt-6 pb-2">
          <StepIndicator currentStep={currentStep} />
        </div>

        <div className="flex-1 p-6 md:p-12 lg:px-24 xl:px-32 max-w-4xl mx-auto w-full">
          {/* Step Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#f0fdf4] border border-[#d1fae5] text-[#166534] rounded-full text-xs font-bold uppercase tracking-wider mb-8">
            Step {currentStep} of 5
          </div>

          {/* Form Content */}
          <div className="min-h-[400px]">
            {currentStep === 1 && <Step1_BasicInfo formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />}
            {currentStep === 2 && <Step2_Location formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />}
            {currentStep === 3 && <Step3_FarmDetails formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />}
            {currentStep === 4 && <Step4_Financial formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />}
            {currentStep === 5 && <Step5_Preferences formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} goToStep={setCurrentStep} />}
          </div>
        </div>

        {/* Sticky Footer Navigation */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 md:px-12 lg:px-24 xl:px-32 pb-8 md:pb-12 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] flex gap-4 mt-auto z-40">
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl border-2 border-gray-200 text-[#374151] font-semibold hover:bg-gray-50 transition-colors"
              style={{ width: '120px' }}
            >
              <ChevronLeft className="w-5 h-5" /> Back
            </button>
          )}
          
          <button
            onClick={handleNext}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-br from-[#166534] to-[#16a34a] text-white font-semibold text-lg hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
            {currentStep === 5 ? 'Complete My Profile ✓' : 'Next Step →'}
          </button>
        </div>
      </div>
    </div>
  );
}
