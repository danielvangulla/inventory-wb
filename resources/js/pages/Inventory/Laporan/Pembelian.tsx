/* eslint-disable @typescript-eslint/no-explicit-any */
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';
import Select from 'react-select';
import { Head, router } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import { PrinterCheck, Search } from 'lucide-react';
import { Barang, GudangMasukDetail, Kategori, Supplier } from '../models';
import PembelianTable from './PembelianTable';
import { printWindow } from '../functions';

interface Props {
    data: GudangMasukDetail[];
    barangs: Barang[];
    suppliers: Supplier[];
    kategoris: Kategori[];
    params: any[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'LAPORAN PEMBELIAN',
        href: '/inventory/laporan-pembelian',
    },
];

const LaporanPembelian: React.FC<Props> = ({ data, barangs, suppliers, kategoris, params }) => {
    const paramTgl1 = params[0] || '';
    const paramTgl2 = params[1] || '';
    const paramBarangId = parseInt(params[2]) || 0;
    const paramSupplierId = parseInt(params[3]) || 0;
    const paramKategoriId = parseInt(params[4]) || 0;
    const paramKategorisubId = parseInt(params[5]) || 0;

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

        router.visit(`/inventory/laporan-pembelian`, {
            method: 'post',
            data: {
                tgl1: tgl1,
                tgl2: tgl2,
                barangId: selectedBarangOption?.value || 0,
                supplierId: selectedSupplierOption?.value || 0,
                kategoriId: selectedKategoriOption?.value || 0,
                kategorisubId: selectedKategorisubOption?.value || 0,
            },
        });
    };

    //=========================== State untuk filter Barang ==========================
    const barangOptions = barangs.map((v: any) => ({
        label: v.deskripsi,
        value: v.id,
        data: v,
    }));

    barangOptions.unshift({
        label: 'Semua Barang',
        value: 0,
        data: null,
    });

    const [selectedBarangOption, setSelectedBarangOption] = useState<any | null>(barangOptions.find(opt => opt.value === paramBarangId) || barangOptions[0]);

    const handleBarangOptionChange = (option: any) => {
        setSelectedBarangOption(option);
        setFilteredData(finalFilteredData(
            option?.value || 0,
            selectedSupplierOption?.value || 0,
            selectedKategoriOption?.value || 0,
            selectedKategorisubOption?.value || 0,
            searchQuery
        ));
    };

    const filterByBarang = (currentData: GudangMasukDetail[], barangId: number) => {
        if (barangId === 0) return currentData;
        return currentData.filter(item => item.barang_id === barangId);
    }

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
            selectedBarangOption?.value || 0,
            option?.value || 0,
            selectedKategoriOption?.value || 0,
            selectedKategorisubOption?.value || 0,
            searchQuery
        ));
    };

    const filterBySupplier = (currentData: GudangMasukDetail[], supplierId: number) => {
        if (supplierId === 0) return currentData;
        return currentData.filter(item => item.gudang_masuk?.supplier_id === supplierId);
    };

    //=========================== State untuk filter Kategori ===========================
    const kategoriOptions = kategoris.map((v: any) => ({
        label: v.ket,
        value: v.id,
        data: v,
    }));

    kategoriOptions.unshift({
        label: 'Semua Kategori',
        value: 0,
        data: null,
    });

    const [selectedKategoriOption, setSelectedKategoriOption] = useState<any | null>(kategoriOptions.find(opt => opt.value === paramKategoriId) || kategoriOptions[0]);

    const handleKategoriOptionChange = (option: any) => {
        setSelectedKategoriOption(option);
        setSelectedKategorisubOption(kategorisubOptions[0]);

        setFilteredData(finalFilteredData(
            selectedBarangOption?.value || 0,
            selectedSupplierOption?.value || 0,
            option?.value || 0,
            0,
            searchQuery
        ));
    };

    const filterByKategori = (currentData: GudangMasukDetail[], kategoriId: number) => {
        if (kategoriId === 0) return currentData;
        return currentData.filter(item => item.barang?.kategori_id === kategoriId);
    };

    //=========================== State untuk Kategorisub ===========================
    // Only shows Sub-kategori with kategori_id == selectedKategoriOption.value except when selectedKategoriOption.value == 0
    let kategorisubOptions: any = [];
    if (selectedKategoriOption && selectedKategoriOption.value !== 0) {
        const selectedKategori = kategoris.find(k => k.id === selectedKategoriOption.value);
        if (selectedKategori) {
            kategorisubOptions = selectedKategori.kategorisubs?.map((v: any) => ({
                label: v.ket,
                value: v.id,
                data: v,
            }));
        }
    } else {
        // show all kategorisub
        kategoris.forEach(v => {
            v.kategorisubs?.forEach((v: any) => {
                kategorisubOptions.push({
                    label: v.ket,
                    value: v.id,
                    data: v,
                });
            });
        });
    }

    kategorisubOptions.unshift({
        label: 'Semua Sub-kategori',
        value: 0,
        data: null,
    });

    const [selectedKategorisubOption, setSelectedKategorisubOption] = useState<any | null>(
        kategorisubOptions.find((opt: { value: number; }) => opt.value === paramKategorisubId) || kategorisubOptions[0]
    );

    const handleKategorisubOptionChange = (option: any) => {
        setSelectedKategorisubOption(option);
        setFilteredData(finalFilteredData(
            selectedBarangOption?.value || 0,
            selectedSupplierOption?.value || 0,
            selectedKategoriOption?.value || 0,
            option?.value || 0,
            searchQuery
        ));
    }

    const filterByKategorisub = (currentData: GudangMasukDetail[], kategorisubId: number) => {
        if (kategorisubId === 0) return currentData;
        return currentData.filter(item => item.barang?.kategorisub_id === kategorisubId);
    };

    //=========================== State untuk Search ===========================
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filteredData, setFilteredData] = useState<GudangMasukDetail[]>(data);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setFilteredData(finalFilteredData(
            selectedBarangOption?.value || 0,
            selectedSupplierOption?.value || 0,
            selectedKategoriOption?.value || 0,
            selectedKategorisubOption?.value || 0,
            query
        ));
    };

    const filterBySearch = (currentData: GudangMasukDetail[], query: string) => {
        return currentData.filter(item =>
            item.gudang_masuk?.supplier?.nama.toLowerCase().includes(query.toLowerCase()) ||
            item.barang?.deskripsi.toLowerCase().includes(query.toLowerCase()) ||
            item.barang?.kategori?.ket.toLowerCase().includes(query.toLowerCase()) ||
            item.barang?.kategorisub?.ket.toLowerCase().includes(query.toLowerCase())
        );
    };

    // Final filter function combining all filters
    const finalFilteredData = (
        barangId: number,
        supplierId: number,
        kategoriId: number,
        kategorisubId: number,
        query: string,
    ) => {
        const filter1 = filterByBarang(data, barangId);
        const filter2 = filterBySupplier(filter1, supplierId);
        const filter3 = filterByKategori(filter2, kategoriId);
        const filter4 = filterByKategorisub(filter3, kategorisubId);
        const filter5 = filterBySearch(filter4, query);

        return filter5;
    }

    const handlePrint = () => {
        const p1 = tglMulai;
        const p2 = tglSelesai;
        const p3 = selectedBarangOption?.value || 0;
        const p4 = selectedSupplierOption?.value || 0;
        const p5 = selectedKategoriOption?.value || 0;
        const p6 = selectedKategorisubOption?.value || 0;

        const printUrl = `/inventory/laporan-pembelian-print/${p1}/${p2}/${p3}/${p4}/${p5}/${p6}`;
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

                        </div>

                        <div className="flex flex-wrap gap-2">

                            <div className="flex flex-row lg:flex-col items-center lg:items-start justify-center gap-2 lg:gap-0 min-w-36 bg-gray-100 p-1 rounded-lg">
                                <Select
                                    options={barangOptions} // options for autocomplete
                                    value={selectedBarangOption} // current selected barang
                                    onChange={handleBarangOptionChange} // onChange handler
                                    getOptionLabel={(e) => e.label} // specify what to display
                                    getOptionValue={(e) => e.value} // specify value to track
                                    placeholder="Cari..."
                                    className="react-select-container w-full"
                                    classNamePrefix="react-select"
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

                            <div className="flex flex-row lg:flex-col items-center lg:items-start justify-center gap-2 lg:gap-0 min-w-36 bg-gray-100 p-1 rounded-lg">
                                <Select
                                    options={kategoriOptions} // options for autocomplete
                                    value={selectedKategoriOption} // current selected kategori
                                    onChange={handleKategoriOptionChange} // onChange handler
                                    getOptionLabel={(e) => e.label} // specify what to display
                                    getOptionValue={(e) => e.value} // specify value to track
                                    placeholder="Cari..."
                                    className="react-select-container w-full"
                                    classNamePrefix="react-select"
                                />
                            </div>

                            <div className="flex flex-row lg:flex-col items-center lg:items-start justify-center gap-2 lg:gap-0 min-w-36 bg-gray-100 p-1 rounded-lg">
                                <Select
                                    options={kategorisubOptions} // options for autocomplete
                                    value={selectedKategorisubOption} // current selected kategorisub
                                    onChange={handleKategorisubOptionChange} // onChange handler
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
                            <Search size={20} className="text-gray-500 dark:text-gray-300" />
                        </div>
                        <input
                            type="text"
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Cari Penerima / Supplier / Barang..."
                            className="w-full pl-10 pr-4 py-2 rounded-md border-2 border-gray-500 dark:border-gray-300 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="w-full overflow-x-auto h-full text-sm mt-4">
                    <PembelianTable filteredData={filteredData} />
                </div>
            </div>
        </AppLayout>
    );
};

export default LaporanPembelian;
