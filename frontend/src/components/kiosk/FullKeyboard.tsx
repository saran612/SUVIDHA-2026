'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Delete, X, Space, ChevronUp, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

interface FullKeyboardProps {
  onKeyPress: (key: string) => void;
  onDelete: () => void;
  onClose: () => void;
  value: string;
  placeholder?: string;
  className?: string;
  maxLength?: number;
  onSubmit?: () => void;
  submitLabel?: string;
}

export const FullKeyboard = ({ onKeyPress, onDelete, onClose, value, placeholder, className, maxLength = 12, onSubmit, submitLabel }: FullKeyboardProps) => {
  const { t } = useLanguage();
  const [isShift, setIsShift] = useState(true);

  const rows = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['SHIFT', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
    ['CLOSE', 'SPACE', 'DONE']
  ];

  const handleKeyClick = (key: string) => {
    if (key === 'SHIFT') {
      setIsShift(!isShift);
    } else if (key === 'BACKSPACE') {
      onDelete();
    } else if (key === 'CLOSE') {
      onClose();
    } else if (key === 'DONE') {
      if (onSubmit) {
        onSubmit();
      } else {
        onClose();
      }
    } else if (key === 'SPACE') {
      onKeyPress(' ');
    } else {
      onKeyPress(isShift ? key.toUpperCase() : key.toLowerCase());
    }
  };

  return (
    <div className={cn("fixed inset-x-0 bottom-0 bg-white/95 backdrop-blur-xl border-t-4 border-[#0E6170] p-6 shadow-[0_-20px_50px_rgba(0,0,0,0.2)] z-[100] animate-in slide-in-from-bottom duration-300 print:hidden", className)}>
      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        <div className="mb-4">
          <div className="bg-gray-50 border-[3px] border-[#E2E8F0] rounded-2xl p-4 sm:p-5 relative flex items-center shadow-inner h-[100px] sm:h-[130px] overflow-hidden">
            <div className={cn(
              "h-full w-full pr-28 overflow-y-auto font-black no-scrollbar",
              maxLength > 50 ? "text-left text-2xl sm:text-[1.75rem] leading-snug break-words whitespace-pre-wrap" : "text-center text-4xl sm:text-5xl tracking-widest whitespace-nowrap flex items-center justify-center",
              value ? "text-gray-900" : "text-gray-300"
            )}>
              <div>
                {value || placeholder || t('type_here')}
                {value.length < maxLength && <span className="inline-block w-1.5 h-[1.1em] bg-[#0E6170] ml-1.5 -mb-1 animate-pulse align-baseline shadow-sm" />}
              </div>
            </div>
            <div className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 text-base sm:text-lg font-black text-muted-foreground bg-white px-3 sm:px-4 py-2 border-2 border-gray-200 rounded-xl shadow-md z-10 flex gap-1">
              <span className="text-gray-900">{value.length}</span>
              <span className="text-gray-300">/</span>
              <span>{maxLength}</span>
            </div>
          </div>
        </div>

        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-2">
            {row.map((key) => {
              const isSpecial = ['SHIFT', 'BACKSPACE', 'CLOSE', 'SPACE', 'DONE'].includes(key);
              const isDisabled = !isSpecial && value.length >= maxLength;

              return (
                <Button
                  key={key}
                  type="button"
                  disabled={isDisabled}
                  onClick={(e) => {
                    e.preventDefault();
                    handleKeyClick(key);
                  }}
                  className={cn(
                    "h-16 sm:h-20 text-2xl font-bold rounded-xl transition-all active:scale-95 shadow-md",
                    key === 'SPACE' ? "flex-[4]" : "flex-1",
                    key === 'DONE' ? "bg-emerald-600 hover:bg-emerald-700 text-white flex-[1.5]" :
                      key === 'CLOSE' ? "bg-red-500 hover:bg-red-600 text-white border-none" :
                        isSpecial ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-white text-gray-900 border-2 border-gray-50 hover:border-[#0E6170]/30 hover:bg-gray-50",
                    isDisabled && "opacity-50 grayscale"
                  )}
                >
                  {key === 'BACKSPACE' && <Delete className="w-8 h-8" />}
                  {key === 'SHIFT' && <ChevronUp className={cn("w-8 h-8", isShift && "text-[#0E6170]")} />}
                  {key === 'SPACE' && <Space className="w-8 h-8" />}
                  {key === 'CLOSE' && <X className="w-8 h-8 mr-2" />}
                  {key === 'DONE' && <Check className="w-8 h-8 mr-2" />}
                  {!['BACKSPACE', 'SHIFT', 'SPACE', 'CLOSE', 'DONE'].includes(key) && (isShift ? key.toUpperCase() : key.toLowerCase())}
                  {key === 'CLOSE' && t('cancel')}
                  {key === 'DONE' && (submitLabel || t('done'))}
                </Button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
