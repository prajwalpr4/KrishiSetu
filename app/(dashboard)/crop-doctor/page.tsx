'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/stores/app.store';

import type { DiagnosisResult } from '@/types';
import { getSeverityColor } from '@/lib/utils';
import {
  Camera, Leaf, AlertTriangle, CheckCircle,
  ExternalLink, Loader2,
} from 'lucide-react';

const cropOptions = [
  'Rice', 'Wheat', 'Cotton', 'Tomato', 'Ragi', 'Jowar',
  'Sunflower', 'Groundnut', 'Onion', 'Potato', 'Sugarcane', 'Other',
];

export default function CropDoctorPage() {
  const { language } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [cropName, setCropName] = useState('');
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'organic' | 'chemical'>('organic');
  const [shareToComm, setShareToComm] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
      setDiagnosis(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      if (cropName) formData.append('cropName', cropName);
      formData.append('language', language);

      const res = await fetch('/api/crop-doctor', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to analyze. Please check your GEMINI_API_KEY in .env.local');
        return;
      }

      if (data.diagnosis) {
        setDiagnosis(data.diagnosis);
      } else {
        setError('No diagnosis returned. Please check your GEMINI_API_KEY in .env.local');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError('Network error. Please ensure the server is running and GEMINI_API_KEY is set.');
    } finally {
      setLoading(false);
    }
  };

  const title = language === 'hi' ? 'फसल डॉक्टर 🔬' : language === 'kn' ? 'ಬೆಳೆ ವೈದ್ಯ 🔬' : 'Crop Doctor 🔬';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-2xl mx-auto">
      <h1 className="font-heading text-xl md:text-2xl font-bold text-krishisetu-text-primary">{title}</h1>
      <p className="text-sm text-krishisetu-text-muted">
        {language === 'hi'
          ? 'अपनी फसल का फोटो अपलोड करें और AI रोग निदान पाएं'
          : language === 'kn'
            ? 'ನಿಮ್ಮ ಬೆಳೆಯ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಮತ್ತು AI ರೋಗ ನಿರ್ಣಯ ಪಡೆಯಿರಿ'
            : 'Upload a photo of your crop and get AI-powered disease diagnosis'}
      </p>

      {/* Upload Area */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          preview ? 'border-primary bg-primary-light/30' : 'border-krishisetu-border hover:border-primary hover:bg-primary-light/20'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileSelect}
        />
        {preview ? (
          <div className="space-y-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Selected crop" className="max-h-64 mx-auto rounded-lg shadow-md" />
            <p className="text-sm text-primary font-medium">
              {language === 'hi' ? 'दूसरा फोटो चुनें' : language === 'kn' ? 'ಬೇರೆ ಫೋಟೋ ಆರಿಸಿ' : 'Tap to change photo'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-primary-light flex items-center justify-center">
              <Camera className="w-8 h-8 text-primary" />
            </div>
            <p className="font-medium text-krishisetu-text-body">
              {language === 'hi' ? 'फोटो लें या अपलोड करें' : language === 'kn' ? 'ಫೋಟೋ ತೆಗೆಯಿರಿ ಅಥವಾ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ' : 'Take or upload a photo'}
            </p>
            <p className="text-xs text-krishisetu-text-muted">JPG, PNG, WebP • Max 5MB</p>
          </div>
        )}
      </motion.div>

      {/* Crop Selection */}
      <div>
        <label className="block text-sm font-medium text-krishisetu-text-body mb-1.5">
          {language === 'hi' ? 'फसल का नाम (वैकल्पिक)' : language === 'kn' ? 'ಬೆಳೆ ಹೆಸರು (ಐಚ್ಛಿಕ)' : 'Crop name (optional)'}
        </label>
        <select
          value={cropName}
          onChange={(e) => setCropName(e.target.value)}
          className="w-full rounded-lg border border-krishisetu-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        >
          <option value="">{language === 'hi' ? 'चुनें...' : language === 'kn' ? 'ಆರಿಸಿ...' : 'Select...'}</option>
          {cropOptions.map((crop) => (
            <option key={crop} value={crop}>{crop}</option>
          ))}
        </select>
      </div>

      {/* Analyze Button */}
      <button
        onClick={handleAnalyze}
        disabled={!selectedFile || loading}
        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed py-3 text-base"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {language === 'hi' ? 'विश्लेषण हो रहा है...' : language === 'kn' ? 'ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...' : 'Analyzing...'}
          </>
        ) : (
          <>
            <Leaf className="w-5 h-5" />
            {language === 'hi' ? 'फसल का विश्लेषण करें' : language === 'kn' ? 'ಬೆಳೆ ವಿಶ್ಲೇಷಿಸಿ' : 'Analyze Crop'}
          </>
        )}
      </button>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3"
        >
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">Analysis Failed</p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Results */}
      <AnimatePresence>
        {diagnosis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Disease Info */}
            <div className="card-krishisetu p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-heading text-xl font-bold text-krishisetu-text-primary">
                    {diagnosis.is_healthy ? '✅ Healthy Plant' : diagnosis.disease}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getSeverityColor(diagnosis.severity)}`}>
                      {diagnosis.severity.toUpperCase()}
                    </span>
                    <span className="text-sm text-krishisetu-text-muted">
                      {diagnosis.confidence_percent}% confidence
                    </span>
                  </div>
                </div>
                {diagnosis.is_healthy ? (
                  <CheckCircle className="w-8 h-8 text-success flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-8 h-8 text-warning flex-shrink-0" />
                )}
              </div>
              <p className="text-sm text-krishisetu-text-body leading-relaxed">{diagnosis.description}</p>
            </div>

            {/* Remedy Tabs */}
            {!diagnosis.is_healthy && (
              <div className="card-krishisetu overflow-hidden">
                <div className="flex border-b border-krishisetu-border">
                  <button
                    onClick={() => setActiveTab('organic')}
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${
                      activeTab === 'organic'
                        ? 'text-primary border-b-2 border-primary bg-primary-light/30'
                        : 'text-krishisetu-text-muted hover:bg-gray-50'
                    }`}
                  >
                    🌿 {language === 'hi' ? 'जैविक उपचार' : language === 'kn' ? 'ಸಾವಯವ ಚಿಕಿತ್ಸೆ' : 'Organic Remedy'}
                  </button>
                  <button
                    onClick={() => setActiveTab('chemical')}
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${
                      activeTab === 'chemical'
                        ? 'text-primary border-b-2 border-primary bg-primary-light/30'
                        : 'text-krishisetu-text-muted hover:bg-gray-50'
                    }`}
                  >
                    🧪 {language === 'hi' ? 'रासायनिक उपचार' : language === 'kn' ? 'ರಾಸಾಯನಿಕ ಚಿಕಿತ್ಸೆ' : 'Chemical Treatment'}
                  </button>
                </div>
                <div className="p-4">
                  {activeTab === 'organic' ? (
                    <p className="text-sm text-krishisetu-text-body leading-relaxed">{diagnosis.organic_remedy}</p>
                  ) : (
                    <div className="space-y-3">
                      {diagnosis.chemical_treatment.map((t, i) => (
                        <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                          <div>
                            <p className="font-medium text-sm text-krishisetu-text-body">{t.product}</p>
                            <p className="text-xs text-krishisetu-text-muted">{t.dose} • {t.frequency}</p>
                          </div>
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => window.open(`https://www.amazon.in/s?k=${encodeURIComponent(t.product + ' pesticide')}`, '_blank')}
                              className="px-2.5 py-1.5 rounded-md bg-amber-100 text-amber-800 text-xs font-medium hover:bg-amber-200 transition-colors flex items-center gap-1"
                            >
                              Amazon <ExternalLink className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => window.open(`https://www.flipkart.com/search?q=${encodeURIComponent(t.product)}`, '_blank')}
                              className="px-2.5 py-1.5 rounded-md bg-blue-100 text-blue-800 text-xs font-medium hover:bg-blue-200 transition-colors flex items-center gap-1"
                            >
                              Flipkart <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Prevention */}
            {diagnosis.prevention && (
              <div className="card-krishisetu p-4">
                <h4 className="font-heading text-sm font-semibold text-krishisetu-text-primary mb-2">
                  🛡️ {language === 'hi' ? 'रोकथाम' : language === 'kn' ? 'ತಡೆಗಟ್ಟುವಿಕೆ' : 'Prevention'}
                </h4>
                <p className="text-sm text-krishisetu-text-body leading-relaxed">{diagnosis.prevention}</p>
              </div>
            )}

            {/* Share to Community */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <button
                onClick={() => setShareToComm(!shareToComm)}
                className={`w-10 h-6 rounded-full transition-colors ${shareToComm ? 'bg-primary' : 'bg-gray-300'} relative`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${shareToComm ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
              <div>
                <p className="text-sm font-medium text-krishisetu-text-body">
                  {language === 'hi' ? 'समुदाय के साथ साझा करें' : language === 'kn' ? 'ಸಮುದಾಯದೊಂದಿಗೆ ಹಂಚಿಕೊಳ್ಳಿ' : 'Share with Community'}
                </p>
                <p className="text-xs text-krishisetu-text-muted">
                  {language === 'hi' ? 'पास के किसानों को बीमारी की चेतावनी दें' : language === 'kn' ? 'ಹತ್ತಿರದ ರೈತರಿಗೆ ರೋಗ ಎಚ್ಚರಿಕೆ ನೀಡಿ' : 'Alert nearby farmers about this disease'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
