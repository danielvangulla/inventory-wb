/* eslint-disable @typescript-eslint/no-explicit-any */

// pages/TenantBook/components/create/TenantBookDetails.tsx
import React from 'react';
import { formatUang } from '@/pages/components/helpers';

interface TenantBookDetailsProps {
    data: Record<string, any>;
    setData: (field: string, value: any) => void;
    handleAddDetail: () => void;
    handleDeleteDetail: (i: number) => void;
    disabled: boolean;
}

const TenantBookDetails: React.FC<TenantBookDetailsProps> = ({
    data,
    handleAddDetail,
    handleDeleteDetail,
    disabled,
}) => {
    return (
        <div className="w-full mt-4">
            <button
                type="button"
                onClick={handleAddDetail}
                className={`w-full text-white font-semibold py-2 px-4 rounded ${disabled ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-500 cursor-pointer'}`}
                disabled={disabled}
            >
                Tambah Detail Kontrak
            </button>

            {/* Display added details */}
            <div className="w-full mt-4" hidden={data.tenantBookDetails.length === 0}>
                <h3 className="font-semibold text-lg">Detail Kontrak:</h3>
                <div className="mt-2">
                    {/* create table for show data.tenantBookDetails */}
                    <table className="w-full border border-gray-300 dark:border-gray-600 text-sm">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-700">
                                <th className="border border-gray-300 dark:border-gray-600 p-2 text-center">#</th>
                                <th className="border border-gray-300 dark:border-gray-600 p-2 text-center">Lama Sewa</th>
                                <th className="border border-gray-300 dark:border-gray-600 p-2 text-center">Harga Indoor</th>
                                <th className="border border-gray-300 dark:border-gray-600 p-2 text-center">Harga Outdoor</th>
                                <th className="border border-gray-300 dark:border-gray-600 p-2 text-center">Total Indoor</th>
                                <th className="border border-gray-300 dark:border-gray-600 p-2 text-center">Total Outdoor</th>
                                <th className="border border-gray-300 dark:border-gray-600 p-2 text-center">Total Sewa</th>
                                <th className="border border-gray-300 dark:border-gray-600 p-2 text-center"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.tenantBookDetails.map((d: any, index: number) => (
                                <tr key={index} className="border-b border-gray-300 dark:border-gray-600">
                                    <td className="border border-gray-300 dark:border-gray-600 p-2 text-center">{index + 1}</td>
                                    <td className="border border-gray-300 dark:border-gray-600 p-2 text-center">{d.lama_sewa} bln</td>
                                    <td className="border border-gray-300 dark:border-gray-600 p-2 text-right">{formatUang(d.harga_sewa_indoor)}</td>
                                    <td className="border border-gray-300 dark:border-gray-600 p-2 text-right">{formatUang(d.harga_sewa_outdoor)}</td>
                                    <td className="border border-gray-300 dark:border-gray-600 p-2 text-right">{formatUang(data.luas_indoor * d.lama_sewa * d.harga_sewa_indoor)}</td>
                                    <td className="border border-gray-300 dark:border-gray-600 p-2 text-right">{formatUang(data.luas_outdoor * d.lama_sewa * d.harga_sewa_outdoor)}</td>
                                    <td className="border border-gray-300 dark:border-gray-600 p-2 text-right">{formatUang((data.luas_indoor * d.lama_sewa * d.harga_sewa_indoor) + (data.luas_outdoor * d.lama_sewa * d.harga_sewa_outdoor))}</td>
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

export default TenantBookDetails;
