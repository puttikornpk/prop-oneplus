import React from "react";
import Image from "next/image";
import { MapPin, Heart, Eye, ArrowRight } from "lucide-react";
import { Property } from "@/data/mock-listings";
import { useLanguage } from "@/context/LanguageContext";

interface PropertyCardProps {
    property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
    const { t } = useLanguage();
    return (
        <div className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            {/* Image Container */}
            <div className="relative h-64 w-full overflow-hidden">
                <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                    {property.tags.map((tag) => (
                        <span
                            key={tag}
                            className="px-3 py-1 text-xs font-semibold text-white bg-black/50 backdrop-blur-md rounded-full"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
                <button className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white text-slate-600 hover:text-red-500 rounded-full transition-colors backdrop-blur-sm">
                    <Heart size={18} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-2xl font-bold">฿{property.price.toLocaleString()}</p>
                    {property.originalPrice && (
                        <p className="text-sm text-white/80 line-through">
                            ฿{property.originalPrice.toLocaleString()}
                        </p>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="text-lg font-bold text-slate-800 line-clamp-1 mb-2 group-hover:text-brand-600 transition-colors">
                    {property.title}
                </h3>

                <div className="flex items-center text-slate-500 text-sm mb-4">
                    <MapPin size={16} className="mr-1 text-brand-500" />
                    <span className="truncate">{property.location}</span>
                </div>

                {/* Size Info */}
                <div className="grid grid-cols-3 gap-2 py-3 border-t border-slate-100">
                    <div className="text-center">
                        <p className="text-xs text-slate-400">{t('rai')}</p>
                        <p className="font-semibold text-slate-700">{property.size.rai || 0}</p>
                    </div>
                    <div className="text-center border-l border-slate-100">
                        <p className="text-xs text-slate-400">{t('ngan')}</p>
                        <p className="font-semibold text-slate-700">{property.size.ngan || 0}</p>
                    </div>
                    <div className="text-center border-l border-slate-100">
                        <p className="text-xs text-slate-400">{t('sqwah')}</p>
                        <p className="font-semibold text-slate-700">{property.size.sqwah || 0}</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center text-xs text-slate-400 gap-1">
                        <Eye size={14} /> {property.views} {t('views')}
                    </div>
                    <button className="text-brand-600 text-sm font-semibold flex items-center gap-1 group/btn">
                        {t('details')} <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};
