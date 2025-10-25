// resources/js/components/nav-main.tsx

import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';

const appName = import.meta.env.VITE_APP_NAME || '';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();

    // Using an object to track open/closed submenus by their title
    const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>({});

    // Function to handle submenu toggle
    const handleSubMenuToggle = (title: string) => {
        setOpenSubMenus((prev) => ({
            ...prev,
            [title]: !prev[title], // Toggle the current submenu state
        }));
    };

    // Automatically open submenus if URL matches the submenu href
    useEffect(() => {
        // Loop through each menu item
        items.forEach((item) => {
            if (item.subItems) {
                // Check if any subItem href matches the current page URL
                item.subItems.forEach((subItem) => {
                    if (subItem.href === page.url) {
                        setOpenSubMenus((prev) => ({
                            ...prev,
                            [item.title]: true, // Open the submenu if a subItem matches the current page URL
                        }));
                    }
                });
            }
        });
    }, [page.url, items]); // Run when the page URL or items change

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>
                <span className="text-red-500 font-bold">{appName}</span>
            </SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <div key={item.title}>
                        {/* Main Item */}
                        {!item.subItems && (
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={item.href === page.url} tooltip={{ children: item.title }}>
                                    <Link href={item.href} prefetch className='bg-gray-300 hover:bg-gray-400 font-bold text-gray-700 flex items-center mb-1'>
                                        {item.icon && <item.icon className='text-red-500' />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )}

                        {/* Check if there are subItems */}
                        {item.subItems && (
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={item.href === page.url}
                                    tooltip={{ children: item.title }}
                                    onClick={() => handleSubMenuToggle(item.title)}  // Toggle submenu on click
                                >
                                    <span className='bg-gray-300 hover:bg-gray-400 font-bold text-gray-700 flex items-center mb-1 cursor-pointer'>
                                        {item.icon && <item.icon className='text-red-500' />}
                                        <span>{item.title}</span>

                                        <span className='ml-auto'>
                                            <ChevronDown className={`ml-auto transition-transform ${openSubMenus[item.title] ? 'rotate-180' : ''}`} />
                                        </span>
                                    </span>
                                </SidebarMenuButton>

                                {openSubMenus[item.title] && (
                                    <SidebarMenu className='pl-4'>
                                        {item.subItems.map((subItem) => (
                                            <SidebarMenuItem key={subItem.title}>
                                                <SidebarMenuButton asChild isActive={subItem.href === page.url}>
                                                    <Link href={subItem.href} prefetch className='bg-gray-300 hover:bg-gray-500 text-gray-700'>
                                                        {subItem.icon && <subItem.icon className='text-blue-500' />}
                                                        <span className=''>{subItem.title}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </SidebarMenu>
                                )}
                            </SidebarMenuItem>
                        )}
                    </div>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
