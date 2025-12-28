"use client";

import { LogOut } from 'lucide-react';
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export function SidebarLogout() {
    const { logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-red-900/20 hover:text-red-400 rounded-lg transition-colors"
        >
            <LogOut size={20} />
            <span>Logout</span>
        </button>
    );
}
