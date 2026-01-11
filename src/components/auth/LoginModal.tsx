"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { User, Lock, Facebook, ArrowRight, LogIn, X, Shield, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { createPortal } from "react-dom";

// Mock Google Icon 
const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
);

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToRegister: () => void;
}

export function LoginModal({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) {
    const router = useRouter();
    const { login } = useAuth();
    const { t } = useLanguage();
    // Step 1: Identifier, 2: Password, 3: Activation
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [activationCode, setActivationCode] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Reset state when opening
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setIdentifier("");
            setPassword("");
            setActivationCode("");
            setShowPassword(false);
            setError("");
        }
    }, [isOpen]);

    if (!isOpen || !mounted) return null;

    const handleContinue = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!identifier) {
            setError(t('enterIdentifierError'));
            return;
        }

        setIsLoading(true);

        try {
            // Check user status
            const res = await fetch('/api/auth/initiate-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier })
            });

            if (!res.ok) {
                // Determine if we should fail or just move to password step (to avoid enumeration)
                // If API returns specific error, handle it.
                // Assuming API returns { status: 'OK' } or { status: 'ACTIVATION_REQUIRED' }
                // or error.
            }

            const data = await res.json();

            if (data.status === 'ACTIVATION_REQUIRED') {
                setStep(3); // Go to Activation
            } else {
                setStep(2); // Go to Password
            }

        } catch (err) {
            // If check fails, default to password step (fallback)
            setStep(2);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!password) {
            setError(t('enterPasswordError'));
            return;
        }


        setIsLoading(true);
        try {
            const result = await signIn("credentials", {
                redirect: false,
                identifier,
                password,
            });

            if (result?.error) {
                throw new Error(result.error);
            }

            // Fetch session/user details to update context (optional if session Provider used)
            // But we have a 'login' context function. 
            // Better to let SessionProvider handle IT? 
            // The existing code manually calls `login(user, token)`.
            // While Refactoring to NextAuth, we usually wrap app in SessionProvider.
            // But for now, let's keep the manual context update if we can fetch user?
            // Actually, `signIn` doesn't return user object directly in client.
            // We might need to fetch /api/auth/session or reload.
            // SIMPLEST FIX: Just reload page or let UseSession hook pick it up?
            // User code expects `login` function.
            // Let's call /api/auth/session to get user info after sign in.

            const sessionRes = await fetch('/api/auth/session');
            const sessionData = await sessionRes.json();

            if (sessionData?.user) {
                // Map NextAuth session user to Context User format if needed?
                // Or just pass sessionData.user and token (accessToken).
                login(sessionData.user, sessionData.accessToken);
                onClose();
                if (sessionData.user.role === 'ADMIN' || sessionData.user.role === 'admin') {
                    router.push('/admin');
                }
            }

        } catch (err: any) {
            setError(err.message || "Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyToken = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!activationCode) {
            setError("Please enter activation code");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier, code: activationCode })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Verification failed');
            }

            const data = await res.json();
            login(data.user, data.token);
            onClose();

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className={`w-full max-w-md bg-white rounded-2xl shadow-2xl relative animate-in zoom-in-95 duration-200 overflow-hidden ${step === 3 ? 'bg-brand-50' : ''}`} onClick={e => e.stopPropagation()}>

                {step === 3 ? (
                    // Activation Step UI (Brand Background)
                    <div className="bg-brand-50 p-8 min-h-[400px] flex flex-col items-center text-center">
                        <div className="w-full flex justify-end">
                            <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
                                <X size={24} />
                            </button>
                        </div>

                        <h2 className="text-slate-700 text-lg font-medium mt-8 mb-8">{t('activationTitle')}</h2>

                        <form onSubmit={handleVerifyToken} className="w-full space-y-4">
                            <div className="text-left">
                                <label className="text-brand-600 text-sm mb-1 block">{t('activationLabel')}</label>
                                <div className="relative">
                                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        value={activationCode}
                                        onChange={(e) => setActivationCode(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded bg-white focus:outline-none focus:border-brand-500 text-slate-700"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="text-red-500 text-sm">{error}</div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-brand-500 hover:bg-brand-600 text-white font-medium py-3 rounded-xl shadow-lg mt-4 transition-colors"
                            >
                                {isLoading ? t('processing') : t('activationConfirm')}
                            </button>
                        </form>

                        <p className="text-slate-400 text-xs mt-4">
                            {t('activationNotReceived')}
                        </p>
                    </div>
                ) : (
                    // Login / Password Step UI
                    <div className="p-8">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="flex items-center gap-3 mb-8">
                            <LogIn className="text-slate-700" size={24} />
                            <h1 className="text-xl font-medium text-slate-800">{t('loginTitle')}</h1>
                        </div>

                        <form onSubmit={step === 1 ? handleContinue : handleLogin} className="space-y-6">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-brand-500 text-sm font-medium">{t('loginWith')}</label>
                                    <User className="text-brand-500" size={18} />
                                </div>

                                {step === 1 ? (
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                        <input
                                            type="text"
                                            value={identifier}
                                            onChange={(e) => setIdentifier(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 text-slate-700 placeholder-slate-400 transition-all"
                                            placeholder={t('phoneEmailUserPlaceholder')}
                                            autoFocus
                                        />
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-12 pr-12 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 text-slate-700 placeholder-slate-400 transition-all"
                                            placeholder={t('passwordPlaceholder')}
                                            autoFocus
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                )}

                                {step === 2 && (
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="text-xs text-slate-400 hover:text-brand-500 mt-2 block"
                                    >
                                        {t('backToUser')}
                                    </button>
                                )}
                            </div>

                            {error && (
                                <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-brand-500 hover:bg-brand-600 text-white font-medium py-3 rounded-xl shadow-lg shadow-brand-500/20 hover:shadow-xl transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                {isLoading ? t('processing') : (step === 1 ? t('continue') : t('loginButton'))}
                                {!isLoading && step === 1 && <ArrowRight size={18} />}
                            </button>
                        </form>

                        <div className="relative my-8 text-center">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 text-slate-600 font-medium bg-white">{t('quickLogin')}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => signIn('facebook')}
                                className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm"
                            >
                                <Facebook className="text-[#1877F2]" size={20} fill="#1877F2" />
                                <span className="font-medium">Facebook</span>
                            </button>
                            <button className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm">
                                <GoogleIcon />
                                <span className="font-medium">Google</span>
                            </button>
                        </div>

                        <div className="mt-8 text-center space-x-2 text-slate-600 text-sm">
                            <button onClick={onSwitchToRegister} className="text-[#3AB0FF] underline hover:text-[#2a90d9] font-medium">
                                {t('orRegisterFree')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
}
