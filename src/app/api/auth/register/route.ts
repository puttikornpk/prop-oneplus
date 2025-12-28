import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

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

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 409 }
            );
        }

        // Create User
        const hashedPassword = await hashPassword(password);

        // Assumption: 'username' maps to 'firstName' based on UI "ชื่อผู้ใช้". 
        // We'll split it if needed, or just put it in firstName. 
        // Given the UI shows single field, treating it as firstName seems appropriate or firstName alias.

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: 'USER',
                profile: {
                    create: {
                        firstName: username,
                        // lastName: "", // Optional
                        phone: phone || "",
                        // Setup default avatar or other fields if needed
                    }
                }
            },
            include: {
                profile: true
            }
        });

        // We could create a session here and login immediately, 
        // but let's stick to standard flow: Register -> Login (or return success).
        // Returning user info (without password)

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
