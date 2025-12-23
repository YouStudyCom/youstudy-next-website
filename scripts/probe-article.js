const fs = require('fs');

const BASE_URL = 'http://127.0.0.1:8000';
// A known valid slug from the list cache
const TEST_SLUG = 'how-to-choose-your-destination-of-study-in-the-uk';

async function probe() {
    console.log(`--- Probing Article Endpoint for: ${TEST_SLUG} ---`);
    console.log(`Target Base: ${BASE_URL}\n`);

    const patterns = [
        ...Array.from({ length: 5 }, (_, i) => `/articles/${i + 1}`),
        ...Array.from({ length: 5 }, (_, i) => `/api/articles/${i + 1}`),
        ...Array.from({ length: 5 }, (_, i) => `/article/${i + 1}`),
        ...Array.from({ length: 5 }, (_, i) => `/api/article/${i + 1}`),
        `/articles/${TEST_SLUG}`,
        `/api/articles/${TEST_SLUG}`
    ];

    for (const p of patterns) {
        const url = `${BASE_URL}${p}`;
        process.stdout.write(`Trying ${p.padEnd(40)} ... `);
        try {
            const res = await fetch(url, {
                headers: { 'Accept': 'application/json' }
            });

            if (res.ok) {
                console.log(`[SUCCESS] ${res.status}`);
                const text = await res.text();
                console.log('Preview:', text.substring(0, 200));
                fs.writeFileSync(`success-article-${p.replace(/\//g, '_')}.html`, text);
            } else {
                console.log(`[${res.status}] ${res.statusText}`);
                const text = await res.text();
                const filename = `fail-article-${p.replace(/\//g, '_')}.html`;
                // Only save specifically interesting ones to avoid clutter, or just save the last one
                if (p.includes(TEST_SLUG) && p.startsWith('/article')) {
                    fs.writeFileSync(filename, text);
                    console.log(`Saved failure to ${filename}`);
                }
            }
        } catch (e) {
            console.log(`[ERROR] ${e.message}`);
        }
    }
}

probe();
