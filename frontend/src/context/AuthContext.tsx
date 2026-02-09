
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { logger } from '@/lib/logger';
import { KIOSK_SETTINGS } from '@/lib/kiosk-settings';
import { useLanguage } from './LanguageContext';

interface User {
  id: string;
  consumerNo?: string;
  mobileNo?: string;
  name: string;
  token: string;
  language: string;
  region?: {
    district: string;
    state: string;
  };
}

interface AuthContextType {
  user: User | null;
  login: (data: { consumerNo?: string; mobileNo?: string; language: string; region?: { district: string; state: string } }) => Promise<void>;
  logout: () => void;
  extendSession: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  timeLeft: number;
  dialogTimeLeft: number;
  showExtensionPrompt: boolean;
  setShowExtensionPrompt: (show: boolean) => void;
  isIdle: boolean;
  setIsIdle: (idle: boolean) => void;
  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(KIOSK_SETTINGS.SESSION_DURATION_SEC);
  const [dialogTimeLeft, setDialogTimeLeft] = useState(KIOSK_SETTINGS.LOGOUT_GRACE_PERIOD_SEC);
  const [showExtensionPrompt, setShowExtensionPrompt] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  
  // Safe SSR initialization: Start with false, update in useEffect
  const [audioEnabled, setAudioEnabled] = useState(false);
  
