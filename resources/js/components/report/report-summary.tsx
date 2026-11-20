import { Card, CardContent } from '@/components/ui/card';
import { Banknote, DollarSign, Receipt, ShoppingBag } from 'lucide-react';

type Props = {
    totalSales: number;
    transactionCount: number;
    cashSales?: number;
};

const rupiah = (val: number): string => `Rp ${val.toLocaleString('id-ID')}`;

export function ReportSummary({
    totalSales,
    transactionCount,
}: Props) {
    const aov = transactionCount > 0 ? Math.round(totalSales / transactionCount) : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Revenue */}
            <Card className="border-border/70 shadow-xs">
                <CardContent className="p-3.5 sm:p-4">
                    <div className="flex items-center justify-between">
                        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider truncate">
                            Total Penjualan Tunai
                        </p>
                        <div className="p-1.5 rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                            <DollarSign className="size-3.5" />
                        </div>
                    </div>
                    <div className="mt-1">
                        <h3 className="text-xl font-bold tracking-tight text-foreground leading-tight">
                            {rupiah(totalSales)}
                        </h3>
                        <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1 truncate">
                            <Banknote className="size-3 text-emerald-600" />
                            100% Pembayaran Tunai (Cash)
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Total Transactions */}
            <Card className="border-border/70 shadow-xs">
                <CardContent className="p-3.5 sm:p-4">
                    <div className="flex items-center justify-between">
                        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider truncate">
                            Frekuensi Transaksi
                        </p>
                        <div className="p-1.5 rounded-md bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                            <Receipt className="size-3.5" />
                        </div>
                    </div>
                    <div className="mt-1">
                        <h3 className="text-xl font-bold tracking-tight text-foreground leading-tight">
                            {transactionCount} <span className="text-sm font-normal text-muted-foreground">Nota</span>
                        </h3>
                        <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                            Total nota transaksi selesai
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Average Order Value */}
            <Card className="border-border/70 shadow-xs">
                <CardContent className="p-3.5 sm:p-4">
                    <div className="flex items-center justify-between">
                        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider truncate">
                            Rata-Rata Transaksi (AOV)
                        </p>
                        <div className="p-1.5 rounded-md bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                            <ShoppingBag className="size-3.5" />
                        </div>
                    </div>
                    <div className="mt-1">
                        <h3 className="text-xl font-bold tracking-tight text-foreground leading-tight">
                            {rupiah(aov)}
                        </h3>
                        <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                            Rata-rata belanja per pelanggan
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
