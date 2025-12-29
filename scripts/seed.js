const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    try {
        console.log("🌱 Starting seed...");

        // 1. Create default Admin User
        const adminEmail = 'admin@property-plus.com';
        const hashedPassword = await bcrypt.hash('admin1234', 10);

        const admin = await prisma.user.upsert({
            where: { email: adminEmail },
            update: {}, // If exists, do nothing (or update password if needed)
            create: {
                email: adminEmail,
                username: 'admin',
                password: hashedPassword,
                role: 'ADMIN',
                isVerified: true,
                status: 'ACTIVE',
                profile: {
                    create: {
                        firstName: 'Admin',
                        lastName: 'User',
                        phone: '000-000-0000',
                    }
                }
            },
        });

        console.log(`✅ Admin user upserted: ${admin.email} (Password: admin1234)`);

        // You can add more seed data here if needed (e.g. Properties)

        console.log("🚀 Seeding finished.");
    } catch (e) {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
