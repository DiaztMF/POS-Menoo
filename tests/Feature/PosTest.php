<?php

use App\Models\MenuCategory;
use App\Models\MenuItem;
use App\Models\User;

test('authenticated user can view POS menu grouped by category', function () {
    $user = User::factory()->create();

    $makanan = MenuCategory::factory()->create([
        'name' => 'Makanan',
        'slug' => 'makanan',
    ]);
    $minuman = MenuCategory::factory()->create([
        'name' => 'Minuman',
        'slug' => 'minuman',
    ]);

    MenuItem::factory()->create([
        'menu_category_id' => $makanan->id,
        'name' => 'Nasi Goreng',
        'price' => 15000,
        'is_available' => true,
    ]);
    MenuItem::factory()->create([
        'menu_category_id' => $minuman->id,
        'name' => 'Es Teh',
        'price' => 5000,
        'is_available' => true,
    ]);

    $this->actingAs($user);

    $response = $this->get(route('pos.menu'));

    $response->assertOk();
    $response->assertJsonStructure([
        0 => ['id', 'name', 'slug', 'items'],
    ]);
});

test('authenticated user can checkout a transaction', function () {
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

    $this->actingAs($user);

    $response = $this->post(route('pos.checkout'), [
        'items' => [
            ['menu_item_id' => $item->id, 'quantity' => 2],
        ],
        'payment_method' => 'cash',
        'payment_status' => 'paid',
    ]);

    $response->assertCreated();
    $response->assertJson([
        'total_amount' => 30000,
        'payment_method' => 'cash',
        'payment_status' => 'paid',
    ]);
    expect($response->json('invoice_no'))->toMatch('/^INV-\d{6}-\d{4}/');

    expect($item->fresh()->transactionItems)->toHaveCount(1);
});

test('checkout requires at least one item', function () {
    $user = User::factory()->create();

    $this->actingAs($user);

    $response = $this->post(route('pos.checkout'), [
        'items' => [],
        'payment_method' => 'cash',
    ]);

    $response->assertUnprocessable();
});
