'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const steps = [
  {
    num: '01',
    title: 'Scan or Describe',
    body: 'Take a photo of your crop, or type/speak your farming question in any language.',
    pill: 'Works Offline Too',
  },
  {
    num: '02',
    title: 'Advanced AI Processes',
    body: 'Our AI cross-references ICAR databases, live weather, and mandi trends in milliseconds.',
    pill: 'Powered by AI',
  },
  {
    num: '03',
    title: 'Action Plan Delivered',
    body: 'Get diagnosis, treatment plan, nearby shop locations, and government subsidies — all at once.',
    pill: 'In Your Language',
  },
];

export default function HowItWorksSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="how-it-works" className="py-12 md:py-24 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8 md:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-eyebrow text-[#166534] mb-3"
          >
            Simple Process
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-h1 text-[#111827]"
          >
            From Scan to Solution<br />
            <span className="hero-gradient-text">in Under 30 Seconds</span>
          </motion.h2>
        </div>

        {/* Steps */}
        <div ref={ref} className="relative">
          {/* Connecting line — desktop only */}
          <div className="hidden lg:block absolute top-[60px] left-[16.6%] right-[16.6%] h-0.5">
            <svg width="100%" height="4" className="overflow-visible">
              <line
                x1="0" y1="2" x2="100%" y2="2"
                stroke="#bbf7d0"
                strokeWidth="2"
                strokeDasharray="8 6"
                className={inView ? 'hiw-line-draw' : ''}
                style={{ strokeDashoffset: inView ? 0 : 1000 }}
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.2, ease: [0.21, 1.11, 0.81, 0.99] }}
                className="flex flex-row md:flex-col items-start md:items-center text-left md:text-center gap-4 md:gap-0 relative"
              >
                {/* Vertical connecting line for mobile */}
                {i < steps.length - 1 && (
                  <div className="md:hidden absolute left-[27px] top-[56px] w-0.5 h-[calc(100%+32px)] bg-[#d1fae5]" />
                )}
                {/* Number pill */}
                <div className="w-14 h-14 rounded-full bg-[#166534] flex items-center justify-center text-white text-xl font-extrabold md:mb-6 shadow-lg relative z-10 flex-shrink-0">
                  {step.num}
                </div>

                {/* Icon area */}
                <div className="w-24 h-24 rounded-2xl bg-[#f0fdf4] border border-[#d1fae5] flex items-center justify-center mb-5 relative hidden md:flex">
                  {i === 0 && (
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                      <rect x="12" y="4" width="24" height="40" rx="4" stroke="#166534" strokeWidth="2" />
                      <circle cx="24" cy="20" r="8" stroke="#22c55e" strokeWidth="2" />
                      <path d="M24 16v8M20 20h8" stroke="#16a34a" strokeWidth="1.5" />
                      <circle cx="24" cy="40" r="2" fill="#166534" />
                    </svg>
                  )}
                  {i === 1 && (
                    <div className="relative">
                      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                        <circle cx="24" cy="24" r="12" stroke="#166534" strokeWidth="2" />
                        <circle cx="24" cy="24" r="6" fill="#dcfce7" stroke="#22c55e" strokeWidth="1.5" />
                        <circle cx="24" cy="24" r="2" fill="#166534" />
                      </svg>
                      <div className="absolute inset-0 animate-ai-pulse">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                          <circle cx="24" cy="24" r="18" stroke="#22c55e" strokeWidth="1" opacity="0.3" />
                        </svg>
                      </div>
                    </div>
                  )}
                  {i === 2 && (
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                      <rect x="12" y="4" width="24" height="40" rx="4" stroke="#166534" strokeWidth="2" />
                      <rect x="16" y="10" width="16" height="6" rx="2" fill="#dcfce7" />
                      <path d="M18 22h12M18 28h8M18 34h10" stroke="#bbf7d0" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="32" cy="34" r="4" fill="#22c55e" />
                      <path d="M30 34l1.5 1.5L33 33" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>

                <h3 className="text-xl font-semibold text-[#111827] mb-2">{step.title}</h3>
                <p className="text-[0.9375rem] text-[#4b5563] leading-relaxed max-w-xs">{step.body}</p>
                <span className="mt-4 px-3 py-1 bg-[#dcfce7] text-[#166534] text-xs font-semibold rounded-full">
                  {step.pill}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Testimonial quote */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 bg-white rounded-2xl border-l-4 border-[#166534] p-6 sm:p-8 shadow-sm"
          style={{ boxShadow: '0 4px 24px rgba(22,101,52,0.06)' }}
        >
          <div className="flex gap-4">
            <span className="text-5xl text-[#22c55e] font-serif leading-none">&ldquo;</span>
            <div>
              <p className="text-[#374151] italic text-[0.9375rem] leading-relaxed">
                KrishiSetu told me my tomatoes had early blight before I could even see the symptoms. Saved my entire crop.
              </p>
              <p className="mt-3 text-sm">
                <span className="font-semibold text-[#111827]">Raju Patil</span>
                <span className="text-[#6b7280]"> — Farmer from Hubli, Karnataka</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
