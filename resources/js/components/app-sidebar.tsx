// resources/js/components/app-sidebar.tsx
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Store, ArrowBigRightDash, Settings2, Users, Monitor, ChartAreaIcon, BoxIcon } from 'lucide-react';
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

    if (level.tenant_read || level.tenant_write || level.is_admin) {
        mainNavItems.push({
            title: 'Daftar Tenants',
            href: '/inventory/tenants',
            icon: Store,
        });
    }

    if (level.is_admin || level.kasir || level.spv) {
        mainNavItems.push({
            title: 'Transaksi Kasir',
            href: '/inventory/kasir',
            icon: LayoutGrid,
        });
    }

    if (level.is_admin || level.kasir || level.spv) {
        mainNavItems.push({
            title: 'History Transaksi',
            href: '/inventory/history',
            icon: LayoutGrid,
        });
    }

    const subItemsLaporan = [];

    if (level.is_admin) {
        subItemsLaporan.push(
                {
                    title: 'Omset Tenant',
                    href: '/inventory/rekap-omset-tenant',
                    icon: ArrowBigRightDash,
                },
        );
    }

    if (level.laporan) {
        subItemsLaporan.push(
            {
                title: 'Omset Harian',
                href: '/inventory/rekap-omset-harian',
                icon: ArrowBigRightDash,
            },
            {
                title: 'Penjualan by Item',
                href: '/inventory/penjualan-by-item',
                icon: ArrowBigRightDash,
            }
        );
    }

    if (level.laporan || level.is_admin) {
        mainNavItems.push({
            title: 'Laporan',
            href: '#',
            icon: ChartAreaIcon,
            subItems: subItemsLaporan,
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
