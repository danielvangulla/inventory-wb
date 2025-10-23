import jsPDF from 'jspdf';
import { PdfListrikProps } from './pdfModel';
import { formatTgl } from './functions';
import { formatDigit, formatUang } from './helpers';

export function BodyFirst({ doc, invoice }: PdfListrikProps): jsPDF {
    const tenantBook = invoice?.meter_listrik?.tenant_book;
    const tenant = tenantBook?.tenant;

    // reset font to normal for the first body section
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    const yStart = 60; // Starting Y position for the first body section
    const yStart2 = yStart + 5; // Y position for the address text

    const xStart = 15; // Starting X position for the table
    const xStart2 = xStart + 15; // X position for the customer info
    const xStart3 = xStart + 115; // X position for the invoice details
    const xStart4 = xStart3 + 30; // X position for the values

    // Customer info
    doc.text(`Kepada`, xStart, yStart);

    doc.text(`: ${tenantBook?.perusahaan || ''} (${tenantBook?.nama_toko || ''})`, xStart2, yStart);

    // alamat, jika terlalu panjang, buat menjadi beberapa baris
    const alamatText = tenantBook?.alamat || '-';
    const maxLineWidth = 85; // Max width for the text
    const lines = doc.splitTextToSize(alamatText, maxLineWidth);
    const lineHeight = 5; // Height of each line
    lines.forEach((line: string | string[], index: number) => {
        doc.text(line, xStart2 + 2, yStart2 + (index * lineHeight));
    });


    // doc.text(`Attn`, xStart, yStart + 25);
    // doc.text(`: {Nama Owner / Pemilik}`, xStart2, yStart + 25);

    doc.text(`Invoice No`, xStart3, yStart);
    doc.text(`Invoice Date`, xStart3, yStart + 5);
    doc.text(`Invoice Due`, xStart3, yStart + 10);
    doc.text(`Currency`, xStart3, yStart + 20);
    doc.text(`Unit No.`, xStart3, yStart + 25);

    doc.text(`: ${invoice?.no || '-'}`, xStart4, yStart);
    doc.text(`: ${formatTgl(invoice?.tgl ?? '') || '-'}`, xStart4, yStart + 5);
    doc.text(`: ${formatTgl(invoice?.due ?? '') || '-'}`, xStart4, yStart + 10);
    doc.text(`: ${invoice?.curr || 'IDR'}`, xStart4, yStart + 20);
    doc.text(`: Lt.${tenant?.floor || ''} #${tenant?.no || ''}`, xStart4, yStart + 25);

    return doc;
}

