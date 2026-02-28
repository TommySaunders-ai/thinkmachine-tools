#!/usr/bin/env node

/**
 * Notion Workspace Discovery Script
 *
 * Connects to your Notion workspace and lists all databases and pages
 * the integration has access to. Use this to find your database IDs
 * for configuring the site builder.
 *
 * Usage:
 *   NOTION_API_KEY=your_key node scripts/discover-notion.js
 *
 * Or if you have a .env file:
 *   node --env-file=.env scripts/discover-notion.js
 */

import { Client } from '@notionhq/client';

const apiKey = process.env.NOTION_API_KEY;

if (!apiKey) {
  console.error('Error: NOTION_API_KEY environment variable is required');
  console.error('Usage: NOTION_API_KEY=your_key node scripts/discover-notion.js');
  process.exit(1);
}

const notion = new Client({ auth: apiKey });

async function discover() {
  console.log('=== Notion Workspace Discovery ===\n');

  // Get bot info
  try {
    const me = await notion.users.me({});
    console.log(`Connected as: ${me.name || me.id} (${me.type})`);
    console.log(`Bot ID: ${me.id}\n`);
  } catch (err) {
    console.error('Failed to connect:', err.message);
    process.exit(1);
  }

  // Search for all content
  let allResults = [];
  let cursor;

  do {
    const response = await notion.search({
      page_size: 100,
      start_cursor: cursor || undefined,
    });
    allResults = allResults.concat(response.results);
    cursor = response.has_more ? response.next_cursor : null;
  } while (cursor);

  const databases = allResults.filter((r) => r.object === 'database');
  const pages = allResults.filter((r) => r.object === 'page');

  // List databases
  console.log(`Found ${databases.length} database(s):\n`);
  for (const db of databases) {
    const title = db.title?.map((t) => t.plain_text).join('') || '(untitled)';
    const props = Object.entries(db.properties || {})
      .map(([name, prop]) => `${name} (${prop.type})`)
      .join(', ');

    console.log(`  DATABASE: ${title}`);
    console.log(`  ID: ${db.id}`);
    console.log(`  Properties: ${props}`);
    console.log('');
  }

  // List pages (top-level only)
  console.log(`Found ${pages.length} page(s):\n`);
  for (const page of pages) {
    const titleProp = Object.values(page.properties || {}).find((p) => p.type === 'title');
    const title = titleProp?.title?.[0]?.plain_text || '(untitled)';

    console.log(`  PAGE: ${title}`);
    console.log(`  ID: ${page.id}`);
    console.log(`  Parent: ${page.parent?.type} ${page.parent?.database_id || page.parent?.page_id || page.parent?.workspace ? 'workspace' : ''}`);
    console.log('');
  }

  // Suggest config
  console.log('=== Suggested Configuration ===\n');
  console.log('Add these database IDs to your .env or io-site-builder.config.json:\n');

  const dbMap = {};
  for (const db of databases) {
    const title = (db.title?.map((t) => t.plain_text).join('') || '').toLowerCase();
    if (title.includes('site')) dbMap.sites = db.id;
    else if (title.includes('page')) dbMap.pages = db.id;
    else if (title.includes('section')) dbMap.sections = db.id;
    else if (title.includes('service') || title.includes('product')) dbMap.services = db.id;
    else if (title.includes('testimonial')) dbMap.testimonials = db.id;
    else if (title.includes('team') || title.includes('member')) dbMap.team = db.id;
  }

  console.log(`NOTION_SITES_DB=${dbMap.sites || '<paste-id-here>'}`);
  console.log(`NOTION_PAGES_DB=${dbMap.pages || '<paste-id-here>'}`);
  console.log(`NOTION_SECTIONS_DB=${dbMap.sections || '<paste-id-here>'}`);
  console.log(`NOTION_SERVICES_DB=${dbMap.services || '<paste-id-here>'}`);
  console.log(`NOTION_TESTIMONIALS_DB=${dbMap.testimonials || '<paste-id-here>'}`);
  console.log(`NOTION_TEAM_DB=${dbMap.team || '<paste-id-here>'}`);
}

discover().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
