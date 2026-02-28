/**
 * Article Section Renderers
 *
 * Renders the 20 section groups from the Section Library into Carbon Design
 * System HTML. Each group has a dedicated renderer that handles its content
 * format (paragraphs, tables, cards, timelines, etc.).
 */

import { blocksToHtml, richTextToHtml } from '../notion/client.js';
import { GROUPS, getSectionsByGroup } from '../notion/section-library.js';

// ─── Carbon Theme Tokens (inherited from page) ───────────────────

const CARBON_THEMES = {
  White: { bg: '#ffffff', text: '#161616', interactive: '#0f62fe', surface: '#ffffff', border: '#e0e0e0' },
  G10: { bg: '#f4f4f4', text: '#161616', interactive: '#0f62fe', surface: '#ffffff', border: '#e0e0e0' },
  G90: { bg: '#262626', text: '#f4f4f4', interactive: '#4589ff', surface: '#393939', border: '#525252' },
  G100: { bg: '#161616', text: '#f4f4f4', interactive: '#4589ff', surface: '#262626', border: '#393939' },
};

// ─── Group Renderers ──────────────────────────────────────────────

const GROUP_RENDERERS = {
  FND: renderFoundation,
  FNC: renderMechanics,
  FTR: renderFeatures,
  BEN: renderBenefits,
  USE: renderUseCases,
  USR: renderUserStakeholder,
  OUT: renderOutcomes,
  STR: renderStrategy,
  CMP: renderComparison,
  PRC: renderProcess,
  BST: renderBestPractices,
  FUT: renderFuture,
  RSK: renderRisks,
  ECO: renderEcosystem,
  'PRC$': renderPricing,
  TEC: renderTechnical,
  SEO: null, // SEO sections render as meta tags, not visible content
  DAT: null, // Structured data renders as JSON-LD in <head>
  QST: renderQuestions,
  META: null, // Metadata renders as page properties, not visible
};

/**
 * Render all body sections for an article.
 * @param {Object} article - Article with bodySections from client.js
 * @param {Object} options - { theme, contentType }
 * @returns {string} HTML for all article body sections
 */
export function renderArticleSections(article, options = {}) {
  const { theme = 'G100' } = options;
  const tokens = CARBON_THEMES[theme] || CARBON_THEMES.G100;
  const parts = [];

  if (!article.bodySections) return '';

  for (const [sectionName, blocks] of Object.entries(article.bodySections)) {
    // Determine which group this section belongs to
    const groupId = identifyGroup(sectionName);
    const renderer = groupId ? GROUP_RENDERERS[groupId] : null;

    if (renderer) {
      parts.push(renderer(sectionName, blocks, tokens, article));
    } else {
      // Default: render as generic content section
      parts.push(renderGenericSection(sectionName, blocks, tokens));
    }
  }

  return parts.join('\n');
}

/**
 * Identify which group a section heading belongs to.
 */
function identifyGroup(sectionName) {
  // Check for SEC-XXX-NNN pattern
  const match = sectionName.match(/^SEC-([A-Z$]+)-\d{3}/);
  if (match) return match[1];

  // Check against section names in each group
  for (const [groupId, group] of Object.entries(GROUPS)) {
    const sections = getSectionsByGroup(groupId);
    if (sections.some(s => s.name === sectionName)) return groupId;
  }
  return null;
}

// ─── Shared HTML Helpers ──────────────────────────────────────────

