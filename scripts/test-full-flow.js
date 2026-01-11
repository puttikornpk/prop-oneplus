
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testFlow() {
    const fetch = (await import('node-fetch')).default;
    const baseUrl = 'http://localhost:3000/api/auth';
    const timestamp = Math.floor(Date.now() / 1000);
    const username = `flowuser_${timestamp}`;
    const email = `flow_${timestamp}@live.com`;
    const password = 'password123';

    console.log(`Testing flow for: ${username}`);

    try {
        // 1. Register
        console.log('1. Registering...');
        const regRes = await fetch(`${baseUrl}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, phone: '0812345678' })
        });
        const regData = await regRes.json();
        console.log('Register Status:', regRes.status, regData);

        if (regRes.status !== 201) throw new Error('Registration failed');

        // 2. Get OTP from DB
        console.log('2. Fetching OTP from DB...');
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) throw new Error('User not found in DB');
        console.log('OTP:', user.activationCode);

        // 3. Initiate Login (Simulation of UI step 1) -> Should trigger ACTIVATION_REQUIRED
        console.log('3. Initiating Login...');
        const initRes = await fetch(`${baseUrl}/initiate-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier: username })
        });
        const initData = await initRes.json();
        console.log('Initiate Login Status:', initRes.status, initData);

        // NOTE: initiate-login should NOT regenerate the code now if it's valid.
        const userRefreshed = await prisma.user.findUnique({ where: { email } });
        console.log('Original OTP:', user.activationCode);
        console.log('Current OTP:', userRefreshed.activationCode);

        if (user.activationCode !== userRefreshed.activationCode) {
            console.warn('⚠️ WARNING: OTP changed! Dual email might still occur.');
        } else {
            console.log('✅ OTP persisted. No duplicate email sent.');
        }

        // 4. Verify OTP
        console.log('4. Verifying OTP...');
        const verifyRes = await fetch(`${baseUrl}/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier: username, code: userRefreshed.activationCode })
        });
        const verifyData = await verifyRes.json();
        console.log('Verify Status:', verifyRes.status, verifyData);

        if (verifyRes.status !== 200) throw new Error('Verification failed');

        // 5. Login (Password)
        console.log('5. Logging in with Password...');
        const loginRes = await fetch(`${baseUrl}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier: username, password })
        });
        const loginData = await loginRes.json();
        console.log('Login Status:', loginRes.status, loginData.token ? 'Has Token' : 'No Token');

        if (loginRes.status === 200 && loginData.token) {
            console.log('✅ FULL FLOW SUCCESS');
        } else {
            console.log('❌ LOGIN FAILED');
        }

    } catch (e) {
        console.error('❌ TEST FAILED:', e);
    } finally {
        await prisma.$disconnect();
    }
}

testFlow();
