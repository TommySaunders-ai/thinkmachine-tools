/**
 * Bulk Publisher
 *
 * Publishes up to 10,000+ articles from Notion to static HTML on GitHub Pages.
 * Pipeline: Notion → Build Area Landings → Build Articles → Build Areas Home → Deploy → URL Write-back
 *
 * Supports:
 *   - Full area publish (all articles in an area)
 *   - Batch publish by batch ID
 *   - Selective publish by article IDs
 *   - Resume from failed batch (skip already-built)
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { NotionService } from '../notion/client.js';
import { AREAS, getContentType } from '../notion/section-library.js';
import { generateArticlePage } from '../generator/article-page.js';
import { generateAreaLanding } from '../generator/area-landing.js';
import { generateAreasHome } from '../generator/areas-home.js';

/**
 * Bulk publish pipeline.
 *
 * @param {Object} config - io-site-builder.config.json
 * @param {Object} options
 * @param {string} [options.area] - Area ID to publish (e.g., 'notion-io')
 * @param {string} [options.batchId] - Batch ID filter
 * @param {string[]} [options.articleIds] - Specific article IDs
 * @param {string} [options.status] - Filter by status (default: 'Approved')
 * @param {string} [options.outputDir] - Output directory (default: 'dist')
 * @param {boolean} [options.writeBack] - Write URLs back to Notion (default: true)
 * @param {number} [options.concurrency] - Parallel Notion API requests (default: 3)
 * @param {Function} [options.onProgress] - Progress callback({ phase, current, total, article })
 */
export async function bulkPublish(config, options = {}) {
  const {
    area: areaId,
    batchId,
    articleIds,
    status = 'Approved',
    outputDir = 'dist',
    writeBack = true,
    concurrency = 3,
    onProgress,
    theme = 'G100',
    baseUrl = '',
  } = options;

  const notion = new NotionService({
    apiKey: config.notionApiKey || process.env.NOTION_API_KEY,
    databases: config.databases || {},
  });

  const siteConfig = { name: config.siteName || 'Intelligent Operations', domain: config.domain || '' };
  const results = { built: [], failed: [], skipped: [], areaCounts: {} };

  // ─── Phase 1: Collect articles ──────────────────────────────────

  onProgress?.({ phase: 'collecting', current: 0, total: 0 });
  let articles = [];

  if (articleIds && articleIds.length > 0) {
    // Selective publish
    for (const id of articleIds) {
      try {
        const article = await notion.getArticleWithBody(id);
        articles.push(article);
      } catch (err) {
        results.failed.push({ id, error: err.message });
      }
    }
  } else {
    // Query by area and/or status
    const areas = areaId ? [AREAS.find(a => a.id === areaId)].filter(Boolean) : AREAS;

    for (const area of areas) {
      const areaArticles = await notion.getArticlesForArea(area.name, { status });

      // Filter by batch ID if specified
      const filtered = batchId
        ? areaArticles.filter(a => a.batchId === batchId)
        : areaArticles;

      articles.push(...filtered);
      results.areaCounts[area.id] = filtered.length;
    }
  }

  onProgress?.({ phase: 'collected', current: articles.length, total: articles.length });

  if (articles.length === 0) {
    console.log('No articles to publish.');
    return results;
  }

  // ─── Phase 2: Build area landing pages (first) ─────────────────

  onProgress?.({ phase: 'area-landings', current: 0, total: AREAS.length });

  const articlesByArea = {};
  for (const article of articles) {
    const aName = article.areaOfIO || 'Uncategorized';
    if (!articlesByArea[aName]) articlesByArea[aName] = [];
    articlesByArea[aName].push(article);
  }

  for (const area of AREAS) {
    const areaArticles = articlesByArea[area.name] || [];
    if (areaArticles.length === 0 && !areaId) continue;

    const html = generateAreaLanding(area, areaArticles, { theme, siteConfig, baseUrl });
    const outPath = join(outputDir, 'areas', area.id, 'index.html');
    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, html, 'utf-8');

    onProgress?.({ phase: 'area-landings', current: 0, total: 0, article: area.name });
  }

  // ─── Phase 3: Build article pages (batched) ────────────────────

  onProgress?.({ phase: 'articles', current: 0, total: articles.length });
  const urlMap = [];

  for (let i = 0; i < articles.length; i += concurrency) {
    const batch = articles.slice(i, i + concurrency);

    await Promise.all(batch.map(async (article) => {
      try {
        // Fetch full body if not already loaded
        let fullArticle = article;
        if (!article.bodySections) {
          fullArticle = await notion.getArticleWithBody(article.id);
        }

        const areaSlug = AREAS.find(a => a.name === fullArticle.areaOfIO)?.id || 'articles';
        const slug = fullArticle.urlSlug || fullArticle.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const breadcrumbs = [
          { label: 'Areas', href: `${baseUrl}/areas` },
          { label: fullArticle.areaOfIO || 'Articles', href: `${baseUrl}/areas/${areaSlug}` },
          { label: fullArticle.title, href: '' },
        ];

        const html = generateArticlePage(fullArticle, { theme, siteConfig, baseUrl, breadcrumbs });
        const outPath = join(outputDir, 'areas', areaSlug, slug, 'index.html');
        await mkdir(dirname(outPath), { recursive: true });
        await writeFile(outPath, html, 'utf-8');

        const publishedUrl = `${baseUrl}/areas/${areaSlug}/${slug}`;
        urlMap.push({ id: fullArticle.id, url: publishedUrl });
        results.built.push({ id: fullArticle.id, title: fullArticle.title, url: publishedUrl });
      } catch (err) {
        results.failed.push({ id: article.id, title: article.title, error: err.message });
      }
    }));

    onProgress?.({ phase: 'articles', current: Math.min(i + concurrency, articles.length), total: articles.length });

    // Rate limit for Notion API
    if (i + concurrency < articles.length) {
      await new Promise(r => setTimeout(r, 1100));
    }
  }

  // ─── Phase 4: Build Areas Home page (last — needs counts) ──────

  onProgress?.({ phase: 'areas-home', current: 0, total: 1 });

  // Count articles per area
  const finalCounts = {};
  for (const area of AREAS) {
    finalCounts[area.id] = (articlesByArea[area.name] || []).length;
  }

  const homeHtml = generateAreasHome(finalCounts, { theme, siteConfig, baseUrl });
  const homePath = join(outputDir, 'areas', 'index.html');
  await mkdir(dirname(homePath), { recursive: true });
  await writeFile(homePath, homeHtml, 'utf-8');

  // ─── Phase 5: URL Write-back to Notion ─────────────────────────

  if (writeBack && urlMap.length > 0) {
    onProgress?.({ phase: 'write-back', current: 0, total: urlMap.length });

    const writeResults = await notion.batchWriteBackUrls(urlMap, concurrency);
    const successCount = writeResults.filter(r => r.status === 'fulfilled').length;

    onProgress?.({ phase: 'write-back', current: successCount, total: urlMap.length });
  }

  // ─── Done ──────────────────────────────────────────────────────

  onProgress?.({ phase: 'complete', current: results.built.length, total: articles.length });

  return results;
}

