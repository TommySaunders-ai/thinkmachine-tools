/**
 * Area Landing Page Generator
 *
 * Generates the subcategory landing page for each Area of IO.
 * Example: /areas/notion-io → Notion IO landing page with article grid.
 */

import { renderArticleCardGrid } from './article-card.js';
import { AREAS } from '../notion/section-library.js';

const CARBON_THEMES = {
  White: { bg: '#ffffff', text: '#161616', interactive: '#0f62fe', surface: '#ffffff', border: '#e0e0e0', secondaryText: '#525252' },
  G10: { bg: '#f4f4f4', text: '#161616', interactive: '#0f62fe', surface: '#ffffff', border: '#e0e0e0', secondaryText: '#525252' },
  G90: { bg: '#262626', text: '#f4f4f4', interactive: '#4589ff', surface: '#393939', border: '#525252', secondaryText: '#c6c6c6' },
  G100: { bg: '#161616', text: '#f4f4f4', interactive: '#4589ff', surface: '#262626', border: '#393939', secondaryText: '#c6c6c6' },
};

/**
 * Generate an area landing page.
 *
 * @param {Object} area - Area definition from AREAS
 * @param {Array} articles - Articles for this area
 * @param {Object} options - { theme, siteConfig, baseUrl }
 * @returns {string} Complete HTML page
 */
export function generateAreaLanding(area, articles, options = {}) {
  const { theme = 'G100', siteConfig = {}, baseUrl = '' } = options;
  const tokens = CARBON_THEMES[theme] || CARBON_THEMES.G100;

  // Group articles by content type
  const byType = {};
  for (const article of articles) {
    const ct = article.contentType || 'Uncategorized';
    if (!byType[ct]) byType[ct] = [];
    byType[ct].push(article);
  }

  const articleLinkBase = `${baseUrl}${area.slug}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${esc(area.name)} — Areas of IO</title>
  <meta name="description" content="${esc(area.description)}">
  <link rel="canonical" href="${esc(baseUrl)}${esc(area.slug)}">
  <meta property="og:title" content="${esc(area.name)} — Areas of IO">
  <meta property="og:description" content="${esc(area.description)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${esc(baseUrl)}${esc(area.slug)}">
  <script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: area.name,
    description: area.description,
    url: `${baseUrl}${area.slug}`,
    isPartOf: { '@type': 'WebSite', name: siteConfig.name || 'Intelligent Operations' },
    numberOfItems: articles.length,
  })}</script>
  <script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Areas', item: `${baseUrl}/areas` },
      { '@type': 'ListItem', position: 2, name: area.name },
    ],
  })}</script>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'IBM Plex Sans',-apple-system,BlinkMacSystemFont,sans-serif;background:${tokens.bg};color:${tokens.text};line-height:1.6}
    .bx--grid{max-width:1056px;margin:0 auto;padding:0 1rem}
    a{color:${tokens.interactive}}
    @media(max-width:672px){.bx--grid{padding:0 0.5rem}}
  </style>
</head>
<body>

<!-- Breadcrumb -->
<nav style="padding:1rem 0;font-size:0.875rem" aria-label="Breadcrumb">
  <div class="bx--grid">
    <a href="${esc(baseUrl)}/areas" style="color:${tokens.interactive};text-decoration:none">Areas</a>
    <span style="margin:0 0.25rem">/</span>
    <span style="color:${tokens.secondaryText}">${esc(area.name)}</span>
  </div>
</nav>

<!-- Hero -->
<header style="padding:3rem 0;border-bottom:1px solid ${tokens.border}">
  <div class="bx--grid">
    <h1 style="font-size:2.5rem;font-weight:600;margin-bottom:0.75rem">${esc(area.name)}</h1>
    <p style="font-size:1.25rem;color:${tokens.secondaryText};max-width:640px">${esc(area.description)}</p>
    <p style="font-size:0.875rem;color:${tokens.secondaryText};margin-top:1rem">${articles.length} article${articles.length !== 1 ? 's' : ''}</p>
  </div>
</header>

<!-- Content Type Sections -->
${Object.entries(byType).map(([type, typeArticles]) => `
<section style="padding:3rem 0;border-bottom:1px solid ${tokens.border}">
  <div class="bx--grid">
    <h2 style="font-size:1.5rem;font-weight:600;margin-bottom:1.5rem">${esc(type)}</h2>
    ${renderArticleCardGrid(typeArticles, tokens, { linkBase: articleLinkBase })}
  </div>
</section>`).join('\n')}

<!-- All Articles Grid (if no type grouping) -->
${Object.keys(byType).length === 0 ? `
<section style="padding:3rem 0">
  <div class="bx--grid">
    ${renderArticleCardGrid(articles, tokens, { linkBase: articleLinkBase })}
  </div>
</section>` : ''}

<footer style="padding:2rem 0;text-align:center;font-size:0.875rem;color:${tokens.secondaryText}">
  <div class="bx--grid">
    <a href="${esc(baseUrl)}/areas" style="color:${tokens.interactive};text-decoration:none">&larr; Back to Areas of IO</a>
  </div>
</footer>

</body>
</html>`;
}

function esc(text) {
  return String(text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
