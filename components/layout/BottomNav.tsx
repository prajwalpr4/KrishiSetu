'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/stores/app.store';
import { UI_TEXT } from '@/types';
import {
  LayoutDashboard, Microscope, MessageCircle, TrendingUp, Grid3X3,
  FileText, ShoppingBag, Calendar, Package, Users, Droplets,
  Settings, User, X,
} from 'lucide-react';

const mainItems = [
  { href: '/dashboard', icon: LayoutDashboard, labelKey: 'dashboard', emoji: '🏠' },
  { href: '/crop-doctor', icon: Microscope, labelKey: 'cropDoctor', emoji: '🔬' },
  { href: '/chat', icon: MessageCircle, labelKey: 'chat', highlight: true, emoji: '💬' },
  { href: '/mandi', icon: TrendingUp, labelKey: 'mandi', emoji: '📊' },
];

const moreItems = [
  { href: '/schemes', icon: FileText, labelKey: 'schemes', emoji: '🏛️' },
  { href: '/marketplace', icon: ShoppingBag, labelKey: 'marketplace', emoji: '🛒' },
  { href: '/planner', icon: Calendar, labelKey: 'planner', emoji: '📅' },
  { href: '/inventory', icon: Package, labelKey: 'inventory', emoji: '📦' },
  { href: '/majdoor', icon: Users, labelKey: 'majdoor', emoji: '👥' },
  { href: '/jalsathi', icon: Droplets, labelKey: 'jalsathi', emoji: '💧' },
];

const bottomRowItems = [
  { href: '/profile/edit', icon: User, label: 'Profile', emoji: '👤' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { language } = useAppStore();
  const [showMore, setShowMore] = useState(false);

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <>
      {/* More Bottom Sheet */}
      <AnimatePresence>
        {showMore && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setShowMore(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white z-50 md:hidden safe-bottom"
              style={{ borderRadius: '24px 24px 0 0' }}
            >
              {/* Drag handle */}
              <div className="drag-handle" />

              {/* Title + Close */}
              <div className="flex items-center justify-between px-5 pt-4 pb-3">
                <h3 className="font-heading text-base font-semibold text-[#111827]">
                  {language === 'hi' ? 'और सुविधाएं' : language === 'kn' ? 'ಇನ್ನಷ್ಟು ವೈಶಿಷ್ಟ್ಯಗಳು' : 'More Features'}
                </h3>
                <button
                  onClick={() => setShowMore(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-[#6b7280]" />
                </button>
              </div>

              {/* Feature Grid — 2 columns */}
              <div className="grid grid-cols-2 gap-3 px-5 pb-4">
                {moreItems.map((item) => {
                  const active = isActive(item.href);
                  const label = UI_TEXT[item.labelKey]?.[language] || item.labelKey;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setShowMore(false)}
                      className={`flex items-center gap-3 p-3.5 rounded-2xl transition-all press-effect ${
                        active ? 'bg-[#f0fdf4] border border-[#d1fae5]' : 'bg-gray-50 border border-transparent hover:bg-gray-100'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                        active ? 'bg-[#166534] text-white' : 'bg-white shadow-sm'
                      }`}>
                        {item.emoji}
                      </div>
                      <span className={`text-sm font-medium ${
                        active ? 'text-[#166534]' : 'text-[#374151]'
                      }`}>
                        {label}
                      </span>
                    </Link>
                  );
                })}
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-100 mx-5" />

              {/* Bottom Row: Profile + Settings */}
              <div className="flex gap-3 px-5 py-4">
                {bottomRowItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setShowMore(false)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors press-effect"
                  >
                    <span className="text-lg">{item.emoji}</span>
                    <span className="text-sm font-medium text-[#374151]">{item.label}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white z-40 safe-bottom"
        style={{
          height: '64px',
          borderTop: '1px solid #d1fae5',
          boxShadow: '0 -4px 20px rgba(22, 101, 52, 0.08)',
        }}
      >
        <div className="flex items-center justify-around h-full px-1 max-w-lg mx-auto">
          {mainItems.map((item) => {
            const active = isActive(item.href);
            const label = UI_TEXT[item.labelKey]?.[language] || item.labelKey;

            // Center Chat button — elevated green circle
            if (item.highlight) {
              return (
                <Link key={item.href} href={item.href} className="relative flex flex-col items-center -mt-5">
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className="w-14 h-14 rounded-full flex items-center justify-center shadow-[0_4px_16px_rgba(22,101,52,0.40)]"
                    style={{ background: 'linear-gradient(135deg, #166534, #16a34a)' }}
                  >
                    <item.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <span className={`text-[11px] mt-0.5 font-semibold ${
                    active ? 'text-[#166534]' : 'text-[#9ca3af]'
                  }`}>
                    {label}
                  </span>
                </Link>
              );
            }

            // Regular nav items
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={`flex flex-col items-center gap-0.5 py-2 px-3 min-w-[56px] rounded-xl transition-colors ${
                    active ? 'bg-[#f0fdf4]' : ''
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${
                    active ? 'text-[#166534]' : 'text-[#9ca3af]'
                  }`} />
                  <span className={`text-[11px] font-medium ${
                    active ? 'text-[#166534] font-semibold' : 'text-[#9ca3af]'
                  }`}>
                    {label}
                  </span>
                </motion.div>
              </Link>
            );
          })}

          {/* More Button */}
          <button onClick={() => setShowMore(true)}>
            <motion.div
              whileTap={{ scale: 0.9 }}
              className={`flex flex-col items-center gap-0.5 py-2 px-3 min-w-[56px] rounded-xl transition-colors ${
                showMore ? 'bg-[#f0fdf4]' : ''
              }`}
            >
              <Grid3X3 className={`w-5 h-5 ${
                showMore ? 'text-[#166534]' : 'text-[#9ca3af]'
              }`} />
              <span className={`text-[11px] font-medium ${
                showMore ? 'text-[#166534] font-semibold' : 'text-[#9ca3af]'
              }`}>
                {language === 'hi' ? 'और' : language === 'kn' ? 'ಇನ್ನಷ್ಟು' : 'More'}
              </span>
            </motion.div>
          </button>
        </div>
      </nav>
    </>
  );
}
