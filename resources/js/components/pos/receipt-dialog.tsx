import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Printer, RefreshCw } from 'lucide-react';

export type ReceiptData = {
    invoice_no: string;
    date: string;
    cashier: string;
    total_amount: number;
    cash_given: number;
    change_amount: number;
    payment_method: string;
    items: {
        name: string;
        quantity: number;
        unit_price: number;
        subtotal: number;
    }[];
};

type Props = {
    open: boolean;
    onClose: () => void;
    receipt: ReceiptData | null;
};

const rupiah = (val: number): string => `Rp ${val.toLocaleString('id-ID')}`;

export function ReceiptDialog({ open, onClose, receipt }: Props) {
    if (!receipt) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="max-w-md p-0 overflow-hidden bg-background">
                <DialogHeader className="p-4 border-b border-border/60">
                    <DialogTitle className="text-base font-semibold text-center">
                        Struk Transaksi Selesai
                    </DialogTitle>
                </DialogHeader>

                {/* Printable receipt paper section */}
                <div className="p-6 bg-white text-zinc-900 font-mono text-xs max-h-[60vh] overflow-y-auto print:max-h-none print:overflow-visible print:p-0 print:m-0 print:w-[58mm] print:text-[10px]" id="receipt-area">
                    {/* Store Header */}
                    <div className="text-center space-y-1 mb-3">
                        <h2 className="font-bold text-sm tracking-wide uppercase">Kantin TeFa SMK</h2>
                        <p className="text-[10px] text-zinc-600">Teaching Factory Food & Beverage</p>
                        <p className="text-[10px] text-zinc-500">Jl. Pelajar No. 2, Surakarta</p>
                    </div>

                    <div className="border-t border-dashed border-zinc-400 my-2" />

                    {/* Metadata */}
                    <div className="space-y-0.5 text-[11px] mb-2">
                        <div className="flex justify-between">
                            <span className="text-zinc-500">No. Nota:</span>
                            <span className="font-semibold">{receipt.invoice_no}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-zinc-500">Tanggal:</span>
                            <span>{receipt.date}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-zinc-500">Kasir:</span>
                            <span>{receipt.cashier}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-zinc-500">Metode:</span>
                            <span className="uppercase font-semibold">TUNAI</span>
                        </div>
                    </div>

                    <div className="border-t border-dashed border-zinc-400 my-2" />

                    {/* Items table */}
                    <div className="space-y-1.5 my-2">
                        {receipt.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-start">
                                <div className="pr-2">
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-[10px] text-zinc-500">
                                        {item.quantity} x {rupiah(item.unit_price)}
                                    </p>
                                </div>
                                <span className="font-medium whitespace-nowrap">{rupiah(item.subtotal)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-dashed border-zinc-400 my-2" />

                    {/* Totals */}
                    <div className="space-y-1 text-[11px] my-2">
                        <div className="flex justify-between text-xs font-bold pt-1">
                            <span>TOTAL:</span>
                            <span>{rupiah(receipt.total_amount)}</span>
                        </div>
                        <div className="flex justify-between text-zinc-600">
                            <span>Tunai Diterima:</span>
                            <span>{rupiah(receipt.cash_given)}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-emerald-800">
                            <span>Kembalian:</span>
                            <span>{rupiah(receipt.change_amount)}</span>
                        </div>
                    </div>

                    <div className="border-t border-dashed border-zinc-400 my-3" />

                    {/* Footer note */}
                    <div className="text-center text-[10px] text-zinc-500 space-y-0.5">
                        <p>Terima kasih atas kunjungan Anda!</p>
                        <p>Barang yang sudah dibeli tidak dapat ditukar.</p>
                    </div>
                </div>

                <DialogFooter className="p-4 bg-muted/40 border-t border-border/60 flex sm:justify-between gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                    >
                        <RefreshCw className="mr-2 size-4" />
                        Transaksi Baru
                    </Button>
                    <Button
                        type="button"
                        onClick={handlePrint}
                        className="flex-1 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
                    >
                        <Printer className="mr-2 size-4" />
                        Cetak Struk
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
