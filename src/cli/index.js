#!/usr/bin/env node

/**
 * intelligentoperations.ai Site Builder CLI
 *
 * Orchestrates the full pipeline:
 *   Notion → AI Engine → Carbon Assembly → GitHub Pages Publish
 *
 * Commands:
 *   generate  — Generate sitemap from Notion site config
 *   build     — Build static HTML pages from Notion content
 *   publish   — Build + commit + push to GitHub Pages
 *   preview   — Build to local directory for preview
 */

import { NotionService } from '../notion/client.js';
import { selectComponentsForPage } from '../carbon/selector.js';
import { generatePage } from '../generator/html.js';
import { generateSitemap, generateSitemap as genSitemap } from '../generator/seo.js';
import { generateRobotsTxt } from '../generator/seo.js';
import { generateJsonLd } from '../generator/seo.js';
import { generateThemeCss } from '../generator/theme.js';
import { GitHubPublisher } from '../publisher/github.js';
import { generateSitemap as aiGenerateSitemap } from '../ai/sitemap-generator.js';
import { generatePageCopy } from '../ai/copy-generator.js';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..', '..');

// ─── Configuration ─────────────────────────────────────────────────

function loadConfig() {
  const configPath = join(PROJECT_ROOT, 'io-site-builder.config.json');
  if (existsSync(configPath)) {
    return JSON.parse(readFileSync(configPath, 'utf-8'));
  }

  // Fall back to environment variables
  return {
    notion: {
      apiKey: process.env.NOTION_API_KEY || '',
      databases: {
        sites: process.env.NOTION_SITES_DB || '',
        pages: process.env.NOTION_PAGES_DB || '',
        sections: process.env.NOTION_SECTIONS_DB || '',
        services: process.env.NOTION_SERVICES_DB || '',
        testimonials: process.env.NOTION_TESTIMONIALS_DB || '',
        team: process.env.NOTION_TEAM_DB || '',
      },
    },
    siteId: process.env.NOTION_SITE_ID || '',
    outputDir: process.env.OUTPUT_DIR || join(PROJECT_ROOT, '_site'),
    github: {
      repo: process.env.GITHUB_REPO || '',
      branch: process.env.GITHUB_BRANCH || 'main',
    },
  };
}

// ─── Commands ──────────────────────────────────────────────────────

async function commandGenerate(config) {
  console.log('=== Generating Sitemap ===\n');

  let siteData;

  if (config.notion.apiKey && config.siteId) {
    // Fetch from Notion
    const notion = new NotionService(config.notion);
    siteData = await notion.extractFullSite(config.siteId);
    console.log(`[notion] Extracted site: ${siteData.site.name}`);
  } else {
    // Use demo data
    console.log('[demo] No Notion API key — using demo site configuration');
    siteData = getDemoSiteData();
  }

  // Generate sitemap
  const sitemap = await aiGenerateSitemap({
    site: siteData.site,
    contentDatabases: siteData.contentDatabases,
  });

  console.log(`\n[sitemap] Generated ${sitemap.pages.length} pages:`);
  for (const page of sitemap.pages) {
    console.log(`  ${page.route.padEnd(20)} ${page.name} (${page.sections.length} sections)`);
  }

  // Save sitemap to file
  const outputPath = join(config.outputDir || PROJECT_ROOT, 'generated-sitemap.json');
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, JSON.stringify(sitemap, null, 2));
  console.log(`\n[output] Sitemap saved to ${outputPath}`);

  return sitemap;
}

