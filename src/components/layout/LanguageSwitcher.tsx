"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const FlagTH = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 24" width="24" height="18" className="rounded-sm shadow-sm">
        <rect width="32" height="24" fill="#F4F5F8" />
        <rect y="0" width="32" height="4" fill="#ED1C24" />
        <rect y="20" width="32" height="4" fill="#ED1C24" />
        <rect y="4" width="32" height="4" fill="#F4F5F8" />
        <rect y="16" width="32" height="4" fill="#F4F5F8" />
        <rect y="8" width="32" height="8" fill="#241D4E" />
    </svg>
);

const FlagGB = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 24" width="24" height="18" className="rounded-sm shadow-sm overflow-hidden">
        <rect width="32" height="24" fill="#012169" />
        <path d="M0,0 L32,24 M32,0 L0,24" stroke="#FFF" strokeWidth="4" />
        <path d="M0,0 L32,24 M32,0 L0,24" stroke="#C8102E" strokeWidth="2" />
        <path d="M16,0 V24 M0,12 H32" stroke="#FFF" strokeWidth="6" />
        <path d="M16,0 V24 M0,12 H32" stroke="#C8102E" strokeWidth="3" />
    </svg>
);

export const LanguageSwitcher = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { lang, setLang } = useLanguage();

    const toggleDropdown = () => setIsOpen(!isOpen);
    const selectLang = (l: "TH" | "EN") => {
        setLang(l);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={toggleDropdown}
                className="flex items-center gap-1.5 p-2 hover:bg-slate-100 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
            >
                <span className="w-px h-6 bg-slate-200 mr-2 mx-1"></span>
                {lang === "TH" ? <FlagTH /> : <FlagGB />}
                <ChevronDown size={14} className={`text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                    {lang !== "TH" && (
                        <button
                            onClick={() => selectLang("TH")}
                            className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                        >
                            <FlagTH />
                            Thai
                        </button>
                    )}
                    {lang !== "EN" && (
                        <button
                            onClick={() => selectLang("EN")}
                            className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                        >
                            <FlagGB />
                            English
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
