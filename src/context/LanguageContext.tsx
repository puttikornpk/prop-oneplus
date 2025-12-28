"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "TH" | "EN";

interface Translations {
    [key: string]: {
        TH: string;
        EN: string;
    };
}

const translations = {
    // Header
    home: { TH: "หน้าแรก", EN: "Home" },
    recSearch: { TH: "ค้นหาแนะนำ", EN: "Recommended Search" },
    buyRent: { TH: "ซื้อ / เช่า", EN: "Buy / Rent" },
    sell: { TH: "ลงประกาศ", EN: "Sell" },
    news: { TH: "ข่าวสาร", EN: "News & Stories" },
    listProperty: { TH: "ลงประกาศฟรี", EN: "List Property" },
    login: { TH: "เข้าสู่ระบบ", EN: "Login" },
    freeRegister: { TH: "สมัครสมาชิกฟรี", EN: "Free Register" },

    // Sidebar
    filters: { TH: "ตัวกรอง", EN: "Filters" },
    searchPlaceholder: { TH: "ค้นหาทำเล, รถไฟฟ้า...", EN: "Search location, BTS..." },
    propertyType: { TH: "ประเภทอสังหาฯ", EN: "Property Type" },
    any: { TH: "ทั้งหมด", EN: "Any" },
    land: { TH: "ที่ดิน", EN: "Land" },
    condo: { TH: "คอนโด", EN: "Condo" },
    house: { TH: "บ้าน", EN: "House" },
    priceRange: { TH: "ช่วงราคา", EN: "Price Range" },
    min: { TH: "ต่ำสุด", EN: "Min" },
    max: { TH: "สูงสุด", EN: "Max" },
    features: { TH: "คุณสมบัติ", EN: "Features" },
    nearBTS: { TH: "ใกล้รถไฟฟ้า", EN: "Near BTS/MRT" },
    ownerPost: { TH: "เจ้าของขายเอง", EN: "Owner Post" },
    agentWelcome: { TH: "รับนายหน้า", EN: "Agent Welcome" },
    applyFilters: { TH: "ค้นหา", EN: "Apply Filters" },

    // Main Page
    landsForSale: { TH: "ประกาศขายที่ดิน", EN: "Lands for Sale" },
    sortBy: { TH: "เรียงโดย", EN: "Sort by" },
    newest: { TH: "ใหม่ล่าสุด", EN: "Newest" },
    priceLowHigh: { TH: "ราคา: ต่ำ - สูง", EN: "Price: Low to High" },
    priceHighLow: { TH: "ราคา: สูง - ต่ำ", EN: "Price: High to Low" },

    // Card
    rai: { TH: "ไร่", EN: "Rai" },
    ngan: { TH: "งาน", EN: "Ngan" },
    sqwah: { TH: "ตร.ว.", EN: "Sq.Wah" },
    views: { TH: "เข้าชม", EN: "views" },
    details: { TH: "ดูรายละเอียด", EN: "Details" },

    // Footer
    description: {
        TH: "PropertyPlus คือตลาดอสังหาริมทรัพย์ชั้นนำของไทย เราช่วยคุณหาบ้าน ที่ดิน และการลงทุนที่ใช่",
        EN: "PropertyPlus is Thailand's leading property marketplace. We help you find the perfect home, land, or investment property with ease and confidence."
    },
    quickLinks: { TH: "เมนูลัด", EN: "Quick Links" },
    searchSale: { TH: "ค้นหาประกาศขาย", EN: "Search for Sale" },
    searchRent: { TH: "ค้นหาประกาศเช่า", EN: "Search for Rent" },
    categories: { TH: "ทำเลยอดนิยม", EN: "Popular Locations" },
    contactUs: { TH: "ติดต่อเรา", EN: "Contact Us" },
    privacy: { TH: "นโยบายความเป็นส่วนตัว", EN: "Privacy Policy" },
    terms: { TH: "ข้อกำหนดและเงื่อนไข", EN: "Terms of Service" },
    cookie: { TH: "นโยบายคุกกี้", EN: "Cookie Policy" },
    copyright: { TH: "สงวนลิขสิทธิ์", EN: "All rights reserved." },
};

interface LanguageContextType {
    lang: Language;
    setLang: (lang: Language) => void;
    t: (key: keyof typeof translations) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [lang, setLang] = useState<Language>("TH");

    const t = (key: keyof typeof translations) => {
        const entry = translations[key];
        if (!entry) return key; // Fallback to key if not found
        return entry[lang];
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
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
