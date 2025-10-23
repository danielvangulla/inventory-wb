import jsPDF from 'jspdf';
import { PdfOtherProps } from './pdfModel';
import { formatTgl } from './functions';
import { formatUang } from './helpers';


export function BodyFirst({ doc, invoice }: PdfOtherProps): jsPDF {
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

    let tenantOwner = `${invoice?.tenant_book?.perusahaan || ''} (${invoice?.tenant_book?.nama_toko})`
    if (!invoice?.tenant_book?.nama_toko)
        tenantOwner = invoice?.tenant_nama || '';

    doc.text(`: ${tenantOwner}`, xStart2, yStart);

    // alamat, jika terlalu panjang, buat menjadi beberapa baris
    const alamatText = invoice?.tenant_book?.alamat || '';
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

    const tenantId = invoice?.tenant_book?.tenant_id || 0;
    const ltUnit = tenantId > 9000 ? `${(tenantId - 9000).toString()}` : invoice?.tenant_book?.tenant?.floor || '';
    const noUnit = invoice?.tenant_book?.tenant?.no ? `#${invoice.tenant_book?.tenant?.no}` : '';

    doc.text(`: Lt. ${ltUnit} ${noUnit}`, xStart4, yStart + 25);

    return doc;
}

export function BodySecond({ doc, invoice }: PdfOtherProps): jsPDF {
    // reset font to normal for the second body section
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    const yStart = 90; // Starting Y position for the second body section
    const yStart2 = yStart + 2; // Y position for the header line
    const yStart3 = yStart2 + 5; // Y position for the header text
    const yStart4 = yStart2 + 8; // Y position for the header line under the text
    const yStart5 = yStart3 + 8; // Y position for the description text

    const xStart = 20; // Starting X position for the table
    const xStart2 = xStart; // X position for the description column
    const xStart3 = xStart + 150; // X position for the amount column

    // Draw a line under the header
    doc.setLineWidth(0.1);
    doc.line(xStart - 5, yStart2, doc.internal.pageSize.getWidth() - 15, yStart2);

    // Table header
    doc.setFont('helvetica', 'bold');
    doc.text(`Keterangan`, xStart2, yStart3);
    doc.text(`Jumlah`, xStart3, yStart3);

    // Draw a line under the header text
    doc.setLineWidth(0.1);
    doc.line(xStart - 5, yStart4, doc.internal.pageSize.getWidth() - 15, yStart4);

    // Table content
    doc.setFont('helvetica', 'normal');
    let yStart5a = yStart5;

    invoice?.details?.forEach((v) => {
        doc.text(`${v.keterangan}`, xStart2, yStart5a);
        yStart5a += 5;
    });

    if (invoice?.ppn_jumlah && invoice.ppn_jumlah > 0) {
        doc.text(`PPN`, xStart2, yStart5a);
        yStart5a += 5;
    }

    doc.text(`Materai`, xStart2, yStart5a);


    let yStart5b = yStart5;

    invoice?.details?.forEach((v, i) => {
        if (i === 0) doc.text(`Rp.`, xStart3 - 20, yStart5b);
        doc.text(`${formatUang(v.jumlah)}`, xStart3 + 15, yStart5b, { align: 'right' });
        yStart5b += 5;
    });

    if (invoice?.ppn_jumlah && invoice.ppn_jumlah > 0) {
        doc.text(`${formatUang(invoice?.ppn_jumlah)}`, xStart3 + 15, yStart5b, { align: 'right' });
        yStart5b += 5;
    }

    doc.text(`${formatUang(invoice?.materai || 0)}`, xStart3 + 15, yStart5b, { align: 'right' });

    let yStart5c = yStart5a + 3;
    doc.setLineWidth(0.1);
    doc.line(xStart - 5, yStart5c, doc.internal.pageSize.getWidth() - 15, yStart5c);

    // Total amount, bold the font
    yStart5c += 5;
    doc.setFont('helvetica', 'bold');
    doc.text(`Total`, xStart2, yStart5c);
    doc.text(`Rp.`, xStart3 - 30, yStart5c);
    doc.text(`${formatUang(invoice?.total || 0)}`, xStart3 + 15, yStart5c, { align: 'right' });

    yStart5c += 2;
    doc.setLineWidth(0.1);
    doc.line(xStart - 5, yStart5c, doc.internal.pageSize.getWidth() - 15, yStart5c);

    doc.setFont('helvetica', 'normal');
    // Terbilang, jika terlalu panjang, buat menjadi beberapa baris
    const terbilangText = `## ${invoice?.terbilang || '-'} ##`;
    const maxLineWidth = doc.internal.pageSize.getWidth() - 50; // Max width for the text
    const lines = doc.splitTextToSize(terbilangText, maxLineWidth);
    const lineHeight = 5; // Height of each line
    const xTerbilang = xStart; // X position for terbilang text
    const totalYWithLines = yStart5c + 7; // Start position for terbilang text
    lines.forEach((line: string | string[], index: number) => {
        doc.text(line, xTerbilang, totalYWithLines + (index * lineHeight));
    });

    return doc;
}

export function BodyRekening({ doc, rekening }: PdfOtherProps): jsPDF {
    // reset font to normal for the bank account section
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    const yStart = 170;
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

export function BodySignature({ doc, invoice, pdfHeader, signed }: PdfOtherProps): jsPDF {
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

    const qrCodeString = `${siteDomain}/inv-others/${invoice?.uuid}`;

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

export function Footer({ doc, notes }: PdfOtherProps): jsPDF {
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
