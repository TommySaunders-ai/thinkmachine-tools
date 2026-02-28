/**
 * GitHub Webhook Handler
 *
 * Processes incoming GitHub webhook events and triggers appropriate
 * Notion updates. Designed to run as a GitHub Actions workflow step
 * or as a standalone webhook receiver.
 *
 * Supported events:
 *   - push: Update Notion with deploy status after push
 *   - workflow_run: Update Notion when a build completes
 *   - issues: Sync GitHub issues to a Notion database
 *   - pull_request: Track PRs in Notion
 *
 * Usage in GitHub Actions:
 *   node src/webhooks/github-handler.js --event push --payload "$GITHUB_EVENT_PATH"
 *
 * Usage as module:
 *   import { GitHubWebhookHandler } from './github-handler.js';
 *   const handler = new GitHubWebhookHandler(config);
 *   await handler.handleEvent(eventType, payload);
 */

import { NotionService } from '../notion/client.js';
import { NotionAgent } from '../notion/agent.js';
import { createHmac } from 'crypto';

export class GitHubWebhookHandler {
  constructor({ apiKey, databases, siteId, webhookSecret }) {
    this.notion = new NotionService({ apiKey, databases });
    this.agent = new NotionAgent({ apiKey, databases, siteId });
    this.databases = databases;
    this.siteId = siteId;
    this.webhookSecret = webhookSecret;
  }

  // ─── Signature Verification ──────────────────────────────────────

  /**
   * Verify GitHub webhook signature (HMAC SHA-256).
   */
  verifySignature(payload, signature) {
    if (!this.webhookSecret) return true; // Skip if no secret configured

    const expected = `sha256=${createHmac('sha256', this.webhookSecret)
      .update(payload)
      .digest('hex')}`;

    return timingSafeEqual(expected, signature);
  }

  // ─── Event Router ────────────────────────────────────────────────

  /**
   * Route a GitHub event to the appropriate handler.
   */
  async handleEvent(eventType, payload) {
    console.log(`[webhook] Handling ${eventType} event`);

    switch (eventType) {
      case 'push':
        return this._handlePush(payload);

      case 'workflow_run':
        return this._handleWorkflowRun(payload);

      case 'deployment_status':
        return this._handleDeploymentStatus(payload);

      case 'issues':
        return this._handleIssue(payload);

      case 'pull_request':
        return this._handlePullRequest(payload);

      case 'create':
        return this._handleBranchCreate(payload);

      default:
        console.log(`[webhook] Unhandled event type: ${eventType}`);
        return { handled: false, eventType };
    }
  }

  // ─── Push Event ──────────────────────────────────────────────────

  async _handlePush(payload) {
    const { ref, commits, repository, sender, head_commit } = payload;
    const branch = ref?.replace('refs/heads/', '') || 'unknown';

    console.log(`[webhook] Push to ${branch} by ${sender?.login}`);
    console.log(`[webhook] ${commits?.length || 0} commit(s)`);

    // Check if this is an io-site-builder commit (avoid loops)
    if (head_commit?.author?.name === 'io-site-builder[bot]') {
      console.log('[webhook] Skipping bot commit');
      return { handled: true, skipped: true, reason: 'bot-commit' };
    }

    // Update site status in Notion
    if (branch === 'main' && this.siteId) {
      await this.agent.reportBuildStatus({
        siteId: this.siteId,
        status: 'Building',
      });

      // Sync commit info
      const commitMessages = (commits || [])
        .map((c) => `- ${c.message}`)
        .join('\n');

      console.log(`[webhook] Updated Notion: building from ${branch}`);

      return {
        handled: true,
        action: 'status-updated',
        branch,
        commits: commits?.length || 0,
      };
    }

    return { handled: true, action: 'no-action', branch };
  }

  // ─── Workflow Run Event ──────────────────────────────────────────

  async _handleWorkflowRun(payload) {
    const { workflow_run } = payload;
    const { name, conclusion, html_url, head_branch } = workflow_run || {};

    console.log(`[webhook] Workflow "${name}" ${conclusion} on ${head_branch}`);

    if (!this.siteId) return { handled: true, action: 'no-site-id' };

    if (conclusion === 'success') {
      // Derive deploy URL from repo info
      const repo = workflow_run.repository;
      const deployUrl = repo
        ? `https://${repo.owner.login}.github.io/${repo.name}/`
        : null;

      await this.agent.reportBuildStatus({
        siteId: this.siteId,
        status: 'Published',
        deployUrl,
      });

      console.log('[webhook] Updated Notion: Published');
    } else if (conclusion === 'failure') {
      await this.agent.reportBuildStatus({
        siteId: this.siteId,
        status: 'Draft',
        error: `Workflow "${name}" failed. See: ${html_url}`,
      });

      console.log('[webhook] Updated Notion: Build failed');
    }

    return {
      handled: true,
      action: 'workflow-status-synced',
      conclusion,
      workflow: name,
    };
  }

  // ─── Deployment Status Event ─────────────────────────────────────

