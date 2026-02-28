#!/usr/bin/env node

/**
 * Notion Database Setup Script
 *
 * Creates the required database structure in your Notion workspace
 * for the intelligentoperations.ai site builder.
 *
 * Creates:
 *   - Sites database (site configuration)
 *   - Pages database (page hierarchy)
 *   - Sections database (page sections)
 *   - Services database (products/services)
 *   - Testimonials database (quotes/reviews)
 *   - Team database (team members)
 *
 * Usage:
 *   NOTION_API_KEY=your_key NOTION_PARENT_PAGE=page_id node scripts/setup-notion.js
 *
 * Or with .env:
 *   node --env-file=.env scripts/setup-notion.js
 */

import { Client } from '@notionhq/client';

const apiKey = process.env.NOTION_API_KEY;
const parentPageId = process.env.NOTION_PARENT_PAGE;

if (!apiKey) {
  console.error('Error: NOTION_API_KEY environment variable is required');
  process.exit(1);
}

if (!parentPageId) {
  console.error('Error: NOTION_PARENT_PAGE environment variable is required');
  console.error('This should be the ID of a Notion page where databases will be created.');
  console.error('You can find this in the page URL: notion.so/<page-id>');
  process.exit(1);
}

const notion = new Client({ auth: apiKey });

async function createDatabase(title, parent, properties) {
  const db = await notion.databases.create({
    parent: { type: 'page_id', page_id: parent },
    title: [{ type: 'text', text: { content: title } }],
    properties,
  });
  console.log(`  Created: ${title} (${db.id})`);
  return db.id;
}

async function setup() {
  console.log('=== Setting Up Notion Databases ===\n');

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
  });

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
  });

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
  });

  // Services database
  const servicesId = await createDatabase('IO Services', parentPageId, {
    'Name': { title: {} },
    'Description': { rich_text: {} },
    'Icon': { files: {} },
    'Pricing': { number: { format: 'dollar' } },
    'Features': { multi_select: { options: [] } },
    'CTA Label': { rich_text: {} },
    'CTA Link': { url: {} },
  });

  // Testimonials database
  const testimonialsId = await createDatabase('IO Testimonials', parentPageId, {
    'Quote': { title: {} },
    'Author': { rich_text: {} },
    'Role': { rich_text: {} },
    'Avatar': { files: {} },
    'Rating': { number: {} },
  });

  // Team database
  const teamId = await createDatabase('IO Team', parentPageId, {
    'Name': { title: {} },
    'Role': { rich_text: {} },
    'Bio': { rich_text: {} },
    'Photo': { files: {} },
    'LinkedIn': { url: {} },
  });

  console.log('\n=== Setup Complete ===\n');
  console.log('Add these to your .env file:\n');
  console.log(`NOTION_SITES_DB=${sitesId}`);
  console.log(`NOTION_PAGES_DB=${pagesId}`);
  console.log(`NOTION_SECTIONS_DB=${sectionsId}`);
  console.log(`NOTION_SERVICES_DB=${servicesId}`);
  console.log(`NOTION_TESTIMONIALS_DB=${testimonialsId}`);
  console.log(`NOTION_TEAM_DB=${teamId}`);
  console.log('\nOr update io-site-builder.config.json with these IDs.');
}

setup().catch((err) => {
  console.error('Error:', err.message);
  if (err.code === 'object_not_found') {
    console.error('\nMake sure the parent page ID is correct and the integration has access to it.');
    console.error('Go to the page in Notion → ··· menu → Connections → Add your integration.');
  }
  process.exit(1);
});
