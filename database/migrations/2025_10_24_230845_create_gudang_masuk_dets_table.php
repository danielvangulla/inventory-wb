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
        Schema::create('gudang_masuk_dets', function (Blueprint $table) {
            $table->id();

            $table->integer('gudang_masuk_id')->default(0);
            $table->integer('barang_id')->default(0);
            $table->decimal('harga', 14, 2)->default(0);
            $table->decimal('qty', 10, 2)->default(0);
            $table->decimal('brutto', 14, 2)->default(0);
            $table->decimal('disc', 14, 2)->default(0);
            $table->decimal('netto', 14, 2)->default(0);
            $table->decimal('tax', 14, 2)->default(0);
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
        Schema::dropIfExists('gudang_masuk_dets');
    }
};
