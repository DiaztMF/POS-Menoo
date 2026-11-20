import { Head, Link } from '@inertiajs/react';
import { StatCard } from '@/components/dashboard/stat-card';
import { SalesTrendChart } from '@/components/dashboard/sales-trend-chart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    ArrowRight,
    Banknote,
    Clock,
    DollarSign,
    QrCode,
    Receipt,
    ShoppingBag,
    ShoppingCart,
    Trophy,
    Utensils,
} from 'lucide-react';

type Props = {
    metrics: {
        today_sales: number;
        today_transactions: number;
        average_order_value: number;
        top_item_today: string;
    };
    sales_trend_7d: {
        date: string;
        day: string;
        formatted: string;
        total: number;
    }[];
    recent_transactions: {
        id: number;
        invoice_no: string;
        total_amount: number;
        payment_method: string;
        items_count: number;
        time: string;
        date: string;
    }[];
    top_items: {
        id: number;
        name: string;
        category: string;
        total_qty: number;
        total_revenue: number;
    }[];
};

const rupiah = (val: number): string => `Rp ${val.toLocaleString('id-ID')}`;

export default function Dashboard({
    metrics,
    sales_trend_7d,
    recent_transactions,
    top_items,
}: Props) {
    return (
        <>
            <Head title="Dashboard" />

            <div className="flex flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                {/* Header Section with Quick Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Ringkasan Penjualan
                        </h1>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Performa transaksi dan operasional kasir Kantin TeFa hari ini.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button asChild className="bg-primary text-primary-foreground font-semibold shadow-xs">
                            <Link href="/pos">
                                <ShoppingCart className="mr-2 size-4" />
                                Buka Kasir (POS)
                            </Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/laporan">
                                <Receipt className="mr-2 size-4" />
                                Laporan Lengkap
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* 4 KPI Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Omset Hari Ini"
                        value={rupiah(metrics.today_sales)}
                        subtitle="Total penjualan kotor"
                        icon={DollarSign}
                        accentColor="text-amber-800 dark:text-amber-400"
                    />
                    <StatCard
                        title="Total Transaksi"
                        value={`${metrics.today_transactions} Nota`}
                        subtitle="Transaksi selesai hari ini"
                        icon={Receipt}
                        accentColor="text-blue-600 dark:text-blue-400"
                    />
                    <StatCard
                        title="Rata-rata Keranjang (AOV)"
                        value={rupiah(metrics.average_order_value)}
                        subtitle="Rata-rata nilai per nota"
                        icon={ShoppingBag}
                        accentColor="text-purple-600 dark:text-purple-400"
                    />
                    <StatCard
                        title="Menu Terlaris Hari Ini"
                        value={metrics.top_item_today}
                        subtitle="Paling diminati pelanggan"
                        icon={Trophy}
                        accentColor="text-amber-600 dark:text-amber-400"
                    />
                </div>

                {/* Middle Grid: Sales Trend Chart (60%) & Recent Orders (40%) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* 7-Day Chart (2 Cols) */}
                    <div className="lg:col-span-2">
                        <SalesTrendChart data={sales_trend_7d} />
                    </div>

                    {/* Recent Transactions (1 Col) */}
                    <Card className="border-border/70 shadow-xs flex flex-col justify-between">
                        <CardHeader className="pb-3 border-b border-border/40 flex flex-row items-center justify-between">
                            <CardTitle className="text-base font-bold flex items-center gap-2">
                                <Clock className="size-4 text-muted-foreground" />
                                Transaksi Terkini
                            </CardTitle>
                            <Link
                                href="/laporan"
                                className="text-xs text-primary hover:underline font-medium flex items-center"
                            >
                                Semua <ArrowRight className="size-3 ml-0.5" />
                            </Link>
                        </CardHeader>
                        <CardContent className="pt-3 flex-1 flex flex-col justify-between">
                            {recent_transactions.length === 0 ? (
                                <p className="text-xs text-center text-muted-foreground py-8">
                                    Belum ada transaksi hari ini
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {recent_transactions.map((tx) => (
                                        <div
                                            key={tx.id}
                                            className="flex items-center justify-between p-2.5 rounded-lg border border-border/50 bg-muted/20"
                                        >
                                            <div className="space-y-0.5">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-semibold text-xs text-foreground">
                                                        {tx.invoice_no}
                                                    </span>
                                                    <Badge
                                                        variant="outline"
                                                        className="text-[9px] uppercase px-1 py-0 text-amber-900 border-amber-300 bg-amber-50/50"
                                                    >
                                                        {tx.payment_method}
                                                    </Badge>
                                                </div>
                                                <p className="text-[11px] text-muted-foreground">
                                                    {tx.time} WIB • {tx.items_count} item
                                                </p>
                                            </div>
                                            <span className="font-bold text-sm text-foreground">
                                                {rupiah(tx.total_amount)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="pt-4 border-t border-border/40 mt-4">
                                <Button asChild variant="outline" size="sm" className="w-full text-xs">
                                    <Link href="/pos">Mulai Kasir Baru</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Bottom Section: Top 5 Menu Items Ranking */}
                <Card className="border-border/70 shadow-xs">
                    <CardHeader className="pb-3 border-b border-border/40 flex flex-row items-center justify-between">
                        <CardTitle className="text-base font-bold flex items-center gap-2">
                            <Utensils className="size-4 text-primary" />
                            Top 5 Menu Paling Laris (7 Hari Terakhir)
                        </CardTitle>
                        <Link href="/menu" className="text-xs text-primary hover:underline font-medium">
                            Kelola Semua Menu
                        </Link>
                    </CardHeader>
                    <CardContent className="pt-3">
                        {top_items.length === 0 ? (
                            <p className="text-xs text-center text-muted-foreground py-6">
                                Belum ada riwayat penjualan menu
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                                {top_items.map((item, idx) => (
                                    <div
                                        key={item.id}
                                        className="p-3 rounded-xl border border-border/60 bg-muted/10 space-y-2 relative"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="size-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                                                #{idx + 1}
                                            </span>
                                            <Badge variant="secondary" className="text-[10px]">
                                                {item.category}
                                            </Badge>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-xs leading-snug line-clamp-2">
                                                {item.name}
                                            </h4>
                                            <p className="text-[11px] text-muted-foreground mt-1">
                                                Terjual: <span className="font-bold text-foreground">{item.total_qty}</span>
                                            </p>
                                        </div>
                                        <div className="pt-1.5 border-t border-border/40 text-xs font-bold text-primary">
                                            {rupiah(item.total_revenue)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
