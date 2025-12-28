import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const id = params.id;
        const body = await request.json();
        const { firstName, lastName, phone, address, email, role } = body;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id },
            include: { profile: true }
        });

        if (!existingUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Update User and Profile
        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                email, // allow email update if needed, add uniqueness check if critical
                role,
                profile: {
                    upsert: {
                        create: {
                            firstName,
                            lastName,
                            phone,
                            address
                        },
                        update: {
                            firstName,
                            lastName,
                            phone,
                            address
                        }
                    }
                }
            },
            include: {
                profile: true
            }
        });

        return NextResponse.json(updatedUser);

    } catch (error: any) {
        console.error("Update User Error:", error);
        return NextResponse.json({ error: error.message || 'Failed to update user' }, { status: 500 });
    }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const id = params.id;
        await prisma.user.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Delete User Error:", error);
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}
