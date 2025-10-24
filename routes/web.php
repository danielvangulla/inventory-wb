<?php

use Illuminate\Support\Facades\Route;

Route::middleware(['throttle:global', 'auth'])->group(function () {
    Route::get('/', function () {
        return redirect()->route('inventory.landing');
    })->name('dashboard');

    require __DIR__ . '/inventory.php';
    require __DIR__ . '/settings.php';
});

Route::middleware(['throttle:auth-sensitive'])->group(function () {
    require __DIR__ . '/auth.php';
});
