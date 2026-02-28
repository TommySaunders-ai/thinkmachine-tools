/**
 * Areas of IO Home Page Generator
 *
 * Generates the main Areas of IO index page showing all 22 areas as
 * a card grid. Built last in the pipeline because it needs article counts.
 */

import { AREAS } from '../notion/section-library.js';

const CARBON_THEMES = {
  White: { bg: '#ffffff', text: '#161616', interactive: '#0f62fe', surface: '#ffffff', border: '#e0e0e0', secondaryText: '#525252' },
  G10: { bg: '#f4f4f4', text: '#161616', interactive: '#0f62fe', surface: '#ffffff', border: '#e0e0e0', secondaryText: '#525252' },
  G90: { bg: '#262626', text: '#f4f4f4', interactive: '#4589ff', surface: '#393939', border: '#525252', secondaryText: '#c6c6c6' },
  G100: { bg: '#161616', text: '#f4f4f4', interactive: '#4589ff', surface: '#262626', border: '#393939', secondaryText: '#c6c6c6' },
};

/**
 * Generate the Areas of IO home page.
 *
 * @param {Object} areaCounts - Map of area ID → article count, e.g. { 'notion-io': 42 }
 * @param {Object} options - { theme, siteConfig, baseUrl }
 * @returns {string} Complete HTML page
 */
export function generateAreasHome(areaCounts = {}, options = {}) {
  const { theme = 'G100', siteConfig = {}, baseUrl = '' } = options;
  const tokens = CARBON_THEMES[theme] || CARBON_THEMES.G100;
  const totalArticles = Object.values(areaCounts).reduce((a, b) => a + b, 0);

  const areaCards = AREAS.map(area => {
    const count = areaCounts[area.id] || 0;
    return `<a href="${esc(baseUrl)}${esc(area.slug)}" style="text-decoration:none;display:block;background:${tokens.surface};border:1px solid ${tokens.border};border-radius:4px;padding:1.5rem;transition:border-color 0.15s,box-shadow 0.15s">
  <h3 style="color:${tokens.text};font-size:1.125rem;font-weight:600;margin-bottom:0.5rem">${esc(area.name)}</h3>
  <p style="color:${tokens.secondaryText};font-size:0.875rem;margin-bottom:0.75rem">${esc(area.description)}</p>
  <span style="font-size:0.75rem;color:${tokens.interactive}">${count} article${count !== 1 ? 's' : ''} &rarr;</span>
</a>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Areas of IO — Intelligent Operations</title>
  <meta name="description" content="Explore ${AREAS.length} areas of Intelligent Operations: ${AREAS.slice(0, 5).map(a => a.name).join(', ')}, and more.">
  <link rel="canonical" href="${esc(baseUrl)}/areas">
  <meta property="og:title" content="Areas of IO — Intelligent Operations">
  <meta property="og:description" content="Explore ${AREAS.length} areas of Intelligent Operations with ${totalArticles}+ articles.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${esc(baseUrl)}/areas">
  <script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Areas of IO',
    description: `${AREAS.length} areas of Intelligent Operations`,
    url: `${baseUrl}/areas`,
    isPartOf: { '@type': 'WebSite', name: siteConfig.name || 'Intelligent Operations' },
    numberOfItems: AREAS.length,
  })}</script>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'IBM Plex Sans',-apple-system,BlinkMacSystemFont,sans-serif;background:${tokens.bg};color:${tokens.text};line-height:1.6}
    .bx--grid{max-width:1056px;margin:0 auto;padding:0 1rem}
    a:hover .bx--area-card,a:hover{border-color:${tokens.interactive} !important}
    @media(max-width:672px){.bx--grid{padding:0 0.5rem}}
  </style>
</head>
<body>

<!-- Hero -->
<header style="padding:4rem 0 3rem;border-bottom:1px solid ${tokens.border}">
  <div class="bx--grid">
    <h1 style="font-size:3rem;font-weight:600;margin-bottom:1rem">Areas of IO</h1>
    <p style="font-size:1.25rem;color:${tokens.secondaryText};max-width:640px">
      Explore ${AREAS.length} areas of Intelligent Operations. ${totalArticles > 0 ? `${totalArticles} articles across every domain of modern operations.` : 'Building the comprehensive operations knowledge base.'}
    </p>
  </div>
</header>

<!-- Areas Grid -->
<section style="padding:3rem 0">
  <div class="bx--grid">
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.5rem">
      ${areaCards}
    </div>
  </div>
</section>

<footer style="padding:2rem 0;text-align:center;font-size:0.875rem;color:${tokens.secondaryText}">
  <div class="bx--grid">Intelligent Operations &mdash; ${new Date().getFullYear()}</div>
</footer>

</body>
</html>`;
}

function esc(text) {
  return String(text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
