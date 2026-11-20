<?php

use App\Models\MenuCategory;
use App\Models\MenuItem;
use App\Models\Transaction;
use App\Models\User;

test('daily report returns total sales for a date', function () {
    $user = User::factory()->create();

    $category = MenuCategory::factory()->create([
        'name' => 'Makanan',
        'slug' => 'makanan',
    ]);
    $item = MenuItem::factory()->create([
        'menu_category_id' => $category->id,
        'name' => 'Nasi Goreng',
        'price' => 15000,
        'is_available' => true,
    ]);

    Transaction::factory()->create([
        'user_id' => $user->id,
        'total_amount' => 30000,
        'payment_status' => 'paid',
        'transaction_date' => now()->toDateString(),
    ]);

    $this->actingAs($user);

    $response = $this->get(route('report.daily', ['date' => now()->toDateString()]));

    $response->assertOk();
    $response->assertJson([
        'total_sales' => 30000,
        'transaction_count' => 1,
    ]);
});

test('daily report excludes unpaid transactions', function () {
    $user = User::factory()->create();

    Transaction::factory()->create([
        'user_id' => $user->id,
        'total_amount' => 50000,
        'payment_status' => 'unpaid',
        'transaction_date' => now()->toDateString(),
    ]);

    $this->actingAs($user);

    $response = $this->get(route('report.daily', ['date' => now()->toDateString()]));

    $response->assertOk();
    $response->assertJson([
        'total_sales' => 0,
        'transaction_count' => 0,
    ]);
});
