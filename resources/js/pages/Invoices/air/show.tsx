import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import jsPDF from 'jspdf';
import { AirInvoice } from './model';
import { Header } from '@/pages/components/pdfHeader';
import { BodyFirst, BodySecond, BodyRekening, BodySignature, Footer } from '@/pages/components/pdfAir';
import PreviewPdf from './previewPdf';

interface Props {
    invoice: AirInvoice;
}

const InvoiceShow: React.FC<Props> = ({ invoice }) => {
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

        doc.save(`Invoice_${invoice?.meter_air?.tenant_book?.nama_toko}_${invoice.no}.pdf`);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
            <Head title="INVOICE" />

            <PreviewPdf
                isGuest={true}
                invoice={invoice}
                downloadPDF={downloadPDF}
                closeModal={() => { }}
            />

        </div>
    );
};

export default InvoiceShow;
