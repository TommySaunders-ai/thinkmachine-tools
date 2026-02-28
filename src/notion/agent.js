/**
 * Notion Agent — Two-Way Orchestration Module
 *
 * Provides bidirectional communication between the io-site-builder
 * and Notion workspaces. Monitors Notion databases for changes,
 * triggers builds when content is updated, and writes build status
 * back to Notion.
 *
 * Features:
 *   - Poll Notion databases for content changes
 *   - Detect new/updated pages and sections
 *   - Trigger rebuild pipeline on change detection
 *   - Write build status, deploy URLs, and timestamps back to Notion
 *   - Create build log entries in a dedicated Notion database
 *
 * Usage:
 *   import { NotionAgent } from './agent.js';
 *   const agent = new NotionAgent({ notion, config });
 *   await agent.start();       // Begin polling
 *   await agent.checkOnce();   // One-shot check
 */

import { NotionService } from './client.js';

export class NotionAgent {
  constructor({ apiKey, databases, siteId, pollIntervalMs = 60_000, onChangeDetected }) {
    this.notion = new NotionService({ apiKey, databases });
    this.databases = databases;
    this.siteId = siteId;
    this.pollIntervalMs = pollIntervalMs;
    this.onChangeDetected = onChangeDetected || (() => {});
    this._lastChecked = new Date().toISOString();
    this._running = false;
    this._timer = null;
    this._knownHashes = new Map();
  }

  // ─── Polling Lifecycle ────────────────────────────────────────────

  /**
   * Start polling Notion for changes.
   */
  async start() {
    if (this._running) return;
    this._running = true;
    console.log(`[notion-agent] Started polling every ${this.pollIntervalMs / 1000}s`);

    // Initial snapshot
    await this._snapshotState();

    this._poll();
  }

  /**
   * Stop polling.
   */
  stop() {
    this._running = false;
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
    console.log('[notion-agent] Stopped polling');
  }

  /**
   * One-shot change detection (no continuous polling).
   */
  async checkOnce() {
    console.log('[notion-agent] Running one-shot change detection...');
    const changes = await this._detectChanges();

    if (changes.length > 0) {
      console.log(`[notion-agent] Detected ${changes.length} change(s)`);
      for (const change of changes) {
        console.log(`  ${change.type}: ${change.title} (${change.database})`);
      }
      await this.onChangeDetected(changes);
    } else {
      console.log('[notion-agent] No changes detected');
    }

    return changes;
  }

  // ─── Change Detection ────────────────────────────────────────────

  async _poll() {
    if (!this._running) return;

    try {
      const changes = await this._detectChanges();

      if (changes.length > 0) {
        console.log(`[notion-agent] Detected ${changes.length} change(s)`);
        await this.onChangeDetected(changes);
      }

      this._lastChecked = new Date().toISOString();
    } catch (err) {
      console.error(`[notion-agent] Poll error: ${err.message}`);
    }

    if (this._running) {
      this._timer = setTimeout(() => this._poll(), this.pollIntervalMs);
    }
  }

  async _detectChanges() {
    const changes = [];
    const dbChecks = [
      { key: 'sites', label: 'Sites' },
      { key: 'pages', label: 'Pages' },
      { key: 'sections', label: 'Sections' },
      { key: 'services', label: 'Services' },
      { key: 'testimonials', label: 'Testimonials' },
      { key: 'team', label: 'Team' },
    ];

    for (const { key, label } of dbChecks) {
      const dbId = this.databases[key];
      if (!dbId) continue;

      try {
        const results = await this._queryRecentlyEdited(dbId);
        for (const page of results) {
          const hash = this._computePageHash(page);
          const previousHash = this._knownHashes.get(page.id);

          if (previousHash && previousHash !== hash) {
            changes.push({
              type: 'updated',
              database: label,
              pageId: page.id,
              title: this._extractPageTitle(page),
              lastEdited: page.last_edited_time,
            });
          } else if (!previousHash) {
            changes.push({
              type: 'created',
              database: label,
              pageId: page.id,
              title: this._extractPageTitle(page),
              lastEdited: page.last_edited_time,
            });
          }

          this._knownHashes.set(page.id, hash);
        }
      } catch (err) {
        console.warn(`[notion-agent] Failed to query ${label}: ${err.message}`);
      }
    }

    return changes;
  }

