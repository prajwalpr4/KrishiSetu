'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/app.store';
import { UI_TEXT } from '@/types';
import {
  LayoutDashboard, Microscope, MessageCircle, TrendingUp, FileText,
  ShoppingBag, Calendar, Package, Users, Droplets, Leaf, Globe,
  LogOut, User
} from 'lucide-react';
import type { Language } from '@/types';
import { createClient } from '@/lib/supabase/client';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, labelKey: 'dashboard' },
  { href: '/crop-doctor', icon: Microscope, labelKey: 'cropDoctor' },
  { href: '/chat', icon: MessageCircle, labelKey: 'chat' },
  { href: '/mandi', icon: TrendingUp, labelKey: 'mandi' },
  { href: '/schemes', icon: FileText, labelKey: 'schemes' },
  { href: '/marketplace', icon: ShoppingBag, labelKey: 'marketplace' },
  { href: '/planner', icon: Calendar, labelKey: 'planner' },
  { href: '/inventory', icon: Package, labelKey: 'inventory' },
  { href: '/majdoor', icon: Users, labelKey: 'majdoor' },
  { href: '/jalsathi', icon: Droplets, labelKey: 'jalsathi' },
  { href: '/profile/edit', icon: User, labelKey: 'profile' },
];

const languageOptions: { code: Language; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'हिं' },
  { code: 'kn', label: 'ಕ' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage } = useAppStore();
  const supabase = createClient();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      window.location.href = '/';
    }
  };

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 bg-white border-r border-krishisetu-border z-40"
      style={{ width: 'var(--sidebar-width)' }}>
      
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-krishisetu-border">
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
          <Leaf className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-heading text-xl font-bold text-krishisetu-text-primary leading-tight">
            KrishiSetu
          </h1>
          <p className="text-[10px] text-krishisetu-text-muted leading-tight">
            {language === 'hi' ? 'कृषि सेतु' : language === 'kn' ? 'ಕೃಷಿ ಸೇತು' : 'Farmer\'s Bridge'}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-3 overflow-y-auto scrollbar-thin">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname.startsWith(item.href));
            const label = UI_TEXT[item.labelKey]?.[language] || item.labelKey;
            
            return (
              <li key={item.href}>
                <Link href={item.href}>
                  <motion.div
                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-light text-primary'
                        : 'text-krishisetu-text-muted hover:bg-gray-50 hover:text-krishisetu-text-body'
                    }`}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute left-0 top-1 bottom-1 w-[3px] rounded-full bg-primary"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                      />
                    )}
                    <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary' : ''}`} />
                    <span className="truncate">{label}</span>
                  </motion.div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Language Selector */}
      <div className="px-4 py-3 border-t border-krishisetu-border">
        <div className="flex items-center gap-1.5 mb-3">
          <Globe className="w-4 h-4 text-krishisetu-text-muted" />
          <span className="text-xs text-krishisetu-text-muted">Language</span>
        </div>
        <div className="flex gap-1">
          {languageOptions.map((opt) => (
            <button
              key={opt.code}
              onClick={() => setLanguage(opt.code)}
              className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all ${
                language === opt.code
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-gray-100 text-krishisetu-text-muted hover:bg-gray-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* User section */}
      <div className="px-4 py-3 border-t border-krishisetu-border">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-krishisetu-text-muted hover:text-accent transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          <span>{UI_TEXT.logout[language]}</span>
        </button>
      </div>
    </aside>
  );
}
