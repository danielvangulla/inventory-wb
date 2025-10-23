/* eslint-disable @typescript-eslint/no-explicit-any */

// pages/Payment/components/PaymentDP.tsx
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { formatUang } from '@/pages/components/helpers';
import { PaymentDp } from '../models';

interface PaymentDPProps {
    data: Record<string, any>;
    setData: (field: string, value: any) => void;
    handleAddDetail: () => void;
    handleDeleteDetail: (i: number) => void;
    hasSisa: boolean;
}

const PaymentDP: React.FC<PaymentDPProps> = ({
    data,
    handleAddDetail,
    handleDeleteDetail,
    hasSisa,
}) => {
    return (
        <div className="w-full mt-4 p-1 bg-blue-100 dark:bg-gray-900 rounded-lg shadow-md">
            <div className="flex flex-row justify-between items-center px-4 py-2">
                <button
                    type="button"
                    onClick={handleAddDetail}
                    className={`w-full text-white font-semibold py-2 px-4 rounded ${hasSisa ? 'bg-blue-500 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                    disabled={!hasSisa}
                >
                    Input Uang Muka Sewa
                </button>
            </div>

            {/* Display added details */}
            <div className="w-full mt-1 p-1" hidden={data?.payment_dp?.length === 0}>
                <h3 className="font-semibold text-lg pl-1">Detail Uang Muka:</h3>
                <div className="mt-2">
                    {/* create table for show data.tenantBookDetails */}
                    <table className="w-full border border-gray-300 dark:border-gray-600 text-sm">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-700">
                                <th className="border border-gray-300 dark:border-gray-600 p-2 text-center">#</th>
                                <th className="border border-gray-300 dark:border-gray-600 p-2 text-center">Tanggal Tagih</th>
                                <th className="border border-gray-300 dark:border-gray-600 p-2 text-center">Keterangan</th>
                                <th className="border border-gray-300 dark:border-gray-600 p-2 text-center">Jumlah</th>
                                <th className="border border-gray-300 dark:border-gray-600 p-2 text-center">Sisa Rp.</th>
                                <th className="border border-gray-300 dark:border-gray-600 p-2 text-center"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.payment_dp?.map((d: PaymentDp, index: number) => (
                                <tr key={index} className="border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="border border-gray-300 dark:border-gray-600 p-2 text-center">{index + 1}</td>
                                    <td className="border border-gray-300 dark:border-gray-600 p-2 text-center">{d.tgl}</td>
                                    <td className="border border-gray-300 dark:border-gray-600 p-2 text-left">{d.ket}</td>
                                    <td className="border border-gray-300 dark:border-gray-600 p-2 flex justify-center items-center">
                                        <div className='flex justify-end items-center'>
                                            {d.persen}% <ArrowRight className='px-1' /> {formatUang(d.jumlah)}
                                        </div>
                                    </td>
                                    <td className="border border-gray-300 dark:border-gray-600 p-2 text-center">{formatUang(d.sisa)}</td>
                                    <td className="border border-gray-300 dark:border-gray-600 p-2 text-center">
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteDetail(index)}
                                            className="bg-red-500 text-white font-bold px-2 rounded-xl hover:bg-red-700 cursor-pointer"
                                        >
                                            x
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PaymentDP;
