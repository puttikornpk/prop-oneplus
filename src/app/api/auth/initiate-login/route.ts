import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: Request) {
    try {
        const { identifier } = await req.json();

        if (!identifier) {
            return NextResponse.json({ error: "Missing identifier" }, { status: 400 });
        }

        // Find user by email, username, or phone (in profile)
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
            // User not found, proceed to password step (will fail there)
            return NextResponse.json({ status: 'OK' });
        }

        if (user.status === 'ARCHIVED') {
            return NextResponse.json(
                { error: "Your account has been archived. Please contact support." },
                { status: 403 }
            );
        }


        if (!user.isVerified) {
            // Check if existing code is still valid (prevent double email on first login)
            if (user.activationCode && user.activationExpires && user.activationExpires > new Date()) {
                return NextResponse.json({
                    status: 'ACTIVATION_REQUIRED',
                    email: user.email
                });
            }

            const activationCode = Math.floor(100000 + Math.random() * 900000).toString();
            const activationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

            await prisma.user.update({
                where: { id: user.id },
                data: { activationCode, activationExpires }
            });

            console.log(`[DEV-Log] Resending Verification Code for ${user.email}: ${activationCode}`);
            await sendVerificationEmail(user.email, user.username || user.email, activationCode);

            return NextResponse.json({
                status: 'ACTIVATION_REQUIRED',
                email: user.email
            });
        }

        return NextResponse.json({ status: 'OK' });

    } catch (error) {
        console.error("Initiate Login Error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
