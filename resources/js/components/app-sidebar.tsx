// resources/js/components/app-sidebar.tsx
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ArrowBigRightDash, Settings2, Users, Monitor, ChartAreaIcon, BoxIcon } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { userLevel } = usePage().props;

    const level = userLevel as {
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
    };

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/inventory',
            icon: Monitor,
        },
    ];

    if (level.is_admin) {
        mainNavItems.push({
            title: 'Pengaturan Sistem',
            href: '/inventory/setup',
            icon: Settings2,
        });
    }

    if (level.is_admin) {
        mainNavItems.push(
        {
            title: 'Pengaturan User',
            href: '#',
            icon: Users,
            subItems: [
                {
                    title: 'Levels',
                    href: '/inventory/user-level',
                    icon: ArrowBigRightDash,
                },
                {
                    title: 'Users',
                    href: '/inventory/users',
                    icon: ArrowBigRightDash,
                },
            ],
        });
    }

    if (level.is_admin || level.spv || level.menu_read) {
        mainNavItems.push(
        {
            title: 'Pengaturan Dasar',
            href: '#',
            icon: Settings2,
            subItems: [
                {
                    title: 'Suppliers',
                    href: '/inventory/suppliers',
                    icon: ArrowBigRightDash,
                },
                {
                    title: 'Outlets',
                    href: '/inventory/outlets',
                    icon: ArrowBigRightDash,
                },
            ],
        });
    }

    if (level.is_admin || level.spv || level.menu_read) {
        mainNavItems.push(
        {
            title: 'Pengaturan Barang',
            href: '#',
            icon: BoxIcon,
            subItems: [
                {
                    title: 'Kategori',
                    href: '/inventory/kategori',
                    icon: ArrowBigRightDash,
                },
                {
                    title: 'Sub-kategori',
                    href: '/inventory/kategorisub',
                    icon: ArrowBigRightDash,
                },
                {
                    title: 'Daftar Barang',
                    href: '/inventory/barang',
                    icon: ArrowBigRightDash,
                },
            ],
        });
    }

    if (level.is_admin || level.spv || level.kasir) {
        mainNavItems.push(
        {
            title: 'Transaksi',
            href: '#',
            icon: BoxIcon,
            subItems: [
                {
                    title: 'Terima Gudang',
                    href: '/inventory/terima-gudang',
                    icon: ArrowBigRightDash,
                },
                {
                    title: 'Hutang',
                    href: '/inventory/hutang',
                    icon: ArrowBigRightDash,
                },
                {
                    title: 'Keluar Gudang',
                    href: '/inventory/keluar-gudang',
                    icon: ArrowBigRightDash,
                },
                {
                    title: 'Barang Rusak',
                    href: '/inventory/barang-rusak',
                    icon: ArrowBigRightDash,
                },
                {
                    title: 'Stok Opname',
                    href: '/inventory/stok-opname',
                    icon: ArrowBigRightDash,
                },
            ],
        });
    }

    if (level.laporan) {
        mainNavItems.push(
        {
            title: 'Laporan',
            href: '#',
            icon: ChartAreaIcon,
            subItems: [
                {
                    title: 'Pembelian',
                    href: `/inventory/laporan-pembelian`,
                    icon: ArrowBigRightDash,
                },
                {
                    title: 'Barang Keluar',
                    href: `/inventory/laporan-barang-keluar`,
                    icon: ArrowBigRightDash,
                },
                {
                    title: 'Barang Rusak',
                    href: '/inventory/laporan-barang-rusak',
                    icon: ArrowBigRightDash,
                },
                {
                    title: 'Hutang',
                    href: '/inventory/laporan-hutang',
                    icon: ArrowBigRightDash,
                },
                {
                    title: 'Pembayaran Hutang',
                    href: '/inventory/laporan-hutang-lunas',
                    icon: ArrowBigRightDash,
                },
                {
                    title: 'Stok Opname',
                    href: '/inventory/laporan-stok-opname',
                    icon: ArrowBigRightDash,
                },
            ],
        });
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
