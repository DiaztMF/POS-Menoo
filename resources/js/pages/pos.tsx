import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PaymentModal } from '@/components/pos/payment-modal';
import { ReceiptDialog, type ReceiptData } from '@/components/pos/receipt-dialog';
import {
    Check,
    Coffee,
    Minus,
    Plus,
    Search,
    ShoppingBag,
    Trash2,
    Utensils,
    X,
} from 'lucide-react';
import { toast } from 'sonner';

type MenuItem = {
    id: number;
    name: string;
    price: number;
    image?: string | null;
    is_available: boolean;
};

type MenuCategory = {
    id: number;
    name: string;
    slug: string;
    items: MenuItem[];
};

type CartItem = {
    menu_item_id: number;
    name: string;
    price: number;
    quantity: number;
};

const rupiah = (val: number): string => `Rp ${val.toLocaleString('id-ID')}`;

export default function Pos() {
    const [categories, setCategories] = useState<MenuCategory[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Dialog states
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [completedReceipt, setCompletedReceipt] = useState<ReceiptData | null>(null);

    // Fetch catalog
    const fetchMenu = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/pos/menu', { headers: { Accept: 'application/json' } });
            if (!res.ok) throw new Error('Gagal memuat daftar menu');
            const data: MenuCategory[] = await res.json();
            setCategories(data);
        } catch (err) {
            toast.error('Gagal memuat katalog menu.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMenu();
    }, []);

    // Filter items
    const filteredItems = useMemo(() => {
        let items: (MenuItem & { categorySlug: string; categoryName: string })[] = [];
        categories.forEach((cat) => {
            cat.items.forEach((item) => {
                items.push({
                    ...item,
                    categorySlug: cat.slug,
                    categoryName: cat.name,
                });
            });
        });

        if (activeCategory !== 'all') {
            items = items.filter((it) => it.categorySlug === activeCategory);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            items = items.filter((it) => it.name.toLowerCase().includes(q));
        }

        return items;
    }, [categories, activeCategory, searchQuery]);

    // Cart operations
    const addToCart = (item: MenuItem) => {
        if (!item.is_available) {
            toast.warning(`Menu ${item.name} sedang habis.`);
            return;
        }

        setCart((prev) => {
            const existing = prev.find((c) => c.menu_item_id === item.id);
            if (existing) {
                return prev.map((c) =>
                    c.menu_item_id === item.id ? { ...c, quantity: c.quantity + 1 } : c
                );
            }
            return [
                ...prev,
                {
                    menu_item_id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: 1,
                },
            ];
        });
    };

    const updateQuantity = (itemId: number, delta: number) => {
        setCart((prev) =>
            prev
                .map((item) => {
                    if (item.menu_item_id === itemId) {
                        const newQty = item.quantity + delta;
                        return newQty > 0 ? { ...item, quantity: newQty } : null;
                    }
                    return item;
                })
                .filter(Boolean) as CartItem[]
        );
    };

    const removeFromCart = (itemId: number) => {
        setCart((prev) => prev.filter((item) => item.menu_item_id !== itemId));
    };

    const clearCart = () => setCart([]);

    const totalAmount = useMemo(
        () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        [cart]
    );

    const totalQuantity = useMemo(
        () => cart.reduce((sum, item) => sum + item.quantity, 0),
        [cart]
    );

    // Keyboard shortcut F9 for checkout
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'F9' && cart.length > 0 && !showPaymentModal) {
                e.preventDefault();
                setShowPaymentModal(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [cart, showPaymentModal]);

    // Checkout execution
    const handleConfirmPayment = async (paymentMethod: 'cash' | 'qris', cashGiven: number) => {
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/pos/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN':
                        (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)
                            ?.content || '',
                },
                body: JSON.stringify({
                    items: cart.map((i) => ({
                        menu_item_id: i.menu_item_id,
                        quantity: i.quantity,
                    })),
                    payment_method: paymentMethod,
                    cash_given: cashGiven,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Gagal memproses transaksi.');
            }

            toast.success('Transaksi berhasil dicatat!');
            setShowPaymentModal(false);
            setCart([]);
            setCompletedReceipt(data);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Terjadi kesalahan sistem.';
            toast.error(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Kasir POS', href: '/pos' }]}>
            <Head title="Kasir POS" />

            <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-background">
                {/* SISI KIRI (65%): KATALOG MENU */}
                <div className="flex flex-1 flex-col border-r border-border/70 overflow-hidden">
                    {/* Header Filter & Search */}
                    <div className="p-4 border-b border-border/60 bg-card/60 backdrop-blur space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Cari makanan, minuman, snack... (Ketik langsung)"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 pr-8 h-10 bg-background"
                                    autoFocus
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        <X className="size-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Category Pills */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                            <Button
                                type="button"
                                size="sm"
                                variant={activeCategory === 'all' ? 'default' : 'outline'}
                                onClick={() => setActiveCategory('all')}
                                className="rounded-full text-xs font-semibold h-8"
                            >
                                Semua Menu
                            </Button>
                            {categories.map((cat) => (
                                <Button
                                    key={cat.id}
                                    type="button"
                                    size="sm"
                                    variant={activeCategory === cat.slug ? 'default' : 'outline'}
                                    onClick={() => setActiveCategory(cat.slug)}
                                    className="rounded-full text-xs font-semibold h-8"
                                >
                                    {cat.name} ({cat.items.length})
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Product Cards Grid */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {isLoading ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                {[...Array(8)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-32 rounded-xl bg-muted animate-pulse"
                                    />
                                ))}
                            </div>
                        ) : filteredItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                                <Utensils className="size-10 mb-2 stroke-1" />
                                <p className="font-medium">Tidak ada menu yang cocok</p>
                                <p className="text-xs">Coba kata kunci atau kategori lain</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                {filteredItems.map((item) => {
                                    const inCart = cart.find((c) => c.menu_item_id === item.id);
                                    return (
                                        <button
                                            key={item.id}
                                            type="button"
                                            disabled={!item.is_available}
                                            onClick={() => addToCart(item)}
                                            className={`relative group flex flex-col justify-between text-left p-3.5 rounded-xl border transition-all ${
                                                !item.is_available
                                                    ? 'opacity-50 cursor-not-allowed bg-muted/40 border-border/40'
                                                    : inCart
                                                    ? 'bg-primary/5 border-primary shadow-sm'
                                                    : 'bg-card hover:bg-accent/40 border-border/70 hover:border-primary/40 shadow-xs'
                                            }`}
                                        >
                                            {inCart && (
                                                <span className="absolute top-2 right-2 flex items-center justify-center size-5 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-xs">
                                                    {inCart.quantity}
                                                </span>
                                            )}

                                            <div className="space-y-1">
                                                <Badge
                                                    variant="secondary"
                                                    className="text-[10px] font-medium px-1.5 py-0"
                                                >
                                                    {item.categoryName}
                                                </Badge>
                                                <h3 className="font-semibold text-sm leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                                                    {item.name}
                                                </h3>
                                            </div>

                                            <div className="mt-3 flex items-center justify-between pt-2 border-t border-border/40">
                                                <span className="font-bold text-sm text-foreground">
                                                    {rupiah(item.price)}
                                                </span>
                                                {!item.is_available && (
                                                    <Badge variant="destructive" className="text-[10px]">
                                                        Habis
                                                    </Badge>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* SISI KANAN (35%): KERANJANG BELANJA */}
                <div className="w-96 flex flex-col bg-card/40 border-l border-border/70">
                    {/* Cart Header */}
                    <div className="p-4 border-b border-border/60 flex items-center justify-between bg-card">
                        <div className="flex items-center gap-2">
                            <ShoppingBag className="size-5 text-primary" />
                            <h2 className="font-bold text-base">Pesanan Aktif</h2>
                            <Badge variant="secondary" className="text-xs">
                                {totalQuantity} item
                            </Badge>
                        </div>
                        {cart.length > 0 && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={clearCart}
                                className="h-8 text-xs text-muted-foreground hover:text-destructive"
                            >
                                <Trash2 className="size-3.5 mr-1" />
                                Reset
                            </Button>
                        )}
                    </div>

                    {/* Cart Items List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
                        {cart.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground space-y-2">
                                <ShoppingBag className="size-12 stroke-1 text-muted-foreground/60" />
                                <p className="font-medium text-sm">Keranjang Masih Kosong</p>
                                <p className="text-xs text-muted-foreground/80 max-w-[200px]">
                                    Pilih menu di sisi kiri untuk memulai transaksi pelanggan.
                                </p>
                            </div>
                        ) : (
                            cart.map((item) => (
                                <div
                                    key={item.menu_item_id}
                                    className="p-3 bg-background border border-border/60 rounded-xl space-y-2 shadow-xs"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold text-xs leading-snug">
                                                {item.name}
                                            </h4>
                                            <p className="text-[11px] text-muted-foreground">
                                                {rupiah(item.price)} / porsi
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeFromCart(item.menu_item_id)}
                                            className="text-muted-foreground hover:text-destructive p-1"
                                        >
                                            <X className="size-3.5" />
                                        </button>
                                    </div>

                                    <div className="flex justify-between items-center pt-1 border-t border-border/30">
                                        <div className="flex items-center gap-1.5 bg-muted/60 rounded-lg p-0.5 border border-border/40">
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => updateQuantity(item.menu_item_id, -1)}
                                                className="size-6 rounded-md"
                                            >
                                                <Minus className="size-3" />
                                            </Button>
                                            <span className="text-xs font-bold w-6 text-center">
                                                {item.quantity}
                                            </span>
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => updateQuantity(item.menu_item_id, 1)}
                                                className="size-6 rounded-md"
                                            >
                                                <Plus className="size-3" />
                                            </Button>
                                        </div>
                                        <span className="font-bold text-xs text-foreground">
                                            {rupiah(item.price * item.quantity)}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Cart Bottom Summary & CTA */}
                    <div className="p-4 border-t border-border/60 bg-card space-y-3">
                        <div className="space-y-1.5 text-xs">
                            <div className="flex justify-between text-muted-foreground">
                                <span>Subtotal Pesanan:</span>
                                <span>{rupiah(totalAmount)}</span>
                            </div>
                            <div className="flex justify-between text-base font-extrabold text-foreground pt-1 border-t border-border/40">
                                <span>Total Tagihan:</span>
                                <span>{rupiah(totalAmount)}</span>
                            </div>
                        </div>

                        <Button
                            type="button"
                            size="lg"
                            disabled={cart.length === 0}
                            onClick={() => setShowPaymentModal(true)}
                            className="w-full h-12 text-sm font-bold bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
                        >
                            Bayar Pesanan (F9)
                        </Button>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <PaymentModal
                open={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                totalAmount={totalAmount}
                onConfirmPayment={handleConfirmPayment}
                isSubmitting={isSubmitting}
            />

            <ReceiptDialog
                open={Boolean(completedReceipt)}
                onClose={() => setCompletedReceipt(null)}
                receipt={completedReceipt}
            />
        </AppLayout>
    );
}
