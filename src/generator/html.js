/**
 * Static HTML Generator
 *
 * Assembles Carbon Web Components into standalone HTML pages
 * with token-based theming. Produces files matching the existing
 * thinkmachine-tools pattern for GitHub Pages deployment.
 */

import { blocksToHtml } from '../notion/client.js';

// ─── Carbon Theme Tokens ───────────────────────────────────────────

const CARBON_THEMES = {
  White: { bg: '#ffffff', text: '#161616', interactive: '#0f62fe', surface: '#ffffff', overlay: '#f4f4f4' },
  G10: { bg: '#f4f4f4', text: '#161616', interactive: '#0f62fe', surface: '#ffffff', overlay: '#e0e0e0' },
  G90: { bg: '#262626', text: '#f4f4f4', interactive: '#4589ff', surface: '#393939', overlay: '#161616' },
  G100: { bg: '#161616', text: '#f4f4f4', interactive: '#4589ff', surface: '#262626', overlay: '#0d0d0d' },
};

// ─── Component Renderers ───────────────────────────────────────────

const RENDERERS = {
  hero: renderHero,
  feature: renderFeature,
  content: renderContent,
  'card-grid': renderCardGrid,
  cta: renderCta,
  testimonial: renderTestimonial,
  'logo-wall': renderLogoWall,
  pricing: renderPricing,
  faq: renderFaq,
  header: renderHeader,
  footer: renderFooter,
  navigation: renderNavigation,
  'link-list': renderLinkList,
};

// ─── Page Generator ────────────────────────────────────────────────

/**
 * Generate a complete HTML page.
 *
 * @param {Object} params
 * @param {Object} params.page - Page data from Notion
 * @param {Array}  params.componentSelections - Array of { section, component } from selector
 * @param {Object} params.site - Site configuration
 * @param {Object} params.contentDatabases - Services, testimonials, team data
 * @param {Array}  params.allPages - All pages (for navigation)
 * @returns {string} Complete HTML string
 */
