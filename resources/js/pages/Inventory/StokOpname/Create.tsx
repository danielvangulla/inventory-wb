/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import Select from "react-select";
import AppLayout from "@/layouts/app-layout";
import { Head, router } from "@inertiajs/react";
import { formatDigit } from "@/pages/components/helpers";
import { Trash2 } from "lucide-react";
import { Barang, Opname, OpnameDet } from "../models";

interface Props {
    barangs: Barang[];
}

const initialFormData: Opname = {
    id: 0,
    tgl: new Date().toISOString().split("T")[0],
    user_id: 0,
    catatan: "Opname Rutin",
    total: 0,
    details: [],
};

const Create: React.FC<Props> = ({ barangs }) => {
    const breadcrumbs = [
        {
            title: "Stok Opname",
            href: "/inventory/stok-opname/create",
        },
    ];

    const [formData, setFormData] = useState<Opname>(initialFormData);

    // Barang Select State
    const barangOptions = barangs.map((v: any) => ({
        label: v.deskripsi,
        value: v.id,
        data: v,
    }));

    const [selectedBarangOption, setSelectedBarangOption] = useState<any | null>(null);

    const handleBarangOptionChange = (option: any) => {
        setSelectedBarangOption(option);
        if (option) {
            setItem({
                id: 0,
                opname_id: 0,
                barang_id: option.value,
                harga: +option.data.harga_beli,
                qty_sistem: +option.data.stok,
                qty_fisik: 0,
                qty_selisih: 0,
                selisih_rp: 0
            });
        }
    };

    const [item, setItem] = useState<OpnameDet | null>(null);

    const handleQtyFisikChange = (value: string) => {
        const harga = item?.harga || 0;
        const qty_sistem = item?.qty_sistem || 0;
        const qty_fisik = +parseFloat(value).toFixed(2) || 0;
        const qty_selisih = qty_fisik - qty_sistem;
        const selisih_rp = qty_selisih * harga;

        console.log({ ...item, qty_fisik, qty_selisih, selisih_rp });

        if (item) {
            setItem({
                id: item.id,
                opname_id: item.opname_id,
                barang_id: item.barang_id,
                harga: item.harga,
                qty_sistem: item.qty_sistem,
                qty_fisik,
                qty_selisih,
                selisih_rp
            });
        }
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

        // jika barang id sudah ada, setError
        if (formData.details?.find(v => item?.barang_id === v.barang_id)) {
            setError("Barang sudah ada dalam daftar..");
            return;
        }

        if (!selectedBarangOption) {
            setError("Silahkan pilih barang.");
            return;
        }

        const qty_fisik = item?.qty_fisik || 0;
        if (isNaN(qty_fisik) || qty_fisik < 0) {
            setError("Qty Fisik minimal 0.");
            return;
        }

        const harga = item?.harga || 0;
        if (isNaN(harga) || harga <= 0) {
            setError("Harga harus lebih dari 0.");
            return;
        }

        const newDetail: OpnameDet = {
            id: 0,
            opname_id: 0,
            barang_id: selectedBarangOption.value,
            harga,
            qty_fisik,
            qty_sistem: item?.qty_sistem || 0,
            qty_selisih: item?.qty_selisih || 0,
            selisih_rp: item?.selisih_rp || 0,
        };

        setFormData((prev) => ({
            ...prev,
            total: prev.total + newDetail.selisih_rp,
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
            total: prev.total - detailToRemove.selisih_rp,
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
                catatan: formData.catatan,
                total: formData.total,
                details: formData.details?.map((detail) => ({
                    barang_id: detail.barang_id,
                    harga: detail.harga,
                    qty_sistem: detail.qty_sistem,
                    qty_fisik: detail.qty_fisik,
                    qty_selisih: detail.qty_selisih,
                    selisih_rp: detail.selisih_rp,
                })),
            };

            router.post(route("inventory.stok-opname.store"), payload, {
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
                    <h1 className="pl-2 text-2xl font-bold">Input Stok Opname</h1>
                </div>

                <div className="space-y-0 bg-slate-200 p-2 rounded shadow">

                    <div className="flex flex-col justify-center gap-1 py-1 bg-blue-200 dark:bg-gray-700 rounded-t-lg border-1 border-black dark:border-gray-600">

                        <div className="flex flex-col md:flex-row justify-center gap-2 py-1 px-2">
                            {/* Tanggal Opname */}
                            <div className="flex flex-col md:min-w-48 max-w-full">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Tanggal Opname</label>
                                <input
                                    type="date"
                                    value={formData.tgl}
                                    onChange={(e => setFormData({ ...formData, tgl: e.target.value }))}
                                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Catatan */}
                            <div className="flex flex-col md:min-w-48 max-w-full">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Catatan</label>
                                <input
                                    type="text"
                                    value={formData.catatan}
                                    onChange={(e => setFormData({ ...formData, catatan: e.target.value }))}
                                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                        </div>

                    </div>

                    <div className="flex flex-row justify-center items-center overflow-x-auto">
                        <table className="divide-y divide-gray-200 w-full border border-black dark:border-gray-400">
                            <thead className="bg-gray-500 text-white">
                                <tr>
                                    <th className="p-2 w-10 text-center text-sm font-bold uppercase tracking-wider border border-black dark:border-gray-400">#</th>
                                    <th className="p-2 text-center text-sm font-bold uppercase tracking-wider border border-black dark:border-gray-400">Deskripsi</th>
                                    <th className="p-2 text-center text-sm font-bold uppercase tracking-wider border border-black dark:border-gray-400">Harga</th>
                                    <th className="p-2 text-center text-sm font-bold uppercase tracking-wider border border-black dark:border-gray-400">Fisik</th>
                                    <th className="p-2 text-center text-sm font-bold uppercase tracking-wider border border-black dark:border-gray-400">Sistem</th>
                                    <th className="p-2 text-center text-sm font-bold uppercase tracking-wider border border-black dark:border-gray-400">Selisih</th>
                                    <th className="p-2 text-center text-sm font-bold uppercase tracking-wider border border-black dark:border-gray-400">Jumlah Rp.</th>
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
                                                <td className="px-2 py-1 text-center border border-black dark:border-gray-400">{formatDigit(detail.harga, 2)}</td>
                                                <td className="px-2 py-1 text-center border border-black dark:border-gray-400">{formatDigit(detail.qty_fisik, 2)}</td>
                                                <td className="px-2 py-1 text-center border border-black dark:border-gray-400">{formatDigit(detail.qty_sistem, 2)}</td>
                                                <td className="px-2 py-1 text-center border border-black dark:border-gray-400">{formatDigit(detail.qty_selisih, 2)}</td>
                                                <td className="px-2 py-1 text-right border border-black dark:border-gray-400">{formatDigit(detail.selisih_rp, 2)}</td>
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
                                        <td colSpan={8} className="px-2 py-4 text-center border border-black dark:border-gray-400">
                                            Tidak ada item yang ditambahkan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot className="bg-blue-500 text-md text-white">
                                <tr>
                                    <td colSpan={6} className="px-2 py-2 text-right font-bold border border-black dark:border-gray-400">T O T A L &nbsp; Rp.</td>
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

                            <div className="flex flex-row lg:flex-col items-center lg:items-start justify-center gap-2 lg:gap-0 md:min-w-20 max-w-full bg-gray-100 p-1 rounded-lg">
                                <label className="text-gray-700 dark:text-gray-300 mb-1 pl-1">
                                    Qty Fisik
                                    <span className="text-red-500 italic ml-1">{selectedBarangOption?.data.satuan ? `(${selectedBarangOption?.data.satuan || ''})` : ''}</span>
                                </label>
                                <input
                                    type="number"
                                    placeholder="Qty"
                                    value={item?.qty_fisik || ''}
                                    onChange={(e) => handleQtyFisikChange(e.target.value)}
                                    className={`border border-gray-300 rounded-sm px-2 h-9 py-1 text-center ${!selectedBarangOption ? 'bg-gray-200 cursor-not-allowed' : 'bg-white '}`}
                                    disabled={!selectedBarangOption}
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
