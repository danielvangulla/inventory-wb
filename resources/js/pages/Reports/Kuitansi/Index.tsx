/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/Reports/Kuitansi/Index.tsx
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { LoadingSpinner } from '@/pages/components/loadingSpinner';
import { Button } from '@headlessui/react';
import Select from 'react-select';
import Details from './components/Details';
import { TenantBook } from '@/pages/TenantBook/models';
import { KuitansiList } from './models';

interface Props {
    periodeStart: string;
    periodeEnd: string;
    selectedTenantId: number;
    invoiceType: string[];
    selectedInvoiceType: string;
    tenantBooks: TenantBook[];
    dataDetail: KuitansiList[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'LAPORAN KUITANSI',
        href: '/report-kuitansi',
    },
];

const Index: React.FC<Props> = ({ periodeStart, periodeEnd, invoiceType, selectedInvoiceType, selectedTenantId, tenantBooks, dataDetail }) => {
    const [loading, setLoading] = useState<boolean>(false);

    const [start, setStart] = useState<string>(periodeStart);
    const [end, setEnd] = useState<string>(periodeEnd);

    const tenantOptions = tenantBooks.map((v: TenantBook) => ({
        value: v.id,
        label: `${v.nama_toko} - ${v.perusahaan}`
    }));

    const [selectedTenantOption, setSelectedTenantOption] = useState<any>(tenantOptions.find(option => option.value == selectedTenantId) || tenantOptions[0]);
    const handleOptionChange = (option: any) => {
        setSelectedTenantOption(option);
    }

    const typeOptions = invoiceType.map((type) => ({
        value: type,
        label: type
    }));

    const [selectedTypeOption, setSelectedTypeOption] = useState<any>(typeOptions.find(option => option.value == selectedInvoiceType) || typeOptions[0]);
    const handleTypeOptionChange = (option: any) => {
        setSelectedTypeOption(option);
    }

    const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStart(e.target.value);
    };

    const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEnd(e.target.value);
    };

    const showData = () => {
        setLoading(true);

        setTimeout(() => {
            router.get(`/report-kuitansi/${start}/${end}/${selectedTenantOption.value}/${selectedTypeOption.value}`);        }, 300);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Daftar Payment" />

            <img id="logo-image" src="/images/logo-header.png" alt="Logo" className='hidden' />

            <div className='flex flex-col justify-between items-center pb-2 mb-2 bg-gray-100 font-xs'>

                <div className='w-full flex flex-col xl:flex-row justify-center items-center gap-2 my-1 text-sm'>
                    <div className='flex flex-row justify-center items-center gap-2'>

                        <div>
                            <label className="italic mr-2 text-xs font-bold">Filter Tenant</label>
                            <Select
                                options={tenantOptions} // options for autocomplete
                                value={selectedTenantOption} // current selected tenant
                                onChange={handleOptionChange} // onChange handler
                                getOptionLabel={(e) => e.label} // specify what to display
                                getOptionValue={(e) => e.value} // specify value to track
                                placeholder="Cari Tenant"
                                className="react-select-container w-48 bg-white"
                                classNamePrefix="react-select"
                            />
                        </div>
                        <div>
                            <label className="italic mr-2 text-xs font-bold">Filter Jenis</label>
                            <Select
                                options={typeOptions} // options for autocomplete
                                value={selectedTypeOption} // current selected tenant
                                onChange={handleTypeOptionChange} // onChange handler
                                getOptionLabel={(e) => e.label} // specify what to display
                                getOptionValue={(e) => e.value} // specify value to track
                                placeholder="Cari Tipe"
                                className="react-select-container w-48 bg-white"
                                classNamePrefix="react-select"
                            />
                        </div>
                    </div>

                    <div className='flex flex-row justify-center items-center gap-2'>
                        <div className='flex flex-col'>
                            <label className="italic mr-2 text-xs font-bold">Tanggal Mulai</label>
                            <input
                                type="date"
                                value={start}
                                onChange={handleStartChange}
                                // max={today}
                                aria-label="Periode mulai"
                                className="px-4 py-2 rounded-sm shadow-xl border border-gray-300 bg-white"
                            />
                        </div>
                        <span className="font-normal italic"> s/d </span>
                        <div className='flex flex-col'>
                            <label className="italic mr-2 text-xs font-bold">Tanggal Akhir</label>
                            <input
                                type="date"
                                value={end}
                                onChange={handleEndChange}
                                // max={today}
                                aria-label="Periode akhir"
                                className="px-4 py-2 rounded-lg shadow-xl border border-gray-300 bg-white"
                            />
                        </div>

                        <Button onClick={showData}
                            className="px-4 py-2 mt-4 rounded-lg shadow-xl bg-blue-500 text-white hover:bg-blue-400 hover:cursor-pointer">
                            Filter Tanggal
                        </Button>
                    </div>
                </div>

            </div>

            <Details
                dataDetail={dataDetail}
                setLoading={setLoading}
            />

            {loading && <LoadingSpinner />}

        </AppLayout>
    );
};

export default Index;
