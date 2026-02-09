'use client';

import { useEffect } from 'react';
import { logger } from '@/lib/logger';

export const KioskModeManager = () => {
  useEffect(() => {
    const enterFullscreen = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {
          // Silent catch: Browser blocks automated fullscreen until a gesture occurs.
          // This is expected standard behavior.
        });
      }
    };

    // Attempt automatic entry after 3 seconds (often blocked but worth trying if user already clicked)
    const timer = setTimeout(enterFullscreen, 3000);

    // Reliable fallback: Trigger fullscreen on the very first user interaction
    const handleGesture = () => {
      enterFullscreen();
      document.removeEventListener('click', handleGesture);
      document.removeEventListener('touchstart', handleGesture);
    };

    document.addEventListener('click', handleGesture);
    document.addEventListener('touchstart', handleGesture);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleGesture);
      document.removeEventListener('touchstart', handleGesture);
    };
  }, []);

  return null;
};
