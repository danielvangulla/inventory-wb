// pages/components/functions.ts
export const noInvoiceDeposit = (arrayInvoice: string[] | null): string => {
    const A = "PS" // Prefix for the invoice number
    const B = "DS" // associated with Deposit Sewa
    const C = new Date().getFullYear().toString().slice(-2); // Last two digits of the current year
    const D = (new Date().getMonth() + 1).toString().padStart(2, '0'); // Current month, padded to 2 digits
    const E = "0001"; // assuming this is the sequence number part of the invoice number, reset every month

    // Default invoice number format: PS/DS-25050001
    const defaultNo = `${A}/${B}-${C}${D}${E}`;

    if (!arrayInvoice || arrayInvoice.length === 0) {
        return defaultNo;
    }

    // Find the highest invoice number in the array which matches the current month and year
    // and extract the sequence number to increment it
    // Convert the array of invoice numbers to a format that can be compared
    const arrayInvoiceFormatted = arrayInvoice.map(invoice => {
        // Ensure the invoice number matches the expected format
        const regex = new RegExp(`^${A}/${B}-${C}${D}(\\d{4})$`);
        const match = invoice.match(regex);
        return match ? match[0] : null; // Return the matched invoice number or null if it doesn't match
    }).filter(invoice => invoice !== null); // Filter out any null values

    if (arrayInvoiceFormatted.length === 0) {
        return defaultNo; // If no valid invoice numbers found, return the default invoice number
    }

    // Sort the invoice numbers to find the last one
    const lastInvoiceNo = arrayInvoiceFormatted.sort().pop() as string; // Get the last invoice number
    if (!lastInvoiceNo) {
        return defaultNo; // If no last invoice number found, return the default invoice number
    }

    // Extract the sequence number from the last invoice number
    const sequenceRegex = new RegExp(`${A}/${B}-${C}${D}(\\d{4})`);
    const match = lastInvoiceNo.match(sequenceRegex);
    if (!match || match.length < 2) {
        return defaultNo; // If no match found, return the default invoice number
    }
    const lastSequenceNumber = parseInt(match[1], 10); // Extract the sequence number part (e.g., 001)
    const newSequenceNumber = lastSequenceNumber + 1; // Increment the sequence number
    const newSequence = newSequenceNumber.toString().padStart(4, '0'); // Ensure it is 3 digits with leading zeros

    return `${A}/${B}-${C}${D}${newSequence}`;
}

export const noInvoiceKuitansi = (arrayInvoice: string[] | null, tglBayar: string): string => {
    const A = "PS" // Prefix for the invoice number
    const B = "KU" // associated with Kuitansi
    const C = new Date(tglBayar).getFullYear().toString().slice(-2); // Last two digits of the year from tglBayar
    const D = "00001"; // assuming this is the sequence number part of the invoice number, reset every month
    // Default invoice number format: PS/KU2505-00001
    const defaultNo = `${A}/${B}${C}-${D}`;

    if (!arrayInvoice || arrayInvoice.length === 0) {
        return defaultNo;
    }

    // Find the highest invoice number in the array which matches the current month and year
    // and extract the sequence number to increment it
    // Convert the array of invoice numbers to a format that can be compared
    const arrayInvoiceFormatted = arrayInvoice.map(invoice => {
        // Ensure the invoice number matches the expected format
        const regex = new RegExp(`^${A}/${B}${C}-(\\d{5})$`);
        const match = invoice.match(regex);
        return match ? match[0] : null; // Return the matched invoice number or null if it doesn't match
    }).filter(invoice => invoice !== null); // Filter out any null values

    if (arrayInvoiceFormatted.length === 0) {
        return defaultNo; // If no valid invoice numbers found, return the default invoice number
    }

    // Sort the invoice numbers to find the last one
    const lastInvoiceNo = arrayInvoiceFormatted.sort().pop() as string; // Get the last invoice number
    if (!lastInvoiceNo) {
        return defaultNo; // If no last invoice number found, return the default invoice number
    }

    // Extract the sequence number from the last invoice number
    const sequenceRegex = new RegExp(`${A}/${B}${C}-(\\d{5})`);
    const match = lastInvoiceNo.match(sequenceRegex);
    if (!match || match.length < 2) {
        return defaultNo; // If no match found, return the default invoice number
    }

    const lastSequenceNumber = parseInt(match[1], 10); // Extract the sequence number part (e.g., 00001)
    const newSequenceNumber = lastSequenceNumber + 1; // Increment the sequence number
    const newSequence = newSequenceNumber.toString().padStart(5, '0'); // Ensure it is 5 digits with leading zeros
    return `${A}/${B}${C}-${newSequence}`;
}

