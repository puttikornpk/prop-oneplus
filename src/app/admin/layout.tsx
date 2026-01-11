import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Server-Side Route Protection
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        redirect('/');
    }

    let session = null;
    try {
        session = await prisma.session.findUnique({
            where: { token },
            include: { user: { include: { profile: true } } },
        });
    } catch (error) {
        console.error("Admin Layout DB Error:", error);
        redirect('/'); // Or to an error page
    }

    if (!session || session.expiresAt < new Date()) {
        redirect('/');
    }

    if (session.user.role !== 'ADMIN') {
        redirect('/');
    }

    return (
        <AdminLayoutClient user={session.user}>
            {children}
        </AdminLayoutClient>
    );
}
