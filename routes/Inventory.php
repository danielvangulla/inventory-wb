<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Inventory\LandingController;

Route::group(['prefix' => 'inventory', 'as' => 'inventory.'], function () {

    // Dashboard
    Route::get('/', [LandingController::class, 'index'])->name('landing');

});
