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
        Schema::create('menus', function (Blueprint $table) {
            $table->id();

            $table->string('sku', 20)->default('');

            $table->foreignId('tenant_id');
            $table->foreignId('kategorisub_id');
            $table->string('alias')->nullable();
            $table->string('deskripsi')->nullable();
            $table->decimal('harga', 15, 2)->default(0);
            $table->tinyInteger('is_ready')->default(1);
            $table->tinyInteger('is_soldout')->default(0);

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menus');
    }
};
