const fs = require('fs');
const path = require('path');
const { createClient } = require('next-sanity');
const dotenv = require('dotenv');

// Load environment variables
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

console.log('Attempting to generate sitemap...');
console.log('Environment file:', envPath);
console.log('Project ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
console.log('Dataset:', process.env.NEXT_PUBLIC_SANITY_DATASET);

// Sanity configuration from environment or fallback
const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'default-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'development',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN
};

console.log('Sanity Configuration:', JSON.stringify(sanityConfig, null, 2));

const sanityClient = createClient(sanityConfig);

async function generateSitemap() {
  const BASE_URL = 'https://kuhmdev.com.ar';
  
  // Static pages
  const staticPages = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/blog', priority: '0.8', changefreq: 'weekly' },
    { path: '/about', priority: '0.6', changefreq: 'monthly' },
    { path: '/contact', priority: '0.5', changefreq: 'yearly' }
  ];

  // Fetch dynamic blog posts from Sanity with extensive error handling
  let blogPosts = [];
  try {
    console.log('Attempting to fetch blog posts...');
    blogPosts = await sanityClient.fetch(`
      *[_type == "post"] {
        "slug": slug.current,
        _updatedAt
      }
    `);
    console.log(`Found ${blogPosts.length} blog posts`);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    
    // Log detailed error information
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Body:', error.response.body);
    }
    
    // Continue with static pages if blog fetch fails
    console.warn('Continuing sitemap generation with only static pages');
  }

  // Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
    ${[...staticPages, ...blogPosts.map(post => ({
      path: `/blog/${post.slug}`, 
      priority: '0.7', 
      changefreq: 'weekly',
      lastmod: post._updatedAt
    }))].map(page => `
    <url>
        <loc>${BASE_URL}${page.path}</loc>
        <priority>${page.priority}</priority>
        <changefreq>${page.changefreq}</changefreq>
        <lastmod>${page.lastmod || new Date().toISOString()}</lastmod>
    </url>`).join('')}
</urlset>`;

  // Write sitemap to public directory
  const sitemapPath = path.resolve('./public/sitemap.xml');
  try {
    fs.writeFileSync(sitemapPath, sitemap);
    console.log(`Sitemap generated successfully at: ${sitemapPath}`);
  } catch (writeError) {
    console.error('Error writing sitemap:', writeError);
  }
}

generateSitemap().catch(error => {
  console.error('Unhandled error in sitemap generation:', error);
  process.exit(1);
});
