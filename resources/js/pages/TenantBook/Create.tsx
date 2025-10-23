// pages/TenantBook/Create.tsx
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import type { BreadcrumbItem, PageProps } from '@/types';
import type { Tenant } from './models';
import Form from './components/FormCreate';

interface Props extends PageProps {
    tenants: Tenant[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'TAMBAH KONTRAK SEWA',
        href: '/tenant-books/create',
    },
];

export default function Create({ tenants }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Kontrak Sewa" />

            <div className="p-4 max-w-3xl mx-auto">
                <Form
                    tenants={tenants}
                />
            </div>
        </AppLayout>
    );
}
