/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/Reports/Pendapatan/Index.tsx
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { pendapatanDetail, pendapatanSum } from './models';
import { LoadingSpinner } from '@/pages/components/loadingSpinner';
import Details from './components/Details';
import Summary from './components/Summary';
import { Button } from '@headlessui/react';
import { TenantBook } from '@/pages/TenantBook/models';
import Select from 'react-select';

interface Props {
    periodeStart: string;
    periodeEnd: string;
    selectedTenantId: number;
    selectedInvoiceType: string;
    currentIsSummary: number;
    dataDetail: pendapatanDetail[];
    tenantBooks: TenantBook[];
    invoiceType: string[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'LAPORAN PENDAPATAN',
        href: '/report-pendapatan',
    },
];

const Index: React.FC<Props> = ({ periodeStart, periodeEnd, selectedTenantId, selectedInvoiceType, currentIsSummary, dataDetail, tenantBooks, invoiceType }) => {
    const tenantOptions = tenantBooks.map((v: TenantBook) => ({
        value: v.id,
        label: `${v.nama_toko} - ${v.perusahaan}`
    }));

    const [selectedTenantOption, setSelectedTenantOption] = useState<any>(tenantOptions.find(option => option.value == selectedTenantId) || tenantOptions[0]);
    const handleOptionChange = (option: any) => {
        setSelectedTenantOption(option);
    }

    const filteredDetailTenant = selectedTenantOption.value === 0
        ? dataDetail : dataDetail.filter(item => item.tenant_book_id === selectedTenantOption.value);

    const typeOptions = invoiceType.map((type) => ({
        value: type,
        label: type
    }));

    const [selectedTypeOption, setSelectedTypeOption] = useState<any>(typeOptions.find(option => option.value == selectedInvoiceType) || typeOptions[0]);
    const handleTypeOptionChange = (option: any) => {
        setSelectedTypeOption(option);
    }

    const filteredDetailType = selectedTypeOption.value.toLowerCase() === 'semua'
        ? filteredDetailTenant : filteredDetailTenant.filter(item => item.jenis.toLowerCase() === selectedTypeOption.value.toLowerCase());

    const filteredDataSum: pendapatanSum[] = []; // Default to all data

    // update filteredDataSum sesuai dengan filteredDetailTenant (ignore filteredDetailType)
    filteredDetailTenant.forEach(item => {
        const existing = filteredDataSum.find(sum => sum.ket.toLowerCase() === item.jenis.toLowerCase());
        if (existing) {
            existing.jumlah += +item.jumlah;
            existing.ppn += +item.ppn;
            existing.materai += +item.materai;
            existing.total += +item.total;
            existing.pot_pph += +item.pot_pph;
            existing.bayar += +item.bayar;
        } else {
            filteredDataSum.push({
                ket: item.jenis,
                jumlah: +item.jumlah,
                ppn: +item.ppn,
                materai: +item.materai,
                total: +item.total,
                pot_pph: +item.pot_pph,
                bayar: +item.bayar
            });
        }
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [isSummary, setIsSummary] = useState<number>(currentIsSummary);

    const [start, setStart] = useState<string>(periodeStart);
    const [end, setEnd] = useState<string>(periodeEnd);

    const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStart(e.target.value);
    };

    const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEnd(e.target.value);
    };

    const showData = () => {
        setLoading(true);

        setTimeout(() => {
            router.get(`/report-pendapatan/${start}/${end}/${selectedTenantOption.value}/${selectedTypeOption.value}/${isSummary}`,);
        }, 300);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Daftar Payment" />

            <img id="logo-image" src="/images/logo-header.png" alt="Logo" className='hidden' />

            <div className='flex flex-col justify-between items-center pb-2 mb-2 bg-gray-100 font-xs'>

                <div className='w-full flex flex-row justify-center py-2'>
                    <Button onClick={() => setIsSummary(1)}
                        disabled={isSummary == 1}
                        className={`w-48 px-2 py-1 rounded-l-lg border border-gray-400 shadow-xl ${isSummary == 1 ? 'bg-blue-500 text-white hover:cursor-not-allowed' : 'bg-white text-gray-800 hover:cursor-pointer hover:bg-blue-400 hover:text-white'}`}>
                        Summary
                    </Button>

                    <Button onClick={() => setIsSummary(0)}
                        disabled={isSummary == 0}
                        className={`w-48 px-2 py-1 rounded-r-lg border border-gray-400 shadow-xl ${isSummary == 0 ? 'bg-blue-500 text-white hover:cursor-not-allowed' : 'bg-white text-gray-800 hover:cursor-pointer hover:bg-blue-400 hover:text-white'}`}>
                        Details
                    </Button>
                </div>

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

                        {isSummary == 0 && <div>
                            <label className="italic mr-2 text-xs font-bold">Filter Jenis</label><Select
                                options={typeOptions} // options for autocomplete
                                value={selectedTypeOption} // current selected tenant
                                onChange={handleTypeOptionChange} // onChange handler
                                getOptionLabel={(e) => e.label} // specify what to display
                                getOptionValue={(e) => e.value} // specify value to track
                                placeholder="Cari Tipe"
                                className="react-select-container w-48 bg-white"
                                classNamePrefix="react-select"
                            /> </div>}
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
                                className="w-36 px-4 py-2 rounded-sm shadow-xl border border-gray-300 bg-white"
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
                                className="w-36 px-4 py-2 rounded-lg shadow-xl border border-gray-300 bg-white"
                            />
                        </div>

                        <Button onClick={showData}
                            className="px-4 py-2 mt-4 rounded-lg shadow-xl bg-blue-500 text-white hover:bg-blue-400 hover:cursor-pointer">
                            Filter Tanggal
                        </Button>
                    </div>
                </div>

            </div>

            {isSummary == 1 && <Summary
                dataSummary={filteredDataSum}
            />}

            {isSummary == 0 && <Details
                dataDetail={filteredDetailType}
                setLoading={setLoading}
            />}

            {loading && <LoadingSpinner />}

        </AppLayout>
    );
};

export default Index;