export const noInvoiceSewa = (arrayInvoice: string[] | null, isDp: number): string => {
    const A = "PS" // Prefix for the invoice number
    const B = isDp === 1 ? "INV" : "CS" // associated with DP/Cicilan Sewa
    const C = new Date().getFullYear().toString().slice(-2); // Last two digits of the current year
    const D = (new Date().getMonth() + 1).toString().padStart(2, '0'); // Current month, padded to 2 digits
    const E = "0001"; // assuming this is the sequence number part of the invoice number, reset every month

    // Default invoice number format: PS/SC-25050001
    const defaultNo = `${A}/${B}-${C}${D}${E}`;

    if (!arrayInvoice || arrayInvoice.length === 0) {
        return defaultNo;
    }

    // Find the highest invoice number in the array which matches the current month and year
    // and extract the sequence number to increment it
    // Convert the array of invoice numbers to a format that can be compared
    const arrayInvoiceFormatted = arrayInvoice.map(invoice => {
        // Ensure the invoice number matches the expected format
        const regex = new RegExp(`^${A}/${B}-${C}${D}(\\d{4})$`);
        const match = invoice.match(regex);
        return match ? match[0] : null; // Return the matched invoice number or null if it doesn't match
    }).filter(invoice => invoice !== null); // Filter out any null values

    if (arrayInvoiceFormatted.length === 0) {
        return defaultNo; // If no valid invoice numbers found, return the default invoice number
    }

    // Sort the invoice numbers to find the last one
    const lastInvoiceNo = arrayInvoiceFormatted.sort().pop() as string; // Get the last invoice number
    if (!lastInvoiceNo) {
        return defaultNo; // If no last invoice number found, return the default invoice number
    }

    // Extract the sequence number from the last invoice number
    const sequenceRegex = new RegExp(`${A}/${B}-${C}${D}(\\d{4})`);
    const match = lastInvoiceNo.match(sequenceRegex);
    if (!match || match.length < 2) {
        return defaultNo; // If no match found, return the default invoice number
    }
    const lastSequenceNumber = parseInt(match[1], 10); // Extract the sequence number part (e.g., 001)
    const newSequenceNumber = lastSequenceNumber + 1; // Increment the sequence number
    const newSequence = newSequenceNumber.toString().padStart(4, '0'); // Ensure it is 3 digits with leading zeros

    return `${A}/${B}-${C}${D}${newSequence}`;
}

export const noInvoiceService = (arrayInvoice: string[] | null): string => {
    const A = "PS" // Prefix for the invoice number
    const B = "SC" // associated with Service Charge
    const C = new Date().getFullYear().toString().slice(-2); // Last two digits of the current year
    const D = (new Date().getMonth() + 1).toString().padStart(2, '0'); // Current month, padded to 2 digits
    const E = "0001"; // assuming this is the sequence number part of the invoice number, reset every month

    // Default invoice number format: PS/SC-25050001
    const defaultNo = `${A}/${B}-${C}${D}${E}`;

    if (!arrayInvoice || arrayInvoice.length === 0) {
        return defaultNo;
    }

    // Find the highest invoice number in the array which matches the current month and year
    // and extract the sequence number to increment it
    // Convert the array of invoice numbers to a format that can be compared
    const arrayInvoiceFormatted = arrayInvoice.map(invoice => {
        // Ensure the invoice number matches the expected format
        const regex = new RegExp(`^${A}/${B}-${C}${D}(\\d{4})$`);
        const match = invoice.match(regex);
        return match ? match[0] : null; // Return the matched invoice number or null if it doesn't match
    }).filter(invoice => invoice !== null); // Filter out any null values

    if (arrayInvoiceFormatted.length === 0) {
        return defaultNo; // If no valid invoice numbers found, return the default invoice number
    }

    // Sort the invoice numbers to find the last one
    const lastInvoiceNo = arrayInvoiceFormatted.sort().pop() as string; // Get the last invoice number
    if (!lastInvoiceNo) {
        return defaultNo; // If no last invoice number found, return the default invoice number
    }

    // Extract the sequence number from the last invoice number
    const sequenceRegex = new RegExp(`${A}/${B}-${C}${D}(\\d{4})`);
    const match = lastInvoiceNo.match(sequenceRegex);
    if (!match || match.length < 2) {
        return defaultNo; // If no match found, return the default invoice number
    }
    const lastSequenceNumber = parseInt(match[1], 10); // Extract the sequence number part (e.g., 001)
    const newSequenceNumber = lastSequenceNumber + 1; // Increment the sequence number
    const newSequence = newSequenceNumber.toString().padStart(4, '0'); // Ensure it is 3 digits with leading zeros

    return `${A}/${B}-${C}${D}${newSequence}`;
}

