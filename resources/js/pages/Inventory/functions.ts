export const printWindow = (url: string) => {

    const width = window.screen.width * 0.6;
    const height = window.screen.height * 0.8;

    const left = width - width * 0.7;
    const top = height - height * 0.95;

    const windowFeatures = `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,status=no,directories=no,copyhistory=no,titlebar=no,fullscreen=no,channelmode=no,hotkeys=no,personalbar=no`;

    const printWindow = window.open(url, '_blank', windowFeatures);
    if (printWindow) {
        printWindow.focus();
        printWindow.onload = () => {
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 200);
        }
    }
}