export function generatePage({ page, componentSelections, site, contentDatabases, allPages }) {
  const theme = CARBON_THEMES[site.theme] || CARBON_THEMES.G100;
  const primaryColor = site.primaryColor || theme.interactive;
  const title = page.seoTitle || `${page.name} | ${site.name}`;
  const description = page.seoDescription || site.brandDescription?.slice(0, 160) || '';
  const canonicalUrl = buildCanonicalUrl(site.domain, page.route);

  const sectionsHtml = componentSelections.map(({ section, component }) => {
    const renderer = RENDERERS[component.category] || renderContent;
    return renderer({ section, component, site, contentDatabases });
  }).join('\n\n');

  const navHtml = generateNavigation(allPages, page, site);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${canonicalUrl}">

  <!-- OpenGraph -->
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${escapeHtml(site.name)}">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">

  <!-- Favicon -->
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">

  <!-- Carbon Design System Styles -->
  <style>
    :root {
      --cds-background: ${theme.bg};
      --cds-text-primary: ${theme.text};
      --cds-text-secondary: ${theme.text}cc;
      --cds-interactive: ${primaryColor};
      --cds-interactive-hover: ${adjustColor(primaryColor, -15)};
      --cds-layer-01: ${theme.surface};
      --cds-layer-02: ${theme.overlay};
      --cds-border-subtle: ${theme.text}22;
      --cds-link-primary: ${primaryColor};
      --cds-button-primary: ${primaryColor};
      --cds-spacing-01: 0.125rem;
      --cds-spacing-02: 0.25rem;
      --cds-spacing-03: 0.5rem;
      --cds-spacing-04: 0.75rem;
      --cds-spacing-05: 1rem;
      --cds-spacing-06: 1.5rem;
      --cds-spacing-07: 2rem;
      --cds-spacing-08: 2.5rem;
      --cds-spacing-09: 3rem;
      --cds-spacing-10: 4rem;
      --cds-spacing-11: 5rem;
      --cds-spacing-12: 6rem;
      --cds-spacing-13: 10rem;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background-color: var(--cds-background);
      color: var(--cds-text-primary);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }

    /* ── Grid ── */
    .cds-grid {
      max-width: 1584px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    @media (min-width: 672px) { .cds-grid { padding: 0 2rem; } }
    @media (min-width: 1056px) { .cds-grid { padding: 0 2.5rem; } }

    /* ── Typography ── */
    h1 { font-size: 3.375rem; font-weight: 300; line-height: 1.1; letter-spacing: 0; }
    h2 { font-size: 2.625rem; font-weight: 300; line-height: 1.15; }
    h3 { font-size: 1.75rem; font-weight: 400; line-height: 1.3; }
    h4 { font-size: 1.25rem; font-weight: 400; line-height: 1.4; }
    p  { font-size: 1rem; line-height: 1.6; color: var(--cds-text-secondary); }
    .eyebrow {
      font-size: 0.875rem;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--cds-interactive);
      margin-bottom: var(--cds-spacing-03);
    }
    @media (max-width: 671px) {
      h1 { font-size: 2.25rem; }
      h2 { font-size: 1.75rem; }
      h3 { font-size: 1.25rem; }
    }

    /* ── Sections ── */
    .section {
      padding: var(--cds-spacing-12) 0;
    }
    .section--hero {
      padding: var(--cds-spacing-13) 0 var(--cds-spacing-12);
    }
    .section--alt {
      background-color: var(--cds-layer-01);
    }

    /* ── Buttons ── */
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.875rem 3.9375rem 0.875rem 0.9375rem;
      font-size: 0.875rem;
      font-weight: 400;
      border: none;
      cursor: pointer;
      text-decoration: none;
      transition: background-color 0.15s;
      position: relative;
    }
    .btn--primary {
      background-color: var(--cds-button-primary);
      color: #fff;
    }
    .btn--primary:hover { background-color: var(--cds-interactive-hover); }
    .btn--secondary {
      background-color: transparent;
      color: var(--cds-text-primary);
      border: 1px solid var(--cds-border-subtle);
    }
    .btn--secondary:hover { background-color: var(--cds-layer-01); }
    .btn::after {
      content: '→';
      position: absolute;
      right: 1rem;
    }

    /* ── Cards ── */
    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1px;
    }
    .card {
      background-color: var(--cds-layer-01);
      padding: var(--cds-spacing-07);
      display: flex;
      flex-direction: column;
      gap: var(--cds-spacing-04);
      transition: background-color 0.15s;
    }
    .card:hover { background-color: var(--cds-layer-02); }
    .card__title { font-size: 1.25rem; font-weight: 400; }
    .card__desc { font-size: 0.875rem; color: var(--cds-text-secondary); }

    /* ── Feature ── */
    .feature-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--cds-spacing-10);
      align-items: center;
    }
    .feature-row--reverse { direction: rtl; }
    .feature-row--reverse > * { direction: ltr; }
    @media (max-width: 671px) { .feature-row { grid-template-columns: 1fr; } }
    .feature-image {
      width: 100%;
      aspect-ratio: 16/9;
      background-color: var(--cds-layer-01);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--cds-text-secondary);
      font-size: 0.875rem;
    }

    /* ── Quote ── */
    .quote-block {
      border-left: 4px solid var(--cds-interactive);
      padding-left: var(--cds-spacing-07);
    }
    .quote-text { font-size: 1.75rem; font-weight: 300; line-height: 1.3; font-style: italic; }
    .quote-author { margin-top: var(--cds-spacing-05); font-size: 0.875rem; font-weight: 600; }
    .quote-role { font-size: 0.875rem; color: var(--cds-text-secondary); }

    /* ── Pricing ── */
    .pricing-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1px;
    }
    .pricing-card {
      background-color: var(--cds-layer-01);
      padding: var(--cds-spacing-07);
      display: flex;
      flex-direction: column;
      gap: var(--cds-spacing-05);
    }
    .pricing-card--highlighted {
      border-top: 3px solid var(--cds-interactive);
    }
    .pricing-price { font-size: 2.625rem; font-weight: 300; }
    .pricing-features { list-style: none; padding: 0; }
    .pricing-features li {
      padding: var(--cds-spacing-03) 0;
      border-top: 1px solid var(--cds-border-subtle);
      font-size: 0.875rem;
    }

    /* ── FAQ ── */
    .accordion-item {
      border-top: 1px solid var(--cds-border-subtle);
    }
    .accordion-trigger {
      width: 100%;
      padding: var(--cds-spacing-05) 0;
      background: none;
      border: none;
      text-align: left;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--cds-text-primary);
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .accordion-trigger::after { content: '+'; font-size: 1.25rem; }
    .accordion-trigger[aria-expanded="true"]::after { content: '−'; }
    .accordion-content {
      padding: 0 0 var(--cds-spacing-05);
      font-size: 0.875rem;
      color: var(--cds-text-secondary);
      display: none;
    }
    .accordion-content.is-open { display: block; }

    /* ── Header ── */
    .site-header {
      position: sticky;
      top: 0;
      z-index: 100;
      background-color: var(--cds-background);
      border-bottom: 1px solid var(--cds-border-subtle);
      height: 3rem;
    }
    .site-header .cds-grid {
      display: flex;
      align-items: center;
      height: 100%;
      gap: var(--cds-spacing-05);
    }
    .site-header__brand {
      font-size: 0.875rem;
      font-weight: 600;
      text-decoration: none;
      color: var(--cds-text-primary);
    }
    .site-header__nav {
      display: flex;
      gap: var(--cds-spacing-05);
      margin-left: auto;
      list-style: none;
    }
    .site-header__nav a {
      font-size: 0.875rem;
      text-decoration: none;
      color: var(--cds-text-secondary);
      padding: 0.875rem 1rem;
      transition: color 0.15s;
    }
    .site-header__nav a:hover { color: var(--cds-text-primary); }
    @media (max-width: 671px) {
      .site-header__nav { display: none; }
    }

    /* ── Footer ── */
    .site-footer {
      background-color: var(--cds-layer-01);
      padding: var(--cds-spacing-10) 0 var(--cds-spacing-07);
      border-top: 1px solid var(--cds-border-subtle);
    }
    .footer-groups {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: var(--cds-spacing-07);
      margin-bottom: var(--cds-spacing-07);
    }
    .footer-group__title {
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: var(--cds-spacing-04);
    }
    .footer-group__links { list-style: none; padding: 0; }
    .footer-group__links li { margin-bottom: var(--cds-spacing-03); }
    .footer-group__links a {
      font-size: 0.875rem;
      color: var(--cds-text-secondary);
      text-decoration: none;
    }
    .footer-group__links a:hover { color: var(--cds-text-primary); }
    .footer-legal {
      padding-top: var(--cds-spacing-05);
      border-top: 1px solid var(--cds-border-subtle);
      font-size: 0.75rem;
      color: var(--cds-text-secondary);
      display: flex;
      gap: var(--cds-spacing-05);
      flex-wrap: wrap;
    }
    .footer-legal a { color: var(--cds-text-secondary); text-decoration: none; }

    /* ── Logo Grid ── */
    .logo-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: var(--cds-spacing-07);
      align-items: center;
      justify-items: center;
    }
    .logo-grid img { max-width: 120px; max-height: 48px; opacity: 0.6; }

    /* ── Utility ── */
    .sr-only {
      position: absolute; width: 1px; height: 1px;
      padding: 0; margin: -1px; overflow: hidden;
      clip: rect(0,0,0,0); border: 0;
    }
    a { color: var(--cds-link-primary); }
  </style>
