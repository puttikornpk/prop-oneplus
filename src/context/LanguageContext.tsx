"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { translations } from "@/data/translations";

type Language = "TH" | "EN";

interface LanguageContextType {
    lang: Language;
    setLang: (lang: Language) => void;
    t: (key: keyof typeof translations) => string;
    formatDate: (date: Date | string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [lang, setLang] = useState<Language>("TH");

    const t = (key: keyof typeof translations) => {
        const entry = translations[key];
        if (!entry) return key;
        return entry[lang];
    };

    const formatDate = (dateInput: Date | string) => {
        if (!dateInput) return '-';
        const date = new Date(dateInput);
        if (isNaN(date.getTime())) return '-';

        return date.toLocaleDateString(lang === 'TH' ? 'th-TH' : 'en-GB', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang, t, formatDate }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};
