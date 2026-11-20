<?php

namespace App\Http\Controllers\Pos;

use App\Http\Controllers\Controller;
use App\Models\MenuCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = MenuCategory::withCount('menuItems')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return response()->json($categories);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50',
        ]);

        $baseSlug = Str::slug($validated['name']);
        if (empty($baseSlug)) {
            $baseSlug = 'kategori';
        }
        $slug = $baseSlug;
        $counter = 1;
        while (MenuCategory::where('slug', $slug)->exists()) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        $maxSort = MenuCategory::max('sort_order') ?? 0;

        $category = MenuCategory::create([
            'name' => trim($validated['name']),
            'slug' => $slug,
            'sort_order' => $maxSort + 1,
        ]);

        $category->loadCount('menuItems');

        return response()->json([
            'message' => 'Kategori berhasil ditambahkan',
            'category' => $category,
        ], 201);
    }

    public function update(Request $request, MenuCategory $category): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50',
        ]);

        $baseSlug = Str::slug($validated['name']);
        if (empty($baseSlug)) {
            $baseSlug = 'kategori';
        }
        $slug = $baseSlug;
        $counter = 1;
        while (MenuCategory::where('slug', $slug)->where('id', '!=', $category->id)->exists()) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        $category->update([
            'name' => trim($validated['name']),
            'slug' => $slug,
        ]);

        $category->loadCount('menuItems');

        return response()->json([
            'message' => 'Kategori berhasil diperbarui',
            'category' => $category,
        ]);
    }

    public function destroy(MenuCategory $category): JsonResponse
    {
        $itemsCount = $category->menuItems()->count();

        if ($itemsCount > 0) {
            return response()->json([
                'message' => "Kategori \"{$category->name}\" tidak dapat dihapus karena masih digunakan oleh {$itemsCount} menu. Pindahkan atau hapus menu terkait terlebih dahulu.",
            ], 422);
        }

        $category->delete();

        return response()->json([
            'message' => 'Kategori berhasil dihapus',
        ]);
    }
}
