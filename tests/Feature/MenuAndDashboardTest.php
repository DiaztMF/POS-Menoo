<?php

use App\Models\MenuCategory;
use App\Models\MenuItem;
use App\Models\Transaction;
use App\Models\User;

test('authenticated user can view dashboard with metrics and trend', function () {
    $this->withoutVite();
    $user = User::factory()->create();

    $category = MenuCategory::factory()->create(['name' => 'Makanan', 'slug' => 'makanan']);
    $item = MenuItem::factory()->create([
        'menu_category_id' => $category->id,
        'name' => 'Nasi Goreng',
        'price' => 15000,
    ]);

    Transaction::factory()->create([
        'user_id' => $user->id,
        'total_amount' => 30000,
        'payment_status' => 'paid',
        'transaction_date' => now()->toDateString(),
    ]);

    $response = $this->actingAs($user)->get(route('dashboard'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('dashboard')
        ->has('metrics')
        ->has('sales_trend_7d')
        ->has('recent_transactions')
        ->has('top_items')
    );
});

test('authenticated user can list, create, toggle, update, and delete menu items', function () {
    $this->withoutVite();
    $user = User::factory()->create();
    $category = MenuCategory::factory()->create(['name' => 'Minuman', 'slug' => 'minuman']);

    $this->actingAs($user);

    // List
    $response = $this->get(route('menu.index'));
    $response->assertOk();

    // Create
    $createResponse = $this->postJson(route('menu.store'), [
        'menu_category_id' => $category->id,
        'name' => 'Kopi Tubruk',
        'price' => 8000,
    ]);
    $createResponse->assertCreated();
    $item = MenuItem::where('name', 'Kopi Tubruk')->first();
    expect($item)->not->toBeNull();
    expect($item->is_available)->toBeTrue();

    // Toggle
    $toggleResponse = $this->patchJson(route('menu.toggle', $item));
    $toggleResponse->assertOk();
    expect($item->fresh()->is_available)->toBeFalse();

    // Update
    $updateResponse = $this->putJson(route('menu.update', $item), [
        'menu_category_id' => $category->id,
        'name' => 'Kopi Tubruk Manis',
        'price' => 9000,
    ]);
    $updateResponse->assertOk();
    expect($item->fresh()->name)->toBe('Kopi Tubruk Manis');
    expect($item->fresh()->price)->toBe(9000);

    // Delete
    $deleteResponse = $this->deleteJson(route('menu.destroy', $item));
    $deleteResponse->assertOk();
    expect(MenuItem::find($item->id))->toBeNull();
});
