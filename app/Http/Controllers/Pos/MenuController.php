<?php

namespace App\Http\Controllers\Pos;

use App\Http\Controllers\Controller;
use App\Models\MenuCategory;
use App\Models\MenuItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MenuController extends Controller
{
    public function index(): Response
    {
        $categories = MenuCategory::orderBy('sort_order')->get();
        $items = MenuItem::with('category')
            ->orderBy('menu_category_id')
            ->orderBy('name')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'menu_category_id' => $item->menu_category_id,
                    'category_name' => $item->category?->name ?? 'Uncategorized',
                    'name' => $item->name,
                    'price' => $item->price,
                    'image' => $item->image,
                    'is_available' => (bool) $item->is_available,
                ];
            });

        return Inertia::render('menu/index', [
            'categories' => $categories,
            'items' => $items,
        ]);
    }

    public function store(Request $request): RedirectResponse|JsonResponse
    {
        $validated = $request->validate([
            'menu_category_id' => 'required|exists:menu_categories,id',
            'name' => 'required|string|max:100',
            'price' => 'required|integer|min:500',
            'image' => 'nullable|string|max:255',
            'is_available' => 'nullable|boolean',
        ]);

        $item = MenuItem::create([
            'menu_category_id' => $validated['menu_category_id'],
            'name' => $validated['name'],
            'price' => $validated['price'],
            'image' => $validated['image'] ?? null,
            'is_available' => $validated['is_available'] ?? true,
        ]);

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Menu berhasil ditambahkan', 'item' => $item], 201);
        }

        return redirect()->back()->with('success', 'Menu berhasil ditambahkan');
    }

    public function update(Request $request, MenuItem $menuItem): RedirectResponse|JsonResponse
    {
        $validated = $request->validate([
            'menu_category_id' => 'required|exists:menu_categories,id',
            'name' => 'required|string|max:100',
            'price' => 'required|integer|min:500',
            'image' => 'nullable|string|max:255',
            'is_available' => 'nullable|boolean',
        ]);

        $menuItem->update($validated);

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Menu berhasil diperbarui', 'item' => $menuItem]);
        }

        return redirect()->back()->with('success', 'Menu berhasil diperbarui');
    }

    public function toggle(MenuItem $menuItem): RedirectResponse|JsonResponse
    {
        $menuItem->update([
            'is_available' => !$menuItem->is_available,
        ]);

        if (request()->wantsJson()) {
            return response()->json(['message' => 'Status menu berhasil diubah', 'is_available' => $menuItem->is_available]);
        }

        return redirect()->back()->with('success', 'Status menu berhasil diubah');
    }

    public function destroy(MenuItem $menuItem): RedirectResponse|JsonResponse
    {
        $menuItem->delete();

        if (request()->wantsJson()) {
            return response()->json(['message' => 'Menu berhasil dihapus']);
        }

        return redirect()->back()->with('success', 'Menu berhasil dihapus');
    }
}
