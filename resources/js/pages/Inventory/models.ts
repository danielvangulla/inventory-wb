
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
