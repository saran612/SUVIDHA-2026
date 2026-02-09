'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiService, BillData } from '@/lib/apiService';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, ReceiptText, History, Clock, ChevronLeft, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { logger } from '@/lib/logger';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FullKeyboard } from '@/components/kiosk/FullKeyboard';
import { formatINR } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function PayBillSearchPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [consumerNo, setConsumerNo] = useState('');
  const [existingBills, setExistingBills] = useState<BillData[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingBills, setFetchingBills] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [billViewMode, setBillViewMode] = useState<'UNPAID' | 'PAID'>('UNPAID');

  useEffect(() => {
    const identifier = user?.consumerNo || user?.mobileNo;
    if (identifier) {
      setFetchingBills(true);
      apiService.fetchUserBills(identifier)
        .then(data => setExistingBills(data))
        .catch(() => console.error('Failed to fetch existing bills'))
        .finally(() => setFetchingBills(false));
      
      if (user?.consumerNo) setConsumerNo(user.consumerNo);
    }
  }, [user]);

  const handleFetch = async () => {
    if (!consumerNo) return;
    setLoading(true);
    logger.log(`Searching for bill: ${consumerNo}`, 'ACTIVITY');
    try {
      const data = await apiService.fetchBill(consumerNo);
      router.push(`/pay-bill/${data.id}`);
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not find bill for this number.' });
    } finally {
      setLoading(false);
    }
  };

  const selectExistingBill = (selectedBill: BillData) => {
    if (selectedBill.status === 'PAID') {
      toast({ title: "Already Paid", description: "This bill has already been settled." });
      return;
    }
    router.push(`/pay-bill/${selectedBill.id}`);
  };

  const handleKeyPress = useCallback((key: string) => {
    setConsumerNo(prev => (prev.length >= 12 ? prev : prev + key));
  }, []);

  const handleDelete = useCallback(() => {
    setConsumerNo(prev => prev.slice(0, -1));
  }, []);

  const filteredBills = existingBills.filter(b => b.status === billViewMode);

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      <main className="flex-1 p-6 sm:p-12 flex flex-col overflow-hidden">
        <div className="max-w-7xl mx-auto w-full h-full flex flex-col overflow-hidden">
          <div className="flex items-center mb-8 shrink-0">
            <div className="flex items-center gap-6">
              <Button 
                className="rounded-full h-14 w-14 p-0 bg-accent hover:bg-accent/90 text-white shadow-lg shrink-0"
                onClick={() => router.push('/dashboard')}
              >
                <ChevronLeft className="w-10 h-10" />
              </Button>
              <h1 className="text-3xl sm:text-5xl font-black text-gray-900">{t('pay_bill')}</h1>
            </div>
          </div>

          <div className="flex-1 min-0 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 h-full overflow-hidden">
              <div className="flex flex-col h-full overflow-hidden">
                <h2 className="text-2xl font-black text-gray-700 mb-6 flex items-center gap-2">
                  <ReceiptText className="w-6 h-6 text-[#0E6170]" />
                  {t('manual_search')}
                </h2>
                <Card className="shadow-2xl border border-gray-200 rounded-[1.25rem] overflow-hidden flex flex-col bg-white flex-1">
                  <CardHeader className="py-8 text-center border-b bg-gray-50/50">
                    <CardTitle className="text-2xl font-black text-gray-800">{t('consumer_no')}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-10 space-y-8 flex flex-col justify-center items-center h-full">
                    <div className="space-y-4 w-full">
                      <p className="text-center text-muted-foreground font-medium">{t('tap_to_enter')}</p>
                      <div className="relative">
                        <Input 
                          value={consumerNo}
                          readOnly
                          onClick={() => setIsKeyboardOpen(true)}
                          placeholder="ENTER ID HERE"
                          className="h-24 text-4xl text-center font-black border-4 rounded-2xl bg-gray-50 focus:bg-white cursor-pointer transition-all tracking-widest text-gray-900"
                        />
                        <div className="absolute right-4 bottom-2 text-sm font-bold text-muted-foreground">
                          {consumerNo.length}/12
                        </div>
                      </div>
                    </div>
                    <Button 
                      className="w-full h-24 text-3xl font-black rounded-2xl bg-[#0E6170] text-white hover:bg-[#0E6170]/90 shadow-xl transition-transform active:scale-95"
                      onClick={handleFetch}
                      disabled={!consumerNo || loading}
                    >
                      {loading ? t('loading') : t('fetch_bill')}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col h-full overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-black text-gray-700 flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-accent" />
                    {t('your_bills')}
                  </h2>
                  <Button 
                    size="sm"
                    variant="outline"
                    className="rounded-full font-black px-8 h-12 gap-2 border-2 border-[#0E6170] text-[#0E6170] hover:bg-[#0E6170] hover:text-white transition-all shadow-md active:scale-95"
                    onClick={() => setBillViewMode(billViewMode === 'UNPAID' ? 'PAID' : 'UNPAID')}
                  >
                    {billViewMode === 'UNPAID' ? <History className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                    {billViewMode === 'UNPAID' ? t('paid_bills') : t('pending_bills')}
                  </Button>
                </div>

                <div className="flex-1 bg-white/40 rounded-[2rem] border-2 border-dashed border-gray-200 overflow-hidden">
                  <ScrollArea className="h-full w-full p-4">
                    {fetchingBills ? (
                      <div className="flex flex-col items-center justify-center h-full gap-4 py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#0E6170]"></div>
                        <p className="text-xl font-bold text-muted-foreground animate-pulse">{t('loading')}</p>
                      </div>
                    ) : filteredBills.length > 0 ? (
                      <div className="space-y-6 pr-4 pb-4">
                        {filteredBills.map((existingBill) => (
                          <Card 
                            key={existingBill.id} 
                            className={cn(
                              "group transition-all border-4 rounded-[1.5rem] shadow-md",
                              existingBill.status === 'UNPAID' 
                                ? "cursor-pointer border-transparent hover:border-[#0E6170] hover:shadow-2xl bg-white" 
                                : "border-gray-50 bg-gray-50/50 opacity-80"
                            )}
                            onClick={() => selectExistingBill(existingBill)}
                          >
                            <CardContent className="p-8 flex items-center justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <div className={cn(
                                    "w-3 h-3 rounded-full",
                                    existingBill.status === 'UNPAID' ? "bg-red-500 animate-pulse" : "bg-emerald-500"
                                  )} />
                                  <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">{existingBill.cycle}</p>
                                </div>
                                <p className="text-4xl font-black text-gray-900">{formatINR(existingBill.amount)}</p>
                                {existingBill.status === 'UNPAID' ? (
                                  <div className="flex items-center gap-2 text-sm font-bold text-destructive bg-red-50 px-3 py-1 rounded-full w-fit">
                                    <Clock className="w-4 h-4" />
                                    Due: {existingBill.dueDate}
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2 text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full w-fit">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Paid on: {existingBill.paidDate}
                                  </div>
                                )}
                              </div>
                              {existingBill.status === 'UNPAID' && (
                                <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent transition-all group-hover:rotate-45">
                                  <ArrowRight className="w-10 h-10 text-accent group-hover:text-white" />
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center p-12 space-y-4 opacity-60 min-h-[400px]">
                        <ReceiptText className="w-20 h-20 text-gray-300" />
                        <p className="text-2xl font-bold text-gray-400">
                          {billViewMode === 'UNPAID' 
                            ? "No pending bills found." 
                            : "No payment history found."}
                        </p>
                      </div>
                    )}
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
          value={consumerNo}
          placeholder={t('consumer_no')}
        />
      )}
    </div>
  );
}
