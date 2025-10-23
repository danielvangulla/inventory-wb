// pages/Payments/components/SimulasiModal.tsx
import React from 'react';
import { addPageNumbers, dateAddMonthsAddDays, formatDate, formatUang } from '../../components/helpers';
import { TenantBook } from '../../TenantBook/models';
import { DownloadIcon } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; // Import jsPDF autotable plugin
import { PaymentSewa } from '../models';
import { pdfSimulasi } from '@/pages/components/pdfSimulasi';
import { getPdfHeader } from '@/pages/components/ApiCaller';
import { Header } from '@/pages/components/pdfHeader';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
    interface jsPDF {
        autoTable: typeof autoTable;
    }
}

interface SimulasiModalProps {
    modalOpen: boolean;
    selectedData: TenantBook | null;
    perusahaan: string;
    setLoading: (loading: boolean) => void;
    closeModal: () => void;
}

const SimulasiModal: React.FC<SimulasiModalProps> = ({ modalOpen, selectedData, perusahaan, setLoading, closeModal }) => {
    // Jika modal tidak terbuka atau data tidak tersedia, maka modal tidak ditampilkan
    if (!modalOpen || !selectedData) return null;

    const payments = selectedData?.payments || null;
    if (!payments) {
        alert('Data simulasi belum tersedia.');
        return null;
    }

    const paymentDps = selectedData?.payments?.payment_dp || [];
    const paymentSewa: PaymentSewa[] = [];

    // Calculate paymentSewa
    const lamaSewa = selectedData?.lama_sewa || 0;
    const totalCicilan = payments?.total_cicilan || 0;
    const lamaCicilan = payments?.lama_cicilan || 0;
    const grace_period = payments?.grace_period || 0;
    const extendPeriod = payments?.extend_period || 0;
    const serviceCharge = selectedData?.service_per_bulan || 0;
    const levyStart = selectedData?.promotion_levy_start || selectedData?.tgl_start;
    const levyEnd = selectedData?.promotion_levy_end || (selectedData?.tgl_end ? dateAddMonthsAddDays(new Date(selectedData.tgl_end), grace_period, -1).toISOString().split('T')[0] : null);

    const promotionLevy = selectedData?.promotion_levy_per_bulan || 0;

    console.log('levyStart', levyStart);
    console.log('levyEnd', levyEnd);
    console.log('promotionLevy', promotionLevy);

    const tglOpening = new Date(payments?.tgl_opening || '');
    const jumlahCicilan = lamaCicilan > 0 ? totalCicilan / lamaCicilan : 0;

    const periodCicilan = lamaCicilan + grace_period;
    const periodSewa = lamaSewa + grace_period;

    const totalPeriods = extendPeriod ? periodSewa : lamaSewa;

    for (let i = 1; i <= totalPeriods; i++) {
        let ket = `Cicilan ${i - grace_period}`;
        let jumlah = jumlahCicilan;
        let sisa = totalCicilan - jumlahCicilan * (i - grace_period);

        if (i <= grace_period) {
            ket = `Grace Period ${i}`;
            jumlah = 0;
            sisa = totalCicilan;
        }

        if (i > periodCicilan) {
            ket = `-`;
            jumlah = 0;
        }

        const tglCicilan = new Date(tglOpening);
        tglCicilan.setMonth(tglCicilan.getMonth() + i - 1);

        sisa = sisa >= 0 ? sisa : 0;
        const sc = serviceCharge;

        let levy = 0;
        if (levyStart && levyEnd) {
            const levyStartDate = new Date(levyStart);
            const levyEndDate = new Date(levyEnd);

            if (tglCicilan >= levyStartDate && tglCicilan <= levyEndDate) {
                levy = promotionLevy;
            }
        }

        const total = jumlah + sc + levy;

        paymentSewa.push({
            ke: i,
            tgl: tglCicilan.toISOString().split('T')[0], // Format to YYYY-MM-DD
            ket,
            jumlah,
            sisa,
            sc,
            levy,
            total,
        });
    }

    // Prevent closing modal when clicking inside modal content
    const handleModalClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    const countDp = paymentDps.length;
    const avgHargaIndoor = (selectedData.tenant_book_details?.reduce((acc, detail) => acc + detail.harga_sewa_indoor, 0) || 0) / (selectedData.tenant_book_details?.length || 1);
    const avgHargaOutdoor = (selectedData.tenant_book_details?.reduce((acc, detail) => acc + detail.harga_sewa_outdoor, 0) || 0) / (selectedData.tenant_book_details?.length || 1);
    const cicilanPerBulan = (selectedData.payments?.total_cicilan || 0) / (selectedData.payments?.lama_cicilan || 1);

    const dataPdf = {
        lNamaToko: 'Nama Toko',
        namaToko: `${selectedData.perusahaan || ''} / ${selectedData.nama_toko || ''}`,

        // Row 1
        lLantai: 'Lantai',
        lantai: selectedData.tenant?.floor || '',
        lUnit: 'Unit',
        unit: selectedData.tenant?.no || '',
        lTotalAngsuran: `Total Angsuran (${formatUang(selectedData.payments?.persen_cicilan || 0)}%)`,
        totalAngsuran: `Rp. ${formatUang(selectedData.payments?.total_cicilan || 0)}`,

        // Row 2
        lLuasIndoor: 'Luas Indoor',
        luasIndoor: `${selectedData.luas_indoor || 0} m²`,
        lHargaIndoor: 'Harga Indoor',
        hargaIndoor: `Rp. ${formatUang(avgHargaIndoor || 0)}`,
        lLamaCicilan: 'Lama Angsuran',
        lamaCicilan: `${selectedData.payments?.lama_cicilan || 0} bulan`,

        // Row 3
        lLuasOutdoor: 'Luas Outdoor',
        luasOutdoor: `${selectedData.luas_outdoor || 0} m²`,
        lHargaOutdoor: 'Harga Outdoor',
        hargaOutdoor: `Rp. ${formatUang(avgHargaOutdoor || 0)}`,
        lGracePeriod: 'Grace Period',
        gracePeriod: `${selectedData.payments?.grace_period || 0} bulan`,

        // Row 4
        lLamaSewa: 'Lama Sewa',
        lamaSewa: `${selectedData.lama_sewa || 0} bulan`,
        lTotalSewa: 'Total Sewa',
        totalSewa: `Rp. ${formatUang(selectedData.total_sewa || 0)}`,
        lExtendPeriod: 'Extend Period',
        extendPeriod: `${selectedData.payments?.extend_period ? 'Ya' : 'Tidak'}`,

        // Row 5
        lTglMulai: 'Tgl Mulai',
        tglMulai: formatDate(selectedData.payments?.tgl_opening || ''),
        lUangMuka: `Uang Muka (${formatUang(selectedData.payments?.persen_dp || 0)}%)`,
        uangMuka: `Rp. ${formatUang(selectedData.payments?.total_dp || 0)}`,
        lSewaPerBulan: 'Cicilan Sewa per bln',
        sewaPerBulan: `Rp. ${formatUang(cicilanPerBulan || 0)}`,

        // Row 6
        lTglSelesai: 'Tgl Selesai',
        tglSelesai: selectedData.payments?.tgl_opening
            ? formatDate(
                dateAddMonthsAddDays(new Date(selectedData.payments?.tgl_opening), totalPeriods ?? 0, -1).toISOString()
            ) : '-',
        lCicilanUM: 'Lama Cicilan UM',
        cicilanUM: `${countDp || 0} bulan`,

        // Signs
        perusahaan: perusahaan,
        signNama: selectedData.payments?.sign?.nama || '',
        signJabatan: selectedData.payments?.sign?.jabatan || '',
        clientPerusahaan: selectedData.perusahaan || '',
        clientNama: selectedData.payments?.client_nama || '',
        clientJabatan: selectedData.payments?.client_jabatan || '',
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);

        setTimeout(async () => {
            try {
                const headerData = await getPdfHeader(0);
                const pdfHeader = headerData?.pdfHeader || [];

                const title = `Skema Pembayaran Sewa`;
                Header({ doc, pdfHeader, title });
                pdfSimulasi({ doc, dataPdf, paymentDps, paymentSewa });

                const filename = `Skema Pembayaran Sewa ${selectedData.nama_toko}`;
                addPageNumbers(doc, filename);

                doc.save(`${filename}.pdf`);
            } catch (error) {
                console.error("Error generating PDF:", error);
            } finally {
                setLoading(false);
            }
        }, 100);
    };

    return (
        <div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-40"
            onClick={closeModal}
        >
            {/* Modal Content */}
            <div
                id="simulasiModal"
                className="bg-white p-6 rounded-lg shadow-lg w-full md:w-4/5 lg:max-w-screen-lg max-h-[80vh] overflow-y-auto z-50"
                onClick={handleModalClick}
            >
                <hr className='mb-4' />

                <div className="flex justify-between items-center mb-4 px-4">
                    <h2 className="text-xl font-bold">Skema Pembayaran Sewa</h2>

                    <div onClick={downloadPDF}
                        className='flex items-center gap-2 cursor-pointer text-white bg-blue-500 py-1 px-2 rounded hover:bg-blue-600 transition-colors'>
                        <span>Dowload</span>
                        <DownloadIcon
                            size={24}
                            className="cursor-pointer font-bold"

                        />
                    </div>
                </div>

                <hr className='mb-4' />

                <div className="mb-6 mx-8">
                    <table className="min-w-full table-auto border-collapse mt-2 text-sm">
                        <tbody>
                            <tr className='font-bold'>
                                <td className="w-fit whitespace-nowrap pr-2">{`Nama Toko`}</td>
                                <td className="w-fit whitespace-nowrap font-bold py-2 text-lg" colSpan={5}>
                                    <span className='pr-1'> : </span>{dataPdf.namaToko}
                                </td>
                            </tr>
                            {/* Row 1 */}
                            <tr>
                                <td className="w-fit whitespace-nowrap pr-2">{dataPdf.lLantai}</td>
                                <td className="w-fit whitespace-nowrap"><span className='pr-1'> : </span> {dataPdf.lantai}</td>
                                <td className="w-24 px-6"></td>
                                <td className="w-fit whitespace-nowrap pr-2">{dataPdf.lUnit}</td>
                                <td className="w-fit whitespace-nowrap"><span className='pr-1'> : </span>{dataPdf.unit}</td>
                                <td className="px-8"></td>
                                <td className="w-fit whitespace-nowrap pr-2">{dataPdf.lTotalAngsuran}</td>
                                <td className="w-fit whitespace-nowrap">
                                    <span className='pr-1'> :&nbsp; Rp. </span>{formatUang(selectedData.payments?.total_cicilan || 0)}
                                </td>
                                <td className="w-full pr-12">{ }</td>
                            </tr>
                            {/* Row 2 */}
                            <tr>
                                <td className="w-fit whitespace-nowrap pr-2">{dataPdf.lLuasIndoor}</td>
                                <td className="w-fit whitespace-nowrap"><span className='pr-1'> : </span>{dataPdf.luasIndoor}</td>
                                <td className=""></td>
                                <td className="w-fit whitespace-nowrap pr-2">{dataPdf.lHargaIndoor}</td>
                                <td className="w-fit whitespace-nowrap"><span className='pr-1'> : </span>{dataPdf.hargaIndoor}</td>
                                <td className="px-8"></td>
                                <td className="w-fit whitespace-nowrap pr-2">{dataPdf.lLamaCicilan}</td>
                                <td className="w-fit whitespace-nowrap"><span className='pr-1'> : </span>{dataPdf.lamaCicilan}</td>
                                <td className="w-full">{ }</td>
                            </tr>
                            {/* Row 3 */}
                            <tr>
                                <td className="w-fit whitespace-nowrap pr-2">{dataPdf.lLuasOutdoor}</td>
                                <td className="w-fit whitespace-nowrap"><span className='pr-1'> : </span>{dataPdf.luasOutdoor}</td>
                                <td className=""></td>
                                <td className="w-fit whitespace-nowrap pr-2">{dataPdf.lHargaOutdoor}</td>
                                <td className="w-fit whitespace-nowrap"><span className='pr-1'> : </span>{dataPdf.hargaOutdoor}</td>
                                <td className="px-8"></td>
                                <td className="w-fit whitespace-nowrap pr-2">{dataPdf.lGracePeriod}</td>
                                <td className="w-fit whitespace-nowrap"><span className='pr-1'> : </span>{dataPdf.gracePeriod}</td>
                                <td className="w-full">{ }</td>
                            </tr>
                            {/* Row 4 */}
                            <tr>
                                <td className="w-fit whitespace-nowrap pr-2">{dataPdf.lLamaSewa}</td>
                                <td className="w-fit whitespace-nowrap"><span className='pr-1'> : </span>{dataPdf.lamaSewa}</td>
                                <td className=""></td>
                                <td className="w-fit whitespace-nowrap pr-2">{dataPdf.lTotalSewa}</td>
                                <td className="w-fit whitespace-nowrap"><span className='pr-1'> : </span>{dataPdf.totalSewa}</td>
                                <td className=""></td>
                                <td className="w-fit whitespace-nowrap pr-2">{dataPdf.lExtendPeriod}</td>
                                <td className="w-fit whitespace-nowrap"><span className='pr-1'> : </span>{dataPdf.extendPeriod}</td>
                                <td className="w-full">{ }</td>
                            </tr>
                            {/* Row 5 */}
                            <tr>
                                <td className="w-fit whitespace-nowrap pr-2">{dataPdf.lTglMulai}</td>
                                <td className="w-fit whitespace-nowrap"><span className='pr-1'> : </span>{dataPdf.tglMulai}</td>
                                <td className=""></td>
                                <td className="w-fit whitespace-nowrap pr-2">{dataPdf.lUangMuka}</td>
                                <td className="w-fit whitespace-nowrap"><span className='pr-1'> : </span>{dataPdf.uangMuka}</td>
                                <td className=""></td>
                                <td className="w-fit whitespace-nowrap pr-2">{dataPdf.lSewaPerBulan}</td>
                                <td className="w-fit whitespace-nowrap"><span className='pr-1'> : </span>{dataPdf.sewaPerBulan}</td>
                                <td className="w-full">{ }</td>
                            </tr>
                            {/* Row 6 */}
                            <tr>
                                <td className="w-fit whitespace-nowrap pr-2">{dataPdf.lTglSelesai}</td>
                                <td className="w-fit whitespace-nowrap"><span className='pr-1'> : </span>{dataPdf.tglSelesai}</td>
                                <td className=""></td>
                                <td className="w-fit whitespace-nowrap pr-2">{dataPdf.lCicilanUM}</td>
                                <td className="w-fit whitespace-nowrap"><span className='pr-1'> : </span>{dataPdf.cicilanUM}</td>
                                <td className=""></td>
                                <td className="w-fit whitespace-nowrap pr-2"></td>
                                <td className="w-fit whitespace-nowrap"></td>
                                <td className="w-full">{ }</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <hr className='mb-4' />

                <div className="mb-6 mx-4">
                    <h3 className="font-semibold">Uang Muka</h3>
                    <table className="min-w-full table-auto border-collapse border border-gray-300 mt-2 text-sm">
                        <thead>
                            <tr>
                                <th className="border px-2 py-1 text-center">Ke</th>
                                <th className="border px-2 py-1 text-center">Tanggal</th>
                                <th className="border px-2 py-1 text-center">Keterangan</th>
                                <th className="border px-2 py-1 text-center">Persen</th>
                                <th className="border px-2 py-1 text-center">Jumlah</th>
                                <th className="border px-2 py-1 text-center">Sisa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paymentDps.map((dp, index) => (
                                <tr key={index} className='hover:bg-gray-200 transition-colors'>
                                    <td className="border px-2 py-1 text-center">{index + 1}</td>
                                    <td className="border px-2 py-1 text-center">{formatDate(dp.tgl)}</td>
                                    <td className="border px-2 py-1 text-center">{dp.ket}</td>
                                    <td className="border px-2 py-1 text-center">{dp.persen} %</td>
                                    <td className="border px-2 py-1 text-right">{formatUang(dp.jumlah)}</td>
                                    <td className="border px-2 py-1 text-right">{formatUang(dp.sisa)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <hr className='mb-4' />

                <div className='mx-4'>
                    <h3 className="font-semibold">Cicilan Sewa</h3>
                    <table className="min-w-full table-auto border-collapse border border-gray-300 mt-2 text-sm font">
                        <thead>
                            <tr>
                                <th className="border px-2 py-1">Ke</th>
                                <th className="border px-2 py-1">Tanggal</th>
                                <th className="border px-2 py-1">Keterangan</th>
                                <th className="border px-2 py-1">Jumlah</th>
                                <th className="border px-2 py-1">Sisa</th>
                                <th className="border px-2 py-1">SC</th>
                                <th className="border px-2 py-1">Levy</th>
                                <th className="border px-2 py-1">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paymentSewa.map((sewa, index) => (
                                <tr key={index} className='hover:bg-gray-200 transition-colors'>
                                    <td className="border px-2 py-1 text-center">{sewa.ke}</td>
                                    <td className="border px-2 py-1 text-center">{formatDate(sewa.tgl)}</td>
                                    <td className="border px-2 py-1 text-center">{sewa.ket}</td>
                                    <td className="border px-2 py-1 text-right">{formatUang(sewa.jumlah)}</td>
                                    <td className="border px-2 py-1 text-right">{formatUang(sewa.sisa)}</td>
                                    <td className="border px-2 py-1 text-right">{formatUang(sewa.sc || 0)}</td>
                                    <td className="border px-2 py-1 text-right">{formatUang(sewa.levy || 0)}</td>
                                    <td className="border px-2 py-1 text-right">{formatUang(sewa.total || 0)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Sign */}
                <hr className='mb-4 mt-6 ' />
                <div className='mx-4 mb-10'>
                    <div className='flex justify-between mx-24 mt-4'>
                        <div className='text-center'>
                            <h3 className="mb-12 font-semibold">{dataPdf.perusahaan}</h3>
                            <p className='font-bold'>{dataPdf.signNama}</p>
                            <p className='italic'>{dataPdf.signJabatan}</p>
                        </div>
                        <div className='text-center'>
                            <h3 className="mb-12 font-semibold">{dataPdf.clientPerusahaan}</h3>
                            <p className='font-bold'>{dataPdf.clientNama}</p>
                            <p className='italic'>{dataPdf.clientJabatan}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SimulasiModal;
