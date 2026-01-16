"use client";

import React, { useEffect, useState } from 'react';
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { MyPropertyCard } from "@/components/property/MyPropertyCard";
import { PageLoader } from "@/components/ui/PageLoader";
import { Search, ListFilter, ArrowUpDown, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PropertyStatus } from '@prisma/client';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function MyPropertiesPage() {
    const { user, isLoading } = useAuth();
    const { t } = useLanguage();
    const router = useRouter();
    const [properties, setProperties] = useState<any[]>([]);
    const [isPropertiesLoading, setIsPropertiesLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    const fetchProperties = React.useCallback(async () => {
        if (!user) return;

        try {
            setIsPropertiesLoading(true);
            const res = await fetch('/api/properties');

            if (res.status === 401) {
                console.error("API returned 401 Unauthorized");
                alert("Session expired. Please log in again.");
                return;
            }

            if (res.ok) {
                const data = await res.json();
                setProperties(data);
            } else {
                console.error("API Error:", res.status, res.statusText);
                const err = await res.text();
                console.error("Error details:", err);
                alert(`Failed to load properties: ${res.statusText}`);
            }
        } catch (error) {
            console.error("Failed to fetch properties", error);
            alert("Failed to fetch properties. See console.");
        } finally {
            setIsPropertiesLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/');
            return;
        }

        if (!isLoading && user) {
            fetchProperties();
        }
    }, [user, isLoading, router, fetchProperties]);

    // Statistics Counts
    const stats = {
        all: properties.length,
        online: properties.filter(p => p.status === 'ACTIVE').length,
        draft: properties.filter(p => p.status === 'DRAFT').length,
        expiring: 0, // Mock for now
        review: 0,
        suspended: 0,
        expired: 0,
        closed: 0
    };

    const tabs = [
        { id: 'all', label: t('tabAll'), count: stats.all },
        { id: 'online', label: t('tabOnline'), count: stats.online },
        { id: 'expiring', label: t('tabExpiring'), count: stats.expiring },
        { id: 'review', label: t('tabReview'), count: 0 },
        { id: 'pending', label: t('tabPending'), count: 0 },
        { id: 'suspended', label: t('tabSuspended'), count: 0 },
        { id: 'expired', label: t('tabExpired'), count: 0 },
        { id: 'draft', label: t('tabDraft'), count: stats.draft },
        { id: 'closed', label: t('tabClosed'), count: 0 },
    ];

    const filteredProperties = activeTab === 'all'
        ? properties
        : activeTab === 'online'
            ? properties.filter(p => p.status === 'ACTIVE')
            : activeTab === 'draft'
                ? properties.filter(p => p.status === 'DRAFT')
                : properties; // Add other filters as needed

    if (isLoading || isPropertiesLoading) {
        return <PageLoader />;
    }

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
            <Header />

            <div className="flex flex-1 container mx-auto max-w-7xl pt-6 px-4 gap-6">
                <DashboardSidebar />

                <main className="flex-1 overflow-y-auto pb-12">
                    <div className="space-y-6">

                        {/* Header / Stats Bar */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="flex items-center gap-4 px-4 py-3 border-b border-slate-50 overflow-x-auto scrollbar-hide">
                                <div className="flex items-center gap-2 text-slate-600 font-bold whitespace-nowrap mr-4">
                                    <ArrowUpDown size={20} className="rotate-90" />
                                    {t('overview')}
                                </div>

                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex flex-col items-center justify-center min-w-[80px] px-4 py-2 rounded-lg transition-all ${activeTab === tab.id
                                            ? 'bg-brand-900 text-white shadow-md'
                                            : 'text-slate-500 hover:bg-brand-50 hover:text-brand-600'
                                            }`}
                                    >
                                        <span className="text-xs font-medium mb-1 whitespace-nowrap">{tab.label}</span>
                                        <span className={`text-lg font-bold ${activeTab === tab.id ? 'text-white' : 'text-slate-700'}`}>
                                            {tab.count}
                                        </span>
                                        {activeTab === tab.id && <div className="h-0.5 w-6 bg-brand-400 mt-1 rounded-full" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Filters Bar */}
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="flex items-center gap-2 w-full md:w-auto flex-1">
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder={t('searchMyAds')}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                                    />
                                </div>

                                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 text-sm hover:bg-slate-50 whitespace-nowrap">
                                    {t('propertyType')} <ChevronDown size={14} />
                                </button>

                                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 text-sm hover:bg-slate-50 whitespace-nowrap">
                                    {t('filters')} <ChevronDown size={14} />
                                </button>

                                <button className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50">
                                    <ListFilter size={18} />
                                </button>
                                <button className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50">
                                    <ArrowUpDown size={18} />
                                </button>
                            </div>

                            <button className="px-6 py-2 bg-brand-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-brand-700 transition-colors whitespace-nowrap">
                                {t('applyFilters')}
                            </button>
                        </div>

                        {/* Property List */}
                        <div className="space-y-4">
                            {filteredProperties.length > 0 ? (
                                filteredProperties.map((property) => (
                                    <MyPropertyCard key={property.id} property={property} onRefresh={fetchProperties} />
                                ))
                            ) : (
                                <div className="text-center py-12 text-slate-400">
                                    {t('noPropertiesFound')}
                                </div>
                            )}
                        </div>

                        {/* Pagination Mockup */}
                        {filteredProperties.length > 0 && (
                            <div className="flex justify-end items-center gap-2 text-sm text-slate-500 mt-4">
                                <span>{t('itemsPerPage')}</span>
                                <select className="border border-slate-200 rounded px-2 py-1 bg-white">
                                    <option>10</option>
                                    <option>20</option>
                                    <option>50</option>
                                </select>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
}
