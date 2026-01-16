"use client";

import React from "react";
import { Logo } from "@/components/ui/Logo";

interface PageLoaderProps {
    className?: string;
    variant?: "fullscreen" | "inline";
}

export const PageLoader: React.FC<PageLoaderProps> = ({ className = "", variant = "fullscreen" }) => {
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 1000); // 1 second delay

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    if (variant === "inline") {
        return (
            <div className={`flex flex-col items-center justify-center gap-4 py-12 ${className} animate-in fade-in duration-300`}>
                <div className="relative">
                    <div className="animate-pulse">
                        <Logo />
                    </div>
                </div>
                <div className="flex items-center gap-2 text-brand-600 font-medium animate-pulse">
                    <span className="w-1.5 h-1.5 bg-brand-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-brand-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-brand-600 rounded-full animate-bounce"></span>
                </div>
            </div>
        );
    }

    return (
        <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm ${className} animate-in fade-in duration-300`}>
            <div className="relative transform scale-125 animate-bounce-slight">
                <Logo />
            </div>
            <div className="mt-8 flex items-center gap-2">
                <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-brand-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-brand-700 rounded-full animate-bounce"></div>
            </div>
        </div>
    );
};
