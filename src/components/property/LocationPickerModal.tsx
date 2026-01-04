"use client";

import { X, Search, Map as MapIcon, Satellite, Crosshair, Info } from "lucide-react";
import { useState, useEffect } from "react";

interface LocationPickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (address: string) => void;
    initialAddress: string;
}

export function LocationPickerModal({ isOpen, onClose, onConfirm, initialAddress }: LocationPickerModalProps) {
    const [searchQuery, setSearchQuery] = useState(initialAddress);
    const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');
    const [isLocating, setIsLocating] = useState(false);

    useEffect(() => {
        setSearchQuery(initialAddress);
    }, [initialAddress, isOpen]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm(searchQuery);
        onClose();
    };

    const handleCurrentLocation = () => {
        setIsLocating(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // Simulate reverse geocoding or just use a placeholder for now along with coordinates
                    setSearchQuery(`Lat: ${position.coords.latitude.toFixed(4)}, Long: ${position.coords.longitude.toFixed(4)}`);
                    setIsLocating(false);
                },
                () => {
                    alert("Unable to retrieve your location");
                    setIsLocating(false);
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
            setIsLocating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800">ค้นหาทำเลที่ตั้ง</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Top Controls (Search & Info) - Moved outside map */}
                <div className="px-6 py-4 bg-white border-b border-slate-100 flex flex-col gap-3 z-20">
                    {/* Search Bar */}
                    <div className="relative w-full shadow-sm">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            <Search size={20} />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="ค้นหาตำแหน่งที่คุณต้องการ"
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-700 text-lg transition-all"
                        />
                    </div>

                    {/* Info Banner */}
                    <div className="bg-blue-50 px-4 py-3 rounded-xl border border-blue-100 text-blue-700 text-sm flex items-center gap-2 w-full">
                        <Info size={18} className="shrink-0" />
                        <span>ลากเพื่อเคลื่อนย้ายตำแหน่ง สามารถกดพิมพ์เพื่อค้นหาตำแหน่งอสังหาฯของคุณ</span>
                    </div>
                </div>

                {/* Map Content */}
                <div className="flex-1 flex flex-col relative bg-slate-50 overflow-hidden">

                    {/* Map Controls */}
                    <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-md border border-slate-100 p-1 flex">
                        <button
                            onClick={() => setMapType('roadmap')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${mapType === 'roadmap' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            แผนที่
                        </button>
                        <button
                            onClick={() => setMapType('satellite')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${mapType === 'satellite' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            ดาวเทียม
                        </button>
                    </div>

                    {/* Mock Map View */}
                    <div className="w-full h-full relative bg-[#e5e7eb]">
                        <iframe
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            scrolling="no"
                            marginHeight={0}
                            marginWidth={0}
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(searchQuery || 'Bangkok')}&t=${mapType === 'satellite' ? 'k' : 'm'}&z=15&ie=UTF8&iwloc=&output=embed`}
                            className="w-full h-full opacity-100 pointer-events-none" // Disable pointer events on iframe to simulate drag on container (in real app we'd use API)
                        ></iframe>

                        {/* Center Pin */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20">
                            {/* Address Bubble */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-white px-4 py-3 rounded-xl shadow-xl w-64 text-center">
                                <p className="text-xs text-slate-500 mb-1">ตำแหน่งที่เลือก</p>
                                <p className="text-sm font-medium text-slate-800 line-clamp-2 leading-relaxed">
                                    {searchQuery || "กรุงเทพมหานคร"}
                                </p>
                                {/* Triangle arrow */}
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white transform rotate-45"></div>
                            </div>

                            {/* Pin Icon */}
                            <div className="relative">
                                <div className="w-10 h-10 bg-red-500 rounded-full border-[3px] border-white shadow-lg flex items-center justify-center animate-bounce">
                                    <div className="w-3 h-3 bg-white rounded-full"></div>
                                </div>
                                <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-red-500 absolute -bottom-1.5 left-1/2 -translate-x-1/2"></div>
                                <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 w-4 h-1.5 bg-black/20 rounded-full blur-[1px]"></div>
                            </div>
                        </div>

                        {/* Current Location Button */}
                        <button
                            onClick={handleCurrentLocation}
                            className="absolute bottom-24 right-4 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl shadow-lg border border-slate-200 text-sm font-medium transition-all flex items-center gap-2"
                        >
                            {isLocating ? (
                                <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <Crosshair size={18} />
                            )}
                            ใช้ตำแหน่งปัจจุบัน
                        </button>
                    </div>

                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-slate-100 bg-white flex justify-end">
                    <button
                        onClick={handleConfirm}
                        className="w-full sm:w-auto bg-[#1FB992] hover:bg-[#199d7b] text-white text-lg font-medium py-3 px-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
                    >
                        ตกลง
                    </button>
                </div>
            </div>
        </div>
    );
}
