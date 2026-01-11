"use client";

import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer"; // Assuming Footer exists
import { User, MapPin, Phone, MessageCircle, Share2, Heart, Flag, CheckCircle2, Download, Layout, ArrowUp, BedDouble, Bath, LandPlot, Layers, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface PropertyDetailClientProps {
    property: any; // Type properly in real app
    currentUser: any;
}

export function PropertyDetailClient({ property, currentUser }: PropertyDetailClientProps) {
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [lightboxTab, setLightboxTab] = useState<'images' | 'contact'>('images');

    // Description Truncation Logic
    const [isExpanded, setIsExpanded] = useState(false);
    const [showReadMore, setShowReadMore] = useState(false);
    const descriptionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (descriptionRef.current) {
            const { scrollHeight, clientHeight } = descriptionRef.current;
            if (scrollHeight > clientHeight) {
                setShowReadMore(true);
            }
        }
    }, [property.description]);

    const images = property.images?.length > 0 ? property.images : [{ id: 'placeholder', url: '/placeholder.jpg' }];

    const openLightbox = (index: number) => {
        setActiveImageIndex(index);
        setIsLightboxOpen(true);
        setLightboxTab('images');
    };

    const nextImage = () => {
        setActiveImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <Header />

            <main className="container mx-auto px-4 py-8">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                    <Link href="/" className="hover:text-brand-600">หน้าแรก</Link>
                    <span>/</span>
                    <span className="text-slate-900 line-clamp-1">{property.topic}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Image Gallery Preview */}
                        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                            <div
                                className="relative aspect-video bg-slate-100 cursor-pointer group"
                                onClick={() => openLightbox(activeImageIndex)}
                            >
                                <Image
                                    src={images[activeImageIndex].url}
                                    alt={property.topic}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                    <span className="opacity-0 group-hover:opacity-100 bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-sm transition-opacity">
                                        ดูรูปทั้งหมด ({images.length})
                                    </span>
                                </div>
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <span className="bg-brand-600 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-lg">
                                        {property.listingType === 'SELL' ? 'ขาย' : 'เช่า'}
                                    </span>
                                    <span className="bg-white/90 text-slate-800 px-3 py-1 rounded-lg text-xs font-bold shadow-lg backdrop-blur-sm">
                                        {property.category}
                                    </span>
                                </div>
                            </div>
                            {/* Thumbnails Preview */}
                            {images.length > 1 && (
                                <div className="p-4 flex gap-2 overflow-x-auto pb-6 custom-scrollbar">
                                    {images.map((img: any, idx: number) => (
                                        <button
                                            key={img.id}
                                            onClick={() => setActiveImageIndex(idx)}
                                            className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${activeImageIndex === idx ? 'border-brand-600 ring-2 ring-brand-100' : 'border-transparent opacity-70 hover:opacity-100'
                                                }`}
                                        >
                                            <Image src={img.url} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Title & Price Header */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                            <div className="flex gap-2 mb-2">
                                <span className={`px-2 py-0.5 text-xs font-bold rounded ${property.listingType === 'SELL' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {property.listingType === 'SELL' ? 'ขาย' : 'เช่า'}
                                </span>
                                <span className="px-2 py-0.5 text-xs font-bold rounded bg-slate-100 text-slate-600">
                                    {property.category || 'อสังหาฯ'}
                                </span>
                            </div>

                            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2 leading-tight">
                                {property.topic}
                            </h1>
                            <div className="flex items-center gap-2 text-slate-500 mb-4">
                                <MapPin size={18} className="text-brand-500" />
                                <span>{property.address}</span>
                            </div>

                            <div className="flex flex-wrap items-end gap-4 p-4 bg-slate-50 rounded-xl">
                                <div className="text-3xl font-bold text-brand-600">
                                    ฿{property.price?.toLocaleString()}
                                </div>
                                <div className="text-sm text-slate-500 mb-1">
                                    (฿{Math.round(property.price / (property.usableArea || 1)).toLocaleString()} / ตร.ม.)
                                </div>
                            </div>
                        </div>

                        {/* Property Details Section */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                            <h2 className="text-xl font-bold text-slate-800 mb-6">{property.category === 'LAND' ? 'ข้อมูลขนาดแปลง' : 'ข้อมูลอสังหาฯ'}</h2>

                            {property.category === 'LAND' ? (
                                /* Land Details */
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
                                        <Layers size={24} />
                                    </div>
                                    <div>
                                        <div className="text-slate-500 text-sm mb-1">ขนาดที่ดิน</div>
                                        <div className="text-lg font-bold text-slate-800">
                                            {[
                                                property.landRai > 0 && `${property.landRai} ไร่`,
                                                property.landNgan > 0 && `${property.landNgan} งาน`,
                                                property.landSqWah > 0 && `${property.landSqWah} ตร.ว.`
                                            ].filter(Boolean).join(' ') || '-'}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* Building Details */
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
                                            <Layout size={24} />
                                        </div>
                                        <div>
                                            <div className="text-slate-500 text-sm mb-1">พื้นที่ใช้สอย</div>
                                            <div className="text-lg font-bold text-slate-800">{property.usableArea ? `${property.usableArea} ตร.ม.` : '-'}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
                                            <ArrowUp size={24} />
                                        </div>
                                        <div>
                                            <div className="text-slate-500 text-sm mb-1">ชั้นที่</div>
                                            <div className="text-lg font-bold text-slate-800">{property.floors || '-'}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
                                            <BedDouble size={24} />
                                        </div>
                                        <div>
                                            <div className="text-slate-500 text-sm mb-1">ห้องนอน</div>
                                            <div className="text-lg font-bold text-slate-800">{property.bedroom || '-'}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
                                            <Bath size={24} />
                                        </div>
                                        <div>
                                            <div className="text-slate-500 text-sm mb-1">ห้องน้ำ</div>
                                            <div className="text-lg font-bold text-slate-800">{property.bathroom || '-'}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                            <h2 className="text-xl font-bold text-slate-800 mb-4">รายละเอียด</h2>
                            <div
                                ref={descriptionRef}
                                className={`prose prose-slate max-w-none text-slate-600 whitespace-pre-line ${isExpanded ? '' : 'line-clamp-[9]'}`}
                            >
                                {property.description}
                            </div>
                            {showReadMore && (
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="mt-2 flex items-center gap-1 text-brand-600 font-medium hover:underline focus:outline-none"
                                >
                                    {isExpanded ? 'แสดงน้อยลง' : 'แสดงรายละเอียดเพิ่มเติม'}
                                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </button>
                            )}
                        </div>

                        {/* Location / Map */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                            <h2 className="text-xl font-bold text-slate-800 mb-4 h-flex items-center gap-2">
                                <MapPin className="text-brand-600" /> แผนที่
                            </h2>
                            <div className="w-full h-80 bg-slate-100 rounded-xl overflow-hidden relative">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    src={`https://maps.google.com/maps?q=${encodeURIComponent(property.address || 'Bangkok')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                                    className="absolute inset-0"
                                ></iframe>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Agent Profile & Actions */}
                    <div className="lg:col-span-1 space-y-6">

                        {/* Agent Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg shadow-brand-50 border border-brand-100 sticky top-24">
                            <div className="text-sm font-bold text-brand-600 mb-4 flex justify-between items-center">
                                <span>ผู้ลงประกาศ</span>
                                <span className="bg-brand-100 text-brand-700 px-2 py-0.5 rounded text-xs">
                                    {property.listingStatus === 'AGENT' ? 'Professional' : 'Owner'}
                                </span>
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-brand-200 overflow-hidden relative">
                                    {property.owner?.profile?.avatarUrl ? (
                                        <Image src={property.owner.profile.avatarUrl} alt="Agent" fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50">
                                            <User size={32} />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div className="font-bold text-lg text-slate-900 flex items-center gap-1">
                                        {property.owner?.profile?.firstName || property.owner?.username || 'User'}
                                        <CheckCircle2 size={16} className="text-green-500 fill-green-50" />
                                    </div>
                                    <div className="flex items-center gap-1 text-sm text-slate-500">
                                        <span className="text-yellow-500">★</span> 5.0 (12)
                                    </div>
                                    <Link href="#" className="text-xs text-brand-600 hover:underline">
                                        ไปที่โปรไฟล์ผู้ขาย &gt;
                                    </Link>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <button className="flex items-center justify-center gap-2 bg-brand-600 text-white py-3 rounded-xl font-bold hover:bg-brand-700 transition-all shadow-md active:scale-95">
                                        <MessageCircle size={20} />
                                        ส่งข้อความ
                                    </button>
                                    <button className="flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition-all shadow-md active:scale-95">
                                        <div className="font-sans font-black">LINE</div>
                                        แอดไลน์
                                    </button>
                                </div>
                                <button className="w-full flex items-center justify-center gap-2 border-2 border-brand-100 text-brand-600 bg-white py-3 rounded-xl font-bold hover:bg-brand-50 transition-all active:scale-95">
                                    <Phone size={20} />
                                    {property.owner?.profile?.phone || '0xxxxxxxx'}
                                </button>
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <h3 className="text-sm font-bold text-slate-800 mb-3">ช่องทางติดต่อ</h3>
                                <div className="flex justify-center gap-4">
                                    <button className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors">
                                        <Phone size={20} />
                                    </button>
                                    <button className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors">
                                        <div className="font-bold text-xs">LINE</div>
                                    </button>
                                    <button className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
                                        <MessageCircle size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                                <button className="text-xs text-slate-400 hover:text-red-500 flex items-center justify-center gap-1 w-full transition-colors">
                                    <Flag size={12} /> แจ้งรายงาน / ประกาศไม่เหมาะสม
                                </button>
                            </div>
                        </div>

                        {/* NO ADS BANNER HERE */}
                    </div>
                </div>
            </main>
            <Footer />

            {/* Lightbox Overlay */}
            {isLightboxOpen && (
                <div className="fixed inset-0 z-50 bg-black/95 flex flex-col animate-in fade-in duration-200">
                    {/* Header */}
                    <div className="flex justify-between items-center px-4 py-3 text-white bg-black/50 backdrop-blur-sm absolute top-0 left-0 right-0 z-10">
                        <div className="text-sm font-medium">
                            {activeImageIndex + 1} / {images.length}
                        </div>
                        <div className="flex gap-2">
                            <a
                                href={images[activeImageIndex].url}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center"
                                title="Download Image"
                            >
                                <Download size={20} />
                                {/* Note: Lucide 'Download' is better but I will check if I can import it. 
                                   Wait, Share2 is already imported. I will import Download properly. 
                                   Let's just use the Share2 temporarily rotated or add Download to import list?
                                   Better to add Download to import list first.
                                   Actually, the user specifically asked for "Download" icon. 
                                   I'll check imports. 
                                */}
                            </a>
                            <button
                                onClick={() => setIsLightboxOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <span className="text-2xl leading-none">&times;</span>
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                        {lightboxTab === 'images' ? (
                            <>
                                <div className="relative w-full h-full flex items-center justify-center p-4">
                                    <Image
                                        src={images[activeImageIndex].url}
                                        alt={`Image ${activeImageIndex + 1}`}
                                        fill
                                        className="object-contain"
                                    />
                                </div>

                                {/* Navigation Arrows */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                    className="absolute left-4 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors backdrop-blur-sm"
                                >
                                    &lt;
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                    className="absolute right-4 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors backdrop-blur-sm"
                                >
                                    &gt;
                                </button>
                            </>
                        ) : (
                            // Contact Tab Content
                            <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                                <div className="text-center mb-6">
                                    <div className="w-24 h-24 mx-auto bg-slate-100 rounded-full overflow-hidden relative mb-4 border-4 border-brand-50">
                                        {property.owner?.profile?.avatarUrl ? (
                                            <Image src={property.owner.profile.avatarUrl} alt="Agent" fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                <User size={48} />
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">
                                        {property.owner?.profile?.firstName || property.owner?.username || 'User'}
                                    </h3>
                                    <p className="text-brand-600 font-medium text-sm">Property Agent</p>
                                </div>
                                <div className="space-y-3">
                                    <button className="w-full flex items-center justify-center gap-2 bg-brand-600 text-white py-3 rounded-xl font-bold hover:bg-brand-700 transition-colors">
                                        <Phone size={20} />
                                        {property.owner?.profile?.phone || '0xxxxxxxx'}
                                    </button>
                                    <button className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition-colors">
                                        <div className="font-sans font-black">LINE</div>
                                        แอดไลน์
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer / Tabs */}
                    <div className="bg-black/90 backdrop-blur-md pt-2 pb-6 px-4">
                        <div className="flex justify-center gap-8 mb-4 border-b border-white/10">
                            <button
                                onClick={() => setLightboxTab('images')}
                                className={`pb-2 px-4 text-sm font-medium transition-colors relative ${lightboxTab === 'images' ? 'text-brand-400' : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <span>{images.length} รูปภาพ</span>
                                </div>
                                {lightboxTab === 'images' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-400 rounded-full" />
                                )}
                            </button>
                            <button
                                onClick={() => setLightboxTab('contact')}
                                className={`pb-2 px-4 text-sm font-medium transition-colors relative ${lightboxTab === 'contact' ? 'text-brand-400' : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <span>ติดต่อ</span>
                                </div>
                                {lightboxTab === 'contact' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-400 rounded-full" />
                                )}
                            </button>
                        </div>

                        {/* Thumbnails (Only show if on images tab) */}
                        {lightboxTab === 'images' && (
                            <div className="flex gap-2 overflow-x-auto pb-2 justify-start md:justify-center custom-scrollbar">
                                {images.map((img: any, idx: number) => (
                                    <button
                                        key={img.id}
                                        onClick={() => setActiveImageIndex(idx)}
                                        className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${activeImageIndex === idx
                                            ? 'border-brand-500 opacity-100 ring-2 ring-brand-500/50'
                                            : 'border-transparent opacity-50 hover:opacity-100 hover:border-white/50'
                                            }`}
                                    >
                                        <Image src={img.url} alt={`Thumb ${idx}`} fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
