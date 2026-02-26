'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Printer, ChevronLeft, ReceiptText, History } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { FullKeyboard } from '@/components/kiosk/FullKeyboard';

const recentReceipts = [
    { id: 'TXN-001293', name: 'John Doe', service: 'Electricity Bill', amount: '540.00', date: '15 Feb 2026', status: 'SUCCESS' },
    { id: 'TXN-001184', name: 'Jane Smith', service: 'Water Bill', amount: '320.00', date: '02 Feb 2026', status: 'SUCCESS' },
    { id: 'TXN-001055', name: 'John Doe', service: 'Gas Bill', amount: '850.00', date: '18 Jan 2026', status: 'SUCCESS' },
    { id: 'TXN-000921', name: 'John Doe', service: 'Electricity Bill', amount: '490.00', date: '12 Jan 2026', status: 'SUCCESS' }
];

export default function ReprintPage() {
    const { t } = useLanguage();
    const router = useRouter();

    const [receiptId, setReceiptId] = useState('');
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

    const handleSearch = (id?: string) => {
        const searchId = typeof id === 'string' ? id : receiptId;
        if (!searchId) return;

        setReceiptId(searchId);
        setLoading(true);
        // Mock fetch receipt
        setTimeout(() => {
            const foundNode = recentReceipts.find(r => r.id === searchId);
            if (foundNode) {
                setData(foundNode);
            } else {
                setData({
                    id: searchId,
                    date: new Date().toLocaleDateString(),
                    amount: '540.00',
                    name: 'Placeholder User',
                    service: 'General Utility',
                    status: 'SUCCESS'
                });
            }
            setLoading(false);
        }, 800);
    };

    const handlePrint = () => {
        window.print();
    };

    const handleKeyPress = (key: string) => {
        setReceiptId((prev) => (prev.length >= 15 ? prev : prev + key));
    };

    const handleDelete = () => {
        setReceiptId((prev) => prev.slice(0, -1));
    };

    return (
        <div className="h-full flex flex-col bg-[#F8FAFB] print:bg-white print:h-auto print:block">
            <main className="flex-1 p-6 sm:p-12 flex flex-col min-h-0 w-full print:p-0 print:block">
                <div className="max-w-7xl mx-auto w-full flex flex-col h-full print:block">
                    <div className="flex items-center gap-6 mb-8 shrink-0 p-2 print:hidden">
                        <Button
                            className="rounded-full h-14 w-14 p-0 bg-accent hover:bg-accent/90 text-white shadow-lg shrink-0"
                            onClick={() => router.push('/dashboard')}
                        >
                            <ChevronLeft className="w-10 h-10" />
                        </Button>
                        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 flex items-center gap-3">
                            <Printer className="w-10 h-10 text-[#0E6170]" />
                            {t('reprint_receipts')}
                        </h1>
                    </div>

                    <div className="flex-1 min-h-0 print:block">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 h-full print:block">
                            {/* Left Column: Search & Result */}
                            <div className="flex flex-col h-full print:block">
                                <h2 className="text-2xl font-black text-gray-700 mb-6 flex items-center gap-2 print:hidden">
                                    <Search className="w-6 h-6 text-[#0E6170]" />
                                    Search Receipt
                                </h2>

                                {!data ? (
                                    <Card className="shadow-2xl border-none rounded-[1.25rem] overflow-hidden bg-white flex flex-col flex-1 print:hidden">
                                        <CardContent className="p-10 space-y-8 flex flex-col justify-center items-center h-full">
                                            <div className="space-y-4 w-full">
                                                <p className="text-center text-muted-foreground font-medium">Enter your transaction ID or consumer number</p>
                                                <Input
                                                    value={receiptId}
                                                    readOnly
                                                    onClick={() => setIsKeyboardOpen(true)}
                                                    placeholder="e.g. TXN-123456"
                                                    className="h-24 text-3xl sm:text-4xl text-center font-mono font-black border-4 rounded-2xl bg-gray-50 focus:bg-white cursor-pointer transition-all tracking-wider text-gray-900"
                                                />
                                            </div>
                                            <Button
                                                className="w-full h-24 text-3xl font-black rounded-2xl bg-[#0E6170] text-white hover:bg-[#0E6170]/90 shadow-xl gap-4 transition-transform active:scale-95"
                                                onClick={() => handleSearch()}
                                                disabled={!receiptId || loading}
                                            >
                                                <Search className="w-8 h-8" />
                                                {loading ? t('loading') : 'Search Receipt'}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <div className="flex-1 flex flex-col overflow-y-auto w-full pb-4 animate-in fade-in slide-in-from-bottom-4 duration-500 print:overflow-visible print:pb-0">
                                        <Card className="shadow-2xl border border-gray-200 rounded-none bg-white w-full max-w-lg mx-auto print:shadow-none print:border-none flex-shrink-0 print:max-w-full print:m-0 print:p-0">
                                            <CardHeader className="text-center py-8 border-b-2 border-dashed border-gray-300 bg-gray-50 print:bg-white print:py-4">
                                                <h2 className="text-3xl font-black tracking-widest text-[#0E6170] print:text-black">SUVIDHA KIOSK</h2>
                                                <p className="text-gray-500 font-medium mt-2 print:text-black">PAYMENT RECEIPT</p>
                                            </CardHeader>
                                            <CardContent className="p-8 sm:p-10 space-y-8 print:p-0 print:space-y-6 print:mt-6">
                                                <div className="flex justify-between items-end border-b pb-6 print:pb-4 print:border-gray-500">
                                                    <div>
                                                        <p className="text-sm text-gray-500 font-bold mb-1 uppercase print:text-black">Date</p>
                                                        <p className="text-xl font-medium text-gray-900 print:text-black">{data.date}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm text-gray-500 font-bold mb-1 uppercase print:text-black">Receipt No</p>
                                                        <p className="text-lg font-bold font-mono text-gray-900 print:text-black">{data.id}</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-4 py-4 print:py-0 print:space-y-2">
                                                    <div className="flex justify-between items-center text-lg">
                                                        <span className="text-gray-600 font-medium print:text-black">Billed To</span>
                                                        <span className="font-bold text-gray-900 text-right print:text-black">{data.name}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-lg">
                                                        <span className="text-gray-600 font-medium print:text-black">Service</span>
                                                        <span className="font-bold text-gray-900 text-right print:text-black">{data.service}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-lg">
                                                        <span className="text-gray-600 font-medium print:text-black">Payment Status</span>
                                                        <span className="font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-sm tracking-wide print:text-black print:bg-transparent print:p-0">{data.status}</span>
                                                    </div>
                                                </div>

                                                <div className="pt-6 border-t-2 border-dashed border-gray-300 flex justify-between items-center print:border-gray-500">
                                                    <span className="text-2xl font-medium text-gray-800 print:text-black">Total Paid</span>
                                                    <span className="text-4xl font-black text-gray-900 print:text-black">{data.amount}</span>
                                                </div>

                                                <div className="mt-8 text-center print:hidden flex flex-col gap-4">
                                                    <Button
                                                        className="h-16 w-full text-2xl font-bold rounded-xl shadow-xl bg-[#0E6170] text-white hover:bg-[#0E6170]/90 gap-3"
                                                        onClick={handlePrint}
                                                    >
                                                        <Printer className="w-6 h-6" />
                                                        Print Receipt
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="h-14 font-bold rounded-xl bg-gray-50 text-gray-600 hover:text-gray-900 hover:bg-gray-100 border-2"
                                                        onClick={() => { setData(null); setReceiptId(''); }}
                                                    >
                                                        Search Another
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}
                            </div>

                            {/* Right Column: Recent Receipts List */}
                            <div className="flex flex-col h-full mt-8 lg:mt-0 print:hidden">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-black text-gray-700 flex items-center gap-2">
                                        <History className="w-6 h-6 text-accent" />
                                        Recent Receipts
                                    </h2>
                                </div>

                                <div className="flex-1 bg-white/40 rounded-[2rem] border-2 border-dashed border-gray-200 overflow-hidden">
                                    <ScrollArea className="h-full w-full p-4 sm:p-6">
                                        <div className="space-y-6 pr-4 pb-4">
                                            {recentReceipts.map((req) => (
                                                <Card
                                                    key={req.id}
                                                    className="cursor-pointer transition-all border-4 border-transparent hover:border-[#0E6170] hover:shadow-2xl rounded-[1.5rem] bg-white group active:scale-[0.98]"
                                                    onClick={() => handleSearch(req.id)}
                                                >
                                                    <CardContent className="p-6 sm:p-8 flex items-center gap-6">
                                                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 bg-indigo-50">
                                                            <ReceiptText className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-500" />
                                                        </div>
                                                        <div className="flex-1 space-y-1">
                                                            <div className="flex justify-between items-start">
                                                                <p className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">{req.service}</p>
                                                                <span className="text-xs font-black px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full whitespace-nowrap mt-1">
                                                                    {req.status}
                                                                </span>
                                                            </div>
                                                            <p className="text-base font-bold text-gray-500">{req.name}</p>
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
                    value={receiptId}
                    placeholder="Enter TXN ID"
                />
            )}
        </div>
    );
}
