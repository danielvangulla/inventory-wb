/* eslint-disable @typescript-eslint/no-explicit-any */

// pages/Payments/components/create/FormCreate.tsx
import React, { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { TenantBook } from '../../TenantBook/models';
import { Deposit, PaymentDp } from '../models';
import { Sign } from '@/pages/components/pdfModel';
import TenantSelector from './TenantSelector';
import MainFormFields from './MainFormFields';
import PaymentDP from './PaymentDP';
import PaymentDPModal from './PaymentDPModal';
import PaymentDeposit from './PaymentDeposit';
import SignForm from './SignForm';
import PaymentDepositModal from './PaymentDepositModal';
import { formatUang } from '@/pages/components/helpers';

interface FormProps {
    username: string;
    tenantBook: TenantBook[];
    signs: Sign[];
}

const FormCreate: React.FC<FormProps> = ({ username, tenantBook, signs }) => {
    const [selectedTenant, setSelectedTenant] = useState<any>(null);
    const [selectedTenantOption, setSelectedTenantOption] = useState<any>(null);

    const [processing, setProcessing] = useState(false);
    const [submitInfoOpen, setSubmitInfoOpen] = useState(false);
    const [submitInfoMessage, setSubmitInfoMessage] = useState('');
    const [submitInfoType, setSubmitInfoType] = useState<'success' | 'error'>('success');
    const [hasPayment, setHasPayment] = useState(false);

    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState<PaymentDp | null>(null);
    const [hasSisa, setHasSisa] = useState(false);
    const [countDetail, setCountDetail] = useState(0);

    const [selectedSign1, setSign1] = useState<any>(null);
    const sign1Options = signs.map((sign) => ({
        label: `${sign.nama} - ${sign.jabatan}`,
        value: sign.id,
        ...sign,
    }));

    const [sign2Nama, setSign2Nama] = useState<string>('');
    const [sign2Jabatan, setSign2Jabatan] = useState<string>('');

    const [hasSisaDeposit, setHasSisaDeposit] = useState(false);
    const [isModalDepositOpen, setModalDepositOpen] = useState(false);
    const [selectedDetailDeposit, setSelectedDetailDeposit] = useState<Deposit | null>(null);

    const defaultData = {
        tenant_id: '',
        tenant_book_id: '',
        total_sewa: 0,
        persen_dp: 0,
        total_dp: 0,
        persen_cicilan: 0,
        total_cicilan: 0,
        lama_cicilan: 0,
        tgl_opening: '',
        grace_period: 0,
        extend_period: 0,
        payment_dp: [],
        sign: null,
        client_nama: '',
        client_jabatan: '',
        deposits: [],
    };

    const { data, setData } = useForm<Record<string, any>>(defaultData);

    // Ketika tenant dipilih, perbarui data form
    const handleTenantChange = (tenantId: any) => {

        setHasPayment(false);
        setHasSisa(false);
        setHasSisaDeposit(true);

        setData(defaultData);

        const tenant = tenantBook.find((v) => v.id === parseInt(tenantId));
        setSelectedTenant(tenant || null);
        setData('tenant_book_id', tenantId);

        // Cek apakah sudah ada data pembayaran yang relevan
        if (tenantId) {
            const existingPayment = tenant?.payments;
            if (existingPayment) {
                setHasPayment(true);

                setData({
                    tenant_id: existingPayment.tenant_id,
                    tenant_book_id: existingPayment.tenant_book_id,
                    total_sewa: existingPayment.total_sewa,
                    persen_dp: existingPayment.persen_dp,
                    total_dp: existingPayment.total_dp,
                    persen_cicilan: existingPayment.persen_cicilan,
                    total_cicilan: existingPayment.total_cicilan,
                    lama_cicilan: existingPayment.lama_cicilan,
                    tgl_opening: existingPayment.tgl_opening,
                    grace_period: existingPayment.grace_period,
                    extend_period: existingPayment.extend_period,
                    payment_dp: existingPayment.payment_dp,
                    sign: existingPayment.sign,
                    client_nama: existingPayment.client_nama || '',
                    client_jabatan: existingPayment.client_jabatan || '',
                    deposits: existingPayment.deposits || [],
                });

                const totalDp = +existingPayment.payment_dp.reduce((sum: number, d: { jumlah: number; }) => (+sum) + (+d.jumlah), 0);
                const sisa = existingPayment.total_dp - totalDp;

                if (sisa > 0)
                    setHasSisa(true);

                // Set selected sign1 if exists
                if (existingPayment.sign) {
                    const sign1 = signs.find((sign) => sign.id === existingPayment.sign?.id);
                    if (sign1) {
                        setSign1(sign1);
                    } else {
                        setSign1(null);
                    }
                }

                // Set sign2 fields if exists
                if (existingPayment.client_nama) {
                    setSign2Nama(existingPayment.client_nama);
                }

                if (existingPayment.client_jabatan) {
                    setSign2Jabatan(existingPayment.client_jabatan);
                }

                if (existingPayment.deposits && existingPayment.deposits.length > 0) {
                    const hasSisaDeposit = existingPayment.deposits.some((d: Deposit) => d.sisa == 0);
                    setHasSisaDeposit(!hasSisaDeposit);
                }
            }

            setCountDetail(existingPayment?.payment_dp?.length || 0);
        }
    };

    const handleAddDetail = () => {
        setModalOpen(true);
        setSelectedDetail(null);
    };

    const handleDetailSubmit = (paymentDp: PaymentDp) => {
        if (!paymentDp.tgl || !paymentDp.ket || paymentDp.jumlah <= 0) {
            setSubmitInfoType('error');
            setSubmitInfoMessage('Tanggal, Keterangan dan Jumlah harus diisi..');
            setSubmitInfoOpen(true);
            return;
        }

        const prevDetails = Array.isArray(data.payment_dp) ? data.payment_dp : [];
        const totalDp = +prevDetails.reduce((sum: number, d: { jumlah: number; }) => (+sum) + (+d.jumlah), 0);
        paymentDp.sisa = data.total_dp - totalDp - paymentDp.jumlah;

        const updatedDetails = [...prevDetails, paymentDp];

        // sort the details by tgl
        updatedDetails.sort((a: PaymentDp, b: PaymentDp) => {
            const dateA = new Date(a.tgl);
            const dateB = new Date(b.tgl);
            return dateA.getTime() - dateB.getTime();
        });

        // update kembali sisa dari setiap detail
        updatedDetails.forEach((detail: PaymentDp, index: number) => {
            let sisa = 0;
            if (index === 0) {
                detail.sisa = data.total_dp - detail.jumlah;
                sisa = detail.sisa;
            } else {
                detail.sisa = updatedDetails[index - 1].sisa - detail.jumlah;
                sisa = detail.sisa;
            }

            if (sisa <= 0)
                setHasSisa(false);
        });

        setData('payment_dp', [...updatedDetails]);
        setCountDetail(updatedDetails.length);

        setModalOpen(false);
    };

    const handleDeleteDetail = (index: number) => {
        const updatedDetails = [...data.payment_dp];
        updatedDetails.splice(index, 1);

        // update kembali sisa dari setiap detail
        updatedDetails.forEach((detail: PaymentDp, index: number) => {
            if (index === 0) {
                detail.sisa = data.total_dp - detail.jumlah;
            } else {
                detail.sisa = updatedDetails[index - 1].sisa - detail.jumlah;
            }
        });

        setData('payment_dp', updatedDetails);
        setCountDetail(updatedDetails.length);

        // Cek apakah ada sisa yang tersisa
        const totalDp = +updatedDetails.reduce((sum: number, d: { jumlah: number; }) => (+sum) + (+d.jumlah), 0);
        const sisa = data.total_dp - totalDp;

        if (sisa > 0)
            setHasSisa(true);
    };

    const handleAddDetailDeposit = () => {
        setModalDepositOpen(true);
        setSelectedDetailDeposit(null);
    };

    const handleDetailSubmitDeposit = (detail: Deposit) => {
        if (!detail.tgl || !detail.ket) {
            setSubmitInfoType('error');
            setSubmitInfoMessage('Data belum lengkap..');
            setSubmitInfoOpen(true);
            return;
        }

        if (detail.jumlah <= 0) {
            setSubmitInfoType('error');
            setSubmitInfoMessage('Jumlah deposit harus lebih dari 0..');
            setSubmitInfoOpen(true);
            return;
        }

        const totalDeposit = (selectedTenant.deposit_sewa || 0) + (selectedTenant.deposit_service || 0) + (selectedTenant.deposit_telepon || 0);

        const prevDetails = Array.isArray(data.deposits) ? data.deposits : [];
        const sumJumlah = prevDetails.reduce((sum: number, d: Deposit) => sum + +d.jumlah, 0);

        detail.deposit = totalDeposit - sumJumlah;
        console.log({ detail, totalDeposit, sumJumlah });
        if (detail.jumlah > detail.deposit) {
            setSubmitInfoType('error');
            setSubmitInfoMessage(`Jumlah tidak boleh lebih dari sisa, Rp. ${formatUang(detail.deposit)}`);
            setSubmitInfoOpen(true);
            return;
        }

        detail.sisa = detail.deposit - detail.jumlah;
        const updatedDetails = [...prevDetails, detail];


        setData('deposits', updatedDetails);
        setModalDepositOpen(false);

        if (detail.sisa > 0) {
            setHasSisaDeposit(true);
        }
        else {
            setHasSisaDeposit(false);
        }
    }

    const handleDeleteDetailDeposit = (index: number) => {
        const updatedDetails = [...data.deposits];
        updatedDetails.splice(index, 1);

        // update kembali sisa dari setiap detail
        const totalDeposit = (selectedTenant.deposit_sewa || 0) + (selectedTenant.deposit_service || 0) + (selectedTenant.deposit_telepon || 0);

        updatedDetails.forEach((detail: Deposit, index: number) => {
            if (index === 0) {
                detail.sisa = totalDeposit - detail.jumlah;
            } else {
                detail.sisa = updatedDetails[index - 1].sisa - detail.jumlah;
            }
        });

        setData('deposits', updatedDetails);

        setSelectedDetailDeposit(null);
        setHasSisaDeposit(updatedDetails.some((d: Deposit) => d.sisa > 0) || totalDeposit > 0);
    };

    const isFormValid =
        (username === 'Admin' || username === 'Sylvia') &&
        selectedSign1 &&
        sign2Nama.trim() !== '' &&
        sign2Jabatan.trim() !== '' &&
        data.total_sewa &&
        data.persen_dp >= 0 &&
        data.total_dp >= 0 &&
        data.persen_cicilan &&
        data.total_cicilan &&
        data.lama_cicilan &&
        data.tgl_opening &&
        data.grace_period >= 0;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (countDetail > 0 && hasSisa) {
            setSubmitInfoType('error');
            setSubmitInfoMessage('Error..! Detail Uang Muka harus diisi sampai sisa Rp. 0');
            setSubmitInfoOpen(true);
            return;
        }

        setProcessing(true);

        const paymentData = {
            ...data,
            sign_id: selectedSign1?.id || null,
            client_nama: sign2Nama,
            client_jabatan: sign2Jabatan,
        };

        // console.log({data}); return;

        router.post('/tenant-payments', paymentData, {
            onSuccess: () => {
                setSubmitInfoType('success');
                setSubmitInfoMessage('Payment successfully saved');
                setSubmitInfoOpen(true);
                setTimeout(() => closeSubmitInfo(), 5000);
            },
            onError: () => {
                setSubmitInfoType('error');
                setSubmitInfoMessage('Error saving payment data');
                setSubmitInfoOpen(true);
            },
            onFinish: () => {
                setProcessing(false)
            },
        });
    };

    const closeSubmitInfo = () => {
        setSubmitInfoOpen(false);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 px-1 justify-center">
            <TenantSelector
                tenantBook={tenantBook}
                data={data}
                setData={setData}
                selectedTenant={selectedTenant}
                setSelectedTenant={setSelectedTenant}
                selectedTenantOption={selectedTenantOption}
                setSelectedTenantOption={setSelectedTenantOption}
                handleTenantChange={handleTenantChange}
            />

            <MainFormFields
                data={data}
                setData={setData}
                countDetail={countDetail}
            />

            {hasPayment && <PaymentDP
                data={data}
                setData={setData}
                handleAddDetail={handleAddDetail}
                handleDeleteDetail={handleDeleteDetail}
                hasSisa={hasSisa}
            />}

            <PaymentDPModal
                data={data}
                isModalOpen={isModalOpen}
                setModalOpen={setModalOpen}
                selectedDetail={selectedDetail}
                setSelectedDetail={setSelectedDetail}
                handleDetailSubmit={handleDetailSubmit}
            />

            {hasPayment && <PaymentDeposit
                data={data}
                selectedTenant={selectedTenant}
                setData={setData}
                handleAddDetail={handleAddDetailDeposit}
                handleDeleteDetail={handleDeleteDetailDeposit}
                hasSisaDeposit={hasSisaDeposit}
            />}

            <PaymentDepositModal
                data={data}
                isModalOpen={isModalDepositOpen}
                setModalOpen={setModalDepositOpen}
                selectedTenant={selectedTenant}
                selectedDetail={selectedDetailDeposit}
                setSelectedDetail={setSelectedDetailDeposit}
                handleDetailSubmit={handleDetailSubmitDeposit}
            />

            <SignForm
                sign1Options={sign1Options}
                selectedSign1={selectedSign1}
                setSign1={setSign1}
                sign2Nama={sign2Nama}
                setSign2Nama={setSign2Nama}
                sign2Jabatan={sign2Jabatan}
                setSign2Jabatan={setSign2Jabatan}
            />

            <div className="basis-full my-4">
                <button
                    type="submit"
                    className={`w-full text-white font-semibold py-2 px-4 rounded ${!isFormValid ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-700 hover:bg-green-500 dark:bg-green-700 dark:hover:bg-green-500 cursor-pointer'}`}
                    disabled={processing || !isFormValid}
                >
                    {processing ? 'Processing...' : 'Simpan Simulasi Payment'}
                </button>
            </div>

            {submitInfoOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="text-center bg-white p-6 rounded shadow-md w-fit">
                        <h2 className={`text-xl font-semibold ${submitInfoType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                            {submitInfoType === 'success' ? 'Success' : 'Error'}
                        </h2>
                        <p className="mt-4">{submitInfoMessage}</p>

                        <div className="flex justify-center mt-4">
                            <button
                                className="bg-blue-600 hover:bg-blue-800 text-white py-2 px-4 rounded cursor-pointer"
                                onClick={closeSubmitInfo}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
};

export default FormCreate;
