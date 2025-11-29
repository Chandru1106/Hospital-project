const API_URL = 'http://localhost:5000/api';
const EMAIL = 'rickychandru6@gmail.com';
const PASSWORD = 'password123';

async function verifyBackend() {
    try {
        // 1. Login
        console.log('Logging in...');
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: EMAIL, password: PASSWORD })
        });

        if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.statusText}`);
        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log('Login successful. Token received.');

        // 2. Fetch Health Records
        console.log('Fetching health records...');
        const recordsRes = await fetch(`${API_URL}/health/records`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!recordsRes.ok) throw new Error(`Fetch records failed: ${recordsRes.statusText}`);
        const recordsData = await recordsRes.json();
        console.log('Health Records:', recordsData);

        // 3. Fetch Statistics
        console.log('Fetching statistics...');
        const statsRes = await fetch(`${API_URL}/health/statistics`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!statsRes.ok) throw new Error(`Fetch statistics failed: ${statsRes.statusText}`);
        const statsData = await statsRes.json();
        console.log('Statistics:', statsData);

    } catch (error) {
        console.error('Verification failed:', error.message);
    }
}

verifyBackend();
