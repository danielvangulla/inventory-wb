import { Kuitansi, Rekening, Sign } from "@/pages/components/pdfModel";
import { TenantBook } from "@/pages/TenantBook/models";

export interface InvoiceOthers {
    id: number;
    uuid?: string;
    invoice_other_type_id: number;
    type?: InvoiceOtherType;
    tenant_book_id: number;
    tenant_book?: TenantBook;
    tenant_nama: string;
    rekening_id: number;
    rekening?: Rekening;
    sign_id: number;
    sign?: Sign;
    no: string;
    tgl: string;
    due: string;
    curr: string;
    keterangan: string;
    jumlah: number;
    subtotal: number;
    ppn_persen: number;
    ppn_jumlah: number;
    materai: number;
    total: number;
    terbilang: string;
    kuitansi?: Kuitansi
    details: InvoiceOtherDetail[]
}

export interface InvoiceOtherDetail {
    id: number;
    invoice_other_id?: number;
    keterangan: string;
    jumlah: number;
}

export interface InvoiceOtherType {
    id: number;
    tipe: string;
    ket: string;
}
