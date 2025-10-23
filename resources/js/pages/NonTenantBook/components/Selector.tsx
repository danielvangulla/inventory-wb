/* eslint-disable @typescript-eslint/no-explicit-any */

// pages/NonTenantBook/components/Selector.tsx
import React from 'react';
import { Tenant } from '../models';

interface SelectorProps {
    tenants: Tenant[];
    selectedFloor: string;
    setSelectedFloor: React.Dispatch<React.SetStateAction<string>>;
    filteredTenants: Tenant[];
    setData: (field: string, value: any) => void;
    data: Record<string, any>;
}

const Selector: React.FC<SelectorProps> = ({
    tenants,
    selectedFloor,
    setSelectedFloor,
    filteredTenants,
    setData,
    data,
}) => {
    const handleTenantChange = (e: { target: { value: any; }; }) => {
        const tenantId = e.target.value;
        setData('tenant_id', tenantId);

        if (tenantId) {
            const selectedTenant = tenants.find(t => t.id == tenantId);

            if (selectedTenant && selectedTenant.tenant_book && selectedTenant.tenant_book.length > 0) {
                const tenantBook = selectedTenant.tenant_book[0];

                setData('nama_toko', tenantBook.nama_toko || '');
                setData('perusahaan', tenantBook.perusahaan || '');
                setData('alamat', tenantBook.alamat || '');
                setData('npwp', tenantBook.npwp || '');
                setData('telp', tenantBook.telp || '');
                setData('email', tenantBook.email || '');
            }
        } else {
            setData('nama_toko', '');
            setData('perusahaan', '');
            setData('alamat', '');
            setData('npwp', '');
            setData('telp', '');
            setData('email', '');
        }
    }

    return (
        <div className="w-full grid grid-cols-2 gap-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-t-lg border-2 border-black dark:border-gray-600 text-sm">
            {/* Lantai Selection */}
            <div className="flex flex-col">
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
            <div className="flex flex-col">
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
                            Unit No. {t.no}
                        </option>
                    ))}
                </select>
            </div>

            {/* Nama Toko */}
            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Nama Toko</label>
                <input
                    type="text"
                    value={data.nama_toko || ''}
                    onChange={(e) => setData('nama_toko', e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Perusahaan */}
            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Perusahaan</label>
                <input
                    type="text"
                    value={data.perusahaan || ''}
                    onChange={(e) => setData('perusahaan', e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* NPWP */}
            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">NPWP</label>
                <input
                    type="text"
                    value={data.npwp || ''}
                    onChange={(e) => setData('npwp', e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Telepon */}
            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Telepon</label>
                <input
                    type="text"
                    value={data.telp}
                    onChange={(e) => setData('telp', e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Email */}
            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Email</label>
                <input
                    type="text"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Alamat */}
            <div className="flex flex-col col-span-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Alamat</label>
                {/* use textarea */}
                <textarea
                    value={data.alamat || ''}
                    onChange={(e) => setData('alamat', e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                />
            </div>
        </div>
    );
};

export default Selector;
