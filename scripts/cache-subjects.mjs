import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { api } from '../lib/api.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CACHE_FILE = path.join(__dirname, '../data/subjects-cache.json');
const SUBJECTS_FILE = path.join(__dirname, '../data/subjects.js');

async function cacheSubjects() {
    console.log('Starting Subject Caching Process...');

    // 1. Extract Slugs
    let slugs = [];
    try {
        const fileContent = fs.readFileSync(SUBJECTS_FILE, 'utf8');
        const slugRegex = /slug:\s*['"]([^'"]+)['"]/g;
        let match;
        while ((match = slugRegex.exec(fileContent)) !== null) {
            slugs.push(match[1]);
        }
        console.log(`Found ${slugs.length} slugs to fetch:`, slugs.join(', '));
    } catch (e) {
        console.error("Error reading subjects file:", e.message);
        process.exit(1);
    }

    if (slugs.length === 0) {
        console.error("No slugs found.");
        process.exit(1);
    }

    let cachedData = [];
    const routePrefixes = ['/api/articles', '/articles'];

    // 2. Fetch via API
    for (const slug of slugs) {
        process.stdout.write(`Fetching '${slug}'... `);
        let found = false;

        for (const prefix of routePrefixes) {
            try {
                // api.fetch handles auth and base url
                const data = await api.fetch(`${prefix}/${slug}`);

                const subjectItem = data.data || data;
                if (!subjectItem.slug) subjectItem.slug = slug;

                cachedData.push(subjectItem);
                console.log(`OK (${prefix})`);
                found = true;
                break;
            } catch (e) {
                // Ignore specific route failure
            }
        }
        if (!found) console.log("FAILED (Not Found)");
    }

    console.log(`\nSuccessfully fetched ${cachedData.length} of ${slugs.length} items.`);

    if (cachedData.length === 0) {
        console.error("No data fetched. Aborting save.");
        process.exit(1);
    }

    // 3. Save Cache
    try {
        const dataDir = path.dirname(CACHE_FILE);
        if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

        fs.writeFileSync(CACHE_FILE, JSON.stringify(cachedData, null, 2));
        console.log(`\nOK: Data saved to ${CACHE_FILE}`);
    } catch (error) {
        console.error('File Write Error:', error.message);
    }
}

cacheSubjects();
