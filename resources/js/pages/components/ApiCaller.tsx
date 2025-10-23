export const getPdfHeader = async (t: number) => {
    try {
        const tipe = t || 0;
        const url = tipe === 0 ? '/invoice-notes' : '/deposit-notes';

        const respNotes = await fetch(url);
        if (!respNotes.ok) {
            console.error('Server response error to get invoice notes');
        }

        const dataNotes = await respNotes.json();

        return {
            pdfHeader: dataNotes.pdfHeader || [],
            invoiceNotes: dataNotes.invoiceNotes || [],
        };
    } catch (error) {
        console.error('Error API Caller pdfHeader : ', error);
    }
}
