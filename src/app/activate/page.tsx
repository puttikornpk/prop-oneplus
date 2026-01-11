"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { PageLoader } from '@/components/ui/PageLoader';

function ActivateContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();

    const userParam = searchParams.get('user');
    const codeParam = searchParams.get('code');

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verifying your account...');

    useEffect(() => {
        if (!userParam || !codeParam) {
            setStatus('error');
            setMessage('Invalid activation link. Missing parameters.');
            return;
        }

        const verifyAccount = async () => {
            try {
                const response = await fetch('/api/auth/verify-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        identifier: userParam,
                        code: codeParam
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    setStatus('success');
                    setMessage('Account verified successfully! Redirecting...');
                    // Login the user in client context
                    login(data.user, data.token);

                    // Redirect after short delay
                    setTimeout(() => {
                        router.push('/');
                    }, 2000);
                } else {
                    setStatus('error');
                    setMessage(data.error || 'Verification failed. Please try again.');
                }
            } catch (error) {
                console.error("Verification error:", error);
                setStatus('error');
                setMessage('An unexpected error occurred.');
            }
        };

        verifyAccount();
    }, [userParam, codeParam, login, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                {status === 'loading' && (
                    <PageLoader variant="inline" className="py-0" />
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center space-y-4">
                        <CheckCircle className="w-16 h-16 text-green-500" />
                        <h2 className="text-2xl font-semibold text-slate-800">Success!</h2>
                        <p className="text-slate-500">{message}</p>
                        <p className="text-sm text-slate-400">You are now logged in.</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center space-y-4">
                        <XCircle className="w-16 h-16 text-red-500" />
                        <h2 className="text-2xl font-semibold text-slate-800">Verification Failed</h2>
                        <p className="text-slate-500">{message}</p>
                        <Link
                            href="/"
                            className="mt-4 px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                        >
                            Back to Home
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ActivatePage() {
    return (
        <Suspense fallback={<PageLoader />}>
            <ActivateContent />
        </Suspense>
    );
}
