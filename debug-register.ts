
import { PrismaClient } from '@prisma/client';
import { hashPassword } from './src/lib/auth'; // Ensure this path works with npx tsx

const prisma = new PrismaClient();

async function main() {
    console.log("Starting debug registration...");

    // Mock data
    const email = "debug_test_" + Date.now() + "@example.com";
    const username = "debug_user_" + Date.now();
    const password = "password123";
    const phone = "0999999999";

    console.log(`Trying to register: ${email} / ${username}`);

    try {
        // 1. Hash Password
        console.log("Hashing password...");
        const hashedPassword = await hashPassword(password);
        console.log("Hashed password length: " + hashedPassword.length);

        // 2. Create User
        console.log("Creating user in DB...");
        const user = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
                role: 'USER',
                isVerified: false,
                activationCode: '123456',
                activationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                profile: {
                    create: {
                        firstName: username,
                        phone: phone,
                    }
                }
            },
            include: {
                profile: true
            }
        });
        console.log("User created successfully with ID: " + user.id);

    } catch (error) {
        console.error("ERROR CAUGHT IN DEBUG SCRIPT:");
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
