"use client";

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import { ListingCard } from "@/components/home/ListingCard";
import { useLanguage } from "@/context/LanguageContext";
import { PropertyTypeMenu } from "@/components/home/PropertyTypeMenu";

interface HomeClientProps {
    properties: any[];
}

export function HomeClient({ properties }: HomeClientProps) {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Header />

            <main className="container mx-auto px-4 py-8">
                <PropertyTypeMenu />
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <Sidebar />

                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-2xl font-bold text-slate-800">
                                <span className="text-brand-600">{properties.length}</span> {t('landsForSale')}
                            </h1>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                {t('sortBy')}:
                                <select className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer">
                                    <option>{t('newest')}</option>
                                    <option>{t('priceLowHigh')}</option>
                                    <option>{t('priceHighLow')}</option>
                                </select>
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {properties.map(property => (
                                <ListingCard key={property.id} property={property} />
                            ))}
                        </div>

                        {properties.length === 0 && (
                            <div className="text-center py-20 text-slate-400">
                                ไม่พบประกาศที่ค้นหา
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
