"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Phone, User, Lock, Facebook, Eye, EyeOff } from "lucide-react";

// Mock Google Icon 
const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
);

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isTermsOpen, setIsTermsOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "puttikorn@live.com", // Default from image
        phone: "0889443425",
        countryCode: "+66",
        username: "Puttikorn",
        password: "",
        confirmPassword: "",
        acceptTerms: false
    });

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
                    phone: formData.phone // Assuming country code + phone handling if needed, usually just store number
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Registration failed');
            }

            // Success - Redirect to Login
            router.push('/login'); // Assuming /login exists, or /?action=login
            // Since we don't have login page yet fully defined in task list, maybe redirect home
            // But per standard, let's try router.push('/') or alert
            alert("Registration Successful! Please login.");
            router.push('/');

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#E6F4F1] flex items-center justify-center p-4">
            <div className="w-full max-w-md">

                {/* Social Buttons */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <button className="flex items-center justify-center gap-2 py-2.5 px-4 bg-transparent border border-brand-300 rounded-lg text-slate-700 hover:bg-brand-50 transition-colors">
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
                        <span className="px-4 text-slate-700 bg-[#E6F4F1] font-medium text-lg">หรือ</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email */}
                    <div className="space-y-1">
                        <label className="text-brand-600 font-medium">อีเมล</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 bg-brand-50/50 border border-brand-200 rounded-lg focus:outline-none focus:border-brand-500 text-slate-700 placeholder-slate-400"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-1">
                        <label className="text-brand-600 font-medium">เบอร์โทร</label>
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
                                    placeholder="08X-XXX-XXXX"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Username */}
                    <div className="space-y-1">
                        <label className="text-brand-600 font-medium">ชื่อผู้ใช้</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 bg-brand-50/50 border border-brand-200 rounded-lg focus:outline-none focus:border-brand-500 text-slate-700"
                                placeholder="Username"
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                        <label className="text-brand-600 font-medium">รหัสผ่าน</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-10 pr-10 py-3 bg-brand-50/50 border border-brand-200 rounded-lg focus:outline-none focus:border-brand-500 text-slate-700 text-2xl tracking-widest"
                                placeholder="•••••••"
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
                        <label className="text-brand-600 font-medium">ยืนยันรหัสผ่าน</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full pl-10 pr-10 py-3 bg-brand-50/50 border border-brand-200 rounded-lg focus:outline-none focus:border-brand-500 text-slate-700 text-2xl tracking-widest"
                                placeholder="•••••••"
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
                            ยอมรับเงื่อนไขข้อตกลง <button type="button" onClick={() => setIsTermsOpen(true)} className="underline text-[#248D9E] font-medium hover:text-[#1d7482]">คลิกที่นี่</button> เพื่ออ่าน
                        </label>
                    </div>

                    {/* Terms Modal */}
                    {isTermsOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setIsTermsOpen(false)}>
                            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
                                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                    <h3 className="text-xl font-bold text-slate-800">ข้อกำหนดและเงื่อนไข / Terms and Conditions</h3>
                                    <button onClick={() => setIsTermsOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                    </button>
                                </div>
                                <div className="p-6 overflow-y-auto space-y-6 text-slate-600 leading-relaxed text-sm">
                                    <div className="space-y-4">
                                        <h4 className="font-bold text-lg text-slate-800 border-l-4 border-[#1FB992] pl-3">ภาษาไทย</h4>
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
                                        ปิด / Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

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
                        className="w-full bg-[#1FB992] hover:bg-[#1aad88] text-white font-medium py-3 rounded-lg shadow-lg hover:shadow-xl transition-all text-lg mt-6"
                    >
                        {isLoading ? 'Processing...' : 'สมัครสมาชิก'}
                    </button>

                    <div className="text-center text-slate-600 mt-4">
                        หากท่านเคยมีบัญชีอยู่แล้ว เข้าสู่ระบบที่นี่ <Link href="/login" className="text-[#3AB0FF] underline">เข้าสู่ระบบ</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
