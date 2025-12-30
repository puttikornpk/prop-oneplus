
async function testCallbackReachability() {
    const fetch = (await import('node-fetch')).default;
    const url = 'http://localhost:3000/api/auth/callback/facebook';

    console.log(`Testing reachability for: ${url}`);

    try {
        // We expect this to fail/redirect because we don't have a valid OAuth 'code'
        // But we want to ensure it DOES NOT return 404.
        const res = await fetch(url, {
            redirect: 'manual' // Don't follow redirects automatically
        });

        console.log(`Response Status: ${res.status}`);
        console.log(`Response Headers:`, res.headers.raw());

        if (res.status === 404) {
            console.error('❌ Error: Route not found (404). Check API folder structure.');
        } else if (res.status === 302 || res.status === 307) {
            // NextAuth often redirects to /api/auth/error?error=Callback... when params are missing
            const location = res.headers.get('location');
            console.log(`✅ Success: Route exists. Redirecting to: ${location}`);
            console.log('   (This is expected because we provided no valid OAuth code)');
        } else if (res.status >= 400 && res.status < 500) {
            // Some providers might return 400 if params are missing
            console.log('✅ Success: Route exists (returned client error as expected without params).');
        } else if (res.status === 200) {
            const text = await res.text();
            console.log('✅ Success: Route responded with 200.');
            // It might be rendering an error page directly
        } else {
            console.log(`⚠️ received unexpected status: ${res.status}`);
        }

    } catch (e) {
        console.error('❌ Connection Failed:', e.message);
    }
}

testCallbackReachability();