</head>
<body>
  ${navHtml}

  <main>
    ${sectionsHtml}
  </main>

  <script>
    // Accordion toggle
    document.querySelectorAll('.accordion-trigger').forEach(btn => {
      btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', !expanded);
        btn.nextElementSibling.classList.toggle('is-open');
      });
    });
  </script>
</body>
</html>`;
}

// ─── Section Renderers ─────────────────────────────────────────────

function renderHero({ section, component, site }) {
  const heading = section.name || site.name;
  const description = getTextContent(section) || site.brandDescription || '';

  return `<section class="section section--hero" aria-label="${escapeHtml(heading)}">
  <div class="cds-grid">
    ${component.variant === 'centered' ? '<div style="text-align: center; max-width: 800px; margin: 0 auto;">' : '<div style="max-width: 640px;">'}
      <h1>${escapeHtml(heading)}</h1>
      <p style="margin-top: var(--cds-spacing-05); font-size: 1.25rem;">${escapeHtml(description)}</p>
      <div style="margin-top: var(--cds-spacing-07); display: flex; gap: var(--cds-spacing-03);${component.variant === 'centered' ? ' justify-content: center;' : ''}">
        <a href="#" class="btn btn--primary">Get Started</a>
        <a href="#" class="btn btn--secondary">Learn More</a>
      </div>
    </div>
  </div>
