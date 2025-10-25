/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import Select from "react-select";
import AppLayout from "@/layouts/app-layout";
import { Head, router } from "@inertiajs/react";
import { formatDigit } from "@/pages/components/helpers";
import { Trash2 } from "lucide-react";
import { Barang, BarangRusak, BarangRusakDetail, Supplier } from "../models";

interface Props {
    barangs: Barang[];
    suppliers: Supplier[];
}

const initialFormData: BarangRusak = {
    id: 0,
    tgl: new Date().toISOString().split("T")[0],
    supplier_id: 0,
    penerima: "",
    total: 0,
    details: [],
};

const Create: React.FC<Props> = ({ barangs, suppliers }) => {
    const breadcrumbs = [
        {
            title: "Penerimaan Gudang",
            href: "/inventory/terima-gudang/create",
        },
    ];

    const [formData, setFormData] = useState<BarangRusak>(initialFormData);

    // Supplier Select State
    const supplierOptions = suppliers.map((v: any) => ({
        label: v.nama,
        value: v.id,
    }));

    const [selectedSupplierOption, setSelectedSupplierOption] = useState<any | null>(null);

    const handleOptionChange = (option: any) => {
        setSelectedSupplierOption(option);
        setFormData({ ...formData, supplier_id: option.value });
    };

    // Barang Select State
    const barangOptions = barangs.map((v: any) => ({
        label: v.deskripsi,
        value: v.id,
        data: v,
    }));

    const [selectedBarangOption, setSelectedBarangOption] = useState<any | null>(null);

    const handleBarangOptionChange = (option: any) => {
        setSelectedBarangOption(option);
        setItem({ ...item!, harga: option.data.harga_beli });
    };

    // New Item State
    const [item, setItem] = useState<BarangRusakDetail | null>(null);

    const handleItemQtyChange = (value: string) => {
        const qty = +parseFloat(value).toFixed(2);
        setItem({ ...item!, qty });
    };

    // trigger handleAddItem when user hit enter key on harga input
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const onFieldHarga = document.activeElement === document.querySelector('input[placeholder="Harga"]');
            const onFieldQty = document.activeElement === document.querySelector('input[placeholder="Qty"]');
            if (!onFieldHarga && !onFieldQty) return;

            if (e.key === "Enter") {
                handleAddItem(e as any);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [item, selectedBarangOption]);

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedBarangOption) {
            setError("Silahkan pilih barang.");
            return;
        }

        const qty = item?.qty || 0;
        if (isNaN(qty) || qty <= 0) {
            setError("Qty harus lebih dari 0.");
            return;
        }

        const harga = item?.harga || 0;
        if (isNaN(harga) || harga <= 0) {
            setError("Harga harus lebih dari 0.");
            return;
        }

        const brutto = qty * harga;
        const disc = 0; // default disc 0
        const netto = brutto;
        const tax = netto / 100 * 0; // default tax 0%
        const total = netto + tax - disc;

        const newDetail: BarangRusakDetail = {
            id: 0,
            barang_rusak_id: 0,
            barang_id: selectedBarangOption.value,
            qty,
            harga,
            total,
        };

        setFormData((prev) => ({
            ...prev,
            total: prev.total + total,
            details: [...prev.details!, newDetail],
        }));

        // Reset item and selected barang
        setItem(null);
        setSelectedBarangOption(null);
    }

    const handleRmoveItem = (index: number) => () => {
        const detailToRemove = formData.details ? formData.details[index] : null;
        if (!detailToRemove) return;

        setFormData((prev) => ({
            ...prev,
            total: prev.total - detailToRemove.total,
            details: prev.details!.filter((_, i) => i !== index),
        }));
    }

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setError(null);
        setSuccess(false);
    }, [formData, item]);

    const handleSubmit = async () => {
        if (formData.tgl.trim() === "") {
            setError("Silahkan isi tanggal..");
            return;
        }

        if (formData.supplier_id === 0) {
            setError("Silahkan pilih supplier..");
            return;
        }

        if (formData.penerima.trim() === "") {
            setError("Silahkan isi penerima..");
            return;
        }

        if (!formData.details || formData.details.length === 0) {
            setError("Silahkan tambahkan minimal 1 baris barang.");
            return;
        }

        setSubmitting(true);
        setError(null);
        setSuccess(false);

        try {
            const payload = {
                tgl: formData.tgl,
                supplier_id: formData.supplier_id,
                penerima: formData.penerima,
                total: formData.total,
                details: formData.details?.map((detail) => ({
                    barang_id: detail.barang_id,
                    qty: detail.qty,
                    harga: detail.harga,
                    total: detail.total,
                })),
            };

            router.post(route("inventory.barang-rusak.store"), payload, {
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

            <div className="container mx-auto p-4">
                <div className="mb-6 flex flex-row items-center pt-2">
                    <h1 className="pl-2 text-2xl font-bold">Input Barang Rusak</h1>
                </div>

                <div className="space-y-0 bg-slate-200 p-2 rounded shadow">

                    <div className="flex flex-col justify-center gap-1 py-1 bg-blue-200 dark:bg-gray-700 rounded-t-lg border-1 border-black dark:border-gray-600">

                        <div className="flex flex-col md:flex-row justify-center gap-2 py-1 px-2">
                            {/* Tanggal Rusak */}
                            <div className="flex flex-col md:min-w-48 max-w-full">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Tanggal Rusak</label>
                                <input
                                    type="date"
                                    value={formData.tgl}
                                    onChange={(e => setFormData({ ...formData, tgl: e.target.value }))}
                                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Supplier */}
                            <div className="flex flex-col md:min-w-60 max-w-full">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">
                                    Pilih Supplier
                                </label>
                                <Select
                                    options={supplierOptions} // options for autocomplete
                                    value={selectedSupplierOption} // current selected supplier
                                    onChange={handleOptionChange} // onChange handler
                                    getOptionLabel={(e) => e.label} // specify what to display
                                    getOptionValue={(e) => e.value} // specify value to track
                                    placeholder="Cari..."
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                />
                            </div>

                            {/* Nama Penerima */}
                            <div className="flex flex-col md:min-w-48 max-w-full">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Nama Penerima</label>
                                <input
                                    type="text"
                                    value={formData.penerima}
                                    onChange={(e => setFormData({ ...formData, penerima: e.target.value }))}
                                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                        </div>
                    </div>

                    <div className="flex flex-row justify-center items-center overflow-x-auto">
                        <table className="divide-y divide-gray-200 w-full border border-black dark:border-gray-400">
                            <thead className="bg-gray-500 text-white">
                                <tr>
                                    <th className="p-2 w-10 text-center text-sm font-bold uppercase tracking-wider border border-black dark:border-gray-400">
                                        #
                                    </th>
                                    <th className="p-2 text-center text-sm font-bold uppercase tracking-wider border border-black dark:border-gray-400">
                                        Deskripsi
                                    </th>
                                    <th className="p-2 text-center text-sm font-bold uppercase tracking-wider border border-black dark:border-gray-400">
                                        Qty
                                    </th>
                                    <th className="p-2 text-center text-sm font-bold uppercase tracking-wider border border-black dark:border-gray-400">
                                        Harga
                                    </th>
                                    <th className="p-2 text-center text-sm font-bold uppercase tracking-wider border border-black dark:border-gray-400">
                                        Jumlah
                                    </th>
                                    <th className="p-2 w-10 text-center text-sm font-bold uppercase tracking-wider border border-black dark:border-gray-400"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 text-sm text-black dark:text-white">
                                {formData.details && formData.details.length > 0 ? (
                                    formData.details.map((detail, index) => {
                                        const barang = barangs.find(b => b.id === detail.barang_id);
                                        return (
                                            <tr key={index}>
                                                <td className="px-2 py-1 text-center border border-black dark:border-gray-400">{index + 1}</td>
                                                <td className="px-2 py-1 border border-black dark:border-gray-400">{barang ? barang.deskripsi : "N/A"}</td>
                                                <td className="px-2 py-1 text-center border border-black dark:border-gray-400">
                                                    {formatDigit(detail.qty, 2)} {barang ? barang.satuan : ""}
                                                </td>
                                                <td className="px-2 py-1 text-right border border-black dark:border-gray-400">{formatDigit(detail.harga, 2)}</td>
                                                <td className="px-2 py-1 text-right border border-black dark:border-gray-400">{formatDigit(detail.total, 2)}</td>
                                                <td className="px-2 py-1 text-center border border-black dark:border-gray-400">
                                                    <button
                                                        onClick={handleRmoveItem(index)}
                                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-1 rounded cursor-pointer"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-2 py-4 text-center border border-black dark:border-gray-400">
                                            Tidak ada item yang ditambahkan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot className="bg-blue-500 text-md text-white">
                                <tr>
                                    <td colSpan={4} className="px-2 py-2 text-right font-bold border border-black dark:border-gray-400">T O T A L &nbsp; Rp.</td>
                                    <td className="px-2 py-2 text-right font-bold border border-black dark:border-gray-400">{formatDigit(formData.total, 0)}</td>
                                    <td className="px-2 py-2 text-right font-bold border border-black dark:border-gray-400"></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* buat form input untuk item baru */}
                    <div className="flex flex-col justify-center gap-1 py-3 text-xs font-bold bg-blue-200 dark:bg-gray-700 rounded-b-lg border border-black dark:border-gray-600">

                        <div className="flex flex-col lg:flex-row justify-center items-center gap-2 pt-2">
                            <div className="flex flex-row lg:flex-col items-center lg:items-start justify-center gap-2 lg:gap-0 md:min-w-60 max-w-full bg-gray-100 p-1 rounded-lg">
                                <label className="text-gray-700 dark:text-gray-300 mb-1 pl-1">Pilih Barang</label>
                                <Select
                                    options={barangOptions} // options for autocomplete
                                    value={selectedBarangOption} // current selected barang
                                    onChange={handleBarangOptionChange} // onChange handler
                                    getOptionLabel={(e) => e.label} // specify what to display
                                    getOptionValue={(e) => e.value} // specify value to track
                                    placeholder="Cari..."
                                    className="react-select-container w-36 lg:w-full"
                                    classNamePrefix="react-select"
                                />
                            </div>

                            <div className="flex flex-row lg:flex-col items-center lg:items-start justify-center gap-2 lg:gap-0 md:min-w-24 max-w-full bg-gray-300 p-1 rounded-lg">
                                <label className="text-gray-700 dark:text-gray-300 mb-1 pl-1">
                                    Harga
                                    <span className="text-red-500 italic ml-1">{selectedBarangOption?.data.satuan ? `(per ${selectedBarangOption?.data.satuan || ''})` : ''}</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Harga"
                                    value={formatDigit(item?.harga || 0, 2)}
                                    onChange={() => {}}
                                    className="bg-gray-200 border border-gray-300 rounded-lg px-2 h-9 py-1 text-center cursor-not-allowed"
                                    disabled={true}
                                />
                            </div>

                            <div className="flex flex-row lg:flex-col items-center lg:items-start justify-center gap-2 lg:gap-0 md:min-w-20 max-w-full bg-gray-100 p-1 rounded-lg">
                                <label className="text-gray-700 dark:text-gray-300 mb-1 pl-1">
                                    Qty
                                    <span className="text-red-500 italic ml-1">{selectedBarangOption?.data.satuan ? `(${selectedBarangOption?.data.satuan || ''})` : ''}</span>
                                </label>
                                <input
                                    type="number"
                                    placeholder="Qty"
                                    value={item?.qty || 0}
                                    onChange={(e) => handleItemQtyChange(e.target.value)}
                                    className="bg-white border border-gray-300 rounded-sm px-2 h-9 py-1 text-center"
                                />
                            </div>

                            <button
                                type="submit"
                                onClick={handleAddItem}
                                className="flex items-center bg-green-500 text-white px-2 py-0 my-1.5 rounded-full hover:bg-green-600 text-xl font-bold cursor-pointer"
                            >
                                {/* jika width lg tampilkan icon tambah, jika tidak tampilkan text "Tambah" */}
                                <span className="hidden lg:inline">+</span>
                                <span className="inline lg:hidden text-sm">Tambah</span>
                            </button>
                        </div>

                    </div>

                    {error && <div className="text-red-600 text-center mt-2 p-2 mx-4 rounded-lg bg-red-100">{error}</div>}
                    {success && <div className="text-green-600">Barang berhasil disimpan!</div>}

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
