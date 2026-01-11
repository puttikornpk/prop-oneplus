const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const identifier = 'puttikorn@live.com';
    console.log(`Searching for users matching identifier: "${identifier}"`);

    const users = await prisma.user.findMany({
        where: {
            OR: [
                { email: identifier },
                { username: identifier },
                { profile: { phone: identifier } }
            ]
        },
        include: { profile: true }
    });

    console.log(`Found ${users.length} matching user(s):`);
    users.forEach(u => {
        console.log('------------------------------------------------');
        console.log(`ID:       ${u.id}`);
        console.log(`Email:    ${u.email} ${u.email === identifier ? '(MATCH)' : ''}`);
        console.log(`Username: ${u.username} ${u.username === identifier ? '(MATCH)' : ''}`);
        console.log(`Phone:    ${u.profile?.phone} ${u.profile?.phone === identifier ? '(MATCH)' : ''}`);
        console.log(`Role:     ${u.role}`);
        console.log(`Status:   ${u.status}`);
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
