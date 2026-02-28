#!/usr/bin/env node

/**
 * Notion Database Setup Script
 *
 * Creates the required database structure in your Notion workspace
 * for the intelligentoperations.ai site builder.
 *
 * Creates:
 *   - Parent page "IO Site Builder" with setup instructions
 *   - Sites database (site configuration)
 *   - Pages database (page hierarchy)
 *   - Sections database (page sections)
 *   - Services database (products/services)
 *   - Testimonials database (quotes/reviews)
 *   - Team database (team members)
 *   - Build Log database (build history + webhook events)
 *
 * Usage:
 *   NOTION_API_KEY=your_key node scripts/setup-notion.js
 *
 *   With a specific parent page:
 *   NOTION_API_KEY=your_key NOTION_PARENT_PAGE=page_id node scripts/setup-notion.js
 *
 * Or with .env:
 *   node --env-file=.env scripts/setup-notion.js
 */

import { Client } from '@notionhq/client';

const apiKey = process.env.NOTION_API_KEY;
let parentPageId = process.env.NOTION_PARENT_PAGE;

if (!apiKey) {
  console.error('Error: NOTION_API_KEY environment variable is required');
  console.error('');
  console.error('To get an API key:');
  console.error('  1. Go to https://www.notion.so/my-integrations');
  console.error('  2. Click "New integration"');
  console.error('  3. Name it "io-site-builder" and select your workspace');
  console.error('  4. Copy the "Internal Integration Secret"');
  console.error('  5. Run: NOTION_API_KEY=secret_xxx node scripts/setup-notion.js');
  process.exit(1);
}

const notion = new Client({ auth: apiKey });

// ─── Helper Functions ──────────────────────────────────────────────

