<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Foodcourt\KasirController;
use App\Http\Controllers\Foodcourt\KategoriController;
use App\Http\Controllers\Foodcourt\KategorisubController;
use App\Http\Controllers\Foodcourt\MenuController;
use App\Http\Controllers\Foodcourt\PrinterController;
use App\Http\Controllers\Foodcourt\SetupController;
use App\Http\Controllers\Foodcourt\TenantController;
use App\Http\Controllers\Foodcourt\UserLevelController;
use App\Http\Controllers\Foodcourt\UsersController;
use App\Http\Controllers\Foodcourt\LandingController;
use App\Http\Controllers\Foodcourt\ReportController;
use App\Http\Controllers\Foodcourt\UpdaterController;

Route::group(['prefix' => 'foodcourt', 'as' => 'foodcourt.'], function () {

    // Dashboard
    Route::get('/', [LandingController::class, 'index'])->name('landing');

    // Auth Management
    Route::resource('user-level', UserLevelController::class)->names('user-level');
    Route::resource('users', UsersController::class)->names('users');

    // Basic Setup
    Route::resource('setup', SetupController::class)->names('setup');

    // Tenant Management
    Route::resource('tenants', TenantController::class)->names('tenants');

    // Kategori Management
    Route::resource('kategori', KategoriController::class)->names('kategori');

    // Sub-Kategori Management
    Route::resource('kategorisub', KategorisubController::class)->names('kategorisub');

    // Menu Management
    Route::resource('menu', MenuController::class)->names('menu');

    // Kasir Interface
    Route::get('kasir', [KasirController::class, 'index'])->name('kasir.index');
    Route::post('kasir-pay', [KasirController::class, 'payment'])->name('kasir.pay');
    Route::delete('kasir-void/{id}', [KasirController::class, 'void'])->name('kasir.destroy');
    Route::post('kasir-cancelvoid/{id}', [KasirController::class, 'cancelVoid'])->name('kasir.cancelvoid');
    Route::get('history', [KasirController::class, 'history'])->name('kasir.history');

    // Printing Route
    Route::post('print-orders', [PrinterController::class, 'printOrders'])->name('print.orders');
    Route::post('print-receipt', [PrinterController::class, 'printReceipt'])->name('print.receipt');
    Route::post('reprint-receipt', [KasirController::class, 'reprintReceipt'])->name('reprint.receipt');

    // Report Routes
    Route::get('rekap-omset-tenant', [ReportController::class, 'rekapOmsetTenant'])->name('reports.rekap-omset-tenant');
    Route::get('rekap-omset-tenant/{tgl1}/{tgl2}', [ReportController::class, 'rekapOmsetTenant'])->name('reports.rekap-omset-tenant');

    Route::get('rekap-omset-harian', [ReportController::class, 'rekapOmsetHarian'])->name('reports.rekap-omset-harian');
    Route::get('rekap-omset-harian/{tgl1}/{tgl2}/{tenant_id}', [ReportController::class, 'rekapOmsetHarian'])->name('reports.rekap-omset-harian');

    Route::get('penjualan-by-item', [ReportController::class, 'penjualanByItem'])->name('reports.penjualan-by-item');
    Route::get('penjualan-by-item/{tgl1}/{tgl2}/{tenant_id}', [ReportController::class, 'penjualanByItem'])->name('reports.penjualan-by-item');

    // Updater
    Route::get('updater-check', [UpdaterController::class, 'check'])->name('updater.check');
});
