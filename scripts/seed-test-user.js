const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTestUser() {
    const userId = "1234567890_TEST_USER";
    const email = "test_deletion@example.com";

    try {
        // Clean up first
        await prisma.user.deleteMany({
            where: {
                OR: [
                    { facebookId: userId },
                    { email: email }
                ]
            }
        });

        const user = await prisma.user.create({
            data: {
                email: email,
                username: "test_deletion_user",
                facebookId: userId,
                status: 'ACTIVE',
                password: 'dummy_password', // Providing dummy password if required logic checks it, though schema allows null
                profile: {
                    create: {
                        firstName: "Deletion",
                        lastName: "Test",
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