/**
 * CLI entry point for bulk publishing.
 */
export async function bulkPublishFromCLI(config, args) {
  const area = getArg(args, '--area');
  const batchId = getArg(args, '--batch');
  const status = getArg(args, '--status') || 'Approved';
  const outputDir = getArg(args, '--output') || 'dist';
  const noWriteBack = args.includes('--no-write-back');
  const theme = getArg(args, '--theme') || config.theme || 'G100';
  const baseUrl = getArg(args, '--base-url') || config.domain || '';

  console.log(`\n=== Bulk Publish ===`);
  console.log(`Area: ${area || 'all'} | Status: ${status} | Output: ${outputDir}`);
  console.log(`Write-back: ${!noWriteBack} | Theme: ${theme}\n`);

  const results = await bulkPublish(config, {
    area,
    batchId,
    status,
    outputDir,
    writeBack: !noWriteBack,
    theme,
    baseUrl,
    onProgress: ({ phase, current, total }) => {
      process.stdout.write(`\r  [${phase}] ${current}/${total}   `);
    },
  });

  console.log('\n\n=== Results ===');
  console.log(`  Built: ${results.built.length}`);
  console.log(`  Failed: ${results.failed.length}`);
  if (results.failed.length > 0) {
    for (const f of results.failed.slice(0, 10)) {
      console.log(`    - ${f.title || f.id}: ${f.error}`);
    }
  }
  console.log('');
  return results;
}

function getArg(args, flag) {
  const idx = args.indexOf(flag);
  return idx >= 0 && idx + 1 < args.length ? args[idx + 1] : null;
}
