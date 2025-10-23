import { jsPDF } from 'jspdf';
import { HeaderProps } from './pdfModel';

export function Header({ doc, pdfHeader, title }: HeaderProps): jsPDF {
    const logo = '/images/logo-header.png';
    doc.addImage(logo, 'PNG',
        15, // X position
        5, // Y position
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

        doc.text(header, 50, 17 + (index * 5));
    });

    doc.setLineWidth(0.5);
    doc.line(10, 40, doc.internal.pageSize.getWidth() - 10, 40);

    doc.setFont('helvetica', 'bold');
    const txt1 = `${title || ''}`;
    const text1X = (doc.internal.pageSize.getWidth() / 2);

    doc.setFontSize(16);
    doc.text(txt1, text1X, 47, { align: 'center' });

    return doc;
}
