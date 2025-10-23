import jsPDF from "jspdf";
import { ServiceInvoice } from "../Invoices/service/model";
import { AirInvoice } from "../Invoices/air/model";
import { ListrikInvoice } from "../Invoices/listrik/model";
import { SewaInvoice } from "../Invoices/sewa/model";
import { TenantBook } from "../TenantBook/models";
import { InvoiceOthers } from "../Invoices/others/model";

export interface HeaderProps {
    doc: jsPDF;
    pdfHeader?: string[];
    title?: string;
}

export interface PdfOtherProps {
    doc: jsPDF;
    pdfHeader?: string[];
    invoice?: InvoiceOthers;
    rekening?: Rekening;
    notes?: string[];
    signed?: boolean;
    tenant_book?: TenantBook;
}

export interface PdfSewaProps {
    doc: jsPDF;
    pdfHeader?: string[];
    invoice?: SewaInvoice;
    rekening?: Rekening;
    notes?: string[];
    signed?: boolean;
    tenant_book?: TenantBook;
}

export interface PdfServiceProps {
    doc: jsPDF;
    pdfHeader?: string[];
    invoice?: ServiceInvoice;
    rekening?: Rekening;
    notes?: string[];
    signed?: boolean;
}

export interface PdfAirProps {
    doc: jsPDF;
    pdfHeader?: string[];
    invoice?: AirInvoice;
    rekening?: Rekening;
    notes?: string[];
    signed?: boolean;
}

export interface PdfListrikProps {
    doc: jsPDF;
    pdfHeader?: string[];
    invoice?: ListrikInvoice;
    rekening?: Rekening;
    notes?: string[];
    signed?: boolean;
}

export interface PdfKuitansiProps {
    doc: jsPDF;
    pdfHeader?: string[];
    kuitansi?: Kuitansi;
    rekening?: Rekening;
    signs?: Sign[];
    tenant_book?: TenantBook;
}

export interface Rekening {
    id: number;
    bank: string;
    norek: string;
    nama: string;
    cabang: string;
}

export interface Sign {
    id: number;
    nama: string;
    jabatan: string;
    ttd: string;
}

export interface Kuitansi {
    tgl: string;
    no: string;
    keterangan: string;
    total: number;
    terbilang: string;
    jenis: string;
    invoice_id: number;
    invoice_no: string;
    invoice?: ServiceInvoice | AirInvoice | ListrikInvoice | SewaInvoice | InvoiceOthers;
    tenant_book_id: number;
    sign_id: number;
    tenant_book?: TenantBook;
    sign?: Sign;
    kota?: string;
}

export interface City {
    id: number;
    nama: string;
}

export interface dataPdfSimulasi {
    lNamaToko: string;
    namaToko: string;

    // row 1
    lLantai: string;
    lantai: string;
    lUnit: string;
    unit: string;
    lTotalAngsuran: string;
    totalAngsuran: string;

    // row 2
    lLuasIndoor: string;
    luasIndoor: string;
    lHargaIndoor: string;
    hargaIndoor: string;
    lLamaCicilan: string;
    lamaCicilan: string;

    // row 3
    lLuasOutdoor: string;
    luasOutdoor: string;
    lHargaOutdoor: string;
    hargaOutdoor: string;
    lGracePeriod: string;
    gracePeriod: string;

    // row 4
    lLamaSewa: string;
    lamaSewa: string;
    lTotalSewa: string;
    totalSewa: string;
    lExtendPeriod: string;
    extendPeriod: string;

    // row 5
    lTglMulai: string;
    tglMulai: string;
    lUangMuka: string;
    uangMuka: string;
    lSewaPerBulan: string;
    sewaPerBulan: string;

    // row 6
    lTglSelesai: string;
    tglSelesai: string;
    lCicilanUM: string;
    cicilanUM: string;

    // Signs
    perusahaan: string;
    signNama: string;
    signJabatan: string;
    clientPerusahaan: string;
    clientNama: string;
    clientJabatan: string;
}
