'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Microscope, MessageCircle, TrendingUp, FileText, ShoppingBag, Calendar, Package, Users, Droplets, Mic } from 'lucide-react';

const features = [
  { icon: Microscope, name: 'Crop Doctor AI', desc: 'Scan any crop leaf. Get instant disease diagnosis with organic and chemical treatment plans in seconds.', tag: 'AI Vision', gradient: 'linear-gradient(135deg, #166534, #22c55e)' },
  { icon: MessageCircle, name: 'KisanSarthi Chat', desc: 'Ask anything about farming in Hindi, English, or Kannada. Get expert answers 24/7.', tag: 'AI Chatbot', gradient: 'linear-gradient(135deg, #0369a1, #0ea5e9)' },
  { icon: TrendingUp, name: 'Live Mandi Prices', desc: 'Real-time prices from 500+ APMCs across India. AI predicts price trends 7 days ahead.', tag: 'Live Data', gradient: 'linear-gradient(135deg, #b45309, #f59e0b)' },
  { icon: FileText, name: 'Govt Schemes AI', desc: 'Discover all schemes you\'re eligible for — PM-KISAN, PMFBY, KCC — in one tap.', tag: 'Smart Match', gradient: 'linear-gradient(135deg, #6d28d9, #8b5cf6)' },
  { icon: ShoppingBag, name: 'Marketplace', desc: 'Buy fertilizers, seeds, and machinery from Amazon & Flipkart. Compare prices instantly.', tag: 'Shop Smart', gradient: 'linear-gradient(135deg, #be185d, #ec4899)' },
  { icon: Calendar, name: 'Crop Planner', desc: 'AI-generated sowing calendar, fertilizer schedule, and harvest planner for your crops.', tag: 'AI Planner', gradient: 'linear-gradient(135deg, #0f766e, #14b8a6)' },
  { icon: Package, name: 'Inventory Manager', desc: 'Track all farm inputs and produce stock. Get low-stock alerts before you run out.', tag: 'Smart Track', gradient: 'linear-gradient(135deg, #166534, #16a34a)' },
  { icon: Users, name: 'Digital Majdoor', desc: 'Digital attendance, wage ledger, and payslips for your farm workers. No disputes.', tag: 'Labor Mgmt', gradient: 'linear-gradient(135deg, #92400e, #d97706)' },
  { icon: Droplets, name: 'JalSathi Irrigation', desc: 'AI calculates exact water needs based on crop stage, soil, and weather forecast.', tag: 'Water AI', gradient: 'linear-gradient(135deg, #1d4ed8, #3b82f6)' },
  { icon: Mic, name: 'Voice in 3 Languages', desc: 'Speak in Hindi, Kannada, or English. KrishiSetu listens and responds in your language.', tag: 'Voice First', gradient: 'linear-gradient(135deg, #065f46, #059669)', special: true },
];

export default function FeaturesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="features" className="py-12 md:py-24 bg-[#f0fdf4]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8 md:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-eyebrow text-[#166534] mb-3"
          >
            Everything You Need
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-h1 text-[#111827]"
          >
            One App for Your<br />
            <span className="hero-gradient-text">Entire Farm Life</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-body-lg text-[#4b5563] mt-4 max-w-xl mx-auto"
          >
            10 powerful AI features, zero cost. Built for Indian farmers by people who understand the field.
          </motion.p>
        </div>

        {/* Feature grid — carousel on mobile, grid on desktop */}
        <div ref={ref} className="features-carousel md:!grid md:grid-cols-2 lg:grid-cols-3 md:gap-5 md:!overflow-visible md:!p-0">
          {features.map((feature, i) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.21, 1.11, 0.81, 0.99] }}
              className={`group rounded-[20px] p-5 md:p-8 border transition-all duration-300 cursor-pointer will-change-transform hover:-translate-y-1.5 feature-card-mobile ${
                feature.special
                  ? 'lg:col-span-3 text-white border-transparent'
                  : 'bg-white border-[#d1fae5] hover:border-[#86efac]'
              }`}
              style={{
                ...(feature.special
                  ? { background: 'linear-gradient(135deg, #14532d 0%, #166534 60%, #15803d 100%)' }
                  : {}),
                boxShadow: '0 4px 24px rgba(22,101,52,0.08), 0 1px 4px rgba(22,101,52,0.04)',
              }}
              onMouseEnter={(e) => {
                if (!feature.special) {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    '0 12px 40px rgba(22,101,52,0.16), 0 4px 12px rgba(22,101,52,0.08)';
                }
              }}
              onMouseLeave={(e) => {
                if (!feature.special) {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    '0 4px 24px rgba(22,101,52,0.08), 0 1px 4px rgba(22,101,52,0.04)';
                }
              }}
            >
              <div className={`${feature.special ? 'flex flex-col md:flex-row md:items-center gap-6' : ''}`}>
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: feature.special ? 'rgba(255,255,255,0.15)' : feature.gradient }}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <div className={feature.special ? 'flex-1' : ''}>
                  <h3 className={`text-lg font-semibold mt-4 ${feature.special ? 'mt-0 text-white' : 'text-[#111827]'}`}>
                    {feature.name}
                  </h3>
                  <p className={`text-[0.9375rem] leading-relaxed mt-2 ${feature.special ? 'text-white/80' : 'text-[#4b5563]'}`}>
                    {feature.desc}
                  </p>
                  <span
                    className={`inline-block mt-3 px-3 py-1 text-xs font-semibold rounded-full ${
                      feature.special
                        ? 'bg-white/20 text-white'
                        : 'bg-[#dcfce7] text-[#166534]'
                    }`}
                  >
                    {feature.tag}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
