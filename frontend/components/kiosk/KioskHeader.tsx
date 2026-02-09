'use client';

import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, Headset, Clock, MapPin, Bell, MonitorOff, Settings } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';
import { NotificationSidebar } from './NotificationSidebar';

export const KioskHeader = () => {
  const { user, logout, isAuthenticated, timeLeft } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [hasAlerts, setHasAlerts] = useState(true);
  const [detectedRegion, setDetectedRegion] = useState({ district: 'New Delhi', state: 'Delhi' });

  useEffect(() => {
    const saved = sessionStorage.getItem('suvidha_detected_region');
    if (user?.region) {
      setDetectedRegion(user.region);
    } else if (saved) {
      setDetectedRegion(JSON.parse(saved));
    }
  }, [user]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const maskIdentifier = (id: string) => {
    if (!id) return '';
    if (id.length < 5) return id;
    return id.substring(0, 2) + "X".repeat(id.length - 5) + id.substring(id.length - 3);
  };

  const exitKioskMode = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(console.error);
      logger.log('Kiosk Mode (Fullscreen) killed by user', 'INFO');
    }
  };

  const isLanguagePage = pathname === '/';

  return (
    <header className="p-3 sm:p-6 flex justify-between items-center bg-white/70 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b">
      <div className="flex items-center gap-2 sm:gap-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-[#0E6170]/10 flex items-center justify-center">
            <svg width="20" height="20" className="sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="#0E6170" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21h18" />
              <rect width="16" height="12" x="4" y="3" rx="2" />
            </svg>
          </div>
          <div onClick={() => !isAuthenticated && router.push('/')} className={`${!isAuthenticated ? 'cursor-pointer' : ''}`}>
            <h1 className="text-base sm:text-xl font-bold text-[#0E6170] leading-none tracking-tight">SUVIDHA</h1>
            <p className="hidden sm:block text-[10px] text-[#0E6170]/70 font-semibold tracking-widest uppercase mt-1">{t('citizen_services')}</p>
          </div>
        </div>

        {isAuthenticated && (
          <div className={`flex items-center gap-1 sm:gap-2 px-3 sm:py-2 rounded-full font-mono font-bold text-sm sm:text-lg ${timeLeft < 60 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-orange-50 text-orange-600'}`}>
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            {formatTime(timeLeft)}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="rounded-full font-bold text-muted-foreground hover:text-[#0E6170] hover:bg-[#0E6170]/10 h-10 px-4 gap-2 transition-all opacity-40 hover:opacity-100"
            onClick={() => router.push('/admindashboard')}
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Admin</span>
          </Button>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={exitKioskMode}
            className="rounded-full border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600 bg-white/50 h-10 px-4 gap-2 font-bold transition-all opacity-40 hover:opacity-100"
          >
            <MonitorOff className="w-4 h-4" />
            <span className="hidden sm:inline">{t('kill_kiosk')}</span>
          </Button>
        </div>

        {(isLanguagePage || !isAuthenticated) && (
          <div className="hidden sm:flex items-center gap-3 bg-gray-50 p-2 px-5 rounded-full border border-gray-200">
            <MapPin className="w-5 h-5 text-[#0E6170]" />
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase leading-none mb-1">{t('detected_region')}</span>
              <span className="text-sm font-bold leading-tight text-gray-800">{detectedRegion.district}, {detectedRegion.state}</span>
            </div>
          </div>
        )}

        {isAuthenticated && (
          <>
            <div className="relative">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-10 w-10 sm:h-12 sm:w-12 border-gray-200 bg-white/80 shadow-sm hover:bg-white relative active:scale-95 transition-all"
                onClick={() => {
                  setIsNotificationsOpen(true);
                  setHasAlerts(false);
                }}
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-[#0E6170]" />
                {hasAlerts && (
                  <span className="absolute top-1 sm:top-2 right-1 sm:right-2 w-2 sm:w-3 h-2 sm:h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                )}
              </Button>
            </div>

            <div className="hidden md:flex items-center gap-3 bg-gray-50 p-2 px-5 rounded-full border border-gray-200">
              <User className="w-5 h-5 text-[#0E6170]" />
              <div className="flex flex-col">
                <span className="text-sm font-bold leading-tight">{user?.name}</span>
                <span className="text-[10px] text-muted-foreground uppercase">{maskIdentifier(user?.consumerNo || user?.mobileNo || '')}</span>
              </div>
            </div>
          </>
        )}

        <Button variant="outline" className="rounded-full bg-white/80 border-gray-200 h-10 sm:h-12 px-3 sm:px-6 gap-2 sm:gap-3 shadow-sm hover:bg-white active:scale-95 transition-all">
          <Headset className="w-4 h-4 sm:w-5 sm:h-5 text-[#0E6170]" />
          <span className="font-bold text-xs sm:text-sm">{t('assisted_help')}</span>
        </Button>

        {isAuthenticated && (
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={logout}
            className="rounded-full h-10 sm:h-12 px-3 sm:px-6 font-bold shadow-md active:scale-95 transition-all"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" />
            <span className="hidden sm:inline">{t('logout')}</span>
          </Button>
        )}
      </div>

      {isAuthenticated && (
        <NotificationSidebar 
          open={isNotificationsOpen} 
          onOpenChange={setIsNotificationsOpen} 
        />
      )}
    </header>
  );
};
