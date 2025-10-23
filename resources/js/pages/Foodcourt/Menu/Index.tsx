import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Edit, Search, Trash2 } from 'lucide-react';
import { menu } from '../models';
import { useState } from 'react';
import { formatNumber } from '../functions';

interface Props {
    menu: menu[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'DAFTAR MENU',
        href: '/foodcourt/menu',
    },
];

const Index: React.FC<Props> = ({ menu }) => {
    const { props } = usePage<{ userLevel: { is_admin: boolean } }>();
    const level = props.userLevel;

    const [filteredMenu, setFilteredMenu] = useState<menu[]>(menu);

    const handleSearch = (query: string) => {
        // Filter the menu based on the search query by alias, deskripsi, kategori
        const filtered = menu.filter(item =>
            item.tenant?.nama_tenant.toLowerCase().includes(query.toLowerCase()) ||
            item.sku.toLowerCase().includes(query.toLowerCase()) ||
            item.alias.toLowerCase().includes(query.toLowerCase()) ||
            item.deskripsi.toLowerCase().includes(query.toLowerCase()) ||
            item.harga.toString().toLowerCase().includes(query.toLowerCase()) ||
            item.kategorisub?.ket.toLowerCase().includes(query.toLowerCase())
        );

        setFilteredMenu(filtered);
    };

    const handleDelete = (id: number) => {
        const ket = menu.find(t => t.id === id)?.alias || 'this menu';

        if (confirm(`Hapus Menu ${ket} ?`)) {
            router.delete(route('foodcourt.menu.destroy', id));

            // Optionally, remove the deleted item from the filtered list
            setFilteredMenu(prev => prev.filter(item => item.id !== id));
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={breadcrumbs[0].title} />

            <div className="w-full px-4 py-2 max-w-lg md:max-w-xl lg:max-w-3xl xl:max-w-5xl 2xl:max-w-full mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">

                    <div className="mb-2">
                        <Link
                            href={route('foodcourt.menu.create')}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Add Menu
                        </Link>
                    </div>

                    <div className="mb-2 relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                            <Search size={20} className="text-gray-500 dark:text-gray-300" />
                        </div>
                        <input
                            type="text"
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Cari Menu..."
                            className="w-full pl-10 pr-4 py-2 rounded-md border-2 border-gray-500 dark:border-gray-300 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="w-full overflow-x-auto h-full text-sm">
                    <table className="bg-white dark:bg-gray-800 shadow-md rounded-md min-w-full">
                        <thead>
                            <tr className="bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400">#</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400">Tenant</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400">SKU</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400">Alias / Deskripsi</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400">Kategori / Subkat</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400">Harga</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400">Ready</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400">Stok</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400">Act.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMenu.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="py-2 px-2 text-center border border-black dark:border-gray-400">
                                        Tidak ada data...
                                    </td>
                                </tr>
                            )}

                            {filteredMenu.length > 0 && filteredMenu.map((v, index) => (
                                <tr key={v.id} className='hover:bg-blue-300 dark:hover:bg-gray-600'>
                                    <td className="py-2 px-2 text-center border border-black dark:border-gray-400">{index + 1}</td>
                                    <td className="py-2 px-2 text-left border border-black dark:border-gray-400">{v.tenant?.nama_tenant || '-'}</td>
                                    <td className="py-2 px-2 text-center border border-black dark:border-gray-400">{v.sku || ''}</td>
                                    <td className="py-2 px-2 text-left border border-black dark:border-gray-400">
                                        <span className='italic font-bold'>{v.alias}</span>
                                        <br />
                                        {v.deskripsi}
                                    </td>
                                    <td className="py-2 px-2 text-left border border-black dark:border-gray-400">
                                        {v.kategorisub?.kategori?.ket || '-'} /
                                        <br />
                                        {v.kategorisub?.ket || '-'}
                                    </td>
                                    <td className="py-2 px-2 text-right border border-black dark:border-gray-400">{formatNumber(v.harga, 0)}</td>
                                    <td className="py-2 px-2 text-center border border-black dark:border-gray-400">
                                        {v.is_ready ?
                                            // checkmark icon
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        :
                                            // cross icon
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        }
                                    </td>
                                    <td className="py-2 px-2 text-center border border-black dark:border-gray-400">
                                        {v.is_soldout ?
                                            // cross icon
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        :   // checkmark icon
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        }
                                    </td>
                                    <td className="py-2 px-1 text-center border border-black dark:border-gray-400">
                                        <div className='flex flex-row justify-center gap-1'>
                                        <Link
                                            title={`Edit ${v.alias}`}
                                            href={route('foodcourt.menu.edit', v.id)}
                                            className="text-blue-500 hover:text-blue-700 cursor-pointer">
                                            <Edit size={16} />
                                        </Link>

                                        {level.is_admin && <button
                                            title={`Hapus ${v.alias}`}
                                            onClick={() => handleDelete(v.id)}
                                            className="text-red-500 hover:text-red-700 cursor-pointer">
                                            <Trash2 size={16} />
                                        </button>}
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