export const noInvoiceAir = (arrayInvoice: string[] | null): string => {
    const A = "PS" // Prefix for the invoice number
    const B = "IA" // associated with Invoice Air
    const C = new Date().getFullYear().toString().slice(-2); // Last two digits of the current year
    const D = (new Date().getMonth() + 1).toString().padStart(2, '0'); // Current month, padded to 2 digits
    const E = "0001"; // assuming this is the sequence number part of the invoice number, reset every month

    // Default invoice number format: PS/SC-25050001
    const defaultNo = `${A}/${B}-${C}${D}${E}`;

    if (!arrayInvoice || arrayInvoice.length === 0) {
        return defaultNo;
    }

    // Find the highest invoice number in the array which matches the current month and year
    // and extract the sequence number to increment it
    // Convert the array of invoice numbers to a format that can be compared
    const arrayInvoiceFormatted = arrayInvoice.map(invoice => {
        // Ensure the invoice number matches the expected format
        const regex = new RegExp(`^${A}/${B}-${C}${D}(\\d{4})$`);
        const match = invoice.match(regex);
        return match ? match[0] : null; // Return the matched invoice number or null if it doesn't match
    }).filter(invoice => invoice !== null); // Filter out any null values

    if (arrayInvoiceFormatted.length === 0) {
        return defaultNo; // If no valid invoice numbers found, return the default invoice number
    }

    // Sort the invoice numbers to find the last one
    const lastInvoiceNo = arrayInvoiceFormatted.sort().pop() as string; // Get the last invoice number
    if (!lastInvoiceNo) {
        return defaultNo; // If no last invoice number found, return the default invoice number
    }

    // Extract the sequence number from the last invoice number
    const sequenceRegex = new RegExp(`${A}/${B}-${C}${D}(\\d{4})`);
    const match = lastInvoiceNo.match(sequenceRegex);
    if (!match || match.length < 2) {
        return defaultNo; // If no match found, return the default invoice number
    }
    const lastSequenceNumber = parseInt(match[1], 10); // Extract the sequence number part (e.g., 001)
    const newSequenceNumber = lastSequenceNumber + 1; // Increment the sequence number
    const newSequence = newSequenceNumber.toString().padStart(4, '0'); // Ensure it is 3 digits with leading zeros

    return `${A}/${B}-${C}${D}${newSequence}`;
}

export const noInvoiceListrik = (arrayInvoice: string[] | null): string => {
    const A = "PS" // Prefix for the invoice number
    const B = "IL" // associated with Invoice Listrik
    const C = new Date().getFullYear().toString().slice(-2); // Last two digits of the current year
    const D = (new Date().getMonth() + 1).toString().padStart(2, '0'); // Current month, padded to 2 digits
    const E = "0001";

    // Default invoice number format: PS/SC-25050001
    const defaultNo = `${A}/${B}-${C}${D}${E}`;

    if (!arrayInvoice || arrayInvoice.length === 0) {
        return defaultNo;
    }

    // Find the highest invoice number in the array which matches the current month and year
    // and extract the sequence number to increment it
    // Convert the array of invoice numbers to a format that can be compared
    const arrayInvoiceFormatted = arrayInvoice.map(invoice => {
        // Ensure the invoice number matches the expected format
        const regex = new RegExp(`^${A}/${B}-${C}${D}(\\d{4})$`);
        const match = invoice.match(regex);
        return match ? match[0] : null; // Return the matched invoice number or null if it doesn't match
    }).filter(invoice => invoice !== null); // Filter out any null values

    if (arrayInvoiceFormatted.length === 0) {
        return defaultNo; // If no valid invoice numbers found, return the default invoice number
    }

    // Sort the invoice numbers to find the last one
    const lastInvoiceNo = arrayInvoiceFormatted.sort().pop() as string; // Get the last invoice number
    if (!lastInvoiceNo) {
        return defaultNo; // If no last invoice number found, return the default invoice number
    }

    // Extract the sequence number from the last invoice number
    const sequenceRegex = new RegExp(`${A}/${B}-${C}${D}(\\d{4})`);
    const match = lastInvoiceNo.match(sequenceRegex);
    if (!match || match.length < 2) {
        return defaultNo; // If no match found, return the default invoice number
    }
    const lastSequenceNumber = parseInt(match[1], 10); // Extract the sequence number part (e.g., 001)
    const newSequenceNumber = lastSequenceNumber + 1; // Increment the sequence number
    const newSequence = newSequenceNumber.toString().padStart(4, '0'); // Ensure it is 3 digits with leading zeros

    return `${A}/${B}-${C}${D}${newSequence}`;
}

