import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        // In a real app, verify admin session here.

        // Execute queries in parallel
        const [userCount, activeSessions, adminCount] = await Promise.all([
            prisma.user.count(),
            prisma.session.count({
                where: { expiresAt: { gt: new Date() } }
            }),
            prisma.user.count({
                where: { role: 'ADMIN' }
            })
        ]);

        // Calculate "New Today" (users created > start of today)
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const newUsersToday = await prisma.user.count({
            where: { createdAt: { gte: startOfDay } }
        });

        return NextResponse.json({
            totalUsers: userCount,
            activeSessions: activeSessions,
            newUsersToday: newUsersToday,
            admins: adminCount
        });
    } catch (error) {
        console.error('Stats API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
