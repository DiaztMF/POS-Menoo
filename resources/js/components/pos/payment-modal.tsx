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
import { Banknote, CheckCircle2, Loader2 } from 'lucide-react';

type Props = {
    open: boolean;
    onClose: () => void;
    totalAmount: number;
    onConfirmPayment: (cashGiven: number) => Promise<void>;
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

    const numCashGiven = Number(cashInput) || 0;
    const change = numCashGiven - totalAmount;
    const isSufficient = numCashGiven >= totalAmount;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isSufficient || isSubmitting) return;
        await onConfirmPayment(numCashGiven);
    };

    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="w-[95vw] sm:max-w-md p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl font-bold flex items-center gap-2">
                        <Banknote className="size-5 text-primary" />
                        <span>Pembayaran Tunai (Cash)</span>
                    </DialogTitle>
                </DialogHeader>

                {/* Total display banner */}
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 sm:p-4 text-center my-2">
                    <p className="text-[11px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Total Tagihan
                    </p>
                    <p className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">
                        {rupiah(totalAmount)}
                    </p>
                </div>

                <div className="space-y-3 sm:space-y-4 my-2">
                    {/* Quick cash chips */}
                    <div>
                        <Label className="text-xs text-muted-foreground mb-1.5 sm:mb-2 block">
                            Pilihan Cepat Uang Diterima:
                        </Label>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
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
                                ? 'bg-[#efebe9] text-[#3e2723] border-[#d7ccc8]'
                                : 'bg-amber-50 text-amber-900 border-amber-200'
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

                <DialogFooter className="pt-2 flex flex-col-reverse sm:flex-row gap-2 sm:justify-between">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="w-full sm:w-auto"
                    >
                        Batal
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!isSufficient || isSubmitting}
                        className="w-full sm:w-auto bg-primary text-primary-foreground font-semibold px-6"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 size-4 animate-spin" />
                                Memproses...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="mr-2 size-4" />
                                Selesaikan Transaksi (Tunai)
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
