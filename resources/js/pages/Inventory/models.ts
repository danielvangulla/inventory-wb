export interface Setup {
    id: number;
    key: string;
    value: string;
    readonly_key: boolean;
    readonly_value: boolean;
}

export interface User {
    id: number;
    name: string;
    password?: string;
    user_level_id: number;
    level?: Level;
}

export interface Level {
    id: number;
    name: string;
    ket: string;
    is_admin: boolean;
    basic_read: boolean;
    basic_write: boolean;
    menu_read: boolean;
    menu_write: boolean;
    kasir: boolean;
    spv: boolean;
    laporan: boolean;
}

export interface Kategori {
    id: number;
    ket: string;
    urut: number;
}

export interface Kategorisub {
    id: number;
    kategori_id: number;
    ket: string;
    urut: number;
    kategori?: Kategori;
}

export interface menu {
    id: number;
    sku: string;
    tenant_id: number;
    kategorisub_id: number;
    alias: string;
    deskripsi: string;
    harga: number;
    is_ready: boolean;
    is_soldout: boolean;
    kategorisub?: Kategorisub;
    qty?: number;
    total?: number;
}
