/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

const nextConfig = {
    i18n,
    reactStrictMode: true,
    outputFileTracingRoot: require('path').join(__dirname),
    images: {
        formats: ['image/avif', 'image/webp'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'cpanelblog.youstudy.com',
            },
            {
                protocol: 'https',
                hostname: 'login.youstudy.com',
            },
            {
                protocol: 'http',
                hostname: '127.0.0.1',
                port: '8000',
            },
            {
                protocol: 'https',
                hostname: 'flagcdn.com',
            },
            {
                protocol: 'https',
                hostname: 'www.youstudy.com',
            },
            {
                protocol: 'https',
                hostname: 'youstudy.com',
            },
            {
                protocol: 'https',
                hostname: 'youstudy.com',
            },
        ],
    },

    async headers() {
        return [

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
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload'
                    },
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
                        value: 'DENY'
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block'
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin'
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()'
                    },
                    {
                        key: 'Content-Security-Policy',
                        // Relaxed for Google Analytics, GTM, and Ads
                        value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.googletagmanager.com https://*.google-analytics.com https://*.google.com https://*.googleadservices.com https://*.doubleclick.net; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https://cpanelblog.youstudy.com https://images.unsplash.com https://flagcdn.com https://login.youstudy.com https://www.youstudy.com https://youstudy.com http://localhost:8000 http://127.0.0.1:8000 https://*.google-analytics.com https://*.googletagmanager.com https://*.google.com https://*.doubleclick.net https://*.googleadservices.com; font-src 'self' data:; connect-src 'self' https://cpanelblog.youstudy.com https://login.youstudy.com https://www.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.g.doubleclick.net https://*.google.com http://localhost:8000 http://127.0.0.1:8000; frame-src 'self' https://*.googletagmanager.com https://www.youtube.com https://player.vimeo.com;"
                    }
                ],
            }
        ];
    },
};

module.exports = nextConfig;
// Force reload - Study Abroad Guide SEO Optimized - Config Updated - Clear I18n Cache
