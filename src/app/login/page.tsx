"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Lock, Facebook, ArrowRight, LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Mock Google Icon (Reused component)
const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
);

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [step, setStep] = useState(1); // 1: Identifier, 2: Password
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleContinue = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (step === 1) {
            if (!identifier) {
                setError("Please enter phone, email, or username");
                return;
            }
            // Move to password step
            setStep(2);
        } else {
            // Login Logic
            if (!password) {
                setError("Please enter your password");
                return;
            }

            setIsLoading(true);
            try {
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ identifier, password })
                });

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.error || 'Login failed');
                }

                const data = await res.json();

                // Store token (Simulated)
                // In generic app, localStorage or Cookie. 
                localStorage.setItem('token', data.token);
                // Also could store user
                localStorage.setItem('user', JSON.stringify(data.user));

                // FALLBACK: Manually set cookie for client-side persistence if server header fails
                document.cookie = `token=${data.token}; path=/; max-age=604800; SameSite=Lax`;

                // Redirect based on Role
                if (data.user.role === 'ADMIN') {
                    router.push('/admin');
                } else {
                    router.push('/');
                }

            } catch (err: any) {
                setError(err.message);
                // Reset to password field mostly used invalid creds
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <LogIn className="text-slate-700" size={24} />
                    <h1 className="text-xl font-medium text-slate-800">เข้าสู่ระบบเพื่อดำเนินการต่อ</h1>
                </div>

                <form onSubmit={handleContinue} className="space-y-6">
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-[#1FB992] text-sm font-medium">เข้าสู่ระบบด้วย</label>
                            <User className="text-[#1FB992]" size={18} />
                        </div>

                        {step === 1 ? (
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1FB992] focus:ring-1 focus:ring-[#1FB992]/20 text-slate-700 placeholder-slate-400 transition-all"
                                    placeholder="เบอร์โทร / อีเมล / ชื่อผู้ใช้ (Username)"
                                    autoFocus
                                />
                            </div>
                        ) : (
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1FB992] focus:ring-1 focus:ring-[#1FB992]/20 text-slate-700 placeholder-slate-400 transition-all"
                                    placeholder="รหัสผ่าน"
                                    autoFocus
                                />
                            </div>
                        )}

                        {step === 2 && (
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="text-xs text-slate-400 hover:text-[#1FB992] mt-2 block"
                            >
                                ← กลับไปแก้ไขชื่อผู้ใช้
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
                        className="w-full bg-[#1FB992] hover:bg-[#1aad88] text-white font-medium py-3 rounded-lg shadow-lg shadow-[#1FB992]/20 hover:shadow-xl transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        {isLoading ? 'Processing...' : (step === 1 ? 'ดำเนินการต่อ' : 'เข้าสู่ระบบ')}
                        {!isLoading && step === 1 && <ArrowRight size={18} />}
                    </button>
                </form>

                {/* Divider */}
                <div className="relative my-8 text-center">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 text-slate-600 font-medium bg-white">หรือเข้าสู่ระบบง่ายๆด้วย</span>
                    </div>
                </div>

                {/* Social Login */}
                <div className="grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm">
                        <Facebook className="text-[#1877F2]" size={20} fill="#1877F2" />
                        <span className="font-medium">Facebook</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm">
                        <GoogleIcon />
                        <span className="font-medium">Google</span>
                    </button>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center space-x-2 text-slate-600 text-sm">
                    <Link href="/register" className="text-[#3AB0FF] underline hover:text-[#2a90d9] font-medium">
                        สมัครสมาชิกฟรี
                    </Link>
                    <span>ใช้งานได้ทันที</span>
                </div>

            </div>
        </div>
    );
}
