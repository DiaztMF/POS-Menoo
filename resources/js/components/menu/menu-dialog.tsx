import { useEffect, useState } from 'react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export type MenuItemData = {
    id?: number;
    menu_category_id: number;
    name: string;
    price: number;
    image?: string | null;
    is_available?: boolean;
};

export type CategoryOption = {
    id: number;
    name: string;
};

type Props = {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    categories: CategoryOption[];
    initialData?: MenuItemData | null;
};

export function MenuDialog({
    open,
    onClose,
    onSuccess,
    categories,
    initialData,
}: Props) {
    const isEdit = Boolean(initialData?.id);
    const [name, setName] = useState('');
    const [categoryId, setCategoryId] = useState<string>('');
    const [price, setPrice] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setCategoryId(String(initialData.menu_category_id));
            setPrice(String(initialData.price));
        } else {
            setName('');
            setCategoryId(categories.length > 0 ? String(categories[0].id) : '');
            setPrice('');
        }
    }, [initialData, categories, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !categoryId || !price) {
            toast.error('Harap lengkapi semua kolom form.');
            return;
        }

        setIsSubmitting(true);
        try {
            const url = isEdit ? `/api/menu/${initialData?.id}` : '/api/menu';
            const method = isEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN':
                        (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)
                            ?.content || '',
                },
                body: JSON.stringify({
                    name: name.trim(),
                    menu_category_id: Number(categoryId),
                    price: Number(price),
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Gagal menyimpan menu.');
            }

            toast.success(isEdit ? 'Menu berhasil diperbarui' : 'Menu baru berhasil ditambahkan');
            onSuccess();
            onClose();
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Terjadi kesalahan sistem';
            toast.error(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="max-w-md p-6">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold">
                        {isEdit ? 'Edit Menu' : 'Tambah Menu Baru'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 my-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="menu-name" className="text-xs font-medium">
                            Nama Makanan / Minuman
                        </Label>
                        <Input
                            id="menu-name"
                            placeholder="Contoh: Es Kopi Susu Aren"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="category-select" className="text-xs font-medium">
                            Kategori
                        </Label>
                        <Select value={categoryId} onValueChange={setCategoryId}>
                            <SelectTrigger id="category-select">
                                <SelectValue placeholder="Pilih kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((c) => (
                                    <SelectItem key={c.id} value={String(c.id)}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="menu-price" className="text-xs font-medium">
                            Harga Jual (Rp)
                        </Label>
                        <Input
                            id="menu-price"
                            type="number"
                            min="500"
                            step="500"
                            placeholder="Contoh: 15000"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </div>

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
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-primary text-primary-foreground font-semibold"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 size-4 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : isEdit ? (
                                'Simpan Perubahan'
                            ) : (
                                'Tambah Menu'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
