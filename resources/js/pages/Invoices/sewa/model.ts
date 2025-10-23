import { Kuitansi, Rekening, Sign } from "@/pages/components/pdfModel";
import { TenantBook } from "@/pages/TenantBook/models";

export interface SewaInvoice {
    id: number;
    tenant_book_id: number;
    tenant_book?: TenantBook;
    rekening_id: number;
    rekening?: Rekening;
    sign_id: number;
    sign?: Sign;
    uuid?: string;
    no: string;
    tgl: string;
    due: string;
    curr: string;
    keterangan: string;
    jumlah: number;
    diskon_ket: string;
    diskon_jumlah: number;
    biaya_ket: string;
    biaya_jumlah: number;
    omset?: number;
    share_persen?: number;
    subtotal: number;
    ppn_persen: number;
    ppn_jumlah: number;
    materai: number;
    total: number;
    terbilang: string;
    is_dp: number;
    kuitansi?: Kuitansi
    deposit_count?: number;
    deposit_sewa?: number;
    deposit_service?: number;
    deposit_telp?: number;
    total_deposit?: number;
}
