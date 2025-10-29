<?php

use App\Http\Controllers\Inventory\BarangController;
use App\Http\Controllers\Inventory\BarangRusakController;
use App\Http\Controllers\Inventory\GudangKeluarController;
use App\Http\Controllers\Inventory\GudangMasukController;
use App\Http\Controllers\Inventory\HutangController;
use App\Http\Controllers\Inventory\KategoriController;
use App\Http\Controllers\Inventory\KategorisubController;
use App\Http\Controllers\Inventory\LandingController;
use App\Http\Controllers\Inventory\LaporanController;
use App\Http\Controllers\Inventory\OutletController;
use App\Http\Controllers\Inventory\StokOpnameController;
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

    // Transaction
    Route::resource('terima-gudang', GudangMasukController::class)->names('terima-gudang');
    Route::resource('hutang', HutangController::class)->names('hutang');
    Route::resource('keluar-gudang', GudangKeluarController::class)->names('keluar-gudang');
    Route::resource('barang-rusak', BarangRusakController::class)->names('barang-rusak');
    Route::resource('stok-opname', StokOpnameController::class)->names('stok-opname');

    // Laporan Pembelian
    Route::get('laporan-pembelian', [LaporanController::class, 'laporanPembelian'])->name('laporan-pembelian');
    Route::post('laporan-pembelian', [LaporanController::class, 'laporanPembelianPost'])->name('laporan-pembelian');
    Route::get('laporan-pembelian-print/{tgl1}/{tgl2}/{barangId}/{supplierId}/{kategoriId}/{kategorisubId}',
        [LaporanController::class, 'laporanPembelianPrint']
    )->name('laporan-pembelian-print');

    // Laporan Barang Keluar
    Route::get('laporan-barang-keluar', [LaporanController::class, 'laporanBarangKeluar'])->name('laporan-barang-keluar');
    Route::post('laporan-barang-keluar', [LaporanController::class, 'laporanBarangKeluarPost'])->name('laporan-barang-keluar');
    Route::get('laporan-barang-keluar-print/{tgl1}/{tgl2}/{barangId}/{outletId}/{kategoriId}/{kategorisubId}',
        [LaporanController::class, 'laporanBarangKeluarPrint']
    )->name('laporan-barang-keluar-print');

    // Laporan Barang Rusak
    Route::get('laporan-barang-rusak', [LaporanController::class, 'laporanBarangRusak'])->name('laporan-barang-rusak');
    Route::post('laporan-barang-rusak', [LaporanController::class, 'laporanBarangRusakPost'])->name('laporan-barang-rusak');
    Route::get('laporan-barang-rusak-print/{tgl1}/{tgl2}/{barangId}/{supplierId}/{kategoriId}/{kategorisubId}',
        [LaporanController::class, 'laporanBarangRusakPrint']
    )->name('laporan-barang-rusak-print');

    // Laporan Hutang
    Route::get('laporan-hutang', [LaporanController::class, 'laporanHutang'])->name('laporan-hutang');
    Route::post('laporan-hutang', [LaporanController::class, 'laporanHutangPost'])->name('laporan-hutang');
    Route::get('laporan-hutang-print/{tgl1}/{tgl2}/{supplierId}',
        [LaporanController::class, 'laporanHutangPrint']
    )->name('laporan-hutang-print');

    // Laporan Hutang Lunas
    Route::get('laporan-hutang-lunas', [LaporanController::class, 'laporanHutangLunas'])->name('laporan-hutang-lunas');
    Route::post('laporan-hutang-lunas', [LaporanController::class, 'laporanHutangLunasPost'])->name('laporan-hutang-lunas');
    Route::get('laporan-hutang-lunas-print/{tgl1}/{tgl2}/{supplierId}',
        [LaporanController::class, 'laporanHutangLunasPrint']
    )->name('laporan-hutang-lunas-print');
});
