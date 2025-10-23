import { Kuitansi, Rekening, Sign } from "@/pages/components/pdfModel";
import { TenantBook } from "@/pages/TenantBook/models";

export interface ServiceInvoice {
    id: number;
    uuid: string;
    no: string;
    tgl: string;
    due: string;
    curr: string;
    tenant_book_id: number;
    tenant_book?: TenantBook;
    toko: string;
    perusahaan: string;
    alamat: string;
    floor: string;
    unit: string;
    period_start: string;
    period_end: string;
    keterangan: string;
    jumlah: number;
    diskon_ket: string;
    diskon_jumlah: number;
    biaya_ket: string;
    biaya_jumlah: number;
    promotion_levy_persen: number;
    promotion_levy_jumlah: number;
    subtotal: number;
    ppn_persen: number;
    ppn_jumlah: number;
    materai: number;
    total: number;
    terbilang: string;
    rekening_id: number;
    rekening?: Rekening;
    sign_id: number;
    sign?: Sign;
    kuitansi?: Kuitansi;
}
