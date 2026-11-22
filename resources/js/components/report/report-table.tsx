import { useState, useEffect } from 'react';
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
import { DataTablePagination } from '@/components/ui/data-table-pagination';
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

    // Pagination states
    const [breakdownPage, setBreakdownPage] = useState(1);
    const breakdownPageSize = 5;
    const totalBreakdownPages = Math.ceil(itemsBreakdown.length / breakdownPageSize);
    const paginatedItems = itemsBreakdown.slice(
        (breakdownPage - 1) * breakdownPageSize,
        breakdownPage * breakdownPageSize
    );

    const [ledgerPage, setLedgerPage] = useState(1);
    const ledgerPageSize = 5;
    const totalLedgerPages = Math.ceil(transactions.length / ledgerPageSize);
    const paginatedTransactions = transactions.slice(
        (ledgerPage - 1) * ledgerPageSize,
        ledgerPage * ledgerPageSize
    );

    // Reset pagination when data updates (e.g. date filter change)
    useEffect(() => {
        setBreakdownPage(1);
        setLedgerPage(1);
    }, [itemsBreakdown.length, transactions.length]);

    return (
        <div className="space-y-6">
            {/* Top Items Breakdown */}
            <Card className="border-border/70 shadow-xs flex flex-col justify-between">
                <CardHeader className="pb-3 border-b border-border/40 shrink-0">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-bold flex items-center gap-2">
                            <Utensils className="size-4 text-primary" />
                            Rincian Penjualan per Menu
                        </CardTitle>
                        <span className="text-xs text-muted-foreground font-medium">
                            {itemsBreakdown.length} varian menu terjual
                        </span>
                    </div>
                </CardHeader>
                <CardContent className="p-0 flex flex-col justify-between flex-1">
                    {itemsBreakdown.length === 0 ? (
                        <div className="min-h-[285px] flex items-center justify-center p-6 text-center text-xs text-muted-foreground">
                            Tidak ada penjualan menu pada periode ini.
                        </div>
                    ) : (
                        <>
                            <div className="min-h-[285px] overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-b border-border/80 bg-muted/40 hover:bg-muted/40">
                                            <TableHead className="w-14 text-center whitespace-nowrap">#</TableHead>
                                            <TableHead className="min-w-[240px] whitespace-nowrap">Nama Menu</TableHead>
                                            <TableHead className="w-40 whitespace-nowrap">Kategori</TableHead>
                                            <TableHead className="text-center w-44 whitespace-nowrap">Kuantitas Terjual</TableHead>
                                            <TableHead className="text-right w-48 whitespace-nowrap">Total Pendapatan</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedItems.map((item, idx) => (
                                            <TableRow key={item.menu_item_id}>
                                                <TableCell className="text-center font-medium text-xs text-muted-foreground whitespace-nowrap">
                                                    {(breakdownPage - 1) * breakdownPageSize + idx + 1}
                                                </TableCell>
                                                <TableCell className="font-semibold text-xs text-foreground whitespace-nowrap">
                                                    {item.menu_item_name}
                                                </TableCell>
                                                <TableCell className="whitespace-nowrap">
                                                    <Badge variant="outline" className="text-[10px]">
                                                        {item.category}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-center font-bold text-xs whitespace-nowrap">
                                                    {item.quantity} porsi
                                                </TableCell>
                                                <TableCell className="text-right font-bold text-xs text-foreground whitespace-nowrap">
                                                    {rupiah(item.revenue)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            <DataTablePagination
                                currentPage={breakdownPage}
                                totalPages={totalBreakdownPages}
                                totalItems={itemsBreakdown.length}
                                pageSize={breakdownPageSize}
                                onPageChange={setBreakdownPage}
                            />
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Detailed Transaction History Table */}
            <Card className="border-border/70 shadow-xs flex flex-col justify-between">
                <CardHeader className="pb-3 border-b border-border/40 shrink-0">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-bold flex items-center gap-2">
                            <FileText className="size-4 text-primary" />
                            Buku Riwayat Transaksi (Ledger)
                        </CardTitle>
                        <span className="text-xs text-muted-foreground font-medium">
                            {transactions.length} total transaksi
                        </span>
                    </div>
                </CardHeader>
                <CardContent className="p-0 flex flex-col justify-between flex-1">
                    {transactions.length === 0 ? (
                        <div className="min-h-[285px] flex items-center justify-center p-6 text-center text-xs text-muted-foreground">
                            Tidak ada data transaksi pada rentang tanggal yang dipilih.
                        </div>
                    ) : (
                        <>
                            <div className="min-h-[285px] overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-b border-border/80 bg-muted/40 hover:bg-muted/40">
                                            <TableHead className="w-48 whitespace-nowrap">No. Invoice</TableHead>
                                            <TableHead className="w-48 whitespace-nowrap">Tanggal & Waktu</TableHead>
                                            <TableHead className="min-w-[160px] whitespace-nowrap">Kasir</TableHead>
                                            <TableHead className="text-center w-32 whitespace-nowrap">Metode</TableHead>
                                            <TableHead className="text-center w-36 whitespace-nowrap">Jumlah Item</TableHead>
                                            <TableHead className="text-right w-44 whitespace-nowrap">Total Transaksi</TableHead>
                                            <TableHead className="text-center w-24 whitespace-nowrap">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedTransactions.map((tx) => (
                                            <TableRow key={tx.id}>
                                                <TableCell className="font-semibold text-xs whitespace-nowrap font-mono">
                                                    {tx.invoice_no}
                                                </TableCell>
                                                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                                    {tx.date}
                                                </TableCell>
                                                <TableCell className="text-xs whitespace-nowrap">
                                                    {tx.cashier}
                                                </TableCell>
                                                <TableCell className="text-center whitespace-nowrap">
                                                    <Badge
                                                        variant="outline"
                                                        className="text-[10px] uppercase font-bold text-amber-900 border-amber-300 bg-amber-50/50"
                                                    >
                                                        {tx.payment_method}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-center text-xs whitespace-nowrap">
                                                    {tx.items_count} item
                                                </TableCell>
                                                <TableCell className="text-right font-bold text-xs text-foreground whitespace-nowrap">
                                                    {rupiah(tx.total_amount)}
                                                </TableCell>
                                                <TableCell className="text-center whitespace-nowrap">
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
                            </div>
                            <DataTablePagination
                                currentPage={ledgerPage}
                                totalPages={totalLedgerPages}
                                totalItems={transactions.length}
                                pageSize={ledgerPageSize}
                                onPageChange={setLedgerPage}
                            />
                        </>
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
