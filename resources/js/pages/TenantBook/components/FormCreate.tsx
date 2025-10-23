/* eslint-disable @typescript-eslint/no-explicit-any */

// pages/TenantBook/components/create/FormCreate.tsx
import React, { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import TenantSelector from './TenantSelector';
import TenantBookDetails from './TenantBookDetails';
import TenantBookModal from './TenantBookModal';
import MainFormFields from './MainFormFields';
import { TenantBook, Tenant, TenantBookDetail } from '../models';

interface FormProps {
    model?: TenantBook;
    tenants: Tenant[];
}

const Form: React.FC<FormProps> = ({ model, tenants }) => {
    const [selectedFloor, setSelectedFloor] = useState(model?.tenant?.floor ?? '');
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState<TenantBookDetail | null>(null);
    const filteredTenants = tenants.filter((t) => t.floor === selectedFloor);

    const [submitInfoOpen, setSubmitInfoOpen] = useState(false);
    const [submitInfoMessage, setSubmitInfoMessage] = useState('');
    const [submitInfoType, setSubmitInfoType] = useState<'success' | 'error'>('success');
    const [processing, setProcessing] = useState(false);

    const defaultData = {
        tenant_id: model?.tenant_id ?? '',
        is_island: model?.is_island ?? 0,
        nama_toko: model?.nama_toko ?? '',
        perusahaan: model?.perusahaan ?? '',
        alamat: model?.alamat ?? '',
        npwp: model?.npwp ?? '',
        telp: model?.telp ?? '',
        email: model?.email ?? '',
        tgl_start: model?.tgl_start ?? '',
        tgl_end: model?.tgl_end ?? '',
        luas_indoor: model?.luas_indoor ?? 0,
        luas_outdoor: model?.luas_outdoor ?? 0,
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

    const { data, setData } = useForm<Record<string, any>>(defaultData);

    const isFormValid = (data.luas_indoor + data.luas_outdoor) >= 1;

    const isValidIsland = data.tenant_id > 9000 && data.nama_toko && data.perusahaan && data.tgl_start && data.lama_sewa >= 1 && data.deposit_sewa >= 0;

    const isValidNonIsland = data.tenant_id && data.nama_toko && data.perusahaan && data.tgl_start && data.lama_sewa >= 1 && data.deposit_sewa >= 0 && data.deposit_service >= 0 && data.deposit_telepon >= 0 && data.harga_service_indoor >= 0 && data.harga_service_outdoor >= 0 && data.promotion_levy_persen >= 0 && data.promotion_levy_per_bulan >= 0;

    const isDataValid = isFormValid && (isValidIsland || isValidNonIsland);

    const handleAddDetail = () => {
        setModalOpen(true);
        setSelectedDetail(null);
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
        const updatedDetails = [
            ...data.tenantBookDetails,
            {
                harga_sewa_indoor: detail.harga_sewa_indoor || 0,
                harga_sewa_outdoor: detail.harga_sewa_outdoor || 0,
                lama_sewa: detail.lama_sewa || 0,
            }
        ];

        setData('tenantBookDetails', updatedDetails);

        // Calculate totals based on the updated details
        setData('lama_sewa', updatedDetails.reduce((sum, detail) => sum + detail.lama_sewa, 0));
        setData('total_sewa_indoor', updatedDetails.reduce((sum, detail) => sum + (data.luas_indoor * detail.harga_sewa_indoor), 0));
        setData('total_sewa_outdoor', updatedDetails.reduce((sum, detail) => sum + (data.luas_outdoor * detail.harga_sewa_outdoor), 0));
        setData('total_sewa', updatedDetails.reduce((sum, detail) => sum + (data.luas_indoor * detail.harga_sewa_indoor) + (data.luas_outdoor * detail.harga_sewa_outdoor), 0));

        setModalOpen(false); // Close the modal after submitting
    };

    const closeSubmitInfo = () => {
        setSubmitInfoOpen(false);
        // router.reload();  // Reloading the page after modal closes
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        setProcessing(true);  // Set processing to true when form is submitting
        router.post('/tenant-books', data, {
            onSuccess: () => {
                setData(defaultData); // Reset form data after submission
                setSelectedFloor(''); // Reset selected floor
                setSelectedDetail(null); // Reset selected detail
                setSubmitInfoType('success');
                setSubmitInfoMessage(`Data kontrak sewa ${data.nama_toko} berhasil disimpan.`);
                setSubmitInfoOpen(true);
                setTimeout(() => closeSubmitInfo(), 10000);
            },
            onError: () => {
                setSubmitInfoType('error');
                setSubmitInfoMessage(`Gagal menyimpan data kontrak sewa ${data.nama_toko}.`);
                setSubmitInfoOpen(true);
            },
            onFinish: () => setProcessing(false),  // Reset processing state after request finishes
        });
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

    return (
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 px-1 justify-center text-sm" onKeyDown={preventKey}>
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
                    className={`w-full text-white font-semibold py-2 px-4 rounded ${!isDataValid ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-800 cursor-pointer'}`}
                    disabled={processing || !isDataValid}
                >
                    Simpan
                </button>
            </div>


            {/* Modal for Success/Failure Messages */}
            {submitInfoOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="text-center bg-white p-6 rounded shadow-md w-fit">
                        <h2 className={`text-xl font-semibold ${submitInfoType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                            {submitInfoType === 'success' ? 'Sukses' : 'Gagal'}
                        </h2>
                        <p className="mt-4">{submitInfoMessage}</p>

                        <div className="flex justify-center mt-4">
                            <button
                                className="bg-blue-600 hover:bg-blue-800 text-white py-2 px-4 rounded cursor-pointer"
                                onClick={closeSubmitInfo}
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
};

export default Form;
