import React from "react";
import { SewaInvoice } from "./model";
import { Button } from "@headlessui/react";
import { PrinterIcon } from "lucide-react";
import { formatTgl } from "@/pages/components/functions";
import { formatUang } from "@/pages/components/helpers";

interface PreviewPdfProps {
    isGuest: boolean;
    invoice: SewaInvoice;
    downloadPDF: (isSigned: boolean) => void;
    closeModal: () => void;
}

const PreviewPdf: React.FC<PreviewPdfProps> = ({ isGuest, invoice, downloadPDF, closeModal }) => {
    return (
        <div className="bg-white p-2 rounded shadow-md w-full md:w-2/3 max-w-2xl mx-2">
            <div className='flex justify-center items-center bg-blue-100 text-black px-1 py-2 rounded-t text-xs'>

                <table className="mx-2">
                    <tbody>
                        <tr >
                            <td className="text-left" width={60}><b>Kepada :</b></td>
                            <td className="text-center" width={25}></td>
                            <td className="text-left whitespace-nowrap min-w-4xs lg:min-w-3xs max-w-2xs"></td>
                            <td className="text-left pl-4 whitespace-nowrap"><b>Invoice No.</b></td>
                            <td className="text-center" width={15}>:</td>
                            <td className="text-left whitespace-nowrap">{invoice.no}</td>
                        </tr>
                        <tr >
                            <td className="text-left pl-4" colSpan={3}>{invoice.tenant_book?.nama_toko}</td>
                            <td className="text-left pl-4 whitespace-nowrap"><b>Invoice Date</b></td>
                            <td className="text-center" width={15}>:</td>
                            <td className="text-left whitespace-nowrap">{formatTgl(invoice.tgl)}</td>
                        </tr>
                        <tr >
                            <td className="text-left pl-4 max-w-3xs" colSpan={3}>{invoice.tenant_book?.perusahaan}</td>
                            <td className="text-left pl-4 whitespace-nowrap"><b>Invoice Due</b></td>
                            <td className="text-center" width={15}>:</td>
                            <td className="text-left whitespace-nowrap">{formatTgl(invoice.due)}</td>
                        </tr>
                        <tr >
                            <td className="text-left pl-4 max-w-3xs" colSpan={3}>{invoice.tenant_book?.alamat}</td>
                        </tr>
                        <tr>
                            <td className='py-2'></td>
                        </tr>
                        <tr >
                            <td className="text-left" width={60} colSpan={3}><b>Attn :</b></td>
                            <td className="text-left pl-4 whitespace-nowrap"><b>Currency</b></td>
                            <td className="text-center" width={15}>:</td>
                            <td className="text-left whitespace-nowrap">{invoice.curr}</td>
                        </tr>
                        <tr >
                            <td className="text-left pl-4 max-w-3xs" colSpan={3}>{`{Nama Owner / Pemilik}`}</td>
                            <td className="text-left pl-4 whitespace-nowrap"><b>Unit No.</b></td>
                            <td className="text-center" width={15}>:</td>
                            <td className="text-left whitespace-nowrap">Lt.{invoice.tenant_book?.tenant?.floor} #{invoice.tenant_book?.tenant?.no}</td>
                        </tr>
                    </tbody>
                </table>

            </div>

            <div className='flex justify-center items-center bg-blue-100 text-black pt-1 px-2 lg:px-12 text-xs font-mono'>
                <table className="min-w-full border-collapse">
                    <thead className="border-y border-l border-r border-gray-300 text-md">
                        <tr>
                            <th className="px-2 py-1 text-left">Keterangan</th>
                            {invoice.omset && invoice.omset > 0 && <th className="px-2 py-1 text-center">Revenue</th>}
                            <th className="px-2 py-1 text-center">
                                {invoice.omset && invoice.omset > 0 && 'Share'}
                            </th>
                            <th className="px-2 py-1 text-right">Jumlah</th>
                        </tr>
                    </thead>
                    <tbody className="border-y border-l border-r border-gray-300">
                        {invoice.is_dp === 2 && <>
                            <tr className='hover:bg-gray-100'>
                                <td className="px-2 text-left">Deposit Sewa</td>
                                <td className="px-2 text-right"></td>
                                <td className="px-2 text-right">{formatUang(invoice.deposit_sewa || 0)}</td>
                            </tr>
                            <tr className='hover:bg-gray-100'>
                                <td className="px-2 text-left">Deposit Service</td>
                                <td className="px-2 text-right"></td>
                                <td className="px-2 text-right">{formatUang(invoice.deposit_service || 0)}</td>
                            </tr>
                            <tr className='hover:bg-gray-100'>
                                <td className="px-2 text-left">Deposit Telepon</td>
                                <td className="px-2 text-right"></td>
                                <td className="px-2 text-right">{formatUang(invoice.deposit_telp || 0)}</td>
                            </tr>
                            <tr className='hover:bg-gray-100 border-t border-gray-300 font-bold text-md'>
                                <td className="px-2 pt-1 pb-1 text-left">Total Deposit</td>
                                <td className="px-2 pb-2 text-right"></td>
                                <td className="px-2 pb-2 text-right">{formatUang(invoice.total_deposit || 0)}</td>
                            </tr>

                            {(invoice.deposit_count && invoice.deposit_count > 1) === true &&
                                <tr className='hover:bg-gray-100'>
                                    <td className="px-2 pt-2 text-left italic">(Deposit akan ditagihkan {invoice.deposit_count} kali)</td>
                                    <td className="px-2 text-right"></td>
                                    <td className="px-2 text-right"></td>
                                </tr>
                            }
                        </>}

                        {((invoice.deposit_count && invoice.deposit_count > 1) || invoice.is_dp !== 2) &&
                            <tr className='hover:bg-gray-100'>
                                <td className="px-2 text-left w-full">{invoice.keterangan}</td>
                                <td className="px-2 text-center">{invoice.omset && invoice.omset > 0 && formatUang(invoice.omset)}</td>
                                {invoice.omset && invoice.omset > 0 && <td className="px-2 text-center">{formatUang(invoice.share_persen || 0)}%</td>}
                                <td className="px-2 flex justify-between"> <span className="pl-4">Rp.</span> {formatUang(invoice.jumlah)}</td>
                            </tr>
                        }

                        {invoice.diskon_jumlah > 0 && (
                            <tr className='hover:bg-gray-100'>
                                <td className="px-2 text-left">{invoice.diskon_ket}</td>
                                <td className="px-2 text-right"></td>
                                <td className="px-2 text-right">({formatUang(invoice.diskon_jumlah)})</td>
                            </tr>
                        )}

                        {invoice.biaya_jumlah > 0 && (
                            <tr className='hover:bg-gray-100'>
                                <td className="px-2 text-left">{invoice.biaya_ket}</td>
                                <td className="px-2 text-right"></td>
                                <td className="px-2 text-right">{formatUang(invoice.biaya_jumlah)}</td>
                            </tr>
                        )}

                        {invoice.ppn_jumlah > 0 && (
                            <tr className='hover:bg-gray-100'>
                                <td className="px-2 text-left">PPN</td>
                                <td className="px-2 text-right"></td>
                                {invoice.omset && invoice.omset > 0 && <td className="px-2 text-right"></td>}
                                <td className="px-2 text-right">{formatUang(invoice.ppn_jumlah)}</td>
                            </tr>
                        )}

                        <tr className='hover:bg-gray-100'>
                            <td className="px-2 pb-1 text-left">Materai</td>
                            <td className="px-2 text-right"></td>
                            {invoice.omset && invoice.omset > 0 && <td className="px-2 text-right"></td>}
                            <td className="px-2 text-right">{formatUang(invoice.materai)}</td>
                        </tr>
                    </tbody>
                    <tfoot className="border-y border-l border-r border-gray-300">
                        <tr className='hover:bg-gray-100 font-bold text-md'>
                            <td className="px-2 py-1 text-left w-full">Total</td>
                            <td className="px-2 py-1 text-right"></td>
                            {invoice.omset && invoice.omset > 0 && <td className="px-2 text-right"></td>}
                            <td className="px-2 py-1 flex justify-between w-48"><span className="pl-4">Rp.</span>{formatUang(invoice.total)}</td>
                        </tr>
                    </tfoot>
                </table>
                <br />
            </div>

            <div className='flex justify-center items-center bg-blue-100 text-black pt-1 px-12 text-xs'>
                <span className='font-bold'>## {invoice.terbilang} ##</span>
            </div>

            <div className='flex justify-center items-center bg-blue-100 text-black pt-4 px-12 text-xs'>
                <table className="min-w-full border-collapse">
                    <tbody className="">
                        <tr className=''>
                            <td className="px-2 text-left">Pembayaran dilakukan ke Rekening Berikut :</td>
                            <td className="px-2 text-right"></td>
                            <td className="px-2 text-right"></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className='flex justify-center items-center bg-blue-100 text-black mb-2 pb-2 pl-18 text-xs'>
                <table className="min-w-full border-collapse">
                    <tbody className="">
                        <tr className=''>
                            <td className="px-2 text-left w-2 whitespace-nowrap">Bank</td>
                            <td className="px-2 text-left w-0.5">:</td>
                            <td className="px-2 text-left w-3 whitespace-nowrap">{invoice.rekening?.bank}</td>
                            <td></td>
                        </tr>
                        <tr className=''>
                            <td className="px-2 text-left w-2 whitespace-nowrap">Nomor Rekening</td>
                            <td className="px-2 text-left w-0.5">:</td>
                            <td className="px-2 text-left w-3 whitespace-nowrap">{invoice.rekening?.norek}</td>
                            <td></td>
                        </tr>
                        <tr className=''>
                            <td className="px-2 text-left w-2 whitespace-nowrap">Nama Rekening</td>
                            <td className="px-2 text-left w-0.5">:</td>
                            <td className="px-2 text-left w-3 whitespace-nowrap">{invoice.rekening?.nama}</td>
                            <td></td>
                        </tr>
                        <tr className=''>
                            <td className="px-2 text-left w-2 whitespace-nowrap">Cabang</td>
                            <td className="px-2 text-left w-0.5">:</td>
                            <td className="px-2 text-left w-full whitespace-nowrap">{invoice.rekening?.cabang}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center gap-4">
                <Button
                    onClick={() => downloadPDF(true)}
                    className="bg-blue-700 hover:bg-blue-400 text-white py-2 px-4 rounded-md flex items-center gap-2 cursor-pointer"
                >
                    <PrinterIcon className="w-4 h-4" />
                    <span>{isGuest ? `Download PDF` : `Signed PDF`}</span>
                </Button>

                {!isGuest &&
                    <Button
                        onClick={() => downloadPDF(false)}
                        className="bg-blue-700 hover:bg-blue-400 text-white py-2 px-4 rounded-md flex items-center gap-2 cursor-pointer"
                    >
                        <PrinterIcon className="w-4 h-4" />
                        <span>Unsigned PDF</span>
                    </Button>}

                {!isGuest &&
                    <Button
                        className="bg-gray-300 hover:bg-gray-500 text-black py-2 px-4 rounded-md cursor-pointer"
                        onClick={closeModal}
                    >
                        Close
                    </Button>}
            </div>
        </div>
    );
}

export default PreviewPdf;
