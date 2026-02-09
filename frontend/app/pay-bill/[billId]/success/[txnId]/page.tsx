'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Printer } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { formatINR } from '@/lib/utils';
import { apiService, BillData } from '@/lib/apiService';
import { useToast } from '@/hooks/use-toast';
import Loading from '@/app/loading';

export default function PaymentSuccessPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { billId, txnId } = useParams();
  const { toast } = useToast();
  
  const [bill, setBill] = useState<BillData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (billId) {
      apiService.fetchBill(billId as string)
        .then(data => setBill(data))
        .finally(() => setLoading(false));
    }
  }, [billId]);

  if (loading) return <Loading />;

  return (
    <div className="h-full flex flex-col bg-background p-6 sm:p-12 overflow-hidden items-center justify-center">
      <Card className="text-center shadow-2xl border border-gray-200 rounded-[1.25rem] overflow-hidden max-w-4xl w-full bg-white">
        <div className="bg-accent p-16 flex flex-col items-center shrink-0">
          <div className="h-40 w-40 rounded-full bg-white/20 flex items-center justify-center mb-8">
            <CheckCircle2 className="w-24 h-24 text-white animate-bounce" />
          </div>
          <h2 className="text-6xl font-black text-white">{t('success')}</h2>
          <p className="text-xl text-white/80 font-bold mt-4">Transaction Completed Successfully</p>
        </div>
        <CardContent className="p-16 space-y-12 bg-white overflow-y-auto">
          <div className="space-y-4">
            <p className="text-xl font-black text-muted-foreground uppercase tracking-[0.3em]">Official Receipt ID</p>
            <p className="text-6xl font-mono font-black text-[#0E6170] bg-gray-50 py-10 rounded-[2rem] border-4 border-dashed border-[#0E6170]/20">{txnId}</p>
            {bill && (
              <p className="text-4xl font-black text-gray-800 mt-6">
                Amount Paid: <span className="text-[#0E6170]">{formatINR(bill.amount)}</span>
              </p>
            )}
          </div>
          <p className="text-2xl font-bold text-gray-500 max-w-2xl mx-auto leading-relaxed">Your payment has been logged in the smart city registry. Please collect your printed receipt from the tray below.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mt-12">
            <Button 
              className="h-28 text-3xl font-black gap-4 rounded-[2rem] shadow-xl border-4 border-gray-100 hover:bg-gray-50 bg-white text-gray-900" 
              variant="outline"
              onClick={() => {
                toast({ title: "Printing...", description: "Your receipt is being printed." });
              }}
            >
              <Printer className="w-12 h-12 text-[#0E6170]" />
              {t('print')}
            </Button>
            <Button 
              className="h-28 text-3xl font-black rounded-[2rem] shadow-2xl bg-[#0E6170] text-white hover:bg-[#0E6170]/90"
              onClick={() => router.push('/dashboard')}
            >
              Finish Process
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