  const { setLanguage } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const lastLoggedPath = useRef<string>('');
  const isInitialCheckDone = useRef(false);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio preference on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('suvidha_audio_enabled');
      // For now, keep it disabled by default as per request, but allow override if user explicitly set it
      if (saved === 'true') {
        setAudioEnabled(true);
      }
    }
  }, []);

  // Save audio preference when changed
  useEffect(() => {
    if (isInitialCheckDone.current) {
      sessionStorage.setItem('suvidha_audio_enabled', audioEnabled.toString());
    }
  }, [audioEnabled]);

  const logout = useCallback(() => {
    const userId = user?.id;
    setUser(null);
    setTimeLeft(KIOSK_SETTINGS.SESSION_DURATION_SEC);
    setDialogTimeLeft(KIOSK_SETTINGS.LOGOUT_GRACE_PERIOD_SEC);
    setShowExtensionPrompt(false);
    sessionStorage.removeItem('suvidha_session');
    sessionStorage.removeItem('suvidha_expiry');
    sessionStorage.removeItem('suvidha_session_id');
    logger.log('User signed out', 'INFO', { userId });
    router.replace('/');
  }, [router, user]);

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    
    idleTimerRef.current = setTimeout(() => {
      setIsIdle(true);
      if (user) {
        logger.log('Session idle timeout - logging out', 'INFO');
        logout();
      }
    }, KIOSK_SETTINGS.IDLE_TIMEOUT_MS);
  }, [user, logout]);

  useEffect(() => {
    if (user?.language) {
      setLanguage(user.language as any);
    }
  }, [user?.language, setLanguage]);

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    const handleActivity = () => {
      if (isIdle) setIsIdle(false);
      resetIdleTimer();
    };
    events.forEach(event => window.addEventListener(event, handleActivity));
    resetIdleTimer();
    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [isIdle, resetIdleTimer]);

  useEffect(() => {
    if (isInitialCheckDone.current) return;
    const recoverSession = () => {
      try {
        const session = sessionStorage.getItem('suvidha_session');
        const expiry = sessionStorage.getItem('suvidha_expiry');
        if (session && expiry) {
          const parsedSession = JSON.parse(session) as User;
          const expiryTime = parseInt(expiry, 10);
          const remaining = Math.floor((expiryTime - Date.now()) / 1000);
          if (remaining > 0) {
            setUser(parsedSession);
            setTimeLeft(remaining);
            if (parsedSession.language) setLanguage(parsedSession.language as any);
            if (!sessionStorage.getItem('suvidha_session_id')) {
              sessionStorage.setItem('suvidha_session_id', 'SESS-' + Math.random().toString(36).substring(2, 11));
            }
          } else {
            sessionStorage.removeItem('suvidha_session');
            sessionStorage.removeItem('suvidha_expiry');
            sessionStorage.removeItem('suvidha_session_id');
          }
        }
      } catch (e) {
        console.error('Session recovery failed', e);
      } finally {
        setIsLoading(false);
        isInitialCheckDone.current = true;
      }
    };
    recoverSession();
  }, [setLanguage]);

  useEffect(() => {
    if (isLoading) return;
    const publicPaths = ['/', '/login', '/admindashboard'];
    const isPublic = publicPaths.some(p => pathname === p || pathname.startsWith(p));
    if (!user && !isPublic) {
      router.replace('/');
    } else if (user && (pathname === '/' || pathname === '/login')) {
      router.replace('/dashboard');
    } else if (user && pathname !== '/' && pathname !== lastLoggedPath.current) {
      logger.log(`Navigated to ${pathname}`, 'ACTIVITY');
      lastLoggedPath.current = pathname;
    }
  }, [user, pathname, isLoading, router]);

  useEffect(() => {
    if (!user || isLoading || showExtensionPrompt) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setShowExtensionPrompt(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [user, isLoading, showExtensionPrompt]);

  useEffect(() => {
    if (!showExtensionPrompt) {
      setDialogTimeLeft(KIOSK_SETTINGS.LOGOUT_GRACE_PERIOD_SEC);
      return;
    }
    const interval = setInterval(() => {
      setDialogTimeLeft((prev) => {
        if (prev <= 1) {
          logout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [showExtensionPrompt, logout]);

  const extendSession = useCallback(() => {
    const newExpiryTime = Date.now() + (KIOSK_SETTINGS.EXTENSION_AMOUNT_SEC * 1000);
    sessionStorage.setItem('suvidha_expiry', newExpiryTime.toString());
    logger.log('Session extension granted', 'ACTIVITY', { extensionSeconds: KIOSK_SETTINGS.EXTENSION_AMOUNT_SEC });
    setTimeLeft(KIOSK_SETTINGS.EXTENSION_AMOUNT_SEC);
    setDialogTimeLeft(KIOSK_SETTINGS.LOGOUT_GRACE_PERIOD_SEC);
    setShowExtensionPrompt(false);
  }, []);

  const login = async (data: { consumerNo?: string; mobileNo?: string; language: string; region?: { district: string; state: string } }) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 200));
    const mockUser: User = {
      id: 'USR' + Math.floor(Math.random() * 100000),
      consumerNo: data.consumerNo,
      mobileNo: data.mobileNo,
      name: 'Registered Citizen',
      token: `mock-jwt-token-${data.language}-` + Math.random().toString(36).substring(7),
      language: data.language,
      region: data.region,
    };
    const expiryTime = Date.now() + (KIOSK_SETTINGS.SESSION_DURATION_SEC * 1000);
    setUser(mockUser);
    setLanguage(data.language as any);
    setTimeLeft(KIOSK_SETTINGS.SESSION_DURATION_SEC);
    setDialogTimeLeft(KIOSK_SETTINGS.LOGOUT_GRACE_PERIOD_SEC);
    sessionStorage.setItem('suvidha_session', JSON.stringify(mockUser));
    sessionStorage.setItem('suvidha_expiry', expiryTime.toString());
    sessionStorage.setItem('suvidha_session_id', 'SESS-' + Math.random().toString(36).substring(2, 11));
    logger.log('User signed in', 'INFO', { userId: mockUser.id, language: data.language });
    router.replace('/dashboard');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      extendSession,
      isAuthenticated: !!user, 
      isLoading, 
      timeLeft,
      dialogTimeLeft,
      showExtensionPrompt,
      setShowExtensionPrompt,
      isIdle,
      setIsIdle,
      audioEnabled,
      setAudioEnabled
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
