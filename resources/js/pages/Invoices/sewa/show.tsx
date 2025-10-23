import React, { useEffect, useState } from 'react';
import { SewaInvoice } from './model';
import jsPDF from 'jspdf';
import { Header } from '@/pages/components/pdfHeader';
import { BodyFirst, BodyRekening, BodySecond, BodySignature, Footer } from '@/pages/components/pdfSewa';
import { Head } from '@inertiajs/react';
import PreviewPdf from './previewPdf';

interface Props {
    invoice: SewaInvoice;
}

const InvoiceShow: React.FC<Props> = ({ invoice }) => {

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

    const [pdfHeader, setPdfHeader] = useState<string[]>([]);
    const [invoiceNotes, setInvoiceNotes] = useState<string[]>([]);

    const fetchPdfData = async () => {
        try {
            const respNotes = await fetch('/invoice-notes');
            if (!respNotes.ok) {
                console.error('Server response error to get invoice notes');
            }

            const dataNotes = await respNotes.json();

            setPdfHeader(dataNotes.pdfHeader || []);
            setInvoiceNotes(dataNotes.invoiceNotes || []);
        } catch (error) {
            console.error('Error fetching PDF data:', error);
        }
    };

    useEffect(() => {
        fetchPdfData();
    }, []);

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(14);

        Header({ doc, pdfHeader });
        BodyFirst({ doc, invoice });
        BodySecond({ doc, invoice });
        BodyRekening({ doc, rekening: invoice.rekening });
        BodySignature({ doc, invoice, pdfHeader, signed: false });
        Footer({ doc, notes: invoiceNotes });

        doc.save(`Invoice_${invoice.tenant_book?.nama_toko}_${invoice.no}.pdf`);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
            <Head title="INVOICE" />

            <PreviewPdf
                isGuest={true}
                invoice={invoice}
                downloadPDF={downloadPDF}
                closeModal={() => {}}
            />

        </div>
    );
};

export default InvoiceShow;
