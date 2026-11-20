<?php

use App\Models\MenuCategory;
use App\Models\MenuItem;
use App\Models\User;

test('authenticated user can view categories with items count', function () {
    $user = User::factory()->create();

    $category = MenuCategory::factory()->create([
        'name' => 'Snack Ringan',
        'slug' => 'snack-ringan',
    ]);

    MenuItem::factory()->create([
        'menu_category_id' => $category->id,
        'name' => 'Keripik Tempe',
        'price' => 5000,
    ]);

    $this->actingAs($user);

    $response = $this->get(route('categories.index'));

    $response->assertOk();
    $response->assertJsonFragment([
        'name' => 'Snack Ringan',
        'menu_items_count' => 1,
    ]);
});

test('authenticated user can create a new category with slug', function () {
    $user = User::factory()->create();

    $this->actingAs($user);

    $response = $this->post(route('categories.store'), [
        'name' => 'Paket Sarapan Hemat',
    ]);

    $response->assertCreated();
    $response->assertJsonFragment([
        'name' => 'Paket Sarapan Hemat',
        'slug' => 'paket-sarapan-hemat',
    ]);

    $this->assertDatabaseHas('menu_categories', [
        'name' => 'Paket Sarapan Hemat',
        'slug' => 'paket-sarapan-hemat',
    ]);
});

test('authenticated user can update category name', function () {
    $user = User::factory()->create();

    $category = MenuCategory::factory()->create([
        'name' => 'Minuman Dingin',
        'slug' => 'minuman-dingin',
    ]);

    $this->actingAs($user);

    $response = $this->put(route('categories.update', $category), [
        'name' => 'Aneka Minuman Segar',
    ]);

    $response->assertOk();
    $this->assertDatabaseHas('menu_categories', [
        'id' => $category->id,
        'name' => 'Aneka Minuman Segar',
        'slug' => 'aneka-minuman-segar',
    ]);
});

test('category with existing menu items cannot be deleted', function () {
    $user = User::factory()->create();

    $category = MenuCategory::factory()->create([
        'name' => 'Kopi TeFa',
        'slug' => 'kopi-tefa',
    ]);

    MenuItem::factory()->create([
        'menu_category_id' => $category->id,
        'name' => 'Espresso Single',
        'price' => 10000,
    ]);

    $this->actingAs($user);

    $response = $this->delete(route('categories.destroy', $category));

    $response->assertStatus(422);
    $this->assertDatabaseHas('menu_categories', [
        'id' => $category->id,
    ]);
});

test('empty category can be deleted', function () {
    $user = User::factory()->create();

    $category = MenuCategory::factory()->create([
        'name' => 'Kategori Sementara',
        'slug' => 'kategori-sementara',
    ]);

    $this->actingAs($user);

    $response = $this->delete(route('categories.destroy', $category));

    $response->assertOk();
    $this->assertDatabaseMissing('menu_categories', [
        'id' => $category->id,
    ]);
});