  async _snapshotState() {
    const dbIds = Object.values(this.databases).filter(Boolean);

    for (const dbId of dbIds) {
      try {
        const response = await this.notion.client.databases.query({
          database_id: dbId,
          page_size: 100,
        });

        for (const page of response.results) {
          this._knownHashes.set(page.id, this._computePageHash(page));
        }
      } catch {
        // Skip databases we can't access
      }
    }

    console.log(`[notion-agent] Snapshot: tracking ${this._knownHashes.size} pages`);
  }

  async _queryRecentlyEdited(databaseId) {
    const response = await this.notion.client.databases.query({
      database_id: databaseId,
      filter: {
        timestamp: 'last_edited_time',
        last_edited_time: {
          on_or_after: this._lastChecked,
        },
      },
      page_size: 100,
    });

    return response.results;
  }

  // ─── Status Write-Back ────────────────────────────────────────────

  /**
   * Update the site status in Notion after a build.
   */
  async reportBuildStatus({ siteId, status, deployUrl, buildFiles, error }) {
    const sId = siteId || this.siteId;
    if (!sId) return;

    try {
      // Update site status
      await this.notion.updateSiteStatus(sId, status);
      console.log(`[notion-agent] Updated site status to: ${status}`);

      // If there's a build log database, create an entry
      if (this.databases.buildLog) {
        await this.notion.createPage(this.databases.buildLog, {
          'Build Status': { select: { name: status } },
          'Timestamp': { date: { start: new Date().toISOString() } },
          'Deploy URL': deployUrl ? { url: deployUrl } : undefined,
          'Files Count': buildFiles ? { number: buildFiles.length } : undefined,
          'Error': error ? { rich_text: [{ text: { content: error.slice(0, 2000) } }] } : undefined,
        });
      }
    } catch (err) {
      console.error(`[notion-agent] Failed to report build status: ${err.message}`);
    }
  }

  /**
   * Update individual page statuses after generation.
   */
  async reportPageStatuses(pages) {
    for (const page of pages) {
      if (page.id && page.status) {
        try {
          await this.notion.updatePageStatus(page.id, page.status);
        } catch (err) {
          console.warn(`[notion-agent] Failed to update page ${page.id}: ${err.message}`);
        }
      }
    }
  }

  /**
   * Write generated content back to Notion (e.g., SEO fields, deploy info).
   */
  async syncGeneratedData({ siteId, deployUrl, pages }) {
    const sId = siteId || this.siteId;

    // Update site with deploy URL
    if (sId && deployUrl) {
      try {
        await this.notion.updatePage(sId, {
          Domain: { url: deployUrl },
        });
      } catch {
        // Domain property may not exist as URL type
      }
    }

    // Update pages with generated SEO data
    if (pages) {
      for (const page of pages) {
        if (!page.id) continue;

        const updates = {};
        if (page.seoTitle) {
          updates['SEO Title'] = { rich_text: [{ text: { content: page.seoTitle } }] };
        }
        if (page.seoDescription) {
          updates['SEO Description'] = { rich_text: [{ text: { content: page.seoDescription } }] };
        }
        if (Object.keys(updates).length > 0) {
          try {
            await this.notion.updatePage(page.id, updates);
          } catch {
            // Skip pages that can't be updated
          }
        }
      }
    }
  }

  // ─── Notion Content Creation (from GitHub) ────────────────────────

  /**
   * Create a page in Notion from external data (e.g., GitHub event).
   */
  async createPageFromExternal({ database, properties }) {
    const dbId = this.databases[database];
    if (!dbId) {
      throw new Error(`Unknown database: ${database}`);
    }
    return this.notion.createPage(dbId, properties);
  }

  /**
   * Bulk-update section statuses for a page.
   */
  async markSectionsBuilt(pageId) {
    try {
      const sections = await this.notion.getSectionsForPage(pageId);
      for (const section of sections) {
        await this.notion.updatePage(section.id, {
          'Build Status': { select: { name: 'Built' } },
        });
      }
    } catch {
      // Build Status property may not exist
    }
  }

  // ─── Helpers ──────────────────────────────────────────────────────

  _computePageHash(page) {
    // Simple hash based on last_edited_time and property values
    const edited = page.last_edited_time || '';
    const props = JSON.stringify(page.properties || {});
    return `${edited}:${simpleHash(props)}`;
  }

  _extractPageTitle(page) {
    const props = page.properties || {};
    for (const prop of Object.values(props)) {
      if (prop.type === 'title' && prop.title?.length > 0) {
        return prop.title.map((t) => t.plain_text).join('');
      }
    }
    return '(untitled)';
  }
}

/**
 * Simple string hash for change detection.
 */
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(36);
}
