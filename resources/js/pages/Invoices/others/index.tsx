/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/Invoices/sewa/Index.tsx
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Button } from '@headlessui/react';
import { City, Kuitansi, Rekening, Sign } from '@/pages/components/pdfModel';
import { TenantBook } from '@/pages/TenantBook/models';
import { InvoiceOthers, InvoiceOtherType } from './model';
import { PlusCircle, Printer, PrinterCheck, Trash } from 'lucide-react';
import { LoadingSpinner } from '@/pages/components/loadingSpinner';
import { SuccessModal, ErrorModal } from '@/pages/Foodcourt/components/modal';
import { formatUang } from '@/pages/components/helpers';
import { noInvoiceKuitansi, validateDecimal } from '@/pages/components/functions';
import CreateOther from './Create';
// import CreateModal from './createModal';
import PrintModal from './printModal';
import PreviewKwitansi from '@/pages/components/previewKwitansi';

interface Props {
    username: string;
    rekening: Rekening[];
    tenantBooks: TenantBook[];
    invoices: InvoiceOthers[];
    signs: Sign[];
    cities: City[];
    tipe: InvoiceOtherType[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'INVOICES - Others',
        href: '/invoices-others',
    },
];

const Index: React.FC<Props> = ({ username, rekening, tenantBooks, invoices, signs, cities, tipe }) => {
    const [loading, setLoading] = useState<boolean>(false);

    const [isModalOpen, setModalOpen] = useState<boolean>(false);

    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [tenantName, setTenantName] = useState<string>('');
    const [grouping, setGrouping] = useState<string>('');

    const [invoiceNumbers, setInvoiceNumbers] = useState<string[] | null>(null);

    const getInvoiceNumbers = async () => {
        const url = `/invoice-others-list/`;
        const respNumbers = await fetch(url);

        if (!respNumbers.ok) {
            console.error('Server response error to get invoice numbers');
        }

        const dataNumbers = await respNumbers.json();
        setInvoiceNumbers(dataNumbers);
    };

    // useEffect(() => {
    //     getInvoiceNumbers();
    // }, []);

    const handleModalOpen = () => {
        if (loading) return;
        setModalOpen(true);
    };

    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);

    const [successMessage, setSuccessMessage] = useState<string>('');
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);

    const handleSubmit = (invoice: any) => {
        if (loading) return;
        setModalOpen(false);
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');
        setIsErrorModalOpen(false);
        setIsSuccessModalOpen(false);

        console.log({invoice});

        router.post('/invoices-others', invoice, {
            onSuccess: (page) => {
                setSuccessMessage(
                    typeof page.props.success === 'string'
                        ? page.props.success
                        : JSON.stringify(page.props.success)
                );
                setIsSuccessModalOpen(true);
            },
            onError: (error) => {
                const arrayError = [];
                if (error && typeof error === 'object') {
                    for (const key in error) {
                        if (Object.prototype.hasOwnProperty.call(error, key)) {
                            arrayError.push(`${error[key]}`);
                        }
                    }
                }

                if (arrayError.length > 0) {
                    setErrorMessage(arrayError.join(', '));
                } else {
                    setErrorMessage('Gagal menyimpan data..');
                }

                setIsErrorModalOpen(true);
            },
            onFinish: () => {
                setLoading(false);
                setTimeout(() => {
                    // router.reload();
                }, 1000);
            }
        });
    };

    const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
    const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);

    const handlePrintClick = (invoice: any) => {
        if (loading) return;
        setSelectedInvoice(invoice);
        setIsPrintModalOpen(true);
    };

    const cancelInvoice = (invoice: InvoiceOthers) => {
        if (loading) return;

        // ketik nomor invoice untuk konfirmasi
        const confirmation = prompt('Ketik nomor invoice untuk membatalkan');
        if (!confirmation) { return; }

        if (confirmation !== invoice.no) {
            alert('Nomor invoice tidak sesuai, pembatalan dibatalkan.');
            return;
        }

        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');
        setIsErrorModalOpen(false);
        setIsSuccessModalOpen(false);

        router.delete(`/invoices-others/${invoice.id}`, {
            onSuccess: (page) => {
                setSuccessMessage(
                    typeof page.props.success === 'string'
                        ? page.props.success
                        : JSON.stringify(page.props.success)
                );
                setIsSuccessModalOpen(true);
            },
            onError: (error) => {
                const arrayError = [];
                if (error && typeof error === 'object') {
                    for (const key in error) {
                        if (Object.prototype.hasOwnProperty.call(error, key)) {
                            arrayError.push(`${error[key]}`);
                        }
                    }
                }

                if (arrayError.length > 0) {
                    setErrorMessage(arrayError.join(', '));
                } else {
                    setErrorMessage('Gagal menyimpan data..');
                }

                setIsErrorModalOpen(true);
            },
            onFinish: () => {
                setLoading(false);
            }
        });
    };

    const closeModalSuccess = () => {
        setIsSuccessModalOpen(false);
        setTimeout(() => {
            router.visit('/invoices-others');
        }, 100);
    };

    const [isKuitansiModalOpen, setIsKuitansiModalOpen] = useState<boolean>(false);
    const [kwitansiHeaders, setKwitansiHeaders] = useState<string[]>([]);
    const [kuitansi, setKuitansi] = useState<Kuitansi>(
        {
            no: '',
            tgl: '',
            total: 0,
            terbilang: '',
            keterangan: '',
            jenis: '',
            tenant_book_id: 0,
            tenant_book: {} as TenantBook,
            invoice_id: 0,
            invoice_no: '',
            invoice: {} as InvoiceOthers,
            sign_id: 0,
        }
    );

    const [kuitansiNumbers, setKuitansiNumbers] = useState<string[]>([]);

    useEffect(() => {
        const newNo = noInvoiceKuitansi(kuitansiNumbers, kuitansi.tgl);

        if (!kuitansi?.no)
            setKuitansi(prev => ({
                ...prev,
                no: newNo,
            }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [kuitansi.tgl]);

    const handlePrintKuitansi = (invoice: InvoiceOthers) => {
        if (loading) return;
        setLoading(true);

        const dateNow = new Date().toISOString().split('T')[0];
        const invTgl = invoice.tgl ? new Date(invoice.tgl).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB'); // 30/12/2025
        const invDue = invoice.due ? new Date(invoice.due).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB'); // 30/12/2025

        let keterangan = invoice.kuitansi?.keterangan || `${invoice.keterangan}, Sesuai dengan Invoice tanggal ${invTgl} no. ${invoice.no} (pembayaran tanggal ${invDue})`;

        if (invoice.tenant_book_id === 0 || invoice.details) {
            const detailsKeterangan = invoice.details.map((detail) => detail.keterangan).join(', ');
            keterangan = `Pembayaran ${detailsKeterangan} untuk Invoice tanggal ${invTgl} no. ${invoice.no} (pembayaran tanggal ${invDue})`;
        }

        setTimeout(async () => {
            try {
                const arrKuitansi = {
                    ...kuitansi,
                    tgl: invoice.kuitansi?.tgl || dateNow,
                    no: invoice.kuitansi?.no || '',
                    total: invoice.total,
                    terbilang: invoice.terbilang,
                    keterangan,
                    jenis: `other`,
                    tenant_book_id: invoice.tenant_book_id,
                    invoice_id: invoice.id,
                    invoice_no: invoice.no,
                    invoice: invoice,
                    tenant_book: invoice.tenant_book,
                    sign_id: invoice.kuitansi?.sign_id || 0,
                    kota: invoice.kuitansi?.kota || '',
                }

                if (!invoice.kuitansi) {
                    const dataNumbers = await fetch(`/kuitansi-list`).then(resp => resp.json());
                    setKuitansiNumbers(dataNumbers);

                    arrKuitansi.no = noInvoiceKuitansi(dataNumbers, arrKuitansi.tgl);
                }

                setKuitansi(arrKuitansi);

                const dataNotes = await fetch('/invoice-notes').then(resp => resp.json());
                setKwitansiHeaders(dataNotes.pdfHeader || []);

                setIsKuitansiModalOpen(true);
            } catch (error) {
                console.error('Error fetching invoice notes:', error);
                router.reload();
            } finally {
                setLoading(false);
            }
        }, 1);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="INVOICES - UANG MUKA & CICILAN SEWA" />
            <div className="my-2 px-2 py-2 max-w-lg md:max-w-xl lg:max-w-3xl xl:max-w-5xl 2xl:max-w-full mx-auto bg-blue-100 dark:bg-gray-900 shadow-md rounded-lg text-sm">

                <div>
                    <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white my-2 m-2 p-2 rounded-md cursor-pointer"
                        onClick={() => handleModalOpen()}
                    >
                        <div className='flex items-center gap-2'>
                            <PlusCircle />
                            Create Invoice
                        </div>
                    </Button>
                </div>

                <hr className="my-4 border-gray-500 dark:border-gray-600" />

                <div className="mb-4 mx-2 grid grid-cols-1 md:grid-cols-5 gap-2">
                    <div className="flex flex-col">
                        <label htmlFor="startDate" className="text-sm font-medium text-gray-700">Start Date</label>
                        <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full rounded-md border border-gray-300 p-2"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="endDate" className="text-sm font-medium text-gray-700">End Date</label>
                        <input
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full rounded-md border border-gray-300 p-2"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="tenantName" className="text-sm font-medium text-gray-700">Tenant Name</label>
                        <input
                            type="text"
                            id="tenantName"
                            value={tenantName}
                            onChange={(e) => setTenantName(e.target.value)}
                            placeholder="Search Tenant"
                            className="w-full rounded-md border border-gray-300 p-2"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="grouping" className="text-sm font-medium text-gray-700">Grouping</label>
                        <input
                            type="text"
                            id="grouping"
                            value={grouping}
                            onChange={(e) => setGrouping(e.target.value)}
                            placeholder="Search Group"
                            className="w-full rounded-md border border-gray-300 p-2"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="grouping" className="text-sm font-medium text-gray-700">&nbsp;</label>
                        <Button
                            className="btn-sm bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md cursor-pointer"
                            onClick={() => console.log('Filter applied')}
                        >
                            Filter
                        </Button>
                    </div>

                </div>

                {/* Display filtered data */}
                <div className="mt-2 bg-gray-200 dark:bg-gray-800 p-2 rounded-md">
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full ">
                            <thead>
                                <tr>
                                    <th className="p-2 border border-black dark:border-gray-400 text-center">Toko / Perusahaan</th>
                                    <th className="p-2 border border-black dark:border-gray-400 text-center">Lantai / Unit</th>
                                    <th className="p-2 border border-black dark:border-gray-400 text-center">Keterangan <br />Invoice / Kuitansi</th>
                                    <th className="p-2 border border-black dark:border-gray-400 text-center">Jumlah</th>
                                    <th className="p-2 border border-black dark:border-gray-400 text-center">PPN</th>
                                    <th className="p-2 border border-black dark:border-gray-400 text-center">Materai</th>
                                    <th className="p-2 border border-black dark:border-gray-400 text-center">TOTAL</th>
                                    <th className="p-2 border border-black dark:border-gray-400 text-center">Invoice / Kuitansi <br />Sign By</th>
                                    <th className="p-2 border border-black dark:border-gray-400 text-center">Act</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.map((v, index) => (
                                    <tr key={index} className='text-sm hover:bg-blue-300 dark:hover:bg-blue-500 transition-colors duration-100'>
                                        <td className="py-1 px-2 border border-black dark:border-gray-400 whitespace-nowrap">
                                            {v.tenant_book ?
                                                <span><b>{v.tenant_book?.nama_toko}</b> <br /> {v.tenant_book?.perusahaan}</span>
                                                : <span><b>{v.tenant_nama}</b></span>
                                            }

                                        </td>
                                        <td className="py-1 px-2 border border-black dark:border-gray-400 whitespace-nowrap text-center">
                                            {v.tenant_book ?
                                                <span>Lantai {v.tenant_book?.tenant?.floor} <br /> Unit {v.tenant_book?.tenant?.no}</span>
                                                : '-'
                                            }
                                        </td>
                                        <td className="py-1 px-2 border border-black dark:border-gray-400 whitespace-nowrap">
                                            <div className='flex flex-col'>
                                                <span className='font-bold'>{v.type?.tipe}</span>
                                                <span className='font-bold'>{v.keterangan}</span>
                                                <span>{v.no}</span>
                                                <span>{v.kuitansi?.no}</span>
                                            </div>
                                        </td>
                                        <td className="py-1 px-2 border border-black dark:border-gray-400 text-center whitespace-nowrap">
                                            <b>{formatUang(v.jumlah)}</b>
                                        </td>
                                        <td className="py-1 px-2 border border-black dark:border-gray-400 text-center whitespace-nowrap">
                                            <b>{formatUang(v.ppn_jumlah)}</b> <br />
                                            <span className='text-xs italic'>({validateDecimal(v.ppn_persen)}%)</span>
                                        </td>
                                        <td className="py-1 px-2 border border-black dark:border-gray-400 text-center whitespace-nowrap">
                                            <b>{formatUang(v.materai)}</b> <br />
                                        </td>
                                        <td className="py-1 px-2 border border-black dark:border-gray-400 text-center whitespace-nowrap">
                                            <b>{formatUang(v.total)}</b>
                                        </td>
                                        <td className="py-1 px-2 border border-black dark:border-gray-400 text-left whitespace-nowrap">
                                            <div className='flex flex-col gap-1'>
                                                <Button
                                                    title={`Cetak Invoice ${v.no}`}
                                                    className="bg-gray-400 hover:bg-gray-500 text-white p-1 rounded-md cursor-pointer"
                                                    onClick={() => handlePrintClick(v)}
                                                >
                                                    <span className='flex flex-row'>
                                                        <div className='flex items-center justify-center mr-1 bg-blue-600 text-white p-1 rounded-md'>
                                                            <Printer className="w-3.5 h-3.5" />
                                                        </div>
                                                        <b className='text-black dark:text-white'>{v.sign?.nama}</b>
                                                    </span>
                                                </Button>

                                                <Button
                                                    title={`Cetak Kuitansi ${v.kuitansi?.no || ''}`}
                                                    className="bg-gray-400 hover:bg-gray-500 text-white p-1 rounded-md cursor-pointer"
                                                    onClick={() => handlePrintKuitansi(v)}
                                                >
                                                    <span className='flex flex-row'>
                                                        <div className='flex items-center justify-center mr-1 bg-green-700 text-white p-1 rounded-md'>
                                                            <PrinterCheck className="w-3.5 h-3.5" />
                                                        </div>
                                                        <b className='text-black dark:text-white'>{v.kuitansi?.sign?.nama || '-'}</b>
                                                    </span>
                                                </Button>
                                            </div>

                                        </td>
                                        <td className="py-1 px-2 border border-black dark:border-gray-400 text-center">
                                            <div className='flex items-center justify-center gap-0.5'>

                                                {(username === ('Sylvia') || username === 'Admin') &&
                                                    <Button
                                                        title="Hapus Invoice dan Kuitansi"
                                                        className="btn-sm bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded-md cursor-pointer"
                                                        onClick={() => cancelInvoice(v)}
                                                    >
                                                        <Trash className="w-4 h-4" />
                                                    </Button>
                                                }

                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {!loading && (
                <CreateOther
                    data={tenantBooks}
                    rekening={rekening}
                    signs={signs}
                    tipe={tipe}
                    invoiceNumbers={invoiceNumbers}
                    isModalOpen={isModalOpen}
                    setModalOpen={setModalOpen}
                    handleSubmit={handleSubmit}
                />
            )}


            <PrintModal
                isModalOpen={isPrintModalOpen}
                invoice={selectedInvoice}
                setLoading={setLoading}
                closeModal={() => setIsPrintModalOpen(false)}
            />

            {isKuitansiModalOpen && <PreviewKwitansi
                username={username}
                kuitansi={kuitansi}
                setKuitansi={setKuitansi}
                pdfHeader={kwitansiHeaders}
                signs={signs}
                cities={cities}
                setLoading={setLoading}
                setSuccessMessage={setSuccessMessage}
                setIsSuccessModalOpen={setIsSuccessModalOpen}
                setErrorMessage={setErrorMessage}
                setIsErrorModalOpen={setIsErrorModalOpen}
                closeModal={() => setIsKuitansiModalOpen(false)}
            />}

            {loading && <LoadingSpinner />}

            {isErrorModalOpen && <ErrorModal
                isModalOpen={isErrorModalOpen}
                message={errorMessage}
                closeModal={() => setIsErrorModalOpen(false)}
            />}

            {isSuccessModalOpen && <SuccessModal
                isModalOpen={isSuccessModalOpen}
                message={successMessage}
                closeModal={closeModalSuccess}
            />}

        </AppLayout>
    );
};

export default Index;
