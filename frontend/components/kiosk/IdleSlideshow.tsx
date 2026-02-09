'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

interface IdleSlideshowProps {
  onDismiss: () => void;
}

export const IdleSlideshow = ({ onDismiss }: IdleSlideshowProps) => {
  const { t } = useLanguage();
  const [currentIdx, setCurrentIdx] = useState(0);
  const images = PlaceHolderImages.length > 0 ? PlaceHolderImages : [
    { imageUrl: 'https://picsum.photos/seed/default/1920/1080', imageHint: 'city' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black cursor-pointer overflow-hidden"
      onClick={onDismiss}
      onTouchStart={onDismiss}
    >
      {images.map((img, idx) => (
        <div
          key={idx}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            idx === currentIdx ? "opacity-100" : "opacity-0"
          )}
        >
          <Image
            src={img.imageUrl}
            alt="City Slideshow"
            fill
            className="object-cover"
            priority={idx === 0}
            data-ai-hint={img.imageHint}
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      ))}

      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-10 pointer-events-none">
        <div className="mb-8 animate-pulse">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
            <path d="M3 21h18" />
            <rect width="16" height="12" x="4" y="3" rx="2" />
          </svg>
        </div>
        
        <h2 className="text-6xl sm:text-8xl font-black mb-6 tracking-tighter drop-shadow-2xl">
          SUVIDHA
        </h2>
        
        <div className="bg-[#0E6170]/80 backdrop-blur-md px-10 py-6 rounded-3xl border-2 border-white/20 shadow-2xl animate-bounce mt-10">
          <p className="text-3xl sm:text-4xl font-bold uppercase tracking-[0.2em]">
            {t('touch_to_start')}
          </p>
        </div>
      </div>

      <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end pointer-events-none">
        <div className="bg-black/40 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
          <p className="text-white/60 text-sm font-bold uppercase tracking-widest mb-1">{t('smart_city_services')}</p>
          <p className="text-white text-xl font-bold">{t('gate_way_title')}</p>
        </div>
        <div className="flex gap-2">
          {images.map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === currentIdx ? "w-12 bg-white" : "w-2 bg-white/30"
              )} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};
