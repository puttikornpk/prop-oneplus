import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const start = Date.now();

        // 1. Total Users
        const totalUsers = await prisma.user.count();

        // 2. Active Sessions (Not expired)
        const activeSessions = await prisma.session.count({
            where: {
                expiresAt: {
                    gt: new Date()
                }
            }
        });

        // 3. New Users Today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const newUsersToday = await prisma.user.count({
            where: {
                createdAt: {
                    gte: today
                }
            }
        });

        // 4. Admins
        const admins = await prisma.user.count({
            where: {
                role: 'ADMIN'
            }
        });

        // 5. Recent Activity (Latest 5 sessions/logins)
        const recentActivity = await prisma.session.findMany({
            take: 5,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                user: {
                    include: {
                        profile: true
                    }
                }
            }
        });

        // Calculate API Latency
        const latency = Date.now() - start;

        return NextResponse.json({
            stats: {
                totalUsers,
                activeSessions,
                newUsersToday,
                admins
            },
            recentActivity,
            systemStatus: {
                database: 'Connected',
                latency
            }
        });

    } catch (error) {
        console.error("Dashboard API Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
