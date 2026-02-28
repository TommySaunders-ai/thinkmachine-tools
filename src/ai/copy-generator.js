/**
 * AI Copy Generator
 *
 * Generates polished copywriting for each component's content slots
 * using full-page context + Notion data. Powered by Claude (or falls
 * back to template-based generation when no API key is available).
 */

/**
 * Generate copy for all sections of a page.
 *
 * @param {Object} params
 * @param {Object} params.page - Page data with sections
 * @param {Object} params.site - Site configuration
 * @param {Object} params.contentDatabases - Services, testimonials, team data
 * @param {Array}  params.componentSelections - Array of { section, component } from selector
 * @param {Function} [params.aiGenerate] - AI generation function (Claude API call)
 * @returns {Array} Component selections with hydrated content slots
 */
export async function generatePageCopy({
  page,
  site,
  contentDatabases,
  componentSelections,
  aiGenerate,
}) {
  if (aiGenerate) {
    return generateWithAI({ page, site, contentDatabases, componentSelections, aiGenerate });
  }

  return generateWithTemplates({ page, site, contentDatabases, componentSelections });
}

// ─── AI-Powered Copy Generation ────────────────────────────────────

async function generateWithAI({ page, site, contentDatabases, componentSelections, aiGenerate }) {
  const prompt = buildCopyPrompt({ page, site, contentDatabases, componentSelections });

  try {
    const result = await aiGenerate(prompt);
    const parsed = JSON.parse(
      result.replace(/```json?\n?/g, '').replace(/```/g, '').trim()
    );

    // Merge AI-generated copy into component selections
    return componentSelections.map((cs, i) => ({
      ...cs,
      copy: parsed[i] || generateTemplateCopy(cs, site, contentDatabases),
    }));
  } catch {
    console.warn('[copy-gen] AI generation failed, using templates');
    return generateWithTemplates({ page, site, contentDatabases, componentSelections });
  }
}

function buildCopyPrompt({ page, site, contentDatabases, componentSelections }) {
  const sectionsDesc = componentSelections.map((cs, i) => {
    const slots = Object.keys(cs.component.contentSlots).join(', ');
    return `Section ${i + 1}: "${cs.section.name}" (${cs.component.category}) — needs: ${slots}`;
  }).join('\n');

  const services = (contentDatabases?.services || [])
    .map((s) => `- ${s.name}: ${s.description?.slice(0, 100) || ''}`)
    .join('\n');

  return `You are a professional copywriter. Generate website copy for the "${page.name}" page of "${site.name}".

Business Type: ${site.businessType || 'SaaS'}
Brand Description: ${site.brandDescription || ''}
Target Audience: ${(site.targetAudience || []).join(', ') || 'General'}

Available Services/Products:
${services || 'Not specified'}

Sections to fill:
${sectionsDesc}

IMPORTANT:
- Write professional, compelling copy
- Use consistent tone across all sections
- Don't repeat phrases between sections
- Each section's copy should flow naturally to the next
- Be specific to the business, not generic

Generate a JSON array where each element corresponds to a section and contains
the content for each slot. Example format:
[
  { "heading": "...", "description": "...", "primaryCTA": "Get Started" },
  { "heading": "...", "description": "...", "image": "[placeholder]" }
]

Respond with ONLY the JSON array.`;
}

// ─── Template-Based Copy Generation ────────────────────────────────

function generateWithTemplates({ page, site, contentDatabases, componentSelections }) {
  return componentSelections.map((cs) => ({
    ...cs,
    copy: generateTemplateCopy(cs, site, contentDatabases),
  }));
}

function generateTemplateCopy(cs, site, contentDatabases) {
  const { section, component } = cs;
  const category = component.category;
  const name = site.name || 'Our Platform';
  const sectionName = section.name || '';

  switch (category) {
    case 'hero':
      return {
        heading: sectionName || `Welcome to ${name}`,
        description: site.brandDescription?.slice(0, 200) || `${name} helps you achieve more with less effort.`,
        primaryCTA: 'Get Started',
        secondaryCTA: 'Learn More',
      };

    case 'feature':
      return {
        eyebrow: section.sectionType || 'Feature',
        heading: sectionName || 'Built for your workflow',
        description: `${name} provides powerful tools designed to streamline your operations and boost productivity.`,
        primaryCTA: 'Learn More',
      };

    case 'content':
      return {
        heading: sectionName || 'About Us',
        description: site.brandDescription || `${name} is committed to delivering exceptional value through innovative solutions.`,
      };

    case 'card-grid': {
      const services = contentDatabases?.services || [];
      return {
        heading: sectionName || 'Our Services',
        cards: services.length > 0
          ? services.map((s) => ({
              heading: s.name,
              description: s.description?.slice(0, 120) || '',
              cta: s.ctaLabel || 'Learn More',
            }))
          : [
              { heading: 'Feature One', description: 'Description of the first feature.', cta: 'Learn More' },
              { heading: 'Feature Two', description: 'Description of the second feature.', cta: 'Learn More' },
              { heading: 'Feature Three', description: 'Description of the third feature.', cta: 'Learn More' },
            ],
      };
    }

    case 'cta':
      return {
        heading: sectionName || `Ready to get started with ${name}?`,
        description: `Join thousands of teams already using ${name} to transform their workflow.`,
        primaryCTA: 'Get Started Free',
        secondaryCTA: 'Contact Sales',
      };

    case 'testimonial': {
      const testimonials = contentDatabases?.testimonials || [];
      const t = testimonials[0];
      return {
        quote: t?.quote || `${name} has completely transformed how we work. The results speak for themselves.`,
        author: t?.author || 'Customer Name',
        role: t?.role || 'Role, Company',
      };
    }

    case 'pricing':
      return {
        heading: sectionName || 'Simple, transparent pricing',
        description: `Choose the plan that fits your needs. All plans include core ${name} features.`,
      };

    case 'faq':
      return {
        heading: sectionName || 'Frequently Asked Questions',
        items: [
          { question: `What is ${name}?`, answer: site.brandDescription?.slice(0, 200) || `${name} is a platform designed to help you work smarter.` },
          { question: 'How do I get started?', answer: `Sign up for a free account and follow our onboarding guide to get started with ${name} in minutes.` },
          { question: 'Is there a free plan?', answer: `Yes! ${name} offers a free tier with essential features. Upgrade anytime for more capabilities.` },
        ],
      };

    case 'logo-wall':
      return {
        heading: sectionName || 'Trusted by leading companies',
      };

    default:
      return {
        heading: sectionName || 'Section',
        description: '',
      };
  }
}
