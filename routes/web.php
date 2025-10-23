<?php

use Illuminate\Support\Facades\Route;

Route::middleware(['throttle:global', 'auth'])->group(function () {
    Route::get('/', function () {
        return redirect()->route('foodcourt.landing');
    })->name('dashboard');

    require __DIR__ . '/foodcourt.php';
    require __DIR__ . '/settings.php';
});

Route::middleware(['throttle:auth-sensitive'])->group(function () {
    require __DIR__ . '/auth.php';
});
