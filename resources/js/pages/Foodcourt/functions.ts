export function formatNumber(num: number, decimalPlaces: number): string {
    if (!num) return '-';
    return parseFloat(num.toString()).toLocaleString('id-ID', { minimumFractionDigits: decimalPlaces, maximumFractionDigits: decimalPlaces });
}
