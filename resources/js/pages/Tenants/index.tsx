// resources/js/Pages/Tenants.tsx

import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { useState } from 'react';
import TenantModal from './TenantModal';

const divider = 2.0; // Adjust this value to scale the tenant boxes
const bgColor = 'bg-amber-400 hover:bg-amber-100';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'TENANTS',
        href: '/tenants',
    },
];

// Define the type for tenant data
interface Tenant {
    id: number;
    title: string;
    description: string;
    height: number;
    width: number;
    margin_left: number;
    margin_top: number;
    floor: string;
    no: string;
    area: number;
    st_static: boolean;
    rotate: number;
}

interface Props {
    tenants: Tenant[];
}

const format = (area: number) => {
    return area.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const Tenants: React.FC<Props> = ({ tenants }) => {
    const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

    const handleTenantClick = (tenant: Tenant) => {
        setSelectedTenant(tenant); // Set the selected tenant to display in the modal
    };

    const handleCloseModal = () => {
        setSelectedTenant(null); // Close the modal by clearing the selected tenant
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tenants" />
            <div className='bg-gray-200'>
                <div id="mall" style={{ position: 'relative', width: '100%', height: '90vh' }}>
                    {tenants.map((tenant) => (
                        <div
                            key={tenant.id}
                            className={`tenant ${tenant.st_static ? 'bg-gray-400' : bgColor} hover:text-black text-xs justify-center items-center text-center content-center`}
                            style={{
                                position: 'absolute',
                                height: `${tenant.height / divider}px`,
                                width: `${tenant.width / divider}px`,
                                left: `${tenant.margin_left / divider}px`,
                                top: `${tenant.margin_top / divider}px`,
                                border: '1px solid #000',
                                cursor: tenant.st_static ? 'disabled' : 'pointer',
                                padding: '1px',
                                transform: tenant.rotate ? `rotate(${tenant.rotate}deg)` : 'none',
                            }}
                            onClick={() => tenant.st_static ? ()=>{} : handleTenantClick(tenant)}  // Trigger modal on click
                        >
                            <p className='text-xs'>{tenant.no != '0' ? `${tenant.floor}-${tenant.no}` : ''}</p>
                            <p className='text-xs'>{tenant.area > 0 ? `${format(tenant.area)}m²` : ''}</p>
                        </div>
                    ))}
                </div>

                {/* Display modal with tenant details when one is selected */}
                {selectedTenant && (
                    <TenantModal tenant={selectedTenant} onClose={handleCloseModal} />
                )}
            </div>
        </AppLayout>
    );
};

export default Tenants;
