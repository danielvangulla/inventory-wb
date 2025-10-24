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
        Schema::create('barang_rusak_dets', function (Blueprint $table) {
            $table->id();

            $table->integer('barang_rusak_id')->nullable();
            $table->integer('barang_id')->nullable();
            $table->decimal('qty', 10, 2)->default(0);
            $table->decimal('harga', 14, 2)->default(0);
            $table->decimal('total', 14, 2)->default(0);

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('barang_rusak_dets');
    }
};
