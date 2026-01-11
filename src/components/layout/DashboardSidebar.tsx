import React from 'react';
import {
    LayoutDashboard,
    Image as ImageIcon,
    MessageSquare,
    Bell,
    Box,
    HelpCircle,
    FileText,
    Star,
    Search,
    Users,
    Video,
    User,
    CreditCard,
    Home,
    LogOut
} from 'lucide-react';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';

export const DashboardSidebar = () => {
    const { data: session } = useSession();

    const menuItems = [
        { icon: Box, label: 'รายการประกาศ', active: true },
        { icon: MessageSquare, label: 'แชท' },
        { icon: Bell, label: 'แจ้งเตือน' },
        { icon: FileText, label: 'ประวัติค้นหา' },
        { icon: FileText, label: 'บันทึก', badgeColor: 'bg-red-500' },
        { icon: User, label: 'โปรไฟล์', badge: 'ยังไม่ยืนยันตัวตน', badgeColor: 'bg-red-600' },
        { icon: CreditCard, label: 'เครดิต' },
    ];

    return (
        <aside className="w-full lg:w-64 flex-shrink-0 bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0 overflow-y-auto scrollbar-hide">
            {/* User Profile Section */}
            <div className="p-6 text-center border-b border-slate-50">
                <div className="relative w-20 h-20 mx-auto mb-3">
                    <div className="w-full h-full rounded-full overflow-hidden border-2 border-slate-100 relative">
                        {/* Avatar Placeholder */}
                        <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                            <User size={32} />
                        </div>
                    </div>
                </div>
                <h2 className="font-bold text-slate-800 text-lg">{session?.user?.name || 'User'}</h2>
                <div className="mt-2 inline-block px-4 py-1 bg-blue-100 text-blue-600 text-xs font-bold rounded-full">
                    Beginner
                </div>
            </div>

            {/* Menu */}
            <nav className="flex-1 px-4 space-y-1">
                {menuItems.map((item, index) => (
                    <button
                        key={index}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${item.active
                            ? 'bg-brand-50 text-brand-600 font-bold'
                            : 'text-slate-500 hover:bg-brand-50 hover:text-brand-600'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <item.icon size={18} className={item.active ? 'text-brand-600' : 'text-slate-400 group-hover:text-brand-600'} />
                            <span className="text-sm">{item.label}</span>
                        </div>
                        {item.badge && (
                            <span className={`px-2 py-0.5 text-[10px] text-white rounded-full ${item.badgeColor || 'bg-red-500'}`}>
                                {item.badge}
                            </span>
                        )}
                    </button>
                ))}

                <button
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                    <LogOut size={18} />
                    <span className="text-sm font-medium">ออกจากระบบ</span>
                </button>
            </nav>
        </aside>
    );
};
