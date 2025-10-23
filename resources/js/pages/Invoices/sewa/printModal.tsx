import React from 'react';
import jsPDF from 'jspdf';
import { SewaInvoice } from './model';
import { Header } from '@/pages/components/pdfHeader';
import { getPdfHeader } from '@/pages/components/ApiCaller';
import { BodyFirst, BodySecond, BodyRekening, BodySignature, Footer } from '@/pages/components/pdfSewa';
import PreviewPdf from './previewPdf';

interface PrintModalProps {
    invoice: SewaInvoice;
    isModalOpen: boolean;
    setLoading: (loading: boolean) => void;
    closeModal: () => void;
}

const PrintModal: React.FC<PrintModalProps> = ({ isModalOpen, invoice, setLoading, closeModal }) => {

    const deposit_count = invoice?.tenant_book?.payments?.deposits?.length || 0;
    const deposit_sewa = invoice?.tenant_book?.deposit_sewa || 0;
    const deposit_service = invoice?.tenant_book?.deposit_service || 0;
    const deposit_telp = invoice?.tenant_book?.deposit_telepon || 0;
    const total_deposit = deposit_sewa + deposit_service + deposit_telp;

    invoice = {
        ...invoice,
        deposit_count,
        deposit_sewa,
        deposit_service,
        deposit_telp,
        total_deposit
    };

    if (!isModalOpen || !invoice) return null;

    const downloadPDF = (isSigned: boolean) => {
        const doc = new jsPDF();
        doc.setFontSize(14);

        setLoading(true);

        setTimeout(async () => {
            try {
                const tipe = invoice.is_dp === 2 ? 1 : 0; // 1 for deposit notes, 0 for invoice notes
                const headerData = await getPdfHeader(tipe);
                const pdfHeader = headerData?.pdfHeader || [];
                const notes = headerData?.invoiceNotes || '';

                const title = `INVOICE`;

                Header({ doc, pdfHeader, title });
                BodyFirst({ doc, invoice });
                BodySecond({ doc, invoice });
                BodyRekening({ doc, rekening: invoice.rekening });
                BodySignature({ doc, invoice, pdfHeader, signed: isSigned });
                Footer({ doc, notes });

                doc.save(`Invoice_${invoice.tenant_book?.nama_toko}_${invoice.no}.pdf`);
            } catch (error) {
                console.error("Error generating PDF:", error);
            } finally {
                setLoading(false);
            }
        }, 100);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">

            <PreviewPdf
                isGuest={false}
                invoice={invoice}
                downloadPDF={downloadPDF}
                closeModal={closeModal}
            />

        </div>
    );
};

export default PrintModal;
