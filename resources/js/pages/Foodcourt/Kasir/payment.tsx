/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { orderItem, transaksi } from "../models";
import { formatNumber } from "../functions";
import NumpadModal from "../components/numpad";
import { KonfirmasiModal } from "../components/modal";

interface Props {
    cart: orderItem[];
    open: boolean;
    onClose: () => void;
    onPay: (type: transaksi) => void;
    isPaid: boolean;
    setIsPaid: (paid: boolean) => void;
    lastTransaksi: transaksi | null;
    handlePrintReceipt: (payload: any, withoutOrder: boolean) => void;
}

const PaymentModal: React.FC<Props> = ({ cart, open, onClose, onPay, isPaid, setIsPaid, lastTransaksi, handlePrintReceipt }) => {
    const [cardCharge, setCardCharge] = useState<number>(0);
    const totalTagihan = cart.reduce((acc, item) => acc + (item.total || 0), 0);
    const totalWithCharge = totalTagihan + cardCharge;

    const [isNumpadVisible, setNumpadVisible] = useState(false);

    const listJenisBayar = ["cash", "card", "qris"];
    const listBank = ["BCA", "BNI", "BRI", "MANDIRI"];
    const listQris = [...listBank, "OVO", "DANA", "GOPAY", "SHOPEEPAY"];

    const [selectedJenisBayar, setSelectedJenisBayar] = useState<string | null>(null);
    const [selectedMetodeBayar, setSelectedMetodeBayar] = useState<string | null>(null);
    const [uangCash, setUangCash] = useState<number>(0);
    const [kembalian, setKembalian] = useState<number>(0);
    const [cardNumber, setCardNumber] = useState<string>("");

    const [message, setMessage] = useState<string>("");
    const [readyToPay, setReadyToPay] = useState(false);

    const [showModalKonfirmasi, setShowModalKonfirmasi] = useState(false);
    const [konfirmasiMsg, setKonfirmasiMsg] = useState("");

    const handleSelectJenisBayar = (jenis: string) => {
        if (isPaid) return;

        setSelectedJenisBayar(jenis);
        setCardNumber("");
        setSelectedMetodeBayar(null);
        setReadyToPay(false);
        setCardCharge(0);

        if (jenis === "cash")
            handleOpenNumpad();

        if (jenis !== "cash") {
            const persenCharge = 0.00;
            const charge = Math.round(totalTagihan * persenCharge);
            setCardCharge(charge);
            setUangCash(0);
            setKembalian(0);
            setMessage("");
        }
    };

    const handleSelectedMetodeBayar = (metode: string) => {
        if (isPaid) return;
        setSelectedMetodeBayar(metode);
        setCardNumber("");
        setReadyToPay(false);

        if (selectedJenisBayar !== "cash")
            setReadyToPay(true);
        else
            setReadyToPay(false);
    }

    const handleOpenNumpad = () => {
        if (isPaid) return;

        setUangCash(0);
        setKembalian(0);
        setNumpadVisible(true);
    }

    const handleNumpadSubmit = (value: string) => {
        if (isPaid) return;

        const cash = parseInt(value, 10);
        const kembalian = cash - totalTagihan;

        setMessage("");
        setIsPaid(false);
        if (selectedJenisBayar === "cash" && cash < totalTagihan) {
            setMessage("Uang cash tidak cukup");
        }

        if (!isNaN(cash)) {
            setUangCash(cash);
            setKembalian(kembalian > 0 ? kembalian : 0);
            setReadyToPay(true);
        }

        setNumpadVisible(false);
    };

    const proceedPayment = () => {
        if (isPaid) return;

        if (selectedJenisBayar == 'cash') {
            setKonfirmasiMsg(`Pastikan Uang yang diterima telah Sesuai.. Lanjutkan?`);
        } else {
            const jns = selectedJenisBayar === "card" ? "EDC" : "QRIS";
            setKonfirmasiMsg(`Pastikan Transaksi ${jns} telah Berhasil.. Lanjutkan?`);
        }
        setShowModalKonfirmasi(true);
    }

    const handlePayment = () => {
        if (isPaid) return;
        setShowModalKonfirmasi(false);

        onPay({
            id: 0,
            user_id: 0,
            tgl: new Date().toISOString(),
            brutto: cart.reduce((total, item) => total + (item.brutto || 0), 0),
            disc: cart.reduce((total, item) => total + (item.disc || 0), 0),
            netto: cart.reduce((total, item) => total + (item.netto || 0), 0),
            tax: cart.reduce((total, item) => total + (item.tax || 0), 0),
            service: cart.reduce((total, item) => total + (item.service || 0), 0),
            card_charge: cardCharge,
            total: totalWithCharge,
            card_no: cardNumber,
            jenis_bayar: selectedJenisBayar || "",
            channel_bayar: selectedMetodeBayar || (selectedJenisBayar === "cash" ? "CASH" : ""),
            uang_cash: uangCash,
            kembalian: kembalian,
        });

        setMessage("");
    }

    const handleBeforeClose = () => {
        setSelectedJenisBayar(null);
        setSelectedMetodeBayar(null);
        setUangCash(0);
        setKembalian(0);
        setMessage("");
        setReadyToPay(false);
        setIsPaid(false);
        onClose();
    }

    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-black/60 flex items-start justify-center z-50 pt-10 overflow-auto">

            <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md w-full">

                <div className="text-xl mb-4 border-2 border-gray-400 p-2 rounded-lg">
                    <div className="text-xl font-bold mb-2">
                        <div>Total Tagihan</div>
                        <div className="text-xs italic font-normal">{cardCharge > 0 && `(+ Charge ${formatNumber(cardCharge, 0)})`}</div>
                    </div>
                    <div className="text-4xl font-bold text-blue-700">
                        {formatNumber(totalWithCharge, 0)}
                    </div>
                </div>

                <div className="text-xl mb-4 border-2 border-gray-400 p-2 rounded-lg">
                    <h2 className="font-bold underline">Payment Method</h2>
                    <div className="flex gap-4 justify-center my-1">
                        {listJenisBayar.map((jenis) => (
                            <button
                                key={jenis}
                                className={` ${selectedJenisBayar === jenis ? "bg-blue-500 text-white" : "bg-white"} hover:bg-blue-500 p-1 rounded-sm cursor-pointer border border-gray-300`}
                                onClick={() => handleSelectJenisBayar(jenis)}
                            >
                                <div className="px-2 py-1 flex flex-row justify-center items-center">
                                    {jenis.charAt(0).toUpperCase() + jenis.slice(1)}
                                    {selectedJenisBayar === jenis && <span className="ml-2 text-green-300 font-extrabold">✓</span>}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {selectedJenisBayar && (
                    <div className="mb-4 border-2 border-gray-400 p-2 rounded-lg">
                        {selectedJenisBayar != 'cash' && <h2 className="font-bold underline">Payment Channel</h2>}

                        {selectedJenisBayar != 'cash' && <div className="flex gap-4 justify-center my-1 flex-wrap text-sm">
                            {(selectedJenisBayar === "qris" ? listQris : selectedJenisBayar === "card" ? listBank : []).map((metode) => (
                                <button
                                    key={metode}
                                    className={` ${selectedMetodeBayar === metode ? "bg-blue-500 text-white" : "bg-white"} hover:bg-blue-500 p-1 rounded-sm cursor-pointer border border-gray-300`}
                                    onClick={() => {
                                        handleSelectedMetodeBayar(metode);
                                    }}
                                >
                                    <div className="px-2 py-1 flex flex-row justify-center items-center">
                                        {metode}
                                        {selectedMetodeBayar === metode && <span className="ml-2 text-green-300 font-extrabold">✓</span>}
                                    </div>
                                </button>
                            ))}
                        </div>}

                        {selectedJenisBayar === "cash" && (
                            <>
                                <div className="mb-4 flex flex-col justify-center items-center">
                                    <label className="block mb-2 font-bold w-24">Uang Cash</label>
                                    <h2 className="w-full text-2xl font-bold text-green-600 border-2 border-gray-400 p-2 rounded-lg cursor-pointer" onClick={handleOpenNumpad}>
                                        {formatNumber(uangCash, 0)}
                                    </h2>
                                </div>

                                {message !== "" && <div className="mb-4 p-2 bg-red-200 text-red-800 border border-red-400 rounded">
                                    {message}
                                </div>}

                                {(uangCash > 0 && uangCash < totalTagihan && message === "") && <button
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                    onClick={handlePayment}
                                    disabled={isPaid}
                                >
                                    {isPaid ? "Sudah Dibayar" : "Proses Bayar"}
                                </button>}

                                {(message === "" && isPaid) && <div className="mb-4 flex flex-col justify-center items-center">
                                    <label className="block mb-2 font-bold w-24">Kembalian</label>
                                    <h2 className="w-full text-2xl font-bold text-red-600 border-2 border-gray-400 p-2 rounded-lg cursor-pointer" onClick={handleOpenNumpad}>
                                        {formatNumber(kembalian, 0)}
                                    </h2>
                                </div>}

                            </>
                        )}

                        {selectedJenisBayar !== "cash" && (
                            <div className="my-4">
                                <label className="block my-1 font-bold underline">
                                    Nomor {`${selectedJenisBayar === "card" ? "Kartu" : "HP"}`}
                                </label>
                                <input
                                    type="text"
                                    className={`w-48 border ${isPaid ? "bg-gray-200" : "bg-white"} border-gray-300 p-2 rounded-lg`}
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    disabled={isPaid}
                                />
                            </div>
                        )}

                        {!isPaid && readyToPay && message === "" && (
                            <button
                                className="text-white px-4 py-2 rounded bg-green-700 hover:bg-green-600 mt-2 cursor-pointer"
                                onClick={proceedPayment}
                            >
                                Proses Pembayaran
                            </button>
                        )}

                        {isPaid && (
                            // tampilkan centang besar hijau dalam lingkaran dengan border hijau, dan tulisan sukses pembayaran
                            <div className="w-full flex flex-col justify-center items-center">
                                <div className="w-12 h-12 flex justify-center items-center border-2 border-green-500 rounded-full">
                                    <span className="text-green-500 text-2xl font-bold">✓</span>
                                </div>
                                <span className="ml-2 text-green-700 font-bold">Pembayaran Berhasil</span>
                            </div>
                        )}

                        {isPaid && lastTransaksi && (
                            <button
                                className="text-white px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 mt-2 cursor-pointer"
                                onClick={() => handlePrintReceipt(lastTransaksi, true)}
                            >
                                Cetak Ulang Struk
                            </button>
                        )}

                    </div>
                )}

                <button onClick={handleBeforeClose} className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer">
                    Kembali
                </button>
            </div>

            <NumpadModal
                visible={isNumpadVisible}
                onClose={() => setNumpadVisible(false)}
                onSubmit={handleNumpadSubmit}
            />

            <KonfirmasiModal
                isModalOpen={showModalKonfirmasi}
                message={konfirmasiMsg}
                closeModal={() => setShowModalKonfirmasi(false)}
                confirm={handlePayment}
            />

        </div>
    );
};

export default PaymentModal;
