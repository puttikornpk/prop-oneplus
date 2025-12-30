"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";

export function SocialAuthSync() {
    const { data: session, status } = useSession();
    const { login, user } = useAuth();
    const isSyncing = useRef(false);

    useEffect(() => {
        const syncSocialLogin = async () => {
            if (status === "authenticated" && session?.user && !user && !isSyncing.current) {
                isSyncing.current = true;

                try {
                    const res = await fetch('/api/auth/social-sync', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: session.user.email,
                            name: session.user.name,
                            image: session.user.image,
                            facebookId: (session.user as any).id // Mapped from providerAccountId
                        })
                    });

                    if (res.ok) {
                        const data = await res.json();
                        login(data.user, data.token);
                    } else {
                        console.error("Failed to sync social login");
                    }
                } catch (error) {
                    console.error("Error syncing social login:", error);
                } finally {
                    isSyncing.current = false;
                }
            }
        };

        syncSocialLogin();
    }, [status, session, user, login]);

    return null;
}
