
import { AuthOptions } from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
    providers: [
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID || "",
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
            authorization: {
                params: {
                    scope: "email,public_profile",
                },
            },
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                identifier: { label: "Identifier", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // Debug Log removed


                if (!credentials?.identifier || !credentials?.password) {
                    throw new Error("Missing identifier or password");
                }

                const user = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { email: credentials.identifier },
                            { username: credentials.identifier },
                            { profile: { phone: credentials.identifier } }
                        ]
                    },
                    include: { profile: true }
                });

                if (!user || !user.password) {
                    throw new Error("Invalid credentials");
                }

                if (user.status === 'ARCHIVED') {
                    throw new Error("Account archived");
                }

                const isValid = await verifyPassword(credentials.password, user.password);
                if (!isValid) {
                    throw new Error("Invalid credentials");
                }

                const result = {
                    id: user.id,
                    name: user.username,
                    email: user.email,
                    image: user.profile?.avatarUrl,
                    role: user.role,
                    profile: user.profile // Add profile data
                };

                return result;
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user, account }: { token: any; user: any; account: any }) {
            // Debug Log


            if (account) {
                token.accessToken = account.access_token;
            }
            if (user) {
                token.sub = user.id;
                token.role = user.role;
                token.profile = user.profile; // Persist profile to token

                // Fallback accessToken for Credentials provider if not present
                if (!token.accessToken) {
                    token.accessToken = 'session-' + user.id;
                }
            }
            return token;
        },
        async session({ session, token }: { session: any; token: any }) {
            // Debug Log


            session.accessToken = token.accessToken;
            if (token.sub) {
                session.user.id = token.sub;
                session.user.role = token.role;
                session.user.profile = token.profile; // Pass profile to session
            }
            return session;
        },
    },
};

// --- Auth Utils (Restored) ---
import bcrypt from 'bcryptjs';
// uuid removed as not used

// Or just basic random string.
// Wait, prisma Session model uses @default(uuid()) for ID. 
// But createSession(userId) needs to generate a token?
// login route uses: session.token.
// Let's import prisma from lib/prisma.

import prisma from "@/lib/prisma";
import crypto from 'crypto';

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
}

export async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
}

export async function createSession(userId: string) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiration

    const session = await prisma.session.create({
        data: {
            userId,
            token,
            expiresAt
        }
    });

    return session;
}