export function BodySecond({ doc, invoice }: PdfListrikProps): jsPDF {
    // reset font to normal for the second body section
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    const yStart = 90; // Starting Y position for the second body section
    const yStart2 = yStart + 5; // Y position for the header line
    const yStart3 = yStart2 + 5; // Y position for the header text
    const yStart4 = yStart3 + 5; // Y position for the header line under the text
    const yStart5 = yStart4 + 5; // Y position for the description text

    const xStart = 20; // Starting X position for the table

    // Draw a line under the header
    doc.setLineWidth(0.1);
    doc.line(xStart - 5, yStart2, doc.internal.pageSize.getWidth() - 15, yStart2);

    // Table header
    const xHead1 = xStart;
    const xHead2 = xHead1 + 70;
    const xHead3 = xHead2 + 18;
    const xHead4 = xHead3 + 20;
    const xHead5 = xHead4 + 25;
    const xHead6 = xHead5 + 35;

    doc.setFont('helvetica', 'bold');
    doc.text(`Keterangan`, xHead1, yStart3);
    doc.text(`Awal`, xHead2, yStart3 - 1, { align: 'center' });
    doc.text(`(kWh)`, xHead2, yStart3 + 3, { align: 'center' });
    doc.text(`Akhir`, xHead3, yStart3 - 1, { align: 'center' });
    doc.text(`(kWh)`, xHead3, yStart3 + 3, { align: 'center' });
    doc.text(`Pemakaian`, xHead4, yStart3 - 1, { align: 'center' });
    doc.text(`(kWh)`, xHead4, yStart3 + 3, { align: 'center' });
    doc.text(`Tarif`, xHead5, yStart3 - 1, { align: 'center' });
    doc.text(`per kWh`, xHead5, yStart3 + 3, { align: 'center' });
    doc.text(`Jumlah`, xHead6, yStart3, { align: 'right' });

    // Draw a line under the header text
    doc.setLineWidth(0.1);
    doc.line(xStart - 5, yStart4, doc.internal.pageSize.getWidth() - 15, yStart4);

    // Table content
    doc.setFont('helvetica', 'normal');

    let yIsi = yStart5;
    doc.text(`${invoice?.keterangan || '-'}`, xHead1, yIsi);
    doc.text(`${formatDigit(invoice?.meter_listrik?.awal || 0, 2)}`, xHead2, yIsi, { align: 'center' });
    doc.text(`${formatDigit(invoice?.meter_listrik?.akhir || 0, 2)}`, xHead3, yIsi, { align: 'center' });
    doc.text(`${formatDigit(invoice?.pemakaian || 0, 2)}`, xHead4, yIsi, { align: 'center' });
    doc.text(`${formatDigit(invoice?.tarif || 0, 2)}`, xHead5, yIsi, { align: 'center' });
    doc.text(`${formatUang(invoice?.subtotal || 0)}`, xHead6, yIsi, { align: 'right' });

    yIsi += 6;
    doc.text(`PPJ (${formatUang(invoice?.ppj_persen || 0)}%)`, xHead1, yIsi);
    doc.text(`${formatUang(invoice?.ppj_jumlah || 0)}`, xHead6, yIsi, { align: 'right' });

    yIsi += 6;
    doc.text(`Backup Genset & Loss Energy (${formatUang(invoice?.genset_persen || 0)}%)`, xHead1, yIsi);
    doc.text(`${formatUang(invoice?.genset_jumlah || 0)}`, xHead6, yIsi, { align: 'right' });

    yIsi += 6;
    doc.text(`Biaya Admin`, xHead1, yIsi);
    doc.text(`${formatUang(invoice?.biaya_admin || 0)}`, xHead6, yIsi, { align: 'right' });

    if (invoice?.biaya_lain && invoice?.biaya_lain > 0) {
        yIsi += 6;
        doc.text(`Biaya Lain`, xHead1, yIsi);
        doc.text(`${formatUang(invoice?.biaya_lain || 0)}`, xHead6, yIsi, { align: 'right' });
    }

    if (invoice?.denda && invoice?.denda > 0) {
        yIsi += 6;
        doc.text(`Denda`, xHead1, yIsi);
        doc.text(`${formatUang(invoice?.denda || 0)}`, xHead6, yIsi, { align: 'right' });
    }

    yIsi += 6;
    doc.text(`PPN`, xHead1, yIsi);
    doc.text(`${formatUang(invoice?.ppn_jumlah || 0)}`, xHead6, yIsi, { align: 'right' });

    yIsi += 6;
    doc.text(`Materai`, xHead1, yIsi);
    doc.text(`${formatUang(invoice?.materai || 0)}`, xHead6, yIsi, { align: 'right' });

    doc.setLineWidth(0.1);
    doc.line(xStart - 5, yIsi + 2, doc.internal.pageSize.getWidth() - 15, yIsi + 2);

    // Total amount, bold the font
    const yTotal = yIsi + 7;
    doc.setFont('helvetica', 'bold');
    doc.text(`Total`, xHead1, yTotal);
    doc.text(`Rp.`, xHead5, yTotal);
    doc.text(`${formatUang(invoice?.tagihan || 0)}`, xHead6, yTotal, { align: 'right' });

    doc.setLineWidth(0.1);
    doc.line(xStart - 5, yTotal + 3, doc.internal.pageSize.getWidth() - 15, yTotal + 3);

    doc.setFont('helvetica', 'bold');
    // Terbilang, jika terlalu panjang, buat menjadi beberapa baris
    const terbilangText = `## ${invoice?.terbilang || '-'} ##`;
    const maxLineWidth = doc.internal.pageSize.getWidth() - 50; // Max width for the text
    const lines = doc.splitTextToSize(terbilangText, maxLineWidth);
    const lineHeight = 5; // Height of each line
    const xTerbilang = xStart; // X position for terbilang text
    const totalYWithLines = yTotal + 7; // Start position for terbilang text
    lines.forEach((line: string | string[], index: number) => {
        doc.text(line, xTerbilang, totalYWithLines + (index * lineHeight));
    });

    return doc;
}

