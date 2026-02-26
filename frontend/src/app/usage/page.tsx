'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, Droplets, Zap, Activity, Flame, CheckCircle2, Calendar, History, CalendarDays, TrendingUp, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';

const usageConfig = {
    electricity: {
        title: 'Electricity Usage',
        subtitle: 'Simple view of your energy spending',
        unit: 'kWh',
        valThisMonth: 145,
        valPrevMonth: 132,
        valLastYear: 140,
        prevMonthLabel: 'February 2026',
        lastYearLabel: 'February 2025',
        colorText: 'text-blue-600',
        colorBg: 'bg-blue-600',
        colorBgLight: 'bg-blue-50',
        colorChart: '#2563eb',
        icon: Zap,
        history: [
            { month: 'Oct', value: 110 }, { month: 'Nov', value: 120 }, { month: 'Dec', value: 135 },
            { month: 'Jan', value: 140 }, { month: 'Feb', value: 132 }, { month: 'Mar', value: 145 },
        ]
    },
    water: {
        title: 'Water Usage',
        subtitle: 'Simple view of your water spending',
        unit: 'kL',
        valThisMonth: 18,
        valPrevMonth: 16,
        valLastYear: 15,
        prevMonthLabel: 'February 2026',
        lastYearLabel: 'February 2025',
        colorText: 'text-cyan-600',
        colorBg: 'bg-cyan-600',
        colorBgLight: 'bg-cyan-50',
        colorChart: '#0891b2',
        icon: Droplets,
        history: [
            { month: 'Oct', value: 14 }, { month: 'Nov', value: 15 }, { month: 'Dec', value: 16 },
            { month: 'Jan', value: 15 }, { month: 'Feb', value: 16 }, { month: 'Mar', value: 18 },
        ]
    },
    gas: {
        title: 'Gas Usage',
        subtitle: 'Simple view of your gas spending',
        unit: 'Cylinders',
        valThisMonth: 2,
        valPrevMonth: 1,
        valLastYear: 2,
        prevMonthLabel: 'February 2026',
        lastYearLabel: 'February 2025',
        colorText: 'text-rose-600',
        colorBg: 'bg-rose-600',
        colorBgLight: 'bg-rose-50',
        colorChart: '#e11d48',
        icon: Flame,
        history: [
            { month: 'Oct', value: 1 }, { month: 'Nov', value: 2 }, { month: 'Dec', value: 2 },
            { month: 'Jan', value: 1 }, { month: 'Feb', value: 1 }, { month: 'Mar', value: 2 },
        ]
    }
};

