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
                <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Total Penjualan Tunai
                        </p>
                        <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                            <DollarSign className="size-4" />
                        </div>
                    </div>
                    <div className="mt-2">
                        <h3 className="text-2xl font-bold tracking-tight text-foreground">
                            {rupiah(totalSales)}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Banknote className="size-3 text-emerald-600" />
                            100% Pembayaran Tunai (Cash)
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
                            Total nota transaksi selesai
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Average Order Value */}
            <Card className="border-border/70 shadow-xs">
                <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Rata-Rata Transaksi (AOV)
                        </p>
                        <div className="p-2 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                            <ShoppingBag className="size-4" />
                        </div>
                    </div>
                    <div className="mt-2">
                        <h3 className="text-2xl font-bold tracking-tight text-foreground">
                            {rupiah(aov)}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                            Rata-rata belanja per pelanggan
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
