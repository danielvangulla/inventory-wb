/* eslint-disable @typescript-eslint/no-explicit-any */
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatUang } from "./helpers";
import { formatTgl } from "./functions";
import { PaymentDp, PaymentSewa } from "../Payments/models";
import { dataPdfSimulasi } from "./pdfModel";

interface SimulasiPdf {
    doc: jsPDF;
    dataPdf: dataPdfSimulasi;
    paymentDps: PaymentDp[];
    paymentSewa: PaymentSewa[];
}

export function pdfSimulasi({ doc, dataPdf, paymentDps, paymentSewa }: SimulasiPdf) {
    let x = 15;
    let y = 60;

    const ySpace = 5;

    const x1a = x;
    const x1b = x1a + 21;

    const x2a = x1b + 32;
    const x2b = x2a + 27;

    const x3a = x2b + 37;
    const x3b = x3a + 32;

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`Nama Toko`, x1a, y);
    doc.text(`: ${dataPdf.namaToko || ''}`, x1b, y);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    // Row 1
    y += ySpace + 2;
    doc.text(dataPdf.lLantai, x1a, y);
    doc.text(`: ${dataPdf.lantai}`, x1b, y);
    doc.text(dataPdf.lUnit, x2a, y);
    doc.text(`: ${dataPdf.unit}`, x2b, y);
    doc.text(dataPdf.lTotalAngsuran, x3a, y);
    doc.text(`: ${dataPdf.totalAngsuran}`, x3b, y);

    // Row 2
    y += ySpace;
    doc.text(dataPdf.lLuasIndoor, x1a, y);
    doc.text(`: ${dataPdf.luasIndoor}`, x1b, y);
    doc.text(dataPdf.lHargaIndoor, x2a, y);
    doc.text(`: ${dataPdf.hargaIndoor}`, x2b, y);
    doc.text(dataPdf.lLamaCicilan, x3a, y);
    doc.text(`: ${dataPdf.lamaCicilan}`, x3b, y);

    // Row 3
    y += ySpace;
    doc.text(dataPdf.lLuasOutdoor, x1a, y);
    doc.text(`: ${dataPdf.luasOutdoor}`, x1b, y);
    doc.text(dataPdf.lHargaOutdoor, x2a, y);
    doc.text(`: ${dataPdf.hargaOutdoor}`, x2b, y);
    doc.text(dataPdf.lGracePeriod, x3a, y);
    doc.text(`: ${dataPdf.gracePeriod}`, x3b, y);

    // Row 4
    y += ySpace;
    doc.text(dataPdf.lLamaSewa, x1a, y);
    doc.text(`: ${dataPdf.lamaSewa}`, x1b, y);
    doc.text(dataPdf.lTotalSewa, x2a, y);
    doc.text(`: ${dataPdf.totalSewa}`, x2b, y);
    doc.text(dataPdf.lSewaPerBulan, x3a, y);
    doc.text(`: ${dataPdf.sewaPerBulan}`, x3b, y);

    // Row 5
    y += ySpace;
    doc.text(dataPdf.lTglMulai, x1a, y);
    doc.text(`: ${dataPdf.tglMulai}`, x1b, y);
    doc.text(dataPdf.lUangMuka, x2a, y);
    doc.text(`: ${dataPdf.uangMuka}`, x2b, y);

    // Row 6
    y += ySpace;
    doc.text(dataPdf.lTglSelesai, x1a, y);
    doc.text(`: ${dataPdf.tglSelesai}`, x1b, y);
    doc.text(dataPdf.lCicilanUM, x2a, y);
    doc.text(`: ${dataPdf.cicilanUM}`, x2b, y);


    // Start drawing tables
    y += 13;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text('Uang Muka', x, y);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const headers = [['Ke', 'Tanggal', 'Keterangan', 'Persen', 'Jumlah', 'Sisa']];
    const data = paymentDps.map((dp) => [
        dp.ke,
        formatTgl(dp.tgl),
        dp.ket,
        `${dp.persen} %`,
        formatUang(dp.jumlah),
        formatUang(dp.sisa),
    ]);

    autoTable(doc, {
        head: headers,
        headStyles: { halign: 'center', fontStyle: 'bold' },
        body: data,
        columnStyles: {
            0: { halign: 'center' },
            1: { halign: 'center' },
            2: { halign: 'left' },
            3: { halign: 'center' },
            4: { halign: 'right' },
            5: { halign: 'right' },
        },
        startY: y + 3,
        theme: 'grid',
    });

    // Adjust y position for Cicilan Sewa table
    const firstTableHeight = (data.length * 10) + 16;
    y += firstTableHeight;

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text('Cicilan Sewa', x, y);

    y += 3;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const sewaHeaders = [['Ke', 'Tanggal', 'Keterangan', 'Jumlah', 'Sisa', 'SC', 'Levy', 'Total']];
    const sewaData = paymentSewa.map((sewa) => [
        sewa.ke,
        formatTgl(sewa.tgl),
        sewa.ket,
        formatUang(sewa.jumlah),
        formatUang(sewa.sisa),
        formatUang(sewa.sc || 0),
        formatUang(sewa.levy || 0),
        formatUang(sewa.total || 0),
    ]);

    autoTable(doc, {
        head: sewaHeaders,
        headStyles: { halign: 'center', fontStyle: 'bold' },
        body: sewaData,
        columnStyles: {
            0: { halign: 'center' },
            1: { halign: 'center' },
            2: { halign: 'center' },
            3: { halign: 'right' },
            4: { halign: 'right' },
            5: { halign: 'right' },
            6: { halign: 'right' },
            7: { halign: 'right' },
        },
        startY: y,
        theme: 'grid',
    });

    // Add signature section after the tables
    doc.setFontSize(10);

    const pageHeight = doc.internal.pageSize.getHeight();
    const lastTableY = (doc as any).lastAutoTable.finalY;
    let signY = lastTableY + 10;

    const freeSpace = pageHeight - lastTableY;
    if (freeSpace < 20) {
        doc.addPage();
        signY = 20;
    }

    // left side signature
    x = 20;
    y = signY;

    doc.setFont("helvetica", "bold");
    doc.text(dataPdf.perusahaan, x, y);

    doc.setFont("helvetica", "normal");

    y += 22;
    doc.text(dataPdf.signNama, x, y);

    // add horizontal line
    doc.line(x - 1, y + 2, x + 50, y + 2);

    y += 6;
    doc.text(dataPdf.signJabatan, x, y);

    // right side signature
    x = doc.internal.pageSize.getWidth() / 2 + 20;
    y = signY;

    doc.setFont("helvetica", "bold");
    doc.text(dataPdf.clientPerusahaan, x, y);

    doc.setFont("helvetica", "normal");

    y += 22;
    doc.text(dataPdf.clientNama, x, y);

    // add horizontal line
    doc.line(x - 1, y + 2, x + 50, y + 2);

    y += 6;
    doc.text(dataPdf.clientJabatan, x, y);

}
