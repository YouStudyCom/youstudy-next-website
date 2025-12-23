const fs = require('fs');

const BASE_URL = 'http://127.0.0.1:8000';
// Try one relevant slug from the cache we saw earlier
const TEST_SLUG = 'study-in-uk';

async function debugArticlesEndpoint() {
    console.log(`--- Debugging Articles Endpoint for slug: ${TEST_SLUG} ---`);
    const endpoint = `/api/destinations/${TEST_SLUG}/articles`;
    const url = `${BASE_URL}${endpoint}`;

    console.log(`Fetching: ${url}`);
    try {
        const res = await fetch(url, {
            headers: { 'Accept': 'application/json' }
        });

        console.log(`Status: ${res.status} ${res.statusText}`);
        const text = await res.text();

        fs.writeFileSync('debug-articles-response.html', text);
        console.log('Saved response to debug-articles-response.html');

        if (res.ok) {
            console.log("Response Body Preview:");
            console.log(text.substring(0, 500));
        }

    } catch (e) {
        console.error('Fetch Error:', e.message);
    }
}

debugArticlesEndpoint();