</section>`;
}

function renderFeature({ section, component }) {
  const heading = section.name || 'Feature';
  const description = getTextContent(section);
  const isReverse = component.variant === 'image-right';

  return `<section class="section" aria-label="${escapeHtml(heading)}">
  <div class="cds-grid">
    <div class="feature-row${isReverse ? ' feature-row--reverse' : ''}">
      <div class="feature-image" aria-hidden="true">[Image]</div>
      <div>
        <div class="eyebrow">${escapeHtml(section.sectionType || 'Feature')}</div>
        <h2>${escapeHtml(heading)}</h2>
        <p style="margin-top: var(--cds-spacing-05);">${escapeHtml(description)}</p>
        <a href="#" class="btn btn--primary" style="margin-top: var(--cds-spacing-07);">Learn More</a>
      </div>
    </div>
  </div>
</section>`;
}

function renderContent({ section }) {
  const heading = section.name || 'Content';
  const body = section.content ? blocksToHtml(section.content) : `<p>${escapeHtml(getTextContent(section))}</p>`;

  return `<section class="section" aria-label="${escapeHtml(heading)}">
  <div class="cds-grid">
    <div style="max-width: 800px;">
      <h2>${escapeHtml(heading)}</h2>
      <div style="margin-top: var(--cds-spacing-05);">${body}</div>
    </div>
  </div>
</section>`;
}

function renderCardGrid({ section, contentDatabases }) {
  const heading = section.name || 'Services';
  const items = contentDatabases?.services || [];

  const cardsHtml = items.length > 0
    ? items.map((s) => `<div class="card">
        <h4 class="card__title">${escapeHtml(s.name)}</h4>
        <p class="card__desc">${escapeHtml(s.description || '')}</p>
        ${s.ctaLabel ? `<a href="${escapeHtml(s.ctaLink || '#')}" class="btn btn--secondary" style="margin-top: auto;">${escapeHtml(s.ctaLabel)}</a>` : ''}
      </div>`).join('\n')
    : Array.from({ length: 3 }, (_, i) => `<div class="card">
        <h4 class="card__title">Item ${i + 1}</h4>
        <p class="card__desc">Description for this item.</p>
      </div>`).join('\n');

  return `<section class="section section--alt" aria-label="${escapeHtml(heading)}">
  <div class="cds-grid">
    <h2 style="margin-bottom: var(--cds-spacing-07);">${escapeHtml(heading)}</h2>
    <div class="card-grid">
      ${cardsHtml}
    </div>
  </div>
</section>`;
}

function renderCta({ section, site }) {
  const heading = section.name || `Get started with ${site.name}`;
  const description = getTextContent(section);

  return `<section class="section section--alt" aria-label="${escapeHtml(heading)}">
  <div class="cds-grid">
    <div style="max-width: 640px;">
      <h2>${escapeHtml(heading)}</h2>
      ${description ? `<p style="margin-top: var(--cds-spacing-05);">${escapeHtml(description)}</p>` : ''}
      <div style="margin-top: var(--cds-spacing-07); display: flex; gap: var(--cds-spacing-03);">
        <a href="#" class="btn btn--primary">Get Started</a>
        <a href="#" class="btn btn--secondary">Contact Us</a>
      </div>
    </div>
  </div>
