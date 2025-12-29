import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createSession } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const { identifier, code } = await req.json();

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { username: identifier },
                    { profile: { phone: identifier } }
                ]
            }
        });

        if (!user) {
            console.log(`[Verify-OTP] User not found for identifier: ${identifier}`);
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (user.isVerified) {
            return NextResponse.json({ error: "Account already verified. Please login." }, { status: 409 });
        }

        if (user.activationCode !== code) {
            console.log(`[Verify-OTP] Invalid Code. User: ${user.email}, Expected: ${user.activationCode}, Received: ${code}`);
            return NextResponse.json({ error: "Invalid activation code" }, { status: 400 });
        }

        // Check expiry
        if (user.activationExpires && new Date() > user.activationExpires) {
            return NextResponse.json({ error: "Activation code expired" }, { status: 400 });
        }

        // Verify
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                isVerified: true,
                activationCode: null,
                activationExpires: null,
                updatedAt: new Date()
            },
            include: { profile: true }
        });

        // Create Session
        const session = await createSession(user.id);

        const { password: _, ...userWithoutPassword } = updatedUser;

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
        console.error("Verify OTP Error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
