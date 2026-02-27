'use client';

import type { Metadata, Viewport } from 'next';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { KioskHeader } from '@/components/kiosk/KioskHeader';
import { SessionTimeoutDialog } from '@/components/kiosk/SessionTimeoutDialog';
import { KioskModeManager } from '@/components/kiosk/KioskModeManager';
import { GlobalIdleSlideshow } from '@/components/kiosk/GlobalIdleSlideshow';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

function ScaleController() {
  useEffect(() => {
    const calc = () => {
      // Adjust UI scaling dynamically based ONLY on screen height relative to 1080p design max
      const scale = window.innerHeight / 1080;
      const el = document.getElementById('app-wrapper');
      if (el) {
        // Applying zoom gracefully scales text/rendering while keeping width responsive (w-full)
        (el as any).style.zoom = scale;
      }
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);
  return null;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admindashboard');

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <meta name="mobile-web-app-capable" content="yes" />
        <title>SUVIDHA Kiosk - Smart Urban Virtual Interactive Digital Helpdesk Assistant</title>
        <meta name="description" content="A government-grade smart city kiosk for easy urban services." />
      </head>
      <body suppressHydrationWarning className="font-body antialiased bg-gray-900 text-foreground w-screen h-screen flex items-center justify-center overflow-auto select-none">
        <LanguageProvider>
          <AuthProvider>
            <div
              id="app-wrapper"
              className="bg-white flex flex-col relative w-full h-full shadow-2xl print:w-auto print:h-auto overflow-auto"
            >
              <ScaleController />
              {!isAdminPage && <KioskHeader />}

              <div className="flex-1 w-full flex bg-white overflow-y-auto print:overflow-visible">
                <main className="w-full h-full flex flex-col relative print:h-auto overflow-y-auto">
                  {children}
                </main>
              </div>
              {!isAdminPage && (
                <>
                  <KioskModeManager />
                  <SessionTimeoutDialog />
                  <GlobalIdleSlideshow />
                </>
              )}
              <Toaster />
            </div>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
