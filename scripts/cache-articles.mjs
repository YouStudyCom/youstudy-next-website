import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { api } from '../lib/api.mjs';

// ESM dirname shim
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CACHE_FILE = path.join(__dirname, '../data/articles-cache.json');
const DEST_CACHE_FILE = path.join(__dirname, '../data/destinations-cache.json');
const LOCAL_DESTINATIONS_FILE = path.join(__dirname, '../data/destinations.js');

async function cacheArticles() {
    console.log('Starting Caching Process...');

    let articles = [];
    let destinations = [];
    let fetchedFromApi = false;

    // 1. Fetch Destinations
    try {
        console.log(`Fetching destinations from API...`);
        const json = await api.fetch('/api/destinations');

        if (Array.isArray(json)) {
            destinations = json;
        } else if (json.data && Array.isArray(json.data)) {
            destinations = json.data;
        }

        if (destinations.length > 0) {
            fetchedFromApi = true;
            console.log(`Found ${destinations.length} destinations.`);
        }
    } catch (e) {
        console.log(`Error fetching /api/destinations: ${e.message}`);
    }

    // 2. Fetch Articles (Iterate per destination)
    if (fetchedFromApi && destinations.length > 0) {
        console.log(`Fetching articles for each destination...`);
        for (const d of destinations) {
            if (!d.slug || d.slug === 'study-abroad') continue;

            const endpoint = `/api/destinations/${d.slug}/articles`;
            console.log(`Fetching ${endpoint}...`);
            try {
                const aJson = await api.fetch(endpoint);
                let items = [];
                if (Array.isArray(aJson)) {
                    items = aJson;
                } else if (aJson.articles && Array.isArray(aJson.articles)) {
                    items = aJson.articles;
                } else if (aJson.data && Array.isArray(aJson.data)) {
                    items = aJson.data;
                }

                if (items.length > 0) {
                    const enriched = items.map(item => ({ ...item, destination_slug: d.slug }));
                    articles.push(...enriched);
                    console.log(`> Found ${items.length} articles for ${d.slug}`);
                }
            } catch (err) {
                console.log(`> Error fetching ${endpoint}: ${err.message}`);
            }
        }
    }

    // 3. Fallback: Local destinations.js
    if (!fetchedFromApi || destinations.length === 0) {
        console.warn("No data fetched from API. Failing back to local destinations.js data.");

        try {
            // Read file manually since we can't easily import mix of ESM/CJS locally without transpilation issues sometimes
            // But since we are in ESM mode, we might just try dynamic import
            // However, the original file might be 'export const' which works in ESM. 
            // Let's try dynamic import first.
            let tempDest = [];

            // Note: If destinations.js is treated as ESM, dynamic import works.
            // If it's pure JS without extension logic, Node might complain if not .mjs or package.json type=module.
            // Original used regex replace trick. We'll replicate it for safety.

            const tempFile = path.join(__dirname, '../data/destinations-temp.mjs');
            let content = fs.readFileSync(LOCAL_DESTINATIONS_FILE, 'utf8');
            // Ensure we export for ESM
            // "export const destinations =" -> "export const destinations =" (no change needed if valid ESM)
            // But if we want to default export it?

            // Let's just create a temporary ESM file that imports and re-exports or just contains the object.
            // Actually, if existing file is "export const destinations = [...]", valid ESM.
            // We just need to rename to .mjs to import it if package.json doesn't say type: module.
            // But it imports `countries`? We need to be careful about dependencies.
            // Let's use the regex parsing approach used in subjects script or the replace trick if complex.
            // The original script did: replace 'export const' with 'module.exports'.
            // Here we are ESM, so we want 'export const' to stay 'export const'.

            // We can manually parse if it's simple enough or try import. 
            // Simplest: just read it as logicless data if possible, but it likely has references.
            // Given the complexity of mixing modules, the previous robust approach was regex/replace + temp file.
            // Let's update the temp file strategy to be ESM compatible.

            fs.writeFileSync(tempFile, content); // It's already ESM format "export const..."
            const mod = await import(`file://${tempFile}`);
            tempDest = mod.destinations;

            if (Array.isArray(tempDest)) {
                destinations = tempDest;
                destinations.forEach(d => {
                    if (d.articles) {
                        const dArticles = d.articles.map(a => ({
                            ...a,
                            destination_slug: d.slug
                        }));
                        articles.push(...dArticles);
                    }
                });
            }

            fs.unlinkSync(tempFile);
            console.log(`Extracted ${destinations.length} destinations and ${articles.length} articles from local destinations.js`);

        } catch (e) {
            console.error("Failed to extract local data:", e.message);
        }
    }

    // 4. Save Caches
    try {
        const dataDir = path.dirname(CACHE_FILE);
        if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

        fs.writeFileSync(CACHE_FILE, JSON.stringify(articles, null, 2));
        console.log(`\nOK: Data saved to ${CACHE_FILE}`);

        fs.writeFileSync(DEST_CACHE_FILE, JSON.stringify(destinations, null, 2));
        console.log(`OK: Data saved to ${DEST_CACHE_FILE}`);

    } catch (error) {
        console.error('File Write Error:', error.message);
        process.exit(1);
    }
}

cacheArticles();
