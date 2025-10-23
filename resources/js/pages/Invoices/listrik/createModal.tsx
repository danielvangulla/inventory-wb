/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/Invoices/listrik/createModal.tsx
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { TenantBook } from '@/pages/TenantBook/models';
import { Rekening, Sign } from '@/pages/components/pdfModel';
import { monthYear, noInvoiceListrik, terbilang } from '@/pages/components/functions';
import { formatDigit, formatUang } from '@/pages/components/helpers';
import { ErrorModal } from '@/pages/Foodcourt/components/modal';
import { ListrikInvoice } from './model';

interface TenantBookModalProps {
    data: TenantBook[];
    rekening: Rekening[];
    signs: Sign[];
    invoiceNumbers: string[] | null;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleSubmit: (listrikInvoice: ListrikInvoice) => void;
}

const CreateModal: React.FC<TenantBookModalProps> = ({
    data,
    rekening,
    signs,
    invoiceNumbers,
    setModalOpen,
    handleSubmit,
}) => {
    const [hasMaterai, setHasMaterai] = useState<boolean>(false);
    const [hasGenset, setHasGenset] = useState<boolean>(true);

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

    const [listrikInvoice, setListrikInvoice] = useState<ListrikInvoice>({
        id: 0,
        meter_listrik_id: 0,
        rekening_id: 0,
        sign_id: 0,
        uuid: '',
        keterangan: `Pemakaian Listrik ${monthYear(new Date())}.`,
        no: '',
        tgl: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
        // set default today + 14 with format YYYY-MM-DD
        due: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0],
        curr: 'IDR',
        pemakaian: 0,
        tarif: 1444.70,
        subtotal: 0,
        ppj_persen: 10,
        ppj_jumlah: 0,
        genset_persen: 5,
        genset_jumlah: 0,
        biaya_admin: 0,
        biaya_lain: 0,
        denda: 0,
        selisih_bayar: 0,
        total: 0,
        ppn_persen: 11, // Assuming PPN is fixed at 11%
        ppn_jumlah: 0,
        materai: 0,
        tagihan: 0,
        terbilang: '',
    });

    useEffect(() => {
        const tglDate = new Date(listrikInvoice.tgl);
        const dueDate = new Date(tglDate);
        dueDate.setDate(tglDate.getDate() + 14);

        setListrikInvoice((prev) => ({
            ...prev,
            due: dueDate.toISOString().split('T')[0], // Format: YYYY-MM-DD
        }));
    }, [listrikInvoice.tgl]);

    const [meterListrikOptions, setMeterListrikOptions] = useState<any[]>();
    const [selectedMeterListrik, setSelectedMeterListrik] = useState<any>();

    // Handle tenant selection
    const handleTenantChange = (selectedOption: any) => {
        setSelectedTenant(selectedOption);


        const selectedTenantData = data.find((tenant) => tenant.id === selectedOption.value);
        if (!selectedTenantData) {
            console.error('Selected tenant not found in data');
            return;
        }

        const meterListrikData = Array.isArray(selectedTenantData.meter_listrik) ? selectedTenantData.meter_listrik : [];

        const meterListrikOptions = meterListrikData.map((v) => ({
            label: `${monthYear(new Date(v.tgl))} : ${formatDigit(v.pemakaian, 2)} kWh`,
            value: v.tgl,
            data: v,
        }));

        setMeterListrikOptions(meterListrikOptions);

        setListrikInvoice({
            ...listrikInvoice,
            no: noInvoiceListrik(invoiceNumbers) ?? '',
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

        setListrikInvoice({
            ...listrikInvoice,
            rekening_id: selectedRekeningData.id,
        });
    };

    useEffect(() => {
        if (selectedMeterListrik) {
            handleMeterListrikChange(selectedMeterListrik);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listrikInvoice.biaya_admin, listrikInvoice.biaya_lain, listrikInvoice.denda, listrikInvoice.selisih_bayar]);

    const handleMeterListrikChange = (selectedOption: any) => {
        setSelectedMeterListrik(selectedOption);

        if (selectedOption && selectedOption.data) {
            const keterangan = `Pemakaian Listrik ${monthYear(new Date(selectedOption.data.tgl))}.`;

            const meter_listrik_id = selectedOption.data.id;
            const pemakaian = selectedOption.data.pemakaian ?? 0;
            const tarif = listrikInvoice.tarif ?? 50000; // Default tarif if not set
            const subtotal = Math.round(pemakaian * tarif);

            const ppj_jumlah = Math.round(listrikInvoice.ppj_persen * subtotal / 100); // Calculate PPJ
            const genset_persen = hasGenset ? listrikInvoice.genset_persen : 0;
            const genset_jumlah = Math.round(genset_persen * (subtotal + ppj_jumlah) / 100);

            const biaya_admin = listrikInvoice.biaya_admin ?? 0; // Default biaya admin if not set
            const biaya_lain = listrikInvoice.biaya_lain ?? 0; // Default biaya lain if not set
            const denda = listrikInvoice.denda ?? 0; // Default denda if not set
            const selisih_bayar = listrikInvoice.selisih_bayar ?? 0; // Default selisih bayar if not set
            const total = Math.round(subtotal + ppj_jumlah + genset_jumlah + biaya_admin + biaya_lain + denda + selisih_bayar);

            const ppn_persen = listrikInvoice.ppn_persen ?? 11; // Default PPN percentage if not set
            const ppn_jumlah = Math.round(ppn_persen * total / 100); // Calculate PPN
            const materai = listrikInvoice.materai ?? (hasMaterai ? 10000 : 0); // Default materai if not set
            const tagihan = Math.round(total + ppn_jumlah + materai);
            const terbilangTxt = terbilang(tagihan) + ' Rupiah';

            const updated = {
                ...listrikInvoice,
                keterangan,
                meter_listrik_id,
                pemakaian,
                tarif,
                subtotal,
                ppj_jumlah,
                genset_persen,
                genset_jumlah,
                biaya_admin,
                biaya_lain,
                denda,
                selisih_bayar,
                total,
                ppn_persen,
                ppn_jumlah,
                materai,
                tagihan,
                terbilang: terbilangTxt
            };

            setListrikInvoice((prev) => ({ ...prev, ...updated }));
        }
    }

    useEffect(() => {
        handleMeterListrikChange(selectedMeterListrik);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listrikInvoice.tarif]);

    useEffect(() => {
        const currentInvoice = listrikInvoice;

        let materai = 0;
        if (hasMaterai) {
            // If hasMaterai is true, set materai to 10000
            materai = 10000;
        }

        const tagihan = Math.round(currentInvoice.total + currentInvoice.ppn_jumlah + materai);

        setListrikInvoice((prev) => ({
            ...prev,
            materai,
            tagihan,
            terbilang: terbilang(tagihan) + ' Rupiah',
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasMaterai]);

    useEffect(() => {
        const currentInvoice = listrikInvoice;
        const totalppj = currentInvoice.subtotal + currentInvoice.ppj_jumlah;

        let genset_persen = 0;
        if (hasGenset) {
            genset_persen = 5;
        }

        const genset_jumlah = Math.round(genset_persen * totalppj / 100);
        const total = Math.round(totalppj + genset_jumlah + currentInvoice.biaya_admin + currentInvoice.biaya_lain + currentInvoice.denda + currentInvoice.selisih_bayar);
        const ppn_jumlah = Math.round(currentInvoice.ppn_persen * total / 100);
        const materai = hasMaterai ? 10000 : 0;
        const tagihan = Math.round(total + ppn_jumlah + materai);

        setListrikInvoice((prev) => ({
            ...prev,
            genset_persen,
            genset_jumlah,
            total,
            ppn_jumlah,
            materai,
            tagihan,
            terbilang: terbilang(tagihan) + ' Rupiah',
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasGenset]);

    const handleSignChange = (selectedOption: any) => {
        setSelectedSign(selectedOption);
        setListrikInvoice((prev) => ({
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

        if (!listrikInvoice.tgl) {
            setErrorMessage('Silakan pilih tanggal invoice.');
            setIsErrorModalOpen(true);
            return;
        }

        if (!listrikInvoice.due) {
            setErrorMessage('Silakan pilih tanggal jatuh tempo.');
            setIsErrorModalOpen(true);
            return;
        }

        if (!listrikInvoice.no) {
            setErrorMessage('Silakan isi nomor invoice.');
            setIsErrorModalOpen(true);
            return;
        }

        // periode tagihan
        if (!listrikInvoice.meter_listrik_id) {
            setErrorMessage('Silakan pilih periode tagihan.');
            setIsErrorModalOpen(true);
            return;
        }

        if (!listrikInvoice.keterangan) {
            setErrorMessage('Silakan isi keterangan.');
            setIsErrorModalOpen(true);
            return;
        }

        if (!selectedSign) {
            setErrorMessage('Silakan pilih tanda tangan.');
            setIsErrorModalOpen(true);
            return;
        }

        handleSubmit(listrikInvoice);
    };

    const closeErrorModal = () => {
        setIsErrorModalOpen(false);
        setErrorMessage('');
    };

    return (
        <div className="flex justify-center bg-black/70 fixed inset-0 z-30 p-2">
            <div className="bg-white px-6 py-4 rounded shadow-md w-full md:w-1/2 overflow-y-auto text-sm">
                <h3 className="text-lg text-center font-semibold mb-4 p-1 bg-blue-200 rounded-lg">Create Invoice - Rekening Listrik</h3>

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
                            value={listrikInvoice.tgl}
                            onChange={(e) => setListrikInvoice({ ...listrikInvoice, tgl: e.target.value })}
                            className="w-full rounded-md border bg-white border-gray-300 p-2"
                        />
                    </div>

                    <div className="flex flex-col bg-blue-50 p-1 rounded-lg">
                        <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                            Jatuh Tempo
                        </label>
                        <input
                            type="date"
                            value={listrikInvoice.due}
                            onChange={(e) => setListrikInvoice({ ...listrikInvoice, due: e.target.value })}
                            className="w-full rounded-md border bg-white border-gray-300 p-2"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-4">
                    <div className="flex flex-col bg-blue-50 p-1 rounded-lg">
                        <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                            Nomor Invoice
                        </label>
                        <input
                            type="text"
                            value={listrikInvoice.no}
                            onChange={(e) => setListrikInvoice({ ...listrikInvoice, no: e.target.value })}
                            className="w-full rounded-md border bg-white border-gray-300 p-2 text-center"
                        />
                    </div>

                    <div className="flex flex-col bg-blue-50 p-1 rounded-lg">
                        <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                            Periode Tagihan
                        </label>
                        <Select
                            options={meterListrikOptions}
                            value={selectedMeterListrik}
                            onChange={handleMeterListrikChange}
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
                            value={listrikInvoice.keterangan}
                            onChange={(e) => setListrikInvoice({ ...listrikInvoice, keterangan: e.target.value })}
                            className="w-full rounded-md border bg-white border-gray-300 p-2"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-4">

                    <div className="flex flex-col bg-blue-50 p-1 rounded-lg">
                        <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                            Tarif per kWh
                        </label>
                        <input
                            type="text"
                            value={listrikInvoice.tarif ?? 1444.70}
                            onChange={(e) => setListrikInvoice({ ...listrikInvoice, tarif: parseFloat(e.target.value.replace(/[^0-9.-]+/g, '')) })}
                            className="w-full rounded-md border bg-white border-gray-300 p-2 text-center"
                        />
                    </div>

                    <div className="flex flex-col bg-blue-300 p-1 rounded-lg font-bold">
                        <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                            Subtotal
                        </label>
                        <input
                            type="text"
                            value={formatUang(listrikInvoice.subtotal ?? 0)}
                            onChange={() => { }}
                            className="w-full rounded-md border border-gray-300 p-2 bg-gray-200 cursor-not-allowed text-center"
                            disabled={true}
                        />
                    </div>

                    <div className="flex flex-col bg-blue-50 p-1 rounded-lg">
                        <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                            PPJ ({listrikInvoice.ppj_persen}%)
                        </label>
                        <input
                            type="text"
                            value={formatUang(listrikInvoice.ppj_jumlah ?? 0)}
                            onChange={() => { }}
                            className="w-full rounded-md border border-gray-300 p-2 bg-gray-200 cursor-not-allowed text-center"
                            disabled={true}
                        />
                    </div>

                    <div className="flex flex-col bg-blue-50 p-1 rounded-lg">
                        <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={hasGenset}
                                onChange={(st) => setHasGenset(st.target.checked)}
                                className="mr-1"
                            />
                            Genset & Loss Energy ({listrikInvoice.genset_persen}%)
                        </label>
                        <input
                            type="text"
                            value={formatUang(listrikInvoice.genset_jumlah ?? 0)}
                            onChange={() => { }}
                            className="w-full rounded-md border border-gray-300 p-2 bg-gray-200 cursor-not-allowed text-center"
                            disabled={true}
                        />
                    </div>

                    <div className="flex flex-col bg-blue-50 p-1 rounded-lg">
                        <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                            Biaya Admin
                        </label>
                        <input
                            type="text"
                            value={listrikInvoice.biaya_admin ?? 0}
                            onChange={(e) => setListrikInvoice({ ...listrikInvoice, biaya_admin: parseFloat(e.target.value.replace(/[^0-9.-]+/g, '')) })}
                            className="w-full rounded-md border bg-white border-gray-300 p-2 text-center"
                        />
                    </div>

                    <div className="flex flex-col bg-blue-50 p-1 rounded-lg">
                        <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                            Biaya Lainnya
                        </label>
                        <input
                            type="text"
                            value={listrikInvoice.biaya_lain ?? 0}
                            onChange={(e) => setListrikInvoice({ ...listrikInvoice, biaya_lain: parseFloat(e.target.value.replace(/[^0-9.-]+/g, '')) })}
                            className="w-full rounded-md border bg-white border-gray-300 p-2 text-center"
                        />
                    </div>

                    <div className="flex flex-col bg-blue-50 p-1 rounded-lg">
                        <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                            Denda
                        </label>
                        <input
                            type="text"
                            value={listrikInvoice.denda ?? 0}
                            onChange={(e) => setListrikInvoice({ ...listrikInvoice, denda: parseFloat(e.target.value.replace(/[^0-9.-]+/g, '')) })}
                            className="w-full rounded-md border bg-white border-gray-300 p-2 text-center"
                        />
                    </div>

                    <div className="flex flex-col bg-blue-300 p-1 rounded-lg font-bold">
                        <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                            Total
                        </label>
                        <input
                            type="text"
                            value={formatUang(listrikInvoice.total ?? 0)}
                            onChange={() => { }}
                            className="w-full rounded-md border border-gray-300 p-2 bg-gray-200 cursor-not-allowed text-center"
                            disabled={true}
                        />
                    </div>

                    <div className="flex flex-col bg-blue-50 p-1 rounded-lg">
                        <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                            PPN ({listrikInvoice.ppn_persen}%)
                        </label>
                        <input
                            type="text"
                            value={formatUang(listrikInvoice.ppn_jumlah ?? 0)}
                            onChange={() => { }}
                            className="w-full rounded-md border border-gray-300 p-2 bg-gray-200 cursor-not-allowed text-center"
                            disabled={true}
                        />
                    </div>

                    <div className="flex flex-col bg-blue-50 p-1 rounded-lg">
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
                            value={formatUang(listrikInvoice.materai ?? 0)}
                            onChange={() => { }}
                            className="w-full rounded-md border border-gray-300 p-2 bg-gray-200 cursor-not-allowed text-center"
                            disabled={true}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 mb-1">
                    <div className="flex flex-col bg-blue-300 p-1 rounded-lg text-center font-bold">
                        <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 py-1">
                            TAGIHAN
                        </label>
                        <input
                            type="text"
                            value={formatUang(listrikInvoice.tagihan ?? 0)}
                            onChange={() => { }}
                            className="w-full rounded-md border border-gray-300 p-2 bg-gray-200 cursor-not-allowed text-center"
                            disabled={true}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 mb-1">
                        <div className="flex flex-col bg-blue-50 p-1 rounded-lg">
                            <textarea
                                value={listrikInvoice.terbilang}
                                onChange={(e) => setListrikInvoice({ ...listrikInvoice, terbilang: e.target.value })}
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


                <div className="flex justify-end mt-4 mb-8">
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

        </div>
    );
};

export default CreateModal;
