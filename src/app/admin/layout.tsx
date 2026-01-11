import { redirect } from 'next/navigation';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Server-Side Route Protection using NextAuth
    const session = await getServerSession(authOptions);

    // DEBUG: Log session
    console.log("Admin Layout Session:", session ? `User: ${session.user?.email}` : "No Session");

    if (!session) {
        redirect('/?admin_error=no_session');
    }

    // Role Check
    // Type casting might be needed if ‘role’ isn’t on default Session type
    const userRole = (session.user as any).role;

    if (userRole !== 'ADMIN') {
        redirect(`/?admin_error=role_mismatch&role=${userRole}&email=${session.user?.email}`);
    }

    return (
        <AdminLayoutClient user={session.user}>
            {children}
        </AdminLayoutClient>
    );
}
