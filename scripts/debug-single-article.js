const fs = require('fs');

const BASE_URL = 'http://127.0.0.1:8000';
// Use a slug known to exist from previous cache
// Use a slug likely to exist (e.g. from subjects)
const TEST_SLUG = 'business-and-management'; // I remember seeing this in the log for cache-subjects


const CREDENTIALS = {
    email: "api@user.com",
    password: "Amin770904030123*"
};

async function debugSingleArticle() {
    console.log(`--- Debugging Single Article Endpoint for: ${TEST_SLUG} ---`);

    // Authenticate
    let token = null;
    try {
        const res = await fetch(`${BASE_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(CREDENTIALS)
        });
        if (res.ok) {
            const data = await res.json();
            token = data.token || data.access_token;
            console.log("Auth Successful. Token:", token ? "Yes" : "No");
        } else {
            console.log("Auth Failed:", res.status);
        }
    } catch (e) {
        console.error("Auth Error:", e.message);
    }

    const headers = { 'Accept': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const endpoints = [
        `/api/articles/${TEST_SLUG}`,
        `/articles/${TEST_SLUG}`
    ];

    for (const endpoint of endpoints) {
        const url = `${BASE_URL}${endpoint}`;
        console.log(`\nFetching: ${url}`);
        try {
            const res = await fetch(url, { headers });

            console.log(`Status: ${res.status} ${res.statusText}`);
            if (res.ok) {
                const text = await res.text();
                const filename = `debug-single-article-${endpoint.replace(/\//g, '_')}.html`;
                fs.writeFileSync(filename, text);
                console.log(`Saved response to ${filename}`);
                console.log("Preview:", text.substring(0, 500));
            } else {
                console.log("Failed.");
            }
        } catch (e) {
            console.error('Fetch Error:', e.message);
        }
    }
}

debugSingleArticle();
