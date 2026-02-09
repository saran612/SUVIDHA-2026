
'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, FileWarning, Search, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Loading from '@/app/loading';
import { VoiceInstruction } from '@/components/kiosk/VoiceInstruction';

export default function Dashboard() {
  const { t } = useLanguage();
  const router = useRouter();
  const [navigating, setNavigating] = useState(false);

  const menuItems = [
    {
      id: 'new-connection',
      title: t('apply_new_connection'),
      icon: PlusCircle,
      color: 'bg-emerald-600',
      path: '/new-connection'
    },
    {
      id: 'pay',
      title: t('pay_bill'),
      icon: CreditCard,
      color: 'bg-indigo-600',
      path: '/pay-bill'
    },
    {
      id: 'status',
      title: t('track_status'),
      icon: Search,
      color: 'bg-amber-500',
      path: '/status'
    },
    {
      id: 'grievance',
      title: t('register_complaint'),
      icon: FileWarning,
      color: 'bg-rose-600',
      path: '/grievance'
    },
  ];

  const handleNavigate = (path: string) => {
    if (path === '/dashboard' && window.location.pathname === '/dashboard') return;
    
    setNavigating(true);
    setTimeout(() => {
      router.push(path);
    }, 150); 
  };

  if (navigating) return <Loading />;

  return (
    <div className="h-full flex flex-col bg-[#F8FAFB] overflow-hidden">
      <VoiceInstruction text="Welcome to your dashboard. You can pay bills, apply for new utility connections, or track your submitted requests by tapping the cards on the screen." />
      <main className="flex-1 p-6 sm:p-12 flex flex-col justify-center overflow-hidden">
        <div className="max-w-7xl mx-auto w-full">
          <h1 className="text-3xl sm:text-5xl font-black mb-8 sm:mb-12 text-center text-gray-900">{t('welcome')}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
            {menuItems.map((item) => (
              <Card 
                key={item.id}
                onClick={() => handleNavigate(item.path)}
                className="group cursor-pointer hover:shadow-2xl transition-all border-none overflow-hidden min-h-[140px] sm:h-64 bg-white rounded-[1.25rem]"
              >
                <CardContent className="p-0 h-full flex flex-row">
                  <div className={`${item.color} w-32 sm:w-48 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0`}>
                    <item.icon className="w-12 h-12 sm:w-24 sm:h-24 text-white" />
                  </div>
                  <div className="flex-1 flex items-center px-6 sm:px-10">
                    <span className="text-xl sm:text-3xl font-black text-gray-800 group-hover:text-[#0E6170] transition-colors">{item.title}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <footer className="p-6 sm:p-8 text-center text-muted-foreground border-t bg-white shrink-0">
        <p className="text-base sm:text-lg font-medium">{t('footer_belongings')}</p>
      </footer>
    </div>
  );
}
