// Config mimic
const baseUrl = 'https://cpanelblog.youstudy.com';
const slug = 'how-to-choose-your-destination-of-study-in-the-uk';
const endpoint = `/api/articles/${slug}`;

async function testApi(locale) {
    const url = `${baseUrl}${endpoint}`;
    console.log(`Testing ${locale.toUpperCase()} fetch to: ${url}`);

    try {
        const res = await fetch(url, {
            headers: {
                'language': locale,
                'Accept': 'application/json'
            }
        });

        console.log(`Status: ${res.status} ${res.statusText}`);

        if (res.ok) {
            const data = await res.json();
            const article = data.data || data;
            console.log(`Success! Article Title: ${article.title || 'No Title Found'}`);
        } else {
            console.error('Fetch failed.');
            const text = await res.text();
            console.log('Preview Response:', text.substring(0, 500));
        }
    } catch (e) {
        console.error('Error:', e.message);
    }
    console.log('---');
}

(async () => {
    await testApi('en');
    await testApi('ar');
})();
