const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Checking Admin Users...');
    const admins = await prisma.user.findMany({
        where: { role: 'ADMIN' },
        select: { id: true, username: true, email: true, role: true, status: true }
    });

    if (admins.length === 0) {
        console.log('No ADMIN users found!');
    } else {
        console.table(admins);
    }

    console.log('\nChecking Recent Sessions...');
    const sessions = await prisma.session.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { email: true, role: true } } }
    });
    console.table(sessions.map(s => ({
        token: s.token.substring(0, 10) + '...',
        user: s.user.email,
        role: s.user.role,
        expires: s.expiresAt
    })));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
