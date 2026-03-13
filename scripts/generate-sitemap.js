import fs from 'fs';
import path from 'path';

// This script can be expanded to fetch routes from a database or API
const BASE_URL = 'https://project-aura-one.vercel.app';
const lastMod = new Date().toISOString().split('T')[0];

const staticRoutes = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/compliance', priority: '0.8', changefreq: 'monthly' },
  { path: '/login', priority: '0.5', changefreq: 'monthly' },
  { path: '/register', priority: '0.5', changefreq: 'monthly' },
];

function generateSitemap() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes.map(route => `  <url>
    <loc>${BASE_URL}${route.path}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  const outputPath = path.resolve(process.cwd(), 'client/public/sitemap.xml');
  fs.writeFileSync(outputPath, xml);
  console.log(`>>> AURA_SEO: Sitemap generated at ${outputPath}`);
}

generateSitemap();
