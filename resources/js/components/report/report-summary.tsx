import { Card, CardContent } from '@/components/ui/card';
import { Banknote, DollarSign, QrCode, Receipt } from 'lucide-react';

type Props = {
    totalSales: number;
    transactionCount: number;
    cashSales: number;
    qrisSales: number;
};

const rupiah = (val: number): string => `Rp ${val.toLocaleString('id-ID')}`;

export function ReportSummary({
    totalSales,
    transactionCount,
    cashSales,
    qrisSales,
}: Props) {
    const cashPct = totalSales > 0 ? Math.round((cashSales / totalSales) * 100) : 0;
    const qrisPct = totalSales > 0 ? 100 - cashPct : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Revenue */}
            <Card className="border-border/70 shadow-xs">
                <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Total Penjualan Bersih
                        </p>
                        <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                            <DollarSign className="size-4" />
                        </div>
                    </div>
                    <div className="mt-2">
                        <h3 className="text-2xl font-bold tracking-tight text-foreground">
                            {rupiah(totalSales)}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                            Dari total {transactionCount} transaksi selesai
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Total Transactions */}
            <Card className="border-border/70 shadow-xs">
                <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Frekuensi Transaksi
                        </p>
                        <div className="p-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                            <Receipt className="size-4" />
                        </div>
                    </div>
                    <div className="mt-2">
                        <h3 className="text-2xl font-bold tracking-tight text-foreground">
                            {transactionCount} <span className="text-sm font-normal text-muted-foreground">Nota</span>
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                            Rata-rata: {rupiah(transactionCount > 0 ? Math.round(totalSales / transactionCount) : 0)} / nota
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Payment Method Split */}
            <Card className="border-border/70 shadow-xs">
                <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Metode Pembayaran
                        </p>
                        <span className="text-xs font-semibold text-muted-foreground">
                            {cashPct}% Cash / {qrisPct}% QRIS
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden flex my-2">
                        <div
                            style={{ width: `${cashPct}%` }}
                            className="bg-emerald-500 h-full transition-all"
                            title={`Cash: ${cashPct}%`}
                        />
                        <div
                            style={{ width: `${qrisPct}%` }}
                            className="bg-violet-500 h-full transition-all"
                            title={`QRIS: ${qrisPct}%`}
                        />
                    </div>

                    <div className="flex justify-between items-center text-xs pt-1">
                        <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
                            <Banknote className="size-3.5" /> Tunai: {rupiah(cashSales)}
                        </span>
                        <span className="flex items-center gap-1.5 text-violet-700 dark:text-violet-400 font-medium">
                            <QrCode className="size-3.5" /> QRIS: {rupiah(qrisSales)}
                        </span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
