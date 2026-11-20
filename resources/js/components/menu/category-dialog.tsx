import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Check, Edit2, FolderPlus, Loader2, Plus, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

export type CategoryItem = {
    id: number;
    name: string;
    slug: string;
    menu_items_count?: number;
};

type Props = {
    open: boolean;
    onClose: () => void;
    categories: CategoryItem[];
    onCategoriesUpdated: (newCategories: CategoryItem[]) => void;
};

export function CategoryDialog({
    open,
    onClose,
    categories,
    onCategoriesUpdated,
}: Props) {
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    // Editing state
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingName, setEditingName] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    // Deleting state
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const getCsrfToken = () =>
        (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';

    // Handle Create
    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = newCategoryName.trim();
        if (!trimmed) {
            toast.error('Nama kategori tidak boleh kosong.');
            return;
        }

        setIsCreating(true);
        try {
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify({ name: trimmed }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Gagal menambahkan kategori');
            }

            toast.success(`Kategori "${data.category.name}" berhasil ditambahkan.`);
            setNewCategoryName('');
            onCategoriesUpdated([...categories, data.category]);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Terjadi kesalahan';
            toast.error(msg);
        } finally {
            setIsCreating(false);
        }
    };

    // Handle Start Edit
    const startEdit = (cat: CategoryItem) => {
        setEditingId(cat.id);
        setEditingName(cat.name);
    };

    // Handle Save Edit
    const handleSaveEdit = async (cat: CategoryItem) => {
        const trimmed = editingName.trim();
        if (!trimmed) {
            toast.error('Nama kategori tidak boleh kosong.');
            return;
        }

        if (trimmed === cat.name) {
            setEditingId(null);
            return;
        }

        setIsUpdating(true);
        try {
            const res = await fetch(`/api/categories/${cat.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify({ name: trimmed }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Gagal memperbarui kategori');
            }

            toast.success(`Kategori berhasil diubah menjadi "${data.category.name}".`);
            setEditingId(null);
            onCategoriesUpdated(
                categories.map((c) => (c.id === cat.id ? { ...c, name: data.category.name, slug: data.category.slug } : c))
            );
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Terjadi kesalahan';
            toast.error(msg);
        } finally {
            setIsUpdating(false);
        }
    };

    // Handle Delete
    const handleDelete = async (cat: CategoryItem) => {
        if ((cat.menu_items_count ?? 0) > 0) {
            toast.error(
                `Kategori "${cat.name}" masih memiliki ${cat.menu_items_count} menu terkait. Pindahkan atau hapus menu terlebih dahulu.`
            );
            return;
        }

        if (!confirm(`Hapus kategori "${cat.name}"?`)) return;

        setDeletingId(cat.id);
        try {
            const res = await fetch(`/api/categories/${cat.id}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Gagal menghapus kategori');
            }

            toast.success(`Kategori "${cat.name}" berhasil dihapus.`);
            onCategoriesUpdated(categories.filter((c) => c.id !== cat.id));
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Terjadi kesalahan';
            toast.error(msg);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-lg font-bold">
                        <FolderPlus className="size-5 text-primary" />
                        Kelola Kategori Menu
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                        Tambah kategori baru atau kelola kategori produk kasir yang sudah ada.
                    </DialogDescription>
                </DialogHeader>

                {/* Form Tambah Kategori */}
                <form onSubmit={handleCreateCategory} className="flex items-center gap-2 pt-2">
                    <Input
                        placeholder="Nama kategori baru (mis: Camilan, Kopi, Paket)..."
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="text-xs h-9 flex-1"
                        disabled={isCreating}
                        autoFocus
                    />
                    <Button
                        type="submit"
                        disabled={isCreating || !newCategoryName.trim()}
                        size="sm"
                        className="h-9 px-3.5 text-xs font-semibold shrink-0"
                    >
                        {isCreating ? (
                            <Loader2 className="size-3.5 animate-spin mr-1" />
                        ) : (
                            <Plus className="size-3.5 mr-1" />
                        )}
                        Tambah
                    </Button>
                </form>

                {/* Daftar Kategori */}
                <div className="space-y-1.5 pt-3 max-h-[320px] overflow-y-auto pr-1">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Daftar Kategori Saat Ini ({categories.length})
                    </p>

                    {categories.length === 0 ? (
                        <p className="text-xs text-center text-muted-foreground py-6">
                            Belum ada kategori yang terdaftar.
                        </p>
                    ) : (
                        categories.map((cat) => {
                            const isEditing = editingId === cat.id;
                            const isDeleting = deletingId === cat.id;

                            return (
                                <div
                                    key={cat.id}
                                    className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors"
                                >
                                    {isEditing ? (
                                        <div className="flex items-center gap-1.5 flex-1 mr-2">
                                            <Input
                                                value={editingName}
                                                onChange={(e) => setEditingName(e.target.value)}
                                                className="text-xs h-7 flex-1"
                                                disabled={isUpdating}
                                                autoFocus
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleSaveEdit(cat);
                                                    } else if (e.key === 'Escape') {
                                                        setEditingId(null);
                                                    }
                                                }}
                                            />
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="default"
                                                onClick={() => handleSaveEdit(cat)}
                                                disabled={isUpdating || !editingName.trim()}
                                                className="size-7 shrink-0"
                                                title="Simpan"
                                            >
                                                {isUpdating ? (
                                                    <Loader2 className="size-3 animate-spin" />
                                                ) : (
                                                    <Check className="size-3" />
                                                )}
                                            </Button>
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => setEditingId(null)}
                                                disabled={isUpdating}
                                                className="size-7 shrink-0"
                                                title="Batal"
                                            >
                                                <X className="size-3" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-xs text-foreground">
                                                {cat.name}
                                            </span>
                                            {typeof cat.menu_items_count === 'number' && (
                                                <Badge
                                                    variant="secondary"
                                                    className="text-[10px] px-1.5 py-0 font-normal text-muted-foreground"
                                                >
                                                    {cat.menu_items_count} menu
                                                </Badge>
                                            )}
                                        </div>
                                    )}

                                    {!isEditing && (
                                        <div className="flex items-center gap-1">
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => startEdit(cat)}
                                                className="size-7 text-muted-foreground hover:text-foreground"
                                                title="Ubah Nama Kategori"
                                            >
                                                <Edit2 className="size-3" />
                                            </Button>
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => handleDelete(cat)}
                                                disabled={isDeleting}
                                                className="size-7 text-muted-foreground hover:text-destructive"
                                                title={
                                                    (cat.menu_items_count ?? 0) > 0
                                                        ? 'Tidak bisa dihapus (masih ada menu)'
                                                        : 'Hapus Kategori'
                                                }
                                            >
                                                {isDeleting ? (
                                                    <Loader2 className="size-3 animate-spin" />
                                                ) : (
                                                    <Trash2 className="size-3" />
                                                )}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
