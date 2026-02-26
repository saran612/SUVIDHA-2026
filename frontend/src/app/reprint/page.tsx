'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Printer, ChevronLeft, ReceiptText } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ReprintPage() {
    const { t } = useLanguage();
    const router = useRouter();

    const [receiptId, setReceiptId] = useState('');
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = () => {
        if (!receiptId) return;
        setLoading(true);
        // Mock fetch receipt
        setTimeout(() => {
            setData({
                id: receiptId,
                date: new Date().toLocaleDateString(),
                amount: '₹ 540.00',
                name: 'John Doe',
                service: 'Electricity Bill',
                status: 'SUCCESS'
            });
            setLoading(false);
        }, 800);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="h-[90vh] flex flex-col bg-[#F8FAFB]">
            <main className="flex-1 p-6 sm:p-12 overflow-y-auto w-full">
                <div className="max-w-4xl mx-auto w-full">
                    <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10 p-2">
                        <Button
                            className="rounded-full h-12 w-12 sm:h-14 sm:w-14 p-0 bg-accent hover:bg-accent/90 text-white shadow-lg shrink-0"
                            onClick={() => router.push('/dashboard')}
                        >
                            <ChevronLeft className="w-8 h-8 sm:w-10 sm:h-10" />
                        </Button>
                        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 flex items-center gap-3">
                            <Printer className="w-8 h-8 sm:w-10 sm:h-10 text-[#0E6170]" />
                            {t('reprint_receipts')}
                        </h1>
                    </div>

                    {!data ? (
                        <Card className="shadow-2xl border-none rounded-[1.25rem] overflow-hidden bg-white">
                            <CardHeader className="py-8 text-center bg-gray-50 border-b border-gray-100">
                                <CardTitle className="text-2xl font-bold flex flex-col items-center gap-4 text-gray-800">
                                    <ReceiptText className="w-16 h-16 text-gray-400" />
                                    Search Receipt
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-8 sm:px-12 pb-12 pt-8 space-y-8">
                                <div className="space-y-4 max-w-xl mx-auto">
                                    <Input
                                        value={receiptId}
                                        onChange={(e) => setReceiptId(e.target.value.toUpperCase())}
                                        placeholder="Enter TXN ID or Consumer No"
                                        className="h-16 text-2xl text-center font-bold border-2 rounded-xl bg-gray-50/50"
                                    />
                                    <p className="text-center text-muted-foreground font-medium">Please enter your transaction ID or consumer number</p>
                                </div>
                                <div className="flex justify-center">
                                    <Button
                                        className="w-full max-w-sm h-16 text-xl font-bold rounded-xl bg-[#0E6170] text-white hover:bg-[#0E6170]/90 shadow-xl gap-3"
                                        onClick={handleSearch}
                                        disabled={!receiptId || loading}
                                    >
                                        <Search className="w-6 h-6" />
                                        {loading ? t('loading') : 'Search'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <Card className="shadow-2xl border border-gray-200 rounded-none bg-white max-w-2xl mx-auto print:shadow-none print:border-none">
                                <CardHeader className="text-center py-8 border-b-2 border-dashed border-gray-300 bg-gray-50 print:bg-white">
                                    <h2 className="text-3xl font-black tracking-widest text-[#0E6170]">SUVIDHA KIOSK</h2>
                                    <p className="text-gray-500 font-medium mt-2">PAYMENT RECEIPT</p>
                                </CardHeader>
                                <CardContent className="p-8 sm:p-12 space-y-8">
                                    <div className="flex justify-between items-end border-b pb-6">
                                        <div>
                                            <p className="text-sm text-gray-500 font-bold mb-1 uppercase">Date</p>
                                            <p className="text-xl font-medium text-gray-900">{data.date}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500 font-bold mb-1 uppercase">Receipt No</p>
                                            <p className="text-xl font-bold font-mono text-gray-900">{data.id}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 py-4">
                                        <div className="flex justify-between items-center text-lg">
                                            <span className="text-gray-600 font-medium">Billed To</span>
                                            <span className="font-bold text-gray-900">{data.name}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-lg">
                                            <span className="text-gray-600 font-medium">Service</span>
                                            <span className="font-bold text-gray-900">{data.service}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-lg">
                                            <span className="text-gray-600 font-medium">Payment Status</span>
                                            <span className="font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-sm tracking-wide">{data.status}</span>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t-2 border-dashed border-gray-300 flex justify-between items-center">
                                        <span className="text-2xl font-medium text-gray-800">Total Paid</span>
                                        <span className="text-4xl font-black text-gray-900">{data.amount}</span>
                                    </div>

                                    <div className="mt-12 text-center print:hidden">
                                        <Button
                                            className="h-16 px-12 text-2xl font-bold rounded-2xl shadow-xl bg-[#0E6170] text-white hover:bg-[#0E6170]/90 gap-3 w-full sm:w-auto"
                                            onClick={handlePrint}
                                        >
                                            <Printer className="w-6 h-6" />
                                            Print Receipt
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="mt-4 text-gray-500 hover:text-gray-800 font-bold block mx-auto"
                                            onClick={() => setData(null)}
                                        >
                                            Search Another
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
