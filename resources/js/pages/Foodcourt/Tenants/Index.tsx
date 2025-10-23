import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Search, Trash2 } from 'lucide-react';
import { tenant } from '../models';

interface Props {
    tenants: tenant[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'DAFTAR TENANT',
        href: '/foodcourt/tenants',
    },
];

const Index: React.FC<Props> = ({ tenants }) => {
    const handleDelete = (id: number) => {
        const nama_tenant = tenants.find(t => t.id === id)?.nama_tenant || 'this tenant';

        if (confirm(`Hapus Tenant ${nama_tenant} ?`)) {
            router.delete(route('foodcourt.tenants.destroy', id));
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={breadcrumbs[0].title} />

            <div className="w-full px-4 py-2 max-w-lg md:max-w-xl lg:max-w-3xl xl:max-w-5xl 2xl:max-w-full mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">

                    <div className="mb-2">
                        <Link
                            href={route('foodcourt.tenants.create')}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Add Tenant
                        </Link>
                    </div>

                    <div className="mb-2 relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                            <Search size={20} className="text-gray-500 dark:text-gray-300" />
                        </div>
                        <input
                            type="text"
                            value={''}
                            onChange={() => { }}
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-2 rounded-md border-2 border-gray-500 dark:border-gray-300 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="w-full overflow-x-auto h-full text-sm">
                    <table className="bg-white dark:bg-gray-800 shadow-md rounded-md min-w-full">
                        <thead>
                            <tr className="bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400">No</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400">Nama Tenant</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400">Perusahaan</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400">Owner</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400">Telp / HP</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400">Email</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400">Alamat</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400">IP Printer</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {tenants.map((v, index) => (
                                <tr key={v.id} className='hover:bg-blue-300 dark:hover:bg-gray-600'>
                                    <td className="py-2 px-2 text-center border border-black dark:border-gray-400">{index + 1}</td>
                                    <td className="py-2 px-2 text-left border border-black dark:border-gray-400">{v.nama_tenant}</td>
                                    <td className="py-2 px-2 text-left border border-black dark:border-gray-400">{v.perusahaan}</td>
                                    <td className="py-2 px-2 text-left border border-black dark:border-gray-400">{v.owner}</td>
                                    <td className="py-2 px-2 text-center border border-black dark:border-gray-400">{v.hp}</td>
                                    <td className="py-2 px-2 text-center border border-black dark:border-gray-400">{v.email}</td>
                                    <td className="py-2 px-2 text-center border border-black dark:border-gray-400">{v.alamat}</td>
                                    <td className="py-2 px-2 text-center border border-black dark:border-gray-400">{v.ip_printer}</td>
                                    <td className="py-2 px-1 text-center border border-black dark:border-gray-400">
                                        <div className='flex flex-row justify-center gap-1'>
                                        <Link
                                            title={`Edit ${v.nama_tenant}`}
                                            href={route('foodcourt.tenants.edit', v.id)}
                                            className="text-blue-500 hover:text-blue-700 cursor-pointer">
                                            <Edit size={16} />
                                        </Link>

                                        <button
                                            title={`Hapus ${v.nama_tenant}`}
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
