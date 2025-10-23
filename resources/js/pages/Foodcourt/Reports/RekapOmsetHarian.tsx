/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import Select from "react-select";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, router } from "@inertiajs/react";
import { tenant } from "../models";
import { formatNumber } from "../functions";
import { LoadingSpinner } from "@/pages/components/loadingSpinner";
import { formatDate } from "@/pages/components/helpers";

interface revenue {
    id: number;
    tgl: string;
    transaksi: number;
    revenue: number;
    tax: number;
    netto: number;
    shares_persen: number;
    shares_nominal: number;
    tenant_nominal: number;
};

interface Props {
    tgl1: string;
    tgl2: string;
    tenant_id: number;
    tenants: tenant[];
    items: revenue[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Rekap Omset Tenant',
        href: '/foodcourt/rekap-omset-harian',
    },
];

const RekapOmsetHarian: React.FC<Props> = ({ tgl1, tgl2, tenant_id, tenants, items }) => {
    const [loading, setLoading] = useState(false);

    const [tglStart, setTglStart] = useState<string>(tgl1);
    const [tglEnd, setTglEnd] = useState<string>(tgl2);

    const tenantOptions = tenants.map((v: tenant) => ({
        label: `${v.nama_tenant}`,
        value: v.id,
    }));

    const [selectedTenantOption, setSelectedTenantOption] = useState<any>(
        tenantOptions.find(option => option.value == tenant_id) || tenantOptions[0]
    );

    const handleOptionChange = (option: any) => {
        setSelectedTenantOption(option);
    }

    const handleFilterTgl = () => {
        setLoading(true);

        setTimeout(() => {
            router.visit(`/foodcourt/rekap-omset-harian/${tglStart}/${tglEnd}/${selectedTenantOption?.value || 0}`);
            setLoading(false);
        }, 500);
    };

    const [data,] = useState<revenue[]>(items.map((item, index) => ({
        id: index + 1,
        tgl: item.tgl,
        transaksi: item.transaksi,
        revenue: item.revenue,
        tax: item.tax,
        netto: item.netto,
        shares_persen: item.shares_persen,
        shares_nominal: item.shares_nominal,
        tenant_nominal: item.netto - item.shares_nominal,
    })));

    const totals = data.reduce((acc, item) => {
        acc.transaksi += item.transaksi;
        acc.revenue += item.revenue;
        acc.tax += item.tax;
        acc.netto += item.netto;
        acc.shared += item.shares_nominal;
        return acc;
    }, {
        transaksi: 0,
        revenue: 0,
        tax: 0,
        netto: 0,
        shared: 0,
        avg_shares_persen: data.length > 0 ? data.reduce((sum, item) => sum + item.shares_persen, 0) / data.length : 0,
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={breadcrumbs[0].title} />

            <div className="p-4 bg-white shadow rounded">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-2 mb-4 text-sm px-2">
                    <h2 className="text-xl font-semibold">Rekap Omset Harian</h2>

                    <div className="w-64">
                        <div className="flex flex-col bg-blue-200 p-1 rounded-lg">
                            <Select
                                options={tenantOptions} // options for autocomplete
                                value={selectedTenantOption} // current selected tenant
                                onChange={handleOptionChange} // onChange handler
                                getOptionLabel={(e) => e.label} // specify what to display
                                getOptionValue={(e) => e.value} // specify value to track
                                placeholder="Filter Tenant"
                                className="react-select-container"
                                classNamePrefix="react-select"
                            />
                        </div>
                    </div>

                    {/* filter tanggal from dan to, default today, dan tombol dengan icon filter dari package lucide-react */}
                    <div className="flex space-x-2">
                        {/* select tenant */}

                        <input type="date" className="border rounded p-2" value={tglStart} onChange={(e) => setTglStart(e.target.value)} />
                        <input type="date" className="border rounded p-2" value={tglEnd} onChange={(e) => setTglEnd(e.target.value)} />

                        <button
                            onClick={handleFilterTgl}
                            className="px-4 py-2 bg-blue-400 rounded hover:bg-blue-600 cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h8M8 12h8m-4 6h4" />
                            </svg>
                            Filter
                        </button>
                    </div>

                </div>

                <div className="overflow-x-auto text-sm">
                    <table className="w-full border-collapse">
                        <thead>
                            {data.length > 0 && <tr>
                                <th className={`text-center font-bold bg-gray-300 border border-gray-400 py-2`}>#</th>
                                <th className={`text-center font-bold bg-gray-300 border border-gray-400 py-2`}>Tanggal</th>
                                <th className={`text-center font-bold bg-gray-300 border border-gray-400 py-2`}>Transaksi</th>
                                <th className={`text-center font-bold bg-gray-300 border border-gray-400 py-2`}>Total Omset</th>
                                <th className={`text-center font-bold bg-gray-300 border border-gray-400 py-2`}>Tax</th>
                                <th className={`text-center font-bold bg-gray-300 border border-gray-400 py-2`}>Netto</th>
                                <th className={`text-center font-bold bg-gray-300 border border-gray-400 py-2`}>Shares</th>
                                <th className={`text-center font-bold bg-gray-300 border border-gray-400 py-2`}>Omset Tenant</th>
                            </tr>}
                        </thead>
                        <tbody>
                            {data.length > 0 ? (
                                data.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-100">
                                        <td className="text-center border border-gray-400 p-2">{item.id}</td>
                                        <td className="text-center border border-gray-400 p-2">{formatDate(item.tgl)}</td>
                                        <td className="text-center border border-gray-400 p-2">{formatNumber(item.transaksi, 0)}</td>
                                        <td className="text-right border border-gray-400 p-2">{formatNumber(item.revenue, 0)}</td>
                                        <td className="text-right border border-gray-400 p-2">{formatNumber(item.tax, 0)}</td>
                                        <td className="text-right border border-gray-400 p-2 font-bold">{formatNumber(item.netto, 0)}</td>
                                        <td className="text-right border border-gray-400 p-2">
                                            {formatNumber(item.shares_persen, 2)}% {`->`} <span className="font-bold text-blue-500">{formatNumber(item.shares_nominal, 0)}</span>
                                        </td>
                                        <td className="text-right border border-gray-400 p-2 font-bold">{formatNumber(item.tenant_nominal, 0)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="text-center border border-gray-400 py-4 text-xl">Data tidak tersedia..</td>
                                </tr>
                            )}

                            {data.length > 0 && (
                                <tr className="font-bold bg-gray-200">
                                    <td className="text-center border border-gray-400 p-2" colSpan={2}>Total</td>
                                    <td className="text-center border border-gray-400 p-2">{formatNumber(totals.transaksi, 0)}</td>
                                    <td className="text-right border border-gray-400 p-2">{formatNumber(totals.revenue, 0)}</td>
                                    <td className="text-right border border-gray-400 p-2">{formatNumber(totals.tax, 0)}</td>
                                    <td className="text-right border border-gray-400 p-2">{formatNumber(totals.netto, 0)}</td>
                                    <td className="text-right border border-gray-400 p-2">
                                        {totals.avg_shares_persen.toFixed(2)}% {`->`} <span className="font-bold text-blue-500">{formatNumber(totals.shared, 0)}</span>
                                    </td>
                                    <td className="text-right border border-gray-400 p-2">{formatNumber(totals.netto - totals.shared, 0)}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {loading && <LoadingSpinner />}
        </AppLayout>
    );
}

export default RekapOmsetHarian;
