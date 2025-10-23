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
        Schema::create('transaksi_items', function (Blueprint $table) {
            $table->id();

            $table->foreignId('transaksi_id')->default(0);
            $table->foreignId('menu_id')->default(0);
            $table->string('order_code')->nullable();
            $table->string('alias')->nullable();
            $table->decimal('harga', 15, 2);
            $table->integer('qty')->default(1);
            $table->decimal('brutto', 15, 2);
            $table->decimal('disc', 15, 2)->default(0);
            $table->decimal('netto', 15, 2);
            $table->decimal('tax', 15, 2)->default(0);
            $table->decimal('service', 15, 2)->default(0);
            $table->decimal('total', 15, 2);

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaksi_items');
    }
};
