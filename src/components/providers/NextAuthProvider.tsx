"use client";

import { SessionProvider } from "next-auth/react";
import { SocialAuthSync } from "@/components/auth/SocialAuthSync";

export function NextAuthProvider({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            {children}
            <SocialAuthSync />
        </SessionProvider>
    );
}
