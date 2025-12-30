import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createSession } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, name, image, facebookId } = body;

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // 1. Find or Create User
        let user = await prisma.user.findUnique({
            where: { email },
            include: { profile: true }
        });

        if (!user) {
            // Create new user
            // Password is null/optional now
            // Generate a random username if not provided
            let username = email.split('@')[0];
            // Ensure username uniqueness
            let suffix = 1;
            while (await prisma.user.findUnique({ where: { username } })) {
                username = `${email.split('@')[0]}${suffix}`;
                suffix++;
            }

            user = await prisma.user.create({
                data: {
                    email,
                    username,
                    // facebookId is optional in schema, so we can pass it if it exists
                    facebookId: facebookId || null,
                    role: 'USER',
                    status: 'ACTIVE',
                    isVerified: true, // Auto-verify social users
                    profile: {
                        create: {
                            firstName: name || username,
                            avatarUrl: image || ""
                        }
                    }
                },
                include: { profile: true }
            });
        }

        // Updating user if exists
        const updateData: any = {};
        if (user && !user.isVerified) updateData.isVerified = true;
        // If we have a facebookId but the user doesn't have one stored, update it.
        // @ts-ignore - Ignoring TS error as generated client might lag behind
        if (user && !user.facebookId && facebookId) updateData.facebookId = facebookId;

        if (user && Object.keys(updateData).length > 0) {
            user = await prisma.user.update({
                where: { id: user.id },
                data: updateData,
                include: { profile: true }
            });
        }

        // Return error if user creation failed somehow (shouldn't happen with logic above)
        if (!user) {
            return NextResponse.json({ error: "Failed to create or find user" }, { status: 500 });
        }

        // 2. Create System Session
        const session = await createSession(user.id);

        // 3. Return Token
        // @ts-ignore
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json({
            user: userWithoutPassword,
            token: session.token,
            expiresAt: session.expiresAt
        });

    } catch (error) {
        console.error("Social sync error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
