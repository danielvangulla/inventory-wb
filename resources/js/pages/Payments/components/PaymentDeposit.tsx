/* eslint-disable @typescript-eslint/no-explicit-any */

// pages/Payment/components/PaymentDeposit.tsx
import React from 'react';
import { formatUang } from '@/pages/components/helpers';
import { TenantBook } from '@/pages/TenantBook/models';
import { Deposit } from '../models';

interface PaymentDepositProps {
    data: Record<string, any>;
    selectedTenant: TenantBook;
    setData: (field: string, value: any) => void;
    handleAddDetail: () => void;
    handleDeleteDetail: (i: number) => void;
    hasSisaDeposit: boolean;
}

const PaymentDeposit: React.FC<PaymentDepositProps> = ({
    data,
    selectedTenant,
    handleAddDetail,
    handleDeleteDetail,
    hasSisaDeposit,
}) => {
    const totalDeposit = (selectedTenant.deposit_sewa || 0) + (selectedTenant.deposit_service || 0) + (selectedTenant.deposit_telepon || 0);
    const canAddDetail = hasSisaDeposit || totalDeposit === 0;

    return (
        <div className="w-full mt-4 p-1 bg-blue-100 dark:bg-gray-900 rounded-lg shadow-md">
            <div className="flex flex-row justify-between items-center px-4 py-2">
                <button
                    type="button"
                    onClick={handleAddDetail}
                    className={` text-white font-semibold py-2 px-4 rounded ${canAddDetail ? 'bg-blue-500 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                    disabled={!canAddDetail}
                >
                    Input Detail Deposit Sewa
                </button>


                <h3 className="font-semibold text-lg text-right">Total Deposit: Rp. {formatUang(totalDeposit)}</h3>
            </div>

            {/* Display added details */}
            <div className="w-full mt-1 p-1" hidden={data?.deposits?.length === 0}>
                <div className="mt-1">
                    {/* create table for show data.tenantBookDetails */}
                    <table className="w-full border border-gray-300 dark:border-gray-600 text-sm">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-700">
                                <th className="border border-gray-300 dark:border-gray-600 p-2 text-center">#</th>
                                <th className="border border-gray-300 dark:border-gray-600 p-2 text-center">Tanggal</th>
                                <th className="border border-gray-300 dark:border-gray-600 p-2 text-center">Keterangan</th>
                                <th className="border border-gray-300 dark:border-gray-600 p-2 text-center">Jumlah</th>
                                <th className="border border-gray-300 dark:border-gray-600 p-2 text-center">Sisa Rp.</th>
                                <th className="border border-gray-300 dark:border-gray-600 p-2 text-center"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.deposits?.map((d: Deposit, index: number) => (
                                <tr key={index} className="border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="border border-gray-300 dark:border-gray-600 p-2 text-center">{index + 1}</td>
                                    <td className="border border-gray-300 dark:border-gray-600 p-2 text-center">{d.tgl}</td>
                                    <td className="border border-gray-300 dark:border-gray-600 p-2 text-left">{d.ket}</td>
                                    <td className="border border-gray-300 dark:border-gray-600 p-2 text-center">{formatUang(d.jumlah)}</td>
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

export default PaymentDeposit;
