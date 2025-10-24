import AppLayout from "@/layouts/app-layout";
import { Head, router } from "@inertiajs/react";
import React, { useState } from "react";
import { setup } from "../models";

interface Props {
    setup: setup;
}

const Edit: React.FC<Props> = ({ setup }) => {
    const breadcrumbs = [
        {
            title: "Edit Tenant",
            href: "/foodcourt/tenants"
        },
    ];

    const [formData, setFormData] = useState<setup>(
        setup || {
            id: 0,
            key: '',
            value: '',
            readonly_key: false,
            readonly_value: false,
        }
    );

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async () => {
        setSubmitting(true);
        setError(null);
        setSuccess(false);

        try {
            router.patch(route("foodcourt.setup.update", setup.id), { ...formData }, {
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
                    <h1 className="text-xl font-bold">Edit Setup</h1>
                </div>

                <div className="space-y-4 bg-gray-200 p-4 rounded shadow">

                    <div className="flex flex-wrap justify-center gap-4 py-4 bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-black dark:border-gray-600">
                        {/* Key */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Key</label>
                            <input
                                type="text"
                                value={formData.key || ''}
                                onChange={(e => setFormData({ ...formData, key: e.target.value }))}
                                className={`w-full rounded-md border border-gray-300 dark:border-gray-600  text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${formData.readonly_key ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed' : 'bg-white dark:bg-gray-800'}`}
                                readOnly={formData.readonly_key}
                            />
                        </div>

                        {/* Value */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Value</label>
                            <input
                                type="text"
                                value={formData.value || ''}
                                onChange={(e => setFormData({ ...formData, value: e.target.value }))}
                                className={`w-full rounded-md border border-gray-300 dark:border-gray-600  text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${formData.readonly_value ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed' : 'bg-white dark:bg-gray-800'}`}
                                readOnly={formData.readonly_value}
                            />
                        </div>

                    </div>

                    {error && <div className="text-red-600">{error}</div>}
                    {success && <div className="text-green-600">Setup berhasil diperbarui!</div>}

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
