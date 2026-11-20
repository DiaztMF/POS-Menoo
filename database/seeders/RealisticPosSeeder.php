<?php

namespace Database\Seeders;

use App\Models\MenuCategory;
use App\Models\MenuItem;
use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class RealisticPosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::first() ?? User::factory()->create([
            'name' => 'Kasir TeFa',
            'email' => 'kasir@gmail.com',
            'password' => bcrypt('password'),
        ]);

        // 1. Categories
        $catMakanan = MenuCategory::updateOrCreate(
            ['slug' => 'makanan'],
            ['name' => 'Makanan', 'sort_order' => 1]
        );
        $catMinuman = MenuCategory::updateOrCreate(
            ['slug' => 'minuman'],
            ['name' => 'Minuman', 'sort_order' => 2]
        );
        $catSnack = MenuCategory::updateOrCreate(
            ['slug' => 'snack'],
            ['name' => 'Camilan & Snack', 'sort_order' => 3]
        );

        // 2. Menu Items
        $itemsData = [
            // Makanan
            ['category_id' => $catMakanan->id, 'name' => 'Nasi Goreng Spesial TeFa', 'price' => 18000, 'image' => null, 'is_available' => true],
            ['category_id' => $catMakanan->id, 'name' => 'Mie Ayam Bakso Komplit', 'price' => 15000, 'image' => null, 'is_available' => true],
            ['category_id' => $catMakanan->id, 'name' => 'Ayam Geprek Sambal Korek + Nasi', 'price' => 17000, 'image' => null, 'is_available' => true],
            ['category_id' => $catMakanan->id, 'name' => 'Chicken Katsu Curry Rice', 'price' => 22000, 'image' => null, 'is_available' => true],
            // Minuman
            ['category_id' => $catMinuman->id, 'name' => 'Es Teh Manis Jumbo', 'price' => 5000, 'image' => null, 'is_available' => true],
            ['category_id' => $catMinuman->id, 'name' => 'Kopi Susu Gula Aren TeFa', 'price' => 13000, 'image' => null, 'is_available' => true],
            ['category_id' => $catMinuman->id, 'name' => 'Iced Matcha Latte Creamy', 'price' => 15000, 'image' => null, 'is_available' => true],
            ['category_id' => $catMinuman->id, 'name' => 'Lemon Tea Segar Ice', 'price' => 8000, 'image' => null, 'is_available' => true],
            // Snack
            ['category_id' => $catSnack->id, 'name' => 'Kentang Goreng French Fries', 'price' => 12000, 'image' => null, 'is_available' => true],
            ['category_id' => $catSnack->id, 'name' => 'Cireng Krispi Bumbu Rujak', 'price' => 10000, 'image' => null, 'is_available' => true],
            ['category_id' => $catSnack->id, 'name' => 'Roti Bakar Cokelat Keju', 'price' => 14000, 'image' => null, 'is_available' => true],
            ['category_id' => $catSnack->id, 'name' => 'Tahu Walik Crispy (isi 5)', 'price' => 10000, 'image' => null, 'is_available' => true],
        ];

        $createdItems = [];
        foreach ($itemsData as $data) {
            $createdItems[] = MenuItem::updateOrCreate(
                ['name' => $data['name']],
                [
                    'menu_category_id' => $data['category_id'],
                    'price' => $data['price'],
                    'image' => $data['image'],
                    'is_available' => $data['is_available'],
                ]
            );
        }

        // 3. Past 7 days realistic transactions (from 6 days ago up to today)
        $today = Carbon::today();
        $invoiceSeq = 1;

        for ($dayOffset = 6; $dayOffset >= 0; $dayOffset--) {
            $date = $today->copy()->subDays($dayOffset);
            // Between 5 to 10 transactions per day
            $txCount = rand(5, 10);

            for ($i = 0; $i < $txCount; $i++) {
                $invoiceNo = sprintf('INV-%s-%04d', $date->format('ymd'), $invoiceSeq++);
                $paymentMethod = 'cash';

                // Pick 1 to 3 random items
                $pickedItems = collect($createdItems)->random(rand(1, 3));
                $totalAmount = 0;
                $txItemsData = [];

                foreach ($pickedItems as $item) {
                    $qty = rand(1, 2);
                    $subtotal = $item->price * $qty;
                    $totalAmount += $subtotal;
                    $txItemsData[] = [
                        'menu_item_id' => $item->id,
                        'quantity' => $qty,
                        'unit_price' => $item->price,
                        'subtotal' => $subtotal,
                    ];
                }

                // Quick cash simulation: round up to nearest 10k or 20k or 50k
                $cashGiven = (int) (ceil($totalAmount / 10000) * 10000);
                if ($cashGiven === $totalAmount && rand(1, 2) === 1) {
                    $cashGiven += (rand(1, 2) === 1 ? 10000 : 20000);
                }
                $changeAmount = $cashGiven - $totalAmount;

                $txTime = $date->copy()->setHour(rand(8, 17))->setMinute(rand(0, 59))->setSecond(rand(0, 59));

                $transaction = Transaction::create([
                    'invoice_no' => $invoiceNo,
                    'user_id' => $user->id,
                    'total_amount' => $totalAmount,
                    'cash_given' => $cashGiven,
                    'change_amount' => $changeAmount,
                    'payment_method' => $paymentMethod,
                    'payment_status' => 'paid',
                    'transaction_date' => $date->format('Y-m-d'),
                    'created_at' => $txTime,
                    'updated_at' => $txTime,
                ]);

                foreach ($txItemsData as $itemData) {
                    TransactionItem::create([
                        'transaction_id' => $transaction->id,
                        'menu_item_id' => $itemData['menu_item_id'],
                        'quantity' => $itemData['quantity'],
                        'unit_price' => $itemData['unit_price'],
                        'subtotal' => $itemData['subtotal'],
                        'created_at' => $txTime,
                        'updated_at' => $txTime,
                    ]);
                }
            }
        }
    }
}
