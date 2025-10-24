<?php

use App\Http\Controllers\Inventory\BarangController;
use App\Http\Controllers\Inventory\KategoriController;
use App\Http\Controllers\Inventory\KategorisubController;
use App\Http\Controllers\Inventory\LandingController;
use App\Http\Controllers\Inventory\OutletController;
use App\Http\Controllers\Inventory\SupplierController;
use App\Http\Controllers\SetupController;
use App\Http\Controllers\UserLevelController;
use App\Http\Controllers\UsersController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'inventory', 'as' => 'inventory.'], function () {

    // Dashboard
    Route::get('/', [LandingController::class, 'index'])->name('landing');

    // Auth Management
    Route::resource('user-level', UserLevelController::class)->names('user-level');
    Route::resource('users', UsersController::class)->names('users');

    // Basic Setup
    Route::resource('setup', SetupController::class)->names('setup');

    // Kategori Management
    Route::resource('kategori', KategoriController::class)->names('kategori');

    // Sub-Kategori Management
    Route::resource('kategorisub', KategorisubController::class)->names('kategorisub');

    // Menu Management
    Route::resource('barang', BarangController::class)->names('barang');

    // Supplier Management
    Route::resource('suppliers', SupplierController::class)->names('suppliers');

    // Outlet Management
    Route::resource('outlets', OutletController::class)->names('outlets');
});
