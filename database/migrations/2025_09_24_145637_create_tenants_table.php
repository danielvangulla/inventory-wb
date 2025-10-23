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
        Schema::create('tenants', function (Blueprint $table) {
            $table->id();

            $table->string('nama_tenant');
            $table->integer('share_persen')->default(20);
            $table->string('perusahaan')->nullable();
            $table->string('owner')->nullable();
            $table->string('hp')->nullable();
            $table->string('email')->nullable();
            $table->string('alamat')->nullable();
            $table->string('ip_printer', 20)->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tenants');
    }
};
