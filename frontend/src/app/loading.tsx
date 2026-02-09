'use client';

import { useEffect, useState } from 'react';

export default function Loading() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-[9999]">
      <div className="flex flex-col items-center max-w-md w-full px-12 text-center">
        {/* Simplified Brand Pulse */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-[#0E6170]/10 rounded-full animate-pulse scale-150" />
          <div className="w-24 h-24 rounded-full bg-[#0E6170] flex items-center justify-center shadow-xl relative z-10">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21h18" />
              <rect width="16" height="12" x="4" y="3" rx="2" />
            </svg>
          </div>
        </div>

        <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-4">
          SUVIDHA Kiosk
        </h2>
        
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-6">
          <div className="h-full bg-[#0E6170] animate-shimmer w-1/2" />
        </div>

        <div className="h-8">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em]">
            Processing{dots}
          </p>
        </div>
      </div>
    </div>
  );
}
