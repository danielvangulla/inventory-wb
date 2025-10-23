// pages/Payments/Create.tsx
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import type { BreadcrumbItem, PageProps } from '@/types';
import { TenantBook } from '../TenantBook/models';
import Form from './components/FormCreate';
import { Sign } from '../components/pdfModel';

interface Props extends PageProps {
    username: string;
    tenantBook: TenantBook[];
    signs: Sign[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'INPUT SIMULASI PAYMENT',
        href: '/tenant-payments/create',
    },
];

export default function Create({ username, tenantBook, signs }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Kontrak Sewa" />

            <div className="p-4 max-w-3xl mx-auto">
                <Form
                    username={username}
                    tenantBook={tenantBook}
                    signs={signs}
                />
            </div>
        </AppLayout>
    );
}
