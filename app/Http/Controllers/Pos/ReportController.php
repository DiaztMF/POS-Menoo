<?php

namespace App\Http\Controllers\Pos;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class ReportController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        // Support both single 'date' (legacy) and 'start_date'/'end_date'
        $startDate = $request->query('start_date', $request->query('date', Carbon::today()->toDateString()));
        $endDate = $request->query('end_date', $startDate);

        $query = Transaction::query()->where('payment_status', 'paid');

        if ($startDate === $endDate) {
            $query->whereDate('transaction_date', $startDate);
        } else {
            $query->whereDate('transaction_date', '>=', $startDate)
                ->whereDate('transaction_date', '<=', $endDate);
        }

        $transactions = $query->with(['items.menuItem.category', 'user'])
            ->latest()
            ->get();

        $totalSales = (int) $transactions->sum('total_amount');
        $transactionCount = $transactions->count();

        $cashSales = (int) $transactions->where('payment_method', 'cash')->sum('total_amount');
        $qrisSales = (int) $transactions->where('payment_method', 'qris')->sum('total_amount');

        // Top selling items breakdown
        $itemsBreakdown = $transactions->flatMap->items
            ->groupBy('menu_item_id')
            ->map(function ($group, $menuItemId) {
                $menuItem = $group->first()->menuItem;

                return [
                    'menu_item_id' => $menuItemId,
                    'menu_item_name' => $menuItem?->name ?? 'Menu Dihapus',
                    'category' => $menuItem?->category?->name ?? '-',
                    'quantity' => (int) $group->sum('quantity'),
                    'revenue' => (int) $group->sum('subtotal'),
                ];
            })
            ->sortByDesc('quantity')
            ->values();

        // Transaction list for ledger
        $txList = $transactions->map(function ($tx) {
            return [
                'id' => $tx->id,
                'invoice_no' => $tx->invoice_no,
                'date' => $tx->created_at->format('d/m/Y H:i'),
                'cashier' => $tx->user?->name ?? 'Kasir TeFa',
                'payment_method' => $tx->payment_method,
                'total_amount' => $tx->total_amount,
                'cash_given' => $tx->cash_given,
                'change_amount' => $tx->change_amount,
                'items_count' => $tx->items->sum('quantity'),
                'items' => $tx->items->map(function ($item) {
                    return [
                        'name' => $item->menuItem?->name ?? 'Item',
                        'quantity' => $item->quantity,
                        'unit_price' => $item->unit_price,
                        'subtotal' => $item->subtotal,
                    ];
                }),
            ];
        });

        return response()->json([
            'date' => $startDate, // Backward compatibility for tests expecting 'date'
            'start_date' => $startDate,
            'end_date' => $endDate,
            'total_sales' => $totalSales,
            'transaction_count' => $transactionCount,
            'cash_sales' => $cashSales,
            'qris_sales' => $qrisSales,
            'items_breakdown' => $itemsBreakdown,
            'transactions' => $txList,
        ]);
    }
}