</section>`;
}

function renderTestimonial({ section, contentDatabases }) {
  const testimonials = contentDatabases?.testimonials || [];
  const t = testimonials[0];

  if (t) {
    return `<section class="section" aria-label="Testimonial">
  <div class="cds-grid">
    <div class="quote-block" style="max-width: 720px;">
      <p class="quote-text">"${escapeHtml(t.quote)}"</p>
      <p class="quote-author">${escapeHtml(t.author)}</p>
      <p class="quote-role">${escapeHtml(t.role || '')}</p>
    </div>
  </div>
</section>`;
  }

  const heading = section.name || 'What our customers say';
  return `<section class="section" aria-label="${escapeHtml(heading)}">
  <div class="cds-grid">
    <div class="quote-block" style="max-width: 720px;">
      <p class="quote-text">"${escapeHtml(heading)}"</p>
      <p class="quote-author">Customer Name</p>
      <p class="quote-role">Role, Company</p>
    </div>
  </div>
</section>`;
}

function renderLogoWall({ section }) {
  const heading = section.name || 'Trusted by';
  return `<section class="section" aria-label="${escapeHtml(heading)}">
  <div class="cds-grid">
    <p style="text-align: center; font-size: 0.875rem; color: var(--cds-text-secondary); margin-bottom: var(--cds-spacing-07);">${escapeHtml(heading)}</p>
    <div class="logo-grid">
      ${Array.from({ length: 6 }, (_, i) => `<div style="width:120px;height:48px;background:var(--cds-layer-01);display:flex;align-items:center;justify-content:center;font-size:0.75rem;color:var(--cds-text-secondary);">Logo ${i + 1}</div>`).join('\n      ')}
    </div>
  </div>
