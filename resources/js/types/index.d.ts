/* eslint-disable @typescript-eslint/no-explicit-any */

import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';
import { Page } from '@inertiajs/inertia';

export interface PageProps extends Page<any> {
  auth?: {
    user?: {
      id: number;
      name: string;
      email: string;
    };
  };
}

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

// export interface NavItem {
//     title: string;
//     href: string;
//     icon?: LucideIcon | null;
//     isActive?: boolean;
// }

// Assuming this is where the NavItem type is defined
export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    subItems?: NavItem[];  // Add this line to allow submenus
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}
