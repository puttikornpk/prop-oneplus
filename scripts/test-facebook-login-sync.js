
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testFacebookSync() {
    const fetch = (await import('node-fetch')).default;
    const baseUrl = 'http://localhost:3000/api/auth/social-sync';

    // Mock data mimicking what NextAuth returns after Facebook Login
    const mockFacebookUser = {
        name: "puttikorn",
        email: `fb_test_${Math.floor(Date.now() / 1000)}@live.com`,
        image: "https://graph.facebook.com/12345/picture",
    };

    console.log(`🚀 Testing Facebook Social Sync for: ${mockFacebookUser.email}`);

    try {
        // 1. Call Social Sync API
        console.log('1. Calling /api/auth/social-sync ...');
        const res = await fetch(baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...mockFacebookUser, // Spread user properties (email, name, image)
                facebookId: `fb_id_${Math.floor(Date.now() / 1000)}`, // Randomize facebookId
                trigger: 'manual_test'
            })
        });

        const data = await res.json();
        console.log('API Response:', res.status, data);

        if (res.status !== 200) {
            throw new Error(`API failed: ${JSON.stringify(data)}`);
        }

        // 2. Verify User in Database
        console.log('2. Verifying User in Database...');
        const user = await prisma.user.findUnique({
            where: { email: mockFacebookUser.email },
            include: { profile: true }
        });

        if (!user) {
            throw new Error('❌ User was not created in database check!');
        }

        console.log('✅ User Found:', user.id);
        console.log('   - Email:', user.email);
        console.log('   - Username:', user.username);
        console.log('   - Role:', user.role);
        console.log('   - Is Verified:', user.isVerified); // Should be true for social login
        console.log('   - Profile Name:', user.profile.firstName);
        console.log('   - Avatar:', user.profile.avatarUrl);

        if (user.isVerified !== true) {
            console.warn('⚠️ WARNING: User should be verified (social login), but isVerified is false.');
        } else {
            console.log('✅ Verification Status Correct (true)');
        }

    } catch (e) {
        console.error('❌ TEST FAILED:', e);
    } finally {
        await prisma.$disconnect();
    }
}

testFacebookSync();
