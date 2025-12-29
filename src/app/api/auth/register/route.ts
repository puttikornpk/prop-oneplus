import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password, username, phone } = body;

        // Validation
        if (!email || !password || !username) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Check if user exists (email or username)
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { username }
                ]
            },
        });

        if (existingUser) {
            if (existingUser.email === email) {
                return NextResponse.json(
                    { error: "User with this email already exists" },
                    { status: 409 }
                );
            }
            if (existingUser.username === username) {
                return NextResponse.json(
                    { error: "Username is already taken" },
                    { status: 409 }
                );
            }
        }

        // Create User
        const hashedPassword = await hashPassword(password);

        // Generate Activation Code (6 digits)
        const activationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const activationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // console.log("MOCK EMAIL SENT TO " + email + " WITH CODE: " + activationCode);

        const user = await prisma.user.create({
            data: {
                email,
                username, // Save username unique field
                password: hashedPassword,
                role: 'USER',
                isVerified: false,
                activationCode,
                activationExpires,
                profile: {
                    create: {
                        firstName: username,
                        phone: phone || "",
                    }
                }
            },
            include: {
                profile: true
            }
        });

        // Send Email
        await sendVerificationEmail(email, username, activationCode);
        console.log(`[DEV-Log] Verification Code for ${email}: ${activationCode}`);

        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json(userWithoutPassword, { status: 201 });

    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
