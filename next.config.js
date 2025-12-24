/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

const nextConfig = {
    i18n,
    reactStrictMode: true,
    outputFileTracingRoot: require('path').join(__dirname),
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'http',
                hostname: '127.0.0.1',
                port: '8000',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8000',
            },
            {
                protocol: 'https',
                hostname: 'flagcdn.com',
            },
        ],
    },
    devIndicators: {
        buildActivity: false,
        appIsrStatus: false,
    },
    async headers() {
        return [
            {
                // Caching for static assets in public folder (images, fonts, etc.)
                source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|mp4|webm|woff2|woff|ttf)',
                locale: false,
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    }
                ],
            },
            {
                // Caching for Next.js static assets
                source: '/_next/static/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    }
                ],
            },
            {
                // Security headers for all routes
                source: '/:path*',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on'
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN'
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block'
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'origin-when-cross-origin'
                    }
                ],
            }
        ];
    },
};

module.exports = nextConfig;
// Force reload - Study Abroad Guide SEO Optimized - Config Updated - Clear I18n Cache
