import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyPassword, createSession } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { identifier, password } = body;

        if (!identifier || !password) {
            return NextResponse.json(
                { error: "Missing identifier or password" },
                { status: 400 }
            );
        }

        // Search for user by email, phone, or firstName (username)
        // Note: Prisma OR with nested relations (profile)
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { profile: { phone: identifier } },
                    { profile: { firstName: identifier } }
                ]
            },
            include: {
                profile: true
            }
        });

        if (!user) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        if (user.status === 'ARCHIVED') {
            return NextResponse.json(
                { error: "Your account has been archived. Please contact support." },
                { status: 403 }
            );
        }

        // Verify Password
        const isValid = await verifyPassword(password, user.password);
        if (!isValid) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Create Session
        const session = await createSession(user.id);

        // Update Last Login (updatedAt)
        await prisma.user.update({
            where: { id: user.id },
            data: { updatedAt: new Date() } // Forces update
        });

        // Return user info (excluding password) and session token
        // In a real app, we might set an HTTP-only cookie here. 
        // For simplicity/current context, we'll return the token and let frontend handle it (e.g. localStorage or cookie wrapper).
        // Best practice likely cookie, but let's stick to simple return for now unless auth.ts handles cookies (it returned prisma object).

        const { password: _, ...userWithoutPassword } = user;

        const response = NextResponse.json({
            user: userWithoutPassword,
            token: session.token,
            expiresAt: session.expiresAt
        });

        response.cookies.set({
            name: 'token',
            value: session.token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            expires: session.expiresAt,
        });

        return response;

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
