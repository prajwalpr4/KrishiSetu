'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const languages = [
  {
    key: 'en',
    label: 'English',
    flag: '🇬🇧',
    pill: 'EN',
    user: 'My tomato leaves have yellow spots',
    bot: `Your tomatoes may have Early Blight.\nHere's what to do:\n✅ Apply Mancozeb fungicide\n✅ Remove infected leaves\n✅ Improve air circulation`,
  },
  {
    key: 'hi',
    label: 'हिन्दी',
    flag: '🇮🇳',
    pill: 'हिं',
    user: 'मेरी टमाटर की पत्तियाँ पीली हो रही हैं',
    bot: `आपके टमाटर में अर्ली ब्लाइट हो सकता है।\nक्या करें:\n✅ मैन्कोज़ेब कवकनाशी लगाएं\n✅ संक्रमित पत्तियाँ हटाएं\n✅ हवा का प्रवाह बढ़ाएं`,
  },
  {
    key: 'kn',
    label: 'ಕನ್ನಡ',
    flag: '🏳️',
    pill: 'ಕನ್ನ',
    user: 'ನನ್ನ ಟೊಮ್ಯಾಟೊ ಎಲೆಗಳು ಹಳದಿ ಆಗುತ್ತಿವೆ',
    bot: `ನಿಮ್ಮ ಟೊಮ್ಯಾಟೊಗೆ ಅರ್ಲಿ ಬ್ಲೈಟ್ ಇರಬಹುದು.\nಮಾಡಬೇಕಾದುದು:\n✅ ಮ್ಯಾಂಕೋಜೆಬ್ ಶಿಲೀಂಧ್ರನಾಶಕ\n✅ ಸೋಂಕಿತ ಎಲೆಗಳನ್ನು ತೆಗೆದುಹಾಕಿ\n✅ ಗಾಳಿ ಸಂಚಾರ ಸುಧಾರಿಸಿ`,
  },
];

export default function LanguageSection() {
  const [active, setActive] = useState('en');

  return (
    <section id="languages" className="py-24 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-eyebrow text-[#166534] mb-3"
          >
            Multilingual by Design
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-h1 text-[#111827]"
          >
            Speak to KisanSarthi<br />
            <span className="hero-gradient-text">In Your Language</span>
          </motion.h2>
        </div>

        {/* Language cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {languages.map((lang, i) => (
            <motion.div
              key={lang.key}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6, ease: [0.21, 1.11, 0.81, 0.99] }}
              className={`rounded-2xl border overflow-hidden transition-all duration-300 cursor-pointer ${
                active === lang.key
                  ? 'border-[#22c55e] shadow-[0_0_40px_rgba(34,197,94,0.15)] scale-[1.02]'
                  : 'border-[#d1fae5] hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(34,197,94,0.10)]'
              }`}
              onClick={() => setActive(lang.key)}
            >
              {/* Header */}
              <div className="bg-[#166534] px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold text-sm">KisanSarthi</span>
                  <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" />
                </div>
                <span className="text-white text-xs">{lang.flag} {lang.label}</span>
              </div>

              {/* Chat bubbles */}
              <div className="bg-[#f9fafb] p-4 space-y-3 min-h-[260px]">
                {/* User message */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 + 0.3 }}
                  className="flex justify-end"
                >
                  <div className="bg-[#166534] text-white px-4 py-2.5 rounded-2xl rounded-br-sm max-w-[85%] text-sm">
                    {lang.user}
                  </div>
                </motion.div>

                {/* Bot response */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 + 0.5 }}
                  className="flex justify-start"
                >
                  <div className="bg-white border border-[#d1fae5] px-4 py-2.5 rounded-2xl rounded-bl-sm max-w-[85%] text-sm text-[#374151] whitespace-pre-line shadow-sm">
                    {lang.bot}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Language toggle */}
        <div className="text-center">
          <p className="text-sm text-[#6b7280] mb-4">Switch language anytime with one tap</p>
          <div className="inline-flex bg-[#f0fdf4] rounded-full p-1 border border-[#d1fae5]">
            {languages.map((lang) => (
              <button
                key={lang.key}
                onClick={() => setActive(lang.key)}
                className={`px-5 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                  active === lang.key
                    ? 'bg-[#166534] text-white shadow-sm'
                    : 'text-[#166534] hover:bg-[#dcfce7]'
                }`}
              >
                {lang.pill}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
