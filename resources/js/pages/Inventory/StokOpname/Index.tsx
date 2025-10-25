import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { formatTgl } from '@/pages/components/functions';
import { formatDigit } from '@/pages/components/helpers';
import { Opname } from '../models';

interface Props {
    data: Opname[];
    canWrite: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'DAFTAR STOK OPNAME',
        href: '/inventory/stok-opname',
    },
];

const Index: React.FC<Props> = ({ data, canWrite }) => {
    const [filteredData, setFilteredData] = useState<Opname[]>(data);

    const handleSearch = (query: string) => {
        const filtered = data.filter(item =>
            item.user?.name.toLowerCase().includes(query.toLowerCase()) ||
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

        const ket = data.find(t => t.id === id)?.user?.name || 'ini';

        if (confirm(`Hapus Data Opname ${ket} ?`)) {
            router.delete(route('inventory.stok-opname.destroy', id));

            // Optionally, you can also remove the deleted Opname from the local state
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
                            href={route('inventory.stok-opname.create')}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Input Stok Opname
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
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400" rowSpan={2}>#</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400" rowSpan={2}>Tanggal</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400" rowSpan={2}>Keterangan</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400" colSpan={2}>Detail Barang</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400" colSpan={4}>Detail Opname</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400" rowSpan={2}>Total Selisih Rp.</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400" rowSpan={2}>Act.</th>
                            </tr>
                            <tr>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400">Deskripsi</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400">Harga Beli</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400">Qty Fisik</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400">Qty Sistem</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400">Qty Selisih</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400">Selisih Rp.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length === 0 && (
                                <tr>
                                    <td colSpan={11} className="py-2 px-2 text-center border border-black dark:border-gray-400">
                                        Tidak ada data...
                                    </td>
                                </tr>
                            )}

                            {filteredData.length > 0 && filteredData.map((v, index) => (
                                <tr key={v.id} className='hover:bg-blue-300 dark:hover:bg-gray-600'>
                                    <td className="py-2 px-2 text-center border border-black dark:border-gray-400">{index + 1}</td>
                                    <td className="py-2 px-2 text-center border border-black dark:border-gray-400">{formatTgl(v.tgl)}</td>
                                    <td className="py-2 px-2 text-left border border-black dark:border-gray-400">
                                        <span className="text-xs font-bold italic text-blue-700">by {v.user?.name}</span> <br />
                                        {v.catatan}
                                    </td>
                                    <td className="py-2 px-2 text-left border border-black dark:border-gray-400">
                                        {v.details && v.details.map((detail, i) => (
                                            <div key={i} className="flex flex-row justify-between">
                                                <span>{detail.barang?.deskripsi}</span>
                                            </div>
                                        ))}
                                    </td>
                                    <td className="py-2 px-2 text-center border border-black dark:border-gray-400 font-mono">
                                        {v.details && v.details.map((detail, i) => (
                                            <div key={i}>
                                                <span>{formatDigit(detail.harga, 2)}</span>
                                            </div>
                                        ))}
                                    </td>
                                    <td className="py-2 px-2 text-center border border-black dark:border-gray-400 font-mono">
                                        {v.details && v.details.map((detail, i) => (
                                            <div key={i}>
                                                <span>{formatDigit(detail.qty_fisik, 2)}</span>
                                            </div>
                                        ))}
                                    </td>
                                    <td className="py-2 px-2 text-center border border-black dark:border-gray-400 font-mono">
                                        {v.details && v.details.map((detail, i) => (
                                            <div key={i}>
                                                <span>{formatDigit(detail.qty_sistem, 2)}</span>
                                            </div>
                                        ))}
                                    </td>
                                    <td className="py-2 px-2 text-center border border-black dark:border-gray-400 font-mono">
                                        {v.details && v.details.map((detail, i) => (
                                            <div key={i}>
                                                <span className={detail.qty_selisih < 0 ? 'text-red-500' : ''}>{formatDigit(detail.qty_selisih, 2)}</span>
                                            </div>
                                        ))}
                                    </td>
                                    <td className="py-2 px-2 text-center border border-black dark:border-gray-400 font-mono">
                                        {v.details && v.details.map((detail, i) => (
                                            <div key={i}>
                                                <span className={detail.selisih_rp < 0 ? 'text-red-500' : ''}>{formatDigit(detail.selisih_rp, 2)}</span>
                                            </div>
                                        ))}
                                    </td>
                                    <td className="py-2 px-2 text-right border border-black dark:border-gray-400 font-mono">
                                        <span className={v.total < 0 ? 'text-red-500' : ''}>{formatDigit(v.total, 2)}</span>
                                    </td>
                                    <td className="py-2 px-1 text-center border border-black dark:border-gray-400">
                                        <div className='flex flex-row justify-center gap-1'>
                                            <button
                                                title={`Hapus Data Opname ${v.user?.name}`}
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
