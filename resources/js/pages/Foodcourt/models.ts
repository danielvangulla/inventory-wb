export interface transaksi {
    id: number;
    user_id: number;
    tgl: string;
    brutto: number;
    disc: number;
    netto: number;
    tax: number;
    service: number;
    card_charge: number;
    total: number;
    jenis_bayar: string;
    channel_bayar: string;
    uang_cash: number;
    kembalian: number;
    card_no?: string;
    items?: orderItem[];
    user?: user;
    void_count: number;
    user_void_id?: number;
    uservoid?: user;
    deleted_at?: string;
}

export interface orderItem {
    id: number;
    sku: string;
    alias: string;
    harga: number;
    qty: number;
    brutto: number;
    disc: number;
    netto: number;
    tax: number;
    service: number;
    total: number;
}

export interface tenant {
    id: number;
    nama_tenant: string;
    perusahaan: string;
    owner: string;
    hp: string;
    email: string;
    alamat: string;
    ip_printer: string;
}

export interface kategori {
    id: number;
    ket: string;
    urut: number;
}

export interface kategorisub {
    id: number;
    kategori_id: number;
    ket: string;
    urut: number;
    kategori?: kategori;
}

export interface menu {
    id: number;
    sku: string;
    tenant_id: number;
    kategorisub_id: number;
    alias: string;
    deskripsi: string;
    image_url?: string;
    harga: number;
    is_ready: boolean;
    is_soldout: boolean;
    tenant?: tenant;
    kategorisub?: kategorisub;
    qty?: number;
    total?: number;
}

export interface setup {
    id: number;
    key: string;
    value: string;
    readonly_key: boolean;
    readonly_value: boolean;
}

export interface user {
    id: number;
    name: string;
    password?: string;
    user_level_id: number;
    tenant_id?: number;
    level?: level;
    tenant?: tenant;
}

export interface level {
    id: number;
    name: string;
    ket: string;
    is_admin: boolean;
    basic_read: boolean;
    basic_write: boolean;
    tenant_read: boolean;
    tenant_write: boolean;
    menu_read: boolean;
    menu_write: boolean;
    kasir: boolean;
    spv: boolean;
    laporan: boolean;
}