  async _handleDeploymentStatus(payload) {
    const { deployment_status, deployment } = payload;
    const state = deployment_status?.state;
    const environment = deployment_status?.environment;
    const targetUrl = deployment_status?.target_url || deployment_status?.environment_url;

    console.log(`[webhook] Deployment ${state} for ${environment}`);

    if (!this.siteId) return { handled: true, action: 'no-site-id' };

    if (state === 'success') {
      await this.agent.reportBuildStatus({
        siteId: this.siteId,
        status: 'Published',
        deployUrl: targetUrl,
      });
    } else if (state === 'failure' || state === 'error') {
      await this.agent.reportBuildStatus({
        siteId: this.siteId,
        status: 'Draft',
        error: `Deployment ${state}: ${deployment_status?.description || 'Unknown error'}`,
      });
    }

    return { handled: true, action: 'deployment-synced', state };
  }

  // ─── Issue Event ─────────────────────────────────────────────────

  async _handleIssue(payload) {
    const { action, issue } = payload;

    // Only handle opened/closed events
    if (action !== 'opened' && action !== 'closed') {
      return { handled: true, action: 'no-action' };
    }

    console.log(`[webhook] Issue #${issue.number} ${action}: ${issue.title}`);

    // If we have a build log or issues database, create an entry
    if (this.databases.buildLog) {
      try {
        await this.notion.createPage(this.databases.buildLog, {
          Name: { title: [{ text: { content: `Issue #${issue.number}: ${issue.title}` } }] },
          'Build Status': { select: { name: action === 'opened' ? 'Draft' : 'Published' } },
          'Timestamp': { date: { start: new Date().toISOString() } },
        });
      } catch {
        // Build log may not have the right schema
      }
    }

    return { handled: true, action: `issue-${action}`, issue: issue.number };
  }

  // ─── Pull Request Event ──────────────────────────────────────────

  async _handlePullRequest(payload) {
    const { action, pull_request } = payload;

    if (!['opened', 'closed', 'merged'].includes(action)) {
      return { handled: true, action: 'no-action' };
    }

    const prAction = pull_request.merged ? 'merged' : action;
    console.log(`[webhook] PR #${pull_request.number} ${prAction}: ${pull_request.title}`);

    // If PR is merged to main, trigger a build notification
    if (prAction === 'merged' && pull_request.base?.ref === 'main' && this.siteId) {
      await this.agent.reportBuildStatus({
        siteId: this.siteId,
        status: 'Building',
      });
    }

    return { handled: true, action: `pr-${prAction}`, pr: pull_request.number };
  }

  // ─── Branch Create Event ─────────────────────────────────────────

  async _handleBranchCreate(payload) {
    const { ref_type, ref } = payload;
    console.log(`[webhook] Created ${ref_type}: ${ref}`);
    return { handled: true, action: 'branch-created', ref };
  }
}

// ─── CLI Entry Point ────────────────────────────────────────────────

/**
 * Process a GitHub webhook event from the command line.
 * Used in GitHub Actions workflows.
 */
export async function processWebhookFromCLI() {
  const args = process.argv.slice(2);
  let eventType = null;
  let payloadPath = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--event' && args[i + 1]) eventType = args[++i];
    if (args[i] === '--payload' && args[i + 1]) payloadPath = args[++i];
  }

  if (!eventType) {
    eventType = process.env.GITHUB_EVENT_NAME;
  }
  if (!payloadPath) {
    payloadPath = process.env.GITHUB_EVENT_PATH;
  }

  if (!eventType || !payloadPath) {
    console.error('Usage: node github-handler.js --event <type> --payload <path>');
    console.error('Or set GITHUB_EVENT_NAME and GITHUB_EVENT_PATH env vars');
    process.exit(1);
  }

  const { readFileSync } = await import('fs');
  const payload = JSON.parse(readFileSync(payloadPath, 'utf-8'));

  const handler = new GitHubWebhookHandler({
    apiKey: process.env.NOTION_API_KEY,
    databases: {
      sites: process.env.NOTION_SITES_DB,
      pages: process.env.NOTION_PAGES_DB,
      sections: process.env.NOTION_SECTIONS_DB,
      services: process.env.NOTION_SERVICES_DB,
      testimonials: process.env.NOTION_TESTIMONIALS_DB,
      team: process.env.NOTION_TEAM_DB,
      buildLog: process.env.NOTION_BUILD_LOG_DB,
    },
    siteId: process.env.NOTION_SITE_ID,
    webhookSecret: process.env.GITHUB_WEBHOOK_SECRET,
  });

  const result = await handler.handleEvent(eventType, payload);
  console.log('[webhook] Result:', JSON.stringify(result, null, 2));
}

/**
 * Timing-safe string comparison to prevent timing attacks.
 */
function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

// Run CLI handler if invoked directly
const isMainModule = process.argv[1]?.endsWith('github-handler.js');
if (isMainModule) {
  processWebhookFromCLI().catch((err) => {
    console.error(`[webhook] Fatal: ${err.message}`);
    process.exit(1);
  });
}
