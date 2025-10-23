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
        Schema::create('user_levels', function (Blueprint $table) {
            $table->id();

            $table->string('name')->unique();
            $table->string('ket')->nullable();
            $table->boolean('is_admin')->default(false);
            $table->boolean('basic_read')->default(true);
            $table->boolean('basic_write')->default(false);
            $table->boolean('tenant_read')->default(true);
            $table->boolean('tenant_write')->default(false);
            $table->boolean('menu_read')->default(true);
            $table->boolean('menu_write')->default(false);
            $table->boolean('kasir')->default(true);
            $table->boolean('spv')->default(false);
            $table->boolean('laporan')->default(false);

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_levels');
    }
};
