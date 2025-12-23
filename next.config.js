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
};

module.exports = nextConfig;
// Force reload - Study Abroad Guide SEO Optimized - Config Updated - Clear I18n Cache
