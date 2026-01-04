"use client";

import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { User, Flag, Settings, Home, Building2, Warehouse, Factory, Store, LandPlot } from "lucide-react";
import Link from "next/link";

export default function PostPropertyPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const { t } = useLanguage();

    const [listingStatus, setListingStatus] = useState<'owner' | 'agent'>('owner');
    const [listingType, setListingType] = useState<string>('sell');
    const [propertyCategory, setPropertyCategory] = useState<string>('condo');

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/');
        }
    }, [user, isLoading, router]);

    if (isLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="border-b border-slate-100 sticky top-0 bg-white z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/">
                        <Logo />
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                            <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-xs font-bold">
                                {user.profile?.firstName?.[0] || 'U'}
                            </div>
                            <span className="text-sm font-medium">{user.profile?.firstName}</span>
                        </div>
                        <img
                            src="https://flagcdn.com/w20/th.png"
                            srcSet="https://flagcdn.com/w40/th.png 2x"
                            width="20"
                            alt="TH"
                            className="rounded-sm"
                        />
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Stepper */}
                <div className="flex justify-between items-center mb-12 relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10"></div>

                    {[
                        { id: 1, label: 'นำเสนออสังหาฯของคุณ' },
                        { id: 2, label: 'เพิ่มมีเดีย' },
                        { id: 3, label: 'เพิ่มรายละเอียด' },
                        { id: 4, label: 'เผยแพร่ !' }
                    ].map((step) => (
                        <div key={step.id} className="flex flex-col items-center gap-2 bg-white px-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step.id === 1
                                ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                                : 'bg-slate-200 text-slate-500'
                                }`}>
                                {step.id}
                            </div>
                            <span className={`text-sm ${step.id === 1 ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
                                {step.label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Form Sections */}
                <div className="space-y-10">

                    {/* 1. Listing Status */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <User size={20} className="text-slate-700" />
                            <h2 className="text-lg font-bold text-slate-800">สถานะผู้ประกาศ <span className="text-red-500">*</span></h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setListingStatus('owner')}
                                className={`py-3 px-4 rounded-xl border flex justify-center items-center transition-all ${listingStatus === 'owner'
                                    ? 'bg-brand-50 border-brand-600 text-brand-600 shadow-sm ring-1 ring-brand-600'
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                    }`}
                            >
                                เจ้าของ (Owner)
                            </button>
                            <button
                                onClick={() => setListingStatus('agent')}
                                className={`py-3 px-4 rounded-xl border flex justify-center items-center transition-all ${listingStatus === 'agent'
                                    ? 'bg-brand-50 border-brand-600 text-brand-600 shadow-sm ring-1 ring-brand-600'
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                    }`}
                            >
                                นายหน้า (Agent)
                            </button>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-lg text-sm text-blue-600 border border-blue-100">
                            <div className="mt-0.5">ℹ️</div>
                            <p>กรุณาเลือกสถานะตามจริง หากมีผู้ส่งรายงานว่าท่านไม่ใช่ "เจ้าของ" ประกาศของท่านจะถูกนำออกจากระบบทันที เพื่อรอการตรวจสอบ</p>
                        </div>
                    </div>

                    {/* 2. Listing Type */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Flag size={20} className="text-slate-700" />
                            <h2 className="text-lg font-bold text-slate-800">ประเภทประกาศ <span className="text-red-500">*</span></h2>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { id: 'sell', label: 'ขาย' },
                                { id: 'rent', label: 'เช่า' },
                                { id: 'sell_rent', label: 'ขายและเช่า', tag: 'New' },
                                { id: 'lease', label: 'เซ้ง' },
                                { id: 'down_payment', label: 'ขายดาวน์' },
                            ].map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => setListingType(type.id)}
                                    className={`py-3 px-4 rounded-xl border flex justify-center items-center transition-all relative ${listingType === type.id
                                        ? 'bg-brand-50 border-brand-600 text-brand-600 shadow-sm ring-1 ring-brand-600'
                                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                        }`}
                                >
                                    {type.label}
                                    {type.tag && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold shadow-sm">
                                            {type.tag}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 3. Property Type */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Building2 size={20} className="text-slate-700" />
                            <h2 className="text-lg font-bold text-slate-800">ประเภทอสังหาฯ <span className="text-red-500">*</span></h2>
                        </div>

                        <div className="space-y-2">
                            <div className="text-sm font-medium text-slate-500 mb-2">ที่อยู่อาศัย</div>
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { id: 'condo', label: 'คอนโด' },
                                    { id: 'apartment', label: 'อพาร์ตเมนต์' },
                                    { id: 'house', label: 'บ้าน/บ้านเดี่ยว' },
                                    { id: 'twin_house', label: 'บ้านแฝด' },
                                    { id: 'townhome', label: 'ทาวน์โฮม/ทาวน์เฮ้าส์' },
                                    { id: 'home_office', label: 'โฮมออฟฟิศ' },
                                    { id: 'land', label: 'ที่ดิน' },
                                    { id: 'pool_villa', label: 'พูลวิลล่า' },
                                ].map((prop) => (
                                    <button
                                        key={prop.id}
                                        onClick={() => setPropertyCategory(prop.id)}
                                        className={`py-3 px-4 rounded-xl border flex justify-center items-center transition-all ${propertyCategory === prop.id
                                            ? 'bg-brand-50 border-brand-600 text-brand-600 shadow-sm ring-1 ring-brand-600'
                                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                            }`}
                                    >
                                        {prop.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2 mt-4">
                            <div className="text-sm font-medium text-slate-500 mb-2">เชิงพาณิชย์</div>
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { id: 'co_working', label: 'Co-working Space' },
                                    { id: 'shop', label: 'ร้านค้า/ตลาดนัด' },
                                    { id: 'commercial', label: 'อาคารพาณิชย์' },
                                    { id: 'office', label: 'สำนักงาน' },
                                    { id: 'factory', label: 'โรงงาน' },
                                    { id: 'showroom', label: 'โชว์รูม' },
                                    { id: 'warehouse', label: 'โกดัง' },
                                    { id: 'hotel', label: 'กิจการโรงแรม & รีสอร์ท' },
                                ].map((prop) => (
                                    <button
                                        key={prop.id}
                                        onClick={() => setPropertyCategory(prop.id)}
                                        className={`py-3 px-4 rounded-xl border flex justify-center items-center transition-all ${propertyCategory === prop.id
                                            ? 'bg-brand-50 border-brand-600 text-brand-600 shadow-sm ring-1 ring-brand-600'
                                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                            }`}
                                    >
                                        {prop.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Next Button */}
                    <div className="flex justify-end pt-8">
                        <button className="w-full bg-brand-600 hover:bg-brand-700 text-white text-xl font-medium py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-95">
                            ถัดไป
                        </button>
                    </div>

                </div>
            </main>
        </div>
    );
}
