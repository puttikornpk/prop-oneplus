
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUser() {
    try {
        const users = await prisma.user.findMany({
            take: 10,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                profile: true
            }
        });

        if (users.length > 0) {
            console.log('Found users:', users.length);
            users.forEach(user => {
                console.log('--------------------------------');
                console.log('Email:', user.email);
                console.log('Username:', user.username);
                console.log('Phone:', user.profile?.phone);
                console.log('Role:', user.role);
            });
        } else {
            console.log('No users found in database.');
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkUser();
