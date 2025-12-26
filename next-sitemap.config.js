/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || 'https://www.youstudy.com',
    generateRobotsTxt: true,
    robotsTxtOptions: {
        policies: [
            { userAgent: '*', allow: '/' },
        ],
        additionalSitemaps: [
            'https://www.youstudy.com/sitemap.xml',
        ],
    },
    exclude: ['/server-sitemap.xml'], // in case we add one later
    generateIndexSitemap: true,
    sitemapSize: 7000,
}
