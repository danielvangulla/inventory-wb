import React from 'react';
import jsPDF from 'jspdf';
import { InvoiceOthers } from './model';
import { Header } from '@/pages/components/pdfHeader';
import { getPdfHeader } from '@/pages/components/ApiCaller';
import { BodyFirst, BodySecond, BodyRekening, BodySignature, Footer } from '@/pages/components/pdfOther';
import PreviewPdf from './previewPdf';

interface PrintModalProps {
    invoice: InvoiceOthers;
    isModalOpen: boolean;
    setLoading: (loading: boolean) => void;
    closeModal: () => void;
}

const PrintModal: React.FC<PrintModalProps> = ({ isModalOpen, invoice, setLoading, closeModal }) => {
    if (!isModalOpen || !invoice) return null;

    const downloadPDF = (isSigned: boolean) => {
        const doc = new jsPDF();
        doc.setFontSize(14);

        setLoading(true);

        setTimeout(async () => {
            try {
                const headerData = await getPdfHeader(0);
                const pdfHeader = headerData?.pdfHeader || [];
                const notes = headerData?.invoiceNotes || '';

                const title = `INVOICE`;

                Header({ doc, pdfHeader, title });
                BodyFirst({ doc, invoice });
                BodySecond({ doc, invoice });
                BodyRekening({ doc, rekening: invoice.rekening });
                BodySignature({ doc, invoice, pdfHeader, signed: isSigned });
                Footer({ doc, notes });

                const namaToko = invoice.tenant_book?.nama_toko || invoice.tenant_nama || '-';

                doc.save(`Invoice_${namaToko}_${invoice.no}.pdf`);
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
