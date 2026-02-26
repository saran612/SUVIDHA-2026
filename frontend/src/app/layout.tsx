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
      <body suppressHydrationWarning className="font-body antialiased bg-white text-foreground min-h-screen w-full overflow-x-hidden flex flex-col select-none">
        <LanguageProvider>
          <AuthProvider>
            {!isAdminPage && <KioskHeader />}

            <div className="flex-1 w-full flex items-center justify-center bg-white overflow-y-auto overflow-x-hidden">
              <main className="w-full min-h-full flex flex-col relative">
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
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
