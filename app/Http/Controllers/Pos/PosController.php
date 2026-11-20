<?php

namespace App\Http\Controllers\Pos;

use App\Http\Controllers\Controller;
use App\Models\MenuCategory;
use App\Models\MenuItem;
use App\Models\Transaction;
use App\Models\TransactionItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class PosController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = MenuCategory::with(['menuItems' => function ($query) {
            $query->orderBy('name');
        }])
            ->orderBy('sort_order')
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'items' => $category->menuItems->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'name' => $item->name,
                            'price' => $item->price,
                            'image' => $item->image,
                            'is_available' => (bool) $item->is_available,
                        ];
                    })->values(),
                ];
            });

        return response()->json($categories);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.menu_item_id' => 'required|exists:menu_items,id',
            'items.*.quantity' => 'required|integer|min:1',
            'payment_method' => 'nullable|string|in:cash',
            'cash_given' => 'nullable|integer|min:0',
        ]);

        $paymentMethod = 'cash';

        return DB::transaction(function () use ($validated, $paymentMethod) {
            $totalAmount = 0;
            $lineItems = [];

            foreach ($validated['items'] as $item) {
                $menuItem = MenuItem::findOrFail($item['menu_item_id']);

                if (!$menuItem->is_available) {
                    abort(422, "Menu '{$menuItem->name}' sedang tidak tersedia.");
                }

                $unitPrice = $menuItem->price;
                $subtotal = $unitPrice * $item['quantity'];
                $totalAmount += $subtotal;

                $lineItems[] = [
                    'menu_item_id' => $menuItem->id,
                    'name' => $menuItem->name,
                    'quantity' => $item['quantity'],
                    'unit_price' => $unitPrice,
                    'subtotal' => $subtotal,
                ];
            }

            $cashGiven = $validated['cash_given'] ?? $totalAmount;
            if ($paymentMethod === 'cash' && $cashGiven < $totalAmount) {
                abort(422, 'Nominal uang tunai yang diberikan kurang dari total belanja.');
            }

            $changeAmount = ($paymentMethod === 'cash') ? max(0, $cashGiven - $totalAmount) : 0;

            // Generate sequential invoice number for today
            $todayDate = Carbon::today()->toDateString();
            $todayStr = Carbon::today()->format('ymd');
            $countToday = Transaction::where('transaction_date', $todayDate)->count() + 1;
            $invoiceNo = sprintf('INV-%s-%04d', $todayStr, $countToday);

            // Double check uniqueness
            while (Transaction::where('invoice_no', $invoiceNo)->exists()) {
                $countToday++;
                $invoiceNo = sprintf('INV-%s-%04d', $todayStr, $countToday);
            }

            $transaction = Transaction::create([
                'invoice_no' => $invoiceNo,
                'user_id' => auth()->id(),
                'total_amount' => $totalAmount,
                'cash_given' => $cashGiven,
                'change_amount' => $changeAmount,
                'payment_method' => $paymentMethod,
                'payment_status' => 'paid',
                'transaction_date' => Carbon::today()->toDateString(),
            ]);

            foreach ($lineItems as $lineItem) {
                TransactionItem::create([
                    'transaction_id' => $transaction->id,
                    'menu_item_id' => $lineItem['menu_item_id'],
                    'quantity' => $lineItem['quantity'],
                    'unit_price' => $lineItem['unit_price'],
                    'subtotal' => $lineItem['subtotal'],
                ]);
            }

            $transaction->load(['items.menuItem', 'user']);

            return response()->json([
                'id' => $transaction->id,
                'invoice_no' => $transaction->invoice_no,
                'total_amount' => $transaction->total_amount,
                'cash_given' => $transaction->cash_given,
                'change_amount' => $transaction->change_amount,
                'payment_method' => $transaction->payment_method,
                'payment_status' => $transaction->payment_status,
                'date' => $transaction->created_at->format('d/m/Y H:i'),
                'cashier' => $transaction->user?->name ?? 'Kasir TeFa',
                'items' => $lineItems,
                'message' => 'Transaksi berhasil diproses',
            ], 201);
        });
    }
}
