<?php

namespace App\Models;

use Database\Factories\MenuItemFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $menu_category_id
 * @property string $name
 * @property int $price
 * @property string|null $image
 * @property bool $is_available
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['menu_category_id', 'name', 'price', 'image', 'is_available'])]
#[Hidden([])]
class MenuItem extends Model
{
    /** @use HasFactory<MenuItemFactory> */
    use HasFactory;

    public function category()
    {
        return $this->belongsTo(MenuCategory::class);
    }

    public function transactionItems()
    {
        return $this->hasMany(TransactionItem::class);
    }
}
