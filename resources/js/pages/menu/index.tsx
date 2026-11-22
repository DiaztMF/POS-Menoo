import { Head, router } from '@inertiajs/react';
import { useMemo, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { MenuDialog, type MenuItemData } from '@/components/menu/menu-dialog';
import { CategoryDialog, type CategoryItem } from '@/components/menu/category-dialog';
import {
    CheckCircle2,
    Edit2,
    FolderPlus,
    Plus,
    Search,
    Trash2,
    Utensils,
    X,
    XCircle,
} from 'lucide-react';
import { toast } from 'sonner';

type Category = {
    id: number;
    name: string;
    slug: string;
};

type MenuItemRow = {
    id: number;
    menu_category_id: number;
    category_name: string;
    name: string;
    price: number;
    image?: string | null;
    is_available: boolean;
};

type Props = {
    categories: Category[];
    items: MenuItemRow[];
};

const rupiah = (val: number): string => `Rp ${val.toLocaleString('id-ID')}`;

export default function MenuIndex({ categories: initialCategories, items: initialItems }: Props) {
    const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
    const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
    const [items, setItems] = useState<MenuItemRow[]>(initialItems);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Modal state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItemData | null>(null);

    // Keep internal items & categories state in sync if server props update
    useEffect(() => {
        setItems(initialItems);
    }, [initialItems]);

    useEffect(() => {
        setCategories(initialCategories);
    }, [initialCategories]);

    // Compute categories with live menu items count
    const categoriesWithCount = useMemo(() => {
        return categories.map((cat) => ({
            ...cat,
            menu_items_count: items.filter((i) => i.menu_category_id === cat.id).length,
        }));
    }, [categories, items]);

    // Filter items
    const filteredItems = useMemo(() => {
        let res = items;
        if (selectedCategory !== 'all') {
            const catId = Number(selectedCategory);
            res = res.filter((i) => i.menu_category_id === catId);
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            res = res.filter((i) => i.name.toLowerCase().includes(q));
        }
        return res;
    }, [items, selectedCategory, searchQuery]);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const totalPages = Math.ceil(filteredItems.length / pageSize);

    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredItems.slice(start, start + pageSize);
    }, [filteredItems, currentPage, pageSize]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, searchQuery]);

    // Toggle availability
    const handleToggle = async (item: MenuItemRow) => {
        const previousState = item.is_available;
        // Optimistic update
        setItems((prev) =>
            prev.map((i) =>
                i.id === item.id ? { ...i, is_available: !previousState } : i
            )
        );

        try {
            const res = await fetch(`/api/menu/${item.id}/toggle`, {
                method: 'PATCH',
                headers: {
                    Accept: 'application/json',
                    'X-CSRF-TOKEN':
                        (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)
                            ?.content || '',
                },
            });

            if (!res.ok) throw new Error('Gagal mengubah status');
            toast.success(`Status ${item.name} berhasil diubah.`);
        } catch {
            // Revert on error
            setItems((prev) =>
                prev.map((i) =>
                    i.id === item.id ? { ...i, is_available: previousState } : i
                )
            );
            toast.error('Gagal memperbarui status ketersediaan.');
        }
    };

    // Delete item
    const handleDelete = async (item: MenuItemRow) => {
        if (!confirm(`Yakin ingin menghapus menu "${item.name}"?`)) return;

        try {
            const res = await fetch(`/api/menu/${item.id}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'X-CSRF-TOKEN':
                        (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)
                            ?.content || '',
                },
            });

            if (!res.ok) throw new Error('Gagal menghapus menu');
            setItems((prev) => prev.filter((i) => i.id !== item.id));
            toast.success(`Menu "${item.name}" berhasil dihapus.`);
        } catch {
            toast.error('Gagal menghapus menu.');
        }
    };

    const handleSuccessRefresh = () => {
        router.reload({ only: ['items'] });
    };

    return (
        <>
            <Head title="Kelola Menu" />

            <div className="flex flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Kelola Menu & Kategori
                        </h1>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Daftar master produk, pengaturan harga jual, dan kelola kategori produk kasir.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setCategoryDialogOpen(true)}
                            className="font-semibold shadow-xs"
                        >
                            <FolderPlus className="mr-2 size-4 text-primary" />
                            Kelola Kategori
                        </Button>
                        <Button
                            type="button"
                            onClick={() => {
                                setEditingItem(null);
                                setDialogOpen(true);
                            }}
                            className="bg-primary text-primary-foreground font-semibold shadow-xs"
                        >
                            <Plus className="mr-2 size-4" />
                            Tambah Menu Baru
                        </Button>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <Card className="border-border/70 shadow-xs">
                    <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                        {/* Search Input */}
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Cari nama menu..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-8 h-9 text-xs"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="size-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Category filter pills */}
                        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                            <Button
                                type="button"
                                size="sm"
                                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                                onClick={() => setSelectedCategory('all')}
                                className="rounded-full text-xs font-semibold h-8"
                            >
                                Semua ({items.length})
                            </Button>
                            {categories.map((cat) => {
                                const count = items.filter((i) => i.menu_category_id === cat.id).length;
                                return (
                                    <Button
                                        key={cat.id}
                                        type="button"
                                        size="sm"
                                        variant={selectedCategory === String(cat.id) ? 'default' : 'outline'}
                                        onClick={() => setSelectedCategory(String(cat.id))}
                                        className="rounded-full text-xs font-semibold h-8"
                                    >
                                        {cat.name} ({count})
                                    </Button>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Items Table */}
                <Card className="border-border/70 shadow-xs overflow-hidden">
                    <CardHeader className="pb-3 border-b border-border/40">
                        <CardTitle className="text-base font-bold flex items-center gap-2">
                            <Utensils className="size-4 text-primary" />
                            Daftar Menu ({filteredItems.length} produk)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {filteredItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                                <Utensils className="size-10 stroke-1 mb-2" />
                                <p className="font-semibold text-sm">Tidak ada menu yang ditemukan</p>
                                <p className="text-xs">Klik "Tambah Menu Baru" untuk menambahkan produk baru.</p>
                            </div>
                        ) : (
                            <>
                                <div className="min-h-[500px] overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-b border-border/80 bg-muted/40 hover:bg-muted/40">
                                                <TableHead className="w-14 text-center whitespace-nowrap">#</TableHead>
                                                <TableHead className="min-w-[240px] whitespace-nowrap">Nama Menu</TableHead>
                                                <TableHead className="w-44 whitespace-nowrap">Kategori</TableHead>
                                                <TableHead className="text-right w-40 whitespace-nowrap">Harga Jual</TableHead>
                                                <TableHead className="text-center w-36 whitespace-nowrap">Status</TableHead>
                                                <TableHead className="text-center w-28 whitespace-nowrap">Aksi</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {paginatedItems.map((item, idx) => (
                                                <TableRow key={item.id}>
                                                    <TableCell className="text-center font-medium text-xs text-muted-foreground whitespace-nowrap">
                                                        {(currentPage - 1) * pageSize + idx + 1}
                                                    </TableCell>
                                                    <TableCell className="font-semibold text-xs text-foreground whitespace-nowrap">
                                                        {item.name}
                                                    </TableCell>
                                                    <TableCell className="whitespace-nowrap">
                                                        <Badge variant="secondary" className="text-[10px]">
                                                            {item.category_name}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right font-bold text-xs text-foreground whitespace-nowrap">
                                                        {rupiah(item.price)}
                                                    </TableCell>
                                                    <TableCell className="text-center whitespace-nowrap">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleToggle(item)}
                                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                                                                item.is_available
                                                                    ? 'bg-[#efebe9] text-[#3e2723] hover:bg-[#d7ccc8]'
                                                                    : 'bg-muted/40 text-muted-foreground hover:bg-muted'
                                                            }`}
                                                        >
                                                            {item.is_available ? (
                                                                <>
                                                                    <CheckCircle2 className="size-3.5 text-primary" />
                                                                    Tersedia
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <XCircle className="size-3.5 text-muted-foreground" />
                                                                    Habis
                                                                </>
                                                            )}
                                                        </button>
                                                    </TableCell>
                                                    <TableCell className="text-center whitespace-nowrap">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <Button
                                                                type="button"
                                                                size="icon"
                                                                variant="ghost"
                                                                onClick={() => {
                                                                    setEditingItem(item);
                                                                    setDialogOpen(true);
                                                                }}
                                                                className="size-7 text-muted-foreground hover:text-foreground"
                                                                title="Edit Menu"
                                                            >
                                                                <Edit2 className="size-3.5" />
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                size="icon"
                                                                variant="ghost"
                                                                onClick={() => handleDelete(item)}
                                                                className="size-7 text-muted-foreground hover:text-destructive"
                                                                title="Hapus Menu"
                                                            >
                                                                <Trash2 className="size-3.5" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                                <DataTablePagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    totalItems={filteredItems.length}
                                    pageSize={pageSize}
                                    onPageChange={setCurrentPage}
                                />
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Modal Dialog Menu */}
            <MenuDialog
                open={dialogOpen}
                onClose={() => {
                    setDialogOpen(false);
                    setEditingItem(null);
                }}
                onSuccess={handleSuccessRefresh}
                categories={categories}
                initialData={editingItem}
            />

            {/* Modal Dialog Kategori */}
            <CategoryDialog
                open={categoryDialogOpen}
                onClose={() => setCategoryDialogOpen(false)}
                categories={categoriesWithCount}
                onCategoriesUpdated={(updated) => {
                    setCategories(updated);
                    if (
                        selectedCategory !== 'all' &&
                        !updated.some((c) => String(c.id) === selectedCategory)
                    ) {
                        setSelectedCategory('all');
                    }
                }}
            />
        </>
    );
}
