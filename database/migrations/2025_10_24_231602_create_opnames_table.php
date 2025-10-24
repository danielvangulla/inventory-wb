<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('opnames', function (Blueprint $table) {
            $table->id();

            $table->date('tgl')->nullable();
            $table->string('catatan', 100)->default('-');
            $table->integer('barang_id')->default(0);
            $table->decimal('harga', 14, 2)->default(0);
            $table->decimal('qty_sistem', 10, 2)->default(0);
            $table->decimal('qty_fisik', 10, 2)->default(0);
            $table->decimal('qty_selisih', 10, 2)->default(0);
            $table->decimal('selisih_rp', 14, 2)->default(0);
            $table->integer('user_id')->default(0);

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('opnames');
    }
};
