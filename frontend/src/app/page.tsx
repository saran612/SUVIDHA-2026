
'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { SUPPORTED_LANGUAGES, getTranslation } from '@/lib/languages';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useRouter } from 'next/navigation';
import { Volume2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { logger } from '@/lib/logger';
import Loading from '@/app/loading';
import { VoiceInstruction } from '@/components/kiosk/VoiceInstruction';

export default function LanguageSelection() {
  const { setLanguage } = useLanguage();
  const { audioEnabled, setAudioEnabled } = useAuth();
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>('en');
  const [navigating, setNavigating] = useState(false);
  const [region, setRegion] = useState({ district: 'New Delhi', state: 'Delhi' });

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data && data.city && data.region) {
          const newRegion = {
            district: data.city,
            state: data.region
          };
          setRegion(newRegion);
          sessionStorage.setItem('suvidha_detected_region', JSON.stringify(newRegion));
          logger.log(`Location detected: ${newRegion.district}, ${newRegion.state}`, 'INFO');
        } else {
          logger.log(`Location detection fell back to default`, 'WARN');
        }
      })
      .catch(err => {
        logger.log(`Location detection failed: ${err.message}`, 'WARN');
      });
  }, []);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    logger.log(`Language selected: ${id}`, 'ACTIVITY');
  };

  const handleStart = () => {
    if (selectedId) {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.warn("Fullscreen request failed:", err);
        });
      }

      setNavigating(true);
      setLanguage(selectedId as any);
      sessionStorage.setItem('suvidha_temp_region', JSON.stringify(region));

      logger.log(`Confirmed language: ${selectedId}`, 'INFO');

      setTimeout(() => {
        router.push('/login');
      }, 300);
    }
  };

  const getLangBadge = (id: string, native: string) => {
    const badges: Record<string, string> = {
      en: 'Ag', hi: 'अ', bn: 'অ', te: 'తె', mr: 'म', ta: 'த', ur: 'ع', gu: 'ગુ',
      kn: 'ಕ', ml: 'മ', or: 'ଓ', pa: 'ਪੰ', as: 'অ', mai: 'मै', ks: 'ک', sd: 'سن',
      kok: 'कों', mni: 'ꯃꯤ', ne: 'ने', brx: 'ब', doi: 'डो', sa: 'सं', sat: 'ᱥᱟ',
    };
    return badges[id] || native.substring(0, 1);
  };

  const getBadgeColor = (id: string) => {
    const colors: Record<string, string> = {
      en: 'bg-blue-50 text-blue-600',
      hi: 'bg-orange-50 text-orange-600',
      bn: 'bg-green-50 text-green-600',
      te: 'bg-cyan-50 text-cyan-600',
      mr: 'bg-pink-50 text-pink-600',
      ta: 'bg-indigo-50 text-indigo-600',
      ur: 'bg-emerald-50 text-emerald-600',
      gu: 'bg-amber-50 text-amber-600',
      kn: 'bg-yellow-50 text-yellow-700',
      ml: 'bg-rose-50 text-rose-600',
      or: 'bg-violet-50 text-violet-600',
      pa: 'bg-sky-50 text-sky-600',
      as: 'bg-teal-50 text-teal-600',
      mai: 'bg-lime-50 text-lime-600',
      ks: 'bg-green-100 text-green-800',
      sd: 'bg-slate-100 text-slate-700',
      kok: 'bg-purple-50 text-purple-600',
      mni: 'bg-fuchsia-50 text-fuchsia-600',
      ne: 'bg-red-50 text-red-600',
      brx: 'bg-cyan-100 text-cyan-800',
      doi: 'bg-orange-100 text-orange-800',
      sa: 'bg-amber-100 text-amber-900',
      sat: 'bg-stone-100 text-stone-700',
    };
    return colors[id] || 'bg-gray-50 text-gray-500';
  };

  if (navigating) return <Loading />;

  return (
    <div className="h-full flex flex-col bg-[#F8FAFB] overflow-hidden">
      <VoiceInstruction text="Welcome to SUVIDHA Kiosk. Please select your preferred language to proceed." />
      <main className="flex-1 flex flex-col items-center overflow-hidden">
        <div className="relative text-center py-8 sm:py-10 px-6 w-full max-w-4xl shrink-0">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2 sm:mb-2 tracking-tight">Select your language</h2>
        </div>

        <div className="flex-1 w-full overflow-y-auto overflow-x-hidden px-6 touch-pan-y pointer-events-auto overscroll-contain pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto py-4">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <Card
                key={lang.id}
                onClick={() => handleSelect(lang.id)}
                className={cn(
                  "relative flex items-center p-4 sm:p-6 cursor-pointer transition-all border-2 rounded-[1.25rem] shadow-sm active:scale-[0.98]",
                  selectedId === lang.id
                    ? "border-[#0E6170] bg-[#0E6170]/10 ring-4 ring-[#0E6170]/5"
                    : "border-transparent bg-white hover:border-gray-100"
                )}
              >
                <div className={cn(
                  "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold mr-4 shrink-0",
                  getBadgeColor(lang.id)
                )}>
                  {getLangBadge(lang.id, lang.native)}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-lg sm:text-xl font-bold text-gray-900 leading-tight truncate">{lang.native}</p>
                  <p className="text-xs sm:text-sm text-gray-400 font-medium truncate">{lang.name}</p>
                </div>
                {selectedId === lang.id && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <CheckCircle2 className="w-6 h-6 text-[#0E6170] fill-white" />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </main>

      <footer className="h-[108px] w-full bg-white border-t border-gray-200 px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4 z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] shrink-0">
        <div className="flex items-center gap-6 sm:gap-10">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#0E6170] flex items-center justify-center shadow-lg">
              <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="leading-tight">
              <p className="text-[8px] sm:text-[10px] uppercase tracking-widest font-black text-gray-400">Audio Guide</p>
              <p className="text-lg sm:text-xl font-bold text-gray-800">आवाज़ सुनें</p>
            </div>
          </div>
          <Switch
            checked={audioEnabled}
            onCheckedChange={setAudioEnabled}
            className="data-[state=checked]:bg-[#0E6170] scale-110 sm:scale-125 ml-2"
          />
        </div>

        <Button
          onClick={handleStart}
          disabled={!selectedId}
          className="w-full sm:w-auto h-[75px] min-h-[48px] max-h-[64px] px-8 sm:px-12 rounded-2xl bg-[#0E6170] hover:bg-[#0E6170]/90 text-white shadow-xl flex gap-3 sm:gap-4 text-xl sm:text-2xl font-bold transition-all active:scale-95"
        >
          <span>Start / {selectedId ? getTranslation(selectedId, 'start') : 'शुरू करें'}</span>
          <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8" />
        </Button>
      </footer>
    </div>
  );
}
