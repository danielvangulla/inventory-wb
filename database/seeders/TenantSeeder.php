<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class TenantSeeder extends Seeder
{
    public function run()
    {
        DB::table('tenants')->insert([
            [
                'title' => 'Coffee Shop',
                'description' => 'A cozy place to enjoy your favorite coffee and pastries.',
                'height' => 100,
                'width' => 150,
                'margin_left' => 50,
                'margin_top' => 30
            ],
            [
                'title' => 'Clothing Store',
                'description' => 'Fashionable and trendy clothes for all ages and styles.',
                'height' => 200,
                'width' => 120,
                'margin_left' => 220,
                'margin_top' => 50
            ],
            [
                'title' => 'Electronics Shop',
                'description' => 'Latest gadgets, accessories, and tech products at competitive prices.',
                'height' => 180,
                'width' => 160,
                'margin_left' => 400,
                'margin_top' => 100
            ],
            [
                'title' => 'Bookstore',
                'description' => 'A wide variety of books across different genres for all ages.',
                'height' => 120,
                'width' => 100,
                'margin_left' => 600,
                'margin_top' => 120
            ],
            [
                'title' => 'Beauty Salon',
                'description' => 'Professional beauty services including haircuts, styling, and skincare.',
                'height' => 150,
                'width' => 100,
                'margin_left' => 800,
                'margin_top' => 200
            ]
        ]);
    }
}
