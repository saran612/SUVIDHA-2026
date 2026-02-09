'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiService, BillData } from '@/lib/apiService';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Banknote, Smartphone, ReceiptText, ChevronLeft, Landmark, Building2, Globe, CheckCircle2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { logger } from '@/lib/logger';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatINR } from '@/lib/utils';
import { cn } from '@/lib/utils';
import Loading from '@/app/loading';

const ALL_INDIAN_BANKS = [
  { id: 'sbi', name: 'State Bank of India' },
  { id: 'hdfc', name: 'HDFC Bank' },
  { id: 'icici', name: 'ICICI Bank' },
  { id: 'axis', name: 'Axis Bank' },
  { id: 'pnb', name: 'Punjab National Bank' },
  { id: 'canara', name: 'Canara Bank' },
  { id: 'bob', name: 'Bank of Baroda' },
  { id: 'union', name: 'Union Bank of India' },
  { id: 'kotak', name: 'Kotak Mahindra Bank' },
  { id: 'indus', name: 'IndusInd Bank' },
  { id: 'idbi', name: 'IDBI Bank' },
  { id: 'yes', name: 'Yes Bank' },
  { id: 'federal', name: 'Federal Bank' },
  { id: 'central', name: 'Central Bank of India' },
  { id: 'indian', name: 'Indian Bank' },
  { id: 'uco', name: 'UCO Bank' },
  { id: 'maharashtra', name: 'Bank of Maharashtra' },
  { id: 'punjab_sind', name: 'Punjab & Sind Bank' },
  { id: 'rbl', name: 'RBL Bank' },
  { id: 'karur', name: 'Karur Vysya Bank' },
  { id: 'south_indian', name: 'South Indian Bank' },
  { id: 'dhanlaxmi', name: 'Dhanlaxmi Bank' },
  { id: 'jk', name: 'Jammu & Kashmir Bank' },
  { id: 'karnataka', name: 'Karnataka Bank' },
  { id: 'tmb', name: 'Tamilnad Mercantile Bank' },
  { id: 'city_union', name: 'City Union Bank' },
  { id: 'dcb', name: 'DCB Bank' },
  { id: 'bandhan', name: 'Bandhan Bank' },
  { id: 'idfc', name: 'IDFC FIRST Bank' },
];

