const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = 'puttikorn@live.com';

    try {
        console.log(`Searching for user with email: ${email}...`);

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            console.log(`❌ User not found: ${email}`);
            return;
        }

        console.log(`Found user: ${user.username || user.email} (Current Role: ${user.role})`);

        const updatedUser = await prisma.user.update({
            where: { email },
            data: { role: 'ADMIN' },
        });

        console.log(`✅ User updated successfully!`);
        console.log(`New Role: ${updatedUser.role}`);

    } catch (e) {
        console.error("❌ Error updating user:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
