import { TenantBook } from "../TenantBook/models";

// pages/NonTenantBook/models.ts
export interface Tenant {
    id: number;
    title: string;
    description: string;
    floor: string;
    no: string;
    area: number;
    st_static: number;
    tenant_book?: TenantBook[];
}

export interface NonTenantBook {
    id?: number;
    tenant_id: number;
    nama_toko: string;
    perusahaan: string;
    alamat: string;
    npwp: string;
    telp: string;
    email: string;
    tenant?: Tenant;
}
