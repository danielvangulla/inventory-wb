/* eslint-disable @typescript-eslint/no-explicit-any */

// pages/TenantBook/components/create/FormCreate.tsx
import React, { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import TenantSelector from './TenantSelector';
import TenantBookDetails from './TenantBookDetails';
import TenantBookModal from './TenantBookModal';
import MainFormFields from './MainFormFields';
import { Tenant, TenantBook, TenantBookDetail } from './../models';

interface FormProps {
    model?: TenantBook;
    tenants: Tenant[];
    tenantBook: TenantBook;
}

const Form: React.FC<FormProps> = ({ model, tenants, tenantBook }) => {
    const [selectedFloor, setSelectedFloor] = useState(tenantBook?.tenant?.floor ?? '');

    const [isModalOpen, setModalOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');
    const [selectedDetail, setSelectedDetail] = useState<TenantBookDetail | null>(null);
    const filteredTenants = tenants.filter((t) => t.floor === selectedFloor);

    const [infoOpen, setInfoOpen] = useState(false);
    const [infoType, setInfoType] = useState<'success' | 'error'>('success');
    const [infoMessage, setInfoMessage] = useState('');
    const [processing, setProcessing] = useState(false);

    const defaultData = {
        tenant_id: model?.tenant_id ?? '',
        nama_toko: model?.nama_toko ?? '',
        perusahaan: model?.perusahaan ?? '',
        alamat: model?.alamat ?? '',
        npwp: model?.npwp ?? '',
        telp: model?.telp ?? '',
        email: model?.email ?? '',
        tgl_start: model?.tgl_start ?? '',
        tgl_end: model?.tgl_end ?? '',
        luas_indoor: model?.luas_indoor ?? '',
        luas_outdoor: model?.luas_outdoor ?? '',
        lama_sewa: model?.lama_sewa ?? 0,
        total_sewa_indoor: model?.total_sewa_indoor ?? 0,
        total_sewa_outdoor: model?.total_sewa_outdoor ?? 0,
        total_sewa: model?.total_sewa ?? 0,
        sewa_per_bulan: model?.sewa_per_bulan ?? 0,
        harga_service_indoor: model?.harga_service_indoor ?? 0,
        harga_service_outdoor: model?.harga_service_outdoor ?? 0,
        service_per_bulan: model?.service_per_bulan ?? 0,
        promotion_levy_start: model?.promotion_levy_start ?? '',
        promotion_levy_end: model?.promotion_levy_end ?? '',
        promotion_levy_persen: model?.promotion_levy_persen ?? 0,
        promotion_levy_per_bulan: model?.promotion_levy_per_bulan ?? 0,
        deposit_sewa: model?.deposit_sewa ?? 0,
        deposit_service: model?.deposit_service ?? 0,
        deposit_telepon: model?.deposit_telepon ?? 0,
        tenantBookDetails: model?.tenant_book_details ?? [],
    };

    // const tenantId = tenantBook?.tenant_id ?? model?.tenant_id ?? '';

    // const [isInitFloor, setIsInitFloor] = useState(true);

    // if (isInitFloor && tenantId) {
    //     let initFloor = tenantBook?.tenant?.floor ?? '';
    //     if (tenantId > 9000) {
    //         initFloor = (tenantId - 9000).toString();
    //         setSelectedFloor(initFloor);
    //         setIsInitFloor(false);
    //     }
    // }

    const dataOriginal = {
        ...defaultData,
        tenant_id: tenantBook.tenant_id,
        nama_toko: tenantBook.nama_toko,
        perusahaan: tenantBook.perusahaan,
        alamat: tenantBook.alamat,
        npwp: tenantBook.npwp,
        telp: tenantBook.telp,
        email: tenantBook.email,
        tgl_start: tenantBook.tgl_start,
        tgl_end: tenantBook.tgl_end,
        luas_indoor: tenantBook.luas_indoor,
        luas_outdoor: tenantBook.luas_outdoor,
        lama_sewa: tenantBook.lama_sewa,
        total_sewa_indoor: tenantBook.total_sewa_indoor,
        total_sewa_outdoor: tenantBook.total_sewa_outdoor,
        total_sewa: tenantBook.total_sewa,
        sewa_per_bulan: tenantBook.sewa_per_bulan,
        harga_service_indoor: tenantBook.harga_service_indoor,
        harga_service_outdoor: tenantBook.harga_service_outdoor,
        service_per_bulan: tenantBook.service_per_bulan,
        promotion_levy_start: tenantBook.promotion_levy_start || tenantBook.tgl_start,
        promotion_levy_end: tenantBook.promotion_levy_end || tenantBook.tgl_end,
        promotion_levy_persen: tenantBook.promotion_levy_persen,
        promotion_levy_per_bulan: tenantBook.promotion_levy_per_bulan,
        deposit_sewa: tenantBook.deposit_sewa,
        deposit_service: tenantBook.deposit_service,
        deposit_telepon: tenantBook.deposit_telepon,
        tenantBookDetails: tenantBook.tenant_book_details,
    }

    const { data, setData } = useForm<Record<string, any>>(dataOriginal);

    const isFormValid = (data.luas_indoor + data.luas_outdoor) >= 1;
    const isDataValid = isFormValid && data.tenant_id && data.nama_toko && data.perusahaan && data.tgl_start && data.lama_sewa >= 1 && data.deposit_sewa >= 0 && data.deposit_service >= 0 && data.deposit_telepon >= 0 && data.harga_service_indoor >= 0 && data.harga_service_outdoor >= 0 && data.promotion_levy_persen >= 0 && data.promotion_levy_per_bulan >= 0;

    const handleAddDetail = () => {
        setModalOpen(true);
        setSelectedDetail(null); // Reset the selected detail for a new one
    };

    const handleDeleteDetail = (index: number) => {
        const updatedDetails = [...data.tenantBookDetails];
        updatedDetails.splice(index, 1);
        setData('tenantBookDetails', updatedDetails);

        // Calculate totals based on the updated details
        setData('lama_sewa', updatedDetails.reduce((sum, detail) => sum + detail.lama_sewa, 0));
        setData('total_sewa_indoor', updatedDetails.reduce((sum, detail) => sum + (data.luas_indoor * detail.harga_sewa_indoor), 0));
        setData('total_sewa_outdoor', updatedDetails.reduce((sum, detail) => sum + (data.luas_outdoor * detail.harga_sewa_outdoor), 0));
        setData('total_sewa', updatedDetails.reduce((sum, detail) => sum + (data.luas_indoor * detail.harga_sewa_indoor) + (data.luas_outdoor * detail.harga_sewa_outdoor), 0));
    };

    const handleDetailSubmit = (detail: TenantBookDetail) => {
        const updatedDetails = [...data.tenantBookDetails, detail];
        setData('tenantBookDetails', updatedDetails);

        // Calculate totals based on the updated details
        setData('lama_sewa', updatedDetails.reduce((sum, detail) => sum + detail.lama_sewa, 0));
        setData('total_sewa_indoor', updatedDetails.reduce((sum, detail) => sum + (data.luas_indoor * detail.harga_sewa_indoor), 0));
        setData('total_sewa_outdoor', updatedDetails.reduce((sum, detail) => sum + (data.luas_outdoor * detail.harga_sewa_outdoor), 0));
        setData('total_sewa', updatedDetails.reduce((sum, detail) => sum + (data.luas_indoor * detail.harga_sewa_indoor) + (data.luas_outdoor * detail.harga_sewa_outdoor), 0));

        setModalOpen(false); // Close the modal after submitting
    };

    const preventKey = (e: React.KeyboardEvent) => {
        if (e.key === 'F5') {
            e.preventDefault();
        }

        if (e.key === 'Enter' || e.key === 'NumpadEnter') {
            e.preventDefault();

            if (isModalOpen && selectedDetail) {
                handleDetailSubmit(selectedDetail);
            } else {
                if (!isFormValid && !isDataValid) {
                    handleAddDetail();
                }
            }
        }

        if (e.key === 'Escape') {
            setModalOpen(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // console.log('Submitting form with data:', data);
        // return;

        setProcessing(true);  // Set processing to true when form is submitting

        router.put(`/tenant-books/${tenantBook.id}`, data, {
            onSuccess: () => {
                setInfoType('success');
                setInfoMessage(`Data kontrak sewa ${data.nama_toko} berhasil disimpan.`);
                setInfoOpen(true);
                setTimeout(() => setInfoOpen(false), 10000);
            },
            onError: () => {
                setInfoType('error');
                setInfoMessage(`Gagal menyimpan data kontrak sewa ${data.nama_toko}.`);
                setInfoOpen(true);
            },
            onFinish: () => setProcessing(false),  // Reset processing state after request finishes
        });

        setData(data); // Reset form data after submission
    };

    const closeSubmitInfoModal = () => {
        setInfoOpen(false);
    };

    const handleConfirmDelete = () => {
        setInfoType('error');
        setInfoMessage(`Dilarang membatalkan Kontrak..!!`);
        setInfoOpen(true);

        closeConfirmDeleteModal();

        // setProcessing(true);  // Set processing to true when form is submitting
        // router.delete(`/tenant-books/${tenantBook.id}`, {
        //     onSuccess: () => {
        //         setInfoType('success');
        //         setInfoMessage(`Kontrak sewa ${data.nama_toko} berhasil dibatalkan.`);
        //         setInfoOpen(true);
        //     },
        //     onError: () => {
        //         setInfoType('error');
        //         setInfoMessage(`Gagal membatalkan kontrak sewa ${data.nama_toko}.`);
        //         setInfoOpen(true);
        //     },
        //     onFinish: () => setProcessing(false),  // Reset processing state after request finishes
        // });
    };

    const closeConfirmDeleteModal = () => {
        setConfirmOpen(false);
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 px-1" onKeyDown={preventKey}>
                {/* TenantSelector contains Lantai, Tenant, Nama Toko, Perusahaan, Luas Indoor, and Luas Outdoor */}
                <TenantSelector
                    tenants={tenants}
                    selectedFloor={selectedFloor}
                    setSelectedFloor={setSelectedFloor}
                    setData={setData}
                    filteredTenants={filteredTenants}
                    data={data}
                />

                {/* TenantBookDetails for adding contract details */}
                <TenantBookDetails
                    data={data}
                    setData={setData}
                    handleAddDetail={handleAddDetail}
                    handleDeleteDetail={handleDeleteDetail}
                    disabled={!isFormValid} // Disable fields if form is not valid
                />

                {/* MainFormFields contains the other fields like dates, deposits, and service charges */}
                <MainFormFields
                    data={data}
                    setData={setData}
                    disabled={!isFormValid} // Disable fields if form is not valid
                />

                {/* TenantBookModal for adding/editing contract details */}
                <TenantBookModal
                    isModalOpen={isModalOpen}
                    setModalOpen={setModalOpen}
                    selectedDetail={selectedDetail}
                    setSelectedDetail={setSelectedDetail}
                    handleDetailSubmit={handleDetailSubmit}
                />

                <div className="basis-full my-4">
                    <button
                        type="submit"
                        className={`w-full text-white font-semibold py-2 px-4 rounded ${!isDataValid ? 'bg-green-400 cursor-not-allowed' : 'bg-green-700 hover:bg-green-500 dark:bg-green-700 dark:hover:bg-green-500 cursor-pointer'}`}
                        disabled={processing || !isFormValid}
                    >
                        Simpan
                    </button>

                    {tenantBook.id && (
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

export default Form;
