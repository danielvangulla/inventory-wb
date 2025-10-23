/* eslint-disable @typescript-eslint/no-explicit-any */

// pages/TenantBook/components/create/TenantBookModal.tsx
import React from 'react';

interface TenantBookModalProps {
    isModalOpen: boolean;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedDetail: any;
    setSelectedDetail: React.Dispatch<React.SetStateAction<any>>;
    handleDetailSubmit: (detail: any) => void;
}

const TenantBookModal: React.FC<TenantBookModalProps> = ({
    isModalOpen,
    setModalOpen,
    selectedDetail,
    setSelectedDetail,
    handleDetailSubmit,
}) => {
    return (
        isModalOpen && (
            <div className="flex items-center justify-center bg-black/70 fixed inset-0 z-50">
                <div className="bg-white p-6 rounded shadow-md w-full md:w-1/2">
                    <h3 className="text-lg font-semibold mb-4">Tambah Detail Kontrak</h3>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="flex flex-col basis-full md:basis-[48%]">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Harga Sewa Indoor (Rp)</label>
                            <input
                                type="number"
                                placeholder="Harga Indoor"
                                value={selectedDetail?.harga_sewa_indoor ?? ''}
                                onChange={(e) => setSelectedDetail({ ...selectedDetail, harga_sewa_indoor: e.target.value === "" ? 0 : +e.target.value })}
                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex flex-col basis-full md:basis-[48%]">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Harga Sewa Outdoor (Rp)</label>
                            <input
                                type="number"
                                placeholder="Harga Outdoor"
                                value={selectedDetail?.harga_sewa_outdoor ?? ''}
                                onChange={(e) => setSelectedDetail({ ...selectedDetail, harga_sewa_outdoor: e.target.value === "" ? 0 : +e.target.value })}
                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex flex-col basis-full md:basis-[48%]">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Lama Sewa (bulan)</label>
                            <input
                                type="number"
                                placeholder="Lama Sewa"
                                value={selectedDetail?.lama_sewa ?? ''}
                                onChange={(e) => setSelectedDetail({ ...selectedDetail, lama_sewa: e.target.value === "" ? "" : +e.target.value })}
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

export default TenantBookModal;
