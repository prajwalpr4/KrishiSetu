'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Mandi Live', href: '#mandi-live' },
  { label: 'Languages', href: '#languages' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-[0_1px_24px_rgba(22,101,52,0.10)]'
            : 'bg-transparent'
        }`}
      >
        {/* Mobile: 56px / Desktop: 72px */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-14 lg:h-[72px] flex items-center justify-between">
          {/* Logo */}
          <Link href="#home" className="flex items-center gap-2 group">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="transition-transform group-hover:scale-110 duration-200">
              <path d="M16 2C16 2 8 6 8 16C8 20 10 24 16 28C22 24 24 20 24 16C24 6 16 2 16 2Z" fill="url(#leaf-gradient)" />
              <path d="M16 8V22M12 12C14 14 16 14 16 14M20 16C18 14 16 14 16 14" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <defs>
                <linearGradient id="leaf-gradient" x1="8" y1="2" x2="24" y2="28" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#166534" />
                  <stop offset="1" stopColor="#22c55e" />
                </linearGradient>
              </defs>
            </svg>
            <span className="text-[1.375rem] font-bold text-[#166534]">
              KrishiSetu
            </span>
            <span className="ml-0.5 px-1.5 py-0.5 text-[9px] font-bold text-white rounded-full bg-gradient-to-r from-[#22c55e] to-[#16a34a] -mt-3">
              AI
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-[#4b5563] hover:text-[#166534] transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#166534] transition-all duration-200 group-hover:w-full rounded-full" />
              </a>
            ))}
          </div>

          {/* Desktop right side */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-[#166534] border border-[#166534] rounded-full hover:bg-[#166534] hover:text-white transition-all duration-200"
            >
              Login
            </Link>
            <Link
              href="/login?mode=signup"
              className="px-5 py-2.5 text-sm font-semibold text-white rounded-full shadow-[0_4px_20px_rgba(22,101,52,0.35)] hover:scale-[1.03] hover:shadow-[0_6px_28px_rgba(22,101,52,0.45)] transition-all duration-200"
              style={{ background: 'linear-gradient(135deg, #166534 0%, #16a34a 100%)' }}
            >
              Get Started Free
            </Link>
          </div>

          {/* Mobile hamburger — 48px touch target */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-[#f0fdf4] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6 text-[#166534]" /> : <Menu className="w-6 h-6 text-[#166534]" />}
          </button>
        </div>
      </nav>

      {/* Full-screen mobile overlay menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] lg:hidden bg-white flex flex-col"
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 h-14 border-b border-[#d1fae5]">
              <span className="text-lg font-bold text-[#166534]">KrishiSetu</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#f0fdf4]"
              >
                <X className="w-6 h-6 text-[#166534]" />
              </button>
            </div>

            {/* Nav links — 48px each for touch */}
            <div className="flex-1 flex flex-col gap-1 px-4 pt-4">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between px-4 py-3.5 rounded-xl text-[#374151] font-medium text-base hover:bg-[#f0fdf4] hover:text-[#166534] transition-all"
                >
                  {link.label}
                  <ChevronRight className="w-4 h-4 text-[#9ca3af]" />
                </motion.a>
              ))}
            </div>

            {/* Bottom actions */}
            <div className="p-4 border-t border-[#d1fae5] space-y-3">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="block text-center w-full py-3.5 text-[#166534] font-semibold rounded-2xl border-2 border-[#166534] hover:bg-[#f0fdf4] transition-colors"
              >
                Login
              </Link>
              <Link
                href="/login?mode=signup"
                onClick={() => setMobileOpen(false)}
                className="block text-center w-full py-3.5 text-white font-semibold rounded-2xl"
                style={{ background: 'linear-gradient(135deg, #166534 0%, #16a34a 100%)' }}
              >
                Get Started Free →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