export function BodyRekening({ doc, rekening }: PdfListrikProps): jsPDF {
    // reset font to normal for the bank account section
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    const yStart = 175;
    const yStart2 = yStart + 5;
    const xStart = 20;
    const xStart2 = xStart + 5;
    const xStart3 = xStart2 + 40;

    doc.text(`Pembayaran dilakukan ke rekening berikut :`, xStart, yStart);

    doc.text(`Bank`, xStart2, yStart2);
    doc.text(`Nomor Rekening`, xStart2, yStart2 + 5);
    doc.text(`Nama Rekening`, xStart2, yStart2 + 10);
    doc.text(`Cabang`, xStart2, yStart2 + 15);

    doc.text(`: ${rekening?.bank || '-'}`, xStart3, yStart2);
    doc.text(`: ${rekening?.norek || '-'}`, xStart3, yStart2 + 5);
    doc.text(`: ${rekening?.nama || '-'}`, xStart3, yStart2 + 10);
    doc.text(`: ${rekening?.cabang || '-'}`, xStart3, yStart2 + 15);

    return doc;
}

export function BodySignature({ doc, invoice, pdfHeader, signed }: PdfListrikProps): jsPDF {
    // reset font to normal for the signature section
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    const yStart = 210;
    const xStart = 120;

    pdfHeader?.forEach((header, index) => {
        if (index === 0) {
            doc.text(`${header},`, xStart, yStart);
        }
    });

    // get current site domain
    const siteDomain = window.location.origin;

    // const sitePath = window.location.pathname;
    // const siteUrl = `${siteDomain}${sitePath}`;
    // const qrCodeString = `${siteUrl}/${invoice?.uuid}`;

    const qrCodeString = `${siteDomain}/inv-listrik/${invoice?.uuid}`;

    // const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrCodeString)}&size=100x100`;
    let qrCodeUrl = `https://quickchart.io/qr?text=${encodeURIComponent(qrCodeString)}&format=png`;

    if (import.meta.env.PROD) {
        const image = `${siteDomain}/images/logo3-hd.png`
        qrCodeUrl = `${qrCodeUrl}&centerImageUrl=${image}`;
    }

    doc.addImage(qrCodeUrl, 'PNG',
        xStart - 70, // X position
        yStart, // Y position
        25, // Width
        25 // Height
    );

    doc.setFontSize(7);
    doc.text(`Digital Invoice`, xStart - 65, yStart);
    doc.text(`Scan and Download`, xStart - 68, yStart + 27);

    doc.setFontSize(10);
    if (signed && invoice?.sign?.ttd) {
        const ttd = `${invoice?.sign?.ttd}`
        doc.addImage(ttd, 'PNG',
            xStart + 5, // X position
            yStart + 2, // Y position
            25, // Width
            25 // Height
        );

        const logo = '/images/cap2.png';
        doc.addImage(logo, 'PNG',
            xStart + 15, // X position
            yStart - 7, // Y position
            40, // Width
            40 // Height
        );
    }

    doc.text(`${invoice?.sign?.nama}`, xStart, yStart + 25);

    doc.setLineWidth(0.1);
    doc.line(xStart - 1, yStart + 27, xStart + 55, yStart + 27);

    doc.text(`${invoice?.sign?.jabatan}`, xStart, yStart + 31);

    return doc;
}

export function Footer({ doc, notes }: PdfListrikProps): jsPDF {
    // reset font to normal for the footer
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');

    const pageHeight = doc.internal.pageSize.getHeight();
    const footerHeight = 10; // Height reserved for the footer
    const notesHeight = notes ? notes.length * 4 : 0; // Height needed for notes

    const yStart = pageHeight - footerHeight - notesHeight; // 10px padding from the bottom
    const xStart = 20;

    doc.text(`Catatan :`, xStart, yStart);
    if (notes && notes.length > 0) {
        notes.forEach((note, index) => {
            doc.text(`- ${note}`, xStart + 2, yStart + 4 + (index * 4));
        });
    }

    return doc;
}
