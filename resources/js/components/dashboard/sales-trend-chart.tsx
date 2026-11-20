import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

type TrendData = {
    date: string;
    day: string;
    formatted: string;
    total: number;
};

type Props = {
    data: TrendData[];
};

const rupiah = (val: number): string => `Rp ${val.toLocaleString('id-ID')}`;

export function SalesTrendChart({ data }: Props) {
    return (
        <Card className="border-border/70 bg-card shadow-xs h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/40 min-h-[64px]">
                <div className="space-y-0.5">
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                        <TrendingUp className="size-4 text-primary" />
                        Tren Penjualan 7 Hari Terakhir
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                        Omset kotor harian dari seluruh transaksi yang lunas
                    </p>
                </div>
            </CardHeader>
            <CardContent className="pt-4 flex-1 flex flex-col justify-center">
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={data}
                            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-primary, #3e2723)" stopOpacity={0.35} />
                                    <stop offset="95%" stopColor="var(--color-primary, #3e2723)" stopOpacity={0.0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150, 150, 150, 0.15)" />
                            <XAxis
                                dataKey="formatted"
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 11, fill: 'currentColor' }}
                                className="text-muted-foreground"
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(val) => `${Math.round(val / 1000)}k`}
                                tick={{ fontSize: 11, fill: 'currentColor' }}
                                className="text-muted-foreground"
                            />
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const p = payload[0].payload as TrendData;
                                        return (
                                            <div className="bg-popover border border-border shadow-md rounded-lg p-2.5 text-xs">
                                                <p className="font-semibold text-foreground mb-1">
                                                    {p.day}, {p.formatted}
                                                </p>
                                                <p className="font-bold text-primary">
                                                    {rupiah(p.total)}
                                                </p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="total"
                                stroke="var(--color-primary, #3e2723)"
                                strokeWidth={2.5}
                                fillOpacity={1}
                                fill="url(#colorSales)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
