<?php

namespace App\Http\Controllers\Pos;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\TransactionItem;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $today = Carbon::today();

        // 1. Metrics today
        $todayQuery = Transaction::whereDate('transaction_date', $today)
            ->where('payment_status', 'paid');

        $todaySales = (int) $todayQuery->sum('total_amount');
        $todayTransactions = (int) $todayQuery->count();
        $averageOrderValue = $todayTransactions > 0 ? (int) round($todaySales / $todayTransactions) : 0;

        // Top item today
        $topItemTodayRecord = TransactionItem::whereHas('transaction', function ($q) use ($today) {
            $q->whereDate('transaction_date', $today)->where('payment_status', 'paid');
        })
            ->selectRaw('menu_item_id, sum(quantity) as total_qty')
            ->groupBy('menu_item_id')
            ->orderByDesc('total_qty')
            ->with('menuItem')
            ->first();

        $topItemToday = $topItemTodayRecord && $topItemTodayRecord->menuItem
            ? $topItemTodayRecord->menuItem->name . " ({$topItemTodayRecord->total_qty} terjual)"
            : '-';

        // 2. Sales Trend for the past 7 days
        $salesTrend7d = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = $today->copy()->subDays($i);
            $dateStr = $date->toDateString();
            $dailyTotal = (int) Transaction::whereDate('transaction_date', $dateStr)
                ->where('payment_status', 'paid')
                ->sum('total_amount');

            $salesTrend7d[] = [
                'date' => $dateStr,
                'day' => $date->isoFormat('ddd'),
                'formatted' => $date->format('d M'),
                'total' => $dailyTotal,
            ];
        }

        // 3. 5 Most Recent Transactions
        $recentTransactions = Transaction::with(['user', 'items.menuItem'])
            ->where('payment_status', 'paid')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($tx) {
                return [
                    'id' => $tx->id,
                    'invoice_no' => $tx->invoice_no,
                    'total_amount' => $tx->total_amount,
                    'payment_method' => $tx->payment_method,
                    'items_count' => $tx->items->sum('quantity'),
                    'time' => $tx->created_at->format('H:i'),
                    'date' => $tx->created_at->format('d/m/Y'),
                ];
            });

        // 4. Top 5 Menu Items (7 Days)
        $top5Items = TransactionItem::whereHas('transaction', function ($q) use ($today) {
            $q->where('transaction_date', '>=', $today->copy()->subDays(6)->toDateString())
                ->where('payment_status', 'paid');
        })
            ->selectRaw('menu_item_id, sum(quantity) as total_qty, sum(subtotal) as total_revenue')
            ->groupBy('menu_item_id')
            ->orderByDesc('total_qty')
            ->with('menuItem.category')
            ->take(5)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->menu_item_id,
                    'name' => $item->menuItem?->name ?? 'Menu Dihapus',
                    'category' => $item->menuItem?->category?->name ?? '-',
                    'total_qty' => (int) $item->total_qty,
                    'total_revenue' => (int) $item->total_revenue,
                ];
            });

        return Inertia::render('dashboard', [
            'metrics' => [
                'today_sales' => $todaySales,
                'today_transactions' => $todayTransactions,
                'average_order_value' => $averageOrderValue,
                'top_item_today' => $topItemToday,
            ],
            'sales_trend_7d' => $salesTrend7d,
            'recent_transactions' => $recentTransactions,
            'top_items' => $top5Items,
        ]);
    }
}
