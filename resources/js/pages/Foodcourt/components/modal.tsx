// pages/components/errorModal.tsx
import React from 'react';

interface ModalProps {
    isModalOpen: boolean;
    message: string;
    closeModal: () => void;
    confirm?: () => void;
}

export const SuccessModal: React.FC<ModalProps> = ({ isModalOpen, message, closeModal }) => {
    if (!isModalOpen) return null;

    return (
        <div className="flex items-center justify-center bg-black/50 fixed inset-0 z-50">
            <div className="bg-white p-6 rounded shadow-md w-fit max-w-md">
                <h3 className="text-xl font-semibold mb-4 text-center text-green-600 animate-shake">
                    SUCCESS..
                </h3>
                <p className="mb-10 text-center">{message}</p>
                <div className="flex justify-center">
                    <button
                        type="button"
                        className="bg-green-600 hover:bg-green-800 text-white py-2 px-4 rounded cursor-pointer transition-colors duration-300"
                        onClick={closeModal}
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};


export const ErrorModal: React.FC<ModalProps> = ({ isModalOpen, message, closeModal }) => {
    if (!isModalOpen) return null;

    return (
        <div className="flex items-center justify-center bg-black/50 fixed inset-0 z-50">
            <div className="bg-white p-4 rounded shadow-md w-fit max-w-md">
                <h3 className="text-xl font-semibold mb-4 text-center text-red-600 animate-shake">
                    ERROR !
                </h3>
                <p className="mb-10 text-center">{message}</p>
                <div className="flex justify-center">
                    <button
                        type="button"
                        className="bg-red-600 hover:bg-red-800 text-white py-2 px-4 rounded cursor-pointer transition-colors duration-300"
                        onClick={closeModal}
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};

export const KonfirmasiModal: React.FC<ModalProps> = ({ isModalOpen, message, closeModal, confirm }) => {
    if (!isModalOpen) return null;

    return (
        <div className="flex items-center justify-center bg-black/50 fixed inset-0 z-50">
            <div className="bg-white p-6 rounded shadow-md w-fit max-w-md">
                <h3 className="text-xl font-semibold mb-4 text-center text-blue-600 animate-shake">
                    KONFIRMASI..
                </h3>
                <p className="mb-10 text-center">{message}</p>
                <div className="flex flex-row justify-around gap-4">
                    <button
                        type="button"
                        className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded cursor-pointer transition-colors duration-300"
                        onClick={closeModal}
                    >
                        Tutup
                    </button>

                    <button
                        type="button"
                        className="bg-blue-600 hover:bg-blue-800 text-white py-2 px-4 rounded cursor-pointer transition-colors duration-300"
                        onClick={confirm}
                    >
                        Konfirmasi
                    </button>
                </div>
            </div>
        </div>
    );
};
