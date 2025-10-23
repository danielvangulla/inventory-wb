// resources/js/Tenant/TenantService.ts
import axiosInstance from '@/lib/axios';  // Assuming you have a configured axios instance

// Define the type for tenant data
export interface Tenant {
    id: number;
    title: string;
    description: string;
    height: number;
    width: number;
    margin_left: number;
    margin_top: number;
}

export const getTenants = () => {
    return axiosInstance.get<Tenant[]>('/tenants');
};
