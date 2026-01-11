const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs'); // Import bcrypt
const prisma = new PrismaClient();

async function createTestUser() {
    const userId = "admin2";
    const email = "puttikorn@live.com";
    const passwordRaw = "p123";
    const hashedPassword = await bcrypt.hash(passwordRaw, 12);

    try {
        // Clean up first
        // await prisma.user.deleteMany({
        //     where: {
        //         OR: [
        //             { facebookId: userId },
        //             { email: email }
        //         ]
        //     }
        // });

        const user = await prisma.user.create({
            data: {
                email: email,
                username: userId,
                //facebookId: userId,
                role: "ADMIN",
                status: 'ACTIVE',
                password: hashedPassword,
                profile: {
                    create: {
                        firstName: "Admin",
                        lastName: "Super",
                    }
                }
            }
        });
        console.log("Created test user:", user.id);
    } catch (e) {
        console.error("Error creating test user:", e);
    } finally {
        await prisma.$disconnect();
    }
}

createTestUser();
