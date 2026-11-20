import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { pos } from '@/routes';
import { checkout, menu } from '@/routes/pos';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Minus, Plus, Search, ShoppingBag, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

type MenuCategory = {
    id: number;
    name: string;
    slug: string;
    items: { id: number; name: string; price: number }[];
};

type FlatItem = { id: number; name: string; price: number; categorySlug: string };

type CartItem = {
    menu_item_id: number;
    name: string;
    price: number;
    quantity: number;
};

const rupiah = (value: number): string => `Rp ${value.toLocaleString('id-ID')}`;

export default function Pos() {
    const [categories, setCategories] = useState<MenuCategory[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [menuLoading, setMenuLoading] = useState(true);
    const [menuError, setMenuError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [cashGiven, setCashGiven] = useState('');
    const [payError, setPayError] = useState<string | null>(null);
    const [completedOrder, setCompletedOrder] = useState<{ total: number; change: number } | null>(null);

    const fetchMenu = async () => {
        setMenuLoading(true);
        setMenuError(false);
        try {
            const res = await fetch(menu.url(), { headers: { Accept: 'application/json' } });
            if (!res.ok) {
                throw new Error('Gagal memuat menu');
            }
            setCategories(await res.json());
        } catch {
            setMenuError(true);
        } finally {
            setMenuLoading(false);
        }
    };

    useEffect(() => {
        fetchMenu();
    }, []);

    const allItems = useMemo<FlatItem[]>(
        () =>
            categories.flatMap((c) =>
                c.items.map((i) => ({ ...i, categorySlug: c.slug })),
            ),
        [categories],
    );

    const filteredItems = useMemo(
        () =>
            allItems.filter(
                (i) =>
                    (activeCategory === 'all' || i.categorySlug === activeCategory) &&
                    i.name.toLowerCase().includes(searchQuery.toLowerCase()),
            ),
        [allItems, activeCategory, searchQuery],
    );

    const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

    const addToCart = (item: FlatItem) => {
        setCart((prev) => {
            const existing = prev.find((i) => i.menu_item_id === item.id);
            if (existing) {
                return prev.map((i) =>
                    i.menu_item_id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
                );
            }
            return [...prev, { menu_item_id: item.id, name: item.name, price: item.price, quantity: 1 }];
        });
    };

    const updateQuantity = (menuItemId: number, quantity: number) => {
        setCart((prev) =>
            quantity <= 0
                ? prev.filter((i) => i.menu_item_id !== menuItemId)
                : prev.map((i) => (i.menu_item_id === menuItemId ? { ...i, quantity } : i)),
        );
    };

    const removeFromCart = (menuItemId: number) => {
        setCart((prev) => prev.filter((i) => i.menu_item_id !== menuItemId));
    };

    const handleOpenPayment = () => {
        if (cart.length === 0) {
            return;
        }
        setCashGiven('');
        setPayError(null);
        setCompletedOrder(null);
        setShowPaymentModal(true);
    };

    const handleConfirmPayment = async () => {
        setIsSubmitting(true);
        setPayError(null);
        const payload = {
            items: cart.map((i) => ({ menu_item_id: i.menu_item_id, quantity: i.quantity })),
            payment_method: 'cash',
            payment_status: 'paid',
        };
        try {
            const res = await fetch(checkout.url(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN':
                        document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '',
                },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                const cash = parseInt(cashGiven.replace(/\D/g, ''), 10) || 0;
                setCompletedOrder({ total: subtotal, change: Math.max(0, cash - subtotal) });
                setCart([]);
                toast.success('Transaksi berhasil disimpan!');
            } else {
                setPayError('Gagal menyimpan transaksi. Coba lagi.');
            }
        } catch {
            setPayError('Terjadi kesalahan jaringan.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const cashNumber = parseInt(cashGiven.replace(/\D/g, ''), 10) || 0;

    return (
        <>
            <Head title="Kasir" />
            <div className="flex flex-col gap-6 p-4 lg:h-[calc(100vh-5rem)] lg:flex-row">
                {/* LEFT: menu grid */}
                <div className="flex flex-1 flex-col gap-4 lg:overflow-hidden">
                    <div className="flex items-center justify-end gap-4">
                        <div className="relative w-64">
                            <Input
                                type="text"
                                placeholder="Cari menu..."
                                aria-label="Cari menu"
                                className="h-9 bg-white pl-9 focus-visible:border-primary focus-visible:ring-0"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="w-full overflow-x-auto pb-2">
                        <div className="flex w-max space-x-2">
                            <Button
                                variant={activeCategory === 'all' ? 'default' : 'outline'}
                                className={`rounded-full ${activeCategory === 'all' ? 'bg-zinc-900 text-white hover:bg-zinc-800' : ''}`}
                                onClick={() => setActiveCategory('all')}
                            >
                                Semua Item
                            </Button>
                            {categories.map((cat) => (
                                <Button
                                    key={cat.slug}
                                    variant={activeCategory === cat.slug ? 'default' : 'outline'}
                                    className={`rounded-full ${activeCategory === cat.slug ? 'bg-zinc-900 text-white hover:bg-zinc-800' : ''}`}
                                    onClick={() => setActiveCategory(cat.slug)}
                                >
                                    {cat.name}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="-mx-2 px-2 lg:flex-1 lg:overflow-y-auto">
                        {menuLoading ? (
                            <div className="text-muted-foreground">Memuat menu...</div>
                        ) : menuError ? (
                            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed bg-muted/20 py-12 text-center text-muted-foreground">
                                <p>Gagal memuat menu.</p>
                                <Button variant="outline" size="sm" onClick={fetchMenu}>
                                    Coba lagi
                                </Button>
                            </div>
                        ) : filteredItems.length === 0 ? (
                            <div className="rounded-xl border border-dashed bg-muted/20 py-12 text-center text-muted-foreground">
                                Item tidak ditemukan.
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4 pb-4 md:grid-cols-3 lg:grid-cols-4">
                                {filteredItems.map((item) => (
                                    <Card
                                        key={item.id}
                                        role="button"
                                        tabIndex={0}
                                        aria-label={`Tambah ${item.name} ke keranjang`}
                                        onClick={() => addToCart(item)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                addToCart(item);
                                            }
                                        }}
                                        className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border-zinc-200/80 bg-white transition-all hover:border-primary/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                        <div className="relative h-28 w-full overflow-hidden bg-zinc-100">
                                            <div className="flex h-full w-full flex-col items-center justify-center text-zinc-300">
                                                <ShoppingBag className="h-8 w-8 opacity-40" aria-hidden="true" />
                                                <span className="mt-1 text-[10px] font-medium text-zinc-400">Tanpa Foto</span>
                                            </div>
                                            <span className="absolute bottom-2 right-2 rounded-full bg-black/75 px-2 py-0.5 text-[11px] font-extrabold text-white backdrop-blur-xs">
                                                {rupiah(item.price)}
                                            </span>
                                        </div>
                                        <CardHeader className="flex-1 p-3 pb-1">
                                            <CardTitle className="line-clamp-2 text-sm font-bold leading-snug text-zinc-900">
                                                {item.name}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="mt-auto flex items-center justify-between p-3 pt-0">
                                            <span className="text-xs font-semibold text-amber-600">Pilih Item</span>
                                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 shadow-xs transition-colors group-hover:bg-amber-500 group-hover:text-white">
                                                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: cart */}
                <Card className="flex w-full flex-col rounded-2xl border-zinc-200 shadow-lg lg:h-full lg:w-[420px] xl:w-[480px]">
                    <CardHeader className="border-b border-zinc-200 bg-zinc-50/60 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <ShoppingBag className="h-5 w-5 text-zinc-900" aria-hidden="true" />
                                Pesanan Saat Ini
                            </CardTitle>
                            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-700">
                                {cartCount} Item
                            </span>
                        </div>
                    </CardHeader>

                    <div className="border-b px-6 py-4">
                        <Label className="mb-1.5 block text-xs uppercase tracking-wider text-zinc-500">
                            Nomor Meja
                        </Label>
                        <Select value="takeaway">
                            <SelectTrigger className="w-full border-zinc-200 font-medium" aria-label="Nomor meja">
                                <SelectValue>Bawa Pulang / Tanpa Meja</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="takeaway">Bawa Pulang / Tanpa Meja</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="min-h-[280px] flex-1 overflow-y-auto px-6 py-4">
                        {cart.length === 0 ? (
                            <div className="flex h-40 flex-col items-center justify-center text-sm text-muted-foreground">
                                <ShoppingBag className="mb-3 h-10 w-10 opacity-20" aria-hidden="true" />
                                <p>Keranjang kosong</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-2">
                                {cart.map((item) => (
                                    <div
                                        key={item.menu_item_id}
                                        className="flex flex-col gap-1 rounded-xl border border-zinc-200 bg-white p-2"
                                    >
                                        <p className="line-clamp-1 text-xs font-semibold text-zinc-900">{item.name}</p>
                                        <p className="text-[10px] text-zinc-500">{rupiah(item.price)}</p>
                                        <p className="text-xs font-bold text-zinc-900">{rupiah(item.price * item.quantity)}</p>
                                        <div className="mt-auto flex items-center justify-between gap-1">
                                            <div className="flex items-center gap-0.5 rounded-full border border-zinc-200 bg-white p-0.5">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-5 w-5 rounded-full hover:bg-zinc-100"
                                                    aria-label={`Kurangi ${item.name}`}
                                                    onClick={() => updateQuantity(item.menu_item_id, item.quantity - 1)}
                                                >
                                                    <Minus className="h-2.5 w-2.5" aria-hidden="true" />
                                                </Button>
                                                <span className="w-4 text-center text-[10px] font-semibold">{item.quantity}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-5 w-5 rounded-full hover:bg-zinc-100"
                                                    aria-label={`Tambah ${item.name}`}
                                                    onClick={() => updateQuantity(item.menu_item_id, item.quantity + 1)}
                                                >
                                                    <Plus className="h-2.5 w-2.5" aria-hidden="true" />
                                                </Button>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-5 w-5 text-muted-foreground hover:text-destructive"
                                                aria-label={`Hapus ${item.name}`}
                                                onClick={() => removeFromCart(item.menu_item_id)}
                                            >
                                                <Trash2 className="h-3 w-3" aria-hidden="true" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mt-auto flex flex-col gap-4 border-t border-zinc-200 bg-white p-6">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-zinc-500">Subtotal</span>
                            <span className="font-medium">{rupiah(subtotal)}</span>
                        </div>
                        <div className="flex items-center justify-between text-lg font-bold">
                            <span>Total</span>
                            <span className="text-zinc-900">{rupiah(subtotal)}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                variant="outline"
                                className="w-full border-zinc-200 bg-white text-red-500 hover:bg-red-50 hover:text-red-600"
                                onClick={() => setCart([])}
                            >
                                Bersihkan
                            </Button>
                            <Button
                                className="w-full bg-zinc-900 text-white shadow-lg hover:bg-zinc-800"
                                disabled={cart.length === 0 || isSubmitting}
                                onClick={handleOpenPayment}
                            >
                                {isSubmitting ? 'Memproses...' : 'Bayar'}
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Payment calculator modal */}
            <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Pembayaran Kasir</DialogTitle>
                    </DialogHeader>

                    {completedOrder ? (
                        <div className="space-y-4 py-4 text-center">
                            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">
                                <p className="mb-1 text-xs font-semibold uppercase tracking-wider">Transaksi Selesai</p>
                                <div className="mt-3 flex items-center justify-between border-t border-emerald-200/60 pt-3 text-sm">
                                    <span>Kembalian:</span>
                                    <span className="text-lg font-extrabold text-emerald-800">
                                        {rupiah(completedOrder.change)}
                                    </span>
                                </div>
                            </div>
                            <DialogFooter className="flex gap-2 sm:justify-center">
                                <Button
                                    onClick={() => {
                                        setCompletedOrder(null);
                                        setShowPaymentModal(false);
                                    }}
                                    className="w-full bg-zinc-900 text-white"
                                >
                                    Transaksi Baru
                                </Button>
                            </DialogFooter>
                        </div>
                    ) : (
                        <div className="space-y-4 py-2">
                            <div className="flex items-center justify-between rounded-xl bg-muted/40 p-4">
                                <span className="text-sm font-medium text-muted-foreground">Total Tagihan:</span>
                                <span className="text-xl font-extrabold text-zinc-900">{rupiah(subtotal)}</span>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="cashInput" className="text-xs font-bold text-zinc-700">
                                    Uang Diterima (Rp)
                                </Label>
                                <Input
                                    id="cashInput"
                                    type="number"
                                    placeholder="0"
                                    value={cashGiven}
                                    onChange={(e) => setCashGiven(e.target.value)}
                                    className="text-lg font-bold"
                                />
                            </div>

                            <div className="flex flex-wrap gap-2 pt-1">
                                {[subtotal, 20000, 50000, 100000].map((amt, idx) => (
                                    <Button
                                        key={idx}
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="text-xs"
                                        onClick={() => setCashGiven(String(amt))}
                                    >
                                        {rupiah(amt)}
                                    </Button>
                                ))}
                            </div>

                            {cashNumber >= subtotal && subtotal > 0 && (
                                <div className="flex items-center justify-between rounded-lg border bg-zinc-50 p-3 text-sm font-semibold">
                                    <span className="text-muted-foreground">Kembalian:</span>
                                    <span className="font-bold text-emerald-600">{rupiah(cashNumber - subtotal)}</span>
                                </div>
                            )}

                            {payError && (
                                <p className="text-sm text-red-600" role="alert">{payError}</p>
                            )}

                            <DialogFooter className="pt-2">
                                <Button variant="ghost" onClick={() => setShowPaymentModal(false)} disabled={isSubmitting}>
                                    Batal
                                </Button>
                                <Button onClick={handleConfirmPayment} disabled={isSubmitting} className="font-bold">
                                    {isSubmitting ? 'Menyimpan...' : 'Selesaikan Bayar'}
                                </Button>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

Pos.layout = {
    breadcrumbs: [
        {
            title: 'Kasir',
            href: pos(),
        },
    ],
};