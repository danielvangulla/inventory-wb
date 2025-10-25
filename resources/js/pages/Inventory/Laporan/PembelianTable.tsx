import React from 'react'
import { GudangMasukDetail } from '../models';
import { formatTgl } from '@/pages/components/functions';
import { formatDigit } from '@/pages/components/helpers';

interface Props {
    filteredData: GudangMasukDetail[];
}

const PembelianTable: React.FC<Props> = ({ filteredData }) => {
    return (
        <table className="bg-white shadow-md rounded-md min-w-full">
            <thead>
                <tr className="bg-gray-300 border border-gray-300 dark:border-gray-600">
                    <th className="py-2 px-2 text-center border border-black dark:border-gray-400">#</th>
                    <th className="py-2 px-2 text-center border border-black dark:border-gray-400">Tanggal</th>
                    <th className="py-2 px-2 text-center border border-black dark:border-gray-400">Supplier</th>
                    <th className="py-2 px-2 text-center border border-black dark:border-gray-400">Deskripsi</th>
                    <th className="py-2 px-2 text-center border border-black dark:border-gray-400">Harga</th>
                    <th className="py-2 px-2 text-center border border-black dark:border-gray-400">Qty</th>
                    <th className="py-2 px-2 text-center border border-black dark:border-gray-400">Total Rp.</th>
                </tr>
            </thead>
            <tbody>
                {filteredData.length === 0 && (
                    <tr>
                        <td colSpan={8} className="py-2 px-2 text-center border border-black dark:border-gray-400">
                            Tidak ada data...
                        </td>
                    </tr>
                )}

                {filteredData.length > 0 && filteredData.map((v, index) => (
                    <tr key={v.id} className='hover:bg-blue-300 dark:hover:bg-gray-600'>
                        <td className="py-2 px-2 text-center border border-black dark:border-gray-400">{index + 1}</td>
                        <td className="py-2 px-2 text-center border border-black dark:border-gray-400">{formatTgl(v.gudang_masuk?.tgl || '')}</td>
                        <td className="py-2 px-2 text-left border border-black dark:border-gray-400">{v.gudang_masuk?.supplier?.nama}</td>
                        <td className="py-2 px-2 text-left border border-black dark:border-gray-400">
                            <span className='text-xs italic'>{v.barang?.kategori?.ket} / {v.barang?.kategorisub?.ket}</span>
                            <br />
                            {v.barang?.deskripsi}
                        </td>
                        <td className="py-2 px-2 text-right border border-black dark:border-gray-400 font-mono">
                            {formatDigit(v.qty, 2)} <span className='text-xs'>{v.barang?.satuan}</span>
                        </td>
                        <td className="py-2 px-2 text-right border border-black dark:border-gray-400 font-mono">{formatDigit(v.harga, 2)}</td>
                        <td className="py-2 px-2 text-right border border-black dark:border-gray-400 font-mono">{formatDigit(v.total, 2)}</td>
                    </tr>
                ))}
            </tbody>

            <tfoot>
                <tr className='bg-blue-200 text-lg font-bold'>
                    <td colSpan={5} className="py-2 px-2 text-right border border-black dark:border-gray-400 font-bold">Total Pembelian</td>
                    <td className="py-2 px-2 text-center border border-black dark:border-gray-400 font-mono">{formatDigit(filteredData.reduce((acc, item) => acc + +item.qty, 0), 2)}</td>
                    <td className="py-2 px-2 text-right border border-black dark:border-gray-400 font-mono">{formatDigit(filteredData.reduce((acc, item) => acc + +item.total, 0), 2)}</td>
                </tr>
            </tfoot>
        </table>
    )
}

export default PembelianTable
