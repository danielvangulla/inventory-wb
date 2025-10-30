import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { PrinterCheckIcon, Search, Trash2 } from 'lucide-react';
import { GudangKeluar } from '../../models';
import { useState } from 'react';
import { formatTgl } from '@/pages/components/functions';
import { formatDigit } from '@/pages/components/helpers';
import { printWindow } from '../../functions';

interface Props {
    data: GudangKeluar[];
    canWrite: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'DAFTAR GUDANG KELUAR',
        href: '/inventory/keluar-gudang',
    },
];

const Index: React.FC<Props> = ({ data, canWrite }) => {
    const [filteredData, setFilteredData] = useState<GudangKeluar[]>(data);

    const handleSearch = (query: string) => {
        const filtered = data.filter(item =>
            item.menyerahkan.toLowerCase().includes(query.toLowerCase()) ||
            item.mengambil.toLowerCase().includes(query.toLowerCase()) ||
            item.mengantar.toLowerCase().includes(query.toLowerCase()) ||
            item.outlet?.nama.toLowerCase().includes(query.toLowerCase()) ||
            item.details?.some(detail =>
                detail.barang?.deskripsi.toLowerCase().includes(query.toLowerCase())
            )
        );

        setFilteredData(filtered);
    };

    const handlePrint = (id: number, tipe: string) => {
        const printUrl = `/inventory/keluar-gudang/${id}?tipe=${tipe}`;
        printWindow(printUrl);
    };

    const handleDelete = (id: number) => {
        if (!canWrite) {
            alert('Anda tidak memiliki izin untuk menghapus data ini.');
            return;
        }

        const ket = data.find(t => t.id === id)?.outlet?.nama || 'Transaksi ini';

        if (confirm(`Hapus Data untuk ${ket} ?`)) {
            router.delete(route('inventory.keluar-gudang.destroy', id));

            // Optionally, you can also remove the deleted gudang keluar from the local state
            const updatedData = filteredData.filter(item => item.id !== id);
            setFilteredData(updatedData);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={breadcrumbs[0].title} />

            <div className="w-full px-4 py-2 max-w-lg md:max-w-xl lg:max-w-3xl xl:max-w-5xl 2xl:max-w-full mx-auto">
                <div className="flex flex-row justify-between items-center mb-4">

                    {canWrite && <div className="mb-2">
                        <Link
                            href={route('inventory.keluar-gudang.create')}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Buat Baru
                        </Link>
                    </div>}

                    <div className="mb-2 relative w-64 md:w-96 text-xs md:text-sm">
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

                <div className="w-full overflow-x-auto h-full text-sm">
                    <table className="bg-white dark:bg-gray-800 shadow-md rounded-md min-w-full text-sm">
                        <thead>
                            <tr className="bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400">#</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400">Tanggal</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400">Outlet</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400">Keterangan</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400">Detail Barang</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400">Total Rp.</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400">Tanggal Input</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400">Act.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="py-2 px-2 text-center border border-black dark:border-gray-400">
                                        Tidak ada data...
                                    </td>
                                </tr>
                            )}

                            {filteredData.length > 0 && filteredData.map((v, index) => (
                                <tr key={v.id} className='hover:bg-blue-300 dark:hover:bg-gray-600'>
                                    <td className="py-2 px-2 text-center border border-black dark:border-gray-400">{index + 1}</td>
                                    <td className="py-2 px-2 text-center border border-black dark:border-gray-400">{formatTgl(v.tgl)}</td>
                                    <td className="py-2 px-2 text-left border border-black dark:border-gray-400">{v.outlet?.nama}</td>
                                    <td className="py-2 px-2 text-left border border-black dark:border-gray-400 whitespace-nowrap text-xs font-mono">
                                        <div className="flex flex-row">
                                            <div className='w-20'>Menyerahkan</div>
                                            <div className="">: {v.menyerahkan}</div>
                                        </div>
                                        <div className="flex flex-row">
                                            <div className='w-20'>Mengambil</div>
                                            <div className="">: {v.mengambil}</div>
                                        </div>
                                        <div className="flex flex-row">
                                            <div className='w-20'>Mengantar</div>
                                            <div className="">: {v.mengantar}</div>
                                        </div>
                                    </td>
                                    <td className="py-2 px-2 text-left border border-black dark:border-gray-400 whitespace-nowrap font-mono text-xs">
                                        {v.details && v.details.map((detail, i) => (
                                            <div key={i} className="flex flex-row justify-between gap-2">
                                                <span>{detail.barang?.deskripsi}</span>
                                                <span>{formatDigit(detail.qty, 2)} {detail.barang?.satuan} x {formatDigit(detail.harga, 2)} = {formatDigit(detail.total, 2)}</span>
                                            </div>
                                        ))}
                                    </td>
                                    <td className="py-2 px-2 text-right border border-black dark:border-gray-400">{formatDigit(v.total, 2)}</td>
                                    <td className="py-2 px-2 text-center border border-black dark:border-gray-400">{formatTgl(v.created_at)}</td>
                                    <td className="py-2 px-1 text-center border border-black dark:border-gray-400 w-20">
                                        <div className='flex flex-row justify-center gap-1'>
                                            <button
                                                title={`Cetak Nota`}
                                                onClick={() => handlePrint(v.id, 'nota')}
                                                className="text-orange-600 hover:text-orange-800 cursor-pointer rounded-full p-1 hover:bg-gray-200">
                                                <PrinterCheckIcon size={16} />
                                            </button>
                                            <button
                                                title={`Cetak Surat Jalan`}
                                                onClick={() => handlePrint(v.id, 'surat-jalan')}
                                                className="text-green-600 hover:text-green-800 cursor-pointer rounded-full p-1 hover:bg-gray-200">
                                                <PrinterCheckIcon size={16} />
                                            </button>
                                            <button
                                                title={`Hapus Data untuk ${v.outlet?.nama || 'Transaksi ini'}`}
                                                onClick={() => handleDelete(v.id)}
                                                className="text-red-500 hover:text-red-700 cursor-pointer rounded-full p-1 hover:bg-gray-200">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
};

export default Index;
