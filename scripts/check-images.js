const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Checking Property Images...');
    const properties = await prisma.property.findMany({
        take: 5,
        include: { images: true },
        orderBy: { createdAt: 'desc' }
    });

    properties.forEach(p => {
        console.log(`Property: ${p.title} (ID: ${p.id})`);
        if (p.images.length === 0) {
            console.log('  No images');
        } else {
            p.images.forEach(img => {
                console.log(`  - Image URL: ${img.url}`);
            });
        }
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
