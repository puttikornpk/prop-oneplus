"use client";

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface SessionExpiredModalProps {
    isOpen: boolean;
    onConfirm: () => void;
}

export function SessionExpiredModal({ isOpen, onConfirm }: SessionExpiredModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            {/* Modal */}
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 text-center space-y-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
                        <span className="text-2xl font-bold">!</span>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-slate-800">เซสชั่นหมดอายุ</h3>
                        <p className="text-slate-500 text-sm mt-2">
                            คุณไม่ได้ใช้งานระบบตามเวลาที่กำหนด (15 นาที) กรุณาเข้าสู่ระบบใหม่อีกครั้ง
                        </p>
                    </div>

                    <button
                        onClick={onConfirm}
                        className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl transition-colors"
                    >
                        ตกลง
                    </button>
                </div>
            </div>
        </div>
    );
}
