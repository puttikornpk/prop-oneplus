
const crypto = require('crypto');
require('dotenv').config({ path: '.env' });

async function testDeletionCallback() {
    const fetch = (await import('node-fetch')).default;

    const secret = process.env.FACEBOOK_CLIENT_SECRET;
    if (!secret) {
        console.error("Error: FACEBOOK_CLIENT_SECRET is missing in .env");
        process.exit(1);
    }

    const userId = "1234567890_TEST_USER"; // Mock Facebook User ID

    // 1. Prepare Payload
    const payload = {
        user_id: userId,
        algorithm: 'HMAC-SHA256',
        issued_at: Math.floor(Date.now() / 1000)
    };
    const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

    // 2. Sign Payload using Secret
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payloadStr);
    const sig = hmac.digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

    const signedRequest = `${sig}.${payloadStr}`;

    console.log("---------------------------------------------------");
    console.log("Testing Facebook Data Deletion Callback");
    console.log("Target User ID (FB):", userId);
    console.log("---------------------------------------------------");

    // 3. Make POST Request
    // Note: Use FormData format as Facebook sends it
    const params = new URLSearchParams();
    params.append('signed_request', signedRequest);

    try {
        const res = await fetch('http://localhost:3000/api/auth/facebook/data-deletion', {
            method: 'POST',
            body: params
        });

        const data = await res.json();

        console.log("Response Status:", res.status);
        console.log("Response Body:", JSON.stringify(data, null, 2));

        if (res.status === 200 && data.url && data.confirmation_code) {
            console.log("---------------------------------------------------");
            console.log("✅ REQUEST SUCCESSFUL");
            console.log("Confirmation Code:", data.confirmation_code);
            console.log("Status URL:", data.url);
            console.log("---------------------------------------------------");
            console.log("👉 Please verify the 'Status URL' in your browser.");
            console.log("👉 Also check the database to see if the user with facebookId '" + userId + "' is now ARCHIVED.");
        } else {
            console.log("❌ TEST FAILED");
        }

    } catch (e) {
        console.error("Request Failed:", e);
    }
}

testDeletionCallback();
