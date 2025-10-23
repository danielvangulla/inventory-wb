import AppLayout from "@/layouts/app-layout";
import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import { tenant, kategorisub, menu } from "../models";
import { formatNumber } from "../functions";

interface Props {
    tenant: tenant[];
    kategorisub: kategorisub[];
}

const initialFormData: menu = {
    id: 0,
    sku: "",
    tenant_id: 0,
    kategorisub_id: 0,
    alias: "",
    deskripsi: "",
    harga: 0,
    is_ready: true,
    is_soldout: false,
};

const Create: React.FC<Props> = ({ tenant, kategorisub }) => {
    const breadcrumbs = [
        {
            title: "Tambah Menu",
            href: "/foodcourt/menu"
        },
    ];

    const [formData, setFormData] = useState<menu>(initialFormData);

    const handleChangeHarga = (value: string) => {
        // Remove non-numeric characters and remove leading zeros
        const numericValue = value.replace(/\D/g, '').replace(/^0+/, '');

        setFormData({ ...formData, harga: numericValue ? parseInt(numericValue) : 0 });
    };

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async () => {
        if (formData.sku.trim() === "") {
            // konfirmasi jika sku kosong
            if (!confirm("SKU kosong, lanjutkan dengan SKU otomatis oleh sistem ?")) {
                return;
            }
        }

        if (formData.kategorisub_id === 0) {
            setError("Silahkan pilih Sub-kategori..");
            return;
        }

        if (formData.tenant_id === 0) {
            setError("Silahkan pilih Tenant..");
            return;
        }

        if (formData.alias.trim() === "") {
            setError("Silahkan isi Alias / Nama Menu..");
            return;
        }

        if (formData.harga <= 0) {
            setError("Harga harus lebih dari 0..");
            return;
        }

        setSubmitting(true);
        setError(null);
        setSuccess(false);

        try {
            const payload = {
                sku: formData.sku.trim() === "" ? null : formData.sku,
                tenant_id: formData.tenant_id,
                kategorisub_id: formData.kategorisub_id,
                alias: formData.alias,
                deskripsi: formData.deskripsi,
                harga: formData.harga,
                is_ready: formData.is_ready ? 1 : 0,
                is_soldout: formData.is_soldout ? 1 : 0
            };

            router.post(route("foodcourt.menu.store"), payload, {
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
                    <h1 className="text-xl font-bold">Tambah Menu</h1>
                </div>

                <div className="space-y-4 bg-gray-200 p-4 rounded shadow">

                    <div className="flex flex-wrap justify-center gap-4 py-4 px-2 bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-black dark:border-gray-600">

                        {/* Select Tenant */}
                        <div className="flex flex-col w-full">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Tenant</label>
                            <select
                                value={formData.tenant_id}
                                onChange={(e) => setFormData({ ...formData, tenant_id: +e.target.value })}
                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value={0}>-- Select Tenant --</option>
                                {tenant.map((v) => (
                                    <option key={v.id} value={v.id}>
                                        {v.nama_tenant}
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
                                <option value={0}>-- Select Sub-Kategori --</option>
                                {kategorisub.map((v) => (
                                    <option key={v.id} value={v.id}>
                                        {v.ket}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* SKU */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">
                                SKU <span className="italic text-xs">(kosong = otomatis)</span>
                            </label>
                            <input
                                type="text"
                                placeholder="12345678"
                                value={formData.sku}
                                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Alias */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">
                                Alias <span className="italic text-xs">(max. 20 karakter)</span>
                            </label>
                            <input
                                type="text"
                                value={formData.alias}
                                onChange={(e => setFormData({ ...formData, alias: e.target.value }))}
                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Deskripsi */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Deskripsi</label>
                            <input
                                type="text"
                                value={formData.deskripsi}
                                onChange={(e => setFormData({ ...formData, deskripsi: e.target.value }))}
                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Harga */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Harga Rp.</label>
                            <input
                                type="text"
                                value={formatNumber(formData.harga, 0)}
                                onChange={(e) => handleChangeHarga(e.target.value)}
                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 py-4 px-2 bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-black dark:border-gray-600">

                        {/* Is Ready */}
                        <div className="flex flex-col justify-center items-center">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Ready</label>
                            <input
                                type="checkbox"
                                checked={formData.is_ready}
                                onChange={(e) => setFormData({ ...formData, is_ready: e.target.checked })}
                                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                        </div>

                        {/* Is Sold Out */}
                        <div className="flex flex-col justify-center items-center">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Sold Out</label>
                            <input
                                type="checkbox"
                                checked={formData.is_soldout}
                                onChange={(e) => setFormData({ ...formData, is_soldout: e.target.checked })}
                                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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