export const terbilang = (angka: number): string => {
    const bilangan = [
        '', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan',
        'Sepuluh', 'Sebelas', 'Dua Belas', 'Tiga Belas', 'Empat Belas', 'Lima Belas', 'Enam Belas', 'Tujuh Belas',
        'Delapan Belas', 'Sembilan Belas', 'Dua Puluh', 'Tiga Puluh', 'Empat Puluh', 'Lima Puluh', 'Enam Puluh',
        'Tujuh Puluh', 'Delapan Puluh', 'Sembilan Puluh', 'Seratus', 'Seribu', 'Juta', 'Miliar', 'Triliun'
    ];

    if (angka === 0) return 'Nol';

    let hasil = '';

    // Handle trillion
    if (angka >= 1_000_000_000_000) {
        hasil += terbilang(Math.floor(angka / 1_000_000_000_000)) + ' Triliun ';
        angka %= 1_000_000_000_000;
    }

    // Handle billion
    if (angka >= 1_000_000_000) {
        hasil += terbilang(Math.floor(angka / 1_000_000_000)) + ' Miliar ';
        angka %= 1_000_000_000;
    }

    // Handle million
    if (angka >= 1_000_000) {
        hasil += terbilang(Math.floor(angka / 1_000_000)) + ' Juta ';
        angka %= 1_000_000;
    }

    // Handle thousand
    if (angka >= 1000) {
        if (Math.floor(angka / 1000) === 1) {
            hasil += 'Seribu ';
        } else {
            hasil += terbilang(Math.floor(angka / 1000)) + ' Ribu ';
        }
        angka %= 1000;
    }

    // Handle hundred
    if (angka >= 100) {
        if (Math.floor(angka / 100) === 1) {
            hasil += 'Seratus ';
        } else {
            hasil += bilangan[Math.floor(angka / 100)] + ' Ratus ';
        }
        angka %= 100;
    }

    // Handle tens
    if (angka >= 20) {
        hasil += bilangan[Math.floor(angka / 10) + 18] + ' ';
        angka %= 10;
    }

    // Handle ones
    if (angka > 0) {
        const angkaBulat = Math.floor(angka);
        // if (angka === 1) {
        //     if (hasil.trim().endsWith('Puluh') || hasil.trim().endsWith('Ratus') || hasil.trim().endsWith('Ribu')) {
        //         hasil += 'Se';
        //     } else {
        //         hasil += bilangan[angka];
        //     }
        // } else {
            hasil += bilangan[angkaBulat];
        // }
    }

    // handle decimal, max 2 decimal places, jika second decimalnya 0, tidak perlu ditampilkan
    if (angka % 1 !== 0) {
        const decimalPart = (angka % 1).toFixed(2).split('.')[1];
        if (decimalPart) {
            hasil += ' koma ';
            if (decimalPart[0] !== '0') {
                hasil += bilangan[parseInt(decimalPart[0], 10)] + ' ';
            }
            if (decimalPart[1] !== '0') {
                hasil += bilangan[parseInt(decimalPart[1], 10)] + ' ';
            }
        }
    }

    return hasil.trim();
};


// buat fungsi untuk menghilangkan decimal jika decimalnya 0 tanpa currency format
export const validateDecimal = (value: number): string => {
    // Format the number  currency format
    const formattedValue = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(value);

    // Remove the decimal part if it is .00
    const formated = formattedValue.replace(/,00$/, '');

    // Remove the currency symbol and return the value
    return formated.replace(/Rp\s/, '').replace(/\./g, ',').trim();
}

// Format date to Indonesian format as d M Y like PHP, the month use indonesian language, show full month name
export const formatTgl = (date: string | Date): string => {
    if (!date) return '';

    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    };

    // Create a new Date object if the input is a string
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    // Format the date to Indonesian format
    return dateObj.toLocaleDateString('id-ID', options).replace(/\./g, '');
}

export const monthYear = (date: Date): string => {
    if (!date) return '';

    const options: Intl.DateTimeFormatOptions = {
        month: 'long',
        year: 'numeric',
    };

    // Create a new Date object if the input is a string
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    return dateObj.toLocaleDateString('id-ID', options).replace(/\./g, '');
}
