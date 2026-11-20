<?php

namespace App\Models;

use Database\Factories\TransactionItemFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $transaction_id
 * @property int $menu_item_id
 * @property int $quantity
 * @property int $unit_price
 * @property int $subtotal
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['transaction_id', 'menu_item_id', 'quantity', 'unit_price', 'subtotal'])]
#[Hidden([])]
class TransactionItem extends Model
{
    /** @use HasFactory<TransactionItemFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'unit_price' => 'integer',
            'subtotal' => 'integer',
        ];
    }

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }

    public function menuItem(): BelongsTo
    {
        return $this->belongsTo(MenuItem::class);
    }
}
