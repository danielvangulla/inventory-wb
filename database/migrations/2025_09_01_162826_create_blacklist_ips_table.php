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
        Schema::create('blacklisted_ips', function (Blueprint $table) {
            $table->id();
            $table->integer('check_count')->default(1);
            $table->string('ip_address')->unique();
            $table->integer('abuse_score')->default(0);
            $table->string('country')->default('');
            $table->string('isp')->default('');
            $table->string('usage')->default('');
            $table->string('domain')->default('');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blacklisted_ips');
    }
};
