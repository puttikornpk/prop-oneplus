"use client";

import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { User, Flag, Settings, Home, Building2, Warehouse, Factory, Store, LandPlot, MapPin, X, Map, Info } from "lucide-react";
import Link from "next/link";

export default function PostPropertyPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const { t } = useLanguage();

    const [currentStep, setCurrentStep] = useState(1);
    const [listingStatus, setListingStatus] = useState<'owner' | 'agent'>('owner');
    const [listingType, setListingType] = useState<string>('sell');

    const [propertyCategory, setPropertyCategory] = useState<string>('condo');
    const [address, setAddress] = useState<string>('');
    const [isMapEnabled, setIsMapEnabled] = useState<boolean>(true);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/');
        }
    }, [user, isLoading, router]);

    const handleNext = () => {
        if (currentStep < 4) {
            setCurrentStep(prev => prev + 1);
            window.scrollTo(0, 0);
        }
    };

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
                <div className="relative mb-12">
                    {/* Background Line */}
                    <div className="absolute top-4 left-0 w-full h-1 bg-slate-100 rounded-full -z-10"></div>

                    {/* Progress Line */}
                    <div
                        className="absolute top-4 left-0 h-1 bg-brand-600 rounded-full -z-10 transition-all duration-500 ease-out"
                        style={{ width: `${(Math.max(currentStep - 1, 0) / 3) * 100}%` }}
                    >
                        {/* Arrow Head at the end of progress */}
                        {currentStep > 1 && (
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
                                <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-brand-600 border-b-[6px] border-b-transparent"></div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between items-start relative">
                        {[
                            { id: 1, label: 'นำเสนออสังหาฯของคุณ' },
                            { id: 2, label: 'เพิ่มมีเดีย' },
                            { id: 3, label: 'เพิ่มรายละเอียด' },
                            { id: 4, label: 'เผยแพร่ !' }
                        ].map((step) => (
                            <div key={step.id} className="flex flex-col items-center gap-3 cursor-pointer" onClick={() => step.id < currentStep && setCurrentStep(step.id)}>
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ring-4 ${step.id === currentStep
                                        ? 'bg-brand-600 text-white ring-brand-100 shadow-lg shadow-brand-600/30 scale-110'
                                        : step.id < currentStep
                                            ? 'bg-brand-600 text-white ring-brand-50'
                                            : 'bg-slate-100 text-slate-400 ring-white'
                                        }`}
                                >
                                    {step.id < currentStep ? '✓' : step.id}
                                </div>
                                <span className={`text-sm font-medium transition-colors duration-300 ${step.id === currentStep ? 'text-brand-600' :
                                    step.id < currentStep ? 'text-slate-700' : 'text-slate-400'
                                    }`}>
                                    {step.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Sections */}
                {currentStep === 1 && (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
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

                        {/* 4. Location */}
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <MapPin size={24} className="text-slate-700" />
                                    <h2 className="text-xl font-bold text-slate-800">ทำเล <span className="text-red-500">*</span></h2>
                                </div>

                                <div className="relative">
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="พระราม 2 บางขุนเทียน ท่าข้าม เทียนทะเล"
                                        className="w-full pl-6 pr-12 py-4 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-50 transition-all text-slate-700 text-lg placeholder:text-slate-300"
                                    />
                                    {address && (
                                        <button
                                            onClick={() => setAddress('')}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>

                                <div className="flex items-start gap-3 p-4 bg-brand-50/50 rounded-xl text-sm text-brand-600 border border-brand-100">
                                    <div className="mt-0.5"><Info size={18} /></div>
                                    <p>ในกทม./ปริมณฑล เป็นกลุ่มทำเลให้เลือกทำเลที่ระบบแนะนำเพื่อการเห็นประกาศที่มากขึ้น</p>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Map size={24} className="text-slate-700" />
                                        <h2 className="text-xl font-bold text-slate-800">ตำแหน่งที่ตั้งของทรัพย์</h2>
                                    </div>

                                    {/* Toggle Switch */}
                                    <button
                                        onClick={() => setIsMapEnabled(!isMapEnabled)}
                                        className={`relative w-14 h-8 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 ${isMapEnabled ? 'bg-[#1FB992]' : 'bg-slate-200'}`}
                                    >
                                        <div className={`absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isMapEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                    </button>
                                </div>
                                <p className="text-slate-500 text-sm">ตรวจสอบตำแหน่งที่ระบบปักหมุดให้อีกครั้ง หากพบว่าไม่ตรงคุณสามารถแก้ไขทันที</p>

                                {isMapEnabled && (
                                    <div className="relative w-full h-64 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 mt-4 group">
                                        {/* Mock Map Image / Placeholder */}
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            frameBorder="0"
                                            scrolling="no"
                                            marginHeight={0}
                                            marginWidth={0}
                                            src={`https://maps.google.com/maps?q=${encodeURIComponent(address || 'Bangkok')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                                            className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity"
                                        ></iframe>

                                        {/* Edit Map Button Overlay */}
                                        <div className="absolute bottom-4 right-4">
                                            <button className="flex items-center gap-2 bg-white hover:bg-slate-50 text-brand-600 px-4 py-2 rounded-lg shadow-lg border border-brand-200 text-sm font-medium transition-all transform hover:scale-105">
                                                <div className="w-4 h-4 border-2 border-brand-600 rounded-[4px]"></div>
                                                แก้ไขตำแหน่งทรัพย์
                                            </button>
                                        </div>

                                        {/* Mock Pin Overlay */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                            <div className="relative">
                                                <div className="w-8 h-8 bg-red-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                                </div>
                                                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-red-500 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
                                            </div>
                                            {address && (
                                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap text-xs font-medium text-slate-700 border border-slate-100">
                                                    {address}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Next Button */}
                        <div className="flex justify-end pt-8">
                            <button
                                onClick={handleNext}
                                className="w-full bg-brand-600 hover:bg-brand-700 text-white text-xl font-medium py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-95"
                            >
                                ถัดไป
                            </button>
                        </div>
                    </div>
                )}

                {/* Steps 2, 3, 4 Placeholders */}
                {currentStep > 1 && (
                    <div className="text-center py-20 animate-in fade-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Settings className="w-10 h-10 text-brand-600 animate-spin-slow" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">ขั้นตอนที่ {currentStep} กำลังพัฒนา</h2>
                        <p className="text-slate-500 mb-8">เรากำลังเตรียมฟีเจอร์นี้ให้คุณใช้งานได้เร็วๆ นี้</p>
                        <button
                            onClick={() => setCurrentStep(prev => prev - 1)}
                            className="text-brand-600 font-medium hover:underline"
                        >
                            ย้อนกลับ
                        </button>
                        {/* Temp Next Button for testing stepper */}
                        {currentStep < 4 && (
                            <div className="mt-8">
                                <button
                                    onClick={handleNext}
                                    className="px-6 py-2 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300 text-sm"
                                >
                                    ข้ามไปขั้นตอนถัดไป (Demo)
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
