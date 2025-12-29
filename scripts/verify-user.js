const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Verifying User Registration...");
        const email = "puttikorn.la@gmail.com"; // Matches default in form
        const users = await prisma.user.findMany();
        console.log("All users:", JSON.stringify(users, null, 2));

        if (users.length > 0) {
            console.log(`✅ Found ${users.length} users.`);
        } else {
            console.log("❌ No users found.");
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
