'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const steps = [
  { id: 1, title: 'Basic Info', icon: '👤' },
  { id: 2, title: 'Your Location', icon: '📍' },
  { id: 3, title: 'Farm Details', icon: '🌾' },
  { id: 4, title: 'Financial Info', icon: '💰' },
  { id: 5, title: 'Preferences', icon: '⚙️' },
];

export default function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="w-full relative">
      {/* Mobile Horizontal */}
      <div className="flex md:hidden justify-between items-center relative z-10">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -z-10 -translate-y-1/2" />
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-[#166534] -z-10 -translate-y-1/2 transition-all duration-500 ease-in-out"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <motion.div
              key={step.id}
              initial={false}
              animate={{
                scale: isCurrent ? 1.1 : 1,
                backgroundColor: isCompleted ? '#166534' : isCurrent ? '#f0fdf4' : '#ffffff',
                borderColor: isCompleted || isCurrent ? '#166534' : '#d1d5db',
              }}
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors duration-300`}
            >
              {isCompleted ? (
                <Check className="w-4 h-4 text-white" />
              ) : (
                <span className={`text-xs font-semibold ${isCurrent ? 'text-[#166534]' : 'text-gray-400'}`}>
                  {step.id}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Desktop Vertical */}
      <div className="hidden md:flex flex-col gap-8 relative z-10">
        <div className="absolute top-6 bottom-6 left-6 w-0.5 bg-white/20 -z-10" />
        <div
          className="absolute top-6 left-6 w-0.5 bg-white -z-10 transition-all duration-500 ease-in-out"
          style={{ height: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <div key={step.id} className="flex items-center gap-4">
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                  backgroundColor: isCompleted ? '#ffffff' : isCurrent ? 'rgba(255,255,255,0.1)' : 'transparent',
                  borderColor: isCompleted || isCurrent ? '#ffffff' : 'rgba(255,255,255,0.3)',
                }}
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-colors duration-300 backdrop-blur-sm`}
              >
                {isCompleted ? (
                  <Check className="w-6 h-6 text-[#166534]" />
                ) : (
                  <span className={`text-lg font-semibold ${isCompleted || isCurrent ? 'text-white' : 'text-white/50'}`}>
                    {step.id}
                  </span>
                )}
              </motion.div>
              <div>
                <p className={`text-sm font-semibold transition-colors duration-300 ${isCurrent || isCompleted ? 'text-white' : 'text-white/50'}`}>
                  Step {step.id}
                </p>
                <p className={`text-lg transition-colors duration-300 ${isCurrent || isCompleted ? 'text-white font-bold' : 'text-white/50 font-medium'}`}>
                  {step.icon} {step.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
