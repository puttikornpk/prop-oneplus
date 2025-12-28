import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useLanguage } from "@/context/LanguageContext";

export const Footer = () => {
    const { t } = useLanguage();
    return (
        <footer className="bg-slate-900 text-slate-300 py-16 mt-20">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="bg-white/10 w-fit p-2 rounded-xl backdrop-blur-sm">
                            <Logo className="text-white brightness-125" />
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            {t('description')}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold mb-6">{t('quickLinks')}</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="#" className="hover:text-brand-500 transition-all duration-300 hover:pl-2 inline-block">{t('home')}</Link></li>
                            <li><Link href="#" className="hover:text-brand-500 transition-all duration-300 hover:pl-2 inline-block">{t('searchSale')}</Link></li>
                            <li><Link href="#" className="hover:text-brand-500 transition-all duration-300 hover:pl-2 inline-block">{t('searchRent')}</Link></li>
                            <li><Link href="#" className="hover:text-brand-500 transition-all duration-300 hover:pl-2 inline-block">{t('listProperty')}</Link></li>
                            <li><Link href="#" className="hover:text-brand-500 transition-all duration-300 hover:pl-2 inline-block">{t('news')}</Link></li>
                        </ul>
                    </div>

                    {/* Locations */}
                    <div>
                        <h3 className="text-white font-bold mb-6">{t('categories')}</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="#" className="hover:text-brand-500 transition-all duration-300 hover:pl-2 inline-block">Land in Bangkok</Link></li>
                            <li><Link href="#" className="hover:text-brand-500 transition-all duration-300 hover:pl-2 inline-block">Land in Chiang Mai</Link></li>
                            <li><Link href="#" className="hover:text-brand-500 transition-all duration-300 hover:pl-2 inline-block">Land in Phuket</Link></li>
                            <li><Link href="#" className="hover:text-brand-500 transition-all duration-300 hover:pl-2 inline-block">Land in Pattaya</Link></li>
                            <li><Link href="#" className="hover:text-brand-500 transition-all duration-300 hover:pl-2 inline-block">Land in Hua Hin</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-bold mb-6">{t('contactUs')}</h3>
                        <ul className="space-y-3 text-sm mb-6">
                            <li>Email: contact@propertyplus.com</li>
                            <li>Line: @propertyplus</li>
                            <li>Tel: 02-123-4567</li>
                        </ul>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-brand-600 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-brand-500/30 text-white"><Facebook size={18} /></a>
                            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-brand-600 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-brand-500/30 text-white"><Instagram size={18} /></a>
                            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-brand-600 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-brand-500/30 text-white"><Twitter size={18} /></a>
                            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-brand-600 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-brand-500/30 text-white"><Youtube size={18} /></a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
                    <p>&copy; 2024 PropertyPlus Co., Ltd. {t('copyright')}</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link href="#" className="hover:text-white transition-colors">{t('privacy')}</Link>
                        <Link href="#" className="hover:text-white transition-colors">{t('terms')}</Link>
                        <Link href="#" className="hover:text-white transition-colors">{t('cookie')}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};
