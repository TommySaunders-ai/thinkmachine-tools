/**
 * Notion Integration Service
 *
 * Extracts site configuration, pages, sections, and content blocks
 * from Notion databases to feed into the AI site builder pipeline.
 *
 * Database architecture:
 *   Sites → Pages → Sections → Content (Services, Testimonials, Team, etc.)
 */

import { Client } from '@notionhq/client';

export class NotionService {
  constructor({ apiKey, databases }) {
    this.client = new Client({ auth: apiKey });
    this.databases = databases; // { sites, pages, sections, services, testimonials, team }
  }

  // ─── Site Configuration ────────────────────────────────────────────

  async getSiteConfig(siteId) {
    const page = await this.client.pages.retrieve({ page_id: siteId });
    return this.#parseSiteProperties(page.properties);
  }

  async listSites(filter) {
    const response = await this.client.databases.query({
      database_id: this.databases.sites,
      filter: filter || undefined,
    });
    return response.results.map((page) => ({
      id: page.id,
      ...this.#parseSiteProperties(page.properties),
    }));
  }

  #parseSiteProperties(props) {
    return {
      name: this.#extractTitle(props['Site Name'] || props['Name']),
      domain: this.#extractUrl(props['Domain']),
      repo: this.#extractText(props['GitHub Repo']),
      businessType: this.#extractSelect(props['Business Type']),
      brandDescription: this.#extractRichText(props['Brand Description']),
      targetAudience: this.#extractMultiSelect(props['Target Audience']),
      primaryColor: this.#extractText(props['Primary Color']),
      theme: this.#extractSelect(props['Theme']) || 'G100',
      status: this.#extractSelect(props['Status']) || 'Draft',
    };
  }

  // ─── Pages ─────────────────────────────────────────────────────────

  async getPagesForSite(siteId) {
    const response = await this.client.databases.query({
      database_id: this.databases.pages,
      filter: {
        property: 'Site',
        relation: { contains: siteId },
      },
      sorts: [{ property: 'Nav Order', direction: 'ascending' }],
    });

    const pages = [];
    for (const page of response.results) {
      const parsed = this.#parsePageProperties(page.properties);
      parsed.id = page.id;
      parsed.content = await this.getBlockContent(page.id);
      pages.push(parsed);
    }
    return pages;
  }

  #parsePageProperties(props) {
    return {
      name: this.#extractTitle(props['Page Name'] || props['Name']),
      route: this.#extractText(props['Route']) || '/',
      pageType: this.#extractSelect(props['Page Type']) || 'Landing',
      parentPage: this.#extractRelation(props['Parent Page']),
      navOrder: this.#extractNumber(props['Nav Order']) || 0,
      isGlobal: this.#extractCheckbox(props['Is Global']),
      sectionIds: this.#extractRelation(props['Sections']),
      status: this.#extractSelect(props['Status']) || 'Draft',
      seoTitle: this.#extractText(props['SEO Title']),
      seoDescription: this.#extractText(props['SEO Description']),
    };
  }

  // ─── Sections ──────────────────────────────────────────────────────

  async getSectionsForPage(pageId) {
    const response = await this.client.databases.query({
      database_id: this.databases.sections,
      filter: {
        property: 'Page',
        relation: { contains: pageId },
      },
      sorts: [{ property: 'Order', direction: 'ascending' }],
    });

    const sections = [];
    for (const page of response.results) {
      const parsed = this.#parseSectionProperties(page.properties);
      parsed.id = page.id;
      parsed.content = await this.getBlockContent(page.id);

      // Resolve content source relations
      if (parsed.contentSourceIds && parsed.contentSourceIds.length > 0) {
        parsed.contentSource = await this.#resolveContentSource(
          parsed.contentSourceIds
        );
      }

      sections.push(parsed);
    }
    return sections;
  }

  #parseSectionProperties(props) {
    return {
      name: this.#extractTitle(props['Section Name'] || props['Name']),
      sectionType: this.#extractSelect(props['Section Type']) || 'Content',
      carbonComponent: this.#extractText(props['Carbon Component']),
      order: this.#extractNumber(props['Order']) || 0,
      isGlobal: this.#extractCheckbox(props['Is Global']),
      contentSourceIds: this.#extractRelation(props['Content Source']),
    };
  }

  // ─── Content Databases ─────────────────────────────────────────────

  async getServices() {
    if (!this.databases.services) return [];
    const response = await this.client.databases.query({
      database_id: this.databases.services,
    });
    return response.results.map((page) => ({
      id: page.id,
      name: this.#extractTitle(page.properties['Name']),
      description: this.#extractRichText(page.properties['Description']),
      icon: this.#extractFiles(page.properties['Icon']),
      pricing: this.#extractNumber(page.properties['Pricing']),
      features: this.#extractMultiSelect(page.properties['Features']),
      ctaLabel: this.#extractText(page.properties['CTA Label']),
      ctaLink: this.#extractUrl(page.properties['CTA Link']),
    }));
  }

  async getTestimonials() {
    if (!this.databases.testimonials) return [];
    const response = await this.client.databases.query({
      database_id: this.databases.testimonials,
    });
    return response.results.map((page) => ({
      id: page.id,
      quote: this.#extractTitle(page.properties['Quote']),
      author: this.#extractText(page.properties['Author']),
      role: this.#extractText(page.properties['Role']),
      avatar: this.#extractFiles(page.properties['Avatar']),
      rating: this.#extractNumber(page.properties['Rating']),
    }));
  }

  async getTeamMembers() {
    if (!this.databases.team) return [];
    const response = await this.client.databases.query({
      database_id: this.databases.team,
    });
    return response.results.map((page) => ({
      id: page.id,
      name: this.#extractTitle(page.properties['Name']),
      role: this.#extractText(page.properties['Role']),
      bio: this.#extractRichText(page.properties['Bio']),
      photo: this.#extractFiles(page.properties['Photo']),
      linkedin: this.#extractUrl(page.properties['LinkedIn']),
    }));
  }

  // ─── Block Content Extraction ──────────────────────────────────────

  async getBlockContent(blockId) {
    const blocks = [];
    let cursor;

    do {
      const response = await this.client.blocks.children.list({
        block_id: blockId,
        start_cursor: cursor,
        page_size: 100,
      });

      for (const block of response.results) {
        const parsed = this.#parseBlock(block);
        if (block.has_children && block.type !== 'child_page') {
          parsed.children = await this.getBlockContent(block.id);
        }
        blocks.push(parsed);
      }

      cursor = response.has_more ? response.next_cursor : null;
    } while (cursor);

    return blocks;
  }

  #parseBlock(block) {
    const base = { type: block.type, id: block.id };
    const data = block[block.type];

    switch (block.type) {
      case 'paragraph':
      case 'heading_1':
      case 'heading_2':
      case 'heading_3':
      case 'bulleted_list_item':
      case 'numbered_list_item':
      case 'quote':
      case 'callout':
      case 'toggle':
        return { ...base, text: this.#richTextToPlain(data.rich_text), richText: data.rich_text };

      case 'code':
        return { ...base, text: this.#richTextToPlain(data.rich_text), language: data.language };

      case 'image':
        return {
          ...base,
          url: data.type === 'external' ? data.external.url : data.file.url,
          caption: data.caption ? this.#richTextToPlain(data.caption) : '',
        };

      case 'video':
        return {
          ...base,
          url: data.type === 'external' ? data.external.url : data.file.url,
        };

      case 'divider':
        return base;

      case 'table':
        return { ...base, hasColumnHeader: data.has_column_header, hasRowHeader: data.has_row_header };

      case 'table_row':
        return { ...base, cells: data.cells.map((cell) => this.#richTextToPlain(cell)) };

      default:
        return base;
    }
  }

  // ─── Article Operations (Areas of IO) ─────────────────────────────

  /**
   * Paginated query — yields all pages from a database, handling 10K+ records.
   * Uses cursor-based pagination with configurable concurrency.
   */
  async *queryAllPages(databaseId, { filter, sorts, pageSize = 100 } = {}) {
    let cursor;
    do {
      const response = await this.client.databases.query({
        database_id: databaseId,
        filter: filter || undefined,
        sorts: sorts || undefined,
        start_cursor: cursor || undefined,
        page_size: pageSize,
      });
      for (const page of response.results) {
        yield page;
      }
      cursor = response.has_more ? response.next_cursor : null;
    } while (cursor);
  }

  /**
   * Get all articles for an area, with pagination.
   * @param {string} areaName - e.g., 'Notion IO'
   * @param {Object} options - { status, contentType }
   */
  async getArticlesForArea(areaName, { status, contentType } = {}) {
    const conditions = [
      { property: 'Area of IO', select: { equals: areaName } },
    ];
    if (status) conditions.push({ property: 'Publish Status', select: { equals: status } });
    if (contentType) conditions.push({ property: 'Content Type', select: { equals: contentType } });

    const filter = conditions.length === 1 ? conditions[0] : { and: conditions };
    const articles = [];

    for await (const page of this.queryAllPages(this.databases.articles, {
      filter,
      sorts: [{ property: 'Priority', direction: 'ascending' }],
    })) {
      articles.push({
        id: page.id,
        ...this.#parseArticleProperties(page.properties),
      });
    }
    return articles;
  }

  /**
   * Get a single article with full body content parsed into sections.
   */
  async getArticleWithBody(articleId) {
    const page = await this.client.pages.retrieve({ page_id: articleId });
    const article = {
      id: page.id,
      ...this.#parseArticleProperties(page.properties),
    };

    // Parse page body into structured sections
    const blocks = await this.getBlockContent(articleId);
    article.bodySections = this.#parseBodySections(blocks);

    // Fetch linked questions and structured data
    if (this.databases.questions) {
      article.questions = await this.#getLinkedRecords(this.databases.questions, articleId, 'Article');
    }
    if (this.databases.structuredData) {
      article.structuredData = await this.#getLinkedRecords(this.databases.structuredData, articleId, 'Article');
    }

    return article;
  }

  /**
   * Parse page body blocks into sections keyed by heading.
   * Looks for H2 headings matching section names or SEC-XXX-NNN IDs.
   */
  #parseBodySections(blocks) {
    const sections = {};
    let currentSection = null;

    for (const block of blocks) {
      if (block.type === 'heading_2') {
        currentSection = block.text || '';
        sections[currentSection] = [];
      } else if (currentSection) {
        sections[currentSection].push(block);
      }
    }
    return sections;
  }

  #parseArticleProperties(props) {
    return {
      title: this.#extractTitle(props['Article Title'] || props['Name']),
      subtitle: this.#extractText(props['Article Subtitle']),
      contentType: this.#extractSelect(props['Content Type']),
      areaOfIO: this.#extractSelect(props['Area of IO']),
      publishStatus: this.#extractSelect(props['Publish Status']) || 'Draft',
      publishDate: this.#extractDate(props['Publish Date']),
      lastUpdated: this.#extractDate(props['Last Updated']),
      tags: this.#extractMultiSelect(props['Tags']),
      priority: this.#extractSelect(props['Priority']),
      difficulty: this.#extractSelect(props['Difficulty Level']),
      readingTime: this.#extractNumber(props['Reading Time']),
      wordCount: this.#extractNumber(props['Word Count']),
      featuredImage: this.#extractUrl(props['Featured Image']),
      thumbnailImage: this.#extractUrl(props['Thumbnail Image']),
      publishedUrl: this.#extractUrl(props['Published URL']),
      buildStatus: this.#extractSelect(props['Build Status']),
      version: this.#extractNumber(props['Version']),
      contentScore: this.#extractNumber(props['Content Score']),
      seoScore: this.#extractNumber(props['SEO Score']),
      batchId: this.#extractText(props['Batch ID']),
      // SEO
      primaryKeyword: this.#extractText(props['Primary Keyword']),
      secondaryKeywords: this.#extractText(props['Secondary Keywords']),
      seoTitle: this.#extractText(props['SEO Title']),
      metaDescription: this.#extractText(props['Meta Description']),
      h1Tag: this.#extractText(props['H1 Tag']),
      urlSlug: this.#extractText(props['URL Slug']),
      canonicalUrl: this.#extractUrl(props['Canonical URL']),
      ogTitle: this.#extractText(props['OG Title']),
      ogDescription: this.#extractText(props['OG Description']),
      ogImage: this.#extractUrl(props['OG Image']),
      searchIntent: this.#extractSelect(props['Search Intent']),
      contentCluster: this.#extractSelect(props['Content Cluster']),
      readabilityScore: this.#extractNumber(props['Readability Score']),
      wordCountTarget: this.#extractNumber(props['Word Count Target']),
      // Content
      primaryDefinition: this.#extractText(props['Primary Definition']),
      importanceStatement: this.#extractText(props['Importance Statement']),
      tldrSummary: this.#extractText(props['TL;DR Summary']),
      primaryBenefits: this.#extractText(props['Primary Benefits']),
      verdict: this.#extractText(props['Verdict']),
      targetAudience: this.#extractMultiSelect(props['Target Audience']),
      primaryUseCases: this.#extractMultiSelect(props['Primary Use Cases']),
      keyRisks: this.#extractMultiSelect(props['Key Risks']),
      keyIntegrations: this.#extractMultiSelect(props['Key Integrations']),
    };
  }

  /**
   * Write published URL and build status back to an article.
   */
  async writeBackArticleUrl(articleId, url, buildStatus = 'Deployed') {
    return this.updatePage(articleId, {
      'Published URL': { url },
      'Build Status': { select: { name: buildStatus } },
      'Build Timestamp': { date: { start: new Date().toISOString() } },
    });
  }

  /**
   * Batch write-back URLs for multiple articles.
   * @param {Array<{id, url}>} articles
   * @param {number} concurrency - parallel requests (max 3 for Notion)
   */
  async batchWriteBackUrls(articles, concurrency = 3) {
    const results = [];
    for (let i = 0; i < articles.length; i += concurrency) {
      const batch = articles.slice(i, i + concurrency);
      const batchResults = await Promise.allSettled(
        batch.map(a => this.writeBackArticleUrl(a.id, a.url))
      );
      results.push(...batchResults);
      // Rate limit pause between batches
      if (i + concurrency < articles.length) {
        await new Promise(r => setTimeout(r, 1100));
      }
    }
    return results;
  }

  /**
   * Get linked records (questions, structured data) for an article.
   */
  async #getLinkedRecords(databaseId, articleId, relationProperty) {
    const records = [];
    for await (const page of this.queryAllPages(databaseId, {
      filter: { property: relationProperty, relation: { contains: articleId } },
    })) {
      records.push({
        id: page.id,
        properties: page.properties,
      });
    }
    return records;
  }

  #extractDate(prop) {
    if (!prop || prop.type !== 'date' || !prop.date) return null;
    return prop.date.start;
  }

  // ─── Full Site Extraction ──────────────────────────────────────────

  async extractFullSite(siteId) {
    const site = await this.getSiteConfig(siteId);
    const pages = await this.getPagesForSite(siteId);

    // Fetch sections for each page
    for (const page of pages) {
      page.sections = await this.getSectionsForPage(page.id);
    }

    // Fetch supplemental content databases
    const [services, testimonials, team] = await Promise.all([
      this.getServices(),
      this.getTestimonials(),
      this.getTeamMembers(),
    ]);

    return {
      site,
      pages,
      contentDatabases: { services, testimonials, team },
    };
  }

  // ─── Write Back to Notion ──────────────────────────────────────────

  async createPage(databaseId, properties) {
    return this.client.pages.create({
      parent: { database_id: databaseId },
      properties,
    });
  }

  async updatePage(pageId, properties) {
    return this.client.pages.update({
      page_id: pageId,
      properties,
    });
  }

  async updateSiteStatus(siteId, status) {
    return this.updatePage(siteId, {
      Status: { select: { name: status } },
    });
  }

  async updatePageStatus(pageId, status) {
    return this.updatePage(pageId, {
      Status: { select: { name: status } },
    });
  }

  // ─── Content Source Resolution ─────────────────────────────────────

  async #resolveContentSource(ids) {
    const items = [];
    for (const id of ids) {
      try {
        const page = await this.client.pages.retrieve({ page_id: id });
        items.push({
          id: page.id,
          properties: page.properties,
        });
      } catch {
        // Silently skip inaccessible pages
      }
    }
    return items;
  }

  // ─── Property Extractors ───────────────────────────────────────────

  #extractTitle(prop) {
    if (!prop || prop.type !== 'title') return '';
    return prop.title.map((t) => t.plain_text).join('');
  }

  #extractText(prop) {
    if (!prop) return '';
    if (prop.type === 'rich_text') return this.#richTextToPlain(prop.rich_text);
    if (prop.type === 'url') return prop.url || '';
    if (prop.type === 'email') return prop.email || '';
    if (prop.type === 'phone_number') return prop.phone_number || '';
    return '';
  }

  #extractRichText(prop) {
    if (!prop || prop.type !== 'rich_text') return '';
    return this.#richTextToPlain(prop.rich_text);
  }

  #extractUrl(prop) {
    if (!prop || prop.type !== 'url') return '';
    return prop.url || '';
  }

  #extractSelect(prop) {
    if (!prop || prop.type !== 'select' || !prop.select) return null;
    return prop.select.name;
  }

  #extractMultiSelect(prop) {
    if (!prop || prop.type !== 'multi_select') return [];
    return prop.multi_select.map((s) => s.name);
  }

  #extractNumber(prop) {
    if (!prop || prop.type !== 'number') return null;
    return prop.number;
  }

  #extractCheckbox(prop) {
    if (!prop || prop.type !== 'checkbox') return false;
    return prop.checkbox;
  }

  #extractRelation(prop) {
    if (!prop || prop.type !== 'relation') return [];
    return prop.relation.map((r) => r.id);
  }

  #extractFiles(prop) {
    if (!prop || prop.type !== 'files') return [];
    return prop.files.map((f) => {
      if (f.type === 'external') return f.external.url;
      if (f.type === 'file') return f.file.url;
      return '';
    });
  }

  #richTextToPlain(richText) {
    if (!richText || !Array.isArray(richText)) return '';
    return richText.map((t) => t.plain_text).join('');
  }
}

