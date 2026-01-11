"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Heart } from "lucide-react";

interface ListingCardProps {
    property: {
        id: string;
        topic: string;
        price: number;
        address: string;
        listingStatus?: string; // e.g. OWNER, AGENT
        listingType?: string; // e.g. SELL, RENT
        category?: string;
        images?: { url: string }[];
        landRai?: number;
        landNgan?: number;
        landSqWah?: number;
        usableArea?: number;
        // Add other fields as needed
    }
}

export function ListingCard({ property }: ListingCardProps) {
    const imageUrl = property.images?.[0]?.url || '/placeholder.jpg';

    // Safety checks for numbers
    const price = property.price ? Number(property.price) : 0;
    const landRai = property.landRai || 0;
    const landNgan = property.landNgan || 0;
    const landSqWah = property.landSqWah ? Number(property.landSqWah) : 0;
    const usableArea = property.usableArea ? Number(property.usableArea) : 0;

    return (
        <Link href={`/property/${property.id}`} className="group block h-full">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-slate-100 h-full flex flex-col">
                {/* Image Section */}
                <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                    <Image
                        src={imageUrl}
                        alt={property.topic}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>

                    {/* Tags */}
                    <div className="absolute top-3 left-3 flex gap-2">
                        {property.category && (
                            <span className="px-2 py-1 text-xs font-bold bg-slate-800/80 text-white rounded backdrop-blur-sm border border-white/20">
                                {property.category}
                            </span>
                        )}
                        <span className="px-2 py-1 text-xs font-bold bg-brand-600 text-white rounded shadow-sm">
                            {property.listingType === 'SELL' ? 'Sale' : 'Rent'}
                        </span>
                    </div>

                    {/* Like Button */}
                    <button className="absolute top-3 right-3 p-2 bg-white/20 hover:bg-white rounded-full backdrop-blur-sm transition-colors group/like">
                        <Heart size={16} className="text-white group-hover/like:text-red-500 transition-colors" />
                    </button>

                    {/* Price Overlay */}
                    <div className="absolute bottom-3 left-3 text-white">
                        <div className="text-2xl font-bold drop-shadow-md">
                            ฿{price.toLocaleString()}
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-slate-800 line-clamp-2 mb-2 group-hover:text-brand-600 transition-colors">
                            {property.topic}
                        </h3>
                        <div className="flex items-start gap-1 text-sm text-slate-500 mb-4 h-10">
                            <MapPin size={14} className="mt-0.5 flex-shrink-0 text-brand-500" />
                            <span className="line-clamp-2 text-xs">{property.address || 'ทั่่วไป'}</span>
                        </div>
                    </div>

                    {/* Checkbox-style Specs */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-t border-slate-50">
                        {landRai > 0 || landNgan > 0 || landSqWah > 0 ? (
                            <>
                                <div className="text-center">
                                    <div className="text-xs text-slate-400">ไร่</div>
                                    <div className="font-bold text-slate-700">{landRai}</div>
                                </div>
                                <div className="text-center border-l border-slate-100">
                                    <div className="text-xs text-slate-400">งาน</div>
                                    <div className="font-bold text-slate-700">{landNgan}</div>
                                </div>
                                <div className="text-center border-l border-slate-100">
                                    <div className="text-xs text-slate-400">ตร.ว.</div>
                                    <div className="font-bold text-slate-700">{landSqWah}</div>
                                </div>
                            </>
                        ) : usableArea > 0 && (
                            <div className="col-span-3 text-center flex items-center justify-center gap-2">
                                <div className="font-bold text-slate-700">{usableArea}</div>
                                <div className="text-xs text-slate-400">ตร.ม.</div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-50">
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                            Eye icon 1250 เข้าชม
                        </div>
                        <div className="text-xs font-bold text-brand-600 flex items-center gap-1 cursor-pointer">
                            ดูรายละเอียด &rarr;
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
