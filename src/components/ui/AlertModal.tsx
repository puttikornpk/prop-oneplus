"use client";

import { Logo } from '@/components/ui/Logo';

export interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    actionLabel?: string;
    showCancel?: boolean;
    cancelLabel?: string;
    onConfirm?: () => void;
}

export function AlertModal({
    isOpen,
    onClose,
    title,
    message,
    actionLabel = "ตกลง",
    showCancel = false,
    cancelLabel = "ยกเลิก",
    onConfirm
}: AlertModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 text-center space-y-4">
                    <div className="flex justify-center pb-2">
                        <Logo />
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-brand-600">{title}</h3>
                        <p className="text-slate-500 text-sm mt-2">
                            {message}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        {showCancel && (
                            <button
                                onClick={onClose}
                                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-colors"
                            >
                                {cancelLabel}
                            </button>
                        )}
                        <button
                            onClick={() => {
                                if (onConfirm) {
                                    onConfirm();
                                } else {
                                    onClose();
                                }
                            }}
                            className={`flex-1 bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-brand-500/20 ${!showCancel ? 'w-full' : ''}`}
                        >
                            {actionLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
