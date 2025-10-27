/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatTgl } from '@/pages/components/functions';
import { GudangMasuk, Supplier } from '../models';
import HutangTable from './HutangTable';

interface Props {
    data: GudangMasuk[];
    suppliers: Supplier[];
    params: any[];
}

const HutangPrint: React.FC<Props> = ({ data, suppliers, params }) => {
    const filterBySupplier = (currentData: GudangMasuk[], supplierId: number) => {
        if (supplierId == 0) return currentData;
        return currentData.filter(item => item.supplier_id == supplierId);
    };

    const finalFilteredData = (
        supplierId: number,
    ) => {
        const filter1 = filterBySupplier(data, supplierId);
        return filter1;
    }

    const filteredData = finalFilteredData(
        params[2],
    );

    const hasFilter = params[2] != 0 || params[3] != 0 || params[4] != 0 || params[5] != 0;

    return (
        <div className="w-full h-screen bg-white px-4 py-2 mx-auto text-xs text-black">

            <div className="w-full flex flex-col items-center justify-center mt-4">
                <div className="text-xl font-semibold">Laporan Pembelian</div>
                <div className="text-lg font-semibold">Periode : {formatTgl(params[0])} - {formatTgl(params[1])}</div>
                {hasFilter && <div className="text-md">
                    Filters: <span className='italic font-bold text-xs text-blue-500'>
                        {params[3] != 0 && (
                            <> | {suppliers.find(s => s.id == params[3])?.nama} </>
                        )}
                    </span>
                </div>}
            </div>

            <div className="w-full overflow-x-auto h-full text-sm mt-4">
                <HutangTable filteredData={filteredData} />
            </div>
        </div>
    );
};

export default HutangPrint;
