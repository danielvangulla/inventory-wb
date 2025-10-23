/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/Invoices/service/createModal.tsx
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { TenantBook } from '@/pages/TenantBook/models';
import { Rekening, Sign } from '@/pages/components/pdfModel';
import { noInvoiceService, terbilang } from '@/pages/components/functions';
import { formatUang } from '@/pages/components/helpers';
import { ErrorModal } from '@/pages/Foodcourt/components/modal';
import { ServiceInvoice } from './model';

interface TenantBookModalProps {
    data: TenantBook[];
    rekening: Rekening[];
    signs: Sign[];
    invoiceNumbers: string[] | null;
    isModalOpen: boolean;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleSubmit: (serviceInvoice: ServiceInvoice) => void;
}

const CreateModal: React.FC<TenantBookModalProps> = ({
    data,
    rekening,
    signs,
    invoiceNumbers,
    isModalOpen,
    setModalOpen,
    handleSubmit,
}) => {
    const [hasMaterai, setHasMaterai] = useState<boolean>(false);
    const [hasDiskon, setHasDiskon] = useState<boolean>(false);
    const [hasBiayaLain, setHasBiayaLain] = useState<boolean>(false);

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

    const [serviceInvoice, setServiceInvoice] = useState<ServiceInvoice>({
        id: 0,
        uuid: '',
        tenant_book_id: 0,
        rekening_id: 0,
        sign_id: 0,
        toko: '',
        perusahaan: '',
        alamat: '',
        no: '',
        tgl: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
        due: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0], // Format: YYYY-MM-DD
        curr: 'IDR',
        floor: '',
        unit: '',
        period_start: new Date(new Date().getFullYear(), new Date().getMonth(), 2).toISOString().split('T')[0],
        period_end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString().split('T')[0], // End date of the month
        keterangan: '',
        jumlah: 0,
        diskon_ket: '',
        diskon_jumlah: 0,
        biaya_ket: '',
        biaya_jumlah: 0,
        promotion_levy_persen: 0,
        promotion_levy_jumlah: 0,
        subtotal: 0,
        ppn_persen: 0,
        ppn_jumlah: 0,
        materai: 0,
        total: 0,
        terbilang: '',
    });

    useEffect(() => {
        // update due date when tgl changes
        const tglDate = new Date(serviceInvoice.tgl);
        const dueDate = new Date(tglDate);
        dueDate.setDate(tglDate.getDate() + 14); // Set due date to 14 days after tgl
        setServiceInvoice((prev) => ({
            ...prev,
            due: dueDate.toISOString().split('T')[0], // Format: YYYY-MM-DD
        }));
    }, [serviceInvoice.tgl]);

    useEffect(() => {
        if (!selectedTenant) return; // If no tenant is selected, do not proceed

        const selectedTenantData = data.find((tenant) => tenant.id === selectedTenant.value); // Find the selected tenant data

        // update keterangan when period_start or period_end changes
        const periodStart = new Date(serviceInvoice.period_start);
        const periodEnd = new Date(serviceInvoice.period_end);
        const periodRange = periodEnd.getDate() - periodStart.getDate() + 1; // Calculate the number of days in the period

        const serviceNote = `Service Charge Periode ${periodStart.getDate()}-${periodEnd.getDate()} ${new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(periodStart)} ${periodStart.getFullYear()}.`;

        const monthStart = new Date(periodStart.getFullYear(), periodStart.getMonth(), 2).toISOString().split('T')[0]; // Start date of the month
        const monthEnd = new Date(periodStart.getFullYear(), periodStart.getMonth() + 1, 0).toISOString().split('T')[0]; // End date of the month

        const monthStartDate = new Date(monthStart);
        const monthEndDate = new Date(monthEnd);

        const days = Math.max(1, monthEndDate.getDate() - monthStartDate.getDate() + 2); // Ensure at least 1 day to avoid division by zero
        const jumlahPerDay = (selectedTenantData?.service_per_bulan || 0) / days || 0; // Handle division by zero

        const jumlah = Math.round(jumlahPerDay * periodRange); // Total amount for the period

        let diskon_jumlah = +(serviceInvoice.diskon_jumlah || 0);
        if (diskon_jumlah > jumlah) {
            diskon_jumlah = jumlah; // Ensure diskon does not exceed jumlah
        }

        const biaya_jumlah = +(serviceInvoice.biaya_jumlah || 0);

        const levyJumlah = Math.round(serviceInvoice.promotion_levy_persen * jumlah / 100); // Calculate Promotion Levy amount based on percentage
        const subTotal = jumlah + levyJumlah - diskon_jumlah + biaya_jumlah; // Total after levy, diskon, and biaya lain
        const ppnPersen = serviceInvoice.ppn_persen ?? 11; // Assuming PPN is fixed at 11% if not set
        const ppnJumlah = Math.round(ppnPersen * subTotal / 100); // Calculate PPN
        const materai = serviceInvoice.materai || 0; // Assuming a fixed amount for materai
        const total = Math.round(subTotal + ppnJumlah + materai); // Total after PPN

        setServiceInvoice((prev) => ({
            ...prev,
            keterangan: serviceNote,
            jumlah: jumlah,
            diskon_jumlah,
            biaya_jumlah,
            promotion_levy_jumlah: levyJumlah,
            subtotal: subTotal,
            ppn_jumlah: ppnJumlah,
            materai,
            total: total,
            terbilang: terbilang(total) + ' Rupiah',
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [serviceInvoice.period_start, serviceInvoice.period_end]);

    // Handle tenant selection
    const handleTenantChange = (selectedOption: any) => {
        setSelectedTenant(selectedOption);

        const selectedTenantData = data.find((tenant) => tenant.id === selectedOption.value);
        if (!selectedTenantData) {
            console.error('Selected tenant not found in data');
            return;
        }

        const periodStart = new Date(serviceInvoice.period_start);
        const periodEnd = new Date(serviceInvoice.period_end);
        const periodRange = periodEnd.getDate() - periodStart.getDate() + 1; // Calculate the number of days in the period

        const keterangan = `Service Charge Periode ${new Date(serviceInvoice.period_start).getDate()}-${new Date(serviceInvoice.period_end).getDate()} ${new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(new Date(serviceInvoice.period_start))} ${new Date(serviceInvoice.period_start).getFullYear()}.`;

        const monthStart = new Date(periodStart.getFullYear(), periodStart.getMonth(), 2).toISOString().split('T')[0]; // Start date of the month
        const monthEnd = new Date(periodStart.getFullYear(), periodStart.getMonth() + 1, 0).toISOString().split('T')[0]; // End date of the month

        const monthStartDate = new Date(monthStart);
        const monthEndDate = new Date(monthEnd);

        const days = Math.max(1, monthEndDate.getDate() - monthStartDate.getDate() + 2); // Ensure at least 1 day to avoid division by zero
        const jumlahPerDay = (selectedTenantData?.service_per_bulan || 0) / days || 0; // Handle division by zero

        const jumlah = Math.round(jumlahPerDay * periodRange); // Total amount for the period
        // const jumlah = selectedTenantData.service_per_bulan ?? 0;

        let diskon_jumlah = +(serviceInvoice.diskon_jumlah || 0);
        if (diskon_jumlah > jumlah)diskon_jumlah = jumlah; // Ensure diskon does not exceed jumlah
        if (diskon_jumlah < 0) diskon_jumlah = 0; // Ensure diskon is not negative
        if (!hasDiskon) diskon_jumlah = 0; // Reset diskon if checkbox is unchecked

        let diskon_ket = serviceInvoice.diskon_ket || '';
        if (!hasDiskon) diskon_ket = ''; // Reset diskon ket if checkbox is unchecked

        let biaya_jumlah = +(serviceInvoice.biaya_jumlah || 0);
        if (!hasBiayaLain) biaya_jumlah = 0; // Reset biaya if checkbox is unchecked

        let biaya_ket = serviceInvoice.biaya_ket || '';
        if (!hasBiayaLain) biaya_ket = ''; // Reset biaya ket if checkbox is unchecked

        const levyPersen = selectedTenantData.promotion_levy_persen ?? 0;
        const levyJumlah = Math.round(levyPersen * jumlah / 100);

        const subtotal = jumlah + levyJumlah - diskon_jumlah + biaya_jumlah; // Total after levy, diskon, and biaya lain
        const ppnPersen = 11; // Assuming PPN is fixed at 11%
        const ppnJumlah = Math.round(ppnPersen * subtotal / 100); // Calculate PPN
        const materai = hasMaterai ? 10000 : 0; // Assuming a fixed amount for materai
        const total = Math.round(subtotal + ppnJumlah + materai); // Total after PPN

        setServiceInvoice({
            ...serviceInvoice,
            tenant_book_id: selectedTenantData.id,
            toko: selectedTenantData.nama_toko ?? '',
            perusahaan: selectedTenantData.perusahaan ?? '',
            alamat: selectedTenantData.alamat ?? '',
            floor: selectedTenantData.tenant?.floor ?? '',
            unit: selectedTenantData.tenant?.no ?? '',
            no: noInvoiceService(invoiceNumbers) ?? '',
            jumlah,
            diskon_ket,
            diskon_jumlah,
            biaya_ket,
            biaya_jumlah,
            promotion_levy_persen: levyPersen ?? 0,
            promotion_levy_jumlah: levyJumlah ?? 0,
            subtotal,
            ppn_persen: ppnPersen ?? 0,
            ppn_jumlah: ppnJumlah ?? 0,
            materai,
            total,
            terbilang: terbilang(total) + ' Rupiah',
            keterangan,
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

        setServiceInvoice({
            ...serviceInvoice,
            rekening_id: selectedRekeningData.id,
        });
    };

    useEffect(() => {
        if (!selectedTenant) return; // If no tenant is selected, do not proceed
        handleTenantChange(selectedTenant); // Recalculate invoice details when tenant changes

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasDiskon, serviceInvoice.diskon_jumlah, hasBiayaLain, serviceInvoice.biaya_jumlah]);


    useEffect(() => {
        if (!selectedTenant) return; // If no tenant is selected, do not proceed
        handleTenantChange(selectedTenant); // Recalculate invoice details when hasMaterai changes

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasMaterai]);

    const handleSignChange = (selectedOption: any) => {
        setSelectedSign(selectedOption);
        setServiceInvoice((prev) => ({
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

        if (!serviceInvoice.tgl) {
            setErrorMessage('Silakan pilih tanggal invoice.');
            setIsErrorModalOpen(true);
            return;
        }

        if (!serviceInvoice.due) {
            setErrorMessage('Silakan pilih tanggal jatuh tempo.');
            setIsErrorModalOpen(true);
            return;
        }

        if (!serviceInvoice.period_start) {
            setErrorMessage('Silakan pilih periode mulai.');
            setIsErrorModalOpen(true);
            return;
        }

        if (!serviceInvoice.period_end) {
            setErrorMessage('Silakan pilih periode akhir.');
            setIsErrorModalOpen(true);
            return;
        }

        if (!serviceInvoice.keterangan) {
            setErrorMessage('Silakan isi keterangan.');
            setIsErrorModalOpen(true);
            return;
        }

        if (!serviceInvoice.no) {
            setErrorMessage('Silakan isi nomor invoice.');
            setIsErrorModalOpen(true);
            return;
        }

        if (!selectedSign) {
            setErrorMessage('Silakan pilih tanda tangan.');
            setIsErrorModalOpen(true);
            return;
        }

        handleSubmit(serviceInvoice);
    };

    const closeErrorModal = () => {
        setIsErrorModalOpen(false);
        setErrorMessage('');
    };

    return (
        isModalOpen && (
            <div className="flex justify-center bg-black/70 fixed inset-0 z-30 p-2">
                <div className="bg-white px-6 py-4 rounded shadow-md w-full md:w-1/2 overflow-y-auto text-sm">
                    <h3 className="text-lg text-center font-semibold mb-4 p-1 bg-blue-200 rounded-lg">Create Invoice - Service Charge</h3>

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
                                value={serviceInvoice.tgl}
                                onChange={(e) => setServiceInvoice({ ...serviceInvoice, tgl: e.target.value })}
                                className="w-full rounded-md border bg-white border-gray-300 p-2"
                            />
                        </div>

                        <div className="flex flex-col bg-blue-50 p-1 rounded-lg">
                            <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                                Jatuh Tempo
                            </label>
                            <input
                                type="date"
                                value={serviceInvoice.due}
                                onChange={(e) => setServiceInvoice({ ...serviceInvoice, due: e.target.value })}
                                className="w-full rounded-md border bg-white border-gray-300 p-2"
                            />
                        </div>

                        <div className="flex flex-col bg-blue-50 p-1 rounded-lg">
                            <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                                Periode Mulai
                            </label>
                            <input
                                type="date"
                                value={serviceInvoice.period_start}
                                onChange={(e) => setServiceInvoice({ ...serviceInvoice, period_start: e.target.value })}
                                className="w-full rounded-md border bg-white border-gray-300 p-2"
                            />
                        </div>

                        <div className="flex flex-col bg-blue-50 p-1 rounded-lg">
                            <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                                Periode Akhir
                            </label>
                            <input
                                type="date"
                                value={serviceInvoice.period_end}
                                onChange={(e) => setServiceInvoice({ ...serviceInvoice, period_end: e.target.value })}
                                className="w-full rounded-md border bg-white border-gray-300 p-2"
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
                                value={serviceInvoice.keterangan}
                                onChange={(e) => setServiceInvoice({ ...serviceInvoice, keterangan: e.target.value })}
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
                                value={serviceInvoice.no}
                                onChange={(e) => setServiceInvoice({ ...serviceInvoice, no: e.target.value })}
                                className="w-full rounded-md border bg-white border-gray-300 p-2 text-center"
                            />
                        </div>

                        <div className="flex flex-col bg-blue-300 p-1 rounded-lg">
                            <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                                Jumlah
                            </label>
                            <input
                                type="text"
                                value={formatUang(serviceInvoice.jumlah ?? 0)}
                                onChange={() => { }}
                                className="w-full rounded-md border border-gray-300 p-2 bg-gray-200 cursor-not-allowed text-center"
                                disabled={true}
                            />
                        </div>

                        <div className="flex flex-col bg-blue-200 p-1 rounded-lg">
                            <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                                <input
                                    type="checkbox"
                                    checked={hasDiskon}
                                    onChange={(st) => setHasDiskon(st.target.checked)}
                                    className="mr-1"
                                /> Keterangan Potongan
                            </label>
                            <input
                                type="text"
                                value={serviceInvoice.diskon_ket}
                                onChange={(e) => setServiceInvoice({ ...serviceInvoice, diskon_ket: e.target.value })}
                                className={`w-full rounded-md border border-gray-300 p-2 ${hasDiskon ? 'bg-white' : 'bg-gray-200 cursor-not-allowed'}`}
                                placeholder='-'
                                disabled={!hasDiskon}
                            />
                        </div>


                        <div className="flex flex-col bg-blue-200 p-1 rounded-lg">
                            <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                                Jumlah Potongan
                            </label>
                            <input
                                type="text"
                                value={serviceInvoice.diskon_jumlah ?? 0}
                                onChange={(e) => setServiceInvoice({ ...serviceInvoice, diskon_jumlah: +e.target.value })}
                                className={`w-full rounded-md border border-gray-300 text-center p-2 ${hasDiskon ? 'bg-white' : 'bg-gray-200 cursor-not-allowed'}`}
                                disabled={!hasDiskon}
                            />
                        </div>

                        <div className="flex flex-col bg-blue-200 p-1 rounded-lg">
                            <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                                <input
                                    type="checkbox"
                                    checked={hasBiayaLain}
                                    onChange={(st) => setHasBiayaLain(st.target.checked)}
                                    className="mr-1"
                                /> Keterangan Biaya Lain
                            </label>
                            <input
                                type="text"
                                value={serviceInvoice.biaya_ket}
                                onChange={(e) => setServiceInvoice({ ...serviceInvoice, biaya_ket: e.target.value })}
                                className={`w-full rounded-md border border-gray-300 p-2 ${hasBiayaLain ? 'bg-white' : 'bg-gray-200 cursor-not-allowed'}`}
                                placeholder='-'
                                disabled={!hasBiayaLain}
                            />
                        </div>


                        <div className="flex flex-col bg-blue-200 p-1 rounded-lg">
                            <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                                Jumlah Biaya Lain
                            </label>
                            <input
                                type="text"
                                value={serviceInvoice.biaya_jumlah ?? 0}
                                onChange={(e) => setServiceInvoice({ ...serviceInvoice, biaya_jumlah: +e.target.value })}
                                className={`w-full rounded-md border border-gray-300 text-center p-2 ${hasBiayaLain ? 'bg-white' : 'bg-gray-200 cursor-not-allowed'}`}
                                disabled={!hasBiayaLain}
                            />
                        </div>

                        <div className="flex flex-col bg-blue-300 p-1 rounded-lg">
                            <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                                Promotion Levy ({serviceInvoice.promotion_levy_persen}%)
                            </label>
                            <input
                                type="text"
                                value={formatUang(serviceInvoice.promotion_levy_jumlah ?? 0)}
                                onChange={() => { }}
                                className="w-full rounded-md border border-gray-300 p-2 bg-gray-200 cursor-not-allowed text-center"
                                disabled={true}
                            />
                        </div>

                        <div className="flex flex-col bg-blue-300 p-1 rounded-lg">
                            <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                                Subtotal
                            </label>
                            <input
                                type="text"
                                value={formatUang(serviceInvoice.subtotal ?? 0)}
                                onChange={() => { }}
                                className="w-full rounded-md border border-gray-300 p-2 bg-gray-200 cursor-not-allowed text-center"
                                disabled={true}
                            />
                        </div>

                        <div className="flex flex-col bg-blue-300 p-1 rounded-lg">
                            <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 pl-1">
                                PPN ({serviceInvoice.ppn_persen}%)
                            </label>
                            <input
                                type="text"
                                value={formatUang(serviceInvoice.ppn_jumlah ?? 0)}
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
                                value={formatUang(serviceInvoice.materai ?? 0)}
                                onChange={() => { }}
                                className="w-full rounded-md border border-gray-300 p-2 bg-gray-200 cursor-not-allowed text-center"
                                disabled={true}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-1 md:grid-cols-1">
                        <div className="flex flex-col bg-blue-300 p-1 rounded-lg font-bold">
                            <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 text-center">
                                TOTAL TAGIHAN
                            </label>
                            <input
                                type="text"
                                value={formatUang(serviceInvoice.total ?? 0)}
                                onChange={() => { }}
                                className="w-full rounded-md border border-gray-300 p-2 bg-gray-200 cursor-not-allowed text-center"
                                disabled={true}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 mb-2">
                            <div className="flex flex-col">
                                {/* pakai textarea untuk terbilang */}
                                <textarea
                                    value={serviceInvoice.terbilang}
                                    onChange={(e) => setServiceInvoice({ ...serviceInvoice, terbilang: e.target.value })}
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

            </div >
        )
    );
};

export default CreateModal;
