/* eslint-disable @typescript-eslint/no-explicit-any */

// pages/NonTenantBook/components/FormEdit.tsx
import React, { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import Selector from './Selector';
import { Tenant, NonTenantBook } from './../models';

interface FormEditProps {
    model?: NonTenantBook;
    tenants: Tenant[];
    nontenantBook: NonTenantBook;
}

const FormEdit: React.FC<FormEditProps> = ({ model, tenants, nontenantBook }) => {
    const [selectedFloor, setSelectedFloor] = useState(nontenantBook.tenant?.floor ?? '');
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');
    const filteredTenants = tenants.filter((t) => t.floor === selectedFloor);

    const [infoOpen, setInfoOpen] = useState(false);
    const [infoType, setInfoType] = useState<'success' | 'error'>('success');
    const [infoMessage, setInfoMessage] = useState('');
    const [processing, setProcessing] = useState(false);

    const defaultData = {
        tenant_id: model?.tenant_id ?? 0,
        nama_toko: model?.nama_toko ?? '',
        perusahaan: model?.perusahaan ?? '',
        alamat: model?.alamat ?? '',
        npwp: model?.npwp ?? '',
        telp: model?.telp ?? '',
        email: model?.email ?? '',
    };

    const dataOriginal = {
        ...defaultData,
        tenant_id: nontenantBook.tenant_id,
        nama_toko: nontenantBook.nama_toko,
        perusahaan: nontenantBook.perusahaan,
        alamat: nontenantBook.alamat,
        npwp: nontenantBook.npwp,
        telp: nontenantBook.telp,
        email: nontenantBook.email,
    }

    const { data, setData } = useForm<Record<string, any>>(dataOriginal);

    const isFormValid = data.nama_toko && data.perusahaan

    const preventKey = (e: React.KeyboardEvent) => {
        if (e.key === 'F5') {
            e.preventDefault();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);  // Set processing to true when form is submitting

        router.patch(`/nontenant-books/${nontenantBook.id}`, data, {
            onSuccess: (success) => {
                const msg = success.props.msg;
                setInfoType('success');
                setInfoMessage(`${msg}`);
            },
            onError: (error) => {
                const errorMessages = Object.entries(error).map(([, value]) => `${value}`).join(', ');

                setInfoType('error');
                setInfoMessage(`${errorMessages}`);
            },
            onFinish: () => setInfoOpen(true),
        });
    };

    const closeSubmitInfoModal = () => {
        setTimeout(() => router.visit(`/nontenant-books/${nontenantBook.id}/edit`), 100);
        setInfoOpen(false);
    };

    const handleConfirmDelete = () => {
        setInfoType('error');
        setInfoMessage(`Dilarang membatalkan Kontrak..!!`);
        setInfoOpen(true);

        closeConfirmDeleteModal();
    };

    const closeConfirmDeleteModal = () => {
        setConfirmOpen(false);
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 px-1" onKeyDown={preventKey}>
                <Selector
                    tenants={tenants}
                    selectedFloor={selectedFloor}
                    setSelectedFloor={setSelectedFloor}
                    setData={setData}
                    filteredTenants={filteredTenants}
                    data={data}
                />

                <div className="basis-full my-4">
                    <button
                        type="submit"
                        className={`w-full text-white font-semibold py-2 px-4 rounded ${!isFormValid ? 'bg-green-400 cursor-not-allowed' : 'bg-green-700 hover:bg-green-500 dark:bg-green-700 dark:hover:bg-green-500 cursor-pointer'}`}
                        disabled={processing || !isFormValid}
                    >
                        Simpan
                    </button>

                    {nontenantBook.id && (
                        <button
                            type="button"
                            className="w-full text-white font-semibold mt-8 py-2 px-4 rounded bg-red-700 hover:bg-red-500 dark:bg-red-700 dark:hover:bg-red-500 cursor-pointer"
                            onClick={() => {
                                setConfirmMessage('Apakah Anda yakin ingin membatalkan kontrak ini?');
                                setConfirmOpen(true);

                            }}
                        >
                            Batalkan Kontrak
                        </button>
                    )}

                </div>
            </form>


            {/* Modal for Confirmation Messages */}
            {confirmOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="text-center bg-white p-6 rounded shadow-md w-fit">
                        <h2 className={`text-xl font-semibold text-red-600`}>
                            Pembatalan Kontrak
                        </h2>
                        <p className="mt-4">{confirmMessage}</p>

                        <div className="flex justify-center mt-4 gap-16">
                            <button
                                className="bg-gray-600 hover:bg-gray-800 text-white py-2 px-4 rounded cursor-pointer"
                                onClick={closeConfirmDeleteModal}
                            >
                                Tidak
                            </button>

                            <button
                                className="bg-red-600 hover:bg-red-800 text-white py-2 px-4 rounded cursor-pointer"
                                onClick={handleConfirmDelete}
                            >
                                Yakin
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Modal for Success/Failure Messages */}
            {infoOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="text-center bg-white p-6 rounded shadow-md w-fit">
                        <h2 className={`text-xl font-semibold ${infoType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                            {infoType === 'success' ? 'Sukses' : 'Gagal'}
                        </h2>
                        <p className="mt-4">{infoMessage}</p>

                        <div className="flex justify-center mt-4">
                            <button
                                className="bg-blue-600 hover:bg-blue-800 text-white py-2 px-4 rounded cursor-pointer"
                                onClick={closeSubmitInfoModal}
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
};

export default FormEdit;