async function createParentPage() {
  console.log('[setup] Creating parent page "IO Site Builder"...\n');

  const page = await notion.pages.create({
    parent: { type: 'workspace', workspace: true },
    icon: { type: 'emoji', emoji: '🏗️' },
    properties: {
      title: {
        title: [{ text: { content: 'IO Site Builder' } }],
      },
    },
    children: [
      {
        object: 'block',
        type: 'callout',
        callout: {
          icon: { type: 'emoji', emoji: '👋' },
          rich_text: [{ text: { content: 'Welcome to the IO Site Builder workspace! This page contains all the databases needed to build and manage your sites. Follow the setup instructions below to get started.' } }],
        },
      },
      { object: 'block', type: 'divider', divider: {} },
      {
        object: 'block',
        type: 'heading_2',
        heading_2: { rich_text: [{ text: { content: 'Quick Start Setup' } }] },
      },
      {
        object: 'block',
        type: 'numbered_list_item',
        numbered_list_item: {
          rich_text: [
            { text: { content: 'Add your Notion API key', annotations: { bold: true } } },
            { text: { content: ' — Copy the database IDs printed after this script runs and add them to your ' } },
            { text: { content: '.env', annotations: { code: true } } },
            { text: { content: ' file or ' } },
            { text: { content: 'io-site-builder.config.json', annotations: { code: true } } },
          ],
        },
      },
      {
        object: 'block',
        type: 'numbered_list_item',
        numbered_list_item: {
          rich_text: [
            { text: { content: 'Add GitHub Secrets', annotations: { bold: true } } },
            { text: { content: ' — Go to your GitHub repo → Settings → Secrets and variables → Actions, then add: NOTION_API_KEY, NOTION_SITE_ID, and all NOTION_*_DB values' } },
          ],
        },
      },
      {
        object: 'block',
        type: 'numbered_list_item',
        numbered_list_item: {
          rich_text: [
            { text: { content: 'Create your first site', annotations: { bold: true } } },
            { text: { content: ' — Open the "IO Sites" database below and add a new entry with your site name, domain, and branding' } },
          ],
        },
      },
      {
        object: 'block',
        type: 'numbered_list_item',
        numbered_list_item: {
          rich_text: [
            { text: { content: 'Add pages', annotations: { bold: true } } },
            { text: { content: ' — Open "IO Pages" and create pages (Home, Features, Contact, etc.) linked to your site' } },
          ],
        },
      },
      {
        object: 'block',
        type: 'numbered_list_item',
        numbered_list_item: {
          rich_text: [
            { text: { content: 'Add sections', annotations: { bold: true } } },
            { text: { content: ' — Open "IO Sections" and add sections (Hero, Feature, CTA, etc.) linked to each page' } },
          ],
        },
      },
      {
        object: 'block',
        type: 'numbered_list_item',
        numbered_list_item: {
          rich_text: [
            { text: { content: 'Build!', annotations: { bold: true } } },
            { text: { content: ' — Run ' } },
            { text: { content: 'npm run build', annotations: { code: true } } },
            { text: { content: ' locally or trigger the GitHub Action to build and deploy' } },
          ],
        },
      },
      { object: 'block', type: 'divider', divider: {} },
      {
        object: 'block',
        type: 'heading_2',
        heading_2: { rich_text: [{ text: { content: 'GitHub Secrets Required' } }] },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ text: { content: 'Add these secrets to your GitHub repository (Settings → Secrets → Actions):' } }],
        },
      },
      {
        object: 'block',
        type: 'code',
        code: {
          language: 'plain text',
          rich_text: [{
            text: {
              content: `NOTION_API_KEY=secret_xxx          # Your Notion integration API key
NOTION_SITE_ID=xxx                  # The ID of your site entry in IO Sites
NOTION_SITES_DB=xxx                 # IO Sites database ID
NOTION_PAGES_DB=xxx                 # IO Pages database ID
NOTION_SECTIONS_DB=xxx              # IO Sections database ID
NOTION_SERVICES_DB=xxx              # IO Services database ID
NOTION_TESTIMONIALS_DB=xxx          # IO Testimonials database ID
NOTION_TEAM_DB=xxx                  # IO Team database ID
NOTION_BUILD_LOG_DB=xxx             # IO Build Log database ID (optional)
GITHUB_WEBHOOK_SECRET=xxx           # Secret for webhook signature verification (optional)`,
            },
          }],
        },
      },
      { object: 'block', type: 'divider', divider: {} },
      {
        object: 'block',
        type: 'heading_2',
        heading_2: { rich_text: [{ text: { content: 'GitHub Webhook Setup' } }] },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ text: { content: 'The io-site-builder uses GitHub Actions as its webhook handler. Events like pushes, deployments, issues, and PRs automatically sync status back to Notion via the "Notion Webhook" workflow. No external webhook URL is needed — GitHub Actions handles everything natively.' } }],
        },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            { text: { content: 'Available workflows:', annotations: { bold: true } } },
          ],
        },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [
            { text: { content: 'Notion Sync', annotations: { bold: true } } },
            { text: { content: ' — Polls Notion every 15 min for changes, rebuilds site, deploys to GitHub Pages' } },
          ],
        },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [
            { text: { content: 'Notion Webhook', annotations: { bold: true } } },
            { text: { content: ' — Listens for GitHub events (push, deploy, PR, issue) and updates Notion status' } },
          ],
        },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [
            { text: { content: 'Build from Notion & Deploy', annotations: { bold: true } } },
            { text: { content: ' — Manual trigger to build and deploy from Notion content' } },
          ],
        },
      },
      { object: 'block', type: 'divider', divider: {} },
      {
        object: 'block',
        type: 'heading_2',
        heading_2: { rich_text: [{ text: { content: 'Notion Agent (Two-Way Sync)' } }] },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ text: { content: 'The Notion Agent provides bidirectional orchestration:' } }],
        },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [
            { text: { content: 'Notion → GitHub:', annotations: { bold: true } } },
            { text: { content: ' Detects content changes in Notion databases, triggers site rebuilds, and pushes to GitHub Pages' } },
          ],
        },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [
            { text: { content: 'GitHub → Notion:', annotations: { bold: true } } },
            { text: { content: ' After builds complete, updates site status, deploy URLs, and build logs back in Notion' } },
          ],
        },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            { text: { content: 'Run the agent locally: ' } },
            { text: { content: 'node src/cli/index.js agent', annotations: { code: true } } },
          ],
        },
      },
      { object: 'block', type: 'divider', divider: {} },
      {
        object: 'block',
        type: 'heading_2',
        heading_2: { rich_text: [{ text: { content: 'Databases' } }] },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ text: { content: 'The databases below are created and linked automatically. Each one has a specific role in the site builder pipeline:' } }],
        },
      },
    ],
  });

  console.log(`  Created parent page: IO Site Builder (${page.id})\n`);
  return page.id;
}

