
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUser() {
    try {
        const user = await prisma.user.findFirst({
            where: {
                username: {
                    startsWith: 'testuser_'
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                profile: true
            }
        });

        if (user) {
            console.log('User found:', user.email);
            console.log('Username:', user.username);
            console.log('Activation Code:', user.activationCode);
            console.log('Is Verified:', user.isVerified);
        } else {
            console.log('No test user found.');
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkUser();
