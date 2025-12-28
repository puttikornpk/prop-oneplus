"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

// Types
type MenuItem = {
    label: { TH: string; EN: string };
    href: string;
};

type Category = {
    id: string;
    label: { TH: string; EN: string };
    columns: {
        title: { TH: string; EN: string };
        items: MenuItem[];
    }[];
};

// Base Data (To be shuffled)
const MENU_DATA: Category[] = [
    {
        id: "type_price",
        label: { TH: "ประเภทอสังหาฯ & ช่วงราคา", EN: "Property Type & Price" },
        columns: [
            {
                title: { TH: "ประเภทอสังหาฯ", EN: "Property Type" },
                items: [
                    { label: { TH: "คอนโด", EN: "Condo" }, href: "#" },
                    { label: { TH: "บ้าน", EN: "House" }, href: "#" },
                    { label: { TH: "ที่ดิน", EN: "Land" }, href: "#" },
                    { label: { TH: "ทาวน์โฮม", EN: "Townhome" }, href: "#" },
                    { label: { TH: "ตึกแถว", EN: "Commercial Building" }, href: "#" },
                    { label: { TH: "โรงงาน โกดัง", EN: "Factory / Warehouse" }, href: "#" },
                    { label: { TH: "อพาร์ตเมนต์", EN: "Apartment" }, href: "#" },
                ],
            },
            {
                title: { TH: "คอนโดให้เช่าตามราคา", EN: "Condo for Rent by Price" },
                items: [
                    { label: { TH: "น้อยกว่า 5,000 บาท", EN: "< 5,000 THB" }, href: "#" },
                    { label: { TH: "5,000 - 10,000 บาท", EN: "5,000 - 10,000 THB" }, href: "#" },
                    { label: { TH: "10,000 - 20,000 บาท", EN: "10,000 - 20,000 THB" }, href: "#" },
                    { label: { TH: "20,000 - 35,000 บาท", EN: "20,000 - 35,000 THB" }, href: "#" },
                    { label: { TH: "35,000 - 50,000 บาท", EN: "35,000 - 50,000 THB" }, href: "#" },
                    { label: { TH: "มากกว่า 50,000 บาท", EN: "> 50,000 THB" }, href: "#" },
                ],
            },
            {
                title: { TH: "บ้านขายตามราคา", EN: "House for Sale by Price" },
                items: [
                    { label: { TH: "น้อยกว่า 2 ล้านบาท", EN: "< 2 MB" }, href: "#" },
                    { label: { TH: "2 - 5 ล้านบาท", EN: "2 - 5 MB" }, href: "#" },
                    { label: { TH: "5 - 10 ล้านบาท", EN: "5 - 10 MB" }, href: "#" },
                    { label: { TH: "10 - 20 ล้านบาท", EN: "10 - 20 MB" }, href: "#" },
                    { label: { TH: "20 - 50 ล้านบาท", EN: "20 - 50 MB" }, href: "#" },
                    { label: { TH: "มากกว่า 50 ล้านบาท", EN: "> 50 MB" }, href: "#" },
                ],
            },
        ],
    },
    {
        id: "locations_bkk",
        label: { TH: "ทำเลยอดนิยม (กทม.)", EN: "Popular Locations (BKK)" },
        columns: [
            {
                title: { TH: "โซนสุขุมวิท", EN: "Sukhumvit Zone" },
                items: [
                    { label: { TH: "เอกมัย", EN: "Ekkamai" }, href: "#" },
                    { label: { TH: "ทองหล่อ", EN: "Thong Lo" }, href: "#" },
                    { label: { TH: "พร้อมพงษ์", EN: "Phrom Phong" }, href: "#" },
                    { label: { TH: "อโศก", EN: "Asoke" }, href: "#" },
                    { label: { TH: "อ่อนนุช", EN: "On Nut" }, href: "#" },
                ]
            },
            {
                title: { TH: "โซนสาทร-สีลม", EN: "Sathorn-Silom Zone" },
                items: [
                    { label: { TH: "สาทร", EN: "Sathorn" }, href: "#" },
                    { label: { TH: "สีลม", EN: "Silom" }, href: "#" },
                    { label: { TH: "ช่องนนทรี", EN: "Chong Nonsi" }, href: "#" },
                    { label: { TH: "ศาลาแดง", EN: "Saladaeng" }, href: "#" },
                ]
            }
        ]
    },
    {
        id: "locations_prov",
        label: { TH: "ทำเลยอดนิยม (ตจว.)", EN: "Popular Locations (Provinces)" },
        columns: [
            {
                title: { TH: "ภาคเหนือ", EN: "North" },
                items: [
                    { label: { TH: "เชียงใหม่", EN: "Chiang Mai" }, href: "#" },
                    { label: { TH: "เชียงราย", EN: "Chiang Rai" }, href: "#" },
                    { label: { TH: "พิษณุโลก", EN: "Phitsanulok" }, href: "#" },
                ]
            },
            {
                title: { TH: "ภาคตะวันออก", EN: "East" },
                items: [
                    { label: { TH: "พัทยา", EN: "Pattaya" }, href: "#" },
                    { label: { TH: "ชลบุรี", EN: "Chonburi" }, href: "#" },
                    { label: { TH: "ระยอง", EN: "Rayong" }, href: "#" },
                ]
            },
            {
                title: { TH: "ภาคใต้", EN: "South" },
                items: [
                    { label: { TH: "ภูเก็ต", EN: "Phuket" }, href: "#" },
                    { label: { TH: "สมุย", EN: "Samui" }, href: "#" },
                    { label: { TH: "หัวหิน", EN: "Hua Hin" }, href: "#" },
                ]
            }
        ]
    },
    { id: "bts_condo", label: { TH: "คอนโดแนวรถไฟฟ้า", EN: "Condo near BTS" }, columns: [] },
    { id: "bts_house", label: { TH: "บ้านแนวรถไฟฟ้า", EN: "House near BTS" }, columns: [] },
    { id: "room_style", label: { TH: "รูปแบบห้อง & ขนาด", EN: "Room Style & Size" }, columns: [] },
];

