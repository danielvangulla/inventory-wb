import { useState } from "react";
import { PrinterCheck, Search } from "lucide-react";
import { Button } from "@headlessui/react";
import { formatUang } from "@/pages/components/helpers";
import { KuitansiList } from "../models";

interface Props {
    dataDetail: KuitansiList[];
    setLoading: (loading: boolean) => void;
}

const Details: React.FC<Props> = ({ dataDetail, setLoading }) => {
    // State for search query
    const [searchQuery, setSearchQuery] = useState('');

    // Filter tenantBooks based on search query
    const filteredDetails = dataDetail.filter((v) => {
        const namaToko = (v.nama_toko ?? '').toLowerCase();
        const perusahaan = (v.perusahaan ?? '').toLowerCase();
        const keterangan = (v.keterangan ?? '').toLowerCase();
        const noKuitansi = (v.no_kuitansi ?? '').toLowerCase();
        const tipeKuitansi = (v.tipe ?? '').toLowerCase();

        return (
            namaToko.includes(searchQuery.toLowerCase()) ||
            perusahaan.includes(searchQuery.toLowerCase()) ||
            keterangan.includes(searchQuery.toLowerCase()) ||
            noKuitansi.includes(searchQuery.toLowerCase()) ||
            tipeKuitansi.includes(searchQuery.toLowerCase())
        );
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
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400" >No. Kuitansi</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400" >Tanggal</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400" >Tenant</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400" >Perusahaan</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400" >Jenis</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400" >Keterangan</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400" >Jumlah</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400" >Tanggal Bayar</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs">
                            {filteredDetails.map((v, i) => (
                                <tr key={i} className='hover:bg-blue-300 dark:hover:bg-gray-600'>
                                    <td className="py-2 px-1 text-center border border-black dark:border-gray-400 whitespace-nowrap">{i + 1}</td>
                                    <td className="py-2 px-2 text-center border border-black dark:border-gray-400 whitespace-nowrap">{v.no_kuitansi}</td>
                                    <td className="py-2 px-2 text-center border border-black dark:border-gray-400 whitespace-nowrap">{v.tgl}</td>
                                    <td className="py-2 px-2 text-left border border-black dark:border-gray-400 whitespace-nowrap">{v.nama_toko}</td>
                                    <td className="py-2 px-2 text-left border border-black dark:border-gray-400 whitespace-nowrap">{v.perusahaan}</td>
                                    <td className="py-2 px-2 text-left border border-black dark:border-gray-400 whitespace-nowrap">
                                        {v.tipe.charAt(0).toUpperCase() + v.tipe.slice(1)}
                                    </td>
                                    <td className="py-2 px-2 text-left border border-black dark:border-gray-400 w-96">{v.keterangan}</td>
                                    <td className="py-2 px-2 text-right border border-black dark:border-gray-400 whitespace-nowrap">{formatUang(v.jumlah)}</td>
                                    <td className="py-2 px-2 text-center border border-black dark:border-gray-400 whitespace-nowrap">-</td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>

            </div>
    );
};

export default Details;
