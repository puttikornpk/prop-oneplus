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

    // DEBUG: Log all cookies
    console.log("Admin Layout Cookies:", cookieStore.getAll().map(c => c.name));

    const token = cookieStore.get('token')?.value;

    if (!token) {
        redirect('/?admin_error=no_token');
    }

    let session = null;
    try {
        session = await prisma.session.findUnique({
            where: { token },
            include: { user: { include: { profile: true } } },
        });
    } catch (error) {
        console.error("Admin Layout DB Error:", error);
        redirect('/?admin_error=db_error');
    }

    if (!session || session.expiresAt < new Date()) {
        redirect('/?admin_error=invalid_session');
    }

    if (session.user.role !== 'ADMIN') {
        redirect(`/?admin_error=role_mismatch&role=${session.user.role}&email=${session.user.email}`);
    }

    return (
        <AdminLayoutClient user={session.user}>
            {children}
        </AdminLayoutClient>
    );
}