function esc(text) {
  return String(text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function sectionWrapper(id, title, content, tokens) {
  return `<section id="${esc(id)}" class="bx--article-section" style="padding:3rem 0;border-bottom:1px solid ${tokens.border}">
  <div class="bx--grid">
    <div class="bx--row">
      <div class="bx--col-lg-12 bx--col-md-8">
        <h2 style="color:${tokens.text};font-size:1.75rem;font-weight:600;margin-bottom:1.5rem">${esc(title)}</h2>
        ${content}
      </div>
    </div>
  </div>
</section>`;
}

function renderBlocksContent(blocks, tokens) {
  if (!blocks || blocks.length === 0) return '<p style="color:' + tokens.text + '">Content coming soon.</p>';
  return blocksToHtml(blocks);
}

function cardGrid(cards, tokens) {
  return `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1rem">
${cards.map(c => `  <div style="background:${tokens.surface};padding:1.5rem;border:1px solid ${tokens.border};border-radius:4px">
    ${c.icon ? `<div style="font-size:1.5rem;margin-bottom:0.5rem">${esc(c.icon)}</div>` : ''}
    <h4 style="color:${tokens.text};font-weight:600;margin-bottom:0.5rem">${esc(c.title)}</h4>
    <p style="color:${tokens.text};opacity:0.8;font-size:0.875rem">${esc(c.description)}</p>
  </div>`).join('\n')}
</div>`;
}

// ─── Group Renderers ──────────────────────────────────────────────

function renderFoundation(name, blocks, tokens, article) {
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  let content = renderBlocksContent(blocks, tokens);

  // For specific FND sections, add special formatting
  if (name === 'Primary Definition' || name === 'TL;DR Summary') {
    content = `<div style="background:${tokens.surface};border-left:4px solid ${tokens.interactive};padding:1.5rem;margin-bottom:1rem">${content}</div>`;
  }
  if (name === 'Key Statistics') {
    content = `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1rem">${content}</div>`;
  }
  return sectionWrapper(id, name, content, tokens);
}

function renderMechanics(name, blocks, tokens) {
  const id = `fnc-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  let content = renderBlocksContent(blocks, tokens);
  if (name === 'How It Works' || name === 'Technical Architecture' || name === 'Data Flow') {
    content = `<div style="background:${tokens.surface};padding:2rem;border-radius:4px">${content}</div>`;
  }
  return sectionWrapper(id, name, content, tokens);
}

function renderFeatures(name, blocks, tokens) {
  const id = `ftr-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return sectionWrapper(id, name, renderBlocksContent(blocks, tokens), tokens);
}

function renderBenefits(name, blocks, tokens) {
  const id = `ben-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  let content = renderBlocksContent(blocks, tokens);
  if (name === 'Primary Benefits') {
    content = `<div style="background:linear-gradient(135deg,${tokens.interactive}11,${tokens.interactive}05);padding:2rem;border-radius:8px">${content}</div>`;
  }
  return sectionWrapper(id, name, content, tokens);
}

function renderUseCases(name, blocks, tokens) {
  const id = `use-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return sectionWrapper(id, name, renderBlocksContent(blocks, tokens), tokens);
}

function renderUserStakeholder(name, blocks, tokens) {
  const id = `usr-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return sectionWrapper(id, name, renderBlocksContent(blocks, tokens), tokens);
}

function renderOutcomes(name, blocks, tokens) {
  const id = `out-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  let content = renderBlocksContent(blocks, tokens);
  if (name === 'Before & After') {
    content = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:2rem">${content}</div>`;
  }
  return sectionWrapper(id, name, content, tokens);
}

function renderStrategy(name, blocks, tokens) {
  const id = `str-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return sectionWrapper(id, name, renderBlocksContent(blocks, tokens), tokens);
}

function renderComparison(name, blocks, tokens) {
  const id = `cmp-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  let content = renderBlocksContent(blocks, tokens);
  if (name === 'Pros & Cons') {
    content = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:2rem">${content}</div>`;
  }
  if (name === 'Verdict / Recommendation') {
    content = `<div style="background:${tokens.interactive};color:#fff;padding:2rem;border-radius:8px">${content}</div>`;
  }
  return sectionWrapper(id, name, content, tokens);
}

function renderProcess(name, blocks, tokens) {
  const id = `prc-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  let content = renderBlocksContent(blocks, tokens);
  if (name === 'Step-by-Step Guide' || name === 'Getting Started') {
    content = `<div style="background:${tokens.surface};padding:2rem;border-radius:4px">${content}</div>`;
  }
  return sectionWrapper(id, name, content, tokens);
}

function renderBestPractices(name, blocks, tokens) {
  const id = `bst-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return sectionWrapper(id, name, renderBlocksContent(blocks, tokens), tokens);
}

function renderFuture(name, blocks, tokens) {
  const id = `fut-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return sectionWrapper(id, name, renderBlocksContent(blocks, tokens), tokens);
}

function renderRisks(name, blocks, tokens) {
  const id = `rsk-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  let content = renderBlocksContent(blocks, tokens);
  if (name === 'Key Risks') {
    content = `<div style="border-left:4px solid #da1e28;padding-left:1.5rem">${content}</div>`;
  }
  return sectionWrapper(id, name, content, tokens);
}

function renderEcosystem(name, blocks, tokens) {
  const id = `eco-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return sectionWrapper(id, name, renderBlocksContent(blocks, tokens), tokens);
}

function renderPricing(name, blocks, tokens) {
  const id = `prc-pricing-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return sectionWrapper(id, name, renderBlocksContent(blocks, tokens), tokens);
}

function renderTechnical(name, blocks, tokens) {
  const id = `tec-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  let content = renderBlocksContent(blocks, tokens);
  if (name === 'Code Examples') {
    content = `<div style="background:#161616;color:#f4f4f4;padding:1.5rem;border-radius:4px;overflow-x:auto">${content}</div>`;
  }
  return sectionWrapper(id, name, content, tokens);
}

function renderQuestions(name, blocks, tokens, article) {
  const id = `qst-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  // If article has linked questions, render as FAQ
  if (article.questions && article.questions.length > 0) {
    const faqItems = article.questions.map(q => {
      const question = q.properties?.['Question']?.title?.[0]?.plain_text || 'Question';
      const answer = q.properties?.['Answer']?.rich_text?.[0]?.plain_text || '';
      return `<details style="margin-bottom:1rem;border:1px solid ${tokens.border};border-radius:4px">
  <summary style="padding:1rem;cursor:pointer;font-weight:600;color:${tokens.text}">${esc(question)}</summary>
  <div style="padding:0 1rem 1rem;color:${tokens.text};opacity:0.9">${esc(answer)}</div>
</details>`;
    }).join('\n');
    return sectionWrapper(id, 'Frequently Asked Questions', faqItems, tokens);
  }
  return sectionWrapper(id, name, renderBlocksContent(blocks, tokens), tokens);
}

function renderGenericSection(name, blocks, tokens) {
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return sectionWrapper(id, name, renderBlocksContent(blocks, tokens), tokens);
}

/**
 * Generate table of contents from article body sections.
 */
export function renderTableOfContents(article, tokens) {
  if (!article.bodySections) return '';
  const items = Object.keys(article.bodySections).map(name => {
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `<li><a href="#${esc(id)}" style="color:${tokens.interactive};text-decoration:none">${esc(name)}</a></li>`;
  }).join('\n');
  return `<nav class="bx--article-toc" style="margin-bottom:2rem">
  <h3 style="font-size:1rem;font-weight:600;margin-bottom:0.75rem;color:${tokens.text}">Table of Contents</h3>
  <ol style="list-style:decimal;padding-left:1.25rem;color:${tokens.text}">${items}</ol>
</nav>`;
}
