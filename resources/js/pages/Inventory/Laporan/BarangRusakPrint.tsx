/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatTgl } from '@/pages/components/functions';
import { Barang, BarangRusakDetail, Kategori, Supplier } from '../models';
import BarangRusakTable from './BarangRusakTable';

interface Props {
    data: BarangRusakDetail[];
    barangs: Barang[];
    suppliers: Supplier[];
    kategoris: Kategori[];
    params: any[];
}

const BarangRusakPrint: React.FC<Props> = ({ data, barangs, suppliers, kategoris, params }) => {
    const kategorisub = kategoris.find(k => k.id == params[4])?.kategorisubs || [];

    const filterByBarang = (currentData: BarangRusakDetail[], barangId: number) => {
        if (barangId == 0) return currentData;
        return currentData.filter(item => item.barang_id == barangId);
    }

    const filterBySupplier = (currentData: BarangRusakDetail[], supplierId: number) => {
        if (supplierId == 0) return currentData;
        return currentData.filter(item => item.barang_rusak?.supplier_id == supplierId);
    };

    const filterByKategori = (currentData: BarangRusakDetail[], kategoriId: number) => {
        if (kategoriId == 0) return currentData;
        return currentData.filter(item => item.barang?.kategori_id == kategoriId);
    };

    const filterByKategorisub = (currentData: BarangRusakDetail[], kategorisubId: number) => {
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
                <BarangRusakTable filteredData={filteredData} />
            </div>
        </div>
    );
};

export default BarangRusakPrint;
