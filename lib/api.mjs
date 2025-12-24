import { siteConfig } from '../data/siteConfig.mjs';

/**
 * API Singleton Helper
 * Handles authentication and consistent fetching.
 */
class ApiClient {
    constructor() {
        this.baseUrl = siteConfig?.api?.baseUrl?.cms || 'http://127.0.0.1:8000';
        this.token = null;
        this.credentials = siteConfig?.auth?.crm || {
            email: "api@user.com",
            password: "Amin770904030123*"
        };
        this.loginPaths = ['/api/login', '/login', '/api/auth/login'];
        this.cache = new Map(); // Simple in-memory deduplication
        this.DEDUPE_TIME_MS = 2000; // Deduplicate identical requests within 2 seconds
    }

    async authenticate() {
        if (this.token === 'public_fallback') return null; // Already failed
        if (this.token) return this.token;

        console.log('Authenticating...');

        // Retry wrapper for auth
        const loginWithRetry = async (path, retries = 3) => {
            const url = `${this.baseUrl}${path}`;
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000); // Increased to 5s

                const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify(this.credentials),
                    signal: controller.signal
                });
                clearTimeout(timeoutId);

                if (res.status === 429 || res.status >= 500) {
                    if (retries > 0) {
                        console.warn(`[Auth Retry] ${res.status} for ${url}. Retrying...`);
                        await new Promise(r => setTimeout(r, 2000));
                        return loginWithRetry(path, retries - 1);
                    }
                }

                return res;
            } catch (e) {
                if (retries > 0) {
                    await new Promise(r => setTimeout(r, 2000));
                    return loginWithRetry(path, retries - 1);
                }
                throw e;
            }
        };

        for (const loginPath of this.loginPaths) {
            try {
                const res = await loginWithRetry(loginPath);
                if (res && res.ok) {
                    const data = await res.json();
                    this.token = data.token || data.access_token;
                    if (this.token) {
                        console.log('Authentication successful.');
                        return this.token;
                    }
                }
            } catch (e) {
                // Ignore failure, try next path
            }
        }
        console.warn('Authentication failed. Proceeding publicly.');
        this.token = 'public_fallback'; // Cache failure
        return null;
    }

    async getHeaders() {
        const headers = { 'Accept': 'application/json' };
        await this.authenticate();
        if (this.token && this.token !== 'public_fallback') {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }

    async fetch(endpoint, options = {}) {
        // Ensure endpoint starts with slash
        const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        const url = `${this.baseUrl}${path}`;
        // Deduplication Check (GET only by default) and skip for auth
        const cacheKey = `${url}`;
        if ((!options.method || options.method === 'GET') && !url.includes('/login')) {
            const cached = this.cache.get(cacheKey);
            if (cached && (Date.now() - cached.timestamp < this.DEDUPE_TIME_MS)) {
                return cached.promise;
            }
        }

        const fetchWithRetry = async (retries = 3, delay = 1000) => {
            const headers = options.headers
                ? { ...(await this.getHeaders()), ...options.headers }
                : await this.getHeaders();

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

            try {
                const res = await fetch(url, { ...options, headers, signal: controller.signal });
                clearTimeout(timeoutId);

                if (res.status === 429 || res.status >= 500) {
                    if (retries > 0) {
                        console.warn(`[Retry] ${res.status} for ${url}. Retrying in ${delay}ms...`);
                        await new Promise(r => setTimeout(r, delay));
                        return fetchWithRetry(retries - 1, delay * 2);
                    }
                }

                if (!res.ok) {
                    throw new Error(`Request failed: ${res.status}`);
                }
                return await res.json();
            } catch (error) {
                clearTimeout(timeoutId);
                if (retries > 0 && error.name !== 'AbortError') {
                    console.warn(`[Retry] Network error for ${url}: ${error.message}. Retrying...`);
                    await new Promise(r => setTimeout(r, delay));
                    return fetchWithRetry(retries - 1, delay * 2);
                }
                throw error;
            }
        };

        const fetchPromise = fetchWithRetry();

        if (!options.method || options.method === 'GET') {
            this.cache.set(cacheKey, { timestamp: Date.now(), promise: fetchPromise });
            fetchPromise.catch(() => this.cache.delete(cacheKey));
        }

        try {
            return await fetchPromise;
        } catch (error) {
            console.error(`Fetch error for ${url}:`, error.message);
            throw error;
        }
    }
}

export const api = new ApiClient();
