
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { LanguageId, getTranslation } from '@/lib/languages';

interface LanguageContextType {
  language: LanguageId;
  setLanguage: (lang: LanguageId) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Safe SSR initialization: Start with English, update in useEffect
  const [language, setLanguageState] = useState<LanguageId>('en');
  const isMounted = useRef(false);

  // Recover from session storage on mount to avoid hydration mismatch
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('suvidha_lang') as LanguageId;
      if (saved && saved !== 'en') {
        setLanguageState(saved);
      }
      isMounted.current = true;
    }
  }, []);

  const setLanguage = useCallback((lang: LanguageId) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('suvidha_lang', lang);
    }
  }, []);

  const t = useCallback((key: string) => {
    return getTranslation(language, key);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
