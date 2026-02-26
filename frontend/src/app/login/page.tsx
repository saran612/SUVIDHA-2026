
'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { apiService } from '@/lib/apiService';
import { useToast } from '@/hooks/use-toast';
import { NumericKeyboard } from '@/components/kiosk/NumericKeyboard';
import { Smartphone, ReceiptText, ArrowRight, Volume2, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { VoiceInstruction } from '@/components/kiosk/VoiceInstruction';

export default function LoginPage() {
  const { t, language } = useLanguage();
  const { login, audioEnabled, setAudioEnabled } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('mobile');
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleKeyPress = (key: string) => {
    if (step === 1) {
      const limit = activeTab === 'mobile' ? 10 : 12;
      if (identifier.length < limit) setIdentifier(prev => prev + key);
    } else {
      if (otp.length < 6) setOtp(prev => prev + key);
    }
  };

  const handleDelete = () => {
    if (step === 1) {
      setIdentifier(prev => prev.slice(0, -1));
    } else {
      setOtp(prev => prev.slice(0, -1));
    }
  };

  const handleClear = () => {
    if (step === 1) setIdentifier('');
    else setOtp('');
  };

  const handleGetOtp = async () => {
    if (activeTab === 'mobile' && identifier.length !== 10) return;
    if (activeTab === 'consumer' && identifier.length < 5) return;

    setLoading(true);
    await apiService.requestOtp(identifier);
    setStep(2);
    setLoading(false);
  };

  const handleVerify = async () => {
    setLoading(true);
    try {
      const response = await apiService.verifyOtp(identifier, otp);
      if (response && response.token) {
        const savedRegion = JSON.parse(sessionStorage.getItem('suvidha_temp_region') || '{"district":"New Delhi","state":"Delhi"}');
        await login({
          mobileNo: activeTab === 'mobile' ? identifier : undefined,
          consumerNo: activeTab === 'consumer' ? identifier : undefined,
          language: language,
          region: savedRegion
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: t('error_otp'),
        });
        setOtp('');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to verify OTP',
      });
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setOtp('');
    } else {
      router.push('/');
    }
  };

  const formatDisplay = (val: string) => {
    if (activeTab === 'consumer') return val || 'Enter Consumer No';
    const chars = val.split('');
    const mask = Array(10).fill('_');
    chars.forEach((c, i) => { if (i < 10) mask[i] = c; });
    return mask.join(' ');
  };

  const isActionDisabled = step === 1
    ? (activeTab === 'mobile' ? identifier.length !== 10 : identifier.length < 5) || loading
    : otp.length < 6 || loading;

  const handleAction = step === 1 ? handleGetOtp : handleVerify;
  const actionText = step === 1 ? (loading ? t('loading') : t('get_otp')) : (loading ? t('loading') : t('verify'));

  return (
    <div className="h-full w-full flex flex-col bg-[#F8FAFB]">
      <VoiceInstruction text={step === 1 ? "Please sign in using your mobile or consumer number. Use the keypad to enter your details." : "A verification code has been sent. Please enter the six digit code using the keypad."} />
      <main className="flex-1 w-full flex flex-col justify-center items-center p-4 sm:p-8 pb-32 relative">
        <div className="flex flex-col lg:flex-row w-full max-w-6xl items-center lg:items-start gap-4 lg:gap-8 pt-14 lg:pt-0 relative">
          <Button
            className="absolute -top-2 left-0 lg:static rounded-full h-12 w-12 sm:h-14 sm:w-14 p-0 bg-accent hover:bg-accent/90 text-white shadow-lg shrink-0 lg:mt-4 z-10"
            onClick={handleBack}
          >
            <ChevronLeft className="w-8 h-8 sm:w-10 sm:h-10" />
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 flex-1 items-stretch">
            <Card className="w-full shadow-sm border border-gray-200 rounded-[1.25rem] overflow-hidden flex flex-col bg-white">
              <CardHeader className="text-center py-6 sm:py-8">
                <CardTitle className="text-5xl sm:text-6xl font-black text-gray-900 tracking-tight">{t('login_title')}</CardTitle>
              </CardHeader>
              <CardContent className="px-6 sm:px-8 pb-8 flex-1 flex flex-col justify-center">
                {step === 1 ? (
                  <Tabs defaultValue="mobile" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-2 h-12 sm:h-14 mb-6 gap-2 sm:gap-3 bg-gray-50 p-1.5 rounded-xl">
                      <TabsTrigger
                        value="mobile"
                        className="text-sm sm:text-lg font-bold data-[state=active]:bg-[#0E6170] data-[state=active]:text-white shadow-sm rounded-lg"
                        onClick={() => setIdentifier('')}
                      >
                        <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        {t('mobile_no')}
                      </TabsTrigger>
                      <TabsTrigger
                        value="consumer"
                        className="text-sm sm:text-lg font-bold data-[state=active]:bg-[#0E6170] data-[state=active]:text-white shadow-sm rounded-lg"
                        onClick={() => setIdentifier('')}
                      >
                        <ReceiptText className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        {t('consumer_no')}
                      </TabsTrigger>
                    </TabsList>

                    <div className="space-y-4">
                      <div className="relative">
                        <Input
                          value={formatDisplay(identifier)}
                          readOnly
                          className="h-16 sm:h-20 text-center text-xl sm:text-5xl font-black rounded-2xl border-2 border-gray-100 bg-gray-50/50 tracking-[0.1rem] sm:tracking-[0.2rem]"
                        />
                      </div>
                    </div>
                  </Tabs>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center">
                      <p className="text-lg sm:text-xl font-bold text-gray-500 mb-2">{t('verification_required')}</p>
                      <p className="text-sm font-medium text-[#0E6170] mb-4">{t('use_test_code')}</p>
                      <Input
                        placeholder="0 0 0 0 0 0"
                        value={otp}
                        readOnly
                        className="h-16 sm:h-20 text-xl sm:text-3xl text-center font-black tracking-[0.5rem] sm:tracking-[1rem] rounded-2xl border-2 border-gray-100 bg-gray-50/50"
                      />
                    </div>
                    <Button variant="link" className="w-full text-base sm:text-lg h-10 text-[#0E6170] font-bold" onClick={() => { setStep(1); setOtp(''); }}>
                      {t('change_number')}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="w-full shadow-sm border border-gray-200 rounded-[1.25rem] overflow-hidden flex flex-col bg-white">
              <CardHeader className="text-center py-6 sm:py-8">
                <CardTitle className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">{t('touch_input')}</CardTitle>
              </CardHeader>
              <CardContent className="px-6 sm:px-8 pb-8 flex-1 flex flex-col justify-center">
                <NumericKeyboard
                  onKeyPress={handleKeyPress}
                  onDelete={handleDelete}
                  onClear={handleClear}
                  className="max-w-[280px] sm:max-w-xs mx-auto"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="h-[108px] w-full shrink-0 bg-white border-t border-gray-200 px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4 z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-6 sm:gap-10">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#0E6170] flex items-center justify-center shadow-lg">
              <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="leading-tight">
              <p className="text-[8px] sm:text-[10px] uppercase tracking-widest font-black text-gray-400">Audio Guide</p>
              <p className="text-lg sm:text-xl font-bold text-gray-800">आवाज़ सुनें</p>
            </div>
          </div>
          <Switch
            checked={audioEnabled}
            onCheckedChange={setAudioEnabled}
            className="data-[state=checked]:bg-[#0E6170] scale-110 sm:scale-125 ml-2"
          />
        </div>

        <Button
          onClick={handleAction}
          disabled={isActionDisabled}
          className="w-full sm:w-auto h-[75px] min-h-[48px] max-h-[64px] px-8 sm:px-12 rounded-2xl bg-[#0E6170] hover:bg-[#0E6170]/90 text-white shadow-xl flex gap-3 sm:gap-4 text-xl sm:text-2xl font-bold transition-all active:scale-95"
        >
          <span>{actionText}</span>
          <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8" />
        </Button>
      </footer>
    </div>
  );
}
