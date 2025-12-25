const fs = require('fs');
const path = require('path');
const https = require('https');

const CACHE_FILE = path.join(__dirname, '../data/articles-cache.json');
const API_BASE = 'https://cpanelblog.youstudy.com/api/articles';

// Simple fetch wrapper using native https
function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        reject(e);
                    }
                } else {
                    reject(new Error(`Status ${res.statusCode}`));
                }
            });
        }).on('error', reject);
    });
}

async function enrich() {
    if (!fs.existsSync(CACHE_FILE)) {
        console.error('Cache file not found!');
        process.exit(1);
    }

    const articles = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    console.log(`Found ${articles.length} articles to check...`);

    let updatedCount = 0;
    const errors = [];

    // Process in chunks to avoid rate limiting?
    // Let's do sequential for safety
    for (let i = 0; i < articles.length; i++) {
        const article = articles[i];

        // Skip if already has full category object
        if (article.category && typeof article.category === 'object' && article.category.slug) {
            continue;
        }

        console.log(`[${i + 1}/${articles.length}] Fetching category for: ${article.slug}`);

        try {
            const data = await fetchUrl(`${API_BASE}/${article.slug}`);
            if (data && data.data && data.data.category) {
                // Update article with category
                articles[i].category = data.data.category; // Ensure we store the whole object
                // Also update other fields if needed?
                // articles[i].image = data.data.image || articles[i].image;
                updatedCount++;
            } else {
                console.warn(`   No category found for ${article.slug}`);
            }
        } catch (e) {
            console.error(`   Failed to fetch ${article.slug}: ${e.message}`);
            errors.push(article.slug);
        }

        // Small delay to be nice to the API
        await new Promise(r => setTimeout(r, 1500));
    }

    console.log(`\nEnrichment complete.`);
    console.log(`Updated: ${updatedCount}`);
    console.log(`Errors: ${errors.length}`);

    fs.writeFileSync(CACHE_FILE, JSON.stringify(articles, null, 2));
    console.log('Cache file updated.');
}

enrich();
