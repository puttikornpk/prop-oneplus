const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Verifying User Registration...");
        const email = "puttikorn@live.com"; // Matches default in form
        const user = await prisma.user.findUnique({
            where: { email },
            include: { profile: true }
        });

        if (user) {
            console.log("✅ User found:");
            console.log(`- ID: ${user.id}`);
            console.log(`- Email: ${user.email}`);
            console.log(`- Role: ${user.role}`);
            console.log(`- Profile Name: ${user.profile?.firstName} ${user.profile?.lastName || ''}`);
            console.log(`- Phone: ${user.profile?.phone}`);
        } else {
            console.log(`❌ User with email ${email} NOT found.`);
            console.log("Please manually test the registration form on the frontend first.");
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
