'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Globe, Mail, MessageCircle, ExternalLink } from 'lucide-react';

export default function CTASection() {
  return (
    <>
      {/* CTA Section */}
      <section className="relative py-12 md:py-24 overflow-hidden" style={{ background: 'linear-gradient(135deg, #166534 0%, #15803d 50%, #16a34a 100%)' }}>
        {/* Decorative leaf — hidden on mobile */}
        <svg className="hidden md:block absolute top-0 right-0 w-[400px] h-[400px] opacity-5 rotate-[30deg] pointer-events-none" viewBox="0 0 200 200" fill="white">
          <path d="M100 10C100 10 50 30 30 80C10 130 40 170 100 190C160 170 190 130 170 80C150 30 100 10 100 10Z" />
          <path d="M100 40V160M70 70C85 85 100 90 100 90M130 110C115 95 100 90 100 90" strokeWidth="2" stroke="white" fill="none" />
        </svg>

        <div className="max-w-[720px] mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-eyebrow text-white/60 mb-4"
          >
            Start Today — It&apos;s Free
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-h1 text-white mb-6"
          >
            Your Farm Deserves<br />Better Technology
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/80 mb-10"
          >
            Join thousands of Indian farmers already using KrishiSetu. No subscription, no credit card, no hidden fees. Free forever.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/login?mode=signup"
              className="inline-flex items-center justify-center px-12 py-4.5 text-[1.0625rem] font-bold text-[#166534] bg-white rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:scale-[1.04] hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)] transition-all duration-200"
            >
              Get Started Free →
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-10 py-4.5 text-[1.0625rem] font-semibold text-white border-2 border-white/40 rounded-full hover:bg-white/10 transition-all duration-200"
            >
              See All Features
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-white/70"
          >
            <span>✓ No credit card required</span>
            <span>✓ Works on any smartphone</span>
            <span>✓ Available in 3 languages</span>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#052e16] pt-10 md:pt-16 pb-8 text-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mb-8 md:mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                  <path d="M16 2C16 2 8 6 8 16C8 20 10 24 16 28C22 24 24 20 24 16C24 6 16 2 16 2Z" fill="#22c55e" />
                  <path d="M16 8V22M12 12C14 14 16 14 16 14M20 16C18 14 16 14 16 14" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span className="text-lg font-bold">KrishiSetu</span>
              </div>
              <p className="text-sm text-white/60 leading-relaxed mb-4">
                AI-powered agricultural platform<br />for every Indian farmer.
              </p>
              <div className="flex gap-3">
                {[Globe, Mail, MessageCircle].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#22c55e] transition-colors duration-200"
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </a>
                ))}
              </div>
              <p className="text-xs text-white/40 mt-4">Built with ❤️ for Indian Farmers</p>
            </div>

            {/* Features */}
            <div>
              <h4 className="font-semibold text-sm mb-4">Features</h4>
              <ul className="space-y-2">
                {['Crop Doctor', 'AI Chat', 'Mandi Prices', 'Govt Schemes', 'Marketplace', 'Crop Planner', 'Inventory', 'Labor Mgmt', 'Irrigation', 'Voice Support'].map((f) => (
                  <li key={f}>
                    <a href="#features" className="text-sm text-white/60 hover:text-white transition-colors duration-200">
                      {f}
                    </a>
                  </li>
                ))}
              </ul>
            </div>



            {/* Languages */}
            <div>
              <h4 className="font-semibold text-sm mb-4">Available In</h4>
              <div className="space-y-3">
                {[
                  { flag: '🇬🇧', name: 'English', code: 'EN' },
                  { flag: '🇮🇳', name: 'हिन्दी Hindi', code: 'HI' },
                  { flag: '🏳️', name: 'ಕನ್ನಡ Kannada', code: 'KN' },
                ].map((lang) => (
                  <div key={lang.code} className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-lg">
                    <span className="text-lg">{lang.flag}</span>
                    <div>
                      <p className="text-sm font-medium text-white/80">{lang.name}</p>
                      <span className="text-[10px] text-[#4ade80] font-semibold">Full Support</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
            <p>© 2026 KrishiSetu. Free for Indian Farmers.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white/60 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white/60 transition-colors">Terms</a>
              <a href="#" className="hover:text-white/60 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
