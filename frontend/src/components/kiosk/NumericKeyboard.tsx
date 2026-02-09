'use client';

import { Button } from '@/components/ui/button';
import { Delete, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NumericKeyboardProps {
  onKeyPress: (key: string) => void;
  onDelete: () => void;
  onClear: () => void;
  className?: string;
}

export const NumericKeyboard = ({ onKeyPress, onDelete, onClear, className }: NumericKeyboardProps) => {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    <div className={cn("grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-md mx-auto", className)}>
      {keys.map((key) => (
        <Button
          key={key}
          type="button"
          variant="secondary"
          className="h-14 sm:h-20 text-2xl sm:text-3xl font-bold rounded-2xl shadow-sm hover:bg-primary hover:text-white transition-colors border-2 border-transparent active:scale-95"
          onClick={() => onKeyPress(key)}
        >
          {key}
        </Button>
      ))}
      <Button
        type="button"
        variant="outline"
        className="h-14 sm:h-20 text-sm sm:text-xl font-bold rounded-2xl border-2 hover:bg-destructive/10 hover:text-destructive"
        onClick={onClear}
      >
        <XCircle className="w-5 h-5 sm:w-8 sm:h-8 sm:mr-2" />
        <span className="hidden sm:inline">CLR</span>
        <span className="sm:hidden">C</span>
      </Button>
      <Button
        type="button"
        variant="secondary"
        className="h-14 sm:h-20 text-2xl sm:text-3xl font-bold rounded-2xl shadow-sm hover:bg-primary hover:text-white transition-colors border-2 border-transparent active:scale-95"
        onClick={() => onKeyPress('0')}
      >
        0
      </Button>
      <Button
        type="button"
        variant="outline"
        className="h-14 sm:h-20 text-sm sm:text-xl font-bold rounded-2xl border-2 hover:bg-primary/10"
        onClick={onDelete}
      >
        <Delete className="w-6 h-6 sm:w-8 sm:h-8" />
      </Button>
    </div>
  );
};
