
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const facilities = await prisma.facility.findMany();
        console.log('All Facilities:', facilities.map(f => `${f.id}: ${f.type} - ${f.name}`));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
