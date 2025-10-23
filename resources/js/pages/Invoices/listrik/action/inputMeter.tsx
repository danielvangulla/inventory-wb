// pages/Invoices/listrik/action/inputModal.tsx
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@headlessui/react';
import { LoadingSpinner } from '@/pages/components/loadingSpinner';
import { SuccessModal, ErrorModal } from '@/pages/Foodcourt/components/modal';
import { TenantBook } from '@/pages/TenantBook/models';
import { monthYear, validateDecimal } from '@/pages/components/functions';
import { Filter, PlusCircle } from 'lucide-react';
import CreateModal from './inputModal';
import { MeterListrik } from '../model';

interface Props {
    username: string;
    tenantBooks: TenantBook[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'PENCATATAN METER LISTRIK',
        href: '/meter-listrik',
    },
];

const Index: React.FC<Props> = ({ username, tenantBooks }) => {
    const canEdit = username === 'Admin' || username === 'Sylvia';

    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [tenantName, setTenantName] = useState<string>('');
    const [grouping, setGrouping] = useState<string>('');

    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);

    const [successMessage, setSuccessMessage] = useState<string>('');
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);

    const [selectedTenant, setSelectedTenant] = useState<TenantBook>();

    const handleModalOpen = (tenant: TenantBook) => {
        if (loading) return;
        setLoading(true);

        setSelectedTenant(tenant);

        setTimeout(async () => {
            try {
                setModalOpen(true);
            } catch (error) {
                console.error('Error :', error);
            } finally {
                setLoading(false);
            }
        }, 1);

    };

    const handleSubmit = (meterListrik: MeterListrik) => {
        if (loading) return;
        setModalOpen(false);
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');
        setIsErrorModalOpen(false);
        setIsSuccessModalOpen(false);

        const data = {
            tenant_book_id: selectedTenant?.id,
            tgl: meterListrik.tgl,
            awal: meterListrik.awal,
            akhir: meterListrik.akhir,
            pemakaian: meterListrik.pemakaian,
        }

        router.post('/meter-listrik', data, {
            onSuccess: (page) => {
                setSuccessMessage(
                    typeof page.props.success === 'string'
                        ? page.props.success
                        : JSON.stringify(page.props.success)
                );
                setIsSuccessModalOpen(true);
            },
            onError: (error) => {
                const arrayError = [];
                if (error && typeof error === 'object') {
                    for (const key in error) {
                        if (Object.prototype.hasOwnProperty.call(error, key)) {
                            arrayError.push(`${error[key]}`);
                        }
                    }
                }

                if (arrayError.length > 0) {
                    setErrorMessage(arrayError.join(', '));
                } else {
                    setErrorMessage('Gagal menyimpan data..');
                }

                setIsErrorModalOpen(true);
            },
            onFinish: () => {
                setLoading(false);
                setTimeout(() => {
                    router.reload();
                }, 100);
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Meter Listrik" />

            <div className="my-2 px-2 py-2 max-w-lg md:max-w-xl lg:max-w-3xl xl:max-w-5xl 2xl:max-w-full mx-auto bg-blue-100 dark:bg-gray-900 shadow-md rounded-lg">

                <div className="mb-4 mx-2 grid grid-cols-1 md:grid-cols-5 gap-2">
                    <div className="flex flex-col">
                        <label htmlFor="startDate" className="text-sm font-medium text-gray-700">Start Date</label>
                        <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full rounded-md border border-gray-300 p-2"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="endDate" className="text-sm font-medium text-gray-700">End Date</label>
                        <input
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full rounded-md border border-gray-300 p-2"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="tenantName" className="text-sm font-medium text-gray-700">Tenant Name</label>
                        <input
                            type="text"
                            id="tenantName"
                            value={tenantName}
                            onChange={(e) => setTenantName(e.target.value)}
                            placeholder="Search Tenant"
                            className="w-full rounded-md border border-gray-300 p-2"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="grouping" className="text-sm font-medium text-gray-700">Grouping</label>
                        <input
                            type="text"
                            id="grouping"
                            value={grouping}
                            onChange={(e) => setGrouping(e.target.value)}
                            placeholder="Search Group"
                            className="w-full rounded-md border border-gray-300 p-2"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="grouping" className="text-sm font-medium text-gray-700">&nbsp;</label>
                        <Button
                            className="btn-sm bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md cursor-pointer"
                            onClick={() => console.log('Filter applied')}
                        >
                            <div className="flex items-center justify-center mr-2">
                                <Filter className="w-5 h-5 mr-2" />
                                Filter
                            </div>
                        </Button>
                    </div>

                </div>

                {/* Display filtered data */}
                <div className="mt-2 bg-gray-200 dark:bg-gray-800 p-2 rounded-md text-sm">
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full ">
                            <thead>
                                <tr>
                                    <th className="p-2 border border-black dark:border-gray-400 text-center" rowSpan={2}>#</th>
                                    <th className="p-2 border border-black dark:border-gray-400 text-center" rowSpan={2}>Act</th>
                                    <th className="p-2 border border-black dark:border-gray-400 text-center" rowSpan={2}>NAMA TOKO / <br /> PERUSAHAAN</th>
                                    <th className="p-2 border border-black dark:border-gray-400 text-center" colSpan={2}>BULAN TERAKHIR</th>
                                    <th className="p-2 border border-black dark:border-gray-400 text-center" colSpan={2}>BULAN INI</th>
                                    <th className="p-2 border border-black dark:border-gray-400 text-center" rowSpan={2}>PEMAKAIAN</th>
                                </tr>
                                <tr>
                                    <th className="p-2 border border-black dark:border-gray-400 text-center">Periode</th>
                                    <th className="p-2 border border-black dark:border-gray-400 text-center">Volume</th>
                                    <th className="p-2 border border-black dark:border-gray-400 text-center">Periode</th>
                                    <th className="p-2 border border-black dark:border-gray-400 text-center">Volume</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tenantBooks?.map((tenant, i) => (
                                    <tr key={tenant.id} className="hover:bg-blue-300 dark:hover:bg-blue-500 transition-colors duration-100">
                                        <td className="px-2 py-0.5 border border-black dark:border-gray-400 text-center">{i + 1}</td>
                                        <td className="px-2 py-0.5 border border-black dark:border-gray-400 text-center">
                                            <Button
                                                title='Input Meter Air'
                                                onClick={() => handleModalOpen(tenant)}
                                                className={`btn-xs text-white py-1 px-2 rounded-md ${canEdit ? 'bg-green-600 hover:bg-green-700 cursor-pointer ' : 'bg-gray-400 cursor-not-allowed'}`}
                                                disabled={!canEdit}
                                            >
                                                <PlusCircle className="w-4 h-4" />
                                            </Button>
                                        </td>
                                        <td className="px-2 py-0.5 border border-black dark:border-gray-400 text-left whitespace-nowrap">
                                            <b>{tenant.nama_toko}</b> <br /> <span className='text-xs'>{tenant.perusahaan}</span>
                                        </td>
                                        <td className="px-2 py-0.5 border border-black dark:border-gray-400 text-center">
                                            {tenant.meter_listrik_last ? monthYear(new Date(tenant.meter_listrik_last.tgl)) : '-'}
                                        </td>
                                        <td className="px-2 py-0.5 border border-black dark:border-gray-400 text-center">
                                            {tenant.meter_listrik_last ? `${validateDecimal(tenant.meter_listrik_last.akhir)} m³` : '-'}
                                        </td>
                                        <td className="px-2 py-0.5 border border-black dark:border-gray-400 text-center">
                                            {tenant?.meter_listrik_now ? monthYear(new Date(tenant.meter_listrik_now.tgl)) : '-'}
                                        </td>
                                        <td className="px-2 py-0.5 border border-black dark:border-gray-400 text-center">
                                            {tenant.meter_listrik_now ? `${validateDecimal(tenant.meter_listrik_now.akhir)} m³` : '-'}
                                        </td>
                                        <td className="px-2 py-0.5 border border-black dark:border-gray-400 text-center">
                                            {tenant.meter_listrik_now && tenant.meter_listrik_last
                                                ? `${validateDecimal(tenant.meter_listrik_now.akhir - tenant.meter_listrik_last.akhir)} m³`
                                                : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {!loading && isModalOpen && selectedTenant && (
                <CreateModal
                    tenant={selectedTenant}
                    handleSubmit={handleSubmit}
                    closeModal={() => setModalOpen(false)}
                />
            )}

            {loading && <LoadingSpinner />}

            {isErrorModalOpen && <ErrorModal
                isModalOpen={isErrorModalOpen}
                message={errorMessage}
                closeModal={() => setIsErrorModalOpen(false)}
            />}

            {isSuccessModalOpen && <SuccessModal
                isModalOpen={isSuccessModalOpen}
                message={successMessage}
                closeModal={() => setIsSuccessModalOpen(false)}
            />}

        </AppLayout>
    );
};

export default Index;
