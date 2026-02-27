'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiService } from '@/lib/apiService';
import { Search, CheckCircle2, Clock, ChevronLeft, AlertCircle, Zap, Wrench, History, FileText, Check, MapPin, Headset } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { FullKeyboard } from '@/components/kiosk/FullKeyboard';
import { logger } from '@/lib/logger';

// MOCK Data for recent fallback requests
const defaultRecentRequests = [
  { id: 'NC-982341', type: 'New Connection', category: 'Electricity', date: '25 Feb 2026', status: 'IN_PROGRESS', icon: Zap, bg: 'bg-amber-50', color: 'text-amber-500' },
  { id: 'GRV-409123', type: 'Complaint', category: 'Water leakage', date: '22 Feb 2026', status: 'RESOLVED', icon: AlertCircle, bg: 'bg-rose-50', color: 'text-rose-500' },
  { id: 'SRV-551230', type: 'Service Request', category: 'Meter Testing', date: '15 Feb 2026', status: 'PENDING', icon: Wrench, bg: 'bg-indigo-50', color: 'text-indigo-500' },
];

const iconMap: Record<string, any> = {
  Zap,
  AlertCircle,
  Wrench
};

export default function StatusPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { toast } = useToast();

  const [refId, setRefId] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [recentList, setRecentList] = useState<any[]>(defaultRecentRequests);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = JSON.parse(localStorage.getItem('suvidha_requests') || '[]');
      if (stored && stored.length > 0) {
        // map icons back from string memory names
        const enriched = stored.map((r: any) => ({
          ...r,
          icon: iconMap[r.iconName] || Zap
        }));
        setRecentList([...enriched, ...defaultRecentRequests]);
      }
    }
  }, []);

  const handleTrack = async (trackId?: string) => {
    const idToTrack = typeof trackId === 'string' ? trackId : refId;
    if (!idToTrack) return;
    setLoading(true);
    setRefId(idToTrack); // sync refId if explicitly clicking a trackable
    const res = await apiService.trackStatus(idToTrack);
    if (res) {
      setData(res);
    } else {
      toast({
        variant: 'destructive',
        title: 'Not Found',
        description: 'No request found with this reference number.'
      });
    }
    setLoading(false);
  };

  const handleKeyPress = (key: string) => {
    setRefId((prev) => (prev.length >= 15 ? prev : prev + key));
  };

  const handleDelete = () => {
    setRefId((prev) => prev.slice(0, -1));
  };

  const handleHelpClick = () => {
    toast({
      title: 'Connecting to Support...',
      description: 'An assisted help representative will be with you shortly.',
    });
    logger.log('Assisted central support requested', 'ACTIVITY');
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <main className="flex-1 p-6 sm:p-12 flex flex-col min-h-0">
        <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
          <div className="flex items-center gap-6 mb-8 shrink-0">
            <Button
              className="rounded-full h-14 w-14 p-0 bg-accent hover:bg-accent/90 text-white shadow-lg shrink-0"
              onClick={() => router.push('/dashboard')}
            >
              <ChevronLeft className="w-10 h-10" />
            </Button>
            <h1 className="text-3xl sm:text-5xl font-black text-gray-900">{t('track_status')}</h1>
          </div>

          <div className="flex-1 min-h-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 h-full">
              {/* Left Column: Search & Result */}
              <div className="flex flex-col h-full">
                <h2 className="text-2xl font-black text-gray-700 mb-6 flex items-center gap-2">
                  <Search className="w-6 h-6 text-[#0E6170]" />
                  {t('tracking_id')}
                </h2>

                {!data ? (
                  <Card className="shadow-2xl border border-gray-200 rounded-[1.25rem] overflow-hidden flex flex-col bg-white flex-1">
                    <CardContent className="p-10 space-y-8 flex flex-col justify-center items-center h-full">
                      <div className="space-y-4 w-full">
                        <p className="text-center text-muted-foreground font-medium">Enter your application or grievance reference number</p>
                        <Input
                          value={refId}
                          readOnly
                          onClick={() => setIsKeyboardOpen(true)}
                          placeholder="e.g. NC-123456"
                          className="h-24 text-3xl sm:text-4xl text-center font-mono font-black border-4 rounded-2xl bg-gray-50 focus:bg-white cursor-pointer transition-all tracking-wider text-gray-900"
                        />
                      </div>
                      <Button
                        className="w-full h-24 text-3xl font-black rounded-2xl bg-[#0E6170] text-white hover:bg-[#0E6170]/90 shadow-xl transition-transform active:scale-95 gap-4"
                        onClick={() => handleTrack()}
                        disabled={!refId || loading}
                      >
                        <Search className="w-8 h-8" />
                        {loading ? t('loading') : 'Track Now'}
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="shadow-xl border border-gray-100 rounded-[1.5rem] overflow-hidden flex flex-col bg-white flex-1 relative">
                    <CardContent className="p-6 sm:p-8 space-y-6 flex-1 flex flex-col overflow-hidden">
                      {/* Header from design */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-6">
                        <div>
                          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Application Status</h2>
                          <p className="text-sm font-medium text-gray-500 mt-1">Track the progress of your utility connection request below.</p>
                        </div>
                        <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-bold text-sm tracking-widest shrink-0 uppercase">
                          REF: {refId}
                        </div>
                      </div>

                      {/* Vertical Timeline */}
                      <div className="py-4 flex-1">
                        {(refId.startsWith('GRV') || data?.type === 'Complaint' || data?.type === 'Grievance') ? (
                          <>
                            {/* Grievance Step 1: Complaint Submitted */}
                            <div className="relative flex items-start gap-6 pb-12">
                              <div className="absolute left-[19px] top-10 bottom-0 w-[2px] bg-green-200 z-0"></div>
                              <div className="relative w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0 z-10 shadow-sm border-2 border-white">
                                <Check className="w-5 h-5 text-green-600" />
                              </div>
                              <div className="pt-1">
                                <h3 className="text-xl font-bold text-gray-900">Complaint Submitted</h3>
                                <p className="text-gray-500 text-sm font-medium mt-1 mb-3">Your grievance was successfully recorded.</p>
                                <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-bold">Completed on Feb 10, 2026</span>
                              </div>
                            </div>

                            {/* Grievance Step 2: Field Visit Pending (In Progress) */}
                            <div className="relative flex items-start gap-6 pb-12">
                              <div className="absolute left-[19px] top-14 bottom-0 w-[2px] bg-gray-200 z-0"></div>
                              <div className="relative w-10 h-10 flex items-center justify-center shrink-0 z-10">
                                <div className="absolute w-[56px] h-[56px] rounded-full bg-blue-50 flex items-center justify-center border-[6px] border-white shadow-sm ring-1 ring-gray-100/50">
                                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
                                    <MapPin className="w-5 h-5 text-white" />
                                  </div>
                                </div>
                              </div>
                              <div className="pt-1 pl-2">
                                <div className="flex items-center gap-3">
                                  <h3 className="text-xl font-bold text-blue-600">Field Visit</h3>
                                  <span className="bg-blue-400 text-white px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider shadow-sm uppercase">In Progress</span>
                                </div>
                                <p className="text-gray-700 text-sm mt-1 mb-2 font-semibold">An officer will visit your location to inspect the issue.</p>
                                <p className="text-sm text-gray-500"><span className="text-gray-400 font-medium">Expected Date:</span> <span className="font-bold text-gray-900">Feb 27 - Mar 01</span></p>
                              </div>
                            </div>

                            {/* Grievance Step 3: Problem Rectified (Pending) */}
                            <div className="relative flex items-start gap-6">
                              <div className="relative w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0 z-10 border-2 border-white">
                                <Wrench className="w-4 h-4 text-gray-400" />
                              </div>
                              <div className="pt-1 opacity-60">
                                <h3 className="text-xl font-bold text-gray-400">Problem Rectified</h3>
                                <p className="text-gray-400 text-sm font-medium mt-1 mb-3">The issue will be marked as resolved upon successful field visit.</p>
                                <span className="bg-gray-50 text-gray-400 border border-gray-200 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">Pending</span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            {/* Step 1: Application Submitted */}
                            <div className="relative flex items-start gap-6 pb-12">
                              <div className="absolute left-[19px] top-10 bottom-0 w-[2px] bg-green-200 z-0"></div>
                              <div className="relative w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0 z-10 shadow-sm border-2 border-white">
                                <Check className="w-5 h-5 text-green-600" />
                              </div>
                              <div className="pt-1">
                                <h3 className="text-xl font-bold text-gray-900">Application Submitted</h3>
                                <p className="text-gray-500 text-sm font-medium mt-1 mb-3">Your application was successfully received.</p>
                                <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-bold">Completed on Feb 10, 2026</span>
                              </div>
                            </div>

                            {/* Step 2: Documents Verified */}
                            <div className="relative flex items-start gap-6 pb-12">
                              <div className="absolute left-[19px] top-10 bottom-0 w-[2px] bg-green-200 z-0"></div>
                              <div className="relative w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0 z-10 shadow-sm border-2 border-white">
                                <Check className="w-5 h-5 text-green-600" />
                              </div>
                              <div className="pt-1">
                                <h3 className="text-xl font-bold text-gray-900">Documents Verified</h3>
                                <p className="text-gray-500 text-sm font-medium mt-1 mb-3">All uploaded documents have been verified by the officer.</p>
                                <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-bold">Completed on Feb 12, 2026</span>
                              </div>
                            </div>

                            {/* Step 3: Field Visit Pending (In Progress) */}
                            <div className="relative flex items-start gap-6 pb-12">
                              <div className="absolute left-[19px] top-14 bottom-0 w-[2px] bg-gray-200 z-0"></div>
                              <div className="relative w-10 h-10 flex items-center justify-center shrink-0 z-10">
                                <div className="absolute w-[56px] h-[56px] rounded-full bg-blue-50 flex items-center justify-center border-[6px] border-white shadow-sm ring-1 ring-gray-100/50">
                                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
                                    <MapPin className="w-5 h-5 text-white" />
                                  </div>
                                </div>
                              </div>
                              <div className="pt-1 pl-2">
                                <div className="flex items-center gap-3">
                                  <h3 className="text-xl font-bold text-blue-600">Field Visit Pending</h3>
                                  <span className="bg-blue-400 text-white px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider shadow-sm uppercase">In Progress</span>
                                </div>
                                <p className="text-gray-700 text-sm mt-1 mb-2 font-semibold">An officer will visit your premises for inspection.</p>
                                <p className="text-sm text-gray-500"><span className="text-gray-400 font-medium">Expected Date:</span> <span className="font-bold text-gray-900">Feb 27 - Mar 01</span></p>
                              </div>
                            </div>

                            {/* Step 4: Connection Activation (Pending) */}
                            <div className="relative flex items-start gap-6">
                              <div className="relative w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0 z-10 border-2 border-white">
                                <Zap className="w-4 h-4 text-gray-400 fill-gray-400" />
                              </div>
                              <div className="pt-1 opacity-60">
                                <h3 className="text-xl font-bold text-gray-400">Connection Activation</h3>
                                <p className="text-gray-400 text-sm font-medium mt-1 mb-3">Final connection will be activated after successful field visit.</p>
                                <span className="bg-gray-50 text-gray-400 border border-gray-200 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">Pending</span>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>

                    <div className="p-4 bg-white grid grid-cols-2 gap-4 shrink-0 mx-4 border-t border-gray-100">
                      <Button
                        variant="outline"
                        className="h-14 text-lg font-bold rounded-full shadow-sm bg-white text-gray-800 hover:bg-gray-50 border-gray-200"
                        onClick={() => { setData(null); setRefId(''); }}
                      >
                        Search Again
                      </Button>
                      <Button
                        className="h-14 text-lg font-bold rounded-full shadow-md bg-white text-gray-900 border-2 border-gray-100 hover:bg-gray-50 gap-2"
                        onClick={handleHelpClick}
                      >
                        <Headset className="w-5 h-5 text-blue-600" />
                        Talk to an officer
                      </Button>
                    </div>
                  </Card>
                )}
              </div>

              {/* Right Column: Trackables List */}
              <div className="flex flex-col h-full mt-8 lg:mt-0">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-black text-gray-700 flex items-center gap-2">
                    <History className="w-6 h-6 text-accent" />
                    Recent Requests
                  </h2>
                </div>

                <div className="flex-1 bg-white/40 rounded-[2rem] border-2 border-dashed border-gray-200 overflow-hidden">
                  <ScrollArea className="h-full w-full p-4 sm:p-6">
                    <div className="space-y-6 pr-4 pb-4">
                      {recentList.map((req) => (
                        <Card
                          key={req.id}
                          className="cursor-pointer transition-all border-4 border-transparent hover:border-[#0E6170] hover:shadow-2xl rounded-[1.5rem] bg-white group active:scale-[0.98]"
                          onClick={() => handleTrack(req.id)}
                        >
                          <CardContent className="p-6 sm:p-8 flex items-center gap-6">
                            <div className={cn("w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110", req.bg)}>
                              <req.icon className={cn("w-8 h-8 sm:w-10 sm:h-10", req.color)} />
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex justify-between items-start">
                                <p className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">{req.type}</p>
                                <span className={cn(
                                  "text-xs font-black px-3 py-1 rounded-full whitespace-nowrap mt-1",
                                  req.status === 'RESOLVED' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                                )}>
                                  {req.status.replace('_', ' ')}
                                </span>
                              </div>
                              <p className="text-base font-bold text-gray-500">{req.category}</p>
                              <div className="flex items-center gap-3 pt-2">
                                <p className="text-sm font-bold text-gray-400 font-mono bg-gray-100 px-2 py-1 rounded">{req.id}</p>
                                <p className="text-sm font-bold text-gray-400">{req.date}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {isKeyboardOpen && (
        <FullKeyboard
          onKeyPress={handleKeyPress}
          onDelete={handleDelete}
          onClose={() => setIsKeyboardOpen(false)}
          value={refId}
          placeholder="Enter Tracking ID"
        />
      )}
    </div>
  );
}
