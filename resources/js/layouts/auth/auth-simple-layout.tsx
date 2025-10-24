// import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="w-full max-w-sm rounded-lg border bg-card shadow-md dark:border-slate-700 dark:bg-slate-800 p-4">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col items-center gap-1">
                        <Link href={route('inventory.landing')} className="flex flex-col items-center gap-2 font-medium">
                            <div className="mb-1 flex h-60 w-60 items-center justify-center rounded-md">
                                {/* <AppLogoIcon className="size-9 fill-current text-[var(--foreground)] dark:text-white" /> */}
                                <img className="fill-current text-white dark:text-black rounded-xl" src='/images/inventory/logo.png' />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-medium">{title}</h1>
                            <p className="text-muted-foreground text-center text-sm">{description}</p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
