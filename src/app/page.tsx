"use client";

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import { PropertyCard } from "@/components/property/PropertyCard";
import { MOCK_LISTINGS } from "@/data/mock-listings";
import { useLanguage } from "@/context/LanguageContext";

import { PropertyTypeMenu } from "@/components/home/PropertyTypeMenu";

export default function Home() {
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
                <span className="text-brand-600">{MOCK_LISTINGS.length}</span> {t('landsForSale')}
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
              {MOCK_LISTINGS.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
