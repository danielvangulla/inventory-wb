// pages/TenantBook/Edit.tsx
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import type { BreadcrumbItem, PageProps } from '@/types';
import type { Tenant, NonTenantBook } from './models';
import FormEdit from './components/FormEdit';

interface Props extends PageProps {
    tenants: Tenant[];
    nontenantBook: NonTenantBook;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'EDIT KONTRAK SEWA',
        href: '/tenant-books/edit',
    },
];

export default function Create({ tenants, nontenantBook }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Kontrak Sewa" />
            <div className="p-4 max-w-3xl mx-auto">
                {/* Form */}
                <FormEdit
                    tenants={tenants}
                    nontenantBook={nontenantBook}
                />

            </div>
        </AppLayout>
    );
}
