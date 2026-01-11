const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = 'email@temp.com';

    try {
        console.log(`Searching for user with email: ${email}...`);

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
