
'use client';

import { useState, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  ChevronLeft, 
  ArrowRight, 
  Zap, 
  Droplets, 
  Flame, 
  Home, 
  Building2, 
  Factory,
  CheckCircle2,
  User,
  CreditCard,
  Search
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FullKeyboard } from '@/components/kiosk/FullKeyboard';
import { cn } from '@/lib/utils';
import { logger } from '@/lib/logger';
import { apiService } from '@/lib/apiService';
import Loading from '@/app/loading';
import { VoiceInstruction } from '@/components/kiosk/VoiceInstruction';

type Step = 'SERVICE' | 'CATEGORY' | 'DETAILS' | 'SUCCESS';

export default function NewConnectionPage() {
  const { t } = useLanguage();
  const router = useRouter();

  const [step, setStep] = useState<Step>('SERVICE');
  const [service, setService] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [applicantName, setApplicantName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [refId, setRefId] = useState('');
  const [loading, setLoading] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [keyboardTarget, setKeyboardTarget] = useState<'NAME' | 'ID'>('NAME');

  const handleBack = () => {
    if (step === 'SERVICE') router.push('/dashboard');
    else if (step === 'CATEGORY') setStep('SERVICE');
    else if (step === 'DETAILS') setStep('CATEGORY');
    else router.push('/dashboard');
  };

  const services = [
    { id: 'electricity', title: t('electricity'), icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 'water', title: t('water'), icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'gas', title: t('gas'), icon: Flame, color: 'text-rose-500', bg: 'bg-rose-50' },
  ];

  const categories = [
    { id: 'domestic', title: t('domestic'), icon: Home, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { id: 'commercial', title: t('commercial'), icon: Building2, color: 'text-rose-600', bg: 'bg-rose-50' },
    { id: 'industrial', title: t('industrial'), icon: Factory, color: 'text-slate-600', bg: 'bg-slate-50' },
  ];

  const handleKeyPress = useCallback((key: string) => {
    if (keyboardTarget === 'NAME') {
      setApplicantName(prev => prev.length >= 30 ? prev : prev + key);
    } else {
      setIdNumber(prev => prev.length >= 12 ? prev : prev + key);
    }
  }, [keyboardTarget]);

  const handleDelete = useCallback(() => {
    if (keyboardTarget === 'NAME') {
      setApplicantName(prev => prev.slice(0, -1));
    } else {
      setIdNumber(prev => prev.slice(0, -1));
    }
  }, [keyboardTarget]);

  const handleSubmit = async () => {
    if (!service || !category) return;
    
    setLoading(true);
    try {
      const response = await apiService.submitNewConnection({
        service,
        category,
        name: applicantName,
        idNumber
      });
      
      setRefId(response.referenceId);
      setStep('SUCCESS');
      logger.log(`New Connection application submitted: ${response.referenceId}`, 'INFO', { service, category });
    } catch (error) {
      console.error('Submission failed', error);
    } finally {
      setLoading(false);
    }
  };

  const openKeyboard = (target: 'NAME' | 'ID') => {
    setKeyboardTarget(target);
    setIsKeyboardOpen(true);
  };

  const getVoiceText = () => {
    switch(step) {
      case 'SERVICE': return "Select the type of utility connection you wish to apply for, such as electricity or water.";
      case 'CATEGORY': return "Choose your connection category. Is this for a home, a business, or an industrial site?";
      case 'DETAILS': return "Please enter your full name and identification number. Tap the input boxes to use the keyboard.";
      case 'SUCCESS': return "Your application is submitted successfully. Please note down your tracking ID displayed on the screen.";
      default: return "";
    }
  };

  if (loading && step !== 'SUCCESS') return <Loading />;

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      <VoiceInstruction text={getVoiceText()} />
      <main className="flex-1 p-6 sm:p-12 flex flex-col overflow-hidden">
        <div className="max-w-6xl mx-auto w-full h-full flex flex-col">
          <div className="flex items-center gap-6 mb-10 shrink-0">
            <Button 
              className="rounded-full h-14 w-14 p-0 bg-accent hover:bg-accent/90 text-white shadow-lg shrink-0"
              onClick={handleBack}
            >
              <ChevronLeft className="w-10 h-10" />
            </Button>
            <h1 className="text-4xl font-black text-gray-900">
              {step === 'SUCCESS' ? t('success') : t('apply_new_connection')}
            </h1>
          </div>

          <div className="flex-1 overflow-y-auto">
            {step === 'SERVICE' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center">
                  <h2 className="text-3xl font-black text-gray-800">{t('select_service')}</h2>
                  <p className="text-xl text-muted-foreground mt-2">{t('choose_service_desc')}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {services.map((item) => (
                    <Card 
                      key={item.id}
                      onClick={() => { setService(item.id); setStep('CATEGORY'); }}
                      className="cursor-pointer border-4 border-transparent hover:border-primary transition-all hover:shadow-2xl rounded-[2rem] overflow-hidden group active:scale-95"
                    >
                      <CardContent className="p-10 flex flex-col items-center gap-6 text-center">
                        <div className={cn("w-32 h-32 rounded-3xl flex items-center justify-center transition-transform group-hover:scale-110", item.bg)}>
                          <item.icon className={cn("w-16 h-16", item.color)} />
                        </div>
                        <span className="text-2xl font-black text-gray-800">{item.title}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {step === 'CATEGORY' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center">
                  <h2 className="text-3xl font-black text-gray-800">{t('select_category')}</h2>
                  <p className="text-xl text-muted-foreground mt-2">{t('choose_category_desc')}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {categories.map((item) => (
                    <Card 
                      key={item.id}
                      onClick={() => { setCategory(item.id); setStep('DETAILS'); }}
                      className="cursor-pointer border-4 border-transparent hover:border-primary transition-all hover:shadow-2xl rounded-[2rem] overflow-hidden group active:scale-95"
                    >
                      <CardContent className="p-10 flex flex-col items-center gap-6 text-center">
                        <div className={cn("w-32 h-32 rounded-3xl flex items-center justify-center transition-transform group-hover:scale-110", item.bg)}>
                          <item.icon className={cn("w-16 h-16", item.color)} />
                        </div>
                        <span className="text-2xl font-black text-gray-800">{item.title}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {step === 'DETAILS' && (
              <div className="max-w-2xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className="shadow-2xl rounded-[2rem] overflow-hidden border-none bg-white">
                  <CardHeader className="bg-secondary/30 p-10 border-b">
                    <CardTitle className="text-3xl text-center font-black">{t('personal_details')}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-10 space-y-10">
                    <div className="space-y-4">
                      <label className="text-xl font-bold flex items-center gap-2">
                        <User className="w-6 h-6 text-primary" />
                        {t('applicant_name')}
                      </label>
                      <Input 
                        value={applicantName}
                        readOnly
                        placeholder={t('tap_to_enter')}
                        onClick={() => openKeyboard('NAME')}
                        className="h-20 text-3xl font-bold rounded-2xl border-2 bg-gray-50 focus:bg-white cursor-pointer transition-all"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-xl font-bold flex items-center gap-2">
                        <CreditCard className="w-6 h-6 text-primary" />
                        {t('identity_proof')}
                      </label>
                      <Input 
                        value={idNumber}
                        readOnly
                        placeholder={t('tap_to_enter')}
                        onClick={() => openKeyboard('ID')}
                        className="h-20 text-3xl font-bold rounded-2xl border-2 bg-gray-50 focus:bg-white cursor-pointer transition-all"
                      />
                    </div>
                    <Button 
                      className="w-full h-24 text-3xl font-black rounded-2xl bg-[#0E6170] text-white shadow-xl flex gap-4 mt-6"
                      onClick={handleSubmit}
                      disabled={applicantName.length < 3 || idNumber.length < 5 || loading}
                    >
                      {loading ? t('loading') : t('submit')}
                      <ArrowRight className="w-8 h-8" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {step === 'SUCCESS' && (
              <div className="max-w-3xl mx-auto space-y-10 animate-in zoom-in duration-500">
                <Card className="text-center shadow-2xl rounded-[2.5rem] overflow-hidden border-none">
                  <div className="bg-emerald-600 p-16 flex flex-col items-center">
                    <div className="h-40 w-40 rounded-full bg-white/20 flex items-center justify-center mb-8">
                      <CheckCircle2 className="w-24 h-24 text-white" />
                    </div>
                    <h2 className="text-6xl font-black text-white">{t('success')}</h2>
                  </div>
                  <CardContent className="p-16 space-y-12 bg-white">
                    <div className="space-y-6">
                      <p className="text-2xl font-bold text-muted-foreground uppercase tracking-[0.2em]">{t('tracking_id')}</p>
                      <p className="text-7xl font-mono font-black text-emerald-600 bg-gray-50 py-12 rounded-[2rem] border-4 border-dashed border-emerald-100">{refId}</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-500 leading-relaxed">
                      Your application for a new <span className="text-emerald-600">{service?.toUpperCase()}</span> connection has been registered. 
                      A field officer will visit the location for site verification within 3 working days.
                    </p>
                    <div className="pt-8 flex flex-col sm:flex-row gap-6 justify-center">
                      <Button 
                        className="h-24 px-12 text-3xl font-black rounded-[1.5rem] bg-gray-100 text-gray-800 hover:bg-gray-200"
                        onClick={() => router.push('/dashboard')}
                      >
                        {t('dashboard')}
                      </Button>
                      <Button 
                        className="h-24 px-12 text-3xl font-black rounded-[1.5rem] bg-[#0E6170] text-white hover:bg-[#0E6170]/90 shadow-xl flex gap-4"
                        onClick={() => router.push('/status')}
                      >
                        <Search className="w-8 h-8" />
                        {t('track_status')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>

      {isKeyboardOpen && (
        <FullKeyboard 
          onKeyPress={handleKeyPress}
          onDelete={handleDelete}
          onClose={() => setIsKeyboardOpen(false)}
          value={keyboardTarget === 'NAME' ? applicantName : idNumber}
          placeholder={keyboardTarget === 'NAME' ? t('applicant_name') : t('identity_proof')}
        />
      )}
    </div>
  );
}
