
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

  // Recover from jwt/session storage on mount to avoid hydration mismatch
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let langFromJwt: LanguageId | null = null;
      const jwtToken = localStorage.getItem('jwt');

      if (jwtToken) {
        try {
          const payloadBase64 = jwtToken.split('.')[1];
          if (payloadBase64) {
            const decodedPayload = JSON.parse(atob(payloadBase64));
            if (decodedPayload.language) {
              langFromJwt = decodedPayload.language as LanguageId;
            }
          }
        } catch (error) {
          console.error('Error decoding jwt for language:', error);
        }
      }

      const saved = langFromJwt || (sessionStorage.getItem('suvidha_lang') as LanguageId);
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

      // Store selected language in jwt as requested
      try {
        const payload = { language: lang, timestamp: Date.now() };
        const jwtContent = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify(payload))}.mock_signature`;
        localStorage.setItem('jwt', jwtContent);

        // Also fire a storage event in case we want to sync across pages/tabs
        window.dispatchEvent(new Event('storage'));
      } catch (e) {
        console.error('Failed to create jwt for language', e);
      }
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
