import AppLayout from "@/layouts/app-layout";
import { Head, router } from "@inertiajs/react";
import React, { useState } from "react";
import { level } from "../models";

const initialFormData: level = {
    id: 0,
    name: "",
    ket: "",
    is_admin: false,
    basic_read: false,
    basic_write: false,
    tenant_read: false,
    tenant_write: false,
    menu_read: false,
    menu_write: false,
    kasir: false,
    spv: false,
    laporan: false,
};

const Create: React.FC = () => {
    const breadcrumbs = [
        {
            title: "Tambah Level",
            href: "/foodcourt/user-level"
        },
    ];

    const [formData, setFormData] = useState<level>(initialFormData);

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async () => {
        setSubmitting(true);
        setError(null);
        setSuccess(false);

        try {
            router.post(route("foodcourt.user-level.store"), { ...formData }, {
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

    const handleChangeIsAdmin = () => {
        // Jika is_admin di cek, maka semua permission di set true dan disable
        // Jika is_admin di uncek, maka semua permission di set false dan enable
        if (!formData.is_admin) {
            setFormData({
                ...formData,
                is_admin: true,
                basic_read: true,
                basic_write: true,
                tenant_read: true,
                tenant_write: true,
                menu_read: true,
                menu_write: true,
                kasir: true,
                spv: true,
                laporan: true,
            });
        } else {
            setFormData({
                ...formData,
                is_admin: false,
                basic_read: false,
                basic_write: false,
                tenant_read: false,
                tenant_write: false,
                menu_read: false,
                menu_write: false,
                kasir: false,
                spv: false,
                laporan: false,
            });
        }
    };

    const handleChangePermission = (permission: keyof level) => {
        setFormData({ ...formData, [permission]: !formData[permission] });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${breadcrumbs[0].title}`} />

            <div className="container mx-auto max-w-xl p-2">
                <div className="mb-6 flex flex-row items-center pt-2">
                    <h1 className="text-xl font-bold">Tambah Level User</h1>
                </div>

                <div className="space-y-2 bg-blue-500 p-2 rounded-lg shadow">

                    <div className="flex flex-wrap justify-center gap-4 py-4 bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-black dark:border-gray-600">

                        {/* Name */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Nama Level</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e => setFormData({ ...formData, name: e.target.value }))}
                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Keterangan */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Keterangan</label>
                            <input
                                type="text"
                                value={formData.ket}
                                onChange={(e => setFormData({ ...formData, ket: e.target.value }))}
                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex flex-col justify-center items-center w-full gap-2 md:w-auto p-1">
                            <div
                                onClick={handleChangeIsAdmin}
                                className="flex flex-col justify-center items-center w-full md:w-auto p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white hover:bg-gray-100 dark:bg-gray-800 cursor-pointer text-center">
                                <div className="flex items-center space-x-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Admin ?</label>
                                    <input
                                        type="checkbox"
                                        checked={formData.is_admin}
                                        onChange={() => { }}
                                        className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                </div>
                                <span className="text-xs italic text-gray-700 dark:text-gray-300">Cek jika level ini adalah admin dengan akses penuh.</span>
                            </div>

                            <div className="flex flex-row justify-center gap-4 flex-wrap">
                                {/* Kasir */}
                                <div
                                    onClick={() => handleChangePermission('kasir')}
                                    className="flex flex-col justify-center items-center p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white hover:bg-gray-100 dark:bg-gray-800 cursor-pointer text-center">
                                    <div className="flex items-center space-x-2">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Kasir</label>
                                        <input
                                            type="checkbox"
                                            checked={formData.kasir}
                                            onChange={() => { }}
                                            disabled={formData.is_admin}
                                            className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
                                        />
                                    </div>
                                    <span className="text-xs italic text-gray-700 dark:text-gray-300">Akses untuk fitur Kasir.</span>
                                </div>

                                {/* SPV */}
                                <div
                                    onClick={() => handleChangePermission('spv')}
                                    className="flex flex-col justify-center items-center p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white hover:bg-gray-100 dark:bg-gray-800 cursor-pointer text-center">
                                    <div className="flex items-center space-x-2">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">SPV</label>
                                        <input
                                            type="checkbox"
                                            checked={formData.spv}
                                            onChange={() => { }}
                                            disabled={formData.is_admin}
                                            className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
                                        />
                                    </div>
                                    <span className="text-xs italic text-gray-700 dark:text-gray-300">Akses untuk fitur SPV.</span>
                                </div>

                                {/* Laporan */}
                                <div
                                    onClick={() => handleChangePermission('laporan')}
                                    className="flex flex-col justify-center items-center p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white hover:bg-gray-100 dark:bg-gray-800 cursor-pointer text-center">
                                    <div className="flex items-center space-x-2">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Laporan</label>
                                        <input
                                            type="checkbox"
                                            checked={formData.laporan}
                                            onChange={() => { }}
                                            disabled={formData.is_admin}
                                            className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
                                        />
                                    </div>
                                    <span className="text-xs italic text-gray-700 dark:text-gray-300">Akses untuk fitur Laporan.</span>
                                </div>
                            </div>

                            <div className="w-full flex flex-row justify-center gap-4 flex-wrap">
                                {/* Basic Read */}
                                <div
                                    onClick={() => handleChangePermission('basic_read')}
                                    className="flex flex-col justify-center items-center p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white hover:bg-gray-100 dark:bg-gray-800 cursor-pointer text-center">
                                    <div className="flex items-center space-x-2">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Basic Read</label>
                                        <input
                                            type="checkbox"
                                            checked={formData.basic_read}
                                            onChange={() => { }}
                                            disabled={formData.is_admin}
                                            className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
                                        />
                                    </div>
                                    <span className="text-xs italic text-gray-700 dark:text-gray-300">Akses baca untuk fitur Basic.</span>
                                </div>

                                {/* Basic Write */}
                                <div
                                    onClick={() => handleChangePermission('basic_write')}
                                    className="flex flex-col justify-center items-center p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white hover:bg-gray-100 dark:bg-gray-800 cursor-pointer text-center">
                                    <div className="flex items-center space-x-2">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Basic Write</label>
                                        <input
                                            type="checkbox"
                                            checked={formData.basic_write}
                                            onChange={() => { }}
                                            disabled={formData.is_admin}
                                            className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
                                        />
                                    </div>
                                    <span className="text-xs italic text-gray-700 dark:text-gray-300">Akses tulis untuk fitur Basic.</span>
                                </div>
                            </div>

                            <div className="flex flex-row justify-center gap-4 flex-wrap">
                                {/* Tenant Read */}
                                <div
                                    onClick={() => handleChangePermission('tenant_read')}
                                    className="flex flex-col justify-center items-center p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white hover:bg-gray-100 dark:bg-gray-800 cursor-pointer text-center">
                                    <div className="flex items-center space-x-2">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Tenant Read</label>
                                        <input
                                            type="checkbox"
                                            checked={formData.tenant_read}
                                            onChange={() => { }}
                                            disabled={formData.is_admin}
                                            className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
                                        />
                                    </div>
                                    <span className="text-xs italic text-gray-700 dark:text-gray-300">Akses baca untuk fitur Tenant.</span>
                                </div>

                                {/* Tenant Write */}
                                <div
                                    onClick={() => handleChangePermission('tenant_write')}
                                    className="flex flex-col justify-center items-center p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white hover:bg-gray-100 dark:bg-gray-800 cursor-pointer text-center">
                                    <div className="flex items-center space-x-2">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Tenant Write</label>
                                        <input
                                            type="checkbox"
                                            checked={formData.tenant_write}
                                            onChange={() => { }}
                                            disabled={formData.is_admin}
                                            className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
                                        />
                                    </div>
                                    <span className="text-xs italic text-gray-700 dark:text-gray-300">Akses tulis untuk fitur Tenant.</span>
                                </div>
                            </div>

                            <div className="flex flex-row justify-center gap-4 flex-wrap">
                                {/* Menu Read */}
                                <div
                                    onClick={() => handleChangePermission('menu_read')}
                                    className="flex flex-col justify-center items-center p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white hover:bg-gray-100 dark:bg-gray-800 cursor-pointer text-center">
                                    <div className="flex items-center space-x-2">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Menu Read</label>
                                        <input
                                            type="checkbox"
                                            checked={formData.menu_read}
                                            onChange={() => { }}
                                            disabled={formData.is_admin}
                                            className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
                                        />
                                    </div>
                                    <div className="text-xs italic text-gray-700 dark:text-gray-300">Akses baca untuk fitur Setup Menu.</div>
                                </div>

                                {/* Menu Write */}
                                <div
                                    onClick={() => handleChangePermission('menu_write')}
                                    className="flex flex-col justify-center items-center p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white hover:bg-gray-100 dark:bg-gray-800 cursor-pointer text-center">
                                    <div className="flex items-center space-x-2">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Menu Write</label>
                                        <input
                                            type="checkbox"
                                            checked={formData.menu_write}
                                            onChange={() => { }}
                                            disabled={formData.is_admin}
                                            className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
                                        />
                                    </div>
                                    <span className="text-xs italic text-gray-700 dark:text-gray-300">Akses tulis untuk fitur Setup Menu.</span>
                                </div>
                            </div>

                        </div>
                    </div>

                    {error && <div className="text-red-600">{error}</div>}
                    {success && <div className="text-green-600">User Level berhasil dibuat!</div>}

                    <div className="flex justify-center gap-4 mt-4">
                        <button
                            onClick={() => window.history.back()}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 cursor-pointer"
                        >
                            Kembali
                        </button>

                        <button
                            onClick={handleSubmit}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
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
