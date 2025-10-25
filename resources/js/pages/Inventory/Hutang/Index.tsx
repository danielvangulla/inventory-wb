import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Dock, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatTgl } from '@/pages/components/functions';
import { formatDigit } from '@/pages/components/helpers';
import { GudangMasuk } from '../models';
import { LoadingSpinner } from '@/pages/components/loadingSpinner';

interface Props {
    data: GudangMasuk[];
    canWrite: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'DAFTAR HUTANG',
        href: '/inventory/hutang',
    },
];

const Index: React.FC<Props> = ({ data, canWrite }) => {
    const [initData, setInitData] = useState<GudangMasuk[]>(data);

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isLunas, setIsLunas] = useState<boolean>(false);

    const [filteredData, setFilteredData] = useState<GudangMasuk[]>(initData);

    const handleIsLunas = (is_lunas: boolean) => {
        setIsLunas(is_lunas);
        handleSearch(is_lunas, searchQuery);
    };

    const handleSearch = (is_lunas: boolean, query: string) => {
        const filtered = initData.filter(item =>
            item.penerima.toLowerCase().includes(query.toLowerCase()) ||
            item.supplier?.nama.toLowerCase().includes(query.toLowerCase()) ||
            item.details?.some(detail => detail.barang?.deskripsi.toLowerCase().includes(query.toLowerCase()))
        ).filter(item => item.is_lunas == is_lunas);

        setSearchQuery(query);
        setFilteredData(filtered);
    };

    // Initial filter
    useEffect(() => {
        handleSearch(isLunas, searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleBayar = (id: number) => {
        if (!canWrite) {
            alert('Anda tidak memiliki izin untuk proses bayar transaksi ini.');
            return;
        }

        const ket = initData.find(t => t.id === id)?.supplier?.nama || 'Transaksi ini';

        if (confirm(`Set Bayar ${ket} ?`)) {
            setSubmitting(true);
            setError(null);

            try {
                router.post(route("inventory.hutang.store"), {id}, {
                    onSuccess: () => {
                        setInitData(prevData => prevData.map(item => {
                            if (item.id === id) {
                                return { ...item, is_lunas: true, tgl_lunas: new Date().toISOString().split('T')[0]};
                            }
                            return item;
                        }));

                        handleIsLunas(isLunas);
                    },
                    onError: (errors) => {
                        if (errors && typeof errors === "object") {
                            const firstError = Object.values(errors)[0];
                            if (Array.isArray(firstError)) {
                                setError(firstError[0]);
                            } else if (typeof firstError === "string") {
                                setError(firstError);
                            } else {
                                setError("An unknown error occurred.");
                            }
                        } else {
                            setError("An unknown error occurred.");
                        }
                    },
                    onFinish: () => {
                        setSubmitting(false);
                    },
                });
            } catch {
                alert('Terjadi kesalahan saat memproses permintaan.');
            }
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={breadcrumbs[0].title} />

            <div className="w-full px-4 py-2 max-w-lg md:max-w-xl lg:max-w-3xl xl:max-w-5xl 2xl:max-w-full mx-auto">
                <div className="flex flex-row justify-between items-center mb-4">

                    {/* Buat 2 Tab pilihan untuk filter is_lunas. */}
                    {canWrite && <div className="flex flex-row gap-0 text-sm border-2 border-orange-500 rounded-xl overflow-hidden">
                        <button
                            onClick={() => handleIsLunas(true)}
                            className={`w-26 p-1 rounded-l-lg cursor-pointer ${isLunas ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        >
                            Lunas
                        </button>
                        <button
                            onClick={() => handleIsLunas(false)}
                            className={`w-26 p-1 rounded-r-lg cursor-pointer ${!isLunas ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        >
                            Belum Lunas
                        </button>
                    </div>}

                    <div className="mb-2 relative w-64 md:w-96 text-xs md:text-sm">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                            <Search size={20} className="text-gray-500 dark:text-gray-300" />
                        </div>
                        <input
                            type="text"
                            onChange={(e) => handleSearch(isLunas, e.target.value)}
                            placeholder="Cari Penerima / Supplier / Barang..."
                            className="w-full pl-10 pr-4 py-2 rounded-md border-2 border-gray-500 dark:border-gray-300 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {error && <div className="text-red-600 text-center mb-2 p-2 mx-4 rounded-lg bg-red-100">{error}</div>}

                <div className="w-full overflow-x-auto h-full text-sm">
                    <table className="bg-white dark:bg-gray-800 shadow-md rounded-md min-w-full">
                        <thead>
                            <tr className="bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400">#</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400">Tanggal</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400">Penerima</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400">Supplier</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400">Detail Barang</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400">Total Rp.</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400">Jenis Bayar</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400">Jatuh Tempo</th>
                                <th className="py-2 px-2 text-center border border-black dark:border-gray-400">Act.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="py-2 px-2 text-center border border-black dark:border-gray-400">
                                        Tidak ada data...
                                    </td>
                                </tr>
                            )}

                            {filteredData.length > 0 && filteredData.map((v, index) => (
                                <tr key={v.id} className='hover:bg-blue-300 dark:hover:bg-gray-600'>
                                    <td className="py-2 px-2 text-center border border-black dark:border-gray-400">{index + 1}</td>
                                    <td className="py-2 px-2 text-center border border-black dark:border-gray-400">{formatTgl(v.tgl)}</td>
                                    <td className="py-2 px-2 text-left border border-black dark:border-gray-400">{v.penerima}</td>
                                    <td className="py-2 px-2 text-left border border-black dark:border-gray-400">{v.supplier?.nama}</td>
                                    <td className="py-2 px-2 text-left border border-black dark:border-gray-400 font-mono">
                                        {v.details && v.details.map((detail, i) => (
                                            <div key={i} className="flex flex-row justify-between">
                                                <span>{detail.barang?.deskripsi}</span>
                                                <span>{formatDigit(detail.qty, 2)} {detail.barang?.satuan} x {formatDigit(detail.harga, 2)} = {formatDigit(detail.brutto, 2)}</span>
                                            </div>
                                        ))}
                                    </td>
                                    <td className="py-2 px-2 text-right border border-black dark:border-gray-400 font-mono">{formatDigit(v.total, 2)}</td>
                                    <td className="py-2 px-2 text-center border border-black dark:border-gray-400">{v.jenis_bayar ? 'Tunai' : 'Kredit'}</td>
                                    <td className="py-2 px-2 text-center border border-black dark:border-gray-400">{formatTgl(v.due)}</td>
                                    <td className="py-2 px-1 text-center border border-black dark:border-gray-400">
                                        {!v.is_lunas && <div className='flex flex-row justify-center gap-1'>
                                            <button
                                                title={`Set Bayar`}
                                                onClick={() => handleBayar(v.id)}
                                                className="text-red-500 hover:text-red-700 cursor-pointer">
                                                <Dock size={16} />
                                            </button>
                                        </div>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {submitting && <LoadingSpinner />}
        </AppLayout>
    );
};

export default Index;
