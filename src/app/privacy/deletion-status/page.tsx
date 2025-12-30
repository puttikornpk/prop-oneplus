"use client";

import { useSearchParams } from 'next/navigation';
import { Shield, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Suspense } from 'react';

function DeletionStatusContent() {
    const searchParams = useSearchParams();
    const code = searchParams.get('code');
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 text-center animate-in fade-in zoom-in-95 duration-300">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="text-green-600" size={32} />
                </div>

                <h1 className="text-2xl font-bold text-slate-800 mb-2">Deletion Request Received</h1>
                <p className="text-slate-600 mb-8">
                    Your request to delete your data has been processed.
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Confirmation Code</p>
                    <p className="text-3xl font-mono font-medium text-brand-600 tracking-wider">
                        {code || '-----'}
                    </p>
                </div>

                <div className="text-sm text-slate-500">
                    <p className="flex items-center justify-center gap-2">
                        <Shield size={16} />
                        We verify and process all deletion requests securely.
                    </p>
                </div>
            </div>

            <div className="mt-8 text-slate-400 text-sm">
                &copy; {new Date().getFullYear()} PropertyOnePlus
            </div>
        </div>
    );
}

export default function DeletionStatusPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DeletionStatusContent />
        </Suspense>
    );
}
