import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { formatUang } from '../components/helpers';
import { Edit, Search } from 'lucide-react'; // Import the Edit icon
import { useState } from 'react';
import { TenantBook } from './models';

interface Props {
    tenantBooks: TenantBook[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'LIST KONTRAK',
        href: '/tenant-books',
    },
];

const hitungSewaM2 = (v: TenantBook, isIndoor: boolean) => {
    const luas = isIndoor ? v.luas_indoor : v.luas_outdoor;
    const totalSewa = isIndoor ? v.total_sewa_indoor : v.total_sewa_outdoor;
    const lamaSewa = v.lama_sewa;

    return luas && luas > 0 && totalSewa && totalSewa > 0 && lamaSewa && lamaSewa > 0 ? totalSewa / (luas * lamaSewa) : 0;
}

const TenantList: React.FC<Props> = ({ tenantBooks }) => {
    // State for search query
    const [searchQuery, setSearchQuery] = useState('');

    // Filter tenantBooks based on search query
    const filteredTenantBooks = tenantBooks.filter((tenantBook) => {
        const namaToko = tenantBook.nama_toko && tenantBook.nama_toko.toLowerCase() || '';
        const perusahaan = tenantBook.perusahaan && tenantBook.perusahaan.toLowerCase() || '';
        return (
            namaToko.includes(searchQuery.toLowerCase()) ||
            perusahaan.includes(searchQuery.toLowerCase())
        );
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="List Kontrak" />
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

                <div className="w-full overflow-x-auto h-full text-sm">
                    {/* Adjust the width calculation to take the sidebar width into account */}
                    <table className="bg-white dark:bg-gray-800 shadow-md rounded-md min-w-full">
                        <thead>
                            <tr className="bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                                <th className="py-2 px-4 text-center border border-black dark:border-gray-400" rowSpan={2}>No.</th>
                                <th className="py-2 px-4 text-center border border-black dark:border-gray-400" rowSpan={2}>Aksi</th>
                                <th className="py-2 px-4 text-center border border-black dark:border-gray-400" rowSpan={2}>Tenant / Perusahaan</th>
                                <th className="py-2 px-4 text-center border border-black dark:border-gray-400" rowSpan={2}>Lantai / Unit</th>
                                <th className="py-2 px-4 text-center border border-black dark:border-gray-400" colSpan={2}>Luas (m²)</th>
                                <th className="py-2 px-4 text-center border border-black dark:border-gray-400" rowSpan={2}>Lama Sewa <br />(bulan)</th>
                                <th className="py-2 px-4 text-center border border-black dark:border-gray-400" colSpan={2}>Sewa/m²</th>
                                <th className="py-2 px-4 text-center border border-black dark:border-gray-400" colSpan={2}>Sub-Total Sewa</th>
                                <th className="py-2 px-4 text-center border border-black dark:border-gray-400" rowSpan={2}>Total Sewa</th>
                                <th className="py-2 px-4 text-center border border-black dark:border-gray-400" rowSpan={2}>Service per Bulan</th>
                            </tr>
                            <tr className="bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                                <th className="py-2 px-4 text-center border border-black dark:border-gray-400">Indoor</th>
                                <th className="py-2 px-4 text-center border border-black dark:border-gray-400">Outdoor</th>
                                <th className="py-2 px-4 text-center border border-black dark:border-gray-400">Indoor</th>
                                <th className="py-2 px-4 text-center border border-black dark:border-gray-400">Outdoor</th>
                                <th className="py-2 px-4 text-center border border-black dark:border-gray-400">Indoor</th>
                                <th className="py-2 px-4 text-center border border-black dark:border-gray-400">Outdoor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTenantBooks.map((v, index) => (
                                <tr key={v.id} className='hover:bg-blue-300 dark:hover:bg-gray-600'>
                                    <td className="py-2 px-2 text-center border border-black dark:border-gray-400">{index + 1}</td>
                                    <td className="py-2 px-2 text-center border border-black dark:border-gray-400 ">
                                        <div className='flex flex-row items-center justify-center gap-1'>
                                            <Link href={`/tenant-books/${v.id}/edit`} title='Edit Data'>
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
                                        {v.tenant ? (v.tenant_id < 9000
                                            ? `Lantai ${v.tenant.floor} / Unit No. ${v.tenant.no}`
                                            : `Lantai ${v.tenant.floor} / ${v.tenant.no}`) : '-'
                                        }
                                    </td>
                                    <td className="py-2 px-2 text-center border border-black dark:border-gray-400">{v.luas_indoor}</td>
                                    <td className="py-2 px-2 text-center border border-black dark:border-gray-400">{v.luas_outdoor}</td>
                                    <td className="py-2 px-2 text-center border border-black dark:border-gray-400">{v.lama_sewa}</td>
                                    <td className="py-2 px-2 text-right border border-black dark:border-gray-400">{formatUang(hitungSewaM2(v, true))}</td>
                                    <td className="py-2 px-2 text-right border border-black dark:border-gray-400">{formatUang(hitungSewaM2(v, false))}</td>
                                    <td className="py-2 px-2 text-right border border-black dark:border-gray-400">{formatUang(v.total_sewa_indoor || 0)}</td>
                                    <td className="py-2 px-2 text-right border border-black dark:border-gray-400">{formatUang(v.total_sewa_outdoor || 0)}</td>
                                    <td className="py-2 px-2 text-right border border-black dark:border-gray-400">{formatUang(v.total_sewa || 0)}</td>
                                    <td className="py-2 px-2 text-right border border-black dark:border-gray-400">{formatUang(v.service_per_bulan || 0)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
};

export default TenantList;
