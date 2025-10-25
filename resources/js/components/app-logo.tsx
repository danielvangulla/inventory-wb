// import AppLogoIcon from './app-logo-icon';

import { CheckSquare } from "lucide-react";

const ownerName = import.meta.env.VITE_APP_OWNER || '';
const appClient = import.meta.env.VITE_APP_CLIENT || '';

export default function AppLogo() {
    return (
        <>
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-12 items-center justify-center rounded-full">
                {/* <AppLogoIcon className="size-5 fill-current text-white dark:text-black" /> */}
                <img className="fill-current bg-white text-white dark:text-black rounded-full" src='/images/inventory/logo.png' />
            </div>
            <div className="ml-0 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">
                    <span className="text-blue-500 hover:underline">{ownerName}</span>
                    {/* icon check */}
                    <CheckSquare className="inline size-4.5 ml-0.5 text-green-500" />
                    <br />
                    <span className="text-black dark:text-white text-xs font-semibold italic">{appClient}</span>
                </span>
            </div>
        </>
    );
}