export default function BillDetailPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();
  const { billId } = useParams();

  const [bill, setBill] = useState<BillData | null>(null);
  const [view, setView] = useState<'MODE' | 'BANK'>('MODE');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);

  useEffect(() => {
    if (billId) {
      apiService.fetchBill(billId as string)
        .then(data => setBill(data))
        .catch(() => {
          toast({ variant: 'destructive', title: 'Error', description: 'Bill not found.' });
          router.push('/pay-bill');
        })
        .finally(() => setLoading(false));
    }
  }, [billId, router, toast]);

  const handlePay = async (method: string) => {
    setSubmitting(true);
    logger.log(`Initiating payment for ${billId} via ${method}`, 'ACTIVITY', { amount: bill?.amount });
    const result = await apiService.initiatePayment(billId as string, method);
    if (result.success) {
      router.push(`/pay-bill/${billId}/success/${result.transactionId}`);
    }
    setSubmitting(false);
  };

  const handleBack = () => {
    if (view === 'BANK') setView('MODE');
    else router.back();
  };

  if (loading || !bill) return <Loading />;

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      <main className="flex-1 p-6 sm:p-12 flex flex-col overflow-hidden">
        <div className="max-w-7xl mx-auto w-full h-full flex flex-col overflow-hidden">
          <div className="flex items-center mb-8 shrink-0">
            <div className="flex items-center gap-6">
              <Button 
                className="rounded-full h-14 w-14 p-0 bg-accent hover:bg-accent/90 text-white shadow-lg shrink-0"
                onClick={handleBack}
              >
                <ChevronLeft className="w-10 h-10" />
              </Button>
              <h1 className="text-3xl sm:text-5xl font-black text-gray-900">
                {view === 'BANK' ? t('bank_payment') : t('bill_summary')}
              </h1>
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-hidden">
            {view === 'MODE' ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
                <Card className="lg:col-span-2 shadow-2xl border border-gray-200 rounded-[1.25rem] overflow-hidden flex flex-col bg-white h-full">
                  <CardHeader className="text-center py-8 border-b bg-gray-50/50 shrink-0">
                    <CardTitle className="text-3xl font-black text-gray-900 tracking-tight flex items-center justify-center gap-3">
                      <ReceiptText className="text-[#0E6170] w-10 h-10" />
                      {t('bill_summary')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-10 space-y-10 flex-1 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-y-10 text-3xl">
                      <div className="space-y-1">
                        <span className="text-muted-foreground font-black text-sm uppercase tracking-widest block">Citizen Name</span>
                        <span className="font-black text-gray-800">{bill.name}</span>
                      </div>
                      <div className="space-y-1 text-right">
                        <span className="text-muted-foreground font-black text-sm uppercase tracking-widest block">Billing Period</span>
                        <span className="font-black text-gray-800">{bill.cycle}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground font-black text-sm uppercase tracking-widest block">Consumer ID</span>
                        <span className="font-black text-gray-800">{bill.consumerNo}</span>
                      </div>
                      <div className="space-y-1 text-right">
                        <span className="text-muted-foreground font-black text-sm uppercase tracking-widest block">Payable By</span>
                        <span className="font-black text-destructive">{bill.dueDate}</span>
                      </div>
                    </div>
                    <div className="pt-12 border-t-8 border-dashed border-gray-100 flex justify-between items-end">
                      <div className="space-y-1">
                        <span className="text-muted-foreground font-black text-sm uppercase tracking-widest block">Total Payable Amount</span>
                        <span className="text-3xl font-black">Final Total</span>
                      </div>
                      <span className="text-7xl font-black text-[#0E6170] tracking-tighter">{formatINR(bill.amount)}</span>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex flex-col gap-6">
                  <h3 className="text-2xl font-black mb-2 flex items-center gap-2">
                    <CreditCard className="w-6 h-6" />
                    Select Payment Mode
                  </h3>
                  <Button 
                    onClick={() => setView('BANK')}
                    className="flex-1 h-32 text-3xl font-black justify-start px-8 gap-8 shadow-sm rounded-[1.25rem] border border-gray-200 hover:border-[#0E6170] bg-white text-gray-800 transition-all active:scale-95 group"
                    variant="outline"
                  >
                    <div className="h-16 w-16 rounded-2xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                      <Landmark className="w-10 h-10 text-blue-600" />
                    </div>
                    {t('bank_payment')}
                  </Button>
                  <Button 
                    onClick={() => handlePay('UPI')}
                    className="flex-1 h-32 text-3xl font-black justify-start px-8 gap-8 shadow-sm rounded-[1.25rem] border border-gray-200 hover:border-purple-500/50 bg-white text-gray-800 transition-all active:scale-95 group"
                    variant="outline"
                  >
                    <div className="h-16 w-16 rounded-2xl bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center transition-colors">
                      <Smartphone className="w-10 h-10 text-purple-600" />
                    </div>
                    {t('upi')}
                  </Button>
                  <Button 
                    onClick={() => handlePay('CASH')}
                    className="flex-1 h-32 text-3xl font-black justify-start px-8 gap-8 shadow-sm rounded-[1.25rem] border border-gray-200 hover:border-accent/50 bg-white text-gray-800 transition-all active:scale-95 group"
                    variant="outline"
                  >
                    <div className="h-16 w-16 rounded-2xl bg-accent/10 group-hover:bg-accent/20 flex items-center justify-center transition-colors">
                      <Banknote className="w-10 h-10 text-accent" />
                    </div>
                    {t('assisted_cash')}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full overflow-hidden">
                <div className="lg:col-span-2 flex flex-col overflow-hidden h-full">
                  <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
                    <Building2 className="w-7 h-7 text-[#0E6170]" />
                    {t('select_bank')}
                  </h3>
                  <div className="flex-1 bg-white rounded-[1.5rem] border border-gray-200 shadow-sm overflow-hidden p-6">
                    <ScrollArea className="h-full pr-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {ALL_INDIAN_BANKS.map((bank) => (
                          <Card 
                            key={bank.id}
                            onClick={() => setSelectedBank(bank.id)}
                            className={cn(
                              "cursor-pointer transition-all border-2 p-6 rounded-2xl flex items-center gap-4 active:scale-[0.98]",
                              selectedBank === bank.id ? "border-[#0E6170] bg-[#0E6170]/5" : "border-gray-100 hover:border-gray-200 bg-white"
                            )}
                          >
                            <div className={cn(
                              "w-12 h-12 rounded-xl flex items-center justify-center",
                              selectedBank === bank.id ? "bg-[#0E6170] text-white" : "bg-gray-50 text-gray-400"
                            )}>
                              <Landmark className="w-7 h-7" />
                            </div>
                            <span className="text-xl font-black text-gray-800">{bank.name}</span>
                            {selectedBank === bank.id && <CheckCircle2 className="ml-auto w-6 h-6 text-[#0E6170]" />}
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <h3 className="text-2xl font-black mb-2 flex items-center gap-2">
                    <CreditCard className="w-6 h-6" />
                    Payment Method
                  </h3>
                  <Button 
                    onClick={() => handlePay('CREDIT')}
                    disabled={submitting}
                    className="flex-1 h-28 text-2xl font-black justify-start px-8 gap-6 shadow-sm rounded-[1.25rem] border border-gray-200 hover:border-blue-500/50 bg-white text-gray-800 transition-all active:scale-95 group"
                    variant="outline"
                  >
                    <div className="h-14 w-14 rounded-xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                      <CreditCard className="w-8 h-8 text-blue-600" />
                    </div>
                    {t('credit_card')}
                  </Button>
                  <Button 
                    onClick={() => handlePay('DEBIT')}
                    disabled={submitting}
                    className="flex-1 h-28 text-2xl font-black justify-start px-8 gap-6 shadow-sm rounded-[1.25rem] border border-gray-200 hover:border-emerald-500/50 bg-white text-gray-800 transition-all active:scale-95 group"
                    variant="outline"
                  >
                    <div className="h-14 w-14 rounded-xl bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center transition-colors">
                      <CreditCard className="w-8 h-8 text-emerald-600" />
                    </div>
                    {t('debit_card')}
                  </Button>
                  <Button 
                    onClick={() => handlePay('NETBANKING')}
                    disabled={!selectedBank || submitting}
                    className="flex-1 h-28 text-2xl font-black justify-start px-8 gap-6 shadow-sm rounded-[1.25rem] border border-gray-200 hover:border-amber-500/50 bg-white text-gray-800 transition-all active:scale-95 group"
                    variant="outline"
                  >
                    <div className="h-14 w-14 rounded-xl bg-amber-50 group-hover:bg-amber-100 flex items-center justify-center transition-colors">
                      <Globe className="w-8 h-8 text-amber-600" />
                    </div>
                    Online Payment
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
