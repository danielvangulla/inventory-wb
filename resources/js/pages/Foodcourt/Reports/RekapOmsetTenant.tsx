import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, router } from "@inertiajs/react";
import React, { useState } from "react";
import { formatNumber } from "../functions";
import { LoadingSpinner } from "@/pages/components/loadingSpinner";

interface revenue {
    id: number;
    tenant: string;
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
    items: revenue[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Rekap Omset Tenant',
        href: '/foodcourt/rekap-omset-tenant',
    },
];

const RekapOmsetTenant: React.FC<Props> = ({ tgl1, tgl2, items }) => {

    const [loading, setLoading] = useState(false);

    const [tglStart, setTglStart] = useState<string>(tgl1);
    const [tglEnd, setTglEnd] = useState<string>(tgl2);

    const handleFilterTgl = () => {
        setLoading(true);

        setTimeout(() => {
            router.visit(`/foodcourt/rekap-omset-tenant/${tglStart}/${tglEnd}`);
            setLoading(false);
        }, 500);
    };

    const [data,] = useState<revenue[]>(items.map((item, index) => ({
        id: index + 1,
        tenant: item.tenant,
        transaksi: item.transaksi || 0,
        revenue: item.revenue || 0,
        tax: item.tax || 0,
        netto: item.netto || 0,
        shares_persen: item.shares_persen || 0,
        shares_nominal: item.shares_nominal || 0,
        tenant_nominal: item.tenant_nominal || 0,
    })));

    const totals = data.reduce(
        (acc, cur) => {
            acc.transaksi += cur.transaksi;
            acc.revenue += cur.revenue;
            acc.shared += cur.shares_nominal;
            acc.total += cur.revenue - cur.shares_nominal;
            acc.avg_shares_persen = acc.shared > 0 ? (acc.shared / acc.revenue) * 100 : 0;
            return acc;
        },
        { transaksi: 0, revenue: 0, shared: 0, total: 0, avg_shares_persen: 0 }
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={breadcrumbs[0].title} />

            <div className="p-4 bg-white shadow rounded">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-2 mb-4 text-sm px-2">
                    <h2 className="text-xl font-semibold">Rekap Omset Tenant</h2>

                    {/* filter tanggal from dan to, default today, dan tombol dengan icon filter dari package lucide-react */}
                    <div className="flex space-x-2">
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
                                <th className={`text-center font-bold bg-gray-300 border border-gray-400 py-2`}>Nama Tenant</th>
                                <th className={`text-center font-bold bg-gray-300 border border-gray-400 py-2`}>Bills</th>
                                <th className={`text-center font-bold bg-gray-300 border border-gray-400 py-2`}>Total Omset</th>
                                <th className={`text-center font-bold bg-gray-300 border border-gray-400 py-2`}>Tax</th>
                                <th className={`text-center font-bold bg-gray-300 border border-gray-400 py-2`}>Netto</th>
                                <th className={`text-center font-bold bg-gray-300 border border-gray-400 py-2`}>Shares</th>
                                <th className={`text-center font-bold bg-gray-300 border border-gray-400 py-2`}>Omset Tenant</th>
                            </tr>}
                        </thead>
                        <tbody>
                            {data.length > 0 ? (
                                data.map((record, index) => (
                                    <tr key={record.id} className={`hover:bg-blue-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-100"}`}>
                                        <td className={`text-center border border-gray-400 p-2`}>{index + 1}.</td>
                                        <td className={`text-left border border-gray-400 p-2`}>{record.tenant}</td>
                                        <td className={`text-center border border-gray-400 p-2`}>{formatNumber(record.transaksi, 0)}</td>
                                        <td className={`text-right border border-gray-400 p-2`}>{formatNumber(record.revenue, 0)}</td>
                                        <td className={`text-right border border-gray-400 p-2`}>{formatNumber(record.tax, 0)}</td>
                                        <td className={`text-right border border-gray-400 p-2`}>{formatNumber(record.netto, 0)}</td>
                                        <td className={`text-right border border-gray-400 p-2 whitespace-nowrap`}>
                                            {(record.shares_persen).toFixed(0)}% {` -> `} <span className="font-bold text-blue-600">{formatNumber(record.shares_nominal, 0)}</span>
                                        </td>
                                        <td className={`text-right border border-gray-400 p-2`}>
                                            <span className="font-bold">{formatNumber(record.tenant_nominal, 0)}</span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="text-center border border-gray-400 py-4 text-xl">Data tidak tersedia..</td>
                                </tr>
                            )}


                            {data.length > 0 && (
                                <tr className="font-bold bg-gray-300">
                                    <td className={`text-center border border-gray-400 p-2`} colSpan={2}>TOTAL</td>
                                    <td className={`text-center border border-gray-400 p-2`}>{formatNumber(totals.transaksi, 0)}</td>
                                    <td className={`text-right border border-gray-400 p-2`}>{formatNumber(totals.revenue, 0)}</td>
                                    <td className={`text-right border border-gray-400 p-2`}>{formatNumber(data.reduce((sum, record) => sum + record.tax, 0), 0)}</td>
                                    <td className={`text-right border border-gray-400 p-2`}>{formatNumber(data.reduce((sum, record) => sum + record.netto, 0), 0)}</td>
                                    <td className={`text-right border border-gray-400 p-2 whitespace-nowrap`}>
                                        {(totals.avg_shares_persen).toFixed(2)}% {` -> `} <span className="font-bold text-blue-600">{formatNumber(totals.shared, 0)}</span>
                                    </td>
                                    <td className={`text-right border border-gray-400 p-2`}>{formatNumber(totals.total, 0)}</td>
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

export default RekapOmsetTenant;
