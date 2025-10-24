import AppLayout from "@/layouts/app-layout";
import { Head, router } from "@inertiajs/react";
import React, { useState } from "react";
import { Barang, Kategori, Kategorisub } from "../models";
import { formatDigit } from "@/pages/components/helpers";

interface Props {
    barang: Barang;
    kategori: Kategori[];
}

const Edit: React.FC<Props> = ({ barang, kategori }) => {
    const breadcrumbs = [
        {
            title: "Edit Barang",
            href: `/inventory/barang/${barang.id}/edit`,
        },
    ];

    const [formData, setFormData] = useState<Barang>(
        barang || {
            id: 0,
            deskripsi: "",
            kategori_id: 0,
            kategorisub_id: 0,
            stok: 0,
            min_stok: 0,
            satuan: "",
            isi: 0,
            harga_beli: 0,
            harga_jual: 0,
        }
    );

    const [kategorisub, setKategorisub] = useState<Kategorisub[]>(
        kategori
            .find((k) => k.id === barang.kategori_id)
            ?.kategorisubs || []
    );

    const handleKategoriChange = (kategoriId: string) => {
        const selectedKategoriId = parseInt(kategoriId, 10);
        setFormData({ ...formData, kategori_id: selectedKategoriId, kategorisub_id: 0 });

        const filteredSubkategori = kategori
            .find((k) => k.id === selectedKategoriId)
            ?.kategorisubs || [];

        setKategorisub(filteredSubkategori);
    }

    const handleChangeMinStok = (value: string) => {
        // Remove non-numeric characters and remove leading zeros
        const numericValue = value.replace(/\D/g, '').replace(/^0+/, '');

        setFormData({ ...formData, min_stok: numericValue ? parseInt(numericValue) : 0 });
    };

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async () => {
        setSubmitting(true);
        setError(null);
        setSuccess(false);

        try {
            const payload = {
                deskripsi: formData.deskripsi,
                kategori_id: formData.kategori_id,
                kategorisub_id: formData.kategorisub_id,
                satuan: formData.satuan,
                min_stok: formData.min_stok,
            };

            router.patch(route("inventory.barang.update", barang.id), payload, {
                onSuccess: () => {
                    setSuccess(true);
                    setFormData(formData);
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
                    <h1 className="text-xl font-bold">Edit Kategori</h1>
                </div>

                <div className="space-y-4 bg-gray-200 p-4 rounded shadow">

                    <div className="flex flex-wrap justify-center gap-4 py-4 px-2 bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-black dark:border-gray-600">

                        {/* Deskripsi */}
                        <div className="flex flex-col w-full">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">
                                Deskripsi
                            </label>
                            <input
                                value={formData.deskripsi}
                                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Select Kategori */}
                        <div className="flex flex-col w-full">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Kategori</label>
                            <select
                                value={formData.kategori_id}
                                onChange={(e) => handleKategoriChange(e.target.value)}
                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value={0}>-- Pilih Kategori --</option>
                                {kategori.map((v) => (
                                    <option key={v.id} value={v.id}>
                                        {v.ket}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Select Sub-Kategori */}
                        <div className="flex flex-col w-full">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Sub-Kategori</label>
                            <select
                                value={formData.kategorisub_id}
                                onChange={(e) => setFormData({ ...formData, kategorisub_id: +e.target.value })}
                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value={0}>-- Pilih Sub-Kategori --</option>
                                {kategorisub.map((v) => (
                                    <option key={v.id} value={v.id}>
                                        {v.ket}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Satuan */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">
                                Satuan <span className="italic text-xs">(max. 20 karakter)</span>
                            </label>
                            <input
                                type="text"
                                value={formData.satuan}
                                onChange={(e => setFormData({ ...formData, satuan: e.target.value }))}
                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Min. Stok */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Minimum Stok</label>
                            <input
                                type="text"
                                value={formatDigit(formData.min_stok, 0)}
                                onChange={(e) => handleChangeMinStok(e.target.value)}
                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {error && <div className="text-red-600">{error}</div>}
                    {success && <div className="text-green-600">Barang berhasil diperbarui!</div>}

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

export default Edit;
