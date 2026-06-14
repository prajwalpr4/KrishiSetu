'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function SuccessScreen({ firstName }: { firstName: string }) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(2);

  useEffect(() => {
    // Generate Confetti
    const colors = ['#166534', '#22c55e', '#f59e0b', '#4ade80', '#ffffff', '#86efac'];
    for (let i = 0; i < 40; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'absolute w-3 h-3 rounded-sm pointer-events-none z-0';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = '50%';
      confetti.style.top = '40%';
      
      const angle = Math.random() * Math.PI * 2;
      const velocity = 50 + Math.random() * 150;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity - 100;
      
      confetti.animate([
        { transform: 'translate(-50%, -50%) scale(0) rotate(0deg)', opacity: 1 },
        { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1) rotate(${Math.random() * 720}deg)`, opacity: 1, offset: 0.8 },
        { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty + 50}px)) scale(0.5) rotate(${Math.random() * 1080}deg)`, opacity: 0 }
      ], {
        duration: 1000 + Math.random() * 1000,
        easing: 'cubic-bezier(.37,0,.63,1)',
        fill: 'forwards'
      });
      
      document.getElementById('success-container')?.appendChild(confetti);
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div id="success-container" className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-6 overflow-hidden">
      
      {/* Animated Check Circle */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 15, stiffness: 200 }}
        className="w-24 h-24 rounded-full bg-[#166534] flex items-center justify-center mb-8 relative z-10 shadow-2xl shadow-[#166534]/30"
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-12 h-12"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <polyline points="20 6 9 17 4 12" />
        </motion.svg>
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="font-heading text-4xl font-extrabold text-[#111827] mb-3 text-center z-10"
      >
        Profile Complete! 🎉
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-[#4b5563] text-lg text-center mb-10 max-w-sm z-10"
      >
        Welcome to KrishiSetu, <strong className="text-[#166534]">{firstName}</strong>! Your farm dashboard is ready.
      </motion.p>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex items-center gap-3 bg-[#f0fdf4] border border-[#d1fae5] px-5 py-3 rounded-full z-10"
      >
        <div className="relative w-5 h-5">
          <svg className="w-5 h-5 -rotate-90">
            <circle cx="10" cy="10" r="8" fill="none" stroke="#d1fae5" strokeWidth="2" />
            <motion.circle 
              cx="10" cy="10" r="8" 
              fill="none" stroke="#166534" strokeWidth="2"
              strokeDasharray="50"
              initial={{ strokeDashoffset: 0 }}
              animate={{ strokeDashoffset: 50 }}
              transition={{ duration: 2.5, ease: "linear" }}
            />
          </svg>
        </div>
        <span className="text-[#166534] font-semibold text-sm">
          Redirecting to Dashboard in {countdown}s...
        </span>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        onClick={() => router.push('/dashboard')}
        className="mt-6 text-sm text-[#6b7280] font-medium hover:text-[#111827] underline z-10"
      >
        Go to Dashboard Now →
      </motion.button>
    </div>
  );
}
