<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserLevel;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        UserLevel::factory()->create([
            'name' => 'Administrator',
            'ket' => 'Super User',
            'is_admin' => 1,
            'basic_write' => 1,
            'menu_write' => 1,
            'kasir' => 1,
            'spv' => 1,
            'laporan' => 1,
        ]);

        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => bcrypt('admin123'),
            'user_level_id' => 1,
        ]);
    }
}
