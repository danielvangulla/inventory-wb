/* eslint-disable @typescript-eslint/no-explicit-any */

// pages/TenantBook/components/PaymentDepositModal.tsx
import React from 'react';
import { formatDateForInput, formatValue } from '@/pages/components/helpers';
import { Deposit } from '../models';
import { TenantBook } from '@/pages/TenantBook/models';

interface PaymentDepositModalProps {
    data: Record<string, any>;
    isModalOpen: boolean;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedTenant: TenantBook;
    selectedDetail: any;
    setSelectedDetail: React.Dispatch<React.SetStateAction<any>>;
    handleDetailSubmit: (detail: any) => void;
}

const PaymentDepositModal: React.FC<PaymentDepositModalProps> = ({
    data,
    isModalOpen,
    setModalOpen,
    selectedTenant,
    selectedDetail,
    setSelectedDetail,
    handleDetailSubmit,
}) => {
    const totalDeposit = (selectedTenant?.deposit_sewa || 0) + (selectedTenant?.deposit_service || 0) + (selectedTenant?.deposit_telepon || 0);
    const terdeposit = +data.deposits?.reduce((sum: number, d: Deposit) => sum + d.jumlah, 0) || 0;
    const maxJumlah = totalDeposit - terdeposit;

    const handleChangeJumlah = (e: React.ChangeEvent<HTMLInputElement>) => {
        let jumlah = formatValue(e.target.value);

        if (jumlah > maxJumlah) {
            jumlah = maxJumlah;
        }

        if (jumlah < 0) {
            jumlah = 0;
        }

        setSelectedDetail({ ...selectedDetail, jumlah });
    };

    return (
        isModalOpen && (
            <div className="flex items-center justify-center bg-black/70 fixed inset-0 z-50 text-sm">
                <div className="bg-white p-6 rounded shadow-md w-full md:w-1/2">
                    <h3 className="text-lg font-semibold mb-4">Input Detail Deposit</h3>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-4">
                        <div className="flex flex-col">
                            <label className="block text-gray-700 mb-1 pl-1">Tanggal Penagihan</label>
                            <input
                                type="date"
                                value={selectedDetail?.tgl ? formatDateForInput(selectedDetail?.tgl) : ''}
                                onChange={(e) => setSelectedDetail({ ...selectedDetail, tgl: e.target.value })}
                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex flex-col">
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Keterangan</label>
                            <input
                                type="text"
                                value={selectedDetail?.ket ?? ''}
                                onChange={(e) => setSelectedDetail({ ...selectedDetail, ket: e.target.value })}
                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Jumlah Rp.</label>
                            <input
                                type="number"
                                placeholder="0.00"
                                value={selectedDetail?.jumlah ?? 0}
                                onChange={handleChangeJumlah}
                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end mt-4">
                        <button
                            type="button"
                            className="bg-blue-600 hover:bg-blue-800 text-white py-2 px-4 rounded mr-2 cursor-pointer"
                            onClick={() => handleDetailSubmit(selectedDetail ?? {})}
                        >
                            Simpan Detail
                        </button>
                        <button
                            type="button"
                            className="bg-gray-300 hover:bg-gray-500 text-black py-2 px-4 rounded cursor-pointer"
                            onClick={() => setModalOpen(false)}
                        >
                            Batal
                        </button>
                    </div>
                </div>
            </div>
        )
    );
};

export default PaymentDepositModal;
