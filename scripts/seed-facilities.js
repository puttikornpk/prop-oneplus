
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const facilities = [
        { name: 'EV Charger', type: 'FACILITY' },
        { name: 'Wi-Fi', type: 'FACILITY' },
        { name: 'ที่จอดรถ', type: 'FACILITY' },
        { name: 'สระว่ายน้ำ', type: 'FACILITY' }
    ];

    console.log('Seeding Facilities...');

    for (const fac of facilities) {
        const exists = await prisma.facility.findFirst({
            where: { name: fac.name, type: fac.type }
        });

        if (!exists) {
            await prisma.facility.create({
                data: fac
            });
            console.log(`Created: ${fac.name}`);
        } else {
            console.log(`Skipped (Exists): ${fac.name}`);
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
