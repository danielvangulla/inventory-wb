/* eslint-disable @typescript-eslint/no-explicit-any */

// pages/Payments/components/create/TenantSelector.tsx
import Select from 'react-select';
import React, { useEffect } from 'react';
import { formatUang } from '@/pages/components/helpers';
import { TenantBook } from '@/pages/TenantBook/models';

interface TenantSelectorProps {
    tenantBook: any[];
    data: Record<string, any>;
    setData: (name: string, value: any) => void;
    selectedTenant: any | null;
    setSelectedTenant: React.Dispatch<React.SetStateAction<any | null>>;
    selectedTenantOption: any;
    setSelectedTenantOption: React.Dispatch<React.SetStateAction<any>>;
    handleTenantChange: (tenantId: string) => void;
}

const TenantSelector: React.FC<TenantSelectorProps> = ({
    tenantBook,
    data,
    setData,
    selectedTenant,
    setSelectedTenant,
    selectedTenantOption,
    setSelectedTenantOption,
    handleTenantChange,
}) => {
    const tenantOptions = tenantBook.map((v: TenantBook) => ({
        label: `${v.nama_toko} - ${v.perusahaan}`,
        value: v.id,
    }));

    const handleOptionChange = (option: any) => {
        setSelectedTenantOption(option);
        handleTenantChange(option.value);
    }


    useEffect(() => {
        const tenant = tenantBook.find((v) => v.id == data.tenant_book_id);
        setSelectedTenant(tenant || null);
        setData('tenant_id', tenant ? tenant.tenant_id : '');
        setData('total_sewa', tenant ? tenant.total_sewa : '');
    }, [data.tenant_book_id, tenantBook, setSelectedTenant, setData]);

    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-black dark:border-gray-600 text-sm">

            <div className="flex flex-col">
                <div className="flex flex-col bg-blue-200 p-1 rounded-lg">
                    <label className="text-gray-700 dark:text-gray-300 mb-1 pl-1">
                        Pilih Tenant
                    </label>
                    <Select
                        options={tenantOptions} // options for autocomplete
                        value={selectedTenantOption} // current selected tenant
                        onChange={handleOptionChange} // onChange handler
                        getOptionLabel={(e) => e.label} // specify what to display
                        getOptionValue={(e) => e.value} // specify value to track
                        placeholder="Cari Tenant"
                        className="react-select-container"
                        classNamePrefix="react-select"
                    />
                </div>
            </div>

            <div className="flex flex-col">
                <div className="flex flex-col bg-gray-200 p-1 rounded-lg">
                    <label className="block text-gray-700 mb-1 pl-1">Lokasi</label>
                    <input
                        type="text"
                        value={selectedTenant ? `Lantai ${selectedTenant.tenant.floor} - Unit ${selectedTenant.tenant.no}` : ''}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-300 cursor-not-allowed"
                        disabled={true}
                    />
                </div>
            </div>

            <div className="flex flex-col">
                <div className="flex flex-col bg-gray-200 p-1 rounded-lg">
                    <label className="block text-gray-700 mb-1 pl-1">Luas Indoor (m²)</label>
                    <input
                        type="text"
                        value={selectedTenant ? `${selectedTenant.luas_indoor}` : ''}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-300 cursor-not-allowed"
                        disabled={true}
                    />
                </div>
            </div>

            <div className="flex flex-col">
                <div className="flex flex-col bg-gray-200 p-1 rounded-lg">
                    <label className="block text-gray-700 mb-1 pl-1">Luas Outdoor (m²)</label>
                    <input
                        type="text"
                        value={selectedTenant ? `${selectedTenant.luas_outdoor}` : ''}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-300 cursor-not-allowed"
                        disabled={true}
                    />
                </div>
            </div>

            <div className="flex flex-col">
                <div className="flex flex-col bg-gray-200 p-1 rounded-lg">
                    <label className="block text-gray-700 mb-1 pl-1">Lama Sewa (bulan)</label>
                    <input
                        type="text"
                        value={selectedTenant ? `${selectedTenant.lama_sewa}` : ''}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-300 cursor-not-allowed"
                        disabled={true}
                    />
                </div>
            </div>

            <div className="flex flex-col">
                <div className="flex flex-col bg-gray-200 p-1 rounded-lg">
                    <label className="block text-gray-700 mb-1 pl-1">Total Sewa (Rp)</label>
                    <input
                        type="text"
                        value={selectedTenant ? `${formatUang(selectedTenant.total_sewa)}` : ''}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-300 cursor-not-allowed"
                        disabled={true}
                    />
                </div>
            </div>

        </div>
    );
};

export default TenantSelector;
