import AppLayout from "@/layouts/app-layout";
import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import { BreadcrumbItem } from "@/types";
import { Button } from '@headlessui/react';
import { Edit, PlusCircle } from "lucide-react";

import { InvoiceOtherType } from "../model";
import Create from "./create";
import { LoadingSpinner } from "@/pages/components/loadingSpinner";
import { ErrorModal, SuccessModal } from "@/pages/Foodcourt/components/modal";
import EditTipe from "./edit";

interface Props {
    data: InvoiceOtherType[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'INVOICES - Others - Setup',
        href: '/invoices-others-setup',
    },
];

const Index: React.FC<Props> = ({ data }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [isEditOpen, setEditOpen] = useState<boolean>(false);

    const handleModalOpen = () => {
        if (loading) return;
        setModalOpen(true);
    };

    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);

    const [successMessage, setSuccessMessage] = useState<string>('');
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);

    const handleSubmit = (data: InvoiceOtherType) => {
        setLoading(true);
        setModalOpen(false);
        setEditOpen(false);

        router.post('/invoices-others-setup', { ...data }, {
            onSuccess: (page) => {
                setSuccessMessage(
                    typeof page.props.success === 'string'
                        ? page.props.success
                        : JSON.stringify(page.props.success)
                );
                setIsSuccessModalOpen(true);
            },
            onError: (error) => {
                const arrayError = [];
                if (error && typeof error === 'object') {
                    for (const key in error) {
                        if (Object.prototype.hasOwnProperty.call(error, key)) {
                            arrayError.push(`${error[key]}`);
                        }
                    }
                }

                if (arrayError.length > 0) {
                    setErrorMessage(arrayError.join(', '));
                } else {
                    setErrorMessage('Gagal menyimpan data..');
                }

                setIsErrorModalOpen(true);
            },
            onFinish: () => {
                setLoading(false);
                setTimeout(() => {
                    router.reload();
                }, 1000);
            }
        });
    };

    const [tipe, setTipe] = useState<InvoiceOtherType>({
        id: 0,
        tipe: '',
        ket: '',
    });

    const handleEditOpen = (v: InvoiceOtherType) => {
        if (loading) return;

        setTipe(v);
        setEditOpen(true);
    };

    const closeModalSuccess = () => {
        setIsSuccessModalOpen(false);
        setTimeout(() => {
            router.visit('/invoices-others-setup');
        }, 100);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="INVOICES - UANG MUKA & CICILAN SEWA" />
            <div className="min-w-sm w-fit my-2 px-2 py-2 max-w-lg md:max-w-xl lg:max-w-3xl xl:max-w-5xl 2xl:max-w-full mx-auto bg-blue-100 dark:bg-gray-900 shadow-md rounded-lg text-sm">


                <div>
                    <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white my-2 m-2 p-2 rounded-md cursor-pointer"
                        onClick={handleModalOpen}
                    >
                        <div className='flex items-center gap-2'>
                            <PlusCircle />
                            Tambah Tipe
                        </div>
                    </Button>
                </div>


                <div className="mt-2 bg-gray-200 dark:bg-gray-800 p-2 rounded-md">
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full ">
                            <thead>
                                <tr>
                                    <th className="p-2 border border-black dark:border-gray-400 text-center">#</th>
                                    <th className="p-2 border border-black dark:border-gray-400 text-center">Tipe Invoice</th>
                                    <th className="p-2 border border-black dark:border-gray-400 text-center">Keterangan</th>
                                    <th className="p-2 border border-black dark:border-gray-400 text-center">Act</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((v, index) => (
                                    <tr key={v.id}>
                                        <td className="p-2 border border-black dark:border-gray-400 text-center">{index + 1}</td>
                                        <td className="p-2 border border-black dark:border-gray-400 text-left">{v.tipe}</td>
                                        <td className="p-2 border border-black dark:border-gray-400 text-left">{v.ket}</td>
                                        <td className="p-2 border border-black dark:border-gray-400 text-center">
                                            <Button
                                                title={`Edit`}
                                                className="cursor-pointer"
                                                onClick={() => handleEditOpen(v)}
                                            >
                                                <span className='flex flex-row'>
                                                    <div className='flex items-center justify-center mr-1 bg-blue-600 hover:bg-white text-white hover:text-blue-600 p-1 rounded-md'>
                                                        <Edit className="w-4 h-4" />
                                                    </div>
                                                </span>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {!loading && isModalOpen && (
                <Create
                    data={data}
                    setModalOpen={setModalOpen}
                    handleSubmit={handleSubmit}
                />
            )}

            {!loading && isEditOpen && (
                <EditTipe
                    tipe={tipe}
                    setModalOpen={setEditOpen}
                    handleSubmit={handleSubmit}
                />
            )}

            {loading && <LoadingSpinner />}

            {isErrorModalOpen && <ErrorModal
                isModalOpen={isErrorModalOpen}
                message={errorMessage}
                closeModal={() => setIsErrorModalOpen(false)}
            />}

            {isSuccessModalOpen && <SuccessModal
                isModalOpen={isSuccessModalOpen}
                message={successMessage}
                closeModal={closeModalSuccess}
            />}

        </AppLayout>
    );
};

export default Index;
