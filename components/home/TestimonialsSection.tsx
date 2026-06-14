'use client';

import { motion } from 'framer-motion';

const testimonials = [
  { quote: 'PM-KISAN ka paisa aa gaya! KrishiSetu ne mujhe bataya ki main eligible hoon.', name: 'Ramesh Kumar', loc: 'Meerut, UP', crop: '🌾 Wheat' },
  { quote: 'Tomato ka blight pehle hi pata chal gaya. Poori fasal bach gayi.', name: 'Lakshmi Devi', loc: 'Hubli, KN', crop: '🍅 Tomato' },
  { quote: 'ಕನ್ನಡದಲ್ಲಿ ಕೇಳಿದರೆ ಕನ್ನಡದಲ್ಲೇ ಉತ್ತರ ಬರುತ್ತದೆ. ತುಂಬಾ ಚೆನ್ನಾಗಿದೆ.', name: 'Suresh Gowda', loc: 'Davangere, KN', crop: '🌻 Sunflower' },
  { quote: 'Mandi price 7 din pehle hi pata tha, sahi time pe becha.', name: 'Harpreet Singh', loc: 'Ludhiana, PB', crop: '🌾 Wheat' },
  { quote: 'Kisan Credit Card ke liye kya chahiye ye KrishiSetu ne clear kar diya.', name: 'Anita Patil', loc: 'Nashik, MH', crop: '🧅 Onion' },
  { quote: 'Zero rupees mein itna sab! Sach mein free hai.', name: 'Venkatesh Reddy', loc: 'Kurnool, AP', crop: '🥜 Groundnut' },
  { quote: 'JalSathi ne bataya kal baarish aayegi, pump band kar diya. Diesel bachaya.', name: 'Mohan Lal', loc: 'Jaipur, RJ', crop: '🌾 Ragi' },
  { quote: 'Majdoor ki salary ka hisaab ab phone mein hai. Koi jhagda nahi.', name: 'Priya Nair', loc: 'Palakkad, KL', crop: '🌿 Spices' },
  { quote: 'Crop planner se kab kya karna hai sab set hai. Bahut aasan hai.', name: 'Sunil Yadav', loc: 'Varanasi, UP', crop: '🥔 Potato' },
  { quote: 'ನನ್ನ ರೈತ ಸ್ನೇಹಿತರಿಗೆ ಎಲ್ಲರಿಗೂ ಹೇಳಿದ್ದೇನೆ. Superb app!', name: 'Manjunath B', loc: 'Tumkur, KN', crop: '🥜 Groundnut' },
  { quote: 'Fertilizer schedule time pe milta hai. Production badh gaya.', name: 'Deepak Sharma', loc: 'Indore, MP', crop: '🌿 Soybean' },
  { quote: 'Government scheme ka form bhi yahan se bhara. Sab ek jagah.', name: 'Kavita Devi', loc: 'Patna, BR', crop: '🌾 Rice' },
  { quote: 'Voice mein baat kar sakta hoon. Likna nahi padta.', name: 'Raju Gowda', loc: 'Shimoga, KN', crop: '🌿 Areca' },
  { quote: 'Pesticide ka sahi dose pata chal gaya. Paise bache.', name: 'Ajay Patel', loc: 'Ahmedabad, GJ', crop: '🪴 Cotton' },
  { quote: 'Bahut helpful app hai. Kisan ke liye best cheez hai ye.', name: 'Meena Kumari', loc: 'Ranchi, JH', crop: '🌾 Rice' },
];

const row1 = testimonials.slice(0, 8);
const row2 = testimonials.slice(8);

function TestimonialCard({ t }: { t: typeof testimonials[0] }) {
  return (
    <div className="w-[260px] md:w-[320px] flex-shrink-0 bg-white rounded-2xl p-4 md:p-6 border border-[#d1fae5]" style={{ boxShadow: '0 4px 24px rgba(22,101,52,0.08), 0 1px 4px rgba(22,101,52,0.04)' }}>
      <span className="text-3xl text-[#22c55e] font-serif leading-none">&ldquo;</span>
      <p className="text-[#374151] italic text-sm leading-relaxed mt-1">{t.quote}</p>
      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="font-semibold text-sm text-[#111827]">{t.name}</p>
          <p className="text-xs text-[#6b7280]">{t.loc}</p>
        </div>
        <span className="px-2.5 py-1 bg-[#dcfce7] text-[#166534] text-[10px] font-semibold rounded-full">{t.crop}</span>
      </div>
      <div className="flex gap-0.5 mt-3">
        {[1, 2, 3, 4, 5].map((s) => (
          <span key={s} className="text-amber-400 text-xs">★</span>
        ))}
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="py-12 md:py-24 bg-[#f0fdf4] overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 mb-8 md:mb-14">
        <div className="text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-eyebrow text-[#166534] mb-3"
          >
            Farmer Stories
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-h1 text-[#111827]"
          >
            Real Farmers.<br />
            <span className="hero-gradient-text">Real Results.</span>
          </motion.h2>
        </div>
      </div>

      {/* Row 1 — left to right */}
      <div className="mb-6 overflow-hidden">
        <div className="marquee-track flex gap-6">
          {[...row1, ...row1].map((t, i) => (
            <TestimonialCard key={`r1-${i}`} t={t} />
          ))}
        </div>
      </div>

      {/* Row 2 — right to left */}
      <div className="overflow-hidden">
        <div className="marquee-track-reverse flex gap-6">
          {[...row2, ...row2, ...row2].map((t, i) => (
            <TestimonialCard key={`r2-${i}`} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
