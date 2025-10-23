import { formatUang } from "@/pages/components/helpers";
import { pendapatanSum } from "../models";

interface Props {
    dataSummary: pendapatanSum[];
}

const Summary: React.FC<Props> = ({ dataSummary }) => {

    const totalSummary = dataSummary.reduce((acc, curr) => {
        acc.jumlah += curr.jumlah;
        acc.ppn += curr.ppn;
        acc.materai += curr.materai;
        acc.total += curr.total;
        acc.pot_pph += curr.pot_pph;
        acc.bayar += curr.bayar;
        return acc;
    }, {
        jumlah: 0,
        ppn: 0,
        materai: 0,
        total: 0,
        pot_pph: 0,
        bayar: 0
    });

    return (
        <div className="px-4 py-2 max-w-lg md:max-w-xl lg:max-w-3xl xl:max-w-5xl 2xl:max-w-full mx-auto">

            <div className="overflow-x-auto h-full text-sm">
                {/* Adjust the width calculation to take the sidebar width into account */}
                {/* perlebar jarak antar huruf */}
                <table className="bg-white dark:bg-gray-800 shadow-md rounded-md min-w-full text-md tracking-wide">
                    <thead>
                        <tr className="bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                            <th className="py-3 px-2 text-center border border-black dark:border-gray-400 min-w-36" >Keterangan</th>
                            <th className="py-3 px-2 text-center border border-black dark:border-gray-400 min-w-24" >Jumlah</th>
                            <th className="py-3 px-2 text-center border border-black dark:border-gray-400 min-w-24" >PPN</th>
                            <th className="py-3 px-2 text-center border border-black dark:border-gray-400 min-w-24" >Materai</th>
                            <th className="py-3 px-2 text-center border border-black dark:border-gray-400 min-w-24" >Total</th>
                            <th className="py-3 px-2 text-center border border-black dark:border-gray-400 min-w-24" >Pot. PPh</th>
                            <th className="py-3 px-2 text-center border border-black dark:border-gray-400 min-w-24" >Jumlah Bayar</th>
                        </tr>
                    </thead>

                    <tbody className="text-sm">
                        {dataSummary.map((v, i) => (
                            <tr className='hover:bg-blue-300 dark:hover:bg-gray-600' key={i}>
                                <td className="py-2 px-2 text-left border border-black dark:border-gray-400 whitespace-nowrap">
                                    Invoice {v.ket}
                                </td>
                                <td className="py-2 px-2 text-right border border-black dark:border-gray-400 whitespace-nowrap">
                                    {formatUang((v.jumlah))}
                                </td>
                                <td className="py-2 px-2 text-right border border-black dark:border-gray-400 whitespace-nowrap">
                                    {formatUang((v.ppn))}
                                </td>
                                <td className="py-2 px-2 text-right border border-black dark:border-gray-400 whitespace-nowrap">
                                    {formatUang((v.materai))}
                                </td>
                                <td className="py-2 px-2 text-right border border-black dark:border-gray-400 whitespace-nowrap">
                                    {formatUang((v.total))}
                                </td>
                                <td className="py-2 px-2 text-right border border-black dark:border-gray-400 whitespace-nowrap">
                                    {formatUang((v.pot_pph))}
                                </td>
                                <td className="py-2 px-2 text-right border border-black dark:border-gray-400 whitespace-nowrap">
                                    {formatUang((v.bayar))}
                                </td>
                            </tr>
                        ))}
                    </tbody>

                    <tfoot className="font-bold bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                        <tr>
                            <td className="py-3 px-2 text-left border border-black dark:border-gray-400 whitespace-nowrap">

                            </td>
                            <td className="py-3 px-2 text-right border border-black dark:border-gray-400 whitespace-nowrap">
                                {formatUang(totalSummary.jumlah)}
                            </td>
                            <td className="py-3 px-2 text-right border border-black dark:border-gray-400 whitespace-nowrap">
                                {formatUang(totalSummary.ppn)}
                            </td>
                            <td className="py-3 px-2 text-right border border-black dark:border-gray-400 whitespace-nowrap">
                                {formatUang(totalSummary.materai)}
                            </td>
                            <td className="py-3 px-2 text-right border border-black dark:border-gray-400 whitespace-nowrap">
                                {formatUang(totalSummary.total)}
                            </td>
                            <td className="py-3 px-2 text-right border border-black dark:border-gray-400 whitespace-nowrap">
                                {formatUang(totalSummary.pot_pph)}
                            </td>
                            <td className="py-3 px-2 text-right border border-black dark:border-gray-400 whitespace-nowrap">
                                {formatUang(totalSummary.bayar)}
                            </td>
                        </tr>
                    </tfoot>

                </table>
            </div>

        </div>
    );
};

export default Summary;
