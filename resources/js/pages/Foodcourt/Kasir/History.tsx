/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { formatTgl } from "@/pages/components/functions";
import { transaksi } from "../models";
import { formatNumber } from "../functions";
import axios from "@/lib/axios";
import { PrinterCheck, RefreshCwIcon, Trash2 } from "lucide-react";

interface Props {
    transaksi: transaksi[];
}

const breadcrumbs = [
    {
        title: 'HISTORI TRANSAKSI',
        href: '/foodcourt/history',
    },
];

const History: React.FC<Props> = ({ transaksi }) => {
    const [currentData, setCurrentData] = React.useState<transaksi[]>(transaksi);

    const handleReprint = (transaksi_id: number) => {
        console.log("Reprint transaksi:", transaksi_id);

        axios.post(route('foodcourt.reprint.receipt'), { transaksi_id })
            .then(resp => {
                handlePrint(resp.data.data);
            })
            .catch(error => {
                console.error("Reprint error:", error);
                alert('Gagal mencetak ulang struk.');
            });
    };

    const handlePrint = (payload: any) => {
        axios.post(route('foodcourt.print.receipt'), payload)
            .then(res => {
                console.log('Reprint Receipt Success:', res.data);
            })
            .catch(err => {
                console.log('Reprint Error:', err.response?.data || err.message || "Unknown error");
            });
    };

    const handleVoid = (transaksi_id: number) => {
        if (!confirm('Apakah Anda yakin ingin Void transaksi ini?')) {
            return;
        }

        axios.delete(route('foodcourt.kasir.destroy', transaksi_id))
            .then(res => {
                const data = res.data;
                const userId = data.user_id;
                const userVoid = data.uservoid;
                const void_count = data.void_count;

                setCurrentData(prevData => prevData.map(t => t.id === transaksi_id ? {
                    ...t,
                    deleted_at: new Date().toISOString(),
                    user_void_id: userId,
                    uservoid: userVoid,
                    void_count,
                } : t));
            })
            .catch(error => {
                console.error("Void error:", error);
                alert('Gagal membatalkan transaksi.');
            });
    }

    const handleCancelVoid = (transaksi_id: number) => {
        if (!confirm('Apakah Anda yakin ingin Batalkan Void ini?')) {
            return;
        }

        axios.post(route('foodcourt.kasir.cancelvoid', transaksi_id))
            .then(res => {
                const data = res.data;
                const deleted_at = data.deleted_at;

                setCurrentData(prevData => prevData.map(t => t.id === transaksi_id ? {
                    ...t,
                    deleted_at,
                    user_void_id: 0,
                    uservoid: undefined,
                } : t));
            })
            .catch(error => {
                console.error("Void error:", error);
                alert('Gagal membatalkan transaksi.');
            });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={breadcrumbs[0].title} />

            <div className="px-4 py-4 w-full bg-blue-200 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Histori 50 Transaksi Terakhir</h2>

                <div className="overflow-x-auto max-h-[calc(100vh-200px)] w-full">
                    <table className="min-w-full bg-white border border-gray-300 text-xs">
                        <thead>
                            <tr>
                                <th className="py-4 bg-gray-300 border border-black text-center">#</th>
                                <th className="py-4 bg-gray-300 border border-black text-center">Tanggal</th>
                                <th className="py-4 bg-gray-300 border border-black text-center">Kasir</th>
                                <th className="py-4 bg-gray-300 border border-black text-center">Items</th>
                                {/* <th className="py-4 bg-gray-300 border border-black text-center">Brutto</th>
                                <th className="py-4 bg-gray-300 border border-black text-center">Disc</th> */}
                                <th className="py-4 bg-gray-300 border border-black text-center">Netto</th>
                                <th className="py-4 bg-gray-300 border border-black text-center">Tax/Serv</th>
                                <th className="py-4 bg-gray-300 border border-black text-center">Total</th>
                                <th className="py-4 bg-gray-300 border border-black text-center">Method / Channel</th>
                                <th className="py-4 bg-gray-300 border border-black text-center">Status</th>
                                <th className="py-4 bg-gray-300 border border-black text-center">Act.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center p-1">
                                        Tidak ada transaksi.
                                    </td>
                                </tr>
                            ) : (
                                currentData.map((t, i) => (
                                    <tr key={t.id} className="hover:bg-gray-100">
                                        <td className="p-1 border border-black text-center">{i + 1}.</td>
                                        <td className="p-1 border border-black text-center">{formatTgl(t.tgl)}</td>
                                        <td className="p-1 border border-black text-center">{t.user?.name || '-'}</td>
                                        <td className="p-1 border border-black text-left pl-2">
                                            {t.items && t.items.map((item, index) => (
                                                <div key={index}>
                                                    {item.qty} x {item.alias}
                                                </div>
                                            ))}
                                        </td>
                                        {/* <td className="p-1 border border-black text-right">{formatNumber(t.brutto, 0)}</td>
                                        <td className="p-1 border border-black text-right">{formatNumber(t.disc, 0)}</td> */}
                                        <td className="p-1 border border-black text-right">{formatNumber(t.netto, 0)}</td>
                                        <td className="p-1 border border-black text-right">{formatNumber(t.tax + t.service, 0)}</td>
                                        <td className="p-1 border border-black text-right font-bold">{formatNumber(t.total, 0)}</td>
                                        <td className="p-1 border border-black text-center">
                                            {t.jenis_bayar.toUpperCase()} / {t.channel_bayar}
                                            <br />{t.card_no || '-'}
                                        </td>
                                        <td className="p-1 border border-black text-center">
                                            {t.deleted_at ? (
                                                <span className="text-red-600 font-bold">VOID {t.void_count > 1 ? `x${t.void_count}` : ''}<br />
                                                <span className="text-gray-500">by {t.uservoid?.name || '-'}</span></span>
                                            ) : (
                                                <span className="text-green-600 font-bold">Lunas</span>
                                            )}
                                        </td>
                                        <td className="p-1 border border-black text-center">
                                            {!t.deleted_at && <div className="flex justify-center gap-1">
                                                <div
                                                    title="Reprint Struk"
                                                    className="flex justify-center text-white cursor-pointer p-1 bg-blue-500 hover:bg-blue-600 rounded"
                                                    onClick={() => handleReprint(t.id)}
                                                >
                                                    <PrinterCheck className="inline-block text-white" size={16} />
                                                </div>

                                                <div
                                                    title="Void Struk"
                                                    className="flex justify-center text-white cursor-pointer p-1 bg-red-500 hover:bg-red-600 rounded"
                                                    onClick={() => handleVoid(t.id)}
                                                >
                                                    <Trash2 className="inline-block text-white" size={16} />
                                                </div>
                                            </div>}

                                            {t.deleted_at != null && (
                                                <div className="flex justify-center gap-1">
                                                    <div
                                                        title="Batalkan Void"
                                                        className="flex justify-center text-white cursor-pointer p-1 bg-green-500 hover:bg-green-600 rounded"
                                                        onClick={() => handleCancelVoid(t.id)}
                                                    >
                                                        <RefreshCwIcon className="inline-block text-white" size={16} />
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
};

export default History;
