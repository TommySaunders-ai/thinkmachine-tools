/**
 * Notion Sync — Bidirectional Notion ↔ GitHub Sync
 *
 * Synchronizes content between Notion databases and the GitHub repository.
 *
 * Sync directions:
 *   - Notion → GitHub: Pull content from Notion, build site, push to GitHub
 *   - GitHub → Notion: Read repo state, update Notion with deploy info
 *
 * Usage:
 *   import { NotionSync } from './notion-sync.js';
 *   const sync = new NotionSync(config);
 *   await sync.pullFromNotion();    // Notion → GitHub
 *   await sync.pushToNotion();      // GitHub → Notion
 *   await sync.fullSync();          // Both directions
 */

import { NotionService } from '../notion/client.js';
import { NotionAgent } from '../notion/agent.js';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export class NotionSync {
  constructor({ apiKey, databases, siteId, github, outputDir, projectRoot }) {
    this.notion = new NotionService({ apiKey, databases });
    this.agent = new NotionAgent({ apiKey, databases, siteId });
    this.databases = databases;
    this.siteId = siteId;
    this.github = github;
    this.outputDir = outputDir;
    this.projectRoot = projectRoot || process.cwd();
  }

  // ─── Notion → GitHub (Pull) ──────────────────────────────────────

  /**
   * Pull content from Notion and prepare for build.
   * Returns the extracted site data for the build pipeline.
   */
  async pullFromNotion() {
    console.log('[notion-sync] Pulling content from Notion...');

    const siteData = await this.notion.extractFullSite(this.siteId);
    console.log(`[notion-sync] Extracted site: ${siteData.site.name}`);
    console.log(`[notion-sync]   Pages: ${siteData.pages.length}`);
    console.log(`[notion-sync]   Services: ${siteData.contentDatabases.services.length}`);
    console.log(`[notion-sync]   Testimonials: ${siteData.contentDatabases.testimonials.length}`);
    console.log(`[notion-sync]   Team members: ${siteData.contentDatabases.team.length}`);

    // Mark site as building
    await this.agent.reportBuildStatus({
      siteId: this.siteId,
      status: 'Building',
    });

    return siteData;
  }

  // ─── GitHub → Notion (Push) ──────────────────────────────────────

  /**
   * Push build results back to Notion (status, URLs, timestamps).
   */
  async pushToNotion({ buildResult, deployUrl, error }) {
    console.log('[notion-sync] Pushing build results to Notion...');

    if (error) {
      await this.agent.reportBuildStatus({
        siteId: this.siteId,
        status: 'Draft',
        error: error.message || String(error),
      });
      console.log('[notion-sync] Reported build failure to Notion');
      return;
    }

    // Update site status to Published
    await this.agent.reportBuildStatus({
      siteId: this.siteId,
      status: 'Published',
      deployUrl,
      buildFiles: buildResult?.files,
    });

    // Update deploy URL on the site
    if (deployUrl) {
      await this.agent.syncGeneratedData({
        siteId: this.siteId,
        deployUrl,
      });
    }

    console.log('[notion-sync] Build results synced to Notion');
  }

  // ─── Full Sync ───────────────────────────────────────────────────

  /**
   * Full bidirectional sync:
   *   1. Pull latest from Notion
   *   2. Return data for build pipeline (caller handles build)
   *   3. After build, push results back
   */
  async fullSync({ buildFn }) {
    console.log('[notion-sync] Starting full sync...\n');

    // 1. Pull from Notion
    const siteData = await this.pullFromNotion();

    // 2. Build (caller provides build function)
    let buildResult = null;
    let deployUrl = null;
    let error = null;

    try {
      const result = await buildFn(siteData);
      buildResult = result;

      // Derive deploy URL
      if (this.github?.repo) {
        const [owner, repo] = this.github.repo.split('/');
        deployUrl = `https://${owner}.github.io/${repo}/`;
      }
    } catch (err) {
      error = err;
      console.error(`[notion-sync] Build failed: ${err.message}`);
    }

    // 3. Push results back to Notion
    await this.pushToNotion({ buildResult, deployUrl, error });

    return { siteData, buildResult, deployUrl, error };
  }

  // ─── Diff Detection ─────────────────────────────────────────────

  /**
   * Compare Notion content against the last known state
   * to determine what has changed.
   */
  async detectChanges() {
    console.log('[notion-sync] Detecting changes...');

    const stateFile = join(this.projectRoot, '.notion-sync-state.json');
    let previousState = {};

    if (existsSync(stateFile)) {
      try {
        previousState = JSON.parse(readFileSync(stateFile, 'utf-8'));
      } catch {
        previousState = {};
      }
    }

    // Fetch current state
    const currentState = await this._captureState();

    // Compute diff
    const changes = [];

    for (const [pageId, current] of Object.entries(currentState.pages || {})) {
      const previous = previousState.pages?.[pageId];
      if (!previous) {
        changes.push({ type: 'created', pageId, title: current.title });
      } else if (previous.lastEdited !== current.lastEdited) {
        changes.push({ type: 'updated', pageId, title: current.title });
      }
    }

    // Detect deletions
    for (const pageId of Object.keys(previousState.pages || {})) {
      if (!currentState.pages?.[pageId]) {
        changes.push({ type: 'deleted', pageId, title: previousState.pages[pageId].title });
      }
    }

    return { changes, currentState };
  }

  /**
   * Save current state snapshot for future diff detection.
   */
  async saveState(state) {
    const { writeFileSync } = await import('fs');
    const stateFile = join(this.projectRoot, '.notion-sync-state.json');
    writeFileSync(stateFile, JSON.stringify(state, null, 2));
    console.log('[notion-sync] State saved');
  }

  async _captureState() {
    const state = { pages: {}, lastSync: new Date().toISOString() };

    try {
      const siteData = await this.notion.extractFullSite(this.siteId);

      for (const page of siteData.pages) {
        state.pages[page.id] = {
          title: page.name,
          route: page.route,
          status: page.status,
          lastEdited: page.lastEdited || new Date().toISOString(),
          sectionCount: page.sections?.length || 0,
        };
      }
    } catch (err) {
      console.warn(`[notion-sync] State capture failed: ${err.message}`);
    }

    return state;
  }

  // ─── Selective Sync ──────────────────────────────────────────────

  /**
   * Sync only specific pages (by Notion page ID).
   */
  async syncPages(pageIds) {
    console.log(`[notion-sync] Syncing ${pageIds.length} specific page(s)...`);

    const pages = [];
    for (const pageId of pageIds) {
      try {
        const page = await this.notion.client.pages.retrieve({ page_id: pageId });
        pages.push(page);
      } catch (err) {
        console.warn(`[notion-sync] Failed to fetch page ${pageId}: ${err.message}`);
      }
    }

    return pages;
  }

  /**
   * Sync a specific database (e.g., only Services or Testimonials).
   */
  async syncDatabase(databaseKey) {
    const dbId = this.databases[databaseKey];
    if (!dbId) {
      throw new Error(`Unknown database key: ${databaseKey}`);
    }

    console.log(`[notion-sync] Syncing database: ${databaseKey}`);

    switch (databaseKey) {
      case 'services':
        return this.notion.getServices();
      case 'testimonials':
        return this.notion.getTestimonials();
      case 'team':
        return this.notion.getTeamMembers();
      default: {
        const response = await this.notion.client.databases.query({
          database_id: dbId,
          page_size: 100,
        });
        return response.results;
      }
    }
  }
}
