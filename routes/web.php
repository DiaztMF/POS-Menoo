<?php

use App\Http\Controllers\Pos\CategoryController;
use App\Http\Controllers\Pos\DashboardController;
use App\Http\Controllers\Pos\MenuController;
use App\Http\Controllers\Pos\PosController;
use App\Http\Controllers\Pos\ReportController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('dashboard');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::inertia('pos', 'pos')->name('pos');
    Route::inertia('laporan', 'report')->name('report');
    Route::get('menu', [MenuController::class, 'index'])->name('menu.index');
});

Route::middleware(['auth'])->prefix('api')->group(function () {
    // POS routes
    Route::prefix('pos')->group(function () {
        Route::get('menu', [PosController::class, 'index'])->name('pos.menu');
        Route::post('checkout', [PosController::class, 'store'])->name('pos.checkout');
    });

    // Laporan routes
    Route::prefix('laporan')->group(function () {
        Route::get('/', [ReportController::class, 'index'])->name('report.index');
        Route::get('daily', [ReportController::class, 'index'])->name('report.daily');
    });

    // Menu CRUD routes
    Route::prefix('menu')->group(function () {
        Route::post('/', [MenuController::class, 'store'])->name('menu.store');
        Route::put('{menuItem}', [MenuController::class, 'update'])->name('menu.update');
        Route::patch('{menuItem}/toggle', [MenuController::class, 'toggle'])->name('menu.toggle');
        Route::delete('{menuItem}', [MenuController::class, 'destroy'])->name('menu.destroy');
    });

    // Category CRUD routes
    Route::prefix('categories')->group(function () {
        Route::get('/', [CategoryController::class, 'index'])->name('categories.index');
        Route::post('/', [CategoryController::class, 'store'])->name('categories.store');
        Route::put('{category}', [CategoryController::class, 'update'])->name('categories.update');
        Route::delete('{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');
    });
});

require __DIR__.'/settings.php';
