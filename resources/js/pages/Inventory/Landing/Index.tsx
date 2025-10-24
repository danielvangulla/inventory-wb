/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";

const features = [
    {
        title: "Menu Variatif",
        desc: "Nikmati beragam pilihan makanan lezat dari berbagai tenant favorit.",
        color: "bg-pink-200",
        icon: "🍔",
    },
    {
        title: "Promo Menarik",
        desc: "Dapatkan diskon dan promo spesial setiap hari hanya di FoodCourt.",
        color: "bg-yellow-200",
        icon: "🎁",
    },
    {
        title: "Pesan Mudah",
        desc: "Pesan makanan favoritmu dengan cepat dan praktis lewat aplikasi.",
        color: "bg-green-200",
        icon: "📱",
    },
];

interface Props {
    tenants: any[];
}

const Index: React.FC<Props> = ({ tenants }) => {

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'DASHBOARD',
            href: '/inventory/landing',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={breadcrumbs[0].title} />

            <div className="w-full mt-2 px-4 py-4 max-w-lg md:max-w-xl lg:max-w-3xl xl:max-w-5xl 2xl:max-w-full mx-auto bg-amber-100 rounded-lg shadow-md">
                <div className="flex flex-col justify-center items-center bg-transparent rounded-lg shadow-md border-2 border-red-500 mb-4">
                    <img src="/images/inventory/logo.png" alt="FoodCourt Logo" className="relative py-2 w-80 h-80 object-cover rounded-md" />

                    <div className="absolute flex flex-col justify-center items-center">
                        {/* <img src="/images/logo3-hd.png" alt="FoodCourt Logo" className="w-30 h-30 mb-4 z-10" /> */}

                        <div className="flex flex-col justify-center items-center text-4xl text-center font-bold mb-4 bg-white text-blue-500 shadow-md shadow-purple-400 rounded-xl border-2 border-red-300 p-2 z-10">
                            Inventory Management System
                        </div>
                    </div>
                </div>

                <div className="w-full grid gap-6 md:grid-cols-2 lg:grid-cols-3 z-10">
                    {[].map((feature, index) => (
                        <div key={index} className={`p-6 border border-red-500 rounded-lg shadow-md ${feature.color} hover:shadow-lg transition-shadow duration-300`}>
                            <div className="text-4xl mb-4">{feature.icon}</div>
                            <h2 className="text-xl font-semibold mb-2">{feature.title}</h2>
                            <p className="text-gray-700">{feature.desc}</p>
                        </div>
                    ))}
                </div>

                {/* list tenants, with horizontal scrolling, with background image in every tenant card */}
                <div className="mt-6 z-10">
                    {/* <h3 className="text-lg font-semibold mb-2">Tenants</h3> */}
                    <div className="flex flex-row gap-4 overflow-x-auto w-full p-2">
                        {tenants.map((tenant, index) => (
                            <div key={index} className="min-w-64 p-4 bg-gray-100 border border-red-300 rounded-lg shadow-sm shadow-purple-500 bg-cover bg-center text-center">
                                {/* image on tenant card as background*/}
                                <div className="relative bg-black opacity-30 rounded-lg">
                                    <img src={tenant.foto_tenant || '/images/foodcourt/no-image.png'} alt={tenant.nama_tenant} className="w-30 h-full object-cover rounded-lg" />
                                </div>
                                <h4 className="font-semibold">{tenant.nama_tenant}</h4>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6 text-center text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} Novaquila Development. All rights reserved.
                </div>
            </div>

        </AppLayout>
    );
}

export default Index;
