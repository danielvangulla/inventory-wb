import jsPDF from "jspdf";

// pages/TenantBook/helpers.ts
export const formatValue = (value: number | string) => {
    if (typeof value === 'string') {
        value = parseFloat(value);
    }

    const formattedValue = value.toString().replace(/^0+/, '');
    if (formattedValue === '') return 0;

    return parseFloat(formattedValue);
};


export const formatNumber = (val?: number | string | null) => {
    if (!val) return '-';
    return parseFloat(val.toString()).toLocaleString('id-ID', { minimumFractionDigits: 0 });
};

export const formatDateStringMonth = (val?: string | null) => {
    if (!val) return '-';

    return new Date(val).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: '2-digit'
    });
};

export const dateAddDays = (date: string, days: number): Date => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
};

export const dateAddMonths = (date: Date, months: number): Date => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + months);
    return newDate;
};

export const dateAddMonthsAddDays = (date: Date, months: number, days: number): Date => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + months);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
}

export const formatDate = (val?: string | null) => {
    if (!val) return '-';

    // if below 10 return 0 as prefix, example: 01 Jan 2023
    const date = new Date(val);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('id-ID', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
};

export const formatUang = (value: number): string => {
    return new Intl.NumberFormat('id-ID', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

export const formatDigit = (value: number, digit: number): string => {
    return new Intl.NumberFormat('id-ID', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: digit,
    }).format(value);
};

export const formatDateForInput = (date: string | null | undefined) => {
    // Ensure the date is valid
    if (!date) {
        return ''; // Return an empty string if the date is invalid or null/undefined
    }

    const parsedDate = new Date(date);

    // Check if the date is invalid
    if (isNaN(parsedDate.getTime())) {
        return ''; // Return an empty string for an invalid date
    }

    // Return date in 'yyyy-MM-dd' format
    return parsedDate.toISOString().split('T')[0];
};

export const addPageNumbers = (doc: jsPDF, filename: string) => {
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        const timestamp = new Date().toLocaleString('id-ID', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        }).replace(/[/, ]/g, '-').replace(/:/g, '');

        const pageText = `${filename} (${timestamp}) Page ${i} of ${pageCount}`;
        doc.text(pageText, pageWidth / 2, pageHeight - 10, { align: "center" });
    }
}
