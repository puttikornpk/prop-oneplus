const identifier = "test_deletion_user";
const password = "password123"; // Replace with actual password

async function testLogin() {
    try {
        console.log(`Testing login for: ${identifier}`);
        // Ensure the server is running on localhost:3000
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ identifier, password })
        });

        const data = await response.json();

        console.log('Response Status:', response.status);
        console.log('Response Data:', data);

        if (response.ok) {
            console.log('✅ Login Successful');
            // "Real db connect status" - implicit by successful login
        } else {
            console.log('❌ Login Failed');
        }

    } catch (error) {
        console.error('Error during login test:', error);
    }
}

testLogin();
