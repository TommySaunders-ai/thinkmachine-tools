/**
 * AI Sitemap Generator
 *
 * Uses Claude to generate a complete page tree with sections
 * from Notion site configuration and content databases.
 *
 * Two modes:
 *   A) Full sitemap generation — produces complete page hierarchy
 *   B) Individual page generation — produces sections for one page
 */

/**
 * Generate a full sitemap from site configuration.
 *
 * This function produces a structured sitemap that can be written
 * back to Notion's Pages and Sections databases, or used directly
 * by the HTML generator.
 *
 * @param {Object} params
 * @param {Object} params.site - Site configuration from Notion
 * @param {Object} params.contentDatabases - Services, testimonials, team data
 * @param {Function} [params.aiGenerate] - AI generation function (Claude API call)
 * @returns {Object} Generated sitemap with pages and sections
 */
export async function generateSitemap({ site, contentDatabases, aiGenerate }) {
  const context = buildSitemapContext(site, contentDatabases);

  // If an AI generation function is provided, use it
  if (aiGenerate) {
    const prompt = buildSitemapPrompt(context);
    const result = await aiGenerate(prompt);
    return parseSitemapResult(result);
  }

  // Otherwise, use rule-based generation
  return generateRuleBasedSitemap(context);
}

/**
 * Generate sections for a single page.
 */
export async function generatePageSections({ page, site, contentDatabases, aiGenerate }) {
  const context = buildSitemapContext(site, contentDatabases);

  if (aiGenerate) {
    const prompt = buildPageSectionsPrompt(context, page);
    const result = await aiGenerate(prompt);
    return parsePageSectionsResult(result);
  }

  return generateRuleBasedPageSections(page, context);
}

// ─── Context Building ──────────────────────────────────────────────

function buildSitemapContext(site, contentDatabases) {
  const services = contentDatabases?.services || [];
  const testimonials = contentDatabases?.testimonials || [];
  const team = contentDatabases?.team || [];

  return {
    businessType: site.businessType || 'SaaS',
    name: site.name || 'Website',
    description: site.brandDescription || '',
    audience: site.targetAudience || [],
    serviceCount: services.length,
    serviceNames: services.map((s) => s.name),
    hasTestimonials: testimonials.length > 0,
    testimonialCount: testimonials.length,
    teamCount: team.length,
    hasPricing: services.some((s) => s.pricing != null),
  };
}

// ─── AI Prompt Templates ───────────────────────────────────────────

function buildSitemapPrompt(context) {
  return `You are a website information architect. Generate a sitemap for the following business:

Business Type: ${context.businessType}
Business Name: ${context.name}
Description: ${context.description}
Target Audience: ${context.audience.join(', ') || 'General'}
Number of Services/Products: ${context.serviceCount}
Service Names: ${context.serviceNames.join(', ') || 'Not specified'}
Has Testimonials: ${context.hasTestimonials ? `Yes (${context.testimonialCount})` : 'No'}
Has Team Page Content: ${context.teamCount > 0 ? `Yes (${context.teamCount} members)` : 'No'}
Has Pricing: ${context.hasPricing ? 'Yes' : 'No'}

Generate a JSON sitemap with this structure:
{
  "pages": [
    {
      "name": "Page Name",
      "route": "/page-route",
      "pageType": "Landing|Detail|Utility|Blog Post",
      "navOrder": 1,
      "sections": [
        {
          "name": "Section description",
          "sectionType": "Hero|Feature|Content|CTA|Testimonial|Pricing|FAQ|Cards|Logo Wall",
          "order": 1
        }
      ]
    }
  ]
}

Rules:
- Home page is always first with route "/"
- Include utility pages (Privacy Policy, Terms, 404) as pageType "Utility"
- Each page should have 4-8 sections
- Hero sections should always be first on landing pages
- CTA sections should be near the bottom
- Include a Pricing page if the business has pricing
- Include an About/Team page if team members exist
- Include a Contact page
- Section names should be descriptive of the content, not generic

Respond with ONLY the JSON object, no markdown formatting.`;
}

function buildPageSectionsPrompt(context, page) {
  return `Generate sections for a "${page.name}" page on a ${context.businessType} website called "${context.name}".

Page Type: ${page.pageType || 'Landing'}
Business Description: ${context.description}
Available Services: ${context.serviceNames.join(', ') || 'Not specified'}

Generate a JSON array of sections:
[
  {
    "name": "Descriptive section name",
    "sectionType": "Hero|Feature|Content|CTA|Testimonial|Pricing|FAQ|Cards|Logo Wall",
    "order": 1
  }
]

Respond with ONLY the JSON array.`;
}

// ─── Result Parsers ────────────────────────────────────────────────

function parseSitemapResult(result) {
  try {
    // Strip markdown code blocks if present
    const cleaned = result.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    console.warn('[sitemap-gen] Failed to parse AI result, falling back to rule-based');
    return null;
  }
}

