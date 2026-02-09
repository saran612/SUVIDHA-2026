'use client';

import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Timer, AlertCircle } from 'lucide-react';

export const SessionTimeoutDialog = () => {
  const { showExtensionPrompt, extendSession, logout, dialogTimeLeft } = useAuth();
  const { t } = useLanguage();

  return (
    <AlertDialog open={showExtensionPrompt}>
      <AlertDialogContent className="max-w-2xl p-10 rounded-[1.25rem] border-4 border-[#0E6170] shadow-2xl">
        <AlertDialogHeader className="items-center text-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center animate-pulse">
            <Timer className="w-12 h-12 text-[#0E6170]" />
          </div>
          <AlertDialogTitle className="text-4xl font-black">{t('session_expired')}</AlertDialogTitle>
          <AlertDialogDescription className="text-2xl font-medium text-gray-600 leading-relaxed">
            {t('session_timeout_msg')}
          </AlertDialogDescription>

          <div className="flex items-center gap-3 bg-red-50 text-red-600 px-6 py-4 rounded-2xl border-2 border-red-100 w-full justify-center mt-4">
            <AlertCircle className="w-8 h-8" />
            <p className="text-xl font-bold">
              {t('auto_logout_in')} <span className="text-2xl font-black">{dialogTimeLeft}s</span>
            </p>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row gap-6 mt-10 justify-center sm:justify-center">
          <AlertDialogCancel 
            onClick={logout}
            className="flex-1 h-20 text-2xl font-bold rounded-2xl border-2 hover:bg-gray-100 m-0 active:scale-95 transition-transform"
          >
            {t('no_sign_out')}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={extendSession}
            className="flex-1 h-20 text-2xl font-bold rounded-2xl bg-[#0E6170] hover:bg-[#0E6170]/90 text-white m-0 shadow-lg active:scale-95 transition-transform"
          >
            {t('yes_extend')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
