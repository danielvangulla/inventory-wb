/* eslint-disable @typescript-eslint/no-explicit-any */
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';
import Select from 'react-select';
import { Head, router } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import { PrinterCheck, Search } from 'lucide-react';
import { GudangMasuk, Supplier } from '../models';
import HutangTable from './HutangTable';
import { printWindow } from '../functions';

interface Props {
    data: GudangMasuk[];
    suppliers: Supplier[];
    params: any[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'LAPORAN HUTANG',
        href: '/inventory/laporan-hutang',
    },
];

const LaporanHutang: React.FC<Props> = ({ data, suppliers, params }) => {
    const paramTgl1 = params[0] || '';
    const paramTgl2 = params[1] || '';
    const paramSupplierId = parseInt(params[2]) || 0;

    //=========================== State untuk filter Tanggal ==========================
    const [tglMulai, setTglMulai] = useState<string>(paramTgl1);
    const handleTglMulaiChange = (value: string) => {
        setTglMulai(value);
        handleFilterByTanggal(value, tglSelesai);
    };

    const [tglSelesai, setTglSelesai] = useState<string>(paramTgl2);
    const handleTglSelesaiChange = (value: string) => {
        setTglSelesai(value);
        handleFilterByTanggal(tglMulai, value);
    };

    const handleFilterByTanggal = (tgl1: string, tgl2: string) => {
        if (!tgl1 && !tgl2) return;

        router.visit(`/inventory/laporan-hutang`, {
            method: 'post',
            data: {
                tgl1: tgl1,
                tgl2: tgl2,
                supplierId: selectedSupplierOption?.value || 0,
            },
        });
    };

    //=========================== State untuk filter Supplier ===========================
    const supplierOptions = suppliers.map((v: any) => ({
        label: v.nama,
        value: v.id,
        data: v,
    }));

    supplierOptions.unshift({
        label: 'Semua Supplier',
        value: 0,
        data: null,
    });

    const [selectedSupplierOption, setSelectedSupplierOption] = useState<any | null>(supplierOptions.find(opt => opt.value === paramSupplierId) || supplierOptions[0]);

    const handleSupplierOptionChange = (option: any) => {
        setSelectedSupplierOption(option);
        setFilteredData(finalFilteredData(
            option?.value || 0,
            searchQuery
        ));
    };

    const filterBySupplier = (currentData: GudangMasuk[], supplierId: number) => {
        if (supplierId === 0) return currentData;
        return currentData.filter(item => item.supplier_id === supplierId);
    };


    //=========================== State untuk Search ===========================
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filteredData, setFilteredData] = useState<GudangMasuk[]>(data);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setFilteredData(finalFilteredData(
            selectedSupplierOption?.value || 0,
            query
        ));
    };

    const filterBySearch = (currentData: GudangMasuk[], query: string) => {
        return currentData.filter(item =>
            item.supplier?.nama.toLowerCase().includes(query.toLowerCase()) ||
            item.details?.some((det) =>
                det.barang?.deskripsi.toLowerCase().includes(query.toLowerCase())
            )
        );
    };

    // Final filter function combining all filters
    const finalFilteredData = (
        supplierId: number,
        query: string,
    ) => {
        const filter1 = filterBySupplier(data, supplierId);
        const filter2 = filterBySearch(filter1, query);

        return filter2;
    }

    const handlePrint = () => {
        const p1 = tglMulai;
        const p2 = tglSelesai;
        const p3 = selectedSupplierOption?.value || 0;

        const printUrl = `/inventory/laporan-hutang-print/${p1}/${p2}/${p3}`;
        printWindow(printUrl);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={breadcrumbs[0].title} />

            <div className="w-full px-4 py-2 max-w-lg md:max-w-xl lg:max-w-3xl xl:max-w-5xl 2xl:max-w-full mx-auto">
                <div className="flex flex-col justify-between items-center gap-4 mb-1">

                    <div className="flex flex-col justify-center items-center gap-2 text-xs md:text-xs">
                        <div className="flex flex-wrap gap-2">

                            <div className="flex flex-row lg:flex-col items-center lg:items-start justify-center gap-2 lg:gap-0 min-w-36 bg-gray-100 p-1 rounded-lg">
                                <label className="text-gray-700 font-medium text-center w-full">Tanggal Mulai</label>
                                <input
                                    type="date"
                                    className="border border-gray-300 rounded-md p-1 bg-white text-gray-800 h-8 w-full"
                                    value={tglMulai}
                                    onChange={(e) => handleTglMulaiChange(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-row lg:flex-col items-center lg:items-start justify-center gap-2 lg:gap-0 min-w-36 bg-gray-100 p-1 rounded-lg">
                                <label className="text-gray-700 font-medium text-center w-full">Tanggal Selesai</label>
                                <input
                                    type="date"
                                    className="border border-gray-300 rounded-md p-1 bg-white text-gray-800 h-8 w-full"
                                    value={tglSelesai}
                                    onChange={(e) => handleTglSelesaiChange(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-row lg:flex-col items-center lg:items-start justify-center gap-2 lg:gap-0 min-w-36 bg-gray-100 p-1 rounded-lg">
                                <Select
                                    options={supplierOptions} // options for autocomplete
                                    value={selectedSupplierOption} // current selected supplier
                                    onChange={handleSupplierOptionChange} // onChange handler
                                    getOptionLabel={(e) => e.label} // specify what to display
                                    getOptionValue={(e) => e.value} // specify value to track
                                    placeholder="Cari..."
                                    className="react-select-container w-full"
                                    classNamePrefix="react-select"
                                />
                            </div>

                            {/* Print Button */}
                            <div className="flex flex-row lg:flex-col items-center lg:items-start justify-center gap-2 lg:gap-0 bg-gray-100 p-1 rounded-lg">
                                <button
                                    onClick={handlePrint}
                                    className="bg-blue-500 text-white p-2 rounded-lg cursor-pointer hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center"
                                >
                                    <PrinterCheck className="inline-block" size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Search Temporary Hidden */}
                    <div className="mb-2 relative w-64 md:w-96 text-xs md:text-sm hidden">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                            <Search size={20} className="text-gray-500" />
                        </div>
                        <input
                            type="text"
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Cari Penerima / Supplier / Barang..."
                            className="w-full pl-10 pr-4 py-2 rounded-md border-2 border-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="w-full overflow-x-auto h-full text-sm mt-4">
                    <HutangTable filteredData={filteredData} />
                </div>
            </div>
        </AppLayout>
    );
};

export default LaporanHutang;
