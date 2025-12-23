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
    }

    async authenticate() {
        if (this.token === 'public_fallback') return null; // Already failed
        if (this.token) return this.token;

        console.log('Authenticating...');
        for (const loginPath of this.loginPaths) {
            try {
                const url = `${this.baseUrl}${loginPath}`;

                // Add timeout
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 2000); // Reduce to 2s

                const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify(this.credentials),
                    signal: controller.signal
                });
                clearTimeout(timeoutId);

                if (res.ok) {
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

    async fetch(endpoint) {
        // Ensure endpoint starts with slash
        const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        const url = `${this.baseUrl}${path}`;
        const headers = await this.getHeaders();

        try {
            // Add timeout of 5 seconds
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const res = await fetch(url, { headers, signal: controller.signal });
            clearTimeout(timeoutId);

            if (!res.ok) {
                throw new Error(`Request failed: ${res.status}`);
            }
            return await res.json();
        } catch (error) {
            console.error(`Fetch error for ${url}:`, error.message);
            throw error;
        }
    }
}

export const api = new ApiClient();
