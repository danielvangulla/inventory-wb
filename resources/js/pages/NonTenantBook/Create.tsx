// pages/NonTenantBook/Create.tsx
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import type { BreadcrumbItem, PageProps } from '@/types';
import type { Tenant } from './models';
import FormCreate from './components/FormCreate';

interface Props extends PageProps {
    tenants: Tenant[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'TAMBAH KONTRAK NON-TENANT',
        href: '/nontenant-books/create',
    },
];

export default function Create({ tenants }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Kontrak Non-Tenant" />

            <div className="flex justify-center w-full p-4 mx-auto">
                <FormCreate
                    tenants={tenants}
                />
            </div>
        </AppLayout>
    );
}
