import { useState } from "react";
import { pendapatanDetail } from "../models";
import { PrinterCheck, Search } from "lucide-react";
import { Button } from "@headlessui/react";
import { formatUang } from "@/pages/components/helpers";

interface Props {
    dataDetail: pendapatanDetail[];
    setLoading: (loading: boolean) => void;
}

const Details: React.FC<Props> = ({ dataDetail, setLoading }) => {
    // State for search query
    const [searchQuery, setSearchQuery] = useState('');

    // Filter tenantBooks based on search query
    const filteredDetails = dataDetail.filter((v) => {
        const toko = (v.toko ?? '').toLowerCase();
        const jenis = (v.jenis ?? '').toLowerCase();
        const ket = (v.ket ?? '').toLowerCase();
        const no = (v.no ?? '').toLowerCase();

        return (
            toko.includes(searchQuery.toLowerCase()) ||
            jenis.includes(searchQuery.toLowerCase()) ||
            ket.includes(searchQuery.toLowerCase()) ||
            no.includes(searchQuery.toLowerCase())
        );
    });

    const filteredDetailsSum = filteredDetails.reduce((acc, curr) => {
        acc.jumlah += +curr.jumlah;
        acc.ppn += +curr.ppn;
        acc.materai += +curr.materai;
        acc.total += +curr.total;
        acc.pot_pph += +curr.pot_pph;
        acc.bayar += +curr.bayar;
        return acc;
    }, {
        jumlah: 0,
        ppn: 0,
        materai: 0,
        total: 0,
        pot_pph: 0,
        bayar: 0
    });

    const handleDownloadPDF = () => {
        setLoading(true);
        console.log('Downloading PDF...');

        setTimeout(() => {
            setLoading(false);
        }, 2000);
    };

    const handleDownloadExcel = () => {
        setLoading(true);
        console.log('Downloading Excel...');

        setTimeout(() => {
            setLoading(false);
        }, 2000);
    };

    return (
        <div className="px-4 py-2 max-w-lg md:max-w-xl lg:max-w-3xl xl:max-w-5xl 2xl:max-w-full mx-auto">
                {/* Search input with magnifier icon */}
                <div className="w-full flex flex-row gap-2">
                    <div className="absolute pl-2 pt-3">
                        <Search size={20} className="text-gray-500 dark:text-gray-300" />
                    </div>
                    <div className="w-full mb-4">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari Nama Tenant, Perusahaan, No. Invoice..."
                            className="w-full pl-10 pr-4 py-2 rounded-md border-2 border-gray-500 dark:border-gray-300 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <Button title='Download PDF' onClick={handleDownloadPDF}
                        className="flex flex-col justify-center items-center bg-blue-500 hover:bg-blue-700 cursor-pointer hover:underline hover:text-gray-300 dark:text-white dark:hover:text-white text-white px-2 py-1 rounded-md mb-4"
                    >
                        <PrinterCheck size={20} />
                        <span className='text-xs'>PDF</span>
                    </Button>

                    <Button title='Download Excel' onClick={handleDownloadExcel}
                        className="flex flex-col justify-center items-center bg-green-500 hover:bg-green-700 cursor-pointer hover:underline hover:text-gray-300 dark:text-white dark:hover:text-white text-white px-2 py-1 rounded-md mb-4"
                    >
                        <PrinterCheck size={20} />
                        <span className='text-xs'>XLS</span>
                    </Button>
                </div>

                <div className="overflow-x-auto h-full text-sm">
                    {/* Adjust the width calculation to take the sidebar width into account */}
                    <table className="bg-white dark:bg-gray-800 shadow-md rounded-md min-w-full tracking-wide">
                        <thead>
                            <tr className="bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400" >#</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400" >Tanggal</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400" >No. Invoice</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400" >Keterangan Tenant</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400" >Jumlah</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400" >PPN</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400" >Materai</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400" >Total</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400" >Pot.PPh</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400" >Tagihan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDetails.map((v, i) => (
                                <tr key={i} className='hover:bg-blue-300 dark:hover:bg-gray-600'>
                                    <td className="py-2 px-1 text-center border border-black dark:border-gray-400 whitespace-nowrap">
                                        {i + 1}
                                    </td>
                                    <td className="py-2 px-1 text-center border border-black dark:border-gray-400 whitespace-nowrap">
                                        {v.tgl}
                                    </td>
                                    <td className="py-2 px-1 text-left border border-black dark:border-gray-400 whitespace-nowrap">
                                        <span className="italic text-xs">invoice {v.jenis}</span> <br /> {v.no}
                                    </td>
                                    <td className="py-2 px-2 text-left border border-black dark:border-gray-400 whitespace-nowrap">
                                        <b>{v.toko}</b> <br />
                                        {v.ket}
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

                        <tfoot>
                            <tr className='bg-gray-200 dark:bg-gray-700 font-bold'>
                                <td className="py-2 px-1 text-center border border-black dark:border-gray-400 whitespace-nowrap" colSpan={4}>
                                </td>
                                <td className="py-2 px-2 text-center border border-black dark:border-gray-400 whitespace-nowrap">
                                    <span className="italic text-xs">Jumlah</span> <br />
                                    {formatUang(filteredDetailsSum.jumlah)}
                                </td>
                                <td className="py-2 px-2 text-center border border-black dark:border-gray-400 whitespace-nowrap">
                                    <span className="italic text-xs">PPN</span> <br />
                                    {formatUang(filteredDetailsSum.ppn)}
                                </td>
                                <td className="py-2 px-2 text-center border border-black dark:border-gray-400 whitespace-nowrap">
                                    <span className="italic text-xs">Materai</span> <br />
                                    {formatUang(filteredDetailsSum.materai)}
                                </td>
                                <td className="py-2 px-2 text-center border border-black dark:border-gray-400 whitespace-nowrap">
                                    <span className="italic text-xs">Total</span> <br />
                                    {formatUang(filteredDetailsSum.total)}
                                </td>
                                <td className="py-2 px-2 text-center border border-black dark:border-gray-400 whitespace-nowrap">
                                    <span className="italic text-xs">Pot. PPh</span> <br />
                                    {formatUang(filteredDetailsSum.pot_pph)}
                                </td>
                                <td className="py-2 px-2 text-center border border-black dark:border-gray-400 whitespace-nowrap">
                                    <span className="italic text-xs">Tagihan</span> <br />
                                    {formatUang(filteredDetailsSum.bayar)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

            </div>
    );
};

export default Details;