export default function UsagePage() {
    const { t } = useLanguage();
    const router = useRouter();
    const [selectedUtility, setSelectedUtility] = useState<'electricity' | 'water' | 'gas' | null>(null);

    const activeConf = selectedUtility ? usageConfig[selectedUtility] : null;

    return (
        <div className="h-full flex flex-col bg-[#F8FAFB] print:bg-white print:block print:h-auto">
            <main className="flex-1 p-6 sm:p-12 overflow-y-auto print:p-0 print:block">
                {!selectedUtility ? (
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10">
                            {[
                                { id: 'electricity', label: 'Electricity', icon: Zap, color: 'text-blue-500', bg: 'bg-blue-50', hoverBorder: 'hover:border-blue-400' },
                                { id: 'water', label: 'Water', icon: Droplets, color: 'text-cyan-500', bg: 'bg-cyan-50', hoverBorder: 'hover:border-cyan-400' },
                                { id: 'gas', label: 'Gas', icon: Flame, color: 'text-rose-500', bg: 'bg-rose-50', hoverBorder: 'hover:border-rose-400' }
                            ].map(u => (
                                <Card
                                    key={u.id}
                                    onClick={() => setSelectedUtility(u.id as any)}
                                    className={`shadow-xl rounded-[2rem] border-transparent bg-white ${u.hoverBorder} border-4 cursor-pointer hover:shadow-2xl transition-all active:scale-95 group overflow-hidden`}
                                >
                                    <CardContent className="p-10 flex flex-col items-center justify-center text-center space-y-4">
                                        <div className={`w-24 h-24 rounded-full ${u.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                            <u.icon className={`w-12 h-12 ${u.color}`} />
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-black text-gray-900">{u.label}</h3>
                                            <p className="text-gray-500 font-bold mt-2 tracking-wide text-sm">Tap to view format</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                ) : activeConf && (
                    <div className="w-full max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-500">
                        {/* Header Section Matches Image */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 mt-2">
                            <div className="flex items-center gap-6">
                                <Button
                                    className={`rounded-full h-16 w-16 p-0 ${activeConf.colorBg} hover:opacity-90 text-white shadow-xl shadow-gray-200 shrink-0 print:hidden`}
                                    onClick={() => setSelectedUtility(null)}
                                >
                                    <ChevronLeft className="w-8 h-8" />
                                </Button>
                                <div>
                                    <h1 className="text-4xl sm:text-[2.75rem] leading-tight font-black text-gray-900 print:text-black">{activeConf.title}</h1>
                                    <p className="text-gray-500 font-bold text-lg mt-1">{activeConf.subtitle}</p>
                                </div>
                            </div>
                            <div className="flex bg-white rounded-[1.5rem] p-2 shadow-sm border border-gray-100/50">
                                <button className="px-8 py-3 rounded-[1.25rem] bg-white font-black text-gray-900 shadow text-lg">Units</button>
                                <button className="px-8 py-3 rounded-[1.25rem] text-gray-500 font-bold hover:text-gray-900 transition-colors text-lg">Money</button>
                            </div>
                        </div>

                        {/* Top Large Card */}
                        <Card className="shadow-2xl shadow-gray-200/50 rounded-[2.5rem] border-none bg-white mb-8 print:shadow-none print:border-none print:m-0 print:p-0">
                            <CardContent className="p-10 sm:p-14 print:p-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center h-[320px]">
                                    {/* Circular Progress Side */}
                                    <div className="flex flex-col items-center justify-center h-full relative print:break-inside-avoid">
                                        <div className="relative w-72 h-72 flex items-center justify-center">
                                            <svg className="w-full h-full transform -rotate-90 drop-shadow-sm" viewBox="0 0 100 100">
                                                {/* Super faint inner background circle */}
                                                <circle cx="50" cy="50" r="42" fill={activeConf.colorChart} opacity="0.04" />

                                                {/* Left side pie fill logic similar to image */}
                                                <path d="M50,8 A42,42 0 0,0 50,92 Z" fill={activeConf.colorChart} opacity="0.15" />

                                                {/* Thick Stroke Background */}
                                                <circle cx="50" cy="50" r="38" stroke="#f4f7fa" strokeWidth="12" fill="none" />

                                                {/* Thick Stroke Foreground */}
                                                <circle
                                                    cx="50" cy="50" r="38"
                                                    stroke={activeConf.colorChart}
                                                    strokeWidth="12" fill="none"
                                                    strokeDasharray="238.7" strokeDashoffset="59.6"
                                                    strokeLinecap="round"
                                                />
                                            </svg>

                                            {/* Text over circle */}
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center mt-2">
                                                <span className={`text-[4.5rem] leading-none mb-1 font-black ${activeConf.colorText}`}>{activeConf.valThisMonth}</span>
                                                <span className="text-sm font-black text-gray-400 tracking-widest uppercase">Units Used</span>
                                            </div>
                                        </div>

                                        {/* Status Chip */}
                                        <div className="absolute -bottom-10 bg-emerald-100 px-6 py-3 rounded-full flex items-center gap-3 w-max mx-auto shadow-sm">
                                            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                                            <span className="text-emerald-700 font-black text-lg">Normal Consumption</span>
                                        </div>
                                    </div>

                                    {/* Monthly History Chart Side */}
                                    <div className="flex flex-col h-full justify-between pb-4">
                                        <h3 className="text-[2rem] font-black text-gray-900 max-md:text-center mt-2">Monthly History</h3>

                                        <div className="flex items-end justify-between h-44 gap-3">
                                            {activeConf.history.map((pt, i) => {
                                                const maxVal = Math.max(...activeConf.history.map(h => h.value));
                                                // Identify the most recent month visually
                                                const isMax = pt.month === 'Mar';

                                                return (
                                                    <div key={i} className="flex flex-col items-center gap-4 flex-1 h-full justify-end">
                                                        <div className="w-full flex justify-center items-end relative h-full">
                                                            <div
                                                                className={`w-[45%] max-w-[40px] rounded-t-lg transition-all ${isMax ? activeConf.colorBg : activeConf.colorBgLight}`}
                                                                style={{ height: `${(pt.value / maxVal) * 90}%` }}
                                                            />
                                                        </div>
                                                        <span className={`text-base font-black ${isMax ? activeConf.colorText : 'text-gray-400'}`}>{pt.month}</span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Three Action/Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8">
                            {/* Blue (or Utility Color) Card */}
                            <Card className={`shadow-xl shadow-${selectedUtility}-500/20 rounded-[2rem] border-none ${activeConf.colorBg} text-white`}>
                                <CardContent className="p-8 pb-10">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-xl font-bold text-white/90">Usage This Month</span>
                                        <Calendar className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="flex items-baseline gap-2 mb-8 mt-4">
                                        <h4 className="text-6xl font-black">{activeConf.valThisMonth}</h4>
                                        <span className="text-3xl font-bold opacity-90">{activeConf.unit}</span>
                                    </div>
                                    <div className="inline-flex items-center gap-2 bg-white/20 px-6 py-2.5 rounded-full text-sm font-bold shadow-sm w-max">
                                        <TrendingUp className="w-5 h-5" />
                                        +10% vs last month
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="shadow-lg shadow-gray-200/40 rounded-[2rem] border-none bg-white">
                                <CardContent className="p-8 pb-10">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-xl font-bold text-gray-500">Previous Month</span>
                                        <History className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <div className="flex items-baseline gap-2 mb-8 mt-4">
                                        <h4 className="text-[3.5rem] font-black text-gray-900 leading-none">{activeConf.valPrevMonth}</h4>
                                        <span className="text-2xl font-bold text-gray-400">{activeConf.unit}</span>
                                    </div>
                                    <p className="text-lg font-bold text-gray-400 mt-2">{activeConf.prevMonthLabel}</p>
                                </CardContent>
                            </Card>

                            <Card className="shadow-lg shadow-gray-200/40 rounded-[2rem] border-none bg-white">
                                <CardContent className="p-8 pb-10">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-xl font-bold text-gray-500">Last Year Same Month</span>
                                        <CalendarDays className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <div className="flex items-baseline gap-2 mb-8 mt-4">
                                        <h4 className="text-[3.5rem] font-black text-gray-900 leading-none">{activeConf.valLastYear}</h4>
                                        <span className="text-2xl font-bold text-gray-400">{activeConf.unit}</span>
                                    </div>
                                    <p className="text-lg font-bold text-gray-400 mt-2">{activeConf.lastYearLabel}</p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="flex justify-center pb-12 print:hidden">
                            <Button
                                className="bg-[#111827] hover:bg-black text-white rounded-[1.25rem] px-12 h-[4.5rem] text-xl font-bold flex gap-4 items-center shadow-2xl active:scale-95 transition-transform shrink-0"
                                onClick={() => window.print()}
                            >
                                <Download className="w-7 h-7" />
                                Download Full Bill
                            </Button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
