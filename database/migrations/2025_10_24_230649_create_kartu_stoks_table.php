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
        Schema::create('kartu_stoks', function (Blueprint $table) {
            $table->id();

            $table->date('tgl')->nullable();
            $table->integer('barang_id')->default(0);
            $table->decimal('masuk', 14, 2)->default(0);
            $table->decimal('keluar', 14, 2)->default(0);
            $table->decimal('rusak', 14, 2)->default(0);
            $table->decimal('opname', 14, 2)->default(0);
            $table->decimal('sisa', 14, 2)->default(0);

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kartu_stoks');
    }
};
