'use client';

import Sidebar from '@/components/layout/Sidebar';
import BottomNav from '@/components/layout/BottomNav';
import Header from '@/components/layout/Header';
import OfflineBanner from '@/components/ui/OfflineBanner';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-krishisetu-bg">
      {/* Offline Detection */}
      <OfflineBanner />
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Header — fixed 56px */}
      <Header />

      {/* Main Content — pt-14 for mobile fixed header, pb-20 for bottom nav */}
      <main className="min-h-screen transition-all duration-300 pt-14 pb-20 md:pt-0 md:pb-6 md:ml-[260px]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-4 md:py-6">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav — fixed 64px */}
      <BottomNav />
    </div>
  );
}
