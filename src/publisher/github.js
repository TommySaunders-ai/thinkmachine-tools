/**
 * GitHub Publisher
 *
 * Handles git operations to publish generated static sites to GitHub Pages:
 *   - Clone/pull target repository
 *   - Write generated files (HTML, CSS, sitemap, robots.txt)
 *   - Commit with descriptive messages
 *   - Push to trigger GitHub Actions → GitHub Pages deploy
 *   - Report deployment status
 */

import { simpleGit } from 'simple-git';
import { mkdirSync, writeFileSync, existsSync, rmSync } from 'fs';
import { join, dirname } from 'path';

export class GitHubPublisher {
  constructor({ workDir = '/tmp/io-site-builder', repo, branch = 'main' }) {
    this.workDir = workDir;
    this.repo = repo; // e.g. 'TommySaunders-ai/thinkmachine-tools'
    this.branch = branch;
    this.git = null;
    this.repoUrl = `https://github.com/${repo}.git`;
  }

  /**
   * Initialize: clone or pull the target repository.
   */
  async init() {
    if (existsSync(join(this.workDir, '.git'))) {
      this.git = simpleGit(this.workDir);
      await this.git.pull('origin', this.branch);
      console.log(`[publisher] Pulled latest from ${this.branch}`);
    } else {
      mkdirSync(this.workDir, { recursive: true });
      this.git = simpleGit();
      await this.git.clone(this.repoUrl, this.workDir, ['--branch', this.branch, '--single-branch']);
      this.git = simpleGit(this.workDir);
      console.log(`[publisher] Cloned ${this.repo} to ${this.workDir}`);
    }
    return this;
  }

  /**
   * Initialize from an existing local repo path.
   */
  initLocal(localPath) {
    this.workDir = localPath;
    this.git = simpleGit(localPath);
    console.log(`[publisher] Using local repo at ${localPath}`);
    return this;
  }

  /**
   * Write a file to the repo working directory.
   */
  writeFile(relativePath, content) {
    const fullPath = join(this.workDir, relativePath);
    mkdirSync(dirname(fullPath), { recursive: true });
    writeFileSync(fullPath, content, 'utf-8');
    return fullPath;
  }

  /**
   * Write multiple files at once.
   *
   * @param {Array<{path: string, content: string}>} files
   */
  writeFiles(files) {
    const written = [];
    for (const { path, content } of files) {
      this.writeFile(path, content);
      written.push(path);
    }
    console.log(`[publisher] Wrote ${written.length} files`);
    return written;
  }

  /**
   * Delete a file from the repo.
   */
  deleteFile(relativePath) {
    const fullPath = join(this.workDir, relativePath);
    if (existsSync(fullPath)) {
      rmSync(fullPath);
      return true;
    }
    return false;
  }

  /**
   * Stage, commit, and push all changes.
   *
   * @param {string} message - Commit message
   * @param {string[]} [files] - Specific files to stage (default: all)
   * @returns {{ committed: boolean, hash: string|null }}
   */
  async commitAndPush(message, files) {
    // Stage files
    if (files && files.length > 0) {
      await this.git.add(files);
    } else {
      await this.git.add('-A');
    }

    // Check if there are changes to commit
    const status = await this.git.status();
    if (status.files.length === 0) {
      console.log('[publisher] No changes to commit');
      return { committed: false, hash: null };
    }

    // Commit
    const result = await this.git.commit(message);
    const hash = result.commit;
    console.log(`[publisher] Committed: ${hash} — ${message}`);

    // Push with retry logic
    await this.#pushWithRetry();

    return { committed: true, hash };
  }

  /**
   * Push with exponential backoff retry (up to 4 attempts).
   */
  async #pushWithRetry(maxRetries = 4) {
    const delays = [2000, 4000, 8000, 16000];

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        await this.git.push('origin', this.branch, ['--set-upstream']);
        console.log(`[publisher] Pushed to origin/${this.branch}`);
        return;
      } catch (err) {
        if (attempt < maxRetries) {
          const delay = delays[attempt];
          console.log(`[publisher] Push failed, retrying in ${delay / 1000}s... (attempt ${attempt + 1}/${maxRetries})`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        } else {
          throw new Error(`Push failed after ${maxRetries} retries: ${err.message}`);
        }
      }
    }
  }

  /**
   * Get the current git status.
   */
  async getStatus() {
    return this.git.status();
  }

  /**
   * Get the latest commit hash.
   */
  async getLatestHash() {
    const log = await this.git.log({ maxCount: 1 });
    return log.latest?.hash || null;
  }

  /**
   * Ensure the GitHub Actions workflow file exists.
   */
  ensureWorkflow() {
    const workflowPath = '.github/workflows/static.yml';
    const fullPath = join(this.workDir, workflowPath);

    if (existsSync(fullPath)) return false;

    this.writeFile(workflowPath, GITHUB_PAGES_WORKFLOW);
    console.log('[publisher] Created GitHub Actions workflow');
    return true;
  }

  /**
   * Set CNAME for custom domain.
   */
  setCname(domain) {
    if (!domain) return;
    // Only set CNAME for custom domains, not github.io
    if (domain.includes('github.io')) return;
    this.writeFile('CNAME', domain);
    console.log(`[publisher] Set CNAME to ${domain}`);
  }
}

// ─── GitHub Actions Workflow Template ──────────────────────────────

const GITHUB_PAGES_WORKFLOW = `# Deploy static site to GitHub Pages
name: Deploy to Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v5
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
`;
