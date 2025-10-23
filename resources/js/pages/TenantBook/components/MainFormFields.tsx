/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

// pages/TenantBook/components/MainFormFields.tsx
import React, { useEffect } from 'react';
import { formatDateForInput, formatUang } from '@/pages/components/helpers';

interface MainFormFieldsProps {
    data: Record<string, any>;
    setData: (field: string, value: any) => void;
    disabled: boolean;
}

const MainFormFields: React.FC<MainFormFieldsProps> = ({ data, setData, disabled }) => {
    // Function to calculate the end date based on start date and lease duration in months
    useEffect(() => {
        if (data.tgl_start && data.lama_sewa > 0) {
            const startDate = new Date(data.tgl_start);
            const endDate = new Date(startDate.setMonth(startDate.getMonth() + data.lama_sewa)); // Add months to start date
            const formattedEndDate = endDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
            setData('tgl_end', formattedEndDate); // Set the end date

            // Calculate Total Sewa Indoor and Outdoor based on tenantBookDetails
            const totalSewaIndoor = data.tenantBookDetails.reduce((sum: number, detail: any) => {
                return sum + (data.luas_indoor * detail.lama_sewa * detail.harga_sewa_indoor);
            }, 0);

            const totalSewaOutdoor = data.tenantBookDetails.reduce((sum: number, detail: any) => {
                return sum + (data.luas_outdoor * detail.lama_sewa * detail.harga_sewa_outdoor);
            }, 0);

            setData('total_sewa_indoor', totalSewaIndoor);
            setData('total_sewa_outdoor', totalSewaOutdoor);
            setData('total_sewa', totalSewaIndoor + totalSewaOutdoor);
            setData('sewa_per_bulan', (totalSewaIndoor + totalSewaOutdoor) / data.lama_sewa);
        }
    }, [data.tgl_start, data.lama_sewa, data.luas_indoor, data.luas_outdoor, setData]);

    useEffect(() => {
        // Calculate the total service cost based on the service per month and lease duration
        const totalServiceIndoor = data.harga_service_indoor * data.luas_indoor * data.lama_sewa;
        const totalServiceOutdoor = data.harga_service_outdoor * data.luas_outdoor * data.lama_sewa;
        const servicePerBulan = (totalServiceIndoor + totalServiceOutdoor) / data.lama_sewa;

        setData('service_per_bulan', servicePerBulan);
    }, [data.harga_service_indoor, data.harga_service_outdoor, data.luas_indoor, data.luas_outdoor, data.lama_sewa]);

    useEffect(() => {
        // Calculate the promotion levy per month based on the promotion levy percentage
        const promotionLevyPerBulan = +data.service_per_bulan * data.promotion_levy_persen / 100;
        setData('promotion_levy_per_bulan', promotionLevyPerBulan);
    }, [data.service_per_bulan]);

    const handleLevyPersenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        setData('promotion_levy_persen', isNaN(value) ? 0 : value);

        // Recalculate the promotion levy per month when the percentage changes
        const promotionLevyPerBulan = +data.service_per_bulan * (isNaN(value) ? 0 : value) / 100;
        setData('promotion_levy_per_bulan', promotionLevyPerBulan);
    };

    const handleLevyPerBulanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        setData('promotion_levy_per_bulan', isNaN(value) ? 0 : value);

        // Recalculate the promotion levy percentage when the monthly amount changes
        const promotionLevyPersen = (isNaN(value) ? 0 : value) / +data.service_per_bulan * 100;
        setData('promotion_levy_persen', promotionLevyPersen);
    };

    return (
        <div className="w-full mt-4" hidden={data.tenantBookDetails.length === 0}>
            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-black dark:border-gray-600">

                {/* Tanggal Mulai */}
                <div className="flex flex-col mb-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Tanggal Mulai</label>
                    <input
                        type="date"
                        value={formatDateForInput(data.tgl_start)}
                        onChange={(e) => setData('tgl_start', e.target.value)}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={disabled}
                    />
                </div>

                {/* Lama Sewa */}
                <div className="flex flex-col mb-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Lama Sewa (bulan)</label>
                    <input
                        type="number"
                        value={data.lama_sewa}
                        onChange={() => {}}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200 cursor-not-allowed"
                        disabled={true}
                    />
                </div>

                {/* Tanggal Berakhir */}
                <div className="flex flex-col mb-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Tanggal Berakhir</label>
                    <input
                        type="date"
                        value={formatDateForInput(data.tgl_end)}
                        onChange={() => {}}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-50 bg-gray-200 cursor-not-allowed"
                        disabled={true}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-black dark:border-gray-600">

                {/* Total Sewa Indoor */}
                <div className="flex flex-col mb-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Total Sewa Indoor</label>
                    <input
                        type="text"
                        value={formatUang(data.total_sewa_indoor)}
                        onChange={() => {}}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200 cursor-not-allowed"
                        disabled={true}
                    />
                </div>

                {/* Total Sewa Outdoor */}
                <div className="flex flex-col mb-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Total Sewa Outdoor</label>
                    <input
                        type="text"
                        value={formatUang(data.total_sewa_outdoor)}
                        onChange={() => {}}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200 cursor-not-allowed"
                        disabled={true}
                    />
                </div>

                {/* Total Sewa */}
                <div className="flex flex-col mb-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Total Sewa</label>
                    <input
                        type="text"
                        value={formatUang(data.total_sewa)}
                        onChange={() => {}}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200 cursor-not-allowed"
                        disabled={true}
                    />
                </div>

                {/* Sewa per Bulan */}
                <div className="flex flex-col mb-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Sewa Per Bulan</label>
                    <input
                        type="text"
                        value={formatUang(data.sewa_per_bulan)}
                        onChange={() => {}}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200 cursor-not-allowed"
                        disabled={disabled}
                    />
                </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-black dark:border-gray-600">

                {/* Harga Service Indoor */}
                <div className="flex flex-col mb-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Harga Service Indoor</label>
                    <input
                        type="number"
                        value={data.harga_service_indoor}
                        onChange={(e) => setData('harga_service_indoor', e.target.value === "" ? "" : +e.target.value)}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={disabled}
                    />
                </div>

                {/* Harga Service Outdoor */}
                <div className="flex flex-col mb-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Harga Service Outdoor</label>
                    <input
                        type="number"
                        value={data.harga_service_outdoor}
                        onChange={(e) => setData('harga_service_outdoor', e.target.value === "" ? "" : +e.target.value)}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={disabled}
                    />
                </div>

                {/* Service Per Bulan */}
                <div className="flex flex-col mb-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Service Per Bulan</label>
                    <input
                        type="text"
                        value={formatUang(data.service_per_bulan)}
                        onChange={() => {}}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200 cursor-not-allowed"
                        disabled={true}
                    />
                </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-black dark:border-gray-600">

                {/* Promotion Levy Start */}
                <div className="flex flex-col mb-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Promotion Levy Start</label>
                    <input
                        type="date"
                        value={data.promotion_levy_start}
                        onChange={(e) => setData('promotion_levy_start', e.target.value)}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={disabled}
                    />
                </div>

                {/* Promotion Levy End */}
                <div className="flex flex-col mb-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Promotion Levy End</label>
                    <input
                        type="date"
                        value={data.promotion_levy_end}
                        onChange={(e) => setData('promotion_levy_end', e.target.value)}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={disabled}
                    />
                </div>

                {/* Promotion Levy Persen */}
                <div className="flex flex-col mb-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Promotion Levy (%)</label>
                    <input
                        type="number"
                        value={data.promotion_levy_persen}
                        onChange={handleLevyPersenChange}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={disabled}
                    />
                </div>

                {/* Promotion Levy Per Bulan */}
                <div className="flex flex-col mb-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Promotion Levy Per Bulan</label>
                    <input
                        type="number"
                        value={data.promotion_levy_per_bulan}
                        onChange={handleLevyPerBulanChange}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={disabled}
                    />
                </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-black dark:border-gray-600">

                {/* Deposit Sewa */}
                <div className="flex flex-col mb-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Deposit Sewa</label>
                    <input
                        type="number"
                        value={data.deposit_sewa}
                        onChange={(e) => setData('deposit_sewa', e.target.value === "" ? "" : +e.target.value)}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={disabled}
                    />
                </div>

                {/* Deposit Service */}
                <div className="flex flex-col mb-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Deposit Service</label>
                    <input
                        type="number"
                        value={data.deposit_service}
                        onChange={(e) => setData('deposit_service', e.target.value === "" ? "" : +e.target.value)}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={disabled}
                    />
                </div>

                {/* Deposit Telepon */}
                <div className="flex flex-col mb-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Deposit Telepon</label>
                    <input
                        type="text"
                        value={data.deposit_telepon}
                        onChange={(e) => setData('deposit_telepon', e.target.value === "" ? "" : +e.target.value)}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={disabled}
                    />
                </div>

                {/* Deposit Telepon */}
                <div className="flex flex-col mb-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Total Deposit</label>
                    <input
                        type="text"
                        value={data.deposit_telepon +  data.deposit_service + data.deposit_sewa}
                        onChange={() => {}}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200 cursor-not-allowed"
                        disabled={true}
                    />
                </div>

            </div>
        </div>
    );
};

export default MainFormFields;
