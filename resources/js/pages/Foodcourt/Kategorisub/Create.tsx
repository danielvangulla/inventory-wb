import AppLayout from "@/layouts/app-layout";
import { Head, router } from "@inertiajs/react";
import React, { useState } from "react";
import { kategori, kategorisub } from "../models";

interface Props {
    kategori: kategori[];
}

const initialFormData: kategorisub = {
    id: 0,
    kategori_id: 0,
    ket: "",
    urut: 9,
};

const Create: React.FC<Props> = ({ kategori }) => {
    const breadcrumbs = [
        {
            title: "Tambah Kategori",
            href: "/foodcourt/kategori"
        },
    ];

    const [formData, setFormData] = useState<kategorisub>(initialFormData);

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async () => {
        if (formData.kategori_id === 0) {
            setError("Silahkan pilih kategori..");
            return;
        }

        if (formData.ket.trim() === "") {
            setError("Silahkan isi Sub-kategori..");
            return;
        }

        if (formData.urut <= 0) {
            setError("Urutan harus lebih dari 0..");
            return;
        }

        setSubmitting(true);
        setError(null);
        setSuccess(false);

        try {
            const payload = {
                kategori_id: formData.kategori_id,
                ket: formData.ket,
                urut: formData.urut
             };

            router.post(route("foodcourt.kategorisub.store"), payload, {
                onSuccess: () => {
                    setSuccess(true);
                    setFormData(initialFormData);
                },
                onError: (errors) => {
                    if (errors && typeof errors === "object") {
                        const firstError = Object.values(errors)[0];
                        if (Array.isArray(firstError)) {
                            setError(firstError[0]);
                        } else if (typeof firstError === "string") {
                            setError(firstError);
                        } else {
                            setError("An unknown error occurred.");
                        }
                    } else {
                        setError("An unknown error occurred.");
                    }
                },
                onFinish: () => {
                    setSubmitting(false);
                },
            });
        } catch (err) {
            console.error("Submission error:", err);
            setError("An error occurred while submitting the form.");
            setSubmitting(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${breadcrumbs[0].title}`} />

            <div className="container mx-auto max-w-xl p-2">
                <div className="mb-6 flex flex-row items-center pt-2">
                    <h1 className="text-xl font-bold">Tambah Kategori</h1>
                </div>

                <div className="space-y-4 bg-gray-200 p-4 rounded shadow">

                    <div className="flex flex-wrap justify-center gap-4 py-4 px-2 bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-black dark:border-gray-600">
                        {/* Select Kategori */}
                        <div className="flex flex-col w-full">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Kategori</label>
                            <select
                                value={formData.kategori_id}
                                onChange={(e) => setFormData({ ...formData, kategori_id: +e.target.value })}
                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value={0}>-- Select Kategori --</option>
                                {kategori.map((kat) => (
                                    <option key={kat.id} value={kat.id}>
                                        {kat.ket}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Keterangan */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Sub-Kategori</label>
                            <input
                                type="text"
                                value={formData.ket}
                                onChange={(e => setFormData({ ...formData, ket: e.target.value }))}
                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Urutan */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Urutan</label>
                            <input
                                type="number"
                                value={formData.urut}
                                onChange={(e => setFormData({ ...formData, urut: +e.target.value }))}
                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                    </div>

                    {error && <div className="text-red-600">{error}</div>}
                    {success && <div className="text-green-600">Sub-Kategori berhasil dibuat!</div>}

                    <div className="flex justify-center gap-4 mt-4">
                        <button
                            onClick={() => window.history.back()}
                            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-800 cursor-pointer"
                        >
                            Kembali
                        </button>

                        <button
                            onClick={handleSubmit}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
                            disabled={submitting}
                        >
                            {submitting ? "Creating..." : "Simpan"}
                        </button>

                    </div>

                </div>
            </div>

        </AppLayout>
    );
};

export default Create;
