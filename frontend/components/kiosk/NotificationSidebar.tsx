'use client';

import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Bell, X, Info, CreditCard, Search, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'bill' | 'status' | 'info';
  path: string;
  timestamp: string;
}

interface NotificationSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NotificationSidebar = ({ open, onOpenChange }: NotificationSidebarProps) => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Electricity Bill Due',
      message: 'Your bill for April (₹850.50) is pending payment.',
      type: 'bill',
      path: '/pay-bill',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      title: 'Complaint Updated',
      message: 'Complaint GRV-49210 is now "In Progress".',
      type: 'status',
      path: '/status',
      timestamp: '5 hours ago'
    },
    {
      id: '3',
      title: 'Water Service Update',
      message: 'Scheduled maintenance in Ward 12 on Sunday.',
      type: 'info',
      path: '/dashboard',
      timestamp: '1 day ago'
    }
  ]);

  const dismissNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleAction = (path: string) => {
    onOpenChange(false);
    router.push(path);
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'bill': return <CreditCard className="w-6 h-6 text-blue-600" />;
      case 'status': return <Search className="w-6 h-6 text-amber-600" />;
      default: return <Info className="w-6 h-6 text-emerald-600" />;
    }
  };

  const getBg = (type: Notification['type']) => {
    switch (type) {
      case 'bill': return 'bg-blue-50';
      case 'status': return 'bg-amber-50';
      default: return 'bg-emerald-50';
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col border-l-4 border-[#0E6170]">
        <SheetHeader className="p-8 border-b bg-gray-50/50">
          <SheetTitle className="text-3xl font-black flex items-center gap-4">
            <Bell className="w-8 h-8 text-[#0E6170]" />
            Recent Alerts
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-4">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div 
                  key={n.id}
                  onClick={() => handleAction(n.path)}
                  className={cn(
                    "relative group cursor-pointer p-6 rounded-2xl border-2 border-transparent hover:border-[#0E6170]/30 transition-all shadow-sm flex gap-4 overflow-hidden",
                    getBg(n.type)
                  )}
                >
                  <div className="shrink-0 w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xl font-black text-gray-900">{n.title}</h4>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full hover:bg-red-100 hover:text-red-600"
                        onClick={(e) => dismissNotification(n.id, e)}
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                    <p className="text-gray-600 font-medium leading-tight">{n.message}</p>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{n.timestamp}</span>
                      <div className="text-[#0E6170] flex items-center gap-1 font-bold text-sm">
                        Open <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                  <Bell className="w-10 h-10 text-gray-300" />
                </div>
                <p className="text-xl font-bold text-gray-400">All caught up!</p>
                <p className="text-muted-foreground">No pending notifications to show.</p>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="p-6 border-t bg-gray-50/50">
          <Button 
            variant="outline" 
            className="w-full h-14 text-lg font-bold rounded-xl"
            onClick={() => onOpenChange(false)}
          >
            Close Panel
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
