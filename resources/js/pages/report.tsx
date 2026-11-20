import { Head } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import { ReportSummary } from '@/components/report/report-summary';
import { ReportTable, type ReportItemBreakdown, type ReportTransaction } from '@/components/report/report-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, FileDown, Loader2, Printer, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

type ReportData = {
    start_date: string;
    end_date: string;
    total_sales: number;
    transaction_count: number;
    cash_sales: number;
    qrisSales: number;
    cash_sales_raw?: number;
    qris_sales: number;
    items_breakdown: ReportItemBreakdown[];
    transactions: ReportTransaction[];
};

const formatDateInput = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

export default function Report() {
    const todayStr = formatDateInput(new Date());

    const [startDate, setStartDate] = useState<string>(todayStr);
    const [endDate, setEndDate] = useState<string>(todayStr);
    const [activePreset, setActivePreset] = useState<'today' | '7days' | 'month' | 'custom'>('today');
    const [data, setData] = useState<ReportData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchReport = useCallback(async (start: string, end: string) => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/laporan?start_date=${start}&end_date=${end}`, {
                headers: { Accept: 'application/json' },
            });
            if (!res.ok) throw new Error('Gagal mengambil data laporan');
            const result: ReportData = await res.json();
            setData(result);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Gagal memuat laporan';
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReport(startDate, endDate);
    }, [startDate, endDate, fetchReport]);

    // Preset handlers
    const applyPreset = (preset: 'today' | '7days' | 'month') => {
        setActivePreset(preset);
        const now = new Date();
        const end = formatDateInput(now);

        if (preset === 'today') {
            setStartDate(end);
            setEndDate(end);
        } else if (preset === '7days') {
            const past7 = new Date();
            past7.setDate(past7.getDate() - 6);
            setStartDate(formatDateInput(past7));
            setEndDate(end);
        } else if (preset === 'month') {
            const startMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            setStartDate(formatDateInput(startMonth));
            setEndDate(end);
        }
    };

    const handlePrintReport = () => {
        window.print();
    };

    return (
        <>
            <Head title="Laporan Penjualan" />

            <div className="flex flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                {/* Header & Print Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Laporan Penjualan Kasir
                        </h1>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Rekapitulasi omset harian, rincian produk terjual, dan pembagian metode pembayaran.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 print:hidden">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => fetchReport(startDate, endDate)}
                            disabled={isLoading}
                            size="sm"
                        >
                            <RefreshCw className={`mr-2 size-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                            Segarkan
                        </Button>
                        <Button
                            type="button"
                            onClick={handlePrintReport}
                            disabled={isLoading || !data}
                            size="sm"
                            className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 font-semibold"
                        >
                            <Printer className="mr-2 size-4" />
                            Cetak Laporan / PDF
                        </Button>
                    </div>
                </div>

                {/* Filter Bar (Hidden in Print) */}
                <div className="p-4 rounded-xl border border-border/70 bg-card shadow-xs space-y-3 print:hidden">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        {/* Quick Presets */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-muted-foreground mr-1">
                                Periode Cepat:
                            </span>
                            <Button
                                type="button"
                                size="sm"
                                variant={activePreset === 'today' ? 'default' : 'outline'}
                                onClick={() => applyPreset('today')}
                                className="h-8 text-xs font-semibold rounded-lg"
                            >
                                Hari Ini
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                variant={activePreset === '7days' ? 'default' : 'outline'}
                                onClick={() => applyPreset('7days')}
                                className="h-8 text-xs font-semibold rounded-lg"
                            >
                                7 Hari Terakhir
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                variant={activePreset === 'month' ? 'default' : 'outline'}
                                onClick={() => applyPreset('month')}
                                className="h-8 text-xs font-semibold rounded-lg"
                            >
                                Bulan Ini
                            </Button>
                        </div>

                        {/* Date Pickers */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                                <Label htmlFor="start-date" className="text-xs text-muted-foreground whitespace-nowrap">
                                    Dari:
                                </Label>
                                <Input
                                    id="start-date"
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => {
                                        setStartDate(e.target.value);
                                        setActivePreset('custom');
                                    }}
                                    className="h-8 text-xs w-36"
                                />
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Label htmlFor="end-date" className="text-xs text-muted-foreground whitespace-nowrap">
                                    Sampai:
                                </Label>
                                <Input
                                    id="end-date"
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => {
                                        setEndDate(e.target.value);
                                        setActivePreset('custom');
                                    }}
                                    className="h-8 text-xs w-36"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Print Only Header Banner */}
                <div className="hidden print:block text-center border-b pb-4 mb-4">
                    <h2 className="text-xl font-bold uppercase">Laporan Penjualan Kantin TeFa SMK</h2>
                    <p className="text-xs text-zinc-600">
                        Periode: {startDate} s/d {endDate}
                    </p>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground space-y-2">
                        <Loader2 className="size-8 animate-spin text-primary" />
                        <p className="text-xs">Mengambil rekapitulasi data penjualan...</p>
                    </div>
                ) : !data ? (
                    <p className="text-center py-10 text-xs text-muted-foreground">
                        Data laporan tidak dapat dimuat.
                    </p>
                ) : (
                    <div className="space-y-6">
                        {/* Summary Cards */}
                        <ReportSummary
                            totalSales={data.total_sales}
                            transactionCount={data.transaction_count}
                        />

                        {/* Tables */}
                        <ReportTable
                            transactions={data.transactions}
                            itemsBreakdown={data.items_breakdown}
                        />
                    </div>
                )}
            </div>
        </>
    );
}
