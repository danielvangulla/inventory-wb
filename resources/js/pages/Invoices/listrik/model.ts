import { Kuitansi, Rekening, Sign } from "@/pages/components/pdfModel";
import { TenantBook } from "@/pages/TenantBook/models";

export interface MeterListrik {
    id: number;
    tgl: string;
    awal: number;
    akhir: number;
    pemakaian: number;
    tenant_book_id: number;
    tenant_book?: TenantBook
}

export interface ListrikInvoice {
    id?: number;
    uuid?: string;
    meter_listrik_id: number;
    rekening_id: number;
    sign_id: number;
    keterangan: string;
    no: string;
    tgl: string;
    due: string;
    curr: string;
    pemakaian: number;
    tarif: number;
    subtotal: number;
    ppj_persen: number;
    ppj_jumlah: number;
    genset_persen: number;
    genset_jumlah: number;
    biaya_admin: number;
    biaya_lain: number;
    denda: number;
    selisih_bayar: number;
    total: number;
    ppn_persen: number;
    ppn_jumlah: number;
    materai: number;
    tagihan: number;
    terbilang: string;
    meter_listrik?: MeterListrik;
    rekening?: Rekening;
    sign?: Sign;
    is_paid?: boolean;
    notif_count?: number;
    kuitansi?: Kuitansi;
}
