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
        Schema::create('barangs', function (Blueprint $table) {
            $table->id();

            $table->string('deskripsi')->default('-');
            $table->integer('kategori_id')->default(0);
            $table->integer('kategorisub_id')->default(0);
            $table->decimal('stok', 12, 2)->default(0);
            $table->integer('min_stok')->default(0);
            $table->string('satuan', 30)->default('-');
            $table->integer('isi')->default(1);
            $table->decimal('harga_beli', 14, 2)->default(0);
            $table->decimal('harga_jual', 14, 2)->default(0);

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('barangs');
    }
};
