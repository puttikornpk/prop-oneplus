import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const q = searchParams.get('q');
        const role = searchParams.get('role');
        const status = searchParams.get('status');


        const where: any = {};

        if (status) {
            const dbStatus = status === 'Inactive' ? 'ARCHIVED' : 'ACTIVE';
            where.status = dbStatus;
        }

        if (q) {
            where.OR = [
                { email: { contains: q, mode: 'insensitive' } },
                { profile: { firstName: { contains: q, mode: 'insensitive' } } },
                { profile: { lastName: { contains: q, mode: 'insensitive' } } },
                // Also search "firstName lastName" combined? messy in prisma, simpler to stick to fields
            ];
        }

        if (role && (role === 'ADMIN' || role === 'USER')) {
            where.role = role;
        }

        const sort = searchParams.get('sort'); // 'name' | 'lastLogin'
        const order = searchParams.get('order') === 'ask' ? 'asc' : 'desc'; // Default desc usually better for lists, but standard toggle is asc/desc
        // Actually for lists, often default is newest first (desc). 
        // Let's standardise: if order is provided use it, else default logic.
        // Frontend sends 'asc' or 'desc'.

        const prismaOrder: any = searchParams.get('order') === 'asc' ? 'asc' : 'desc';

        let orderBy: any = { createdAt: 'desc' }; // Default

        if (sort === 'name') {
            orderBy = [
                { profile: { firstName: prismaOrder } },
                { profile: { lastName: prismaOrder } }
            ];
        } else if (sort === 'lastLogin') {
            orderBy = { updatedAt: prismaOrder };
        }

        const users = await prisma.user.findMany({
            where,
            include: {
                profile: true,
                _count: { select: { sessions: true } }
            },
            orderBy
        });

        // Formatting for frontend
        const formattedUsers = users.map(user => ({
            id: user.id,
            name: user.profile ? `${user.profile.firstName || ''} ${user.profile.lastName || ''}`.trim() : 'No Name',
            email: user.email,
            role: user.role,
            status: user.status === 'ARCHIVED' ? 'Inactive' : 'Active',
            lastLogin: user.updatedAt.toISOString(), // simplified
            joinedAt: user.createdAt,
            profile: user.profile
        }));

        return NextResponse.json(formattedUsers);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, role, firstName, lastName, phone, address } = body;

        // Basic validation
        if (!email || !password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if user exists
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ error: 'User already exists' }, { status: 409 });
        }

        const hashedPassword = await hashPassword(password);

        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: role || 'USER',
                profile: {
                    create: {
                        firstName,
                        lastName,
                        phone,
                        address
                    }
                }
            }
        });

        return NextResponse.json(newUser);

    } catch (error: any) {
        console.error("Create User Error Detailed:", error);
        return NextResponse.json({ error: error.message || 'Failed to create user' }, { status: 500 });
    }
}
