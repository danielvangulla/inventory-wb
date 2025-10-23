import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Search, Trash2 } from 'lucide-react';
import { kategori } from '../models';
import { useState } from 'react';

interface Props {
    kategori: kategori[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'KATEGORI',
        href: '/foodcourt/kategori',
    },
];

const Index: React.FC<Props> = ({ kategori }) => {
    const [filteredKategori, setFilteredKategori] = useState<kategori[]>(kategori);

    const handleSearch = (query: string) => {
        const filtered = kategori.filter(item =>
            item.ket.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredKategori(filtered);
    };

    const handleDelete = (id: number) => {
        const ket = kategori.find(t => t.id === id)?.ket || 'this kategori';

        if (confirm(`Hapus Kategori ${ket} ?`)) {
            router.delete(route('foodcourt.kategori.destroy', id));
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={breadcrumbs[0].title} />

            <div className="w-full px-4 py-2 max-w-lg md:max-w-xl lg:max-w-3xl xl:max-w-5xl 2xl:max-w-full mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">

                    <div className="mb-2">
                        <Link
                            href={route('foodcourt.kategori.create')}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Add Kategori
                        </Link>
                    </div>

                    <div className="mb-2 relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                            <Search size={20} className="text-gray-500 dark:text-gray-300" />
                        </div>
                        <input
                            type="text"
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Cari kategori..."
                            className="w-full pl-10 pr-4 py-2 rounded-md border-2 border-gray-500 dark:border-gray-300 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="w-full overflow-x-auto h-full text-sm">
                    <table className="bg-white dark:bg-gray-800 shadow-md rounded-md min-w-full">
                        <thead>
                            <tr className="bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400">No</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400">Kategori</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400">Urutan</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredKategori.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-2 px-2 text-center border border-black dark:border-gray-400">
                                        Tidak ada data...
                                    </td>
                                </tr>
                            )}

                            {filteredKategori.length > 0 && filteredKategori.map((v, index) => (
                                <tr key={v.id} className='hover:bg-blue-300 dark:hover:bg-gray-600'>
                                    <td className="py-2 px-2 text-center border border-black dark:border-gray-400">{index + 1}</td>
                                    <td className="py-2 px-2 text-left border border-black dark:border-gray-400">{v.ket}</td>
                                    <td className="py-2 px-2 text-center border border-black dark:border-gray-400">{v.urut}</td>
                                    <td className="py-2 px-1 text-center border border-black dark:border-gray-400">
                                        <div className='flex flex-row justify-center gap-1'>
                                        <Link
                                            title={`Edit ${v.ket}`}
                                            href={route('foodcourt.kategori.edit', v.id)}
                                            className="text-blue-500 hover:text-blue-700 cursor-pointer">
                                            <Edit size={16} />
                                        </Link>

                                        <button
                                            title={`Hapus ${v.ket}`}
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
