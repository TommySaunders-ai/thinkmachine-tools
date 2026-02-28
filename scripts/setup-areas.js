#!/usr/bin/env node

/**
 * Areas of IO — Notion Database Setup
 *
 * Creates the article infrastructure in Notion:
 *   - IO Article Section Library (349 sections as reference DB)
 *   - IO Areas (22 Areas of IO)
 *   - IO Articles (main article database with ~50 core properties)
 *   - IO Article Questions (linked DB for QST group)
 *   - IO Article Structured Data (linked DB for DAT group)
 *
 * Usage:
 *   NOTION_API_KEY=your_key node scripts/setup-areas.js
 *   NOTION_API_KEY=your_key NOTION_PARENT_PAGE=page_id node scripts/setup-areas.js
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Client } from '@notionhq/client';
import {
  GROUPS, AREAS, CONTENT_TYPES, SECTIONS,
  CORE_PROPERTY_SECTIONS, LINKED_DB_SECTIONS,
  getLibrarySummary,
} from '../src/notion/section-library.js';

// Auto-load .env from project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env');
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

const apiKey = process.env.NOTION_API_KEY;
let parentPageId = process.env.NOTION_PARENT_PAGE;

if (!apiKey) {
  console.error('Error: NOTION_API_KEY required\nRun: NOTION_API_KEY=secret_xxx node scripts/setup-areas.js');
  process.exit(1);
}

const notion = new Client({ auth: apiKey });

// ─── Helpers ──────────────────────────────────────────────────────

async function createPage(parent, title, emoji, children = []) {
  const page = await notion.pages.create({
    parent: { type: 'page_id', page_id: parent },
    icon: { type: 'emoji', emoji },
    properties: { title: { title: [{ text: { content: title } }] } },
    children,
  });
  console.log(`  Page: ${title} (${page.id})`);
  return page.id;
}

async function createDatabase(title, parent, properties, description) {
  const db = await notion.databases.create({
    parent: { type: 'page_id', page_id: parent },
    title: [{ type: 'text', text: { content: title } }],
    description: description ? [{ type: 'text', text: { content: description } }] : undefined,
    properties,
  });
  console.log(`  DB: ${title} (${db.id})`);
  return db.id;
}

function text(content) { return { text: { content } }; }
function heading2(content) {
  return { object: 'block', type: 'heading_2', heading_2: { rich_text: [text(content)] } };
}
function paragraph(content) {
  return { object: 'block', type: 'paragraph', paragraph: { rich_text: [text(content)] } };
}
function divider() { return { object: 'block', type: 'divider', divider: {} }; }

// ─── Main Setup ──────────────────────────────────────────────────

async function setup() {
  console.log('=== Areas of IO — Notion Setup ===\n');

  // Verify connection
  try {
    const me = await notion.users.me({});
    console.log(`Connected as: ${me.name || me.id} (${me.type})\n`);
  } catch (err) {
    console.error('Failed to connect:', err.message);
    process.exit(1);
  }

  // Create parent page if not provided
  if (!parentPageId) {
    console.log('Creating "Areas of IO" workspace page...\n');
    const page = await notion.pages.create({
      parent: { type: 'workspace', workspace: true },
      icon: { type: 'emoji', emoji: '🌐' },
      properties: { title: { title: [text('Areas of IO')] } },
      children: [
        { object: 'block', type: 'callout', callout: {
          icon: { type: 'emoji', emoji: '🏗️' },
          rich_text: [text('Areas of IO — Article publishing infrastructure. 349 section types, 14 content types, 22 areas. Supports bulk publishing of 10,000+ articles via Notion button → GitHub Actions.')],
        }},
        divider(),
        heading2('Architecture'),
        paragraph(`Total Sections: 349 across 20 groups`),
        paragraph(`Content Types: 14 (CT-01 Deep Dive through CT-14 Emerging)`),
        paragraph(`Areas: 22 (Notion IO, Website IO, Content IO, etc.)`),
        paragraph(`Storage: 3-tier (core properties ~58, page body ~254, linked databases ~37)`),
        divider(),
        heading2('Databases'),
        paragraph('The databases below are created automatically by setup-areas.js.'),
      ],
    });
    parentPageId = page.id;
    console.log(`  Created: Areas of IO (${parentPageId})\n`);
  } else {
    console.log(`Using parent: ${parentPageId}\n`);
  }

  // ─── 1. Section Library Reference DB ────────────────────────────
  console.log('Creating Section Library reference database...');
  const sectionLibId = await createDatabase('IO Article Section Library', parentPageId, {
    'Section Name': { title: {} },
    'Section ID': { rich_text: {} },
    'Group': { select: { options: Object.entries(GROUPS).map(([id, g]) => ({ name: `${id} — ${g.name}` })) } },
    'Storage Tier': { select: { options: [
      { name: 'core_property', color: 'blue' },
      { name: 'page_body', color: 'green' },
      { name: 'linked_database', color: 'purple' },
    ] } },
    'Property Type': { select: { options: [
      { name: 'title' }, { name: 'rich_text' }, { name: 'select' },
      { name: 'multi_select' }, { name: 'number' }, { name: 'date' },
      { name: 'url' }, { name: 'people' }, { name: 'relation' },
    ] } },
    'Content Format': { rich_text: {} },
    'Render Component': { rich_text: {} },
    'Description': { rich_text: {} },
  }, '349 article section definitions — the master component library for all IO articles.');

  // Populate section library (batch create pages — Notion rate limit: 3 req/s)
  console.log('  Populating section library (349 sections)...');
  let batchCount = 0;
  for (const section of SECTIONS) {
    await notion.pages.create({
      parent: { database_id: sectionLibId },
      properties: {
        'Section Name': { title: [text(section.name)] },
        'Section ID': { rich_text: [text(section.id)] },
        'Group': { select: { name: `${section.group} — ${GROUPS[section.group]?.name || section.group}` } },
        'Storage Tier': { select: { name: section.storageTier } },
        ...(section.propertyType ? { 'Property Type': { select: { name: section.propertyType } } } : {}),
        'Content Format': { rich_text: [text(section.contentFormat)] },
        ...(section.renderComponent ? { 'Render Component': { rich_text: [text(section.renderComponent)] } } : {}),
        'Description': { rich_text: [text(section.description)] },
      },
    });
    batchCount++;
    if (batchCount % 50 === 0) console.log(`    ${batchCount}/349 sections created...`);
    // Rate limiting — Notion allows ~3 requests/sec
    if (batchCount % 3 === 0) await new Promise(r => setTimeout(r, 1100));
  }
  console.log(`    ${batchCount}/349 sections created.`);

  // ─── 2. Areas Database ──────────────────────────────────────────
  console.log('\nCreating Areas database...');
  const areasId = await createDatabase('IO Areas', parentPageId, {
    'Area Name': { title: {} },
    'Slug': { rich_text: {} },
    'Description': { rich_text: {} },
    'Icon': { rich_text: {} },
    'Status': { select: { options: [
      { name: 'Active', color: 'green' },
      { name: 'Planning', color: 'yellow' },
      { name: 'Draft', color: 'gray' },
    ] } },
    'Article Count': { number: { format: 'number' } },
    'Published URL': { url: {} },
  }, '22 Areas of IO — top-level content categories for the Areas home page.');

  // Populate areas
  console.log('  Populating 22 areas...');
  for (const area of AREAS) {
    await notion.pages.create({
      parent: { database_id: areasId },
      properties: {
        'Area Name': { title: [text(area.name)] },
        'Slug': { rich_text: [text(area.slug)] },
        'Description': { rich_text: [text(area.description)] },
        'Status': { select: { name: 'Planning' } },
      },
    });
  }
  console.log(`    22 areas created.`);

  // ─── 3. Articles Database (core properties from section library) ─
  console.log('\nCreating Articles database with core properties...');

  // Build properties from CORE_PROPERTY_SECTIONS — capped at ~50
  const articleProps = { 'Article Title': { title: {} } };
  const contentTypeOptions = Object.entries(CONTENT_TYPES).map(([id, ct]) => ({ name: `${id} ${ct.name}` }));
  const areaOptions = AREAS.map(a => ({ name: a.name }));

  // Add META properties first (most important)
  articleProps['Article Subtitle'] = { rich_text: {} };
  articleProps['Content Type'] = { select: { options: contentTypeOptions } };
  articleProps['Area of IO'] = { select: { options: areaOptions } };
  articleProps['Author'] = { people: {} };
  articleProps['Publish Status'] = { select: { options: [
    { name: 'Draft', color: 'gray' },
    { name: 'Review', color: 'yellow' },
    { name: 'Approved', color: 'blue' },
    { name: 'Published', color: 'green' },
    { name: 'Archived', color: 'brown' },
  ] } };
  articleProps['Publish Date'] = { date: {} };
  articleProps['Last Updated'] = { date: {} };
  articleProps['Review Date'] = { date: {} };
  articleProps['Tags'] = { multi_select: { options: [] } };
  articleProps['Priority'] = { select: { options: [
    { name: 'P0', color: 'red' }, { name: 'P1', color: 'orange' },
    { name: 'P2', color: 'yellow' }, { name: 'P3', color: 'blue' }, { name: 'P4', color: 'gray' },
  ] } };
  articleProps['Difficulty Level'] = { select: { options: [
    { name: 'Beginner', color: 'green' }, { name: 'Intermediate', color: 'yellow' },
    { name: 'Advanced', color: 'orange' }, { name: 'Expert', color: 'red' },
  ] } };
  articleProps['Reading Time'] = { number: { format: 'number' } };
  articleProps['Word Count'] = { number: { format: 'number' } };
  articleProps['Featured Image'] = { url: {} };
  articleProps['Thumbnail Image'] = { url: {} };
  articleProps['Published URL'] = { url: {} };
  articleProps['Build Status'] = { select: { options: [
    { name: 'Queued', color: 'gray' }, { name: 'Building', color: 'yellow' },
    { name: 'Deployed', color: 'green' }, { name: 'Failed', color: 'red' },
  ] } };
  articleProps['Build Timestamp'] = { date: {} };
  articleProps['Version'] = { number: { format: 'number' } };
  articleProps['Reviewer'] = { people: {} };
  articleProps['Content Source'] = { url: {} };
  articleProps['Content Score'] = { number: { format: 'number' } };
  articleProps['SEO Score'] = { number: { format: 'number' } };
  articleProps['Batch ID'] = { rich_text: {} };

  // SEO properties
  articleProps['Primary Keyword'] = { rich_text: {} };
  articleProps['Secondary Keywords'] = { rich_text: {} };
  articleProps['SEO Title'] = { rich_text: {} };
  articleProps['Meta Description'] = { rich_text: {} };
  articleProps['H1 Tag'] = { rich_text: {} };
  articleProps['URL Slug'] = { rich_text: {} };
  articleProps['Canonical URL'] = { url: {} };
  articleProps['OG Title'] = { rich_text: {} };
  articleProps['OG Description'] = { rich_text: {} };
  articleProps['OG Image'] = { url: {} };
  articleProps['Twitter Card'] = { select: { options: [
    { name: 'summary' }, { name: 'summary_large_image' },
  ] } };
  articleProps['Search Intent'] = { select: { options: [
    { name: 'Informational' }, { name: 'Transactional' },
    { name: 'Navigational' }, { name: 'Commercial' },
  ] } };
  articleProps['Content Cluster'] = { select: { options: [] } };
  articleProps['Content Freshness'] = { date: {} };
  articleProps['Readability Score'] = { number: { format: 'number' } };
  articleProps['Word Count Target'] = { number: { format: 'number' } };

  // FND, FTR, BEN, OUT, CMP core properties
  articleProps['Primary Definition'] = { rich_text: {} };
  articleProps['Category / Taxonomy'] = { select: { options: [] } };
  articleProps['Importance Statement'] = { rich_text: {} };
  articleProps['TL;DR Summary'] = { rich_text: {} };
  articleProps['Unique Differentiators'] = { rich_text: {} };
  articleProps['Primary Benefits'] = { rich_text: {} };
  articleProps['Primary Use Cases'] = { multi_select: { options: [] } };
  articleProps['Target Audience'] = { multi_select: { options: [] } };
  articleProps['Key Metrics'] = { rich_text: {} };
  articleProps['Key Risks'] = { multi_select: { options: [] } };
  articleProps['Key Integrations'] = { multi_select: { options: [] } };
  articleProps['Value for Money'] = { select: { options: [
    { name: 'Excellent' }, { name: 'Good' }, { name: 'Fair' }, { name: 'Poor' },
  ] } };
  articleProps['Verdict'] = { rich_text: {} };

  const articlesId = await createDatabase('IO Articles', parentPageId, articleProps,
    'Main article database — 14 content types, ~50 core properties. Page body contains structured sections from the Section Library.');

  // ─── 4. Questions Linked Database ─────────────────────────────
  console.log('\nCreating Questions linked database...');
  const questionsId = await createDatabase('IO Article Questions', parentPageId, {
    'Question': { title: {} },
    'Article': { relation: { database_id: articlesId, single_property: {} } },
    'Question Type': { select: { options: [
      { name: 'What Is' }, { name: 'How Does' }, { name: 'Why Should' },
      { name: 'How To' }, { name: 'What Are Benefits' }, { name: 'What Are Risks' },
      { name: 'How Much Does' }, { name: 'Versus' }, { name: 'Best For' },
      { name: 'Is It Worth' }, { name: 'When To Use' }, { name: 'Who Uses' },
      { name: 'Where To Start' }, { name: 'Can It' }, { name: 'Does It Work With' },
      { name: 'What Are Alternatives' }, { name: 'How Long Does' },
      { name: 'What Are Examples' }, { name: 'How To Measure' },
      { name: 'What Is Future' }, { name: 'How To Choose' },
      { name: 'What Are Best Practices' },
    ] } },
    'Answer': { rich_text: {} },
    'Section ID': { rich_text: {} },
    'Featured in FAQ': { checkbox: {} },
  }, 'PAA-style questions linked to articles — used for FAQ schema and search optimization.');

  // ─── 5. Structured Data Linked Database ──────────────────────
  console.log('\nCreating Structured Data linked database...');
  const structDataId = await createDatabase('IO Article Structured Data', parentPageId, {
    'Schema Name': { title: {} },
    'Article': { relation: { database_id: articlesId, single_property: {} } },
    'Schema Type': { select: { options: [
      { name: 'Article' }, { name: 'FAQ' }, { name: 'HowTo' },
      { name: 'Review' }, { name: 'Product' }, { name: 'Comparison' },
      { name: 'BreadcrumbList' }, { name: 'Organization' }, { name: 'Person' },
      { name: 'WebPage' }, { name: 'VideoObject' }, { name: 'ImageObject' },
      { name: 'Table' }, { name: 'Speakable' }, { name: 'Custom' },
    ] } },
    'JSON-LD': { rich_text: {} },
    'Section ID': { rich_text: {} },
    'Auto-Generated': { checkbox: {} },
  }, 'JSON-LD structured data schemas linked to articles — supports all 15 schema types from the DAT group.');

  // ─── Add relation back-links ──────────────────────────────────
  // Note: Notion automatically creates the reverse relation when you create a relation property.
  // The Articles DB now has "IO Article Questions" and "IO Article Structured Data" roll-ups available.

  // ─── Results ──────────────────────────────────────────────────

  const summary = getLibrarySummary();
  console.log('\n=== Areas of IO Setup Complete ===\n');
  console.log(`Section Library: ${summary.totalSections} sections across ${summary.totalGroups} groups`);
  console.log(`Content Types: ${summary.totalContentTypes}`);
  console.log(`Areas: ${summary.totalAreas}`);
  console.log(`Storage Tiers: ${JSON.stringify(summary.tierBreakdown)}\n`);

  console.log('Database IDs — add to .env or io-site-builder.config.json:\n');
  console.log(`NOTION_SECTION_LIBRARY_DB=${sectionLibId}`);
  console.log(`NOTION_AREAS_DB=${areasId}`);
  console.log(`NOTION_ARTICLES_DB=${articlesId}`);
  console.log(`NOTION_QUESTIONS_DB=${questionsId}`);
  console.log(`NOTION_STRUCTURED_DATA_DB=${structDataId}`);

  console.log('\n─── GitHub Secrets ───\n');
  console.log('Add these as GitHub Actions secrets:');
  console.log(`  NOTION_SECTION_LIBRARY_DB = ${sectionLibId}`);
  console.log(`  NOTION_AREAS_DB           = ${areasId}`);
  console.log(`  NOTION_ARTICLES_DB        = ${articlesId}`);
  console.log(`  NOTION_QUESTIONS_DB       = ${questionsId}`);
  console.log(`  NOTION_STRUCTURED_DATA_DB = ${structDataId}`);

  console.log('\n─── Next Steps ───\n');
  console.log('1. Open "Areas of IO" page in Notion to see all databases');
  console.log('2. Copy database IDs into io-site-builder.config.json');
  console.log('3. Create your first article in "IO Articles"');
  console.log('4. Run: node src/cli/index.js build --area notion-io');
  console.log('5. For bulk publish: node src/cli/index.js bulk-publish --area notion-io');
  console.log('');
}

setup().catch((err) => {
  console.error('Error:', err.message);
  if (err.code === 'object_not_found') {
    console.error('\nMake sure the parent page ID is correct and the integration has access.');
  }
  if (err.code === 'unauthorized') {
    console.error('\nAPI key invalid. Check NOTION_API_KEY.');
  }
  process.exit(1);
});
