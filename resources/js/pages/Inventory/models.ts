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

export interface GudangMasuk {
    id: number;
    tgl: string;
    supplier_id: number;
    penerima: string;
    brutto: number;
    disc: number;
    netto: number;
    tax: number;
    total: number;
    jenis_bayar: string;
    due: string;
    is_lunas: boolean;
    tgl_lunas?: string;
    supplier?: Supplier;
    details?: GudangMasukDetail[];
}

export interface GudangMasukDetail {
    id: number;
    gudang_masuk_id: number;
    barang_id: number;
    harga: number;
    qty: number;
    brutto: number;
    disc: number;
    netto: number;
    tax: number;
    total: number;
    barang?: Barang;
    gudang_masuk?: GudangMasuk;
}

export interface GudangKeluar {
    id: number;
    tgl: string;
    outlet_id: number;
    menyerahkan: string;
    mengambil: string;
    mengantar: string;
    total: number;
    outlet?: Outlet;
    details?: GudangKeluarDetail[];
    created_at: string;
}

export interface GudangKeluarDetail {
    id: number;
    gudang_keluar_id: number;
    barang_id: number;
    harga: number;
    qty: number;
    total: number;
    gudang_keluar?: GudangKeluar;
    barang?: Barang;
}

export interface BarangRusak {
    id: number;
    tgl: string;
    supplier_id: number;
    penerima: string;
    total: number;
    details?: BarangRusakDetail[];
    supplier?: Supplier;
}

export interface BarangRusakDetail {
    id: number;
    barang_rusak_id: number;
    barang_id: number;
    qty: number;
    harga: number;
    total: number;
    barang?: Barang;
    barang_rusak?: BarangRusak;
}

export interface Opname {
    id: number;
    tgl: string;
    catatan: string;
    user_id: number;
    total: number;
    details?: OpnameDet[];
    user?: User;
}

export interface OpnameDet {
    id: number;
    opname_id: number;
    barang_id: number;
    harga: number;
    qty_sistem: number;
    qty_fisik: number;
    qty_selisih: number;
    selisih_rp: number;
    barang?: Barang;
    opname?: Opname;
}
