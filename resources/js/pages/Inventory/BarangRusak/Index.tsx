import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { formatTgl } from '@/pages/components/functions';
import { formatDigit } from '@/pages/components/helpers';
import { BarangRusak } from '../models';

interface Props {
    data: BarangRusak[];
    canWrite: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'DAFTAR BARANG RUSAK',
        href: '/inventory/barang-rusak',
    },
];

const Index: React.FC<Props> = ({ data, canWrite }) => {
    const [filteredData, setFilteredData] = useState<BarangRusak[]>(data);

    const handleSearch = (query: string) => {
        const filtered = data.filter(item =>
            item.penerima.toLowerCase().includes(query.toLowerCase()) ||
            item.supplier?.nama.toLowerCase().includes(query.toLowerCase()) ||
            item.details?.some(detail =>
                detail.barang?.deskripsi.toLowerCase().includes(query.toLowerCase())
            )
        );

        setFilteredData(filtered);
    };

    const handleDelete = (id: number) => {
        if (!canWrite) {
            alert('Anda tidak memiliki izin untuk menghapus data ini.');
            return;
        }

        const ket = data.find(t => t.id === id)?.penerima || 'Transaksi ini';

        if (confirm(`Hapus Data ${ket} ?`)) {
            router.delete(route('inventory.barang-rusak.destroy', id));

            // Optionally, you can also remove the deleted barang rusak from the local state
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
                            href={route('inventory.barang-rusak.create')}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Input Barang Rusak
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
                    <table className="bg-white dark:bg-gray-800 shadow-md rounded-md min-w-full">
                        <thead>
                            <tr className="bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400">#</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400">Tanggal</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400">Supplier</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400">Penerima</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400">Detail Barang</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400">Total Rp.</th>
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
                                    <td className="py-2 px-2 text-left border border-black dark:border-gray-400">{v.supplier?.nama}</td>
                                    <td className="py-2 px-2 text-left border border-black dark:border-gray-400">{v.penerima}</td>
                                    <td className="py-2 px-2 text-left border border-black dark:border-gray-400 font-mono">
                                        {v.details && v.details.map((detail, i) => (
                                            <div key={i} className="flex flex-row justify-between">
                                                <span>{detail.barang?.deskripsi}</span>
                                                <span>{formatDigit(detail.qty, 2)} {detail.barang?.satuan} x {formatDigit(detail.harga, 2)} = {formatDigit(detail.total, 2)}</span>
                                            </div>
                                        ))}
                                    </td>
                                    <td className="py-2 px-2 text-right border border-black dark:border-gray-400 font-mono">{formatDigit(v.total, 2)}</td>
                                    <td className="py-2 px-1 text-center border border-black dark:border-gray-400">
                                        <div className='flex flex-row justify-center gap-1'>
                                            <button
                                                title={`Hapus Data ${v.supplier?.nama}`}
                                                onClick={() => handleDelete(v.id)}
                                                className="text-red-500 hover:text-red-700 cursor-pointer">
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
