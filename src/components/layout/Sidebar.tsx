import React from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const Sidebar = () => {
    const { t } = useLanguage();
    return (
        <aside className="w-full lg:w-72 flex-shrink-0 space-y-8 bg-gradient-to-b from-brand-200 via-brand-100 to-white p-6 rounded-2xl border border-brand-100 h-fit lg:sticky lg:top-24 shadow-sm">
            <div>
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                    <SlidersHorizontal size={18} className="text-brand-600" />
                    {t('filters')}
                </h2>

                {/* Search Input */}
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder={t('searchPlaceholder')}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm backdrop-blur-sm"
                    />
                </div>

                {/* Filter Groups */}
                <div className="space-y-6">
                    {/* Property Type */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3">{t('propertyType')}</label>
                        <div className="flex flex-wrap gap-2">
                            {[t('any'), t('land'), t('condo'), t('house')].map((type, idx) => (
                                <button
                                    key={type}
                                    className={`px-4 py-1.5 text-xs font-medium rounded-full border transition-all duration-200 hover:scale-105 active:scale-95 bg-white border-slate-200 text-slate-600 hover:bg-brand-600 hover:border-brand-600 hover:text-white hover:shadow-md`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3">{t('priceRange')}</label>
                        <div className="flex items-center gap-2">
                            <input type="text" placeholder={t('min')} className="w-full p-2 bg-white/60 border border-slate-200 rounded-lg text-sm text-center backdrop-blur-sm" />
                            <span className="text-slate-400">-</span>
                            <input type="text" placeholder={t('max')} className="w-full p-2 bg-white/60 border border-slate-200 rounded-lg text-sm text-center backdrop-blur-sm" />
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3">{t('features')}</label>
                        <div className="space-y-2">
                            {[t('nearBTS'), t('ownerPost'), t('agentWelcome')].map(tag => (
                                <label key={tag} className="flex items-center gap-2 cursor-pointer group">
                                    <div className="w-4 h-4 rounded border border-slate-300 bg-white/50 flex items-center justify-center group-hover:border-brand-500">
                                        {/* Checkbox styles would go here */}
                                    </div>
                                    <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{tag}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <button className="w-full mt-6 py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-all duration-300 shadow-lg shadow-brand-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]">
                    {t('applyFilters')}
                </button>
            </div>
        </aside>
    );
};
