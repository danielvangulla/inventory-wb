/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/Invoices/sewa/previewKwitansi.tsx
import React, { useState } from "react";
import { Button } from "@headlessui/react";
import Select from "react-select";
import { PrinterIcon } from "lucide-react";
import { jsPDF } from "jspdf";
import { formatUang } from "@/pages/components/helpers";
import { City, Kuitansi, Sign } from "@/pages/components/pdfModel";
import { Body, Header, Signature } from "@/pages/components/pdfKuitansi";
import { InvoiceOthers } from "../Invoices/others/model";

interface PreviewKwitansiProps {
    username: string;
    kuitansi: Kuitansi;
    setKuitansi: (kuitansi: Kuitansi) => void;
    pdfHeader: string[];
    signs: Sign[];
    cities: City[];
    setLoading: (loading: boolean) => void;
    setSuccessMessage: (message: string) => void;
    setIsSuccessModalOpen: (isOpen: boolean) => void;
    setErrorMessage: (message: string) => void;
    setIsErrorModalOpen: (isOpen: boolean) => void;
    closeModal: () => void;
}

const PreviewKwitansi: React.FC<PreviewKwitansiProps> = ({
    username,
    kuitansi,
    setKuitansi,
    pdfHeader,
    signs,
    cities,
    setLoading,
    setSuccessMessage,
    setIsSuccessModalOpen,
    setErrorMessage,
    setIsErrorModalOpen,
    closeModal,
}) => {
    console.log("Rendering PreviewKwitansi with kuitansi:", kuitansi);

    const canEdit = username === 'Admin' || username === 'Sylvia';

    const signOptions = signs.map((sign) => ({
        label: `${sign.nama} - ${sign.jabatan}`,
        value: sign.id,
    }));

    const oldSign = signOptions.find((sign) => sign.value === kuitansi.sign_id);
    const [selectedSign, setSelectedSign] = useState<any>(oldSign || null);

    const handleSignChange = (selectedOption: any) => {
        setSelectedSign(selectedOption);

        setKuitansi({
            ...kuitansi,
            sign_id: selectedOption.value,
        });
    };

    const kotaOptions = cities.map((city) => ({
        label: city.nama,
        value: city.id,
    }));

    const oldKota = kotaOptions.find((kota) => kota.label === kuitansi.kota);
    const [selectedKota, setSelectedKota] = useState<any>(oldKota || null);

    const handleKotaChange = (selectedOption: any) => {
        setSelectedKota(selectedOption);

        setKuitansi({
            ...kuitansi,
            kota: selectedOption.label,
        });
    };

    const namaPerusahaan = kuitansi.tenant_book?.perusahaan || "";

    const namaToko =
        kuitansi.tenant_book?.nama_toko ||
        (kuitansi.invoice && "tenant_nama" in kuitansi.invoice
            ? (kuitansi.invoice as InvoiceOthers).tenant_nama
            : "") ||
        "";

    const slash = namaPerusahaan && namaPerusahaan !== "" ? " / " : "";

    const namaTokoPerusahaan = `${namaPerusahaan} ${slash} ${namaToko}`;

    const simpanKuitansi = () => {
        if (!kuitansi.tgl) {
            setErrorMessage("Tanggal kuitansi tidak boleh kosong.");
            setIsErrorModalOpen(true);
            return;
        }

        if (!kuitansi.no) {
            setErrorMessage("Nomor kuitansi tidak boleh kosong.");
            setIsErrorModalOpen(true);
            return;
        }

        if (!kuitansi.keterangan) {
            setErrorMessage("Keterangan kuitansi tidak boleh kosong.");
            setIsErrorModalOpen(true);
            return;
        }

        if (!kuitansi.sign_id) {
            setErrorMessage("Tanda tangan kuitansi tidak boleh kosong.");
            setIsErrorModalOpen(true);
            return;
        }

        const payload = {
            tgl: kuitansi.tgl,
            no: kuitansi.no,
            keterangan: kuitansi.keterangan,
            total: kuitansi.total,
            terbilang: kuitansi.terbilang,
            jenis: kuitansi.jenis,
            tenant_book_id: kuitansi.tenant_book?.id || 0,
            invoice_id: kuitansi.invoice_id,
            invoice_no: kuitansi.invoice_no,
            sign_id: kuitansi.sign_id,
            kota: selectedKota.label,
        };

        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (!csrfToken) {
            setErrorMessage("Token Error. Silakan refresh halaman..");
            setIsErrorModalOpen(true);
            return;
        }

        fetch('/kuitansi', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken || '',
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify(payload),
        })
            .then(response => response.json())
            .then(data => {
                setLoading(false);
                setSuccessMessage(data.msg || "Kuitansi berhasil disimpan.");
                setIsSuccessModalOpen(true);
                downloadPDF();
                closeModal();
            })
            .catch(error => {
                setLoading(false);
                setErrorMessage(error.msg || "Terjadi kesalahan saat menyimpan kuitansi.");
                setIsErrorModalOpen(true);
            });
    };

    const downloadPDF = () => {
        const doc = new jsPDF({
            unit: 'mm', // Unit for dimensions
            format: [148, 210], // Custom format for half of A4
            orientation: 'landscape', // Orientation of the PDF
        });

        Header({ doc, pdfHeader });
        Body({ doc, kuitansi });
        Signature({ doc, kuitansi, signs });

        doc.save(`Kuitansi_${namaToko}_${kuitansi.no}.pdf`);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">

            <div className="bg-white p-2 rounded shadow-md w-full md:w-2/3 max-w-2xl mx-2">
                <div className='flex items-center bg-blue-100 text-black px-1 py-2 rounded-t text-xs'>
                    <div className="flex items-center gap-2 border-b border-gray-500 w-full my-1 mx-4">
                        <div className="flex-1 text-center pb-2 text-lg">
                            <span className='font-bold'>KUITANSI</span>
                        </div>
                    </div>

                </div>

                <div className='flex justify-end bg-blue-100 text-black pr-10 pb-2 rounded-t text-sm'>
                    <span>
                        <span className="mr-2">Tanggal :</span>
                        <b>
                            {/* buat input date */}
                            <input
                                type="date"
                                value={kuitansi.tgl}
                                onChange={(e) => setKuitansi({ ...kuitansi, tgl: e.target.value })}
                                className={`border border-gray-300 rounded-md p-1 w-40 ${canEdit ? 'bg-white' : 'bg-gray-200 cursor-not-allowed'}`}
                                disabled={!canEdit}
                            />
                        </b>
                    </span>
                </div>

                <div className='flex justify-end bg-blue-100 text-black pr-10 pb-2 rounded-t text-sm'>
                    <span>
                        <span className="mr-2">Nomor :</span>
                        <b>
                            {/* buat input text */}
                            <input
                                type="text"
                                value={kuitansi.no}
                                onChange={(e) => setKuitansi({ ...kuitansi, no: e.target.value })}
                                className={`border border-gray-300 rounded-md p-1 w-40 ${canEdit ? 'bg-white' : 'bg-gray-200 cursor-not-allowed'}`}
                                placeholder="Nomor Kuitansi"
                                disabled={!canEdit}
                            />
                        </b>
                    </span>
                </div>

                <div className='flex flex-col justify-center items-center bg-blue-100 text-black pb-2 px-2 lg:px-12 text-sm font-mono'>
                    <table className="min-w-full border-collapse">
                        <tbody className="">
                            <tr>
                                <td className="px-2 py-1 text-left whitespace-nowrap align-top">Telah diterima dari</td>
                                <td className="px-2 py-1 text-left whitespace-nowrap align-top">:</td>
                                <td className="px-2 py-1 text-left w-full font-bold align-top">{namaTokoPerusahaan}</td>
                            </tr>
                            <tr>
                                <td className="px-2 py-1 text-left whitespace-nowrap align-top">Uang Sebesar</td>
                                <td className="px-2 py-1 text-left whitespace-nowrap align-top">:</td>
                                <td className="px-2 py-1 text-left w-full font-bold align-top">Rp. {formatUang(kuitansi.total)}</td>
                            </tr>
                            <tr>
                                <td className="px-2 py-1 text-left whitespace-nowrap align-top">Terbilang</td>
                                <td className="px-2 py-1 text-left whitespace-nowrap align-top">:</td>
                                <td className="px-2 py-1 text-left w-full align-top">{kuitansi.terbilang}</td>
                            </tr>
                            <tr>
                                <td className="px-2 py-1 text-left whitespace-nowrap align-top">Untuk Pembayaran</td>
                                <td className="px-2 py-1 text-left whitespace-nowrap align-top">:</td>
                                <td className="px-2 py-1 text-left w-full align-top">
                                    <textarea
                                        value={kuitansi.keterangan}
                                        onChange={(e) => setKuitansi({ ...kuitansi, keterangan: e.target.value })}
                                        placeholder="Masukkan keterangan pembayaran"
                                        className={`w-full h-20 p-2 border border-gray-300 rounded-md resize-none ${canEdit ? 'bg-white' : 'bg-gray-200 cursor-not-allowed'}`}
                                        disabled={!canEdit}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="flex flex-col my-2">
                        <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                            Dicetak di
                        </label>
                        <Select
                            options={kotaOptions} // options for rekening
                            value={selectedKota} // current selected rekening
                            onChange={handleKotaChange} // onChange handler
                            getOptionLabel={(e) => e.label} // specify what to display
                            getOptionValue={(e) => e.value} // specify value to track
                            placeholder="Pilih Kota"
                            classNamePrefix="react-select"
                            menuPlacement="top"
                            className={`react-select-container w-96`}
                            isDisabled={!canEdit}
                        />
                    </div>

                    <div className="flex flex-col my-2">
                        <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                            Tandatangan oleh
                        </label>
                        <Select
                            options={signOptions} // options for rekening
                            value={selectedSign} // current selected rekening
                            onChange={handleSignChange} // onChange handler
                            getOptionLabel={(e) => e.label} // specify what to display
                            getOptionValue={(e) => e.value} // specify value to track
                            placeholder="Pilih TTD"
                            classNamePrefix="react-select"
                            menuPlacement="top"
                            className={`react-select-container w-96`}
                            isDisabled={!canEdit}
                        />
                    </div>
                </div>

                <div className="flex justify-center gap-4 mt-2">
                    <Button
                        onClick={simpanKuitansi}
                        className="bg-blue-700 hover:bg-blue-400 text-white py-2 px-4 rounded-md flex items-center gap-2 cursor-pointer"
                    >
                        <PrinterIcon className="w-4 h-4" />
                        <span>{`${canEdit ? "Simpan dan Download" : "Download"}`}</span>
                    </Button>

                    <Button
                        className="bg-gray-300 hover:bg-gray-500 text-black py-2 px-4 rounded-md cursor-pointer"
                        onClick={closeModal}
                    >
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default PreviewKwitansi;
