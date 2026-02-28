/**
 * Component Selector — 5-Dimensional Scoring Algorithm
 *
 * Selects the best Carbon component for a given section based on:
 *   1. Category match (section type → component category)
 *   2. Industry/style match (business type → component suitability)
 *   3. Content count match (number of items → component layout)
 *   4. Position/placement match (where the section appears on the page)
 *   5. Cross-page coherence (avoid repetition, maintain consistency)
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const registryPath = join(__dirname, 'registry', 'components.json');
let _registry = null;

function getRegistry() {
  if (!_registry) {
    _registry = JSON.parse(readFileSync(registryPath, 'utf-8'));
  }
  return _registry;
}

// ─── Section Type → Category Mapping ───────────────────────────────

const SECTION_TYPE_TO_CATEGORY = {
  hero: 'hero',
  header: 'header',
  feature: 'feature',
  features: 'feature',
  content: 'content',
  'content-block': 'content',
  'card-grid': 'card-grid',
  cards: 'card-grid',
  services: 'card-grid',
  products: 'card-grid',
  catalog: 'card-grid',
  cta: 'cta',
  'call-to-action': 'cta',
  testimonial: 'testimonial',
  testimonials: 'testimonial',
  quote: 'testimonial',
  'logo-wall': 'logo-wall',
  logos: 'logo-wall',
  partners: 'logo-wall',
  clients: 'logo-wall',
  pricing: 'pricing',
  plans: 'pricing',
  faq: 'faq',
  questions: 'faq',
  accordion: 'faq',
  footer: 'footer',
  navigation: 'navigation',
  toc: 'navigation',
  'link-list': 'link-list',
  links: 'link-list',
  resources: 'link-list',
};

// ─── Placement Mapping ─────────────────────────────────────────────

function getPlacementZone(index, totalSections) {
  if (index === 0) return 'page-top';
  if (index === 1) return 'after-hero';
  if (index >= totalSections - 2) return 'page-bottom';
  return 'mid-page';
}

// ─── Scoring Functions ─────────────────────────────────────────────

function scoreCategoryMatch(component, sectionType) {
  const normalizedType = sectionType.toLowerCase().replace(/\s+/g, '-');
  const category = SECTION_TYPE_TO_CATEGORY[normalizedType] || normalizedType;

  if (component.category === category) return 40;
  // Partial match via tags
  if (component.tags.includes(normalizedType)) return 25;
  return 0;
}

function scoreIndustryMatch(component, businessType) {
  if (!businessType) return 5;
  const normalized = businessType.toLowerCase().replace(/\s+/g, '-');
  if (component.suitableFor.includes(normalized)) return 20;
  // Partial match
  if (component.suitableFor.some((s) => normalized.includes(s) || s.includes(normalized))) return 10;
  return 0;
}

function scoreContentCount(component, contentCount) {
  if (!contentCount || !component.contentCount) return 5;
  if (component.contentCount === contentCount) return 15;
  if (Math.abs(component.contentCount - contentCount) <= 1) return 8;
  return 0;
}

function scorePlacement(component, index, totalSections) {
  const zone = getPlacementZone(index, totalSections);
  if (component.placementHint === zone) return 15;
  if (component.placementHint === 'any') return 10;
  // Penalize wrong placement
  if (component.placementHint === 'page-top' && zone !== 'page-top') return -10;
  if (component.placementHint === 'page-bottom' && zone === 'page-top') return -10;
  return 3;
}

function scoreCrossPageCoherence(component, usedComponentIds, previousComponentId) {
  let score = 10;

  // Penalize repeating the exact same component consecutively
  if (component.id === previousComponentId) {
    score -= 15;
  }

  // Slight penalty for overusing a component across pages
  const usageCount = usedComponentIds.filter((id) => id === component.id).length;
  if (usageCount > 2) {
    score -= usageCount * 2;
  }

  // Bonus for following pairing rules
  if (previousComponentId) {
    const prevCategory = previousComponentId.split('-')[0];
    if (component.pairingRules.neverFollowedBy?.some((n) => prevCategory.includes(n))) {
      score -= 20;
    }
  }

  return Math.max(score, -10);
}

// ─── Tag Matching (bonus for keyword overlap) ──────────────────────

function scoreTagMatch(component, sectionName, sectionDescription) {
  const text = `${sectionName} ${sectionDescription || ''}`.toLowerCase();
  let bonus = 0;
  for (const tag of component.tags) {
    if (text.includes(tag)) bonus += 3;
  }
  return Math.min(bonus, 15);
}

// ─── Main Selection Function ───────────────────────────────────────

/**
 * Select the best Carbon component for a section.
 *
 * @param {Object} params
 * @param {string} params.sectionType - e.g., "Hero", "Feature", "CTA"
 * @param {string} params.sectionName - Full section name/title
 * @param {string} params.sectionDescription - Section description text
 * @param {string} params.businessType - e.g., "SaaS", "Agency"
 * @param {number|null} params.contentCount - Number of items in the section
 * @param {number} params.sectionIndex - Position of this section on the page
 * @param {number} params.totalSections - Total sections on the page
 * @param {string[]} params.usedComponentIds - IDs of components already used
 * @param {string|null} params.previousComponentId - ID of the previous section's component
 * @param {string|null} params.componentOverride - Explicit component ID override from Notion
 * @returns {{ component: Object, score: number, scores: Object }}
 */
