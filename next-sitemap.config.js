/** @type {import('next-sitemap').IConfig}*/
module.exports = {
  siteUrl: "https://proxy-green-eight.vercel.app",
  changefreq: "daily",
  priority: 0.7,
  generateRobotsTxt: true,
  sitemapSize: 5000, 
  robotsTxtOptions: {
    additionalSitemaps: [
      "https://proxy-green-eight.vercel.app/free-proxy-sitemap.xml",
    ],
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
  },
};
