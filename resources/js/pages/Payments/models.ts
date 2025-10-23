// pages/Payments/models.ts

import { Sign } from "../components/pdfModel";

export interface Payment {
    id: number;
    tenant_id: number;
    tenant_book_id: number;
    total_sewa: number;
    persen_dp: number;
    total_dp: number;
    sisa_dp: number;
    persen_cicilan: number;
    total_cicilan: number;
    sisa_cicilan: number;
    lama_cicilan: number;
    tgl_opening: string;
    tgl_close: string;
    grace_period: number;
    extend_period: number;
    notif: number;
    payment_dp: PaymentDp[];
    payment_sewa: PaymentSewa[];
    sign_id?: number;
    sign?: Sign;
    client_nama?: string;
    client_jabatan?: string;
    deposits?: Deposit[];
}

export interface PaymentDp {
    id: number;
    payment_id: number;
    ke: number;
    tgl: string;
    ket: string;
    persen: number;
    jumlah: number;
    sisa: number;
}

export interface PaymentSewa {
    id?: number;
    payment_id?: number;
    ke: number;
    ket: string;
    tgl: string;
    jumlah: number;
    sisa: number;
    paid?: boolean;
    sc?: number;
    levy?: number;
    total?: number;
}

export interface Deposit {
    id: number;
    payment_id: number;
    tgl: string;
    deposit: number;
    ket: string;
    sewa: number;
    service: number;
    telepon: number;
    jumlah: number;
    sisa: number;
}