export const MegaMenu = () => {
    const [activeTab, setActiveTab] = useState(MENU_DATA[0].id);
    const { lang } = useLanguage();
    const [displayData, setDisplayData] = useState<Category[]>(MENU_DATA);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // Shuffle functionality - move to a safe client-side effect
        const shuffle = () => {
            return MENU_DATA.map(category => ({
                ...category,
                columns: category.columns.map(col => ({
                    ...col,
                    items: [...col.items].sort(() => Math.random() - 0.5)
                })).sort(() => Math.random() - 0.5)
            })).sort(() => Math.random() - 0.5);
        };
        setDisplayData(shuffle());
    }, []);

    const activeContent = displayData.find(c => c.id === activeTab) || displayData[0];

    // During SSR or first client render (before mount), render either nothing or the static order.
    // Rendering static order is better for SEO and perceived performance, but if we want strictly random
    // and to avoid a "jump" from static to random, we might accept the jump or just render.
    // Since hydration mismatch is the error, rendering static MENU_DATA first (which matches server) is the fix.

    // User asked for "after on click / mouse over ... randomly shuffle".
    // Actually, simply relying on the useEffect to update state is enough.
    // BUT! Next.js hydration expects the HTML to match. 
    // If I render {displayData} which is initialized to MENU_DATA, server renders MENU_DATA order.
    // Client renders MENU_DATA order. Hydration Success.
    // Then useEffect runs, sets displayData to Random Order. Component Re-renders.
    // This is the correct pattern.

    return (
        <div className="absolute top-full left-0 w-[900px] h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-100 flex overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Left Tabs */}
            <div className="w-64 bg-slate-50 border-r border-slate-100 flex-shrink-0 overflow-y-auto">
                {displayData.map((category) => (
                    <button
                        key={category.id}
                        onMouseEnter={() => setActiveTab(category.id)}
                        onClick={() => setActiveTab(category.id)}
                        className={`w-full text-left px-6 py-4 text-sm font-medium transition-all duration-200 border-l-4 flex justify-between items-center group
                            ${activeTab === category.id
                                ? "bg-white border-brand-600 text-brand-600 shadow-sm"
                                : "border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            }`}
                    >
                        {category.label[lang]}
                        {activeTab === category.id && <ChevronRight size={14} />}
                    </button>
                ))}
            </div>

            {/* Right Content */}
            <div className="flex-1 p-8 bg-white overflow-y-auto w-full">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                    {activeContent.columns.map((col, idx) => (
                        <div key={idx} className="space-y-4">
                            <h3 className="font-bold text-brand-700 pb-2 border-b border-slate-100">
                                {col.title[lang]}
                            </h3>
                            <ul className="space-y-2">
                                {col.items.map((item, i) => (
                                    <li key={i}>
                                        <Link
                                            href={item.href}
                                            className="text-sm text-slate-500 hover:text-brand-600 hover:translate-x-1 transition-all duration-200 inline-block"
                                        >
                                            {item.label[lang]}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    {activeContent.columns.length === 0 && (
                        <div className="col-span-full h-full flex items-center justify-center text-slate-400">
                            No content available for this randomized section.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
