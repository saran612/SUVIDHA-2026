'use client';

import { useAuth } from '@/context/AuthContext';
import { IdleSlideshow } from './IdleSlideshow';

export const GlobalIdleSlideshow = () => {
  const { isIdle, setIsIdle } = useAuth();

  if (!isIdle) return null;

  return (
    <IdleSlideshow onDismiss={() => setIsIdle(false)} />
  );
};
