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
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },

    async redirects() {
        return [
            {
                source: '/article/:slug*',
                destination: '/study-abroad-guide',
                permanent: true,
            },
        ];
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
                // CORS Headers for CMS and external tools
                source: '/:path*',
                headers: [
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: 'https://cpanelblog.youstudy.com',
                    },
                    {
                        key: 'Access-Control-Allow-Methods',
                        value: 'GET,POST,PUT,DELETE,OPTIONS',
                    },
                    {
                        key: 'Access-Control-Allow-Headers',
                        value: 'X-Requested-With, Content-Type, Authorization',
                    },
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
                        value: 'camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=(), attribution-reporting=(self "https://*.google.com" "https://*.google.com.sa" "https://*.google-analytics.com" "https://*.googletagmanager.com" "https://*.googleadservices.com" "https://*.doubleclick.net"), run-ad-auction=(self "https://*.google.com" "https://*.doubleclick.net")'
                    },
                    {
                        key: 'Content-Security-Policy',
                        // Relaxed for Google Analytics, GTM, Ads, Hotjar, and regional Google domains
                        value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.googletagmanager.com https://*.google-analytics.com https://*.google.com https://*.google.com.sa https://*.googleadservices.com https://*.doubleclick.net https://*.hotjar.com https://*.hotjar.io https://connect.facebook.net https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline' https://*.hotjar.com; img-src 'self' blob: data: https://cpanelblog.youstudy.com https://images.unsplash.com https://flagcdn.com https://login.youstudy.com https://www.youstudy.com https://youstudy.com http://localhost:8000 http://127.0.0.1:8000 https://*.google-analytics.com https://*.googletagmanager.com https://*.google.com https://*.google.com.sa https://www.google.co.uk https://*.doubleclick.net https://*.googleadservices.com https://*.hotjar.com https://www.facebook.com https://facebook.com; font-src 'self' data: https://*.hotjar.com; connect-src 'self' https://cpanelblog.youstudy.com https://login.youstudy.com https://www.google-analytics.com https://region1.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.g.doubleclick.net https://*.google.com https://*.google.com.sa https://*.googleadservices.com https://www.googleadservices.com http://localhost:8000 http://127.0.0.1:8000 https://*.hotjar.com https://*.hotjar.io wss://*.hotjar.com https://ip2c.org https://freeipapi.com https://connect.facebook.net https://www.facebook.com https://static.cloudflareinsights.com https://cloudflareinsights.com; frame-src 'self' https://*.googletagmanager.com https://www.youtube.com https://player.vimeo.com https://*.hotjar.com https://*.hotjar.io https://www.facebook.com https://connect.facebook.net;"
                    }
                ],
            }
        ];
    },
};

module.exports = nextConfig;
// Force reload - Study Abroad Guide SEO Optimized - Config Updated - Clear I18n Cache
