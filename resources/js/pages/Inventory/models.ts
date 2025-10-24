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
    kategorisubs?: Kategorisub[];
}

export interface Kategorisub {
    id: number;
    kategori_id: number;
    ket: string;
    urut: number;
    kategori?: Kategori;
}

export interface Barang {
    id: number;
    deskripsi: string;
    kategori_id: number;
    kategorisub_id: number;
    stok: number;
    min_stok: number;
    satuan: string;
    isi: number;
    harga_beli: number;
    harga_jual: number;
    kategori?: Kategori;
    kategorisub?: Kategorisub;
}

export interface Supplier {
    id: number;
    nama: string;
    alamat: string;
}

export type Outlet = Supplier;
