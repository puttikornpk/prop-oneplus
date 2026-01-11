"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Mail, Phone, User, Lock, Facebook, X, Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

// Mock Google Icon 
const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
);

interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToLogin: () => void;
}

export function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
    const router = useRouter();
    const { t } = useLanguage();
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isTermsOpen, setIsTermsOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        countryCode: "+66",
        username: "",
        password: "",
        confirmPassword: "",
        acceptTerms: false
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!isOpen || !mounted) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!formData.acceptTerms) {
            setError("Please accept the terms and conditions");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    username: formData.username,
                    phone: formData.phone
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Registration failed');
            }

            // Success - Switch to Login
            onSwitchToLogin();

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Main Modal */}
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 relative animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors z-10"
                >
                    <X size={24} />
                </button>

                {/* Content */}
                <div className="max-h-[85vh] overflow-y-auto px-2">

                    {/* Social Buttons */}
                    <div className="grid grid-cols-2 gap-4 mb-8 mt-4">
                        <button
                            onClick={() => signIn('facebook')}
                            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-transparent border border-brand-300 rounded-lg text-slate-700 hover:bg-brand-50 transition-colors"
                        >
                            <Facebook className="text-[#1877F2]" size={20} fill="#1877F2" />
                            <span className="font-medium">Facebook</span>
                        </button>
                        <button className="flex items-center justify-center gap-2 py-2.5 px-4 bg-transparent border border-brand-300 rounded-lg text-slate-700 hover:bg-brand-50 transition-colors">
                            <GoogleIcon />
                            <span className="font-medium">Google</span>
                        </button>
                    </div>

                    <div className="relative mb-8 text-center">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-400"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 text-slate-700 bg-white font-medium text-lg">{t('orSeparator')}</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div className="space-y-1">
                            <label className="text-brand-600 font-medium">{t('emailLabel')}</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-brand-50/50 border border-brand-200 rounded-lg focus:outline-none focus:border-brand-500 text-slate-700 placeholder-slate-400"
                                    placeholder={t('emailPlaceholder')}
                                    required
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="space-y-1">
                            <label className="text-brand-600 font-medium">{t('phoneLabel')}</label>
                            <div className="flex gap-2">
                                <div className="relative w-32 shrink-0">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                                        <img src="https://flagcdn.com/w20/th.png" srcSet="https://flagcdn.com/w40/th.png 2x" width="20" alt="Thailand" />
                                    </div>
                                    <select
                                        className="w-full pl-9 pr-2 py-3 bg-brand-50/50 border border-brand-200 rounded-lg focus:outline-none focus:border-brand-500 text-slate-700 appearance-none text-sm"
                                        disabled
                                        value={formData.countryCode}
                                    >
                                        <option value="+66">(+66)</option>
                                    </select>
                                </div>
                                <div className="relative w-full">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-brand-50/50 border border-brand-200 rounded-lg focus:outline-none focus:border-brand-500 text-slate-700"
                                        placeholder={t('phonePlaceholder')}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Username */}
                        <div className="space-y-1">
                            <label className="text-brand-600 font-medium">{t('usernameLabel')}</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-brand-50/50 border border-brand-200 rounded-lg focus:outline-none focus:border-brand-500 text-slate-700"
                                    placeholder={t('usernamePlaceholder')}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1">
                            <label className="text-brand-600 font-medium">{t('passwordPlaceholder')}</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-10 py-3 bg-brand-50/50 border border-brand-200 rounded-lg focus:outline-none focus:border-brand-500 text-slate-700"
                                    placeholder={t('registerPasswordPlaceholder')}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-1">
                            <label className="text-brand-600 font-medium">{t('confirmPasswordLabel')}</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-10 py-3 bg-brand-50/50 border border-brand-200 rounded-lg focus:outline-none focus:border-brand-500 text-slate-700"
                                    placeholder={t('registerPasswordPlaceholder')}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="flex items-center gap-2 pt-2">
                            <input
                                type="checkbox"
                                id="terms"
                                name="acceptTerms"
                                checked={formData.acceptTerms}
                                onChange={handleChange}
                                className="w-5 h-5 rounded border-brand-300 text-brand-600 focus:ring-brand-500"
                            />
                            <label htmlFor="terms" className="text-slate-700">
                                {t('acceptTermsLabel')} <button type="button" onClick={() => setIsTermsOpen(true)} className="underline text-[#248D9E] font-medium hover:text-[#1d7482]">{t('clickHere')}</button> {t('readTerms')}
                            </label>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-brand-500 hover:bg-brand-600 text-white font-medium py-3 rounded-lg shadow-lg hover:shadow-xl transition-all text-lg mt-6"
                        >
                            {isLoading ? t('processing') : t('registerButton')}
                        </button>

                        <div className="text-center text-slate-600 mt-4 pb-2">
                            {t('alreadyHaveAccount')} <button type="button" onClick={onSwitchToLogin} className="text-[#3AB0FF] underline">{t('loginLink')}</button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Terms Modal - Nested */}
            {isTermsOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setIsTermsOpen(false)}>
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="text-xl font-bold text-slate-800">{t('termsTitle')}</h3>
                            <button onClick={() => setIsTermsOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto space-y-6 text-slate-600 leading-relaxed text-sm">
                            <div className="space-y-4">
                                <h4 className="font-bold text-lg text-slate-800 border-l-4 border-brand-500 pl-3">ภาษาไทย</h4>
                                <p>ยินดีต้อนรับสู่ PropertyOnePlus ("แพลตฟอร์ม") การเข้าถึงและใช้งานแพลตฟอร์มนี้แสดงว่าท่านยอมรับข้อกำหนดและเงื่อนไขดังต่อไปนี้:</p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li><strong>1. วัตถุประสงค์:</strong> แพลตฟอร์มนี้ให้บริการเป็นสื่อกลางสำหรับผู้ที่ต้องการซื้อ ขาย หรือเช่าอสังหาริมทรัพย์ เช่น บ้าน คอนโด และที่ดิน</li>
                                    <li><strong>2. ข้อมูลถูกต้อง:</strong> ผู้ใช้งานตกลงที่จะให้ข้อมูลที่ถูกต้อง ครบถ้วน และเป็นปัจจุบัน ในการสมัครสมาชิกและการลงประกาศ</li>
                                    <li><strong>3. ข้อห้าม:</strong> ห้ามลงประกาศที่มีเนื้อหาไม่เหมาะสม หลอกลวง ผิดกฎหมาย หรือละเมิดลิขสิทธิ์ของผู้อื่น</li>
                                    <li><strong>4. ความรับผิดชอบ:</strong> PropertyOnePlus เป็นเพียงผู้ให้บริการพื้นที่ลงประกาศ ไม่ได้รับผิดชอบต่อความเสียหายที่เกิดจากการทำธุรกรรมระหว่างผู้ใช้</li>
                                    <li><strong>5. ข้อมูลส่วนบุคคล:</strong> เราให้ความสำคัญกับความเป็นส่วนตัว ข้อมูลของท่านจะถูกจัดการตามนโยบายความเป็นส่วนตัวของเรา</li>
                                </ul>
                            </div>

                            <div className="border-t border-slate-100 my-4"></div>

                            <div className="space-y-4">
                                <h4 className="font-bold text-lg text-slate-800 border-l-4 border-blue-500 pl-3">English</h4>
                                <p>Welcome to PropertyOnePlus (the "Platform"). By accessing and using this Platform, you agree to the following terms and conditions:</p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li><strong>1. Purpose:</strong> The Platform serves as an intermediary for users wishing to buy, sell, or rent real estate properties such as houses, condos, and land.</li>
                                    <li><strong>2. Accurate Information:</strong> Users agree to provide accurate, complete, and up-to-date information during registration and listing creation.</li>
                                    <li><strong>3. Prohibited Conduct:</strong> Listing content that is inappropriate, fraudulent, illegal, or infringes on others' rights is strictly prohibited.</li>
                                    <li><strong>4. Liability:</strong> PropertyOnePlus acts solely as a listing venue and is not liable for any damages arising from transactions between users.</li>
                                    <li><strong>5. Privacy:</strong> We value your privacy. Your data will be handled in accordance with our Privacy Policy.</li>
                                </ul>
                            </div>
                        </div>
                        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                            <button
                                onClick={() => setIsTermsOpen(false)}
                                className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition-colors"
                            >
                                {t('closeButton')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>,
        document.body
    );
}
