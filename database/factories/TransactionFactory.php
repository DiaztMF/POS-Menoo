<?php

namespace Database\Factories;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

/**
 * @extends Factory<Transaction>
 */
class TransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $total = fake()->numberBetween(10000, 200000);
        return [
            'invoice_no' => 'INV-' . Carbon::today()->format('ymd') . '-' . fake()->unique()->numerify('####'),
            'user_id' => User::factory(),
            'total_amount' => $total,
            'cash_given' => $total,
            'change_amount' => 0,
            'payment_method' => 'cash',
            'payment_status' => 'paid',
            'transaction_date' => Carbon::today(),
        ];
    }
}
