import { Kuitansi, Rekening, Sign } from "@/pages/components/pdfModel";
import { TenantBook } from "@/pages/TenantBook/models";

export interface MeterAir {
    id: number;
    tgl: string;
    awal: number;
    akhir: number;
    pemakaian: number;
    tenant_book_id: number;
    tenant_book?: TenantBook
}

export interface TarifAir {
    tarif_air_1: number;
    tarif_air_2: number;
    tarif_air_3: number;
}

export interface AirInvoice {
    id?: number;
    uuid?: string;
    meter_air_id: number;
    rekening_id: number;
    sign_id: number;
    keterangan: string;
    no: string;
    tgl: string;
    due: string;
    curr: string;
    pemakaian: number;
    subtotal: number;
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
    meter_air?: MeterAir;
    rekening?: Rekening;
    sign?: Sign;
    is_paid?: boolean;
    notif_count?: number;
    air_invoice_details?: AirInvoiceDetail[];
    kuitansi?: Kuitansi;
}

export interface AirInvoiceDetail {
    id?: number;
    air_invoice_id?: number;
    ket: string;
    volume: number;
    tarif: number;
    jumlah: number;
}
