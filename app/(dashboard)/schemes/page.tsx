'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/app.store';
import type { Language } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { CheckCircle, ExternalLink, ChevronDown, ChevronUp, Shield } from 'lucide-react';

interface SchemeData {
  id: string;
  scheme_code: string;
  name_en: string;
  name_hi: string | null;
  name_kn: string | null;
  category: string;
  description_en: string | null;
  description_hi: string | null;
  description_kn: string | null;
  benefits: Record<string, unknown>;
  documents_required: string[];
  application_url: string | null;
  portal_name: string | null;
}

const categoryTabs = [
  { key: 'all', en: 'All', hi: 'सभी', kn: 'ಎಲ್ಲಾ' },
  { key: 'income_support', en: 'Income', hi: 'आय', kn: 'ಆದಾಯ' },
  { key: 'insurance', en: 'Insurance', hi: 'बीमा', kn: 'ವಿಮೆ' },
  { key: 'credit', en: 'Credit', hi: 'ऋण', kn: 'ಸಾಲ' },
  { key: 'soil', en: 'Soil', hi: 'मिट्टी', kn: 'ಮಣ್ಣು' },
  { key: 'pension', en: 'Pension', hi: 'पेंशन', kn: 'ಪಿಂಚಣಿ' },
];

export default function SchemesPage() {
  const { language } = useAppStore();
  const [schemes, setSchemes] = useState<SchemeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/schemes');
        const data = await res.json();
        setSchemes(data.schemes || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const getSchemeName = (s: SchemeData, lang: Language) => {
    if (lang === 'hi') return s.name_hi || s.name_en;
    if (lang === 'kn') return s.name_kn || s.name_en;
    return s.name_en;
  };

  const getDescription = (s: SchemeData, lang: Language) => {
    if (lang === 'hi') return s.description_hi || s.description_en;
    if (lang === 'kn') return s.description_kn || s.description_en;
    return s.description_en;
  };

  const filtered = activeCategory === 'all'
    ? schemes
    : schemes.filter((s) => s.category === activeCategory);

  const title = language === 'hi' ? 'सरकारी योजनाएं 📋' : language === 'kn' ? 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು 📋' : 'Government Schemes 📋';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Hero */}
      <div className="card-krishisetu overflow-hidden">
        <div className="gradient-primary p-5 md:p-6">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-8 h-8 text-white" />
            <h1 className="font-heading text-2xl font-bold text-white">{title}</h1>
          </div>
          <p className="text-white/80 text-sm max-w-lg">
            {language === 'hi'
              ? 'अपनी पात्रता जांचें और सरकारी लाभ प्राप्त करें'
              : language === 'kn'
                ? 'ನಿಮ್ಮ ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಸರ್ಕಾರಿ ಪ್ರಯೋಜನಗಳನ್ನು ಪಡೆಯಿರಿ'
                : 'Check your eligibility and access government benefits'}
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
        {categoryTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveCategory(tab.key)}
            className={`px-3.5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === tab.key
                ? 'bg-primary text-white shadow-sm'
                : 'bg-gray-100 text-krishisetu-text-muted hover:bg-gray-200'
            }`}
          >
            {tab[language]}
          </button>
        ))}
      </div>

      {/* Scheme Cards */}
      <div className="space-y-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card-krishisetu p-5 animate-pulse">
                <div className="w-48 h-5 bg-gray-200 rounded mb-2" />
                <div className="w-full h-4 bg-gray-200 rounded mb-1" />
                <div className="w-2/3 h-4 bg-gray-200 rounded" />
              </div>
            ))
          : filtered.map((scheme) => {
              const isExpanded = expandedId === scheme.id;
              const benefits = scheme.benefits as Record<string, unknown>;
              return (
                <motion.div
                  key={scheme.id}
                  layout
                  className="card-krishisetu overflow-hidden"
                >
                  <div
                    className="p-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : scheme.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded-full bg-primary-light text-primary text-[10px] font-semibold uppercase">
                            {scheme.category?.replace('_', ' ')}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-semibold">
                            {scheme.scheme_code}
                          </span>
                        </div>
                        <h3 className="font-heading text-base font-semibold text-krishisetu-text-primary">
                          {getSchemeName(scheme, language)}
                        </h3>
                        <p className="text-sm text-krishisetu-text-muted mt-1 line-clamp-2">
                          {getDescription(scheme, language)}
                        </p>
                        {!!benefits?.amount && (
                          <p className="font-mono text-lg font-bold text-success mt-2">
                            {formatCurrency(benefits.amount as number)}/{(benefits.frequency as string) || 'year'}
                          </p>
                        )}
                      </div>
                      <div className="ml-3 mt-1">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-krishisetu-text-muted" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-krishisetu-text-muted" />
                        )}
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="border-t border-krishisetu-border p-4 bg-gray-50/30"
                    >
                      {/* Documents Required */}
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-krishisetu-text-primary mb-2">
                          📄 {language === 'hi' ? 'आवश्यक दस्तावेज' : language === 'kn' ? 'ಅಗತ್ಯ ದಾಖಲೆಗಳು' : 'Documents Required'}
                        </h4>
                        <ul className="space-y-1">
                          {scheme.documents_required?.map((doc, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-krishisetu-text-body">
                              <CheckCircle className="w-3.5 h-3.5 text-success flex-shrink-0" />
                              {doc}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Apply Button */}
                      {scheme.application_url && (
                        <a
                          href={scheme.application_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary w-full flex items-center justify-center gap-2"
                        >
                          {language === 'hi' ? 'अभी आवेदन करें' : language === 'kn' ? 'ಈಗ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ' : 'Apply Now'}
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      {scheme.portal_name && (
                        <p className="text-xs text-center text-krishisetu-text-muted mt-2">
                          via {scheme.portal_name}
                        </p>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
      </div>
    </motion.div>
  );
}
