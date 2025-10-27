import { formatDigit } from '@/pages/components/helpers';
import React from 'react';
import { GudangMasuk } from '../models';
import { formatTgl } from '@/pages/components/functions';


interface Props {
    filteredData: GudangMasuk[];
}

const HutangTable: React.FC<Props> = ({ filteredData }) => {
    return (
        <table className="bg-white shadow-md rounded-md min-w-full">
            <thead>
                <tr className="bg-gray-300 border border-gray-300">
                    <th className="py-2 px-2 text-center border border-black" rowSpan={2}>#</th>
                    <th className="py-2 px-2 text-center border border-black w-28" rowSpan={2}>Tanggal <br />Terima</th>
                    <th className="py-2 px-2 text-center border border-black w-28" rowSpan={2}>Jatuh <br />Tempo</th>
                    <th className="py-2 px-2 text-center border border-black" rowSpan={2}>Supplier</th>
                    <th className="py-2 px-2 text-center border border-black" colSpan={4}>Detail Barang</th>
                    <th className="py-2 px-2 text-center border border-black" rowSpan={2}>Total Rp.</th>
                </tr>
                <tr className="bg-gray-300 border border-gray-300">
                    <th className="py-2 px-2 text-center border border-black w-48">Deskripsi</th>
                    <th className="py-2 px-2 text-center border border-black w-20">Harga</th>
                    <th className="py-2 px-2 text-center border border-black w-20">Qty</th>
                    <th className="py-2 px-2 text-center border border-black w-28">Subtotal Rp.</th>
                </tr>
            </thead>
            <tbody>
                {filteredData.length === 0 && (
                    <tr>
                        <td colSpan={8} className="py-2 px-2 text-center border border-black">
                            Tidak ada data...
                        </td>
                    </tr>
                )}

                {filteredData.length > 0 && filteredData.map((v, index) => (
                    <tr key={v.id} className='hover:bg-blue-300'>
                        <td className="py-2 px-2 text-center border border-black">{index + 1}</td>
                        <td className="py-2 px-2 text-center border border-black whitespace-nowrap">{formatTgl(v.tgl || '')}</td>
                        <td className="py-2 px-2 text-center border border-black whitespace-nowrap">{formatTgl(v.due || '')}</td>
                        <td className="py-2 px-2 text-left border border-black whitespace-nowrap">{v.supplier?.nama}</td>
                        <td className="py-2 px-2 text-left border border-black whitespace-nowrap">
                            {v.details?.map((det) => (
                                <div key={det.id}>
                                    {det.barang?.deskripsi}
                                </div>
                            ))}
                        </td>
                        <td className="py-2 px-2 text-right border border-black font-mono">
                            {v.details?.map((det) => (
                                <div key={det.id}>
                                    {formatDigit(det.harga || 0, 2)}
                                </div>
                            ))}
                        </td>
                        <td className="py-2 px-2 text-center border border-black font-mono">
                            {v.details?.map((det) => (
                                <div key={det.id}>
                                    {formatDigit(det.qty || 0, 2)}
                                </div>
                            ))}
                        </td>
                        <td className="py-2 px-2 text-right border border-black font-mono">
                            {v.details?.map((det) => (
                                <div key={det.id}>
                                    {formatDigit(det.total || 0, 2)}
                                </div>
                            ))}
                        </td>
                        <td className="py-2 px-2 text-right border border-black font-mono">{formatDigit(v.total, 2)}</td>
                    </tr>
                ))}
            </tbody>

            <tfoot>
                <tr className='bg-blue-200 text-lg font-bold'>
                    <td colSpan={8} className="py-2 px-2 text-right border border-black font-bold">Total Hutang</td>
                    <td className="py-2 px-2 text-right border border-black font-mono">{formatDigit(filteredData.reduce((acc, item) => acc + +item.total, 0), 2)}</td>
                </tr>
            </tfoot>
        </table>
    );
}

export default HutangTable;
