import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { User, Menu, Bell, Heart, MessageSquare, History } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";
import { MegaMenu } from "@/components/layout/MegaMenu";
import { useAuth } from "@/context/AuthContext";
import { LoginModal } from "@/components/auth/LoginModal";
import { RegisterModal } from "@/components/auth/RegisterModal";

export const Header = () => {
    const { t } = useLanguage();
    const { user, logout } = useAuth();
    const router = useRouter();
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const [registerOpen, setRegisterOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setUserMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        await signOut({ redirect: false });
        logout();
        setUserMenuOpen(false);
        router.push('/');
    };

    return (
        <header className="sticky top-0 z-50 bg-gradient-to-r from-brand-200 via-white to-brand-200 backdrop-blur-md shadow-sm border-b border-brand-100">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="hover:opacity-80 hover:scale-105 active:scale-95 transition-all duration-300">
                    <Logo />
                </Link>

                {/* Navigation - Desktop */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700">
                    <Link href="#" className="hover:text-brand-600 hover:scale-110 active:scale-95 transition-all duration-200">{t('home')}</Link>

                    {/* Mega Menu Trigger */}
                    <div className="group relative h-full flex items-center">
                        <Link href="#" className="hover:text-brand-600 hover:scale-110 active:scale-95 transition-all duration-200 py-6">
                            {t('recSearch')}
                        </Link>
                        {/* Dropdown - positioning adjusted to center or align left */}
                        <div className="hidden group-hover:block absolute top-[90%] -left-20 pt-2 z-50 text-slate-600">
                            <MegaMenu />
                        </div>
                    </div>

                    <Link href="#" className="hover:text-brand-600 hover:scale-110 active:scale-95 transition-all duration-200">{t('buyRent')}</Link>
                    <Link href="#" className="hover:text-brand-600 hover:scale-110 active:scale-95 transition-all duration-200">{t('sell')}</Link>
                    <Link href="#" className="hover:text-brand-600 hover:scale-110 active:scale-95 transition-all duration-200">{t('news')}</Link>
                </nav>

                {/* User Actions */}
                <div className="flex items-center gap-4">
                    <button className="hidden sm:flex bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full font-medium text-sm transition-all shadow-lg shadow-red-200 hover:shadow-red-300 hover:scale-105 active:scale-95 duration-300">
                        {t('listProperty')}
                    </button>

                    <button className="p-2 text-red-500 hover:text-red-600 hover:bg-white/50 rounded-full transition-all duration-300 hover:scale-110 active:scale-95">
                        <Heart size={24} strokeWidth={2.5} />
                    </button>

                    <button className="p-2 text-slate-600 hover:bg-white/50 rounded-full transition-all duration-300 hover:scale-110 active:scale-90 relative hover:text-brand-600">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse border border-white"></span>
                    </button>

                    <button className="p-2 text-slate-600 hover:bg-white/50 rounded-full transition-all duration-300 hover:scale-110 active:scale-90 hover:text-brand-600">
                        <MessageSquare size={20} />
                    </button>

                    <button className="p-2 text-slate-600 hover:bg-white/50 rounded-full transition-all duration-300 hover:scale-110 active:scale-90 hover:text-brand-600">
                        <History size={20} />
                    </button>

                    <LanguageSwitcher />

                    <div className="relative flex items-center">
                        {user ? (
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="p-2 text-slate-600 hover:bg-white/50 rounded-full transition-all duration-300 hover:scale-110 active:scale-90 hover:text-brand-600 flex items-center gap-2"
                                >
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200 overflow-hidden">
                                        <span className="text-blue-600 font-bold text-sm">
                                            {(user.profile?.firstName?.[0] || user.email?.[0] || 'U').toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium text-slate-700 hidden lg:block max-w-[100px] truncate">
                                        {user.profile?.firstName || user.email?.split('@')[0]}
                                    </span>
                                    <svg className={`w-4 h-4 text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </button>

                                {/* Dropdown Menu */}
                                {userMenuOpen && (
                                    <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="px-4 py-3 border-b border-slate-100 mb-2">
                                            <p className="text-sm font-medium text-slate-900 truncate">{user.profile?.firstName || 'User'}</p>
                                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                        </div>

                                        <Link href="#" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-brand-500 transition-colors">
                                            <span>หน้าสมาชิก</span>
                                        </Link>
                                        <Link href="#" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-brand-500 transition-colors">
                                            <span>ประกาศของฉัน</span>
                                        </Link>
                                        <Link href="#" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-brand-500 transition-colors">
                                            <span>My note</span>
                                        </Link>
                                        <Link href="#" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-brand-500 transition-colors">
                                            <span>คอร์สเรียนนายหน้า</span>
                                        </Link>
                                        <Link href="#" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-brand-500 transition-colors">
                                            <span>แก้ไขข้อมูลส่วนตัว</span>
                                        </Link>
                                        <Link href="#" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-brand-500 transition-colors">
                                            <span>ติดต่อเจ้าหน้าที่</span>
                                        </Link>
                                        <Link href="#" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-brand-500 transition-colors">
                                            <span>เติมเครดิต</span>
                                        </Link>
                                        <Link href="#" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-brand-500 transition-colors">
                                            <span>เว็บไซต์ของฉัน</span>
                                        </Link>
                                        <Link href="#" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-brand-500 transition-colors">
                                            <span>เชื่อมต่อ Line</span>
                                        </Link>

                                        <div className="border-t border-slate-100 my-2 pt-2">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-red-50 hover:text-red-500 transition-colors text-left"
                                            >
                                                <span>ออกจากระบบ</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center text-sm font-medium text-slate-700 gap-1 whitespace-nowrap px-2">
                                <button
                                    onClick={() => setLoginOpen(true)}
                                    className="p-1 hover:text-brand-600 hover:scale-110 active:scale-95 transition-all duration-200"
                                >
                                    <User size={20} className="text-slate-700" />
                                </button>
                                <div className="hidden sm:flex items-center gap-1">
                                    <button onClick={() => setLoginOpen(true)} className="hover:text-brand-600 hover:scale-110 active:scale-95 transition-all duration-200">
                                        {t('login')}
                                    </button>
                                    <span className="text-slate-400">/</span>
                                    <button onClick={() => setRegisterOpen(true)} className="hover:text-brand-600 hover:scale-110 active:scale-95 transition-all duration-200">
                                        {t('freeRegister')}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <button className="md:hidden p-2 text-slate-600 hover:bg-white/50 rounded-full transition-all duration-300 hover:scale-110 active:scale-90 hover:text-brand-600">
                        <Menu size={20} />
                    </button>
                </div>
            </div>

            {/* Auth Modals */}
            <LoginModal
                isOpen={loginOpen}
                onClose={() => setLoginOpen(false)}
                onSwitchToRegister={() => {
                    setLoginOpen(false);
                    setRegisterOpen(true);
                }}
            />
            <RegisterModal
                isOpen={registerOpen}
                onClose={() => setRegisterOpen(false)}
                onSwitchToLogin={() => {
                    setRegisterOpen(false);
                    setLoginOpen(true);
                }}
            />
        </header>
    );
};
