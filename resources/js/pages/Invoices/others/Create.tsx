/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/Invoices/sewa/createModal.tsx
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { TenantBook } from '@/pages/TenantBook/models';
import { InvoiceOthers, InvoiceOtherType } from './model';
import { Rekening, Sign } from '@/pages/components/pdfModel';
import { terbilang } from '@/pages/components/functions';
import { formatUang } from '@/pages/components/helpers';
import { ErrorModal } from '@/pages/Foodcourt/components/modal';
import { PlusCircle, Trash2 } from 'lucide-react';
import AddDetail from './AddDetail';

interface TenantBookModalProps {
    data: TenantBook[];
    rekening: Rekening[];
    signs: Sign[];
    tipe: InvoiceOtherType[];
    invoiceNumbers: string[] | null;
    isModalOpen: boolean;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleSubmit: (invoiceOthers: InvoiceOthers) => void;
}

const CreateOther: React.FC<TenantBookModalProps> = ({
    data,
    rekening,
    signs,
    tipe,
    isModalOpen,
    setModalOpen,
    handleSubmit,
}) => {
    const [hasMaterai, setHasMaterai] = useState<boolean>(false);
    const [hasPPN, setHasPPN] = useState<boolean>(true);

    const [selectedTenant, setSelectedTenant] = useState<any>(null);
    const tenantOptions = data.map((tenant) => ({
        label: tenant.nama_toko,
        value: tenant.id,
    }));

    const [selectedRekening, setSelectedRekening] = useState<any>(null);
    const rekeningOptions = rekening.map((rek) => ({
        label: `${rek.nama} - ${rek.norek} (${rek.cabang})`,
        value: rek.id,
    }));

    const [selectedSign, setSelectedSign] = useState<any>(null);
    const signOptions = signs.map((sign) => ({
        label: `${sign.nama} - ${sign.jabatan}`,
        value: sign.id,
    }));

    const [selectedTipe, setSelectedTipe] = useState<any>(null);
    const tipeOptions = tipe.map((t) => ({
        label: t.tipe,
        value: t.id,
    }));

    const initialInvoice = {
        id: 0,
        invoice_other_type_id: 0,
        tenant_book_id: 0,
        tenant_nama: '',
        rekening_id: 0,
        sign_id: 0,
        no: '',
        tgl: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
        due: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0], // Format: YYYY-MM-DD
        curr: 'IDR',
        keterangan: '',
        jumlah: 0,
        subtotal: 0,
        ppn_persen: 11,
        ppn_jumlah: 0,
        materai: 0,
        total: 0,
        terbilang: '',
        details: [],
    }

    const [invoiceOthers, setInvoiceOthers] = useState<InvoiceOthers>(initialInvoice);

    useEffect(() => {
        // update due date when tgl changes
        const tglDate = new Date(invoiceOthers.tgl);
        const dueDate = new Date(tglDate);
        dueDate.setDate(tglDate.getDate() + 14); // Set due date to 14 days after tgl
        setInvoiceOthers((prev) => ({
            ...prev,
            due: dueDate.toISOString().split('T')[0], // Format: YYYY-MM-DD
        }));
    }, [invoiceOthers.tgl]);

    const [hasSelectedTenant, setHasSelectedTenant] = useState<boolean>(false);

    // Handle tenant selection
    const handleTenantChange = (selectedOption: any) => {
        setSelectedTenant(selectedOption);
        if (!selectedOption) {
            setInvoiceOthers((prev) => ({
                ...prev,
                tenant_book_id: 0,
                tenant_nama: '',
            }));

            setHasSelectedTenant(false);
            return;
        }

        const selectedTenantData = data.find((tenant) => tenant.id === selectedOption.value);
        if (!selectedTenantData) {
            console.error('Selected tenant not found in data');
            return;
        }

        setHasSelectedTenant(true);

        setInvoiceOthers({
            ...invoiceOthers,
            tenant_book_id: selectedTenantData.id,
            tenant_nama: selectedTenantData.nama_toko || '',
            rekening_id: 0,
            sign_id: 0,
        });
    };

    const handleTypeChange = (selectedOption: any) => {
        setSelectedTipe(selectedOption);
        setInvoiceOthers((prev) => ({
            ...prev,
            invoice_other_type_id: selectedOption.value,
        }));
    };

    // Handle rekening selection
    const handleRekeningChange = (selectedOption: any) => {
        setSelectedRekening(selectedOption);

        const selectedRekeningData = rekening.find((rek) => rek.id === selectedOption?.value);
        if (!selectedRekeningData) {
            console.error('Selected rekening not found in data');
            return;
        }

        setInvoiceOthers({
            ...invoiceOthers,
            rekening_id: selectedRekeningData.id,
        });
    };

    useEffect(() => {
        const subtotal = invoiceOthers.jumlah || 0;
        const ppn_persen = hasPPN ? 11 : 0;
        const ppn_jumlah = subtotal * (ppn_persen / 100);
        const materai = hasMaterai ? 10000 : 0;
        const total = Math.round(subtotal + ppn_jumlah + materai);

        setInvoiceOthers((prev) => ({
            ...prev,
            ppn_persen,
            ppn_jumlah,
            materai,
            total,
            terbilang: terbilang(total) + ' Rupiah',
        }));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasMaterai, hasPPN]);

    const handleSignChange = (selectedOption: any) => {
        setSelectedSign(selectedOption);
        setInvoiceOthers((prev) => ({
            ...prev,
            sign_id: selectedOption.value,
        }));
    };

    const [isOpenModalDetail, setIsOpenModalDetail] = useState<boolean>(false);

    const handleAddDetail = () => {
        setIsOpenModalDetail(true);
    };

    const submitDetail = (data: any) => {
        const details = [...invoiceOthers.details, data];

        const jumlah = details.reduce((acc, item) => acc + (item.jumlah || 0), 0);
        const subtotal = Math.round(jumlah);
        const ppn_persen = hasPPN ? 11 : 0;
        const ppn_jumlah = jumlah * ppn_persen / 100;

        let materai = hasMaterai ? 10000 : 0;
        if ((jumlah + ppn_jumlah) < 5000000) {
            materai = 0;
            setHasMaterai(false);
        } else {
            materai = 10000;
            setHasMaterai(true);
        }

        const total = Math.round(jumlah + ppn_jumlah + materai);

        setInvoiceOthers((prev) => ({
            ...prev,
            details,
            jumlah,
            subtotal,
            ppn_persen,
            ppn_jumlah,
            materai,
            total,
            terbilang: terbilang(total) + ' Rupiah',
        }));

        setIsOpenModalDetail(false);
    };

    const deleteDetail = (index: number) => {
        const details = [...invoiceOthers.details];
        details.splice(index, 1);

        const jumlah = details.reduce((acc, item) => acc + (item.jumlah || 0), 0);
        const subtotal = Math.round(jumlah);
        const ppn_persen = hasPPN ? 11 : 0;
        const ppn_jumlah = jumlah * ppn_persen / 100;

        let materai = hasMaterai ? 10000 : 0;
        if ((jumlah + ppn_jumlah) < 50000) {
            materai = 0;
            setHasMaterai(false);
        } else {
            materai = 10000;
            setHasMaterai(true);
        }

        const total = Math.round(jumlah + ppn_jumlah + materai);

        setInvoiceOthers((prev) => ({
            ...prev,
            details,
            jumlah,
            subtotal,
            ppn_persen,
            ppn_jumlah,
            materai,
            total,
            terbilang: terbilang(total) + ' Rupiah',
        }));

    };

    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);

    const handlePresubmit = () => {
        if (!selectedTenant && invoiceOthers.tenant_nama.trim() === '') {
            setErrorMessage('Silakan isi tenant terlebih dahulu.');
            setIsErrorModalOpen(true); // Show error modal
            return;
        }

        if (!selectedRekening) {
            setErrorMessage('Silakan pilih rekening terlebih dahulu.');
            setIsErrorModalOpen(true);
            return;
        }

        if (!invoiceOthers.tgl) {
            setErrorMessage('Silakan pilih tanggal invoice.');
            setIsErrorModalOpen(true);
            return;
        }

        if (!invoiceOthers.due) {
            setErrorMessage('Silakan pilih tanggal jatuh tempo.');
            setIsErrorModalOpen(true);
            return;
        }

        if (!invoiceOthers.no) {
            setErrorMessage('Silakan isi nomor invoice.');
            setIsErrorModalOpen(true);
            return;
        }

        if (!invoiceOthers.total || invoiceOthers.total <= 0) {
            setErrorMessage('Silakan isi detail invoice.');
            setIsErrorModalOpen(true);
            return;
        }

        if (!selectedSign) {
            setErrorMessage('Silakan pilih tanda tangan.');
            setIsErrorModalOpen(true);
            return;
        }

        handleSubmit(invoiceOthers);
    };

    const handleCloseModal = () => {
        setSelectedTenant(null);
        setSelectedRekening(null);
        setSelectedSign(null);
        setInvoiceOthers(initialInvoice);
        setModalOpen(false);
    };

    const closeErrorModal = () => {
        setIsErrorModalOpen(false);
        setErrorMessage('');
    };

    return (
        isModalOpen && (
            <div className="flex justify-center bg-black/70 fixed inset-0 z-30 p-2">
                <div className="bg-white px-6 py-4 rounded shadow-md w-full md:w-1/2 overflow-y-auto text-sm">
                    <h3 className="text-lg text-center font-semibold mb-4 p-1 bg-blue-200 rounded-lg">
                        Create Invoice - Others
                    </h3>

                    <hr className="mb-4" />

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-4">
                        <div className="flex flex-col bg-blue-50 p-1 rounded-lg">
                            <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                                Pilih Tenant
                            </label>
                            <Select
                                options={tenantOptions} // options for autocomplete
                                value={selectedTenant} // current selected tenant
                                onChange={handleTenantChange} // onChange handler
                                getOptionLabel={(e) => e.label} // specify what to display
                                getOptionValue={(e) => e.value} // specify value to track
                                placeholder="Cari Tenant"
                                className="react-select-container"
                                classNamePrefix="react-select"
                                isClearable={true}
                            />
                        </div>

                        <div className="flex flex-col bg-blue-50 p-1 rounded-lg">
                            <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                                Pilih Tipe Invoice
                            </label>
                            <Select
                                options={tipeOptions} // options for autocomplete
                                value={selectedTipe} // current selected tipe
                                onChange={handleTypeChange} // onChange handler
                                getOptionLabel={(e) => e.label} // specify what to display
                                getOptionValue={(e) => e.value} // specify value to track
                                placeholder="Cari Tipe Invoice"
                                className="react-select-container"
                                classNamePrefix="react-select"
                            />
                        </div>

                        {!hasSelectedTenant && (
                            <div className="flex flex-col bg-blue-50 p-1 rounded-lg">
                                <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                                    Nama Tenant / Perusahaan
                                </label>
                                <input
                                    type="text"
                                    value={invoiceOthers.tenant_nama}
                                    onChange={(e) => setInvoiceOthers({ ...invoiceOthers, tenant_nama: e.target.value })}
                                    className="w-full rounded-md border bg-white border-gray-300 p-2"
                                />
                            </div>
                        )}

                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-2">
                        <div className="flex flex-col bg-blue-50 p-1 rounded-lg">
                            <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                                Pilih Rekening Bank
                            </label>
                            <Select
                                options={rekeningOptions} // options for rekening
                                value={selectedRekening} // current selected rekening
                                onChange={handleRekeningChange} // onChange handler
                                getOptionLabel={(e) => e.label} // specify what to display
                                getOptionValue={(e) => e.value} // specify value to track
                                placeholder="Pilih Rekening"
                                className="react-select-container"
                                classNamePrefix="react-select"
                            />
                        </div>

                        <div className="flex flex-col bg-blue-50 p-1 rounded-lg">
                            <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                                Tanggal Invoice
                            </label>
                            <input
                                type="date"
                                value={invoiceOthers.tgl}
                                onChange={(e) => setInvoiceOthers({ ...invoiceOthers, tgl: e.target.value })}
                                className="w-full rounded-md border bg-white border-gray-300 p-2"
                            />
                        </div>

                        <div className="flex flex-col bg-blue-50 p-1 rounded-lg">
                            <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                                Jatuh Tempo
                            </label>
                            <input
                                type="date"
                                value={invoiceOthers.due}
                                onChange={(e) => setInvoiceOthers({ ...invoiceOthers, due: e.target.value })}
                                className="w-full rounded-md border bg-white border-gray-300 p-2"
                            />
                        </div>

                        <div className="flex flex-col bg-blue-50 p-1 rounded-lg">
                            <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                                Nomor Invoice
                            </label>
                            <input
                                type="text"
                                value={invoiceOthers.no}
                                onChange={(e) => setInvoiceOthers({ ...invoiceOthers, no: e.target.value })}
                                className="w-full rounded-md border bg-white border-gray-300 p-2 text-center"
                            />
                        </div>
                    </div>

                    <hr className='mt-4 mb-2' />

                    <h4 className="text-lg font-bold px-2">Detail Invoice</h4>

                    <div className="overflow-x-auto py-2 bg-blue-300 rounded-lg p-1">
                        <table className="min-w-full divide-y divide-gray-200">
                            {invoiceOthers.details?.length > 0 && <thead className="bg-gray-300 font">
                                <tr>
                                    <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider border-x">
                                        No.
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider border-x">
                                        Keterangan
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider border-x">
                                        Jumlah
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider border-x">

                                    </th>
                                </tr>
                            </thead>}
                            <tbody className="bg-white divide-y divide-gray-200">
                                {invoiceOthers.details?.map((v, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 border-x text-center">
                                            {index + 1}.
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 border-x text-left w-full">
                                            {v.keterangan}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 border-x text-right w-fit min-w-36">
                                            {formatUang(v.jumlah)}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 border-x text-right w-fit">
                                            <button
                                                title='Hapus'
                                                onClick={() => deleteDetail(index)}
                                                className="text-red-700 hover:text-red-400 font-bold"
                                            >
                                                <Trash2 width={18} className='cursor-pointer' />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* tombol tambah data */}
                        <div className="flex justify-center pt-2 text-xs">
                            <button
                                onClick={handleAddDetail}
                                className="bg-green-700 hover:bg-green-600 cursor-pointer text-white p-1 rounded-md"
                            >
                                <div className='flex items-center gap-1 px-1'>
                                    <PlusCircle /> Tambah Data
                                </div>
                            </button>
                        </div>
                    </div>

                    <hr className='my-4' />

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 my-2">
                        <div className="flex flex-col bg-blue-300 p-1 rounded-lg">
                            <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                                Jumlah
                            </label>
                            <input
                                type="text"
                                value={formatUang(invoiceOthers.subtotal ?? 0)}
                                onChange={() => { }}
                                className="w-full rounded-md border border-gray-300 p-2 bg-gray-200 cursor-not-allowed text-center"
                                disabled={true}
                            />
                        </div>

                        <div className="flex flex-col bg-blue-300 p-1 rounded-lg">
                            <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                                <input
                                    type="checkbox"
                                    checked={hasPPN}
                                    onChange={(st) => setHasPPN(st.target.checked)}
                                    className="mr-1"
                                />
                                PPN ({invoiceOthers.ppn_persen}%)
                            </label>
                            <input
                                type="text"
                                value={formatUang(invoiceOthers.ppn_jumlah ?? 0)}
                                onChange={() => { }}
                                className="w-full rounded-md border border-gray-300 p-2 bg-gray-200 cursor-not-allowed text-center"
                                disabled={true}
                            />
                        </div>

                        <div className="flex flex-col bg-blue-300 p-1 rounded-lg">
                            <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={hasMaterai}
                                    onChange={(st) => setHasMaterai(st.target.checked)}
                                    className="mr-1"
                                />
                                Biaya Materai
                            </label>
                            <input
                                type="text"
                                value={formatUang(invoiceOthers.materai ?? 0)}
                                onChange={() => { }}
                                className="w-full rounded-md border border-gray-300 p-2 bg-gray-200 cursor-not-allowed text-center"
                                disabled={true}
                            />
                        </div>

                        <div className="flex flex-col bg-blue-300 p-1 rounded-lg font-bold">
                            <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 text-center">
                                TOTAL TAGIHAN
                            </label>
                            <input
                                type="text"
                                value={formatUang(invoiceOthers.total ?? 0)}
                                onChange={() => { }}
                                className="w-full rounded-md border border-gray-300 p-2 bg-gray-200 cursor-not-allowed text-center"
                                disabled={true}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-1 md:grid-cols-1">

                        <div className="grid grid-cols-1 gap-4 mb-2">
                            <div className="flex flex-col">
                                {/* pakai textarea untuk terbilang */}
                                <textarea
                                    value={invoiceOthers.terbilang}
                                    onChange={(e) => setInvoiceOthers({ ...invoiceOthers, terbilang: e.target.value })}
                                    className="w-full rounded-md border border-gray-300 p-2 bg-gray-200 cursor-not-allowed resize-none"
                                    disabled={true}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col bg-blue-50 p-1 rounded-lg">
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
                                className="react-select-container"
                                classNamePrefix="react-select"
                                menuPlacement="top"
                            />
                        </div>

                    </div>

                    <div className="flex justify-end my-4">
                        <button
                            type="button"
                            className="bg-blue-600 hover:bg-blue-800 text-white py-2 px-4 rounded mr-2 cursor-pointer"
                            onClick={() => handlePresubmit()}
                        >
                            Buat Invoice
                        </button>
                        <button
                            type="button"
                            className="bg-gray-300 hover:bg-gray-500 text-black py-2 px-4 rounded cursor-pointer"
                            onClick={() => handleCloseModal()}
                        >
                            Batal
                        </button>
                    </div>

                </div>

                {isOpenModalDetail && (
                    <AddDetail
                        setModalOpen={setIsOpenModalDetail}
                        handleSubmit={submitDetail}
                    />
                )}

                <ErrorModal
                    isModalOpen={isErrorModalOpen}
                    message={errorMessage}
                    closeModal={closeErrorModal}
                />

            </div >
        )
    );
};

export default CreateOther;
