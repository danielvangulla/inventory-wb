import React from "react";
import { GudangKeluar } from "../../models";
import { formatTgl } from "@/pages/components/functions";
import { formatDigit } from "@/pages/components/helpers";

interface Props {
    data: GudangKeluar;
}

const Print: React.FC<Props> = ({ data }) => {
    const outlet = data.outlet;

    return (
        <div className="w-full bg-white px-4 py-2 mx-auto text-xs text-black">

            <div className="w-full flex flex-col items-center justify-center mt-4">
                <div className="text-xl font-semibold py-2 underline">SURAT JALAN / PENGAMBILAN BARANG</div>
            </div>

            <div className="w-full flex flex-row items-center justify-center mt-4">

                <div className="w-full flex flex-col items-center justify-center">
                    <div className="text-xl font-semibold">{outlet?.nama}</div>
                    <div className="text-sm">{outlet?.alamat}</div>
                </div>

                <div className="w-full flex flex-row justify-center gap-1 text-xs">
                    <div className="flex flex-col text-right min-w-40">
                        <div className="mb-0.5 font-semibold border border-gray-400 px-2 py-0.5 rounded-sm">Nomor</div>
                        <div className="mb-0.5 font-semibold border border-gray-400 px-2 py-0.5 rounded-sm">Tanggal Keluar</div>
                        <div className="mb-0.5 font-semibold border border-gray-400 px-2 py-0.5 rounded-sm">Menyerahkan</div>
                        <div className="mb-0.5 font-semibold border border-gray-400 px-2 py-0.5 rounded-sm">Mengambil</div>
                    </div>
                    <div className="flex flex-col">
                        <div className="mb-0.5 font-semibold px-2 py-0.5">:</div>
                        <div className="mb-0.5 font-semibold px-2 py-0.5">:</div>
                        <div className="mb-0.5 font-semibold px-2 py-0.5">:</div>
                        <div className="mb-0.5 font-semibold px-2 py-0.5">:</div>
                    </div>
                    <div className="flex flex-col min-w-32">
                        <div className="mb-0.5 border border-gray-400 px-2 py-0.5 rounded-sm">{data.id}</div>
                        <div className="mb-0.5 border border-gray-400 px-2 py-0.5 rounded-sm">{formatTgl(data.tgl)}</div>
                        <div className="mb-0.5 border border-gray-400 px-2 py-0.5 rounded-sm">{data.menyerahkan}</div>
                        <div className="mb-0.5 border border-gray-400 px-2 py-0.5 rounded-sm">{data.mengambil}</div>
                    </div>
                </div>
            </div>

            <div className="w-full overflow-x-auto h-full text-sm mt-4">
                <table className="w-full border-collapse border border-black">
                    <thead>
                        <tr className="bg-gray-300">
                            <th className="border border-black p-3">No</th>
                            <th className="border border-black p-3">Deskripsi Barang</th>
                            <th className="border border-black p-3">Qty</th>
                            <th className="border border-black p-3">Keterangan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.details && data.details.map((detail, index) => (
                            <tr key={detail.id}>
                                <td className="border border-black px-2 py-2 text-center w-12">{index + 1}</td>
                                <td className="border border-black px-2 py-2">{detail.barang?.deskripsi}</td>
                                <td className="border border-black px-2 py-2 text-center">{formatDigit(detail.qty, 2)} {detail.barang?.satuan}</td>
                                <td className="border border-black px-2 py-2"></td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="w-full flex flex-row justify-around items-start gap-1 text-sm mt-8">
                    <div className="flex flex-col items-center justify-center mt-8">
                        <div className="mb-0.5 font-semibold px-2 py-0.5">Yang Menyerahkan,</div>
                        <div className="mb-0.5 font-semibold px-2 pt-16">{data.menyerahkan}</div>
                        <div className="mb-0.5 font-semibold px-2 py-1 border-b border-black w-32"></div>
                    </div>
                    <div className="flex flex-col items-center justify-center mt-8">
                        <div className="mb-0.5 font-semibold px-2 py-0.5">Yang Mengambil,</div>
                        <div className="mb-0.5 font-semibold px-2 pt-16">{data.mengambil}</div>
                        <div className="mb-0.5 font-semibold px-2 py-1 border-b border-black w-32"></div>
                    </div>
                    <div className="flex flex-col items-center justify-center mt-8">
                        <div className="mb-0.5 font-semibold px-2 py-0.5">Yang Menerima,</div>
                        <div className="mb-0.5 font-semibold px-2 pt-16">&nbsp;</div>
                        <div className="mb-0.5 font-semibold px-2 py-1 border-b border-black w-32"></div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Print;
