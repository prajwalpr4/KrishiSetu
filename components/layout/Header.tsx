'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAppStore } from '@/stores/app.store';
import { UI_TEXT } from '@/types';
import type { Language } from '@/types';
import { Globe, Bell, ChevronLeft, Leaf } from 'lucide-react';

const pageTitle: Record<string, string> = {
  '/dashboard': 'dashboard',
  '/crop-doctor': 'cropDoctor',
  '/chat': 'chat',
  '/mandi': 'mandi',
  '/schemes': 'schemes',
  '/marketplace': 'marketplace',
  '/planner': 'planner',
  '/inventory': 'inventory',
  '/majdoor': 'majdoor',
  '/jalsathi': 'jalsathi',
};

// Pages that should show back arrow instead of logo
const nestedPages = ['/schemes', '/marketplace', '/planner', '/inventory', '/majdoor', '/jalsathi', '/profile'];

const languageCycle: Language[] = ['en', 'hi', 'kn'];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage } = useAppStore();

  const titleKey = pageTitle[pathname] || 'dashboard';
  const title = UI_TEXT[titleKey]?.[language] || titleKey;
  const isNested = nestedPages.some(p => pathname.startsWith(p));

  const cycleLanguage = () => {
    const currentIndex = languageCycle.indexOf(language);
    const nextIndex = (currentIndex + 1) % languageCycle.length;
    setLanguage(languageCycle[nextIndex]);
  };

  return (
    <header
      className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg safe-top"
      style={{
        height: '56px',
        borderBottom: '1px solid #d1fae5',
      }}
    >
      <div className="flex items-center justify-between h-full px-4">
        {/* Left: Back arrow or Logo */}
        <div className="flex items-center gap-2 min-w-[60px]">
          {isNested ? (
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-[#f0fdf4] transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-[#166534]" />
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-lg bg-[#166534] flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
            </div>
          )}
        </div>

        {/* Center: Page Title */}
        <h1 className="font-heading text-base font-semibold text-[#111827] truncate max-w-[160px]">
          {isNested ? title : 'KrishiSetu'}
        </h1>

        {/* Right: Language + Bell */}
        <div className="flex items-center gap-1.5 min-w-[60px] justify-end">
          <button
            onClick={cycleLanguage}
            className="flex items-center gap-1 px-2 py-1.5 rounded-full bg-[#f0fdf4] text-[#166534] text-xs font-semibold hover:bg-[#dcfce7] transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            {language === 'en' ? 'EN' : language === 'hi' ? 'हिं' : 'ಕ'}
          </button>
          <button className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 transition-colors">
            <Bell className="w-5 h-5 text-[#6b7280]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
          </button>
        </div>
      </div>
    </header>
  );
}
