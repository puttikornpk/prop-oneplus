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

    const session = await prisma.session.findUnique({
        where: { token },
        include: { user: { include: { profile: true } } }, // Include profile for name/avatar
    });

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
