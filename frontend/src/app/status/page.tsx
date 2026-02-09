'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiService } from '@/lib/apiService';
import { Search, CheckCircle2, Clock, ChevronLeft, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function StatusPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { toast } = useToast();

  const [refId, setRefId] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async () => {
    if (!refId) return;
    setLoading(true);
    const res = await apiService.trackStatus(refId);
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-6 mb-10">
            <Button 
              className="rounded-full h-14 w-14 p-0 bg-accent hover:bg-accent/90 text-white shadow-lg shrink-0"
              onClick={() => router.push('/dashboard')}
            >
              <ChevronLeft className="w-10 h-10" />
            </Button>
            <h1 className="text-4xl font-bold">{t('track_status')}</h1>
          </div>

          {!data ? (
            <Card className="shadow-2xl">
              <CardHeader className="py-10 text-center">
                <CardTitle className="text-3xl">{t('tracking_id')}</CardTitle>
              </CardHeader>
              <CardContent className="px-12 pb-16 space-y-8">
                <div className="space-y-4">
                  <Input 
                    value={refId}
                    onChange={(e) => setRefId(e.target.value.toUpperCase())}
                    placeholder="e.g. NC-123456 or GRV-123456"
                    className="h-24 text-4xl text-center font-mono font-bold border-4 rounded-2xl"
                  />
                  <p className="text-center text-muted-foreground">Enter your application or grievance reference number</p>
                </div>
                <Button 
                  className="w-full h-24 text-3xl font-bold rounded-2xl bg-[#0E6170] text-white hover:bg-[#0E6170]/90 shadow-xl gap-4"
                  onClick={handleTrack}
                  disabled={!refId || loading}
                >
                  <Search className="w-8 h-8" />
                  {loading ? t('loading') : 'Track Now'}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card className="shadow-xl border-l-8 border-primary overflow-hidden">
                <CardContent className="p-10 flex items-center justify-between">
                  <div>
                    <p className="text-xl text-muted-foreground mb-1 uppercase tracking-widest">Current Status</p>
                    <h3 className="text-5xl font-black text-primary">{data.status.replace(/_/g, ' ')}</h3>
                    <p className="text-lg font-bold text-muted-foreground mt-2">ID: {refId}</p>
                  </div>
                  <div className="bg-primary/10 p-6 rounded-full">
                    <Clock className="w-16 h-16 text-primary animate-pulse" />
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <h3 className="text-3xl font-bold flex items-center gap-3">
                  <AlertCircle className="w-8 h-8 text-primary" />
                  Timeline History
                </h3>
                <div className="space-y-6 relative ml-6">
                  <div className="absolute left-6 top-0 bottom-0 w-1 bg-gray-100 -z-10" />
                  {data.updates.map((update: any, idx: number) => (
                    <div key={idx} className="flex gap-8 items-start">
                      <div className="bg-[#0E6170] p-4 rounded-full shadow-lg shrink-0 relative z-10">
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      </div>
                      <Card className="flex-1 p-8 shadow-md border-none">
                        <p className="text-2xl font-bold text-gray-800">{update.message}</p>
                        <p className="text-xl text-muted-foreground font-medium mt-1">{update.date}</p>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-12 grid grid-cols-2 gap-6">
                <Button 
                  className="h-24 text-3xl font-bold rounded-2xl shadow-xl bg-gray-100 text-gray-800 hover:bg-gray-200"
                  onClick={() => setData(null)}
                >
                  New Track
                </Button>
                <Button 
                  className="h-24 text-3xl font-bold rounded-2xl shadow-xl bg-[#0E6170] text-white hover:bg-[#0E6170]/90"
                  onClick={() => router.push('/dashboard')}
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
