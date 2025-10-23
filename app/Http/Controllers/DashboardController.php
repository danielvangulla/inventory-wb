<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        // Data okupansi
        $occupancyData = [
            'totalSpaces' => 100,
            'occupiedSpaces' => 75,
            'vacantSpaces' => 25,
            'monthlyOccupancy' => $this->generateMonthlyOccupancyData(), // Data okupansi per bulan
        ];

        // Data kategori tenant (dummy data per bulan selama 12 bulan)
        $tenantCategoryData = $this->generateTenantCategoryData();

        // Data pendapatan sewa per bulan (dummy data per bulan selama 12 bulan)
        $yearlyRevenueData = $this->generateYearlyRevenueData();

        // Data pendapatan sewa per lantai (3 lantai per bulan)
        $floorRevenueData = $this->generateFloorRevenueData();

        return Inertia::render('Dashboard', [
            'occupancyData' => $occupancyData,
            'tenantCategoryData' => $tenantCategoryData,
            'yearlyRevenueData' => $yearlyRevenueData, // Mengirim data pendapatan sewa tahunan
            'floorRevenueData' => $floorRevenueData, // Mengirim data pendapatan per lantai
        ]);
    }

    // Fungsi untuk menghasilkan data okupansi per bulan selama satu tahun terakhir (dari Juni 2024 hingga Mei 2025)
    private function generateMonthlyOccupancyData()
    {
        $occupancyData = [];
        $currentMonth = Carbon::now()->subMonths(11); // Mulai dari Juni 2024 (12 bulan mundur)

        for ($i = 0; $i < 12; $i++) {
            $month = $currentMonth->format('M');  // Menentukan nama bulan
            $occupied = rand(60, 80);  // Data okupansi acak (60-80% ruang terisi)
            $vacant = 100 - $occupied;
            $occupancyData[] = [
                'month' => $month,
                'occupied' => $occupied,
                'vacant' => $vacant,
            ];

            $currentMonth->addMonth(); // Lanjutkan ke bulan berikutnya
        }

        return $occupancyData;  // Data sudah dalam urutan Juni hingga Mei
    }

    // Fungsi untuk menghasilkan data kategori tenant untuk grafik tahunan (dummy data)
    private function generateTenantCategoryData()
    {
        // Dummy data kategori tenant selama 12 bulan (Juni 2024 - Mei 2025)
        return [
            'Booked' => [10, 12, 15, 17, 19, 22, 25, 28, 30, 27, 24, 20],
            'HO/FO' => [5, 6, 7, 8, 8, 10, 12, 15, 13, 11, 9, 8],
            'Opening' => [3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 15, 16],
            'Closed' => [2, 3, 4, 5, 6, 7, 8, 8, 7, 6, 5, 4],
        ];
    }

    // Fungsi untuk menghasilkan data pendapatan sewa per bulan selama satu tahun (dari Juni 2024 hingga Mei 2025)
    private function generateYearlyRevenueData()
    {
        // Dummy pendapatan sewa per bulan selama 12 bulan (dalam ribuan)
        return [
            10000, 12000, 11000, 10500, 11500, 13000, 12500, 14000, 13500, 14500, 15000, 15500
        ];
    }

    // Fungsi untuk menghasilkan data pendapatan sewa per lantai (3 lantai per bulan)
    private function generateFloorRevenueData()
    {
        // Dummy pendapatan sewa per lantai (3 lantai) untuk setiap bulan selama 12 bulan (dari Juni 2024 hingga Mei 2025)
        return [
            'Lantai 1' => [3000, 3500, 3200, 3100, 3300, 3600, 3400, 3800, 3700, 3900, 4000, 4200],
            'Lantai 2' => [2500, 2700, 2800, 2900, 3000, 3200, 3100, 3300, 3400, 3500, 3600, 3800],
            'Lantai 3' => [1500, 1800, 1700, 1600, 1800, 2000, 2100, 2200, 2300, 2400, 2500, 2700],
        ];
    }
}
