/* eslint-disable @typescript-eslint/no-explicit-any */

// pages/dashboard.tsx
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Bar, Line } from 'react-chartjs-2'; // Import komponen grafik bar dan line
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';

// Mendaftarkan semua elemen yang diperlukan oleh Chart.js
ChartJS.register(
    Title,
    Tooltip,
    Legend,
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement
);

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'DASHBOARD',
        href: '/dashboard',
    },
];

export default function Dashboard(props: any) {
    const { occupancyData, tenantCategoryData, yearlyRevenueData, floorRevenueData } = props;

    // Menyiapkan data untuk grafik okupansi per bulan
    const occupancyChartData = {
        labels: occupancyData.monthlyOccupancy.map((item: any) => item.month),
        datasets: [
            {
                label: 'Occupied',
                data: occupancyData.monthlyOccupancy.map((item: any) => item.occupied),
                backgroundColor: '#36A2EB',
                borderColor: '#36A2EB',
                borderWidth: 1,
            },
            {
                label: 'Vacant',
                data: occupancyData.monthlyOccupancy.map((item: any) => item.vacant),
                backgroundColor: '#FF6384',
                borderColor: '#FF6384',
                borderWidth: 1,
            },
        ],
    };

    // Menyiapkan data untuk grafik kategori tenant (Booked, HO/FO, Opening, Closed)
    const tenantCategoryChartData = {
        labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'], // Rentang bulan dari Juni 2024 - Mei 2025
        datasets: [
            {
                label: 'Booked',
                data: tenantCategoryData.Booked,
                backgroundColor: '#36A2EB',
                borderColor: '#36A2EB',
                borderWidth: 1,
            },
            {
                label: 'HO/FO',
                data: tenantCategoryData['HO/FO'],
                backgroundColor: '#FFCE56',
                borderColor: '#FFCE56',
                borderWidth: 1,
            },
            {
                label: 'Opening',
                data: tenantCategoryData.Opening,
                backgroundColor: '#4BC0C0',
                borderColor: '#4BC0C0',
                borderWidth: 1,
            },
            {
                label: 'Vacant',
                data: tenantCategoryData.Closed,
                backgroundColor: '#FF6384',
                borderColor: '#FF6384',
                borderWidth: 1,
            },
        ],
    };

    // Menyiapkan data untuk grafik pendapatan sewa per bulan selama 1 tahun
    const yearlyRevenueChartData = {
        labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'], // Rentang bulan dari Juni 2024 - Mei 2025
        datasets: [
            {
                label: 'Pendapatan Sewa (Tahunan)',
                data: yearlyRevenueData,
                backgroundColor: '#FF5733',
                borderColor: '#FF5733',
                borderWidth: 1,
            },
        ],
    };

    // Menyiapkan data untuk grafik pendapatan sewa per lantai (3 lantai)
    const floorRevenueChartData = {
        labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'], // Rentang bulan dari Juni 2024 - Mei 2025
        datasets: [
            {
                label: 'Lantai 1',
                data: floorRevenueData['Lantai 1'],
                backgroundColor: '#FF5733',
                borderColor: '#FF5733',
                borderWidth: 1,
            },
            {
                label: 'Lantai 2',
                data: floorRevenueData['Lantai 2'],
                backgroundColor: '#4BC0C0',
                borderColor: '#4BC0C0',
                borderWidth: 1,
            },
            {
                label: 'Lantai 3',
                data: floorRevenueData['Lantai 3'],
                backgroundColor: '#FFCE56',
                borderColor: '#FFCE56',
                borderWidth: 1,
            },
        ],
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Bagian atas Dashboard */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-2">
                    {/* Grafik Okupansi */}
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border p-4">
                        <h2 className="text-xl font-semibold">Grafik Okupansi (Per Bulan)</h2>
                        <div className="h-72">
                            <Line data={occupancyChartData} options={{ responsive: true, maintainAspectRatio: true }} />
                        </div>
                    </div>

                    {/* Grafik Kategori Tenant */}
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border p-4">
                        <h2 className="text-xl font-semibold">Kategori Tenant (Tahunan)</h2>
                        <div className="h-72">
                            <Line data={tenantCategoryChartData} options={{ responsive: true, maintainAspectRatio: true }} />
                        </div>
                    </div>
                </div>

                {/* Bagian bawah Dashboard */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Grafik Pendapatan Sewa (Tahunan) */}
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border p-4">
                        <h2 className="text-xl font-semibold">Pendapatan Sewa (Tahunan)</h2>
                        <div className="h-72">
                            <Line data={yearlyRevenueChartData} options={{ responsive: true, maintainAspectRatio: true }} />
                        </div>
                    </div>

                    {/* Grafik Pendapatan Sewa per Lantai */}
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border p-4">
                        <h2 className="text-xl font-semibold">Pendapatan Sewa per Lantai</h2>
                        <div className="h-72">
                            <Bar data={floorRevenueChartData} options={{ responsive: true, maintainAspectRatio: true }} />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
