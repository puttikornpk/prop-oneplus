
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        include: { profile: true }
    });
    console.log("Found " + users.length + " users:");
    users.forEach(u => {
        console.log(`User: ${u.username} | Email: ${u.email} | Hash: ${u.password?.substring(0, 15)}...`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
