// pages/TenantBook/Edit.tsx
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import type { BreadcrumbItem, PageProps } from '@/types';
import type { Tenant, TenantBook, TenantBookDetail } from './models';
import Form from './components/FormEdit';

interface Props extends PageProps {
    tenants: Tenant[];
    tenantBook: TenantBook;
    tenantBookDetails: TenantBookDetail[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'EDIT KONTRAK SEWA',
        href: '/tenant-books/edit',
    },
];

export default function Create({ tenants, tenantBook }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Kontrak Sewa" />
            <div className="p-4 max-w-3xl mx-auto">
                {/* Form */}
                <Form
                    tenants={tenants}
                    tenantBook={tenantBook}
                />

            </div>
        </AppLayout>
    );
}
