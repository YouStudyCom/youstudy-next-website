/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || 'https://www.youstudy.com',
    generateRobotsTxt: false, // We maintain our own robots.txt
    exclude: ['/server-sitemap.xml'], // in case we add one later
    generateIndexSitemap: true,
    sitemapSize: 7000,
}
