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
        TH: "PropertyOnePlus คือตลาดอสังหาริมทรัพย์ชั้นนำของไทย เราช่วยคุณหาบ้าน ที่ดิน และการลงทุนที่ใช่",
        EN: "PropertyOnePlus is Thailand's leading property marketplace. We help you find the perfect home, land, or investment property with ease and confidence."
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

    // Auth Modal
    loginTitle: { TH: "เข้าสู่ระบบเพื่อใช้งาน", EN: "Login to continue" },
    loginWith: { TH: "เข้าสู่ระบบด้วย", EN: "Login with" },
    phoneEmailUserPlaceholder: { TH: "เบอร์โทร / อีเมล / ชื่อผู้ใช้ (Username)", EN: "Phone / Email / Username" },
    passwordPlaceholder: { TH: "รหัสผ่าน", EN: "Password" },
    continue: { TH: "ดำเนินการต่อ", EN: "Continue" },
    loginButton: { TH: "เข้าสู่ระบบ", EN: "Login" },
    quickLogin: { TH: "ช่องทางเข้าสู่ระบบแบบรวดเร็ว", EN: "Quick login with" },
    orRegisterFree: { TH: "หรือสมัครสมาชิกฟรีเพิ่มเติม", EN: "Or register for free more" },
    backToUser: { TH: "← กลับไปแก้ไขชื่อผู้ใช้", EN: "← Back to username" },
    processing: { TH: "กำลังดำเนินการ...", EN: "Processing..." },
    enterIdentifierError: { TH: "กรุณาระบุเบอร์โทร / อีเมล / ชื่อผู้ใช้", EN: "Please enter phone, email, or username" },
    enterPasswordError: { TH: "กรุณาระบุรหัสผ่าน", EN: "Please enter your password" },
    activationTitle: { TH: "ยืนยันการสมัครสมาชิกด้วยอีเมล", EN: "Confirm Email Registration" },
    activationLabel: { TH: "Activate Code ที่ได้รับทางอีเมล", EN: "Activate Code from Email" },
    activationConfirm: { TH: "ยืนยัน", EN: "Confirm" },
    activationNotReceived: { TH: "หากยังไม่ได้รับ Activate Code ที่ส่งไปทางอีเมล", EN: "If you have not received the Activate Code via email" },

    // Register Modal
    emailLabel: { TH: "อีเมล", EN: "Email" },
    phoneLabel: { TH: "เบอร์โทร", EN: "Phone Number" },
    usernameLabel: { TH: "ชื่อผู้ใช้", EN: "Username" },
    confirmPasswordLabel: { TH: "ยืนยันรหัสผ่าน", EN: "Confirm Password" },
    acceptTermsLabel: { TH: "ยอมรับข้อตกลง", EN: "Accept Agreement" },
    clickHere: { TH: "คลิกที่นี่", EN: "Click here" },
    readTerms: { TH: "เพื่ออ่าน", EN: "to read" },
    registerButton: { TH: "สมัครสมาชิก", EN: "Register" },
    alreadyHaveAccount: { TH: "หากท่านสมัครบัญชีแล้ว", EN: "If you already have an account" },
    loginLink: { TH: "กดเข้าระบบที่นี่", EN: "click here to login" },
    orSeparator: { TH: "หรือเลือกระบุข้อมูลเอง", EN: "Or enter details manually" },
    termsTitle: { TH: "ข้อกำหนดและเงื่อนไข / Terms and Conditions", EN: "Terms and Conditions" },
    closeButton: { TH: "ปิด / Close", EN: "Close" },
    errorAcceptTerms: { TH: "กรุณายอมรับเงื่อนไขข้อตกลง", EN: "Please accept the terms and conditions" },
    errorPasswordMatch: { TH: "รหัสผ่านไม่ตรงกัน", EN: "Passwords do not match" },
    registerFailed: { TH: "การสมัครสมาชิกไม่สำเร็จ", EN: "Registration failed" },

    // Register Placeholders
    emailPlaceholder: { TH: "E-mail *", EN: "E-mail *" },
    phonePlaceholder: { TH: "เลขหมายโทรศัพท์ 9-10 digits*", EN: "Tel no 9-10 digits*" },
    usernamePlaceholder: { TH: "รหัสผู้ใช้ 5-18 digits*", EN: "User 5-10 digits*" },
    registerPasswordPlaceholder: { TH: "รหัสผ่าน 5-10 digits*", EN: "Password 5-10 digits*" },
    registerConfirmPasswordPlaceholder: { TH: "ยืนยันรหัสผ่าน *", EN: "Confirm Password *" }
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
