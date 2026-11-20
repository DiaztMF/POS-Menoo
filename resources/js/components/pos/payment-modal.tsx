import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Banknote, CheckCircle2, Loader2, QrCode } from 'lucide-react';

type Props = {
    open: boolean;
    onClose: () => void;
    totalAmount: number;
    onConfirmPayment: (paymentMethod: 'cash' | 'qris', cashGiven: number) => Promise<void>;
    isSubmitting: boolean;
};

const rupiah = (val: number): string => `Rp ${val.toLocaleString('id-ID')}`;

export function PaymentModal({
    open,
    onClose,
    totalAmount,
    onConfirmPayment,
    isSubmitting,
}: Props) {
    const [method, setMethod] = useState<'cash' | 'qris'>('cash');
    const [cashInput, setCashInput] = useState<string>('');

    // Pre-calculate smart quick cash buttons
    const quickCashOptions = useMemo(() => {
        const standardPecahan = [10000, 20000, 50000, 100000];
        const options: { label: string; value: number }[] = [
            { label: 'Uang Pas', value: totalAmount },
        ];

        standardPecahan.forEach((pecahan) => {
            if (pecahan >= totalAmount && pecahan !== totalAmount) {
                options.push({ label: rupiah(pecahan), value: pecahan });
            }
        });

        // Add 1 higher round step if needed
        const nextRounded = Math.ceil(totalAmount / 10000) * 10000;
        if (nextRounded > totalAmount && !options.some((o) => o.value === nextRounded)) {
            options.push({ label: rupiah(nextRounded), value: nextRounded });
        }

        return options;
    }, [totalAmount]);

    const numCashGiven = method === 'cash' ? (Number(cashInput) || 0) : totalAmount;
    const change = numCashGiven - totalAmount;
    const isSufficient = method === 'qris' || numCashGiven >= totalAmount;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isSufficient || isSubmitting) return;
        await onConfirmPayment(method, numCashGiven);
    };

    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="max-w-md p-6">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <span>Pilih Pembayaran</span>
                    </DialogTitle>
                </DialogHeader>

                {/* Total display banner */}
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center my-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Total Tagihan
                    </p>
                    <p className="text-3xl font-extrabold text-foreground mt-1">
                        {rupiah(totalAmount)}
                    </p>
                </div>

                {/* Method selector tabs */}
                <div className="grid grid-cols-2 gap-2 my-2 p-1 bg-muted rounded-lg">
                    <button
                        type="button"
                        onClick={() => {
                            setMethod('cash');
                            setCashInput('');
                        }}
                        className={`flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-md transition-all ${
                            method === 'cash'
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <Banknote className="size-4" />
                        Tunai (Cash)
                    </button>
                    <button
                        type="button"
                        onClick={() => setMethod('qris')}
                        className={`flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-md transition-all ${
                            method === 'qris'
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <QrCode className="size-4" />
                        QRIS Statis
                    </button>
                </div>

                {method === 'cash' ? (
                    <div className="space-y-4 my-2">
                        {/* Quick cash chips */}
                        <div>
                            <Label className="text-xs text-muted-foreground mb-2 block">
                                Pilihan Cepat Uang Diterima:
                            </Label>
                            <div className="flex flex-wrap gap-2">
                                {quickCashOptions.map((opt, i) => (
                                    <Button
                                        key={i}
                                        type="button"
                                        size="sm"
                                        variant={numCashGiven === opt.value ? 'default' : 'outline'}
                                        onClick={() => setCashInput(String(opt.value))}
                                        className="h-8 text-xs font-medium"
                                    >
                                        {opt.label}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Custom input */}
                        <div className="space-y-1.5">
                            <Label htmlFor="cash-input" className="text-xs font-medium">
                                Masukkan Nominal Tunai (Rp)
                            </Label>
                            <Input
                                id="cash-input"
                                type="number"
                                placeholder={`Contoh: ${totalAmount}`}
                                value={cashInput}
                                onChange={(e) => setCashInput(e.target.value)}
                                className="text-base font-semibold"
                                autoFocus
                            />
                        </div>

                        {/* Calculation feedback */}
                        <div
                            className={`p-3 rounded-lg border text-sm flex items-center justify-between ${
                                isSufficient
                                    ? 'bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                                    : 'bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                            }`}
                        >
                            <span>
                                {isSufficient ? 'Kembalian:' : 'Uang Kurang:'}
                            </span>
                            <span className="font-bold text-base">
                                {rupiah(Math.abs(change))}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="text-center p-4 border border-border/80 rounded-xl space-y-3 bg-card">
                        <div className="inline-flex p-3 bg-white rounded-lg shadow-sm border">
                            <QrCode className="size-32 text-zinc-900" />
                        </div>
                        <div>
                            <p className="font-bold text-sm">QRIS Kantin TeFa SMK</p>
                            <p className="text-xs text-muted-foreground">NMID: ID1020039485721</p>
                        </div>
                        <p className="text-xs bg-muted/60 p-2 rounded text-muted-foreground">
                            Scan QR di atas melalui GoPay, OVO, Dana, BCA, atau mobile banking lainnya.
                        </p>
                    </div>
                )}

                <DialogFooter className="pt-2 flex gap-2 sm:justify-between">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Batal
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!isSufficient || isSubmitting}
                        className="bg-primary text-primary-foreground font-semibold px-6"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 size-4 animate-spin" />
                                Memproses...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="mr-2 size-4" />
                                {method === 'cash' ? 'Selesaikan Transaksi' : 'Konfirmasi QRIS Berhasil'}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
