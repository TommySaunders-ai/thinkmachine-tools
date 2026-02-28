/**
 * SEO Generator
 *
 * Generates sitemap.xml, robots.txt, and JSON-LD structured data
 * from Notion page database properties.
 */

/**
 * Generate sitemap.xml content.
 */
export function generateSitemap({ site, pages }) {
  const baseUrl = site.domain?.startsWith('http')
    ? site.domain
    : `https://${site.domain}`;

  const today = new Date().toISOString().split('T')[0];

  const urls = pages
    .filter((p) => p.status !== 'Draft')
    .map((page) => {
      const loc = page.route === '/' ? baseUrl : `${baseUrl}${page.route}`;
      const priority = page.route === '/' ? '1.0' : page.pageType === 'Landing' ? '0.9' : '0.8';
      const changefreq = page.pageType === 'Blog Post' ? 'weekly' : 'monthly';
      return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

/**
 * Generate robots.txt content.
 */
export function generateRobotsTxt({ site }) {
  const baseUrl = site.domain?.startsWith('http')
    ? site.domain
    : `https://${site.domain}`;

  return `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`;
}

/**
 * Generate JSON-LD structured data for a page.
 */
export function generateJsonLd({ page, site }) {
  const baseUrl = site.domain?.startsWith('http')
    ? site.domain
    : `https://${site.domain}`;

  const url = page.route === '/' ? baseUrl : `${baseUrl}${page.route}`;

  if (page.route === '/') {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: site.name,
      url: baseUrl,
      description: site.brandDescription || '',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${baseUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    };
  }

  if (page.pageType === 'Blog Post') {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: page.seoTitle || page.name,
      description: page.seoDescription || '',
      url,
      publisher: {
        '@type': 'Organization',
        name: site.name,
      },
    };
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.seoTitle || page.name,
    description: page.seoDescription || '',
    url,
    isPartOf: {
      '@type': 'WebSite',
      name: site.name,
      url: baseUrl,
    },
  };
}

function escapeXml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
