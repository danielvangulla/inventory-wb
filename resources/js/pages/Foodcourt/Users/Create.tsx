import AppLayout from "@/layouts/app-layout";
import { Head, router } from "@inertiajs/react";
import React, { useState } from "react";
import { user, level, tenant } from "../models";

interface Props {
    levels: level[];
    tenants: tenant[];
}

const initialFormData: user = {
    id: 0,
    name: "",
    password: "",
    user_level_id: 0,
    tenant_id: 0,
};

const Create: React.FC<Props> = ({ levels, tenants }) => {
    const breadcrumbs = [
        {
            title: "Tambah User",
            href: "/foodcourt/users/create",
        },
    ];

    const [formData, setFormData] = useState<user>(initialFormData);
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async () => {
        console.log({ formData, passwordConfirmation });
        if (formData.password != passwordConfirmation) {
            setError("Password dan konfirmasi tidak cocok.");
            return;
        }

        setSubmitting(true);
        setError(null);
        setSuccess(false);

        const payload = {
            name: formData.name,
            password: formData.password,
            password_confirmation: passwordConfirmation,
            user_level_id: formData.user_level_id
         };

        try {
            router.post(route("foodcourt.users.store"), payload, {
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
                    <h1 className="text-xl font-bold">Tambah User</h1>
                </div>

                <div className="space-y-2 bg-blue-300 p-4 rounded-lg shadow">

                    <div className="flex flex-col justify-center gap-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-black dark:border-gray-600">

                        {/* Name */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Username</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e => setFormData({ ...formData, name: e.target.value }))}
                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Password */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Password</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e => setFormData({ ...formData, password: e.target.value }))}
                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Password Confirmation */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Konfirmasi Password</label>
                            <input
                                type="password"
                                value={passwordConfirmation}
                                onChange={(e => setPasswordConfirmation(e.target.value))}
                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* User Level */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Level User</label>
                            <select
                                value={formData.user_level_id}
                                onChange={(e) => setFormData({ ...formData, user_level_id: parseInt(e.target.value) })}
                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value={0}>-- Pilih Level --</option>
                                {levels?.map(level => (
                                    <option key={level.id} value={level.id}>{level.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Tenant, if user from tenant */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Tenant</label>
                                <select
                                    value={formData.tenant_id || ""}
                                    onChange={(e) => setFormData({ ...formData, tenant_id: e.target.value ? parseInt(e.target.value) : 0 })}
                                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option className="italic" value="">-- Pilih Tenant --</option>
                                    <option value="0">Bukan Tenant</option>
                                    {tenants?.map(tenant => (
                                        <option key={tenant.id} value={tenant.id}>{tenant.nama_tenant}</option>
                                    ))}
                                </select>
                            </div>
                    </div>

                    {error && <div className="text-red-600">{error}</div>}
                    {success && <div className="text-green-600">User berhasil dibuat!</div>}

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