function parsePageSectionsResult(result) {
  try {
    const cleaned = result.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

// ─── Rule-Based Generation (Fallback) ──────────────────────────────

function generateRuleBasedSitemap(context) {
  const pages = [];

  // Home page
  pages.push({
    name: 'Home',
    route: '/',
    pageType: 'Landing',
    navOrder: 1,
    sections: [
      { name: `${context.name} — ${context.description?.slice(0, 60) || 'Welcome'}`, sectionType: 'Hero', order: 1 },
      ...(context.serviceCount > 0
        ? [{ name: `Our ${context.businessType === 'SaaS' ? 'Tools' : 'Services'}`, sectionType: 'Cards', order: 2 }]
        : []),
      { name: `Why choose ${context.name}`, sectionType: 'Feature', order: 3 },
      { name: `How ${context.name} works`, sectionType: 'Content', order: 4 },
      ...(context.hasTestimonials
        ? [{ name: 'What our customers say', sectionType: 'Testimonial', order: 5 }]
        : []),
      { name: 'Trusted by leading companies', sectionType: 'Logo Wall', order: 6 },
      { name: `Get started with ${context.name}`, sectionType: 'CTA', order: 7 },
    ],
  });

  // Services/Products page (if services exist)
  if (context.serviceCount > 0) {
    pages.push({
      name: context.businessType === 'SaaS' ? 'Features' : 'Services',
      route: context.businessType === 'SaaS' ? '/features' : '/services',
      pageType: 'Landing',
      navOrder: 2,
      sections: [
        { name: `Explore our ${context.businessType === 'SaaS' ? 'features' : 'services'}`, sectionType: 'Hero', order: 1 },
        { name: `All ${context.serviceNames.length} ${context.businessType === 'SaaS' ? 'tools' : 'services'}`, sectionType: 'Cards', order: 2 },
        { name: 'Key capabilities', sectionType: 'Feature', order: 3 },
        { name: 'Built for your workflow', sectionType: 'Feature', order: 4 },
        { name: `Start using ${context.name}`, sectionType: 'CTA', order: 5 },
      ],
    });
  }

  // Pricing page
  if (context.hasPricing) {
    pages.push({
      name: 'Pricing',
      route: '/pricing',
      pageType: 'Landing',
      navOrder: 3,
      sections: [
        { name: 'Simple, transparent pricing', sectionType: 'Hero', order: 1 },
        { name: 'Choose your plan', sectionType: 'Pricing', order: 2 },
        { name: 'Compare plan features', sectionType: 'Content', order: 3 },
        { name: 'Frequently asked questions', sectionType: 'FAQ', order: 4 },
        { name: 'Ready to get started?', sectionType: 'CTA', order: 5 },
      ],
    });
  }

  // About page
  if (context.teamCount > 0) {
    pages.push({
      name: 'About',
      route: '/about',
      pageType: 'Landing',
      navOrder: 4,
      sections: [
        { name: `About ${context.name}`, sectionType: 'Hero', order: 1 },
        { name: 'Our mission', sectionType: 'Content', order: 2 },
        { name: `Meet the team (${context.teamCount} members)`, sectionType: 'Cards', order: 3 },
        { name: 'Join our team', sectionType: 'CTA', order: 4 },
      ],
    });
  }

  // Contact page
  pages.push({
    name: 'Contact',
    route: '/contact',
    pageType: 'Landing',
    navOrder: 5,
    sections: [
      { name: 'Get in touch', sectionType: 'Hero', order: 1 },
      { name: 'Contact information', sectionType: 'Content', order: 2 },
      { name: 'Frequently asked questions', sectionType: 'FAQ', order: 3 },
    ],
  });

  // Utility pages
  pages.push(
    {
      name: 'Privacy Policy',
      route: '/privacy',
      pageType: 'Utility',
      navOrder: 100,
      sections: [
        { name: 'Privacy Policy', sectionType: 'Content', order: 1 },
      ],
    },
    {
      name: 'Terms of Service',
      route: '/terms',
      pageType: 'Utility',
      navOrder: 101,
      sections: [
        { name: 'Terms of Service', sectionType: 'Content', order: 1 },
      ],
    },
  );

  return { pages };
}

function generateRuleBasedPageSections(page, context) {
  const name = page.name?.toLowerCase() || '';

  if (name.includes('home') || page.route === '/') {
    return [
      { name: `Welcome to ${context.name}`, sectionType: 'Hero', order: 1 },
      { name: 'What we offer', sectionType: 'Cards', order: 2 },
      { name: 'Why choose us', sectionType: 'Feature', order: 3 },
      { name: 'Get started today', sectionType: 'CTA', order: 4 },
    ];
  }

  // Default page structure
  return [
    { name: page.name || 'Page', sectionType: 'Hero', order: 1 },
    { name: `About ${page.name}`, sectionType: 'Content', order: 2 },
    { name: 'Learn more', sectionType: 'CTA', order: 3 },
  ];
}
