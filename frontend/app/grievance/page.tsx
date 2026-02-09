'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiService } from '@/lib/apiService';
import { Send, CheckCircle2, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function GrievancePage() {
  const { t } = useLanguage();
  const router = useRouter();

  const [type, setType] = useState('');
  const [desc, setDesc] = useState('');
  const [refId, setRefId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await apiService.submitGrievance(type, desc);
    setRefId(res.referenceId);
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
            <h1 className="text-4xl font-bold">{t('register_complaint')}</h1>
          </div>

          {!refId ? (
            <Card className="shadow-2xl">
              <CardHeader className="py-10 bg-secondary/30 border-b">
                <CardTitle className="text-3xl text-center">{t('grievance_form')}</CardTitle>
              </CardHeader>
              <CardContent className="p-12 space-y-10">
                <div className="space-y-4">
                  <label className="text-2xl font-bold">{t('complaint_type')}</label>
                  <span className="block text-sm text-muted-foreground">Choose the appropriate category for your issue</span>
                  <Select onValueChange={setType}>
                    <SelectTrigger className="h-20 text-2xl rounded-xl border-2">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="water" className="text-xl py-4">Water Supply Issue</SelectItem>
                      <SelectItem value="electricity" className="text-xl py-4">Street Light Failure</SelectItem>
                      <SelectItem value="waste" className="text-xl py-4">Garbage Collection</SelectItem>
                      <SelectItem value="road" className="text-xl py-4">Pothole Repair</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <label className="text-2xl font-bold">{t('description')}</label>
                  <Textarea 
                    placeholder="Briefly describe the issue..."
                    className="min-h-[250px] text-2xl p-6 rounded-xl border-2"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                  />
                </div>

                <Button 
                  className="w-full h-24 text-3xl font-bold rounded-2xl shadow-xl bg-accent hover:bg-accent/90 gap-4"
                  onClick={handleSubmit}
                  disabled={!type || !desc || loading}
                >
                  <Send className="w-8 h-8" />
                  {loading ? t('loading') : t('submit')}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="text-center shadow-2xl overflow-hidden">
              <div className="bg-accent p-10 flex flex-col items-center">
                <CheckCircle2 className="w-32 h-32 text-white mb-6" />
                <h2 className="text-5xl font-bold text-white">{t('success')}</h2>
              </div>
              <CardContent className="p-16 space-y-10">
                <div className="space-y-4">
                  <p className="text-2xl text-muted-foreground">{t('tracking_id')}</p>
                  <p className="text-5xl font-mono font-black text-primary bg-secondary p-8 rounded-2xl border-4 border-dashed">{refId}</p>
                </div>
                <p className="text-2xl">Your request has been submitted. You will receive SMS updates on your registered mobile number.</p>
                
                <Button 
                  className="h-24 px-12 text-3xl font-bold rounded-2xl shadow-lg bg-primary hover:bg-primary/90 mt-12"
                  onClick={() => router.push('/dashboard')}
                >
                  Return to Dashboard
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
