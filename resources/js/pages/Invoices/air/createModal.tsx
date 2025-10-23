/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/Invoices/air/createModal.tsx
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { TenantBook } from '@/pages/TenantBook/models';
import { Rekening, Sign } from '@/pages/components/pdfModel';
import { monthYear, noInvoiceAir, terbilang } from '@/pages/components/functions';
import { formatDigit, formatUang } from '@/pages/components/helpers';
import { ErrorModal } from '@/pages/Foodcourt/components/modal';
import { AirInvoice, TarifAir } from './model';

interface TenantBookModalProps {
    data: TenantBook[];
    rekening: Rekening[];
    signs: Sign[];
    tarifs: TarifAir;
    invoiceNumbers: string[] | null;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleSubmit: (airInvoice: AirInvoice) => void;
}

const CreateModal: React.FC<TenantBookModalProps> = ({
    data,
    rekening,
    signs,
    tarifs,
    invoiceNumbers,
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

    const [airInvoice, setAirInvoice] = useState<AirInvoice>({
        id: 0,
        meter_air_id: 0,
        rekening_id: 0,
        sign_id: 0,
        uuid: '',
        keterangan: `Pemakaian Air ${monthYear(new Date())}.`,
        no: '',
        tgl: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
        // set default today + 14 with format YYYY-MM-DD
        due: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0],
        curr: 'IDR',
        pemakaian: 0,
        subtotal: 0,
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
        air_invoice_details: [],
    });

    useEffect(() => {
        const tglDate = new Date(airInvoice.tgl);
        const dueDate = new Date(tglDate);
        dueDate.setDate(tglDate.getDate() + 14);

        setAirInvoice((prev) => ({
            ...prev,
            due: dueDate.toISOString().split('T')[0], // Format: YYYY-MM-DD
        }));
    }, [airInvoice.tgl]);

    const [meterAirOptions, setMeterAirOptions] = useState<any[]>();
    const [selectedMeterAir, setSelectedMeterAir] = useState<any>();

    // Handle tenant selection
    const handleTenantChange = (selectedOption: any) => {
        setSelectedTenant(selectedOption);

        const selectedTenantData = data.find((tenant) => tenant.id === selectedOption.value);
        if (!selectedTenantData) {
            console.error('Selected tenant not found in data');
            return;
        }

        const meterAirData = Array.isArray(selectedTenantData.meter_air) ? selectedTenantData.meter_air : [];

        const meterAirOptions = meterAirData.map((v) => ({
            label: `${monthYear(new Date(v.tgl))} : ${formatDigit(v.pemakaian, 2)} m³`,
            value: v.tgl,
            data: v,
        }));

        setMeterAirOptions(meterAirOptions);
        setSelectedMeterAir(null);

        setAirInvoice({
            ...airInvoice,
            no: noInvoiceAir(invoiceNumbers) ?? '',
            meter_air_id: 0,
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

        setAirInvoice({
            ...airInvoice,
            rekening_id: selectedRekeningData.id,
        });
    };

    useEffect(() => {
        if (selectedMeterAir) {
            handleMeterAirChange(selectedMeterAir);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [airInvoice.biaya_admin, airInvoice.biaya_lain, airInvoice.denda, airInvoice.selisih_bayar]);

    const handleMeterAirChange = (selectedOption: any) => {
        setSelectedMeterAir(selectedOption);

        if (selectedOption && selectedOption.data) {
            const keterangan = `Pemakaian Air ${monthYear(new Date(selectedOption.data.tgl))}.`;
            const meter_air_id = selectedOption.data.id;
            const pemakaian = selectedOption.data.pemakaian ?? 0;

            const pakai1 = Math.min(pemakaian, 5);
            const tarif1 = Math.round(pakai1 * tarifs.tarif_air_1);

            let air_invoice_details = [
                {
                    ket: `Tarif Air 1-5 m³`,
                    volume: pakai1,
                    tarif: tarifs.tarif_air_1,
                    jumlah: tarif1,
                },
            ];

            const pakai2 = Math.min((pemakaian - pakai1), 5);
            const tarif2 = Math.round(pakai2 * tarifs.tarif_air_2);
            if (pemakaian > 5) {
                air_invoice_details = [
                    ...air_invoice_details,
                    {
                        ket: `Tarif Air 6-10 m³`,
                        volume: pakai2,
                        tarif: tarifs.tarif_air_2,
                        jumlah: tarif2,
                    },
                ];
            }

            const pakai3 = pemakaian - pakai1 - pakai2;
            const tarif3 = Math.round(pakai3 * tarifs.tarif_air_3);
            if (pemakaian > 10) {
                air_invoice_details = [
                    ...air_invoice_details,
                    {
                        ket: `Tarif Air >10 m³`,
                        volume: pakai3,
                        tarif: tarifs.tarif_air_3,
                        jumlah: tarif3,
                    },
                ];
            }

            const subtotal = air_invoice_details.reduce((acc, detail) => acc + detail.jumlah, 0);

            const biaya_admin = airInvoice.biaya_admin ?? 0; // Default biaya admin if not set
            const biaya_lain = airInvoice.biaya_lain ?? 0; // Default biaya lain if not set
            const denda = airInvoice.denda ?? 0; // Default denda if not set
            const selisih_bayar = airInvoice.selisih_bayar ?? 0; // Default selisih bayar if not set
            const total = (subtotal + biaya_admin + biaya_lain + denda + selisih_bayar); // Total calculation

            const ppn_persen = airInvoice.ppn_persen ?? 11; // Default PPN percentage if not set
            const ppn_jumlah = Math.round(ppn_persen * total / 100); // Calculate PPN
            const materai = airInvoice.materai ?? (hasMaterai ? 10000 : 0); // Default materai if not set
            const tagihan = (total + ppn_jumlah + materai);
            const terbilangTxt = terbilang(tagihan) + ' Rupiah';

            const updated = {
                ...airInvoice,
                keterangan,
                meter_air_id,
                pemakaian,
                subtotal,
                biaya_admin,
                biaya_lain,
                denda,
                selisih_bayar,
                total,
                ppn_persen,
                ppn_jumlah,
                materai,
                tagihan,
                terbilang: terbilangTxt,
                air_invoice_details,
            };

            setAirInvoice((prev) => ({ ...prev, ...updated }));
        }
    }

    useEffect(() => {
        const currentInvoice = airInvoice;

        let updatedMaterai = 0;
        if (hasMaterai) {
            // If hasMaterai is true, set materai to 10000
            updatedMaterai = 10000;
        }

        const updatedTotal = currentInvoice.total + currentInvoice.ppn_jumlah + updatedMaterai;
        setAirInvoice((prev) => ({
            ...prev,
            materai: updatedMaterai,
            tagihan: updatedTotal,
            terbilang: terbilang(updatedTotal) + ' Rupiah',
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasMaterai]);

    const handleSignChange = (selectedOption: any) => {
        setSelectedSign(selectedOption);
        setAirInvoice((prev) => ({
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

        if (!airInvoice.tgl) {
            setErrorMessage('Silakan pilih tanggal invoice.');
            setIsErrorModalOpen(true);
            return;
        }

        if (!airInvoice.due) {
            setErrorMessage('Silakan pilih tanggal jatuh tempo.');
            setIsErrorModalOpen(true);
            return;
        }

        if (!airInvoice.no) {
            setErrorMessage('Silakan isi nomor invoice.');
            setIsErrorModalOpen(true);
            return;
        }

        // periode tagihan
        if (!airInvoice.meter_air_id) {
            setErrorMessage('Silakan pilih periode tagihan.');
            setIsErrorModalOpen(true);
            return;
        }

        if (!airInvoice.keterangan) {
            setErrorMessage('Silakan isi keterangan.');
            setIsErrorModalOpen(true);
            return;
        }

        if (!selectedSign) {
            setErrorMessage('Silakan pilih tanda tangan.');
            setIsErrorModalOpen(true);
            return;
        }

        handleSubmit(airInvoice);
    };

    const closeErrorModal = () => {
        setIsErrorModalOpen(false);
        setErrorMessage('');
    };

    return (
        <div className="flex justify-center bg-black/70 fixed inset-0 z-30 p-2">
            <div className="bg-white px-6 py-4 rounded shadow-md w-full md:w-1/2 overflow-y-auto text-sm">
                <h3 className="text-lg text-center font-semibold mb-4 p-1 bg-blue-200 rounded-lg">Create Invoice - Rekening Air</h3>

                <hr className="mb-4" />

                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 my-2">
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
                            value={airInvoice.tgl}
                            onChange={(e) => setAirInvoice({ ...airInvoice, tgl: e.target.value })}
                            className="w-full rounded-md border bg-white border-gray-300 p-2"
                        />
                    </div>

                    <div className="flex flex-col bg-blue-50 p-1 rounded-lg">
                        <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                            Jatuh Tempo
                        </label>
                        <input
                            type="date"
                            value={airInvoice.due}
                            onChange={(e) => setAirInvoice({ ...airInvoice, due: e.target.value })}
                            className="w-full rounded-md border bg-white border-gray-300 p-2"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 my-2">
                    <div className="flex flex-col bg-blue-50 p-1 rounded-lg">
                        <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                            Nomor Invoice
                        </label>
                        <input
                            type="text"
                            value={airInvoice.no}
                            onChange={(e) => setAirInvoice({ ...airInvoice, no: e.target.value })}
                            className="w-full rounded-md border bg-white border-gray-300 p-2 text-center"
                        />
                    </div>

                    <div className="flex flex-col bg-blue-50 p-1 rounded-lg">
                        <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                            Periode Tagihan
                        </label>
                        <Select
                            options={meterAirOptions}
                            value={selectedMeterAir}
                            onChange={handleMeterAirChange}
                            getOptionLabel={(e) => e.label}
                            getOptionValue={(e) => e.value}
                            placeholder="Pilih Periode"
                            className="react-select-container"
                            classNamePrefix="react-select"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-2 my-2">
                    <div className="flex flex-col bg-blue-50 p-1 rounded-lg">
                        <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                            Keterangan
                        </label>
                        <input
                            type="text"
                            value={airInvoice.keterangan}
                            onChange={(e) => setAirInvoice({ ...airInvoice, keterangan: e.target.value })}
                            className="w-full rounded-md border bg-white border-gray-300 p-2"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 my-2">

                    {airInvoice.air_invoice_details?.map((detail, index) => (
                        <div key={index} className="flex flex-col bg-blue-50 p-1 rounded-lg">
                            <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                                {detail.ket}
                            </label>
                            <input
                                type="text"
                                value={`${detail.volume} m³ x ${formatUang(detail.tarif)} = ${formatUang(detail.jumlah)}`}
                                onChange={() => { }}
                                className="w-full rounded-md border border-gray-300 p-2 bg-gray-200 cursor-not-allowed text-center"
                                disabled={true}
                            />
                        </div>
                    ))}

                </div>

                <div className="grid grid-cols-1 gap-2 my-2">

                    <div className="flex flex-col bg-blue-300 p-1 rounded-lg text-center font-bold">
                        <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                            Subtotal
                        </label>
                        <input
                            type="text"
                            value={formatUang(airInvoice.subtotal ?? 0)}
                            onChange={() => { }}
                            className="w-full rounded-md border border-gray-300 p-2 bg-gray-200 cursor-not-allowed text-center"
                            disabled={true}
                        />
                    </div>

                </div>

                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 my-2">

                    <div className="flex flex-col bg-blue-50 p-1 rounded-lg">
                        <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                            Biaya Admin
                        </label>
                        <input
                            type="text"
                            value={airInvoice.biaya_admin ?? 0}
                            onChange={(e) => setAirInvoice({ ...airInvoice, biaya_admin: parseFloat(e.target.value.replace(/[^0-9.-]+/g, '')) })}
                            className="w-full rounded-md border bg-white border-gray-300 p-2 text-center"
                        />
                    </div>

                    <div className="flex flex-col bg-blue-50 p-1 rounded-lg">
                        <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                            Biaya Lainnya
                        </label>
                        <input
                            type="text"
                            value={airInvoice.biaya_lain ?? 0}
                            onChange={(e) => setAirInvoice({ ...airInvoice, biaya_lain: parseFloat(e.target.value.replace(/[^0-9.-]+/g, '')) })}
                            className="w-full rounded-md border bg-white border-gray-300 p-2 text-center"
                        />
                    </div>

                    <div className="flex flex-col bg-blue-50 p-1 rounded-lg">
                        <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                            Denda
                        </label>
                        <input
                            type="text"
                            value={airInvoice.denda ?? 0}
                            onChange={(e) => setAirInvoice({ ...airInvoice, denda: parseFloat(e.target.value.replace(/[^0-9.-]+/g, '')) })}
                            className="w-full rounded-md border bg-white border-gray-300 p-2 text-center"
                        />
                    </div>

                </div>

                <div className="grid grid-cols-1 gap-2 mb-4">

                    <div className="flex flex-col bg-blue-300 p-1 rounded-lg text-center font-bold">
                        <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                            Total
                        </label>
                        <input
                            type="text"
                            value={formatUang(airInvoice.total ?? 0)}
                            onChange={() => { }}
                            className="w-full rounded-md border border-gray-300 p-2 bg-gray-200 cursor-not-allowed text-center"
                            disabled={true}
                        />
                    </div>

                </div>

                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 mb-4">

                    <div className="flex flex-col bg-blue-50 p-1 rounded-lg">
                        <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                            PPN ({airInvoice.ppn_persen}%)
                        </label>
                        <input
                            type="text"
                            value={formatUang(airInvoice.ppn_jumlah ?? 0)}
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
                            value={formatUang(airInvoice.materai ?? 0)}
                            onChange={() => { }}
                            className="w-full rounded-md border border-gray-300 p-2 bg-gray-200 cursor-not-allowed text-center"
                            disabled={true}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-2 mb-1">
                    <div className="flex flex-col bg-blue-300 p-1 rounded-lg text-center font-bold">
                        <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 py-1">
                            TAGIHAN
                        </label>
                        <input
                            type="text"
                            value={formatUang(airInvoice.tagihan ?? 0)}
                            onChange={() => { }}
                            className="w-full rounded-md border border-gray-300 p-2 bg-gray-200 cursor-not-allowed text-center"
                            disabled={true}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-2 mb-1">
                        <div className="flex flex-col bg-blue-50 p-1 rounded-lg">
                            <textarea
                                value={airInvoice.terbilang}
                                onChange={(e) => setAirInvoice({ ...airInvoice, terbilang: e.target.value })}
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
