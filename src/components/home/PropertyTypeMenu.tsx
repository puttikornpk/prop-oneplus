import { useRef } from 'react';
import { useLanguage } from "@/context/LanguageContext";
import {
    Building,
    Home,
    Building2,
    Map as MapIcon,
    Store,
    Briefcase,
    Laptop,
    ShoppingBag,
    Monitor,
    Factory,
    Users,
    Castle,
    Hotel,
    Palmtree,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

export function PropertyTypeMenu() {
    const { lang } = useLanguage();
    const scrollRef = useRef<HTMLDivElement>(null);

    const categories = [
        { id: 'condo', label: { th: 'คอนโด', en: 'Condo' }, icon: Building },
        { id: 'house', label: { th: 'บ้าน', en: 'House' }, icon: Home },
        { id: 'townhome', label: { th: 'ทาวน์โฮม', en: 'Townhome' }, icon: Building2 },
        { id: 'apartment', label: { th: 'อพาร์ทเมนท์', en: 'Apartment' }, icon: Hotel },
        { id: 'twinhouse', label: { th: 'บ้านแฝด', en: 'Twin House' }, icon: Castle },
        { id: 'poolvilla', label: { th: 'พูลวิลล่า', en: 'Pool Villa' }, icon: Palmtree },
        { id: 'land', label: { th: 'ที่ดิน', en: 'Land' }, icon: MapIcon },
        { id: 'commercial', label: { th: 'ตึกแถว', en: 'Commercial' }, icon: Store },
        { id: 'office', label: { th: 'สำนักงาน', en: 'Office' }, icon: Briefcase },
        { id: 'homeoffice', label: { th: 'โฮมออฟฟิศ', en: 'Home Office' }, icon: Laptop },
        { id: 'shop', label: { th: 'ร้านค้า', en: 'Shop' }, icon: ShoppingBag },
        { id: 'showroom', label: { th: 'โชว์รูม', en: 'Showroom' }, icon: Monitor },
        { id: 'business', label: { th: 'กิจการ', en: 'Business' }, icon: Briefcase },
        { id: 'factory', label: { th: 'โรงงาน โกดัง', en: 'Factory' }, icon: Factory },
        { id: 'coworking', label: { th: 'Co-Working', en: 'Co-Working' }, icon: Users },
    ];

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 300;
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    return (
        <div className="w-full bg-gradient-to-b from-emerald-100 via-emerald-50 to-white border-b border-slate-100 py-4 mb-6">
            <div className="container mx-auto px-4">
                <h2 className="text-xl font-semibold text-brand-600 mb-4">
                    {lang === 'TH' ? 'ประเภทอสังหาฯ' : 'Property Type'}
                </h2>

                <div className="relative group">
                    {/* Left Scroll Button */}
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-20 bg-white border border-slate-200 rounded-full p-2 shadow-md hover:bg-slate-50 transition-all opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center"
                    >
                        <ChevronLeft className="w-5 h-5 text-slate-600" />
                    </button>

                    {/* Scroll Container */}
                    <div
                        ref={scrollRef}
                        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth"
                    >
                        {categories.map((category) => {
                            const Icon = category.icon;
                            return (
                                <button
                                    key={category.id}
                                    className="flex flex-col items-center flex-shrink-0 min-w-[25%] md:min-w-[18%] lg:min-w-[calc((100%-8rem)/9)] group/item transition-all duration-300"
                                >
                                    <div className="relative mb-3 flex flex-col items-center">
                                        <span className="bg-brand-50 text-slate-900 text-sm px-3 py-1.5 rounded-lg border border-brand-100 shadow-sm whitespace-nowrap z-10 font-medium">
                                            {category.label[lang === 'TH' ? 'th' : 'en']}
                                        </span>
                                        <div className="w-2.5 h-2.5 bg-brand-50 border-b border-r border-brand-100 rotate-45 absolute -bottom-1.5 z-0"></div>
                                    </div>
                                    <div className="w-16 h-16 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover/item:bg-brand-50 group-hover/item:border-brand-200 transition-colors shadow-sm">
                                        <Icon
                                            strokeWidth={1.5}
                                            className="w-8 h-8 text-slate-600 group-hover/item:text-brand-600 transition-colors"
                                        />
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Right Scroll Button */}
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-20 bg-white border border-slate-200 rounded-full p-2 shadow-md hover:bg-slate-50 transition-all opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center"
                    >
                        <ChevronRight className="w-5 h-5 text-slate-600" />
                    </button>
                </div>
            </div>
        </div>
    );
}