/**
 * Converts Notion rich text blocks to HTML.
 */
export function richTextToHtml(richText) {
  if (!richText || !Array.isArray(richText)) return '';
  return richText
    .map((segment) => {
      let text = escapeHtml(segment.plain_text);
      const a = segment.annotations;
      if (a.bold) text = `<strong>${text}</strong>`;
      if (a.italic) text = `<em>${text}</em>`;
      if (a.strikethrough) text = `<s>${text}</s>`;
      if (a.underline) text = `<u>${text}</u>`;
      if (a.code) text = `<code>${text}</code>`;
      if (segment.href) text = `<a href="${escapeHtml(segment.href)}">${text}</a>`;
      return text;
    })
    .join('');
}

/**
 * Converts an array of Notion blocks to HTML string.
 */
export function blocksToHtml(blocks) {
  if (!blocks || blocks.length === 0) return '';
  const parts = [];
  let listType = null;

  for (const block of blocks) {
    const isListItem =
      block.type === 'bulleted_list_item' || block.type === 'numbered_list_item';
    const newListType = block.type === 'bulleted_list_item'
      ? 'ul'
      : block.type === 'numbered_list_item'
        ? 'ol'
        : null;

    // Close previous list if switching types
    if (listType && listType !== newListType) {
      parts.push(`</${listType}>`);
      listType = null;
    }

    // Open new list
    if (newListType && !listType) {
      parts.push(`<${newListType}>`);
      listType = newListType;
    }

    switch (block.type) {
      case 'paragraph':
        parts.push(`<p>${block.richText ? richTextToHtml(block.richText) : escapeHtml(block.text || '')}</p>`);
        break;
      case 'heading_1':
        parts.push(`<h1>${escapeHtml(block.text || '')}</h1>`);
        break;
      case 'heading_2':
        parts.push(`<h2>${escapeHtml(block.text || '')}</h2>`);
        break;
      case 'heading_3':
        parts.push(`<h3>${escapeHtml(block.text || '')}</h3>`);
        break;
      case 'bulleted_list_item':
      case 'numbered_list_item': {
        let li = `<li>${escapeHtml(block.text || '')}`;
        if (block.children && block.children.length > 0) {
          li += blocksToHtml(block.children);
        }
        li += '</li>';
        parts.push(li);
        break;
      }
      case 'quote':
        parts.push(`<blockquote>${escapeHtml(block.text || '')}</blockquote>`);
        break;
      case 'callout':
        parts.push(`<div class="callout"><p>${escapeHtml(block.text || '')}</p></div>`);
        break;
      case 'code':
        parts.push(`<pre><code class="language-${block.language || 'text'}">${escapeHtml(block.text || '')}</code></pre>`);
        break;
      case 'image':
        parts.push(`<figure><img src="${escapeHtml(block.url || '')}" alt="${escapeHtml(block.caption || '')}" />${block.caption ? `<figcaption>${escapeHtml(block.caption)}</figcaption>` : ''}</figure>`);
        break;
      case 'divider':
        parts.push('<hr />');
        break;
      default:
        break;
    }
  }

  // Close any trailing list
  if (listType) {
    parts.push(`</${listType}>`);
  }

  return parts.join('\n');
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
