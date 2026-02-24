'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

interface VoiceInstructionProps {
  text: string;
}

/**
 * VoiceInstruction component to provide audio help text.
 * Uses native Web Speech API (Mozilla/Browser native TTS)
 * to avoid AI quota limits or server latency.
 */
export const VoiceInstruction = ({ text }: VoiceInstructionProps) => {
  const { audioEnabled } = useAuth();
  const { language } = useLanguage();
  const lastSpokenText = useRef<string | null>(null);

  useEffect(() => {
    // Return early if disabled or same text
    if (!audioEnabled || !text || lastSpokenText.current === text) return;

    if ('speechSynthesis' in window) {
      // Map frontend lang models to BCP-47 identifiers broadly supported by native TTS
      // Using Mozilla/Web Speech API format
      const langMapping: Record<string, string> = {
        en: 'en-IN',
        hi: 'hi-IN',
        bn: 'bn-IN',
        te: 'te-IN',
        mr: 'mr-IN',
        ta: 'ta-IN',
        ur: 'ur-PK',
        gu: 'gu-IN',
        kn: 'kn-IN',
        ml: 'ml-IN',
        or: 'or-IN',
        pa: 'pa-IN',
        as: 'as-IN',
        ne: 'ne-NP',
        sa: 'sa-IN'
      };

      const speechLang = langMapping[language] || 'en-IN';

      const playVoice = () => {
        // Cancel any currently playing speech to prevent overlap
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = speechLang;
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        utterance.onerror = (e) => {
          console.warn('Speech synthesis error:', e);
        };

        window.speechSynthesis.speak(utterance);
        lastSpokenText.current = text;
      };

      // Handle browser autoplay policy restrictions
      try {
        playVoice();
      } catch (e) {
        console.warn('Voice playback block bypassed, waiting for interaction...', e);
      }
    } else {
      console.warn('Text-to-speech not supported in this browser.');
    }

    return () => {
      // Clean up when unmounting
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [text, audioEnabled, language]);

  return null; // Native TTS handles audio via OS, no audio element required
};
