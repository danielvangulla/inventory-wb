/* eslint-disable @typescript-eslint/no-explicit-any */

// pages/TenantBook/components/create/TenantSelector.tsx
import React from 'react';
import { Tenant } from '../models';

interface TenantSelectorProps {
    tenants: Tenant[];
    selectedFloor: string;
    setSelectedFloor: React.Dispatch<React.SetStateAction<string>>;
    filteredTenants: Tenant[];
    setData: (field: string, value: any) => void;
    data: Record<string, any>;
}

const TenantSelector: React.FC<TenantSelectorProps> = ({
    tenants,
    selectedFloor,
    setSelectedFloor,
    filteredTenants,
    setData,
    data,
}) => {
    const handleTenantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const tenant_id = +e.target.value;
        const is_island = tenant_id > 9000 ? 1 : 0;

        console.log('Tenant ID:', tenant_id);
        console.log('Is Island:', is_island);

        setData('tenant_id', tenant_id);
        setData('is_island', is_island);
    };

    return (
        <div className="flex flex-wrap gap-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-black dark:border-gray-600">
            {/* Lantai Selection */}
            <div className="flex flex-col basis-full md:basis-[48%]">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Pilih Lantai</label>
                <select
                    value={selectedFloor}
                    onChange={(e) => {
                        setSelectedFloor(e.target.value);
                        setData('tenant_id', '');
                    }}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Pilih Lantai</option>
                    {[...new Set(tenants.map((t) => t.floor))].map((floor) => (
                        <option key={floor} value={floor}>
                            Lantai {floor}
                        </option>
                    ))}
                </select>
            </div>

            {/* Tenant Selection */}
            <div className="flex flex-col basis-full md:basis-[48%]">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Pilih Unit</label>
                <select
                    value={data.tenant_id}
                    onChange={handleTenantChange}
                    className={`w-full rounded-md border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${!selectedFloor ? 'bg-gray-200 dark:bg-gray-600 cursor-not-allowed' : 'bg-white dark:bg-gray-800'}`}
                    disabled={!selectedFloor}
                >
                    <option value="">Pilih Tenant</option>
                    {filteredTenants.map((t) => (
                        <option key={t.id} value={t.id}>
                            {t.id < 9000 ? `Unit No. ${t.no}` : t.no}
                        </option>
                    ))}
                </select>
            </div>

            {/* Nama Toko */}
            <div className="flex flex-col basis-full md:basis-[48%]">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Nama Toko</label>
                <input
                    type="text"
                    value={data.nama_toko || ''}
                    onChange={(e) => setData('nama_toko', e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Perusahaan */}
            <div className="flex flex-col basis-full md:basis-[48%]">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Perusahaan</label>
                <input
                    type="text"
                    value={data.perusahaan || ''}
                    onChange={(e) => setData('perusahaan', e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Alamat */}
            <div className="flex flex-col basis-full md:basis-[48%]">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Alamat</label>
                <input
                    type="text"
                    value={data.alamat || ''}
                    onChange={(e) => setData('alamat', e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* NPWP */}
            <div className="flex flex-col basis-full md:basis-[48%]">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">NPWP</label>
                <input
                    type="text"
                    value={data.npwp || ''}
                    onChange={(e) => setData('npwp', e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Telepon */}
            <div className="flex flex-col basis-full md:basis-[48%]">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Telepon</label>
                <input
                    type="text"
                    value={data.telp || ''}
                    onChange={(e) => setData('telp', e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Email */}
            <div className="flex flex-col basis-full md:basis-[48%]">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Email</label>
                <input
                    type="text"
                    value={data.email || ''}
                    onChange={(e) => setData('email', e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Luas Indoor */}
            <div className="flex flex-col basis-full md:basis-[48%]">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Luas Indoor (m²)</label>
                <input
                    type="number"
                    value={data.luas_indoor}
                    placeholder='Indoor'
                    onChange={(e) => setData('luas_indoor', e.target.value === "" ? "" : +e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Luas Outdoor */}
            <div className="flex flex-col basis-full md:basis-[48%]">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Luas Outdoor (m²)</label>
                <input
                    type="number"
                    value={data.luas_outdoor}
                    placeholder='Outdoor'
                    onChange={(e) => setData('luas_outdoor', e.target.value === "" ? "" : +e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </div>
    );
};

export default TenantSelector;
