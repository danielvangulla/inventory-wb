import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Edit, Search } from 'lucide-react'; // Import the Edit icon
import { useState } from 'react';
import { NonTenantBook } from './models';

interface Props {
    nontenants: NonTenantBook[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'LIST NON-TENANT',
        href: '/nontenant-books',
    },
];

const Index: React.FC<Props> = ({ nontenants }) => {
    // State for search query
    const [searchQuery, setSearchQuery] = useState('');

    // Filter tenantBooks based on search query
    const filteredTenantBooks = nontenants.filter((v: { nama_toko: string; perusahaan: string; }) => {
        const namaToko = v.nama_toko.toLowerCase();
        const perusahaan = v.perusahaan.toLowerCase();
        return (
            namaToko.includes(searchQuery.toLowerCase()) ||
            perusahaan.includes(searchQuery.toLowerCase())
        );
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="List Non-Tenant" />
            <div className="w-full px-4 py-2 max-w-lg md:max-w-xl lg:max-w-3xl xl:max-w-5xl 2xl:max-w-full mx-auto">
                 {/* Search input with magnifier icon */}
                <div className="mb-4 relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <Search size={20} className="text-gray-500 dark:text-gray-300" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari berdasarkan Nama Tenant atau Perusahaan"
                        className="w-full pl-10 pr-4 py-2 rounded-md border-2 border-gray-500 dark:border-gray-300 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="w full overflow-x-auto h-full text-sm">
                    {/* Adjust the width calculation to take the sidebar width into account */}
                    <table className="bg-white dark:bg-gray-800 shadow-md rounded-md min-w-full">
                        <thead>
                            <tr className="bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                                <th className="py-2 px-4 text-center border border-black dark:border-gray-400">#</th>
                                <th className="py-2 px-4 text-center border border-black dark:border-gray-400">Aksi</th>
                                <th className="py-2 px-4 text-center border border-black dark:border-gray-400">Tenant / Perusahaan</th>
                                <th className="py-2 px-4 text-center border border-black dark:border-gray-400">Lantai / Unit</th>
                                <th className="py-2 px-4 text-center border border-black dark:border-gray-400">Alamat</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTenantBooks.map((v, index) => (
                                <tr key={v.id} className='hover:bg-blue-300 dark:hover:bg-gray-600'>
                                    <td className="py-2 px-2 text-center border border-black dark:border-gray-400">{index + 1}</td>
                                    <td className="py-2 px-2 text-center border border-black dark:border-gray-400 hover:bg-white">
                                        <div className='flex flex-row items-center justify-center gap-1'>
                                            <Link href={`/nontenant-books/${v.id}/edit`} title='Edit Data'>
                                                <Edit size={20} className="text-blue-600 hover:underline hover:text-gray-800 dark:text-blue-500 dark:hover:text-blue-400 cursor-pointer" />
                                            </Link>
                                            {/* <a title='Informasi Detail' className="text-green-600 hover:underline hover:text-gray-800 dark:text-blue-500 dark:hover:text-blue-400 cursor-pointer">
                                                <Info size={20} />
                                            </a> */}
                                        </div>
                                    </td>
                                    <td className="py-2 px-2 text-left border border-black dark:border-gray-400 whitespace-nowrap">
                                        <b>{v.nama_toko}</b> <br />
                                        {v.perusahaan}
                                    </td>
                                    <td className="py-2 px-2 text-left border border-black dark:border-gray-400 whitespace-nowrap">
                                        Lantai <b>{v.tenant?.floor || '-'}</b> <br />
                                        Unit <b>{v.tenant?.no || '-'}</b>
                                    </td>
                                    <td className="py-2 px-2 text-left border border-black dark:border-gray-400 min-w-3xs">
                                        {v.alamat}
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
