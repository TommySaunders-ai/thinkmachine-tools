/**
 * Article Page Generator
 *
 * Composes a full article page from an article record + section renderers.
 * Produces self-contained HTML with Carbon Design System styling, JSON-LD
 * structured data, and SEO meta tags.
 */

import { renderArticleSections, renderTableOfContents } from './article-sections.js';
import { CONTENT_TYPES } from '../notion/section-library.js';

const CARBON_THEMES = {
  White: { bg: '#ffffff', text: '#161616', interactive: '#0f62fe', surface: '#ffffff', border: '#e0e0e0', secondaryText: '#525252' },
  G10: { bg: '#f4f4f4', text: '#161616', interactive: '#0f62fe', surface: '#ffffff', border: '#e0e0e0', secondaryText: '#525252' },
  G90: { bg: '#262626', text: '#f4f4f4', interactive: '#4589ff', surface: '#393939', border: '#525252', secondaryText: '#c6c6c6' },
  G100: { bg: '#161616', text: '#f4f4f4', interactive: '#4589ff', surface: '#262626', border: '#393939', secondaryText: '#c6c6c6' },
};

/**
 * Generate a complete article HTML page.
 *
 * @param {Object} article - Full article from getArticleWithBody()
 * @param {Object} options - { theme, siteConfig, baseUrl, breadcrumbs }
 * @returns {string} Complete HTML page string
 */
export function generateArticlePage(article, options = {}) {
  const { theme = 'G100', siteConfig = {}, baseUrl = '', breadcrumbs = [] } = options;
  const tokens = CARBON_THEMES[theme] || CARBON_THEMES.G100;
  const ct = CONTENT_TYPES[article.contentType] || {};

  const title = article.seoTitle || article.h1Tag || article.title;
  const description = article.metaDescription || article.primaryDefinition || '';
  const ogTitle = article.ogTitle || title;
  const ogDesc = article.ogDescription || description;
  const ogImage = article.ogImage || article.featuredImage || '';
  const canonicalUrl = article.canonicalUrl || `${baseUrl}${article.urlSlug || ''}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${esc(canonicalUrl)}">

  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="${esc(ogTitle)}">
  <meta property="og:description" content="${esc(ogDesc)}">
  ${ogImage ? `<meta property="og:image" content="${esc(ogImage)}">` : ''}
  <meta property="og:url" content="${esc(canonicalUrl)}">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="${article.twitterCard || 'summary_large_image'}">
  <meta name="twitter:title" content="${esc(ogTitle)}">
  <meta name="twitter:description" content="${esc(ogDesc)}">
  ${ogImage ? `<meta name="twitter:image" content="${esc(ogImage)}">` : ''}

  <!-- Article Meta -->
  ${article.publishDate ? `<meta property="article:published_time" content="${article.publishDate}">` : ''}
  ${article.lastUpdated ? `<meta property="article:modified_time" content="${article.lastUpdated}">` : ''}

  ${renderJsonLd(article, canonicalUrl, siteConfig)}

  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'IBM Plex Sans',-apple-system,BlinkMacSystemFont,sans-serif;background:${tokens.bg};color:${tokens.text};line-height:1.6}
    .bx--grid{max-width:1056px;margin:0 auto;padding:0 1rem}
    .bx--row{display:flex;flex-wrap:wrap;margin:0 -1rem}
    .bx--col-lg-12{flex:0 0 100%;max-width:100%;padding:0 1rem}
    .bx--col-lg-8{flex:0 0 66.67%;max-width:66.67%;padding:0 1rem}
    .bx--col-lg-4{flex:0 0 33.33%;max-width:33.33%;padding:0 1rem}
    .bx--col-md-8{flex:0 0 100%;max-width:100%;padding:0 1rem}
    a{color:${tokens.interactive}}
    h1,h2,h3,h4{font-weight:600;line-height:1.25}
    p{margin-bottom:1rem}
    ul,ol{padding-left:1.25rem;margin-bottom:1rem}
    li{margin-bottom:0.25rem}
    pre{background:#161616;color:#f4f4f4;padding:1rem;border-radius:4px;overflow-x:auto;margin-bottom:1rem}
    code{font-family:'IBM Plex Mono',monospace}
    blockquote{border-left:4px solid ${tokens.interactive};padding:1rem 1.5rem;margin:1rem 0;background:${tokens.surface}}
    img{max-width:100%;height:auto}
    table{width:100%;border-collapse:collapse;margin-bottom:1rem}
    th,td{padding:0.75rem;border:1px solid ${tokens.border};text-align:left}
    th{background:${tokens.surface};font-weight:600}
    details{margin-bottom:1rem}
    summary{cursor:pointer;font-weight:600;padding:0.5rem 0}
    @media(max-width:672px){
      .bx--col-lg-8,.bx--col-lg-4{flex:0 0 100%;max-width:100%}
    }
  </style>
</head>
<body>

${renderBreadcrumbs(breadcrumbs, tokens)}

<!-- Article Header -->
<header style="padding:3rem 0 2rem;border-bottom:1px solid ${tokens.border}">
  <div class="bx--grid">
    <div class="bx--row">
      <div class="bx--col-lg-12 bx--col-md-8">
        ${article.areaOfIO ? `<span style="color:${tokens.interactive};font-size:0.875rem;font-weight:600;text-transform:uppercase;letter-spacing:0.1em">${esc(article.areaOfIO)}</span>` : ''}
        <h1 style="font-size:2.5rem;margin:0.5rem 0">${esc(article.h1Tag || article.title)}</h1>
        ${article.subtitle ? `<p style="font-size:1.25rem;color:${tokens.secondaryText};margin-bottom:1rem">${esc(article.subtitle)}</p>` : ''}
        <div style="display:flex;gap:1.5rem;flex-wrap:wrap;font-size:0.875rem;color:${tokens.secondaryText}">
          ${article.publishDate ? `<span>Published: ${article.publishDate}</span>` : ''}
          ${article.readingTime ? `<span>${article.readingTime} min read</span>` : ''}
          ${ct.name ? `<span>${esc(ct.name)}</span>` : ''}
          ${article.difficulty ? `<span>${esc(article.difficulty)}</span>` : ''}
        </div>
      </div>
    </div>
  </div>
</header>

${article.featuredImage ? `<div style="max-width:1056px;margin:0 auto;padding:2rem 1rem 0"><img src="${esc(article.featuredImage)}" alt="${esc(article.title)}" style="width:100%;border-radius:4px"></div>` : ''}

<!-- TL;DR -->
${article.tldrSummary ? `<div class="bx--grid" style="padding-top:2rem">
  <div class="bx--row"><div class="bx--col-lg-12 bx--col-md-8">
    <div style="background:${tokens.surface};border-left:4px solid ${tokens.interactive};padding:1.5rem;border-radius:0 4px 4px 0">
      <strong style="font-size:0.875rem;text-transform:uppercase;letter-spacing:0.05em">TL;DR</strong>
      <p style="margin-top:0.5rem;margin-bottom:0">${esc(article.tldrSummary)}</p>
    </div>
  </div></div>
</div>` : ''}

<!-- Table of Contents -->
<div class="bx--grid" style="padding-top:2rem">
  <div class="bx--row"><div class="bx--col-lg-12 bx--col-md-8">
    ${renderTableOfContents(article, tokens)}
  </div></div>
</div>

<!-- Article Body Sections -->
${renderArticleSections(article, { theme })}

<!-- Article Footer -->
<footer style="padding:3rem 0;border-top:1px solid ${tokens.border}">
  <div class="bx--grid">
    <div class="bx--row"><div class="bx--col-lg-12 bx--col-md-8">
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:1rem">
        ${(article.tags || []).map(t => `<span style="background:${tokens.surface};border:1px solid ${tokens.border};padding:0.25rem 0.75rem;border-radius:2rem;font-size:0.75rem">${esc(t)}</span>`).join('\n        ')}
      </div>
      ${article.lastUpdated ? `<p style="font-size:0.875rem;color:${tokens.secondaryText}">Last updated: ${article.lastUpdated}</p>` : ''}
    </div></div>
  </div>
</footer>

</body>
</html>`;
}

