<?php

namespace Database\Seeders;

use App\Models\MenuCategory;
use Illuminate\Database\Seeder;

class MenuCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        MenuCategory::insert([
            ['name' => 'Makanan', 'slug' => 'makanan', 'sort_order' => 1],
            ['name' => 'Minuman', 'slug' => 'minuman', 'sort_order' => 2],
        ]);
    }
}
