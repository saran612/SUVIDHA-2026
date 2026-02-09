
'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { speakInstruction } from '@/ai/flows/tts-flow';

interface VoiceInstructionProps {
  text: string;
}

/**
 * VoiceInstruction component to provide audio help text.
 * Temporarily disabled while keeping the logic in place.
 */
export const VoiceInstruction = ({ text }: VoiceInstructionProps) => {
  // --- TEMPORARILY DISABLED ---
  const isDisabled = true;
  // -----------------------------

  const { audioEnabled } = useAuth();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const lastSpokenText = useRef<string | null>(null);

  useEffect(() => {
    if (isDisabled) return;
    
    // Reset and fetch if text changes or audio is re-enabled
    if (!audioEnabled || lastSpokenText.current === text) return;

    const fetchAudio = async () => {
      try {
        const result = await speakInstruction(text);
        if (result && result.media) {
          setAudioUrl(result.media);
          lastSpokenText.current = text;
        }
      } catch (error) {
        console.error('Failed to generate voice instruction', error);
      }
    };

    fetchAudio();
  }, [text, audioEnabled, isDisabled]);

  useEffect(() => {
    if (isDisabled) return;

    if (audioUrl && audioRef.current) {
      const playAudio = () => {
        if (!audioRef.current) return;
        
        audioRef.current.play().catch(e => {
          console.warn('Voice playback blocked, waiting for user interaction', e);
          
          // Fallback: If blocked, wait for the first click anywhere on the page to trigger playback
          const playOnInteraction = () => {
            audioRef.current?.play().catch(() => {});
            document.removeEventListener('click', playOnInteraction);
            document.removeEventListener('touchstart', playOnInteraction);
          };
          
          document.addEventListener('click', playOnInteraction);
          document.addEventListener('touchstart', playOnInteraction);
        });
      };
      
      playAudio();
    }
  }, [audioUrl, isDisabled]);

  if (isDisabled || !audioEnabled || !audioUrl) return null;

  return (
    <audio 
      ref={audioRef} 
      src={audioUrl} 
      className="hidden" 
      autoPlay={false}
      controls={false}
    />
  );
};
