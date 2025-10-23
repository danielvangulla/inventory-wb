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
        Schema::create('transaksis', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->default(0);
            $table->dateTime('tgl');
            $table->decimal('brutto', 15, 2);
            $table->decimal('disc', 15, 2)->default(0);
            $table->decimal('netto', 15, 2);
            $table->decimal('tax', 15, 2)->default(0);
            $table->decimal('service', 15, 2)->default(0);
            $table->decimal('card_charge', 15, 2)->default(0);
            $table->decimal('total', 15, 2);
            $table->string('jenis_bayar')->nullable();
            $table->string('channel_bayar')->nullable();
            $table->decimal('uang_cash', 15, 2)->nullable();
            $table->decimal('kembalian', 15, 2)->nullable();
            $table->string('card_no')->nullable();

            $table->integer('void_count')->default(0);
            $table->foreignId('user_void_id')->default(0);

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaksis');
    }
};
