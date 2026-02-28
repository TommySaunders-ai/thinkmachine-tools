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

import { readFileSync as readEnvFile, existsSync as envExists } from 'fs';
import { join as joinEnv, dirname as dirnameEnv } from 'path';
import { fileURLToPath as urlToPathEnv } from 'url';

// Auto-load .env from project root
const __envDir = dirnameEnv(urlToPathEnv(import.meta.url));
const __envPath = joinEnv(__envDir, '..', '..', '.env');
if (envExists(__envPath)) {
  for (const line of readEnvFile(__envPath, 'utf-8').split('\n')) {
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

import { NotionService } from '../notion/client.js';
import { NotionAgent } from '../notion/agent.js';
import { NotionSync } from '../sync/notion-sync.js';
import { selectComponentsForPage } from '../carbon/selector.js';
import { generatePage } from '../generator/html.js';
import { generateSitemap, generateSitemap as genSitemap } from '../generator/seo.js';
import { generateRobotsTxt } from '../generator/seo.js';
import { generateJsonLd } from '../generator/seo.js';
import { generateThemeCss } from '../generator/theme.js';
import { GitHubPublisher } from '../publisher/github.js';
import { bulkPublishFromCLI } from '../publisher/bulk-publisher.js';
import { generateArticlePage } from '../generator/article-page.js';
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
        buildLog: process.env.NOTION_BUILD_LOG_DB || '',
        articles: process.env.NOTION_ARTICLES_DB || '',
        questions: process.env.NOTION_QUESTIONS_DB || '',
        structuredData: process.env.NOTION_STRUCTURED_DATA_DB || '',
        sectionLibrary: process.env.NOTION_SECTION_LIBRARY_DB || '',
        areas: process.env.NOTION_AREAS_DB || '',
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

// ─── Sync Command ──────────────────────────────────────────────────

async function commandSync(config, args) {
  const direction = getArg(args, '--direction') || 'full';
  const status = getArg(args, '--status');
  const error = getArg(args, '--error');
  const detectOnly = args.includes('--detect-only');

  if (!config.notion.apiKey || !config.siteId) {
    console.error('[sync] NOTION_API_KEY and NOTION_SITE_ID are required for sync');
    process.exit(1);
  }

  const sync = new NotionSync({
    apiKey: config.notion.apiKey,
    databases: config.notion.databases,
    siteId: config.siteId,
    github: config.github,
    outputDir: config.outputDir,
    projectRoot: PROJECT_ROOT,
  });

  if (detectOnly) {
    console.log('=== Detecting Notion Changes ===\n');
    const { changes } = await sync.detectChanges();
    if (changes.length > 0) {
      console.log(`${changes.length} changes detected:`);
      for (const c of changes) {
        console.log(`  [${c.type}] ${c.title} (${c.pageId})`);
      }
    } else {
      console.log('No changes detected');
    }
    return;
  }

  if (direction === 'push-only') {
    console.log('=== Syncing Status to Notion ===\n');
    await sync.pushToNotion({
      buildResult: null,
      deployUrl: config.github.repo
        ? `https://${config.github.repo.split('/')[0]}.github.io/${config.github.repo.split('/')[1]}/`
        : null,
      error: error ? new Error(error) : null,
    });
    return;
  }

  if (direction === 'pull-only') {
    console.log('=== Pulling from Notion ===\n');
    const siteData = await sync.pullFromNotion();
    // Build without status write-back
    await commandBuild({ ...config, _siteData: siteData });
    return;
  }

  // Full sync
  console.log('=== Full Notion Sync ===\n');
  await sync.fullSync({
    buildFn: async (siteData) => {
      return commandBuild({ ...config, _siteData: siteData });
    },
  });
}

// ─── Agent Command ─────────────────────────────────────────────────

async function commandAgent(config, args) {
  const interval = parseInt(getArg(args, '--interval') || '60', 10);
  const oneShot = args.includes('--once');

  if (!config.notion.apiKey || !config.siteId) {
    console.error('[agent] NOTION_API_KEY and NOTION_SITE_ID are required');
    process.exit(1);
  }

  const agent = new NotionAgent({
    apiKey: config.notion.apiKey,
    databases: config.notion.databases,
    siteId: config.siteId,
    pollIntervalMs: interval * 1000,
    onChangeDetected: async (changes) => {
      console.log(`\n[agent] ${changes.length} change(s) detected — triggering rebuild...\n`);

      try {
        await commandBuild(config);
        await agent.reportBuildStatus({
          siteId: config.siteId,
          status: 'Published',
        });
        console.log('[agent] Build complete, status synced to Notion');
      } catch (err) {
        console.error(`[agent] Build failed: ${err.message}`);
        await agent.reportBuildStatus({
          siteId: config.siteId,
          status: 'Draft',
          error: err.message,
        });
      }
    },
  });

  if (oneShot) {
    console.log('=== Notion Agent (One-Shot) ===\n');
    await agent.checkOnce();
  } else {
    console.log('=== Notion Agent (Continuous) ===\n');
    console.log(`Polling every ${interval}s. Press Ctrl+C to stop.\n`);
    await agent.start();

    // Keep process alive
    await new Promise(() => {});
  }
}

// ─── Entry Point ───────────────────────────────────────────────────

function getArg(args, flag) {
  const idx = args.indexOf(flag);
  if (idx !== -1 && args[idx + 1]) return args[idx + 1];
  return null;
}

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
      case 'sync':
        await commandSync(config, args);
        break;
      case 'agent':
        await commandAgent(config, args);
        break;
      case 'bulk-publish':
        await bulkPublishFromCLI({
          notionApiKey: config.notion.apiKey,
          databases: config.notion.databases,
          siteName: 'Intelligent Operations',
          domain: config.domain || '',
          theme: 'G100',
        }, args);
        break;
      case 'build-article': {
        const articleId = getArg(args, '--id');
        if (!articleId) { console.error('Error: --id required'); process.exit(1); }
        const notion = new NotionService(config.notion);
        const article = await notion.getArticleWithBody(articleId);
        const html = generateArticlePage(article, { theme: 'G100' });
        const outDir = getArg(args, '--output') || config.outputDir || '_site';
        const slug = article.urlSlug || article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const outPath = join(outDir, 'areas', slug, 'index.html');
        mkdirSync(dirname(outPath), { recursive: true });
        writeFileSync(outPath, html, 'utf-8');
        console.log(`Built: ${outPath}`);
        break;
      }
      default:
        console.log(`
intelligentoperations.ai Site Builder

Usage: io-site-builder <command> [options]

Commands:
  generate    Generate a sitemap from Notion site configuration
  build       Build static HTML pages from Notion content
  publish     Build + commit + push to GitHub Pages
  preview     Build to local directory for preview
  sync        Bidirectional Notion <-> GitHub sync
  agent       Start the Notion agent for continuous change detection
  bulk-publish  Bulk publish articles from Notion (10,000+ supported)
  build-article Build a single article by Notion page ID

Sync Options:
  --direction <dir>  Sync direction: full, pull-only, push-only, detect-only
  --detect-only      Only check for changes (no build)
  --status <status>  Status to write back (for push-only)
  --error <msg>      Error message to write back (for push-only)

Agent Options:
  --interval <sec>   Polling interval in seconds (default: 60)
  --once             Run one-shot detection and exit

Bulk Publish Options:
  --area <id>        Area ID (e.g., notion-io) or omit for all
  --batch <id>       Batch ID filter
  --status <status>  Article status filter (default: Approved)
  --no-write-back    Skip writing URLs back to Notion
  --theme <theme>    Carbon theme (White, G10, G90, G100)

Build Article Options:
  --id <page-id>     Notion page ID of the article

General Options:
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
  NOTION_BUILD_LOG_DB    Notion Build Log database ID
  NOTION_ARTICLES_DB     Notion Articles database ID
  NOTION_QUESTIONS_DB    Notion Questions database ID
  NOTION_STRUCTURED_DATA_DB  Notion Structured Data database ID
  NOTION_AREAS_DB        Notion Areas database ID
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
