/* eslint-disable @typescript-eslint/no-explicit-any */

// pages/TenantBook/components/PaymentDPModal.tsx
import { formatDateForInput } from '@/pages/components/helpers';
import React from 'react';

interface PaymentDPModalProps {
    data: Record<string, any>;
    isModalOpen: boolean;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedDetail: any;
    setSelectedDetail: React.Dispatch<React.SetStateAction<any>>;
    handleDetailSubmit: (detail: any) => void;
}

const PaymentDPModal: React.FC<PaymentDPModalProps> = ({
    data,
    isModalOpen,
    setModalOpen,
    selectedDetail,
    setSelectedDetail,
    handleDetailSubmit,
}) => {
    const setPersenDp = (e: { target: { value: string | number; }; }) => {
        const prevDetails = Array.isArray(data.payment_dp) ? data.payment_dp : [];
        const totalDp = +prevDetails.reduce((sum: number, d: { persen: number; }) => (+sum) + (+d.persen), 0);
        const sisa = data.persen_dp - totalDp;

        const persen = +e.target.value < 0 ? 0 : (+e.target.value > +sisa ? +sisa : +e.target.value);
        const jumlah = (data.total_sewa * persen / 100).toFixed(2);

        setSelectedDetail({ ...selectedDetail, persen, jumlah })
    }

    const setJumlahDp = (e: { target: { value: string | number; }; }) => {
        const prevDetails = Array.isArray(data.payment_dp) ? data.payment_dp : [];
        const totalDp = +prevDetails.reduce((sum: number, d: { jumlah: number; }) => (+sum) + (+d.jumlah), 0);
        const sisa = data.total_dp - totalDp;

        const jumlah = +e.target.value < 0 ? 0 : (+e.target.value > +sisa ? +sisa : +e.target.value);
        const persen = (jumlah / data.total_sewa * 100).toFixed(2);

        setSelectedDetail({ ...selectedDetail, jumlah, persen })
    }

    return (
        isModalOpen && (
            <div className="flex items-center justify-center bg-black/70 fixed inset-0 z-50 text-sm">
                <div className="bg-white p-6 rounded shadow-md w-full md:w-1/2">
                    <h3 className="text-lg font-semibold mb-4">Input Uang Muka</h3>

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

                    <div className="grid grid-cols-1 gap-4 mb-4">
                        <div className="flex flex-col basis-full md:basis-[48%]">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Keterangan</label>
                            <input
                                type="text"
                                value={selectedDetail?.ket ?? ''}
                                onChange={(e) => setSelectedDetail({ ...selectedDetail, ket: e.target.value })}
                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="flex flex-col basis-full md:basis-[48%]">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Uang Muka (%)</label>
                            <input
                                type="number"
                                placeholder="0.00"
                                value={selectedDetail?.persen ?? ''}
                                onChange={setPersenDp}
                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex flex-col basis-full md:basis-[48%]">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Uang Muka (Rupiah)</label>
                            <input
                                type="number"
                                placeholder="0.00"
                                value={selectedDetail?.jumlah ?? ''}
                                onChange={setJumlahDp}
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

export default PaymentDPModal;
