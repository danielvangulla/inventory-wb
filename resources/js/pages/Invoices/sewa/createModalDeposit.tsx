/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/Invoices/sewa/createModalDeposit.tsx
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { TenantBook } from '@/pages/TenantBook/models';
import { Rekening, Sign } from '@/pages/components/pdfModel';
import { monthYear, noInvoiceDeposit, terbilang } from '@/pages/components/functions';
import { formatUang } from '@/pages/components/helpers';
import { ErrorModal } from '@/pages/Foodcourt/components/modal';
import { SewaInvoice } from './model';

interface TenantBookModalProps {
    data: TenantBook[];
    rekening: Rekening[];
    signs: Sign[];
    invoiceNumbers: string[] | null;
    isModalOpen: boolean;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleSubmit: (sewaInvoice: SewaInvoice) => void;
}

const CreateModalDeposit: React.FC<TenantBookModalProps> = ({
    data,
    rekening,
    signs,
    invoiceNumbers,
    isModalOpen,
    setModalOpen,
    handleSubmit,
}) => {
    const [hasMaterai, setHasMaterai] = useState<boolean>(false);

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

    const [sewaInvoice, setSewaInvoice] = useState<SewaInvoice>({
        id: 0,
        uuid: '',
        tenant_book_id: 0,
        rekening_id: 0,
        sign_id: 0,
        no: '',
        tgl: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
        due: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0], // Format: YYYY-MM-DD
        curr: 'IDR',
        keterangan: '',
        jumlah: 0,
        diskon_ket: '',
        diskon_jumlah: 0,
        biaya_ket: '',
        biaya_jumlah: 0,
        subtotal: 0,
        ppn_persen: 0,
        ppn_jumlah: 0,
        materai: 0,
        total: 0,
        terbilang: '',
        is_dp: 2, // 2 for Deposit
    });

    const [periodeOptions, setPeriodeOptions] = useState<any[]>();
    const [selectedPeriode, setSelectedPeriode] = useState<any>();

    useEffect(() => {
        // update due date when tgl changes
        const tglDate = new Date(sewaInvoice.tgl);
        const dueDate = new Date(tglDate);
        dueDate.setDate(tglDate.getDate() + 14); // Set due date to 14 days after tgl
        setSewaInvoice((prev) => ({
            ...prev,
            due: dueDate.toISOString().split('T')[0], // Format: YYYY-MM-DD
        }));
    }, [sewaInvoice.tgl]);

    // Handle tenant selection
    const handleTenantChange = (selectedOption: any) => {
        setSelectedTenant(selectedOption);

        const selectedTenantData = data.find((tenant) => tenant.id === selectedOption.value);
        if (!selectedTenantData) {
            console.error('Selected tenant not found in data');
            return;
        }

        const depositData = Array.isArray(selectedTenantData.payments?.deposits) ? selectedTenantData.payments?.deposits : [];

        const periodeDataOptions = depositData?.map((v) => ({
            label: `${v.ket} (${monthYear(new Date(v.tgl))})`,
            value: v.tgl,
            data: v,
        }));
        console.log({depositData, periodeDataOptions});

        setPeriodeOptions(periodeDataOptions);

        setSewaInvoice({
            ...sewaInvoice,
            tenant_book_id: selectedTenantData.id,
            no: noInvoiceDeposit(invoiceNumbers) ?? '',
            rekening_id: 0,
            sign_id: 0,
        });
    };

    // Handle rekening selection
    const handleRekeningChange = (selectedOption: any) => {
        setSelectedRekening(selectedOption);

        const selectedRekeningData = rekening.find((rek) => rek.id === selectedOption?.value);
        if (!selectedRekeningData) {
            console.error('Selected rekening not found in data');
            return;
        }

        setSewaInvoice({
            ...sewaInvoice,
            rekening_id: selectedRekeningData.id,
        });
    };

    const handlePeriodeChange = (selectedOption: any) => {
        setSelectedPeriode(selectedOption);

        const selectedData = selectedOption?.data;

        if (selectedOption && selectedData) {
            const keterangan = selectedData.ket || '';
            const jumlah = +selectedData.jumlah || 0;
            const ppn_persen = sewaInvoice.ppn_persen || 0; // PPN 0 for deposit
            const ppn_jumlah = Math.round(ppn_persen * jumlah / 100); // Calculate PPN

            let materai = 0;
            let total = Math.round(jumlah + ppn_jumlah); // Total after PPN

            if (total >= 5000000) {
                setHasMaterai(true);
                materai = 10000; // Set materai fee
                total += 10000; // Add materai fee if total is above 5 million
            } else {
                setHasMaterai(false);
            }

            const updated = {
                ...sewaInvoice,
                keterangan,
                jumlah,
                ppn_persen,
                ppn_jumlah,
                materai,
                total,
                terbilang: terbilang(total) + ' Rupiah',
            };

            setSewaInvoice((prev) => ({ ...prev, ...updated }));
        }
    }

    useEffect(() => {
        let materai = 0;
        if (hasMaterai) {
            // If hasMaterai is true, set materai to 10000
            materai = 10000;
        }

        const total =  Math.round(sewaInvoice.jumlah + sewaInvoice.ppn_jumlah + materai);

        setSewaInvoice(() => ({
            ...sewaInvoice,
            materai,
            total,
            terbilang: terbilang(total) + ' Rupiah',
        }));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasMaterai]);

    const handleSignChange = (selectedOption: any) => {
        setSelectedSign(selectedOption);
        setSewaInvoice((prev) => ({
            ...prev,
            sign_id: selectedOption.value,
        }));
    };

    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);

    const handlePresubmit = () => {
        if (!selectedTenant) {
            setErrorMessage('Silakan pilih tenant terlebih dahulu.');
            setIsErrorModalOpen(true); // Show error modal
            return;
        }

        if (!selectedRekening) {
            setErrorMessage('Silakan pilih rekening terlebih dahulu.');
            setIsErrorModalOpen(true);
            return;
        }

        if (!sewaInvoice.tgl) {
            setErrorMessage('Silakan pilih tanggal invoice.');
            setIsErrorModalOpen(true);
            return;
        }

        if (!sewaInvoice.due) {
            setErrorMessage('Silakan pilih tanggal jatuh tempo.');
            setIsErrorModalOpen(true);
            return;
        }

        if (!sewaInvoice.no) {
            setErrorMessage('Silakan isi nomor invoice.');
            setIsErrorModalOpen(true);
            return;
        }

        if (!selectedPeriode) {
            setErrorMessage('Silakan pilih periode tagihan.');
            setIsErrorModalOpen(true);
            return;
        }

        if (!sewaInvoice.keterangan) {
            setErrorMessage('Silakan isi keterangan.');
            setIsErrorModalOpen(true);
            return;
        }

        if (!selectedSign) {
            setErrorMessage('Silakan pilih tanda tangan.');
            setIsErrorModalOpen(true);
            return;
        }

        handleSubmit(sewaInvoice);
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
                        Create Invoice - Deposit
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
                            />
                        </div>

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
                                value={sewaInvoice.tgl}
                                onChange={(e) => setSewaInvoice({ ...sewaInvoice, tgl: e.target.value })}
                                className="w-full rounded-md border bg-white border-gray-300 p-2"
                            />
                        </div>

                        <div className="flex flex-col bg-blue-50 p-1 rounded-lg">
                            <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                                Jatuh Tempo
                            </label>
                            <input
                                type="date"
                                value={sewaInvoice.due}
                                onChange={(e) => setSewaInvoice({ ...sewaInvoice, due: e.target.value })}
                                className="w-full rounded-md border bg-white border-gray-300 p-2"
                            />
                        </div>

                        <div className="flex flex-col bg-blue-50 p-1 rounded-lg">
                            <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                                Nomor Invoice
                            </label>
                            <input
                                type="text"
                                value={sewaInvoice.no}
                                onChange={(e) => setSewaInvoice({ ...sewaInvoice, no: e.target.value })}
                                className="w-full rounded-md border bg-white border-gray-300 p-2 text-center"
                            />
                        </div>

                        <div className="flex flex-col bg-blue-50 p-1 rounded-lg">
                            <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                                Periode Tagihan
                            </label>
                            <Select
                                options={periodeOptions}
                                value={selectedPeriode}
                                onChange={handlePeriodeChange}
                                getOptionLabel={(e) => e.label}
                                getOptionValue={(e) => e.value}
                                placeholder="Pilih Periode"
                                className="react-select-container"
                                classNamePrefix="react-select"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 mb-4">
                        <div className="flex flex-col bg-blue-50 p-1 rounded-lg">
                            <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                                Keterangan
                            </label>
                            <input
                                type="text"
                                value={sewaInvoice.keterangan}
                                onChange={(e) => setSewaInvoice({ ...sewaInvoice, keterangan: e.target.value })}
                                className="w-full rounded-md border bg-white border-gray-300 p-2"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-4">
                        <div className="flex flex-col bg-blue-300 p-1 rounded-lg">
                            <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                                Jumlah
                            </label>
                            <input
                                type="text"
                                value={formatUang(sewaInvoice.jumlah ?? 0)}
                                onChange={() => { }}
                                className="w-full rounded-md border border-gray-300 p-2 bg-gray-200 cursor-not-allowed text-center"
                                disabled={true}
                            />
                        </div>

                        <div className="flex flex-col bg-blue-300 p-1 rounded-lg">
                            <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                                PPN ({sewaInvoice.ppn_persen}%)
                            </label>
                            <input
                                type="text"
                                value={formatUang(sewaInvoice.ppn_jumlah ?? 0)}
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
                                value={formatUang(sewaInvoice.materai ?? 0)}
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
                                value={formatUang(sewaInvoice.total ?? 0)}
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
                                    value={sewaInvoice.terbilang}
                                    onChange={(e) => setSewaInvoice({ ...sewaInvoice, terbilang: e.target.value })}
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
                            onClick={() => setModalOpen(false)}
                        >
                            Batal
                        </button>
                    </div>

                    {/* Error Modal */}
                    <ErrorModal
                        isModalOpen={isErrorModalOpen}
                        message={errorMessage}
                        closeModal={closeErrorModal}
                    />

                </div>

            </div >
        )
    );
};

export default CreateModalDeposit;
