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
            // Check if we need to send a new code (e.g., if expired or not present)
            // For simplicity, always resend or reuse valid code.
            // Let's generate a new one to be safe and "fresh".

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
