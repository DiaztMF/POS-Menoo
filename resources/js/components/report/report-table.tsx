import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, FileText, Utensils } from 'lucide-react';
import { ReceiptDialog, type ReceiptData } from '@/components/pos/receipt-dialog';

export type ReportTransaction = {
    id: number;
    invoice_no: string;
    date: string;
    cashier: string;
    payment_method: string;
    total_amount: number;
    cash_given: number;
    change_amount: number;
    items_count: number;
    items: {
        name: string;
        quantity: number;
        unit_price: number;
        subtotal: number;
    }[];
};

export type ReportItemBreakdown = {
    menu_item_id: number;
    menu_item_name: string;
    category: string;
    quantity: number;
    revenue: number;
};

type Props = {
    transactions: ReportTransaction[];
    itemsBreakdown: ReportItemBreakdown[];
};

const rupiah = (val: number): string => `Rp ${val.toLocaleString('id-ID')}`;

export function ReportTable({ transactions, itemsBreakdown }: Props) {
    const [selectedReceipt, setSelectedReceipt] = useState<ReceiptData | null>(null);

    return (
        <div className="space-y-6">
            {/* Top Items Breakdown */}
            <Card className="border-border/70 shadow-xs">
                <CardHeader className="pb-3 border-b border-border/40">
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                        <Utensils className="size-4 text-primary" />
                        Rincian Penjualan per Menu
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {itemsBreakdown.length === 0 ? (
                        <p className="p-6 text-center text-xs text-muted-foreground">
                            Tidak ada penjualan menu pada periode ini.
                        </p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/30">
                                    <TableHead className="w-12 text-center">#</TableHead>
                                    <TableHead>Nama Menu</TableHead>
                                    <TableHead>Kategori</TableHead>
                                    <TableHead className="text-center">Kuantitas Terjual</TableHead>
                                    <TableHead className="text-right">Total Pendapatan</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {itemsBreakdown.map((item, idx) => (
                                    <TableRow key={item.menu_item_id}>
                                        <TableCell className="text-center font-medium text-xs text-muted-foreground">
                                            {idx + 1}
                                        </TableCell>
                                        <TableCell className="font-semibold text-xs text-foreground">
                                            {item.menu_item_name}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-[10px]">
                                                {item.category}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center font-bold text-xs">
                                            {item.quantity} porsi
                                        </TableCell>
                                        <TableCell className="text-right font-bold text-xs text-foreground">
                                            {rupiah(item.revenue)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Detailed Transaction History Table */}
            <Card className="border-border/70 shadow-xs">
                <CardHeader className="pb-3 border-b border-border/40">
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                        <FileText className="size-4 text-primary" />
                        Buku Riwayat Transaksi (Ledger)
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {transactions.length === 0 ? (
                        <p className="p-6 text-center text-xs text-muted-foreground">
                            Tidak ada data transaksi pada rentang tanggal yang dipilih.
                        </p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/30">
                                    <TableHead>No. Invoice</TableHead>
                                    <TableHead>Tanggal & Waktu</TableHead>
                                    <TableHead>Kasir</TableHead>
                                    <TableHead>Metode</TableHead>
                                    <TableHead className="text-center">Jumlah Item</TableHead>
                                    <TableHead className="text-right">Total Transaksi</TableHead>
                                    <TableHead className="text-center w-24">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.map((tx) => (
                                    <TableRow key={tx.id}>
                                        <TableCell className="font-semibold text-xs">
                                            {tx.invoice_no}
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {tx.date}
                                        </TableCell>
                                        <TableCell className="text-xs">
                                            {tx.cashier}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`text-[10px] uppercase font-bold ${
                                                    tx.payment_method === 'cash'
                                                        ? 'text-emerald-700 border-emerald-300 dark:text-emerald-400'
                                                        : 'text-violet-700 border-violet-300 dark:text-violet-400'
                                                }`}
                                            >
                                                {tx.payment_method}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center text-xs">
                                            {tx.items_count} item
                                        </TableCell>
                                        <TableCell className="text-right font-bold text-xs text-foreground">
                                            {rupiah(tx.total_amount)}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="ghost"
                                                onClick={() =>
                                                    setSelectedReceipt({
                                                        invoice_no: tx.invoice_no,
                                                        date: tx.date,
                                                        cashier: tx.cashier,
                                                        total_amount: tx.total_amount,
                                                        cash_given: tx.cash_given,
                                                        change_amount: tx.change_amount,
                                                        payment_method: tx.payment_method,
                                                        items: tx.items,
                                                    })
                                                }
                                                className="h-7 text-xs"
                                            >
                                                <Eye className="size-3.5 mr-1" />
                                                Struk
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Receipt Modal for Re-printing */}
            <ReceiptDialog
                open={Boolean(selectedReceipt)}
                onClose={() => setSelectedReceipt(null)}
                receipt={selectedReceipt}
            />
        </div>
    );
}
