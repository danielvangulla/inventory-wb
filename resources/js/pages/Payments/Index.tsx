// pages/Payments/Index.tsx
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Search, PrinterCheck } from 'lucide-react';
import { useState } from 'react';
import { dateAddMonthsAddDays, formatDateStringMonth, formatUang } from '../components/helpers';
import { TenantBook } from '../TenantBook/models';
import { Button } from '@headlessui/react';
import SimulasiModal from './components/SimulasiModal';
import { LoadingSpinner } from '../components/loadingSpinner';

interface Props {
    tenantBooks: TenantBook[];
    perusahaan: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'DAFTAR SIMULASI PAYMENT',
        href: '/tenant-payments',
    },
];

const Index: React.FC<Props> = ({ tenantBooks, perusahaan }) => {
    // State for search query
    const [searchQuery, setSearchQuery] = useState('');

    // Filter tenantBooks based on search query
    const filteredTenantBooks = tenantBooks.filter((v) => {
        const namaToko = (v.nama_toko ?? '').toLowerCase();
        const perusahaan = (v.perusahaan ?? '').toLowerCase();

        return (
            namaToko.includes(searchQuery.toLowerCase()) ||
            perusahaan.includes(searchQuery.toLowerCase())
        );
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedData, setSelectedData] = useState<TenantBook | null>(null);

    const openModal = (v: TenantBook) => {
        setSelectedData(v);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedData(null);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Daftar Payment" />

            <img id="logo-image" src="/images/logo-header.png" alt="Logo" className='hidden' />

            <div className="px-4 py-2 max-w-lg md:max-w-xl lg:max-w-3xl xl:max-w-5xl 2xl:max-w-full mx-auto">
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

                <div className="overflow-x-auto h-full text-sm">
                    {/* Adjust the width calculation to take the sidebar width into account */}
                    <table className="bg-white dark:bg-gray-800 shadow-md rounded-md min-w-full">
                        <thead>
                            <tr className="bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400" >No.</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400" >Aksi</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400" >Tenant / Perusahaan</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400" >Lantai / Unit</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400" >Total Sewa / <br />Lama Sewa</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400" >Uang Muka</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400" >Total Cicilan</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400" >Lama Cicilan / Angsuran</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400" >Tanggal Awal</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400" >Tanggal Akhir</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400" >Grace Period</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTenantBooks.map((v, index) => (
                                <tr key={v.id} className='hover:bg-blue-300 dark:hover:bg-gray-600'>
                                    <td className="py-2 px-1 text-center border border-black dark:border-gray-400 whitespace-nowrap">
                                        {index + 1}
                                    </td>
                                    <td className="py-2 px-2 text-center border border-black dark:border-gray-400 hover:bg-white whitespace-nowrap">
                                        <div className='flex flex-row items-center justify-center gap-1'>
                                            <Button title='Preview / Print' onClick={() => openModal(v)}>
                                                <PrinterCheck size={20} className="text-blue-600 hover:underline hover:text-gray-800 dark:text-blue-500 dark:hover:text-blue-400 cursor-pointer" />
                                            </Button>
                                        </div>
                                    </td>
                                    <td className="py-2 px-2 text-left border border-black dark:border-gray-400 whitespace-nowrap">
                                        <b>{v.nama_toko}</b> <br />
                                        {v.perusahaan}
                                    </td>
                                    <td className="py-2 px-2 text-center border border-black dark:border-gray-400 whitespace-nowrap">
                                        Lantai <b>{v.tenant?.floor}</b> <br />
                                        Unit <b>{v.tenant?.no}</b> <br />
                                    </td>
                                    <td className="py-2 px-2 text-right border border-black dark:border-gray-400 whitespace-nowrap">
                                        {formatUang((v.total_sewa ?? 0))} <br />
                                        <i className='text-xs'>(<b>{v.lama_sewa}</b> bln)</i>
                                    </td>
                                    <td className="py-2 px-2 text-right border border-black dark:border-gray-400 whitespace-nowrap">
                                        <b>{formatUang((v.payments?.total_dp ?? 0))}</b> <br />
                                        <i className='text-xs'>(<b>{v.payments?.persen_dp}</b> %)</i>
                                    </td>
                                    <td className="py-2 px-2 text-right border border-black dark:border-gray-400 whitespace-nowrap">
                                        <b>{formatUang((v.payments?.total_cicilan ?? 0))}</b> <br />
                                        <i className='text-xs'>(<b>{v.payments?.persen_cicilan}</b> %)</i>
                                    </td>
                                    <td className="py-2 px-2 text-center border border-black dark:border-gray-400 whitespace-nowrap">
                                        <b>{formatUang((v.payments?.lama_cicilan ?? 0))}</b> bulan <br />
                                        <i className='text-xs'>
                                            (<b>{formatUang((v.payments?.total_cicilan ? v.payments?.total_cicilan / v.payments?.lama_cicilan : 0))}</b>
                                            / bln)</i>
                                    </td>
                                    <td className="py-2 px-2 text-center border border-black dark:border-gray-400">
                                        {formatDateStringMonth(v.payments?.tgl_opening)}
                                    </td>
                                    <td className="py-2 px-2 text-center border border-black dark:border-gray-400">
                                        {/* tgl_opening ditambah v.lama_sewa (bulan), dikurangi 1 hari */}
                                        {v.payments?.tgl_opening
                                            ? formatDateStringMonth(
                                                dateAddMonthsAddDays(new Date(v.payments?.tgl_opening), v.lama_sewa ?? 0, -1).toISOString()
                                            ) : '-'}
                                    </td>

                                    <td className="py-2 px-2 text-center border border-black dark:border-gray-400">
                                        {v.payments?.grace_period} bulan
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Modal for Simulasi */}
                <SimulasiModal
                    modalOpen={isModalOpen}
                    selectedData={selectedData}
                    perusahaan={perusahaan}
                    setLoading={setLoading}
                    closeModal={closeModal}
                />

                {loading && <LoadingSpinner />}

            </div>
        </AppLayout>
    );
};

export default Index;