async function commandBuild(config) {
  console.log('=== Building Site ===\n');

  let siteData;

  if (config.notion.apiKey && config.siteId) {
    const notion = new NotionService(config.notion);
    siteData = await notion.extractFullSite(config.siteId);
    console.log(`[notion] Extracted site: ${siteData.site.name}`);
  } else {
    console.log('[demo] No Notion API key — using demo site configuration');
    siteData = getDemoSiteData();
  }

  const { site, contentDatabases } = siteData;

  // Generate sitemap if no pages exist
  let pages = siteData.pages;
  if (!pages || pages.length === 0) {
    console.log('[sitemap] No pages found, generating...');
    const sitemap = await aiGenerateSitemap({ site, contentDatabases });
    pages = sitemap.pages;
  }

  // Generate theme CSS
  const themeCss = generateThemeCss({
    baseTheme: site.theme || 'G100',
    primaryColor: site.primaryColor,
    brandName: site.name,
  });

  const outputDir = config.outputDir || join(PROJECT_ROOT, '_site');
  mkdirSync(outputDir, { recursive: true });

  const files = [];

  // Generate each page
  for (const page of pages) {
    const sections = page.sections || [];

    // Select components for sections
    const componentSelections = selectComponentsForPage({
      sections,
      businessType: site.businessType,
    });

    // Generate copy
    const withCopy = await generatePageCopy({
      page,
      site,
      contentDatabases,
      componentSelections,
    });

    // Generate HTML
    const html = generatePage({
      page,
      componentSelections: withCopy,
      site,
      contentDatabases,
      allPages: pages,
    });

    // Determine output path
    const fileName = page.route === '/'
      ? 'index.html'
      : `${page.route.replace(/^\//, '').replace(/\/$/, '')}.html`;

    const filePath = join(outputDir, fileName);
    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, html);
    files.push(fileName);

    console.log(`[build] Generated ${fileName} (${sections.length} sections)`);
  }

  // Generate SEO files
  const sitemapXml = generateSitemap({ site, pages });
  writeFileSync(join(outputDir, 'sitemap.xml'), sitemapXml);
  files.push('sitemap.xml');

  const robotsTxt = generateRobotsTxt({ site });
  writeFileSync(join(outputDir, 'robots.txt'), robotsTxt);
  files.push('robots.txt');

  // Write theme CSS
  mkdirSync(join(outputDir, 'css'), { recursive: true });
  writeFileSync(join(outputDir, 'css', 'carbon-theme.css'), themeCss);
  files.push('css/carbon-theme.css');

  // Copy favicon if it exists in project
  const faviconSrc = join(PROJECT_ROOT, 'assets', 'favicon.svg');
  if (existsSync(faviconSrc)) {
    mkdirSync(join(outputDir, 'assets'), { recursive: true });
    const faviconContent = readFileSync(faviconSrc);
    writeFileSync(join(outputDir, 'assets', 'favicon.svg'), faviconContent);
    files.push('assets/favicon.svg');
  }

  console.log(`\n[build] Complete: ${files.length} files written to ${outputDir}`);
  return { outputDir, files };
}

async function commandPublish(config) {
  console.log('=== Publishing to GitHub Pages ===\n');

  // Build first
  const { outputDir, files } = await commandBuild(config);

  // Publish
  const publisher = new GitHubPublisher({
    repo: config.github.repo,
    branch: config.github.branch,
  });

  if (config.github.repo) {
    // Use remote repo
    await publisher.init();
  } else {
    // Use current repo (local)
    publisher.initLocal(PROJECT_ROOT);
  }

  // Write all generated files
  const writeList = files.map((f) => ({
    path: f,
    content: readFileSync(join(outputDir, f), 'utf-8'),
  }));
  publisher.writeFiles(writeList);

  // Ensure workflow exists
  publisher.ensureWorkflow();

  // Commit and push
  const result = await publisher.commitAndPush(
    `[io-site-builder] Build and publish site (${files.length} files)`
  );

  if (result.committed) {
    console.log(`\n[publish] Successfully published!`);
    console.log(`[publish] Commit: ${result.hash}`);
    if (config.github.repo) {
      console.log(`[publish] Site will be live at: https://${config.github.repo.split('/')[0]}.github.io/${config.github.repo.split('/')[1]}/`);
    }
  } else {
    console.log('\n[publish] No changes to publish');
  }

  return result;
}

async function commandPreview(config) {
  console.log('=== Building Preview ===\n');
  config.outputDir = config.outputDir || join(PROJECT_ROOT, '_site');
  const result = await commandBuild(config);
  console.log(`\n[preview] Open ${result.outputDir}/index.html in a browser to preview`);
  return result;
}

// ─── Demo Site Data ────────────────────────────────────────────────