// ─── Helpers ──────────────────────────────────────────────────────

function esc(text) {
  return String(text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderBreadcrumbs(crumbs, tokens) {
  if (!crumbs || crumbs.length === 0) return '';
  const items = crumbs.map((c, i) => {
    if (i === crumbs.length - 1) return `<span style="color:${tokens.secondaryText}">${esc(c.label)}</span>`;
    return `<a href="${esc(c.href)}" style="color:${tokens.interactive};text-decoration:none">${esc(c.label)}</a>`;
  }).join(' <span style="margin:0 0.25rem">/</span> ');
  return `<nav style="padding:1rem 0;font-size:0.875rem" aria-label="Breadcrumb"><div class="bx--grid">${items}</div></nav>`;
}

function renderJsonLd(article, url, siteConfig) {
  const schemas = [];

  // Article schema
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.h1Tag || article.title,
    description: article.metaDescription || article.primaryDefinition || '',
    datePublished: article.publishDate || undefined,
    dateModified: article.lastUpdated || undefined,
    image: article.featuredImage || undefined,
    url,
    author: { '@type': 'Organization', name: siteConfig.name || 'Intelligent Operations' },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name || 'Intelligent Operations',
      url: siteConfig.domain || '',
    },
  });

  // FAQ schema if questions exist
  if (article.questions && article.questions.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: article.questions.map(q => ({
        '@type': 'Question',
        name: q.properties?.['Question']?.title?.[0]?.plain_text || '',
        acceptedAnswer: {
          '@type': 'Answer',
          text: q.properties?.['Answer']?.rich_text?.[0]?.plain_text || '',
        },
      })),
    });
  }

  // BreadcrumbList
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Areas', item: `${siteConfig.domain || ''}/areas` },
      article.areaOfIO ? { '@type': 'ListItem', position: 2, name: article.areaOfIO, item: `${siteConfig.domain || ''}/areas/${(article.areaOfIO || '').toLowerCase().replace(/\s+/g, '-')}` } : null,
      { '@type': 'ListItem', position: 3, name: article.title },
    ].filter(Boolean),
  });

  return schemas.map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n  ');
}
