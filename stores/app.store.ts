'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FarmerProfile, Language } from '@/types';

interface AppState {
  // Auth
  user: { id: string; email?: string } | null;
  farmerProfile: FarmerProfile | null;
  
  // Language
  language: Language;
  
  // UI state
  sidebarOpen: boolean;
  
  // Actions
  setUser: (user: { id: string; email?: string } | null) => void;
  setFarmerProfile: (profile: FarmerProfile | null) => void;
  setLanguage: (lang: Language) => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      farmerProfile: null,
      language: 'en',
      sidebarOpen: false,

      setUser: (user) => set({ user }),
      setFarmerProfile: (profile) => set({ farmerProfile: profile }),
      setLanguage: (language) => set({ language }),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
    }),
    {
      name: 'krishisetu-storage',
      partialize: (state) => ({
        language: state.language,
      }),
    }
  )
);
