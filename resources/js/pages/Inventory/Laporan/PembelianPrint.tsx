/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatTgl } from '@/pages/components/functions';
import { formatDigit } from '@/pages/components/helpers';
import { Barang, GudangMasukDetail, Kategori, Supplier } from '../models';

interface Props {
    data: GudangMasukDetail[];
    barangs: Barang[];
    suppliers: Supplier[];
    kategoris: Kategori[];
    params: any[];
}

const LaporanPembelian: React.FC<Props> = ({ data, barangs, suppliers, kategoris, params }) => {
    console.log({data, params});

    const kategorisub = kategoris.find(k => k.id == params[4])?.kategorisubs || [];

    const filterByBarang = (currentData: GudangMasukDetail[], barangId: number) => {
        if (barangId == 0) return currentData;
        return currentData.filter(item => item.barang_id == barangId);
    }

    const filterBySupplier = (currentData: GudangMasukDetail[], supplierId: number) => {
        if (supplierId == 0) return currentData;
        return currentData.filter(item => item.gudang_masuk?.supplier_id == supplierId);
    };

    const filterByKategori = (currentData: GudangMasukDetail[], kategoriId: number) => {
        if (kategoriId == 0) return currentData;
        return currentData.filter(item => item.barang?.kategori_id == kategoriId);
    };

    const filterByKategorisub = (currentData: GudangMasukDetail[], kategorisubId: number) => {
        if (kategorisubId == 0) return currentData;
        return currentData.filter(item => item.barang?.kategorisub_id == kategorisubId);
    };

    const finalFilteredData = (
        barangId: number,
        supplierId: number,
        kategoriId: number,
        kategorisubId: number,
    ) => {
        const filter1 = filterByBarang(data, barangId);
        const filter2 = filterBySupplier(filter1, supplierId);
        const filter3 = filterByKategori(filter2, kategoriId);
        const filter4 = filterByKategorisub(filter3, kategorisubId);

        console.log({data, filter1, filter2, filter3, filter4, params});

        return filter4;
    }

    const filteredData = finalFilteredData(
        params[2],
        params[3],
        params[4],
        params[5],
    );

    const hasFilter = params[2] != 0 || params[3] != 0 || params[4] != 0 || params[5] != 0;

    return (
        <div className="w-full h-screen bg-white px-4 py-2 mx-auto text-xs text-black">

            <div className="w-full flex flex-col items-center justify-center mt-4">
                <div className="text-xl font-semibold">Laporan Pembelian</div>
                <div className="text-lg font-semibold">Periode : {formatTgl(params[0])} - {formatTgl(params[1])}</div>
                {hasFilter && <div className="text-md">
                    Filters: <span className='italic font-bold text-xs text-blue-500'>
                        {params[2] != 0 && (
                            <>{barangs.find(b => b.id == params[2])?.deskripsi} </>
                        )}
                        {params[3] != 0 && (
                            <> | {suppliers.find(s => s.id == params[3])?.nama} </>
                        )}
                        {params[4] != 0 && (
                            <> | {kategoris.find(k => k.id == params[4])?.ket} </>
                        )}
                        {params[5] != 0 && (
                            <> | {kategorisub.find(ks => ks.id == params[5])?.ket} </>
                        )}
                    </span>
                </div>}
            </div>

            <div className="w-full overflow-x-auto h-full text-sm mt-4">
                <table className="bg-white shadow-md rounded-md min-w-full">
                    <thead>
                        <tr className="bg-gray-400 border border-gray-300">
                            <th className="py-2 px-2 text-center border border-black whitespace-nowrap">#</th>
                            <th className="py-2 px-2 text-center border border-black whitespace-nowrap">Tanggal</th>
                            <th className="py-2 px-2 text-center border border-black whitespace-nowrap">Supplier</th>
                            <th className="py-2 px-2 text-center border border-black whitespace-nowrap">Deskripsi</th>
                            <th className="py-2 px-2 text-center border border-black whitespace-nowrap">Harga</th>
                            <th className="py-2 px-2 text-center border border-black whitespace-nowrap">Qty</th>
                            <th className="py-2 px-2 text-center border border-black whitespace-nowrap">Total Rp.</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length === 0 && (
                            <tr>
                                <td colSpan={8} className="py-2 px-2 text-center border border-black ">
                                    Tidak ada data...
                                </td>
                            </tr>
                        )}

                        {filteredData.length > 0 && filteredData.map((v, index) => (
                            <tr key={v.id} className="odd:bg-white even:bg-gray-200 border border-gray-300">
                                <td className="py-1 px-2 text-center border border-black whitespace-nowrap">{index + 1}</td>
                                <td className="py-1 px-2 text-center border border-black whitespace-nowrap">{formatTgl(v.gudang_masuk?.tgl || '')}</td>
                                <td className="py-1 px-2 text-left border border-black whitespace-nowrap">{v.gudang_masuk?.supplier?.nama}</td>
                                <td className="py-1 px-2 text-left border border-black min-w-64 whitespace-nowrap">
                                    <span className='text-xs italic'>{v.barang?.kategori?.ket} / {v.barang?.kategorisub?.ket}</span>
                                    <br />
                                    {v.barang?.deskripsi}
                                </td>
                                <td className="py-1 px-2 text-right border border-black font-mono whitespace-nowrap">
                                    {formatDigit(v.qty, 2)} <span className='text-xs'>{v.barang?.satuan}</span>
                                </td>
                                <td className="py-1 px-2 text-right border border-black font-mono whitespace-nowrap">{formatDigit(v.harga, 2)}</td>
                                <td className="py-1 px-2 text-right border border-black font-mono whitespace-nowrap">{formatDigit(v.total, 2)}</td>
                            </tr>
                        ))}
                    </tbody>

                    <tfoot>
                        <tr className='bg-blue-200 text-lg font-bold'>
                            <td colSpan={6} className="py-2 px-2 text-right border border-black font-bold">Total Rp.</td>
                            <td className="py-2 px-2 text-right border border-black font-mono">{formatDigit(filteredData.reduce((acc, item) => acc + item.harga * item.qty, 0), 2)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

export default LaporanPembelian;
