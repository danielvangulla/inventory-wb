import { MeterAir } from "../Invoices/air/model";
import { MeterListrik } from "../Invoices/listrik/model";
import { Payment } from "../Payments/models";

// pages/TenantBook/models.ts
export interface Tenant {
    id: number;
    title: string;
    description: string;
    floor: string;
    no: string;
    area: number;
    st_static: number;
}

export interface TenantBook {
    id: number;
    tenant_id: number;
    tenant?: Tenant;

    is_island?: number;

    nama_toko?: string;
    perusahaan?: string;
    telp?: string;
    email?: string;
    alamat?: string;
    npwp?: string;

    tgl_start?: string;
    tgl_end?: string;

    luas_indoor?: number;
    luas_outdoor?: number;
    lama_sewa?: number;

    total_sewa_indoor?: number;
    total_sewa_outdoor?: number;
    total_sewa?: number;
    sewa_per_bulan?: number;

    harga_service_indoor?: number;
    harga_service_outdoor?: number;
    service_per_bulan?: number;

    promotion_levy_start?: string;
    promotion_levy_end?: string;
    promotion_levy_persen?: number;
    promotion_levy_per_bulan?: number;

    deposit_sewa?: number;
    deposit_service?: number;
    deposit_telepon?: number;

    tenant_book_details?: TenantBookDetail[];
    payments?: Payment;

    meter_air?: MeterAir;
    meter_air_last?: MeterAir;
    meter_air_now?: MeterAir;

    meter_listrik?: MeterListrik;
    meter_listrik_last?: MeterListrik;
    meter_listrik_now?: MeterListrik;
}

export interface TenantBookDetail {
    id: number;
    tenant_book_id: number;
    lama_sewa: number;
    luas_indoor: number;
    harga_sewa_indoor: number;
    sewa_indoor: number;
    luas_outdoor: number;
    harga_sewa_outdoor: number;
    sewa_outdoor: number;
    total_sewa: number;
}
