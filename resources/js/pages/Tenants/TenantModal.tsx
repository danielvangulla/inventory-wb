// resources/js/Tenant/TenantModal.tsx
import React from 'react';

interface Tenant {
    id: number;
    title: string;
    description: string;
    height: number;
    width: number;
    margin_left: number;
    margin_top: number;
    no: string;
}

interface TenantModalProps {
    tenant: Tenant;
    onClose: () => void;
}

const TenantModal: React.FC<TenantModalProps> = ({ tenant, onClose }) => {
    return (
        <div
            style={{
                display: 'block',
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: '#fff',
                padding: '20px',
                border: '1px solid #ccc',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                zIndex: 9999,
            }}
        >
            <h4 className='text-black text-2xl text-center py-2'>{tenant.no}</h4>
            <p className='text-black'>{tenant.description}</p>

            <div className='flex justify-center'>
                <button
                    className='mt-6'
                    onClick={onClose} style={{ padding: '5px 10px', backgroundColor: 'gray', color: 'white' }}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default TenantModal;