</section>`;
}

function renderPricing({ section }) {
  const heading = section.name || 'Pricing';
  const tiers = [
    { name: 'Free', price: '$0', features: ['Basic features', 'Community support', '1 project'] },
    { name: 'Pro', price: '$29', features: ['All features', 'Priority support', 'Unlimited projects', 'API access'], highlighted: true },
    { name: 'Enterprise', price: 'Custom', features: ['Everything in Pro', 'Dedicated support', 'Custom integrations', 'SLA'] },
  ];

  return `<section class="section" aria-label="${escapeHtml(heading)}">
  <div class="cds-grid">
    <h2 style="text-align: center; margin-bottom: var(--cds-spacing-09);">${escapeHtml(heading)}</h2>
    <div class="pricing-grid">
      ${tiers.map((t) => `<div class="pricing-card${t.highlighted ? ' pricing-card--highlighted' : ''}">
        <h3>${t.name}</h3>
        <p class="pricing-price">${t.price}</p>
        <p style="font-size: 0.875rem; color: var(--cds-text-secondary);">per month</p>
        <ul class="pricing-features">
          ${t.features.map((f) => `<li>${escapeHtml(f)}</li>`).join('\n          ')}
        </ul>
        <a href="#" class="btn btn--${t.highlighted ? 'primary' : 'secondary'}" style="margin-top: auto;">Get Started</a>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>`;
}

function renderFaq({ section }) {
  const heading = section.name || 'Frequently Asked Questions';
  const items = [
    { q: 'How does it work?', a: 'Our AI-powered platform generates content from your knowledge base automatically.' },
    { q: 'What integrations are supported?', a: 'We support Notion as the primary content source, with GitHub Pages for publishing.' },
    { q: 'Is it free to use?', a: 'We offer a free tier with basic features. Premium plans are available for advanced needs.' },
  ];

  return `<section class="section" aria-label="${escapeHtml(heading)}">
  <div class="cds-grid">
    <div style="max-width: 800px;">
      <h2 style="margin-bottom: var(--cds-spacing-07);">${escapeHtml(heading)}</h2>
      <div>
        ${items.map((item, i) => `<div class="accordion-item">
          <button class="accordion-trigger" aria-expanded="false" aria-controls="faq-${i}">
            ${escapeHtml(item.q)}
          </button>
          <div class="accordion-content" id="faq-${i}">
            <p>${escapeHtml(item.a)}</p>
          </div>
        </div>`).join('\n        ')}
      </div>
    </div>
  </div>
</section>`;
}

function renderHeader({ section, site }) {
  return ''; // Header is rendered via generateNavigation
}

function renderFooter({ section, site, contentDatabases }) {
  const name = site.name || 'Site';
  const year = new Date().getFullYear();
  return `<footer class="site-footer" role="contentinfo">
  <div class="cds-grid">
    <div class="footer-groups">
      <div>
        <p class="footer-group__title">${escapeHtml(name)}</p>
        <ul class="footer-group__links">
          <li><a href="/">Home</a></li>
          <li><a href="/features">Features</a></li>
          <li><a href="/pricing">Pricing</a></li>
        </ul>
      </div>
      <div>
        <p class="footer-group__title">Resources</p>
        <ul class="footer-group__links">
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
          <li><a href="/blog">Blog</a></li>
        </ul>
      </div>
      <div>
        <p class="footer-group__title">Legal</p>
        <ul class="footer-group__links">
          <li><a href="/privacy">Privacy Policy</a></li>
          <li><a href="/terms">Terms of Service</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-legal">
      <span>&copy; ${year} ${escapeHtml(name)}. All rights reserved.</span>
      <span>Built with <a href="https://intelligentoperations.ai">intelligentoperations.ai</a></span>
    </div>
  </div>
</footer>`;
}

function renderNavigation({ section }) {
  return ''; // Handled by page-level nav
}

function renderLinkList({ section }) {
  const heading = section.name || 'Resources';
  return `<section class="section" aria-label="${escapeHtml(heading)}">
  <div class="cds-grid">
    <h2 style="margin-bottom: var(--cds-spacing-07);">${escapeHtml(heading)}</h2>
    <ul style="list-style: none; padding: 0;">
      <li style="padding: var(--cds-spacing-04) 0; border-top: 1px solid var(--cds-border-subtle);"><a href="#">Resource 1 →</a></li>
      <li style="padding: var(--cds-spacing-04) 0; border-top: 1px solid var(--cds-border-subtle);"><a href="#">Resource 2 →</a></li>
      <li style="padding: var(--cds-spacing-04) 0; border-top: 1px solid var(--cds-border-subtle);"><a href="#">Resource 3 →</a></li>
    </ul>
  </div>
</section>`;
}

// ─── Navigation Generator ──────────────────────────────────────────

function generateNavigation(allPages, currentPage, site) {
  const navPages = (allPages || [])
    .filter((p) => !p.isGlobal && p.status !== 'Draft')
    .sort((a, b) => (a.navOrder || 0) - (b.navOrder || 0));

  const links = navPages.map((p) => {
    const isCurrent = p.id === currentPage?.id;
    return `<li><a href="${escapeHtml(p.route || '/')}"${isCurrent ? ' aria-current="page"' : ''}>${escapeHtml(p.name)}</a></li>`;
  }).join('\n        ');

  return `<header class="site-header">
    <div class="cds-grid">
      <a href="/" class="site-header__brand">${escapeHtml(site.name)}</a>
      <nav aria-label="Main navigation">
        <ul class="site-header__nav">
          ${links}
        </ul>
      </nav>
    </div>
  </header>`;
}

// ─── Helpers ───────────────────────────────────────────────────────

function getTextContent(section) {
  if (section.content && Array.isArray(section.content)) {
    return section.content
      .filter((b) => b.type === 'paragraph')
      .map((b) => b.text || '')
      .join(' ')
      .slice(0, 300);
  }
  return '';
}

function buildCanonicalUrl(domain, route) {
  const base = domain?.startsWith('http') ? domain : `https://${domain}`;
  const cleanRoute = route === '/' ? '' : route;
  return `${base}${cleanRoute}`;
}

function adjustColor(hex, amount) {
  hex = hex.replace('#', '');
  const num = parseInt(hex, 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
