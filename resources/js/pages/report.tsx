import { Head, Link } from '@inertiajs/react';
import { pos, report } from '@/routes';
import { daily } from '@/routes/report';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Calendar, CreditCard, Loader2, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

type DailyReport = {
    date: string;
    total_sales: number;
    transaction_count: number;
    items_breakdown: {
        menu_item_id: number;
        menu_item_name: string;
        quantity: number;
        revenue: number;
    }[];
};

const rupiah = (value: number): string => `Rp ${value.toLocaleString('id-ID')}`;

const localToday = (): string => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${now.getFullYear()}-${month}-${day}`;
};

export default function Report() {
    const [data, setData] = useState<DailyReport | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>(localToday());
    const [loading, setLoading] = useState(false);

    const fetchReport = async () => {
        setLoading(true);
        try {
            const res = await fetch(daily.url({ query: { date: selectedDate } }), {
                headers: { Accept: 'application/json' },
            });
            if (!res.ok) {
                throw new Error('Gagal memuat laporan');
            }
            setData(await res.json());
        } catch {
            setData(null);
            toast.error('Gagal memuat laporan');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head title="Laporan Penjualan" />
            <div className="flex-1 space-y-4 overflow-y-auto p-4 md:p-6">
                <Link
                    href={pos()}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    <ArrowLeft className="size-3.5" aria-hidden="true" />
                    Kembali ke Kasir
                </Link>

                {/* Filter */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                    <div className="flex-1">
                        <label
                            htmlFor="report-date"
                            className="mb-1.5 block text-xs font-medium text-muted-foreground"
                        >
                            Tanggal
                        </label>
                        <input
                            id="report-date"
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                    </div>
                    <Button onClick={fetchReport} disabled={loading} className="shrink-0">
                        {loading ? (
                            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                        ) : (
                            <Calendar className="size-4" aria-hidden="true" />
                        )}
                        {loading ? 'Memuat...' : 'Lihat Laporan'}
                    </Button>
                </div>

                {/* Summary */}
                {data && (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        <Card className="border-border/50">
                            <CardContent className="flex items-center gap-3 p-4">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                    <CreditCard className="size-5 text-primary" aria-hidden="true" />
                                </div>
                                <div className="min-w-0">
                                    <div className="text-xs text-muted-foreground">Total Penjualan</div>
                                    <div className="truncate font-serif text-xl font-bold tabular-nums text-lunar-deep-roast">
                                        {rupiah(data.total_sales)}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-border/50">
                            <CardContent className="flex items-center gap-3 p-4">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                    <ShoppingBag className="size-5 text-primary" aria-hidden="true" />
                                </div>
                                <div className="min-w-0">
                                    <div className="text-xs text-muted-foreground">Jumlah Transaksi</div>
                                    <div className="font-serif text-xl font-bold tabular-nums text-lunar-deep-roast">
                                        {data.transaction_count}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-border/50">
                            <CardContent className="flex items-center gap-3 p-4">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                    <Calendar className="size-5 text-primary" aria-hidden="true" />
                                </div>
                                <div className="min-w-0">
                                    <div className="text-xs text-muted-foreground">Tanggal</div>
                                    <div className="text-xs font-medium">
                                        {new Date(data.date).toLocaleDateString('id-ID', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Breakdown table */}
                {data && data.items_breakdown.length > 0 && (
                    <Card className="border-border/50">
                        <CardHeader className="pb-3">
                            <CardTitle className="font-serif text-lg text-lunar-deep-roast">Rincian per Menu</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-border/50 hover:bg-transparent">
                                            <TableHead className="text-xs">Menu</TableHead>
                                            <TableHead className="text-right text-xs">Qty</TableHead>
                                            <TableHead className="text-right text-xs">Pendapatan</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.items_breakdown.map((item) => (
                                            <TableRow key={item.menu_item_id} className="border-border/50">
                                                <TableCell className="py-2.5 text-xs font-medium">
                                                    {item.menu_item_name}
                                                </TableCell>
                                                <TableCell className="py-2.5 text-right text-xs tabular-nums">
                                                    {item.quantity}
                                                </TableCell>
                                                <TableCell className="py-2.5 text-right text-xs tabular-nums">
                                                    {rupiah(item.revenue)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow className="border-t-2 border-border font-semibold hover:bg-transparent">
                                            <TableCell className="py-2.5 text-xs">Total</TableCell>
                                            <TableCell className="py-2.5 text-right text-xs tabular-nums">
                                                {data.items_breakdown.reduce((s, i) => s + i.quantity, 0)}
                                            </TableCell>
                                            <TableCell className="py-2.5 text-right text-xs tabular-nums">
                                                {rupiah(data.items_breakdown.reduce((s, i) => s + i.revenue, 0))}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Empty state */}
                {!data && !loading && (
                    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                        <ShoppingBag className="mb-3 size-12 opacity-20" aria-hidden="true" />
                        <p className="text-sm">Tekan "Lihat Laporan" untuk menampilkan data penjualan.</p>
                    </div>
                )}
            </div>
        </>
    );
}

Report.layout = {
    breadcrumbs: [
        {
            title: 'Laporan',
            href: report(),
        },
    ],
};