export function selectComponent({
  sectionType,
  sectionName = '',
  sectionDescription = '',
  businessType = '',
  contentCount = null,
  sectionIndex = 0,
  totalSections = 1,
  usedComponentIds = [],
  previousComponentId = null,
  componentOverride = null,
}) {
  const registry = getRegistry();

  // If an explicit override is specified, use it directly
  if (componentOverride) {
    const override = registry.find((c) => c.id === componentOverride);
    if (override) {
      return { component: override, score: 100, scores: { override: true } };
    }
  }

  // Parse content count from section name/description if not provided
  if (contentCount === null) {
    contentCount = parseContentCount(`${sectionName} ${sectionDescription || ''}`);
  }

  // Score all components
  const scored = registry.map((component) => {
    const scores = {
      category: scoreCategoryMatch(component, sectionType),
      industry: scoreIndustryMatch(component, businessType),
      contentCount: scoreContentCount(component, contentCount),
      placement: scorePlacement(component, sectionIndex, totalSections),
      coherence: scoreCrossPageCoherence(component, usedComponentIds, previousComponentId),
      tags: scoreTagMatch(component, sectionName, sectionDescription),
    };

    const total = Object.values(scores).reduce((sum, s) => sum + s, 0);
    return { component, score: total, scores };
  });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Return the best match (or the top candidate if no category match found)
  return scored[0] || { component: registry[0], score: 0, scores: {} };
}

/**
 * Select components for an entire page's sections.
 */
export function selectComponentsForPage({ sections, businessType, usedComponentIds = [] }) {
  const results = [];
  const pageUsedIds = [...usedComponentIds];
  let previousId = null;

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const result = selectComponent({
      sectionType: section.sectionType || section.type || 'content',
      sectionName: section.name || '',
      sectionDescription: section.description || '',
      businessType,
      contentCount: section.contentCount || null,
      sectionIndex: i,
      totalSections: sections.length,
      usedComponentIds: pageUsedIds,
      previousComponentId: previousId,
      componentOverride: section.carbonComponent || null,
    });

    results.push({ section, ...result });
    pageUsedIds.push(result.component.id);
    previousId = result.component.id;
  }

  return results;
}

// ─── Helpers ───────────────────────────────────────────────────────

function parseContentCount(text) {
  const match = text.match(/(\d+)\s*(items?|cards?|features?|tiers?|plans?|steps?|members?|team|services?|products?|testimonials?|logos?)/i);
  if (match) return parseInt(match[1], 10);
  return null;
}

export { getRegistry };
