'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import CountUp from 'react-countup';
import { Wheat, Bot, IndianRupee, Globe } from 'lucide-react';

const stats = [
  { icon: Wheat, value: 500, suffix: 'K+', label: 'Farmers Helped', countup: true },
  { icon: Bot, value: 10, suffix: '', label: 'AI Features Built', countup: true },
  { icon: IndianRupee, value: 0, suffix: '', label: 'Monthly Cost', countup: false, display: '₹0' },
  { icon: Globe, value: 3, suffix: '', label: 'Indian Languages', countup: true },
];

export default function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.21, 1.11, 0.81, 0.99] }}
          className="rounded-2xl md:rounded-3xl p-6 sm:p-10 md:p-16"
          style={{ background: 'linear-gradient(135deg, #166534 0%, #14532d 100%)' }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
            {stats.map((stat, i) => (
              <div key={stat.label} className="relative flex flex-col items-center text-center">
                {/* Divider */}
                {i > 0 && (
                  <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-[40%] bg-white/20" />
                )}
                <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center mb-4">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-stat text-white">
                  {stat.countup && inView ? (
                    <CountUp end={stat.value} suffix={stat.suffix} duration={2.5} />
                  ) : stat.countup ? (
                    '0'
                  ) : (
                    stat.display
                  )}
                </p>
                <p className="text-sm text-white/75 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
