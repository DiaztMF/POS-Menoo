import { Head, Link } from '@inertiajs/react';
import { dashboard, pos, report } from '@/routes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, FileText, LayoutGrid } from 'lucide-react';

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-2">
                    <LayoutGrid className="size-6" />
                    <h1 className="font-serif text-2xl font-bold text-lunar-deep-roast">Dashboard</h1>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="border-border/50">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="font-serif text-base text-lunar-deep-roast">Menu Makanan</CardTitle>
                            <ShoppingCart className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-muted-foreground">Kelola menu makanan kantin</p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="font-serif text-base text-lunar-deep-roast">Menu Minuman</CardTitle>
                            <ShoppingCart className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-muted-foreground">Kelola menu minuman kantin</p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="font-serif text-base text-lunar-deep-roast">Laporan Hari Ini</CardTitle>
                            <FileText className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-muted-foreground">Lihat total penjualan hari ini</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="border-border/50">
                        <CardHeader>
                            <CardTitle className="font-serif text-base text-lunar-deep-roast">Akses Cepat</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                            <Link
                                href={pos()}
                                className="flex items-center justify-between rounded-lg border border-border/50 px-4 py-3 text-sm font-medium hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                <span className="flex items-center gap-2">
                                    <ShoppingCart className="size-4" />
                                    Buka Kasir
                                </span>
                            </Link>
                            <Link
                                href={report()}
                                className="flex items-center justify-between rounded-lg border border-border/50 px-4 py-3 text-sm font-medium hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                <span className="flex items-center gap-2">
                                    <FileText className="size-4" />
                                    Lihat Laporan
                                </span>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50">
                        <CardHeader>
                            <CardTitle className="font-serif text-base text-lunar-deep-roast">Informasi</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm text-muted-foreground">
                            <p>Menoo adalah sistem kasir kantin berbasis web yang dapat digunakan secara offline.</p>
                            <p>Fitur utama: kasir mobile-first, laporan penjualan harian, dan pengelompokan menu makanan/minuman.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};