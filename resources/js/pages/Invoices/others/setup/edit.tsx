// pages/Invoices/sewa/createModal.tsx
import React, { useState } from 'react';
import { ErrorModal } from '@/pages/Foodcourt/components/modal';
import { InvoiceOtherType } from '../model';

interface TenantBookModalProps {
    tipe: InvoiceOtherType;
    setModalOpen: (open: boolean) => void;
    handleSubmit: (sewaInvoice: InvoiceOtherType) => void;
}

const EditTipe: React.FC<TenantBookModalProps> = ({
    tipe,
    setModalOpen,
    handleSubmit,
}) => {
    const [invoiceType, setSewaInvoice] = useState<InvoiceOtherType>({
        id: tipe.id,
        tipe: tipe.tipe,
        ket: tipe.ket,
    });

    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);

    const handlePresubmit = () => {
        if (!invoiceType.tipe) {
            setErrorMessage('Silakan isi tipe invoice.');
            setIsErrorModalOpen(true);
            return;
        }

        if (!invoiceType.ket) {
            setErrorMessage('Silakan isi keterangan.');
            setIsErrorModalOpen(true);
            return;
        }

        handleSubmit(invoiceType);
    };

    const closeErrorModal = () => {
        setIsErrorModalOpen(false);
        setErrorMessage('');
    };

    return (
        <div className="flex justify-center bg-black/70 fixed inset-0 z-30 p-2">
            <div className="h-fit w-72 md:w-96 bg-white px-6 py-4 mt-[10%] rounded shadow-md text-sm">
                <h3 className="text-lg text-center font-semibold mb-4 p-1 bg-blue-200 rounded-lg">
                    Create Tipe Invoice
                </h3>

                <hr className="mb-4" />

                <div className="grid grid-cols-1 gap-4 mb-4">

                    <div className="flex flex-col bg-blue-50 p-1 rounded-lg">
                        <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                            Tipe
                        </label>
                        <input
                            type="text"
                            value={invoiceType.tipe}
                            onChange={(e) => setSewaInvoice({ ...invoiceType, tipe: e.target.value })}
                            className="w-full rounded-md border bg-white border-gray-300 p-2"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 mb-4">
                    <div className="flex flex-col bg-blue-50 p-1 rounded-lg">
                        <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                            Keterangan
                        </label>
                        <input
                            type="text"
                            value={invoiceType.ket}
                            onChange={(e) => setSewaInvoice({ ...invoiceType, ket: e.target.value })}
                            className="w-full rounded-md border bg-white border-gray-300 p-2"
                        />
                    </div>

                </div>

                <div className="flex justify-end my-4">
                    <button
                        type="button"
                        className="bg-blue-600 hover:bg-blue-800 text-white py-2 px-4 rounded mr-2 cursor-pointer"
                        onClick={() => handlePresubmit()}
                    >
                        Update
                    </button>
                    <button
                        type="button"
                        className="bg-gray-300 hover:bg-gray-500 text-black py-2 px-4 rounded cursor-pointer"
                        onClick={() => setModalOpen(false)}
                    >
                        Batal
                    </button>
                </div>

                {/* Error Modal */}
                <ErrorModal
                    isModalOpen={isErrorModalOpen}
                    message={errorMessage}
                    closeModal={closeErrorModal}
                />

            </div>

        </div >
    );
};

export default EditTipe;
