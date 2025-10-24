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
        Schema::create('gudang_keluars', function (Blueprint $table) {
            $table->id();

            $table->date('tgl')->nullable();
            $table->integer('outlet_id')->default(0);
            $table->string('menyerahkan', 100)->default('-');
            $table->string('mengambil', 100)->default('-');
            $table->string('mengantar', 100)->default('-');
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
        Schema::dropIfExists('gudang_keluars');
    }
};