function getDemoSiteData() {
  return {
    site: {
      name: 'ThinkMachine Tools',
      domain: 'tommysaunders-ai.github.io/thinkmachine-tools',
      repo: 'TommySaunders-ai/thinkmachine-tools',
      businessType: 'SaaS',
      brandDescription: 'AI-powered mindmap tools that transform any content — text, websites, PDFs, documents — into beautiful, interactive visual mindmaps in seconds.',
      targetAudience: ['Developers', 'Content Creators', 'Researchers', 'Students', 'Product Teams'],
      primaryColor: '#6366f1',
      theme: 'G100',
      status: 'Published',
    },
    pages: [],
    contentDatabases: {
      services: [
        { name: 'AI Mindmap Generator', description: 'Generate mindmaps from any topic using AI', ctaLabel: 'Try It', ctaLink: '/tools/ai-mindmap-generator' },
        { name: 'Text to Mindmap', description: 'Convert text content into visual mindmaps', ctaLabel: 'Try It', ctaLink: '/tools/text-to-mindmap' },
        { name: 'Website to Mindmap', description: 'Transform any website into a structured mindmap', ctaLabel: 'Try It', ctaLink: '/tools/website-to-mindmap' },
        { name: 'Markdown to Mindmap', description: 'Convert Markdown documents to visual mindmaps', ctaLabel: 'Try It', ctaLink: '/tools/markdown-to-mindmap' },
        { name: 'PDF to Mindmap', description: 'Extract and visualize PDF content as mindmaps', ctaLabel: 'Try It', ctaLink: '/tools/pdf-to-mindmap' },
        { name: 'DOCX to Mindmap', description: 'Turn Word documents into interactive mindmaps', ctaLabel: 'Try It', ctaLink: '/tools/docx-to-mindmap' },
      ],
      testimonials: [
        { quote: 'ThinkMachine Tools has transformed how our team organizes research. The AI mindmap generator is incredibly accurate.', author: 'Sarah Chen', role: 'Product Manager, TechCorp' },
        { quote: 'Being able to turn any PDF into a visual mindmap saves us hours of manual work every week.', author: 'Marcus Rivera', role: 'Research Lead, DataFlow' },
      ],
      team: [],
    },
  };
}

// ─── Entry Point ───────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'preview';

  const config = loadConfig();

  // Apply CLI overrides
  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--output' && args[i + 1]) {
      config.outputDir = args[++i];
    }
    if (args[i] === '--repo' && args[i + 1]) {
      config.github.repo = args[++i];
    }
    if (args[i] === '--site-id' && args[i + 1]) {
      config.siteId = args[++i];
    }
  }

  try {
    switch (command) {
      case 'generate':
        await commandGenerate(config);
        break;
      case 'build':
        await commandBuild(config);
        break;
      case 'publish':
        await commandPublish(config);
        break;
      case 'preview':
        await commandPreview(config);
        break;
      default:
        console.log(`
intelligentoperations.ai Site Builder

Usage: io-site-builder <command> [options]

Commands:
  generate    Generate a sitemap from Notion site configuration
  build       Build static HTML pages from Notion content
  publish     Build + commit + push to GitHub Pages
  preview     Build to local directory for preview

Options:
  --output <dir>     Output directory (default: ./_site)
  --repo <owner/repo> GitHub repository (e.g., TommySaunders-ai/thinkmachine-tools)
  --site-id <id>     Notion site page ID

Environment Variables:
  NOTION_API_KEY         Notion integration API key
  NOTION_SITE_ID         Notion site page ID
  NOTION_SITES_DB        Notion Sites database ID
  NOTION_PAGES_DB        Notion Pages database ID
  NOTION_SECTIONS_DB     Notion Sections database ID
  NOTION_SERVICES_DB     Notion Services database ID
  NOTION_TESTIMONIALS_DB Notion Testimonials database ID
  NOTION_TEAM_DB         Notion Team database ID
  GITHUB_REPO            GitHub repository (owner/repo)
  OUTPUT_DIR             Output directory
`);
        break;
    }
  } catch (err) {
    console.error(`\n[error] ${err.message}`);
    if (process.env.DEBUG) console.error(err.stack);
    process.exit(1);
  }
}

main();
