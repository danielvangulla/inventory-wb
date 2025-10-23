// pages/Invoices/listrik/action/inputModal.tsx
import React, { useEffect, useState } from 'react';
import { TenantBook } from '@/pages/TenantBook/models';
import { MeterListrik } from '../model';

interface ModalProps {
    tenant: TenantBook;
    handleSubmit: (meterListrik: MeterListrik) => void;
    closeModal: () => void;
}

const CreateModal: React.FC<ModalProps> = ({ tenant, handleSubmit, closeModal }) => {
    const [meterListrik, setMeterListrik] = useState<MeterListrik>({
        id: 0,
        tenant_book_id: tenant.id,
        tgl: new Date().toISOString().split('T')[0], // ISO format YYYY-MM-DD
        awal: tenant.meter_listrik_last ? tenant.meter_listrik_last.akhir : 0,
        akhir: 0,
        pemakaian: 0,
    });

    useEffect(() => {
        if (meterListrik.awal >= 0 && meterListrik.akhir >= 0) {
            const pemakaian = Math.round((meterListrik.akhir - meterListrik.awal) * 100) / 100;

            setMeterListrik((prev) => ({
                ...prev,
                pemakaian: pemakaian >= 0 ? pemakaian : 0,
            }));
        }
    }, [meterListrik.awal, meterListrik.akhir]);

    return (
        <div className="fixed flex items-center justify-center bg-black/70 inset-0 z-30 p-2">
            <div className="bg-white px-6 py-4 rounded shadow-md w-full md:w-1/2 lg:w-1/3">
                <h3 className="text-lg text-center mb-4 p-2 bg-blue-200 rounded-lg">
                    Pencatatan Meter Listrik <br /> <b>{tenant.nama_toko}</b>
                </h3>

                <div className="grid grid-cols-1 gap-4 mb-4">

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">
                            Tanggal Pencatatan
                        </label>
                        <input
                            type="date"
                            value={meterListrik.tgl}
                            onChange={(e) => setMeterListrik({ ...meterListrik, tgl: e.target.value })}
                            className="w-full rounded-md border border-gray-300 p-2"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">
                            Meter Awal
                        </label>
                        <input
                            type="number"
                            value={meterListrik.awal}
                            onChange={(e) => setMeterListrik({ ...meterListrik, awal: +e.target.value })}
                            className="w-full rounded-md border border-gray-300 p-2 text-center"
                            step="0.01"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">
                            Meter Akhir
                        </label>
                        <input
                            type="number"
                            value={meterListrik.akhir}
                            onChange={(e) => setMeterListrik({ ...meterListrik, akhir: +e.target.value })}
                            className="w-full rounded-md border border-gray-300 p-2 text-center"
                            step="0.01"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">
                            Pemakaian
                        </label>
                        <input
                            type="text"
                            value={meterListrik.pemakaian}
                            onChange={() => {}}
                            className="w-full rounded-md border border-gray-300 p-2 text-center bg-gray-200 cursor-not-allowed"
                            disabled = {true}
                        />
                    </div>

                    <div className="flex justify-end mt-4">
                        <button
                            type="button"
                            className="bg-blue-600 hover:bg-blue-800 text-white py-2 px-4 rounded mr-2 cursor-pointer"
                            onClick={() => handleSubmit(meterListrik)}
                        >
                            Simpan Data
                        </button>
                        <button
                            type="button"
                            className="bg-gray-300 hover:bg-gray-500 text-black py-2 px-4 rounded cursor-pointer"
                            onClick={() => closeModal()}
                        >
                            Batal
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default CreateModal;
