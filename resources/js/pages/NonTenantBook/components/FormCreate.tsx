/* eslint-disable @typescript-eslint/no-explicit-any */

// pages/NonTenantBook/components/FormCreate.tsx
import React, { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { NonTenantBook, Tenant } from '../models';
import Selector from './Selector';

interface FormCreateProps {
    model?: NonTenantBook;
    tenants: Tenant[];
}

const FormCreate: React.FC<FormCreateProps> = ({ model, tenants }) => {
    const [selectedFloor, setSelectedFloor] = useState(model?.tenant?.floor ?? '');
    const filteredTenants = tenants.filter((t) => t.floor === selectedFloor);

    const [submitInfoOpen, setSubmitInfoOpen] = useState(false);
    const [submitInfoMessage, setSubmitInfoMessage] = useState('');
    const [submitInfoType, setSubmitInfoType] = useState<'success' | 'error'>('success');
    const [processing, setProcessing] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const defaultData = {
        tenant_id: model?.tenant_id ?? 0,
        nama_toko: model?.nama_toko ?? '',
        perusahaan: model?.perusahaan ?? '',
        alamat: model?.alamat ?? '',
        npwp: model?.npwp ?? '',
        telp: model?.telp ?? '',
        email: model?.email ?? '',
    };

    const { data, setData } = useForm<Record<string, any>>(defaultData);

    const isFormValid = data.nama_toko && data.perusahaan;

    const closeSubmitInfo = () => {
        setSubmitInfoOpen(false);

        if (saveSuccess) router.visit('/nontenant-books/create');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // onSubmit(data);

        setProcessing(true);  // Set processing to true when form is submitting
        router.post('/nontenant-books', data, {
            onSuccess: (success) => {
                const msg = success.props.msg;

                setData(defaultData); // Reset form data after submission
                setSelectedFloor(''); // Reset selected floor
                setSubmitInfoType('success');
                setSubmitInfoMessage(`${msg}`);
                setSubmitInfoOpen(true);
                setSaveSuccess(true);
                setTimeout(() => { closeSubmitInfo(); }, 10000);
            },
            onError: (error) => {
                console.error('Error saving data:', error);
                // example error message from server:
                // { "no_telp": "The no telp field is required.", "alamat": "The alamat field is required." }
                // make the values of the error object to be string
                const errorMessages = Object.entries(error).map(([, value]) => `${value}`).join(', ');

                setSubmitInfoType('error');
                setSubmitInfoMessage(`${errorMessages}`);
                setSubmitInfoOpen(true);
            },
            onFinish: () => {
                setProcessing(false);
            },
        });
    };

    const preventKey = (e: React.KeyboardEvent) => {
        if (e.key === 'F5') {
            e.preventDefault();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full flex flex-col justify-center px-1 max-w-sm sm:max-w-lg md:max-w-xl lg:max-w-2xl" onKeyDown={preventKey}>
            <Selector
                tenants={tenants}
                selectedFloor={selectedFloor}
                setSelectedFloor={setSelectedFloor}
                setData={setData}
                filteredTenants={filteredTenants}
                data={data}
            />

            <div className="my-4">
                <button
                    type="submit"
                    className={`w-full text-white font-semibold py-2 px-4 rounded ${!isFormValid ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-700  cursor-pointer'}`}
                    disabled={processing || !isFormValid}
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

export default FormCreate;
