'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, Droplets, Zap, Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UsagePage() {
    const { t } = useLanguage();
    const router = useRouter();

    // Mock data for usage
    const electricityUsage = [
        { month: 'Jan', value: 340 },
        { month: 'Feb', value: 280 },
        { month: 'Mar', value: 310 },
    ];

    const waterUsage = [
        { month: 'Jan', value: 15 },
        { month: 'Feb', value: 12 },
        { month: 'Mar', value: 18 },
    ];

    return (
        <div className="h-[90vh] flex flex-col bg-[#F8FAFB]">
            <main className="flex-1 p-6 sm:p-12 overflow-y-auto">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10">
                        <Button
                            className="rounded-full h-12 w-12 sm:h-14 sm:w-14 p-0 bg-accent hover:bg-accent/90 text-white shadow-lg shrink-0"
                            onClick={() => router.push('/dashboard')}
                        >
                            <ChevronLeft className="w-8 h-8 sm:w-10 sm:h-10" />
                        </Button>
                        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 flex items-center gap-3">
                            <Activity className="w-8 h-8 sm:w-10 sm:h-10 text-[#0E6170]" />
                            {t('check_usage')}
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
                        <Card className="shadow-xl rounded-2xl border-none bg-white overflow-hidden">
                            <CardHeader className="bg-amber-50 border-b border-amber-100 pb-6">
                                <CardTitle className="text-2xl font-bold flex items-center gap-3 text-amber-800">
                                    <Zap className="w-8 h-8 text-amber-500" />
                                    Electricity Usage
                                </CardTitle>
                                <p className="text-amber-600/80 font-medium text-sm mt-1">Last 3 Months (kWh)</p>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-6">
                                    {electricityUsage.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between">
                                            <span className="text-xl font-bold text-gray-700 w-16">{item.month}</span>
                                            <div className="flex-1 mx-4 bg-gray-100 rounded-full h-4 overflow-hidden">
                                                <div
                                                    className="bg-amber-500 h-full rounded-full transition-all duration-1000"
                                                    style={{ width: `${(item.value / 400) * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-xl font-black text-gray-900 w-20 text-right">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-xl rounded-2xl border-none bg-white overflow-hidden">
                            <CardHeader className="bg-blue-50 border-b border-blue-100 pb-6">
                                <CardTitle className="text-2xl font-bold flex items-center gap-3 text-blue-800">
                                    <Droplets className="w-8 h-8 text-blue-500" />
                                    Water Usage
                                </CardTitle>
                                <p className="text-blue-600/80 font-medium text-sm mt-1">Last 3 Months (kL)</p>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-6">
                                    {waterUsage.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between">
                                            <span className="text-xl font-bold text-gray-700 w-16">{item.month}</span>
                                            <div className="flex-1 mx-4 bg-gray-100 rounded-full h-4 overflow-hidden">
                                                <div
                                                    className="bg-blue-500 h-full rounded-full transition-all duration-1000"
                                                    style={{ width: `${(item.value / 25) * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-xl font-black text-gray-900 w-20 text-right">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