async function createDatabase(title, parent, properties, description) {
  const db = await notion.databases.create({
    parent: { type: 'page_id', page_id: parent },
    title: [{ type: 'text', text: { content: title } }],
    description: description
      ? [{ type: 'text', text: { content: description } }]
      : undefined,
    properties,
  });
  console.log(`  Created: ${title} (${db.id})`);
  return db.id;
}

// ─── Main Setup ────────────────────────────────────────────────────

async function setup() {
  console.log('=== IO Site Builder — Notion Setup ===\n');

  // Verify connection
  try {
    const me = await notion.users.me({});
    console.log(`Connected as: ${me.name || me.id} (${me.type})\n`);
  } catch (err) {
    console.error('Failed to connect to Notion:', err.message);
    console.error('Make sure your NOTION_API_KEY is correct.');
    process.exit(1);
  }

  // Create parent page if not provided
  if (!parentPageId) {
    console.log('No NOTION_PARENT_PAGE specified — creating a new workspace page...\n');
    parentPageId = await createParentPage();
  } else {
    console.log(`Using existing parent page: ${parentPageId}\n`);
  }

  console.log('Creating databases...\n');

  // Sites database
  const sitesId = await createDatabase('IO Sites', parentPageId, {
    'Site Name': { title: {} },
    'Domain': { url: {} },
    'GitHub Repo': { rich_text: {} },
    'Business Type': { select: { options: [
      { name: 'SaaS', color: 'blue' },
      { name: 'Agency', color: 'purple' },
      { name: 'E-commerce', color: 'green' },
      { name: 'Portfolio', color: 'orange' },
      { name: 'Consulting', color: 'yellow' },
      { name: 'Marketing', color: 'pink' },
    ] } },
    'Brand Description': { rich_text: {} },
    'Target Audience': { multi_select: { options: [] } },
    'Primary Color': { rich_text: {} },
    'Theme': { select: { options: [
      { name: 'White', color: 'default' },
      { name: 'G10', color: 'gray' },
      { name: 'G90', color: 'brown' },
      { name: 'G100', color: 'default' },
    ] } },
    'Status': { select: { options: [
      { name: 'Draft', color: 'gray' },
      { name: 'Building', color: 'yellow' },
      { name: 'Published', color: 'green' },
    ] } },
  }, 'Site configurations — each entry represents one website to build and deploy.');

  // Pages database
  const pagesId = await createDatabase('IO Pages', parentPageId, {
    'Page Name': { title: {} },
    'Site': { relation: { database_id: sitesId, single_property: {} } },
    'Route': { rich_text: {} },
    'Page Type': { select: { options: [
      { name: 'Landing', color: 'blue' },
      { name: 'Detail', color: 'purple' },
      { name: 'Utility', color: 'gray' },
      { name: 'Blog Post', color: 'green' },
    ] } },
    'Nav Order': { number: {} },
    'Is Global': { checkbox: {} },
    'Status': { select: { options: [
      { name: 'Draft', color: 'gray' },
      { name: 'Ready', color: 'yellow' },
      { name: 'Published', color: 'green' },
    ] } },
    'SEO Title': { rich_text: {} },
    'SEO Description': { rich_text: {} },
  }, 'Pages for each site — defines the page hierarchy and navigation order.');

  // Sections database
  const sectionsId = await createDatabase('IO Sections', parentPageId, {
    'Section Name': { title: {} },
    'Page': { relation: { database_id: pagesId, single_property: {} } },
    'Section Type': { select: { options: [
      { name: 'Hero', color: 'red' },
      { name: 'Feature', color: 'blue' },
      { name: 'Content', color: 'default' },
      { name: 'Cards', color: 'purple' },
      { name: 'CTA', color: 'green' },
      { name: 'Testimonial', color: 'yellow' },
      { name: 'Pricing', color: 'orange' },
      { name: 'FAQ', color: 'pink' },
      { name: 'Logo Wall', color: 'gray' },
      { name: 'Footer', color: 'brown' },
    ] } },
    'Carbon Component': { rich_text: {} },
    'Order': { number: {} },
    'Is Global': { checkbox: {} },
  }, 'Sections within each page — each section maps to a Carbon Design System component.');

  // Services database
  const servicesId = await createDatabase('IO Services', parentPageId, {
    'Name': { title: {} },
    'Description': { rich_text: {} },
    'Icon': { files: {} },
    'Pricing': { number: { format: 'dollar' } },
    'Features': { multi_select: { options: [] } },
    'CTA Label': { rich_text: {} },
    'CTA Link': { url: {} },
  }, 'Products and services offered — used in card grids and pricing sections.');

  // Testimonials database
  const testimonialsId = await createDatabase('IO Testimonials', parentPageId, {
    'Quote': { title: {} },
    'Author': { rich_text: {} },
    'Role': { rich_text: {} },
    'Avatar': { files: {} },
    'Rating': { number: {} },
  }, 'Customer testimonials and reviews — displayed in quote and social proof sections.');

  // Team database
  const teamId = await createDatabase('IO Team', parentPageId, {
    'Name': { title: {} },
    'Role': { rich_text: {} },
    'Bio': { rich_text: {} },
    'Photo': { files: {} },
    'LinkedIn': { url: {} },
  }, 'Team members — displayed on About pages and team sections.');

  // Build Log database (new)
  const buildLogId = await createDatabase('IO Build Log', parentPageId, {
    'Name': { title: {} },
    'Build Status': { select: { options: [
      { name: 'Success', color: 'green' },
      { name: 'Failed', color: 'red' },
      { name: 'Building', color: 'yellow' },
      { name: 'Draft', color: 'gray' },
      { name: 'Published', color: 'green' },
    ] } },
    'Timestamp': { date: {} },
    'Deploy URL': { url: {} },
    'Files Count': { number: {} },
    'Trigger': { select: { options: [
      { name: 'Manual', color: 'blue' },
      { name: 'Notion Sync', color: 'purple' },
      { name: 'GitHub Push', color: 'gray' },
      { name: 'GitHub PR', color: 'orange' },
      { name: 'Scheduled', color: 'yellow' },
    ] } },
    'Error': { rich_text: {} },
    'Commit Hash': { rich_text: {} },
  }, 'Build history and deployment log — tracks every build triggered by the system.');

  // ─── Print Results ─────────────────────────────────────────────

  console.log('\n=== Setup Complete ===\n');

  console.log('Parent Page ID (save this):');
  console.log(`  NOTION_PARENT_PAGE=${parentPageId}\n`);

  console.log('Database IDs — add to .env or io-site-builder.config.json:\n');
  console.log(`NOTION_SITES_DB=${sitesId}`);
  console.log(`NOTION_PAGES_DB=${pagesId}`);
  console.log(`NOTION_SECTIONS_DB=${sectionsId}`);
  console.log(`NOTION_SERVICES_DB=${servicesId}`);
  console.log(`NOTION_TESTIMONIALS_DB=${testimonialsId}`);
  console.log(`NOTION_TEAM_DB=${teamId}`);
  console.log(`NOTION_BUILD_LOG_DB=${buildLogId}`);

  console.log('\n─── GitHub Secrets ───\n');
  console.log('Add these as GitHub Actions secrets:');
  console.log('  Repo → Settings → Secrets and variables → Actions → New repository secret\n');
  console.log(`  NOTION_API_KEY          = ${apiKey.slice(0, 12)}...`);
  console.log(`  NOTION_SITE_ID          = (create a site in IO Sites first, then paste its ID)`);
  console.log(`  NOTION_SITES_DB         = ${sitesId}`);
  console.log(`  NOTION_PAGES_DB         = ${pagesId}`);
  console.log(`  NOTION_SECTIONS_DB      = ${sectionsId}`);
  console.log(`  NOTION_SERVICES_DB      = ${servicesId}`);
  console.log(`  NOTION_TESTIMONIALS_DB  = ${testimonialsId}`);
  console.log(`  NOTION_TEAM_DB          = ${teamId}`);
  console.log(`  NOTION_BUILD_LOG_DB     = ${buildLogId}`);

  console.log('\n─── Next Steps ───\n');
  console.log('1. Open the "IO Site Builder" page in Notion');
  console.log('2. Add your first site entry in the "IO Sites" database');
  console.log('3. Copy the site entry ID and set it as NOTION_SITE_ID');
  console.log('4. Add pages and sections to define your site structure');
  console.log('5. Run: npm run build (local) or trigger GitHub Action');
  console.log('');
}

setup().catch((err) => {
  console.error('Error:', err.message);
  if (err.code === 'object_not_found') {
    console.error('\nMake sure the parent page ID is correct and the integration has access to it.');
    console.error('Go to the page in Notion → ··· menu → Connections → Add your integration.');
  }
  if (err.code === 'unauthorized') {
    console.error('\nYour API key appears to be invalid. Check that you copied the full secret.');
  }
  process.exit(1);
});
