/* eslint-disable @typescript-eslint/no-explicit-any */
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { menu, orderItem, transaksi } from '../models';
import { formatNumber } from '../functions';
import { ErrorModal, SuccessModal } from '../components/modal';
import NumpadModal from '../components/numpad';
import PaymentModal from './payment';
import axios from '@/lib/axios';

interface Props {
    nama: string;
    menu: menu[];
}

export default function Kasir({ nama, menu }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: `KASIR : ${nama}`,
            href: '/foodcourt/kasir',
        },
    ];

    const [lastTransaksi, setLastTransaksi] = useState<transaksi | null>(null);

    const [persenTax,] = useState(10);

    const [showModalSuccess, setShowModalSuccess] = useState(false);
    const [showModalError, setShowModalError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const items = menu.map(m => ({
        ...m,
        qty: 1,
    }));

    const uniqueKategorisub = Array.from(new Set(items.map(item => item.tenant?.nama_tenant))).filter(Boolean) as string[];
    const sortedKategorisub = uniqueKategorisub.sort((a, b) => a.localeCompare(b));

    const [listKategori, setListKategori] = useState<string[]>(sortedKategorisub);

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredItems, setFilteredItems] = useState(items);

    const handleFilterByKategori = (kategori: string) => {
        setSearchQuery('');

        if (kategori === '') {
            setListKategori(sortedKategorisub);
            setFilteredItems(items);
        } else {
            setListKategori([kategori]);

            // filter items based on updated listKategori
            const filtered = items.filter(item => [kategori].includes(item.tenant?.nama_tenant || ''));
            setFilteredItems(filtered);
        }
    }

    const handleSearch = (query: string) => {
        setSearchQuery(query);

        if (query.trim() === '') {
            const filtered = items.filter(item => listKategori.includes(item.tenant?.nama_tenant || ''));
            setFilteredItems(filtered);
            return;
        }

        const lowerCaseQuery = query.toLowerCase();
        const filtered = items.filter(item =>
            item.sku.toLowerCase().includes(lowerCaseQuery) ||
            item.alias.toLowerCase().includes(lowerCaseQuery) ||
            item.deskripsi.toLowerCase().includes(lowerCaseQuery)
        );

        const finalFiltered = filtered.filter(item => listKategori.includes(item.tenant?.nama_tenant || ''));
        setFilteredItems(finalFiltered);
    }

    const [isNumpadVisible, setNumpadVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<menu | null>(null);

    const handleOpenNumpad = (item: menu) => {
        if (!item.is_ready) {
            setErrorMessage(`${item.alias} saat ini tidak tersedia. Hubungi pihak tenant untuk info lebih lanjut..`);
            setShowModalError(true);
            return;
        }

        if (item.is_soldout) {
            setErrorMessage(`${item.alias} sudah habis terjual. Hubungi pihak tenant untuk info lebih lanjut..`);
            setShowModalError(true);
            return;
        }

        setSelectedItem(item);
        setNumpadVisible(true);
    }

    const handleNumpadSubmit = (value: string) => {
        if (selectedItem) {
            const qty = parseInt(value, 10);
            if (qty > 0) {
                selectedItem.qty = qty;
            }
        }

        setNumpadVisible(false);
        handleAddToCart(selectedItem!);
    };

    const [cart, setCart] = useState<orderItem[]>([]);

    const handleAddToCart = (item: menu) => {
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            const updatedCart = cart.map(cartItem => {
                const cartItemQty = cartItem.qty || 0;
                const itemQty = item.qty || 0;
                const qty = cartItemQty + itemQty;
                const brutto = qty * cartItem.harga;
                const disc = 0;
                const netto = brutto - disc;
                const tax = qty * cartItem.tax;
                const service = 0;
                const total = netto + tax + service;

                return cartItem.id === item.id
                    ? { ...cartItem, qty, brutto, disc, netto, tax, service, total }
                    : cartItem
            });
            setCart(updatedCart);

        } else {
            const itemQty = item.qty || 0;
            if (itemQty <= 0) return;

            const brutto = itemQty * item.harga;
            const disc = 0;
            const netto = brutto - disc;
            const tax = itemQty * persenTax * item.harga / 100;
            const service = 0;
            const total = netto + tax + service;

            const newItem: orderItem = {
                id: item.id,
                sku: item.sku,
                alias: item.alias,
                harga: item.harga,
                qty: itemQty,
                brutto,
                disc,
                netto,
                tax,
                service,
                total,
            };

            setCart([...cart, newItem]);
        }

        // reset quantity to 1
        item.qty = 1;
    };

    const handleRemoveFromCart = (item: orderItem) => {
        const updatedCart = cart.filter(cartItem => cartItem.id !== item.id);
        setCart(updatedCart);
    }

    const [modalPayOpen, setModalPayOpen] = useState(false);

    const handleSubmit = () => {
        setModalPayOpen(true);
    };

    const [isPaid, setIsPaid] = useState(false);

    const handlePay = (dataPay: transaksi) => {
        const items = cart.map(item => ({
            menu_id: item.id,
            sku: item.sku,
            alias: item.alias,
            harga: item.harga,
            qty: item.qty,
            brutto: item.brutto,
            disc: item.disc,
            netto: item.netto,
            tax: item.tax,
            service: item.service,
            total: item.total,
        }));

        const data = {
            id: dataPay.id,
            tgl: dataPay.tgl,
            brutto: dataPay.brutto,
            disc: dataPay.disc,
            netto: dataPay.netto,
            tax: dataPay.tax,
            service: dataPay.service,
            card_charge: dataPay.card_charge,
            total: dataPay.total,
            jenis_bayar: dataPay.jenis_bayar,
            channel_bayar: dataPay.channel_bayar,
            uang_cash: dataPay.uang_cash,
            kembalian: dataPay.kembalian,
            card_no: dataPay.card_no,
            items,
        };

        const defaultErrMsg = 'Terjadi kesalahan saat memproses pembayaran.. silahkan coba lagi..';

        axios.post(route('foodcourt.kasir.pay'), data)
            .then(response => {
                const isSuccess = response.status === 201;

                if (!isSuccess) {
                    // console.log('Error:', response.data?.error || "Unknown error");

                    const errMsg = response.data?.message || defaultErrMsg;
                    setErrorMessage(errMsg);
                    setShowModalError(true);
                    return;
                }

                // console.log('Payment Success:', response.data.data);

                const payload = response.data.data;
                setLastTransaksi(payload);
                handlePrintReceipt(payload, false);

                setIsPaid(true);
                setShowModalSuccess(true);
            })
            .catch(error => {
                // console.log('Error:', error.response?.data || error.message || "Unknown error");
                const errMsg = error.response?.data?.message || defaultErrMsg;
                setErrorMessage(errMsg);
                setShowModalError(true);
            });
    }

    const handlePrintReceipt = (payload: any, withoutOrder: boolean) => {
        axios.post(route('foodcourt.print.receipt'), payload)
            .then(res => {
                console.log('Print Receipt Success:', res.data);

                if (!withoutOrder)
                    handlePrintOrders(payload);
            })
            .catch(err => {
                console.log('Print Error:', err.response?.data || err.message || "Unknown error");
            });
    }

    const handlePrintOrders = (payload: any) => {
        const orderPayload = {
            order_code: payload.data.meta.order_code,
            data: payload.data.items
        };

        axios.post(route('foodcourt.print.orders'), orderPayload)
            .then(res => {
                console.log('Print Orders Success:', res.data);
            })
            .catch(err => {
                console.log('Print Error:', err.response?.data || err.message || "Unknown error");
            });
    }

    const handleModalPayClose = () => {
        setModalPayOpen(false);

        if (isPaid) {
            setCart([]);
            setIsPaid(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={breadcrumbs[0].title} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Bagian atas Dashboard */}
                <div className="w-full flex flex-col md:flex-row gap-2">
                    <div className="w-full md:flex-1">
                        {/* List Sub Kategori */}
                        <div className="mb-2 flex flex-wrap gap-1 text-sm">

                            <button
                                onClick={() => handleFilterByKategori('')}
                                className={`px-2 py-1 rounded-full font-medium ${listKategori.length === uniqueKategorisub.length ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'} transition-colors cursor-pointer`}
                            >
                                Semua
                            </button>

                            {uniqueKategorisub.map((kategori, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleFilterByKategori(kategori)}
                                    className={`px-2 py-1 rounded-full font-medium ${listKategori.length > 0 && listKategori.includes(kategori) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'} transition-colors cursor-pointer`}
                                >
                                    {/* limit to 10 characters, jika ALL tampilkan pendek, else jika selected tampilkan lengkap */}
                                    {
                                        listKategori.length === sortedKategorisub.length
                                            ? kategori.substring(0, 10)
                                            : listKategori.includes(kategori)
                                                ? kategori
                                                : kategori.substring(0, 10)
                                    }
                                </button>
                            ))}

                        </div>

                        {/* Search Bar */}
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="border border-gray-300 rounded px-2 py-1 w-full"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>

                        {/* Menu Items Wraps overflows size smallest */}
                        <div className="flex flex-wrap gap-2 max-h-[calc(100vh-200px)] overflow-y-auto p-2 bg-gray-600 rounded-lg">
                            {filteredItems.length === 0 && (
                                <div className="col-span-full text-center text-gray-300">
                                    Tidak ada item...
                                </div>
                            )}

                            {filteredItems.length > 0 && filteredItems.map((item, index) => (
                                <div key={index} className={`border border-gray-200 rounded-lg shadow-lg overflow-hidden mb-1 w-32 cursor-pointer  ${!item.is_ready || item.is_soldout ? 'opacity-50 cursor-not-allowed hover:scale-101 transform transition-all duration-100' : 'bg-blue-600 hover:scale-110 transform transition-all duration-200'}`}
                                    onClick={() => handleOpenNumpad(item)}>
                                    <div className="px-1 text-center">
                                        <p className='my-1 mx-1 py-0.5 bg-gray-300 rounded-lg text-xs'>
                                            {item.tenant?.nama_tenant.slice(0, 15)}...
                                        </p>

                                        <div className='relative'>
                                            <div className="bg-white rounded-lg p-1">
                                                <img
                                                    src={item.image_url || "/images/foodcourt/ayam-goreng.png"}
                                                    alt={item.alias}
                                                    className="w-full h-20 object-cover rounded-lg"
                                                />
                                            </div>

                                            <h3 className="absolute w-full h-full top-0 left-1/2 transform -translate-x-1/2 text-black text-sm font-semibold bg-white/50 rounded-lg px-2 py-1 flex justify-center items-center">
                                                <span className='p-1 rounded-3xl shadow-xs shadow-red-600'>{item.alias}</span>
                                            </h3>
                                        </div>

                                        <p className="text-black my-1 text-sm rounded-lg p-1 bg-white border border-gray-300">
                                            {!item.is_ready ? (
                                                <span className="text-red-600 font-bold">- Not Ready -</span>
                                            ) : item.is_soldout ? (
                                                <span className="text-red-600 font-bold">- Sold Out -</span>
                                            ) : (
                                                <span>
                                                    IDR <span className="font-bold">{formatNumber(item.harga, 0)}</span>
                                                </span>
                                            )}
                                        </p>

                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Cart Section */}
                    <div className="w-96 bg-white border border-gray-200 rounded-lg shadow-lg p-2 font-mono text-xs">
                        <h3 className="text-center text-xl font-semibold bg-blue-500 text-white rounded-t-lg py-1">Order List</h3>

                        {cart.length === 0 ? (
                            <div className='flex justify-center items-center text-xl'>
                                <p className="text-gray-500">Pesanan kosong..</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between items-center gap-1 text-sm font-bold bg-gray-300 py-1">
                                    <div className='flex-1 flex items-center'>
                                        <div className='flex flex-row justify-between items-center w-full pl-8'>
                                            <div>
                                                Keterangan
                                            </div>

                                            <div className='flex justify-center items-center px-2 min-w-8'>
                                                Qty
                                            </div>
                                        </div>
                                    </div>

                                    <div className='flex items-center justify-end min-w-20 pr-2'>
                                        Jumlah
                                    </div>
                                </div>

                                <hr className='my-1' />

                                <ul className="space-y-1">
                                    {cart.map((item, index) => (
                                        <li key={index} className="flex justify-between items-center gap-1 bg-gray-200 p-1">

                                            <div className='flex-1 flex items-center gap-1'>
                                                <button
                                                    title='Hapus'
                                                    onClick={() => handleRemoveFromCart(item)}
                                                    className="text-red-500 hover:text-red-600 transition-colors text-sm mr-2 cursor-pointer p-1 rounded-full bg-white hover:bg-red-200"
                                                >
                                                    <Trash2Icon size={16} />
                                                </button>

                                                <div className='flex flex-row justify-between items-center w-full'>
                                                    <div>
                                                        {item.alias}
                                                    </div>

                                                    <div className='flex justify-center items-center font-bold rounded-full bg-blue-500 text-white p-2 min-w-8'>
                                                        x{item.qty}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='flex items-center justify-end gap-2 min-w-20 text-sm font-bold'>
                                                <div>{formatNumber((item.total || 0) - (item.tax || 0), 0)}</div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                <hr className='my-2 border border-gray-600' />

                                <div className="text-right font-semibold bg-gray-300 rounded-b-lg p-1 px-4">
                                    <div className='flex justify-end items-center text-lg mb-1'>
                                        <div>Sub-total</div>
                                        <div className='text-blue-800 w-32'>
                                            {formatNumber(cart.reduce((netto, item) => netto + (item.netto ?? 0), 0), 0)}
                                        </div>
                                    </div>
                                    <div className='flex justify-end items-center text-lg mb-1'>
                                        <div>Tax</div>
                                        <div className='text-blue-800 w-32'>
                                            {formatNumber(cart.reduce((tax, item) => tax + (item.tax ?? 0), 0), 0)}
                                        </div>
                                    </div>
                                    <div className='flex justify-end items-center text-xl mb-1'>
                                        <div>TOTAL IDR</div>
                                        <div className='text-blue-800 w-32'>
                                            {formatNumber(cart.reduce((total, item) => total + (item.total ?? 0), 0), 0)}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    className="flex items-center justify-center gap-2 bg-green-500 text-white py-2 px-4 rounded-full w-full mt-4 cursor-pointer hover:bg-green-600 transition-colors text-lg font-bold shadow-md shadow-gray-500"
                                >
                                    Bayar
                                </button>
                            </>
                        )}

                    </div>
                </div>

                {/* Bagian bawah Dashboard */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2"></div>
            </div>

            <PaymentModal
                cart={cart}
                open={modalPayOpen}
                onClose={handleModalPayClose}
                onPay={handlePay}
                isPaid={isPaid}
                setIsPaid={setIsPaid}
                lastTransaksi={lastTransaksi}
                handlePrintReceipt={handlePrintReceipt}
            />

            <NumpadModal
                visible={isNumpadVisible}
                onClose={() => setNumpadVisible(false)}
                onSubmit={handleNumpadSubmit}
            />

            <SuccessModal
                isModalOpen={showModalSuccess}
                message="Pembayaran Berhasil"
                closeModal={() => setShowModalSuccess(false)}
            />

            <ErrorModal
                isModalOpen={showModalError}
                message={errorMessage}
                closeModal={() => setShowModalError(false)}
            />
        </AppLayout>
    );
}
