import jsPDF from "jspdf";
import { HeaderProps, PdfKuitansiProps } from "./pdfModel";
import { formatUang } from "./helpers";
import { InvoiceOthers } from "../Invoices/others/model";

export function Header({ doc, pdfHeader }: HeaderProps): jsPDF {
    const logo = '/images/logo-header.png';
    doc.addImage(logo, 'PNG',
        15, // X position
        2, // Y position
        28, // Width
        40 // Height
    );


    let fontSize = 13;
    let fontStyle = 'bold';

    pdfHeader?.forEach((header, index) => {
        if (index > 0) {
            fontSize = 10;
            fontStyle = 'normal';
        }

        doc.setFontSize(fontSize);
        doc.setFont('helvetica', fontStyle);

        doc.text(header, 50, 13 + (index * 5));
    });

    doc.setLineWidth(0.5);
    doc.line(10, 35, doc.internal.pageSize.getWidth() - 10, 35);

    doc.setFont('helvetica', 'bold');
    const txt1 = `KUITANSI`;
    const text1Width = doc.getTextWidth(txt1);
    const text1X = ((doc.internal.pageSize.getWidth() - text1Width) / 2) + 10;

    doc.setFontSize(13);
    doc.text(txt1, text1X, 42, { align: 'center' });

    return doc;
}

export function Body({ doc, kuitansi }: PdfKuitansiProps): jsPDF {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    const yStart = 45; // Starting Y position for the first body section
    const xStart = 20; // Starting X position for the body text

    const pageWidth = doc.internal.pageSize.getWidth();
    doc.text(`Nomor : ${kuitansi?.no}`, pageWidth - 20, yStart, { align: 'right' });

    doc.setFontSize(10);
    let isiStart = yStart + 10; // Move down for the next line
    let xIsi = xStart; // Starting X position for the body text
    doc.text(`Telah terima dari`, xIsi, isiStart);
    doc.text(`:`, xIsi += 35, isiStart);
    doc.setFont('helvetica', 'bold');

    const namaPerusahaan = kuitansi?.tenant_book?.perusahaan || "";

    const namaToko = kuitansi?.tenant_book?.nama_toko ||
        (kuitansi?.invoice
            ? (kuitansi?.invoice as InvoiceOthers).tenant_nama
            : "") ||
        "Toko Tidak Diketahui";

    const slash = namaToko && namaPerusahaan ? ' / ' : '';

    const namaTokoPerusahaan = `${namaPerusahaan} ${slash} ${namaToko} `;

    doc.text(`${namaTokoPerusahaan}`, xIsi += 3, isiStart);
    doc.setFont('helvetica', 'normal');

    isiStart += 7; // Move down for the next line
    xIsi = xStart; // Reset X position for the next line
    doc.text(`Uang Sebesar`, xIsi, isiStart);
    doc.text(`:`, xIsi += 35, isiStart);
    doc.setFont('helvetica', 'bold');
    doc.text(`Rp. ${formatUang(kuitansi?.total || 0)}`, xIsi += 3, isiStart);
    doc.setFont('helvetica', 'normal');

    const maxLineWidth = doc.internal.pageSize.getWidth() - xIsi - 30; // Max width for the text

    isiStart += 7; // Move down for the next line
    xIsi = xStart; // Reset X position for the next line
    doc.text(`Terbilang`, xIsi, isiStart);
    doc.text(`:`, xIsi += 35, isiStart);
    const terbilangText = `${kuitansi?.terbilang || '-'}`;
    const lines = doc.splitTextToSize(terbilangText, maxLineWidth);
    lines.forEach((line: string | string[],) => {
        doc.text(line, xIsi + 3, isiStart);
        isiStart += 5; // Increment totalY for the next line
    });

    isiStart += 2; // Add some space before the next section
    xIsi = xStart; // Reset X position for the next line
    doc.text(`Untuk Pembayaran`, xIsi, isiStart);
    doc.text(`:`, xIsi += 35, isiStart);
    const keteranganText = `${kuitansi?.keterangan || '-'}`;
    const keteranganLines = doc.splitTextToSize(keteranganText, maxLineWidth);
    keteranganLines.forEach((line: string | string[],) => {
        doc.text(line, xIsi + 3, isiStart);
        isiStart += 5; // Increment totalY for the next line
    });

    return doc;
}

export function Signature({ doc, kuitansi, signs }: PdfKuitansiProps): jsPDF {
    const selectedSign = signs?.find(sign => sign.id === kuitansi?.sign_id);

    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();

    let yStart = pageHeight - 48; // Starting Y position for the signature section
    const xStart = pageWidth - 80; // X position for the signature text

    const tgl = kuitansi?.tgl ? new Date(kuitansi.tgl).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : '-';

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    doc.text(`${kuitansi?.kota}, ${tgl}`, xStart, yStart, { align: 'left' });

    // const logo = '/images/materai.png';
    // doc.addImage(logo, 'PNG',
    //     xStart + 2, // X position
    //     yStart + 8, // Y position
    //     20, // Width
    //     12 // Height
    // );

    doc.setFont('helvetica', 'bold');
    doc.text(`${selectedSign?.nama}`, xStart, yStart += 30, { align: 'left' });

    yStart += 2
    doc.line(xStart - 5, yStart, xStart + 50, yStart); // Line for signature

    doc.setFont('helvetica', 'normal');
    doc.text(`${selectedSign?.jabatan}`, xStart, yStart += 4, { align: 'left' });


    // Add QR Code
    // const qrStart = pageHeight - 48; // Starting Y position for the signature section

    // const siteDomain = window.location.origin;
    // const qrCodeString = `${siteDomain}/${urlInv(kuitansi?.jenis || '', kuitansi?.invoice?.uuid || '')}`;
    // let qrCodeUrl = `https://quickchart.io/qr?text=${encodeURIComponent(qrCodeString)}&format=png`;

    // if (import.meta.env.PROD) {
    //     const image = `${siteDomain}/images/logo3-hd.png`
    //     qrCodeUrl = `${qrCodeUrl}&centerImageUrl=${image}`;
    // }

    // doc.addImage(qrCodeUrl, 'PNG',
    //     35, // X position
    //     qrStart + 5, // Y position
    //     25, // Width
    //     25 // Height
    // );

    // doc.setFontSize(7);
    // doc.text(`Digital Invoice`, 40, qrStart + 5);
    // doc.text(`Scan and Download`, 37, qrStart + 32);

    return doc;
}

// function urlInv (jenis:string, uuid:string) {
//     let path = 'sewa';

//     switch (jenis) {
//         case 'listrik':
//             path = 'listrik';
//             break;
//         case 'air':
//             path = 'air';
//             break;
//         case 'service':
//             path = 'serv';
//             break;
//     }

//     return `inv-${path}/${uuid}`;
// }
