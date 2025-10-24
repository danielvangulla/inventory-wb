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
        Schema::create('gudang_masuks', function (Blueprint $table) {
            $table->id();

            $table->date('tgl')->nullable();
            $table->integer('supplier_id')->default(0);
            $table->string('penerima', 100)->default('-');
            $table->decimal('brutto', 14, 2)->default(0);
            $table->decimal('disc', 14, 2)->default(0);
            $table->decimal('netto', 14, 2)->default(0);
            $table->decimal('tax', 14, 2)->default(0);
            $table->decimal('total', 14, 2)->default(0);
            $table->integer('jenis_bayar')->default(0)->comment("0: cash, 1:kredit");
            $table->date('due')->nullable();
            $table->integer('is_lunas')->default(0)->comment("0: belum, 1:sudah");
            $table->date('tgl_lunas')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gudang_masuks');
    }
};
