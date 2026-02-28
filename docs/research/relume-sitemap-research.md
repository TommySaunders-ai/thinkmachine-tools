# Technical Deep Dive: How Relume Builds an Entire Sitemap & Website from a Single Input
# — Building for intelligentoperations.ai with IBM Carbon, Notion, and GitHub Pages

## Context

This document is a research deliverable explaining the technical architecture behind Relume's AI-powered website generation system, and how to build a comparable system as part of the **intelligentoperations.ai** ecosystem using:

- **IBM Carbon Design System** as the component library foundation
- **Notion** as the knowledge base / CMS providing input context for sitemap and page generation
- **GitHub Pages** as the publishing target to make sites and pages live

Relume takes a single natural-language prompt and produces a complete website sitemap, wireframes, copywriting, and a style guide. The intelligentoperations.ai implementation takes this further: instead of a freeform prompt, the system draws from structured knowledge already captured in Notion databases — business descriptions, service offerings, case studies, team bios, product specs, etc. — and uses that context to generate sitemaps, assemble Carbon components with real content, and publish directly to GitHub Pages.

---

## 1. High-Level Pipeline: Prompt → Sitemap → Wireframes → Style Guide → Export

The entire system operates as a **4-stage pipeline**, each stage feeding the next:

```
┌──────────────┐    ┌──────────────────┐    ┌───────────────────┐    ┌──────────────┐
│  User Prompt │───▶│  AI Sitemap Gen  │───▶│  AI Wireframe Gen │───▶│  Style Guide │
│  (NL text)   │    │  (page hierarchy)│    │  (component assy) │    │  + Export     │
└──────────────┘    └──────────────────┘    └───────────────────┘    └──────────────┘
```

Each stage is **iterative** — the user can pause, review, edit, re-prompt, and continue at any point.

---

## 2. Stage 1: Natural Language Prompt Ingestion

### Input Format
A short natural-language description (2-5 sentences recommended). Example:
> "A SaaS company that provides project management tools for remote teams. The website should showcase features, pricing, integrations, and have a blog."

### What the AI Extracts from the Prompt
- **Business type / industry** (SaaS, e-commerce, agency, restaurant, etc.)
- **Target audience** signals
- **Required pages** (explicitly mentioned)
- **Implied pages** (inferred from industry — e.g., a SaaS company implies a Pricing page, Integrations page, etc.)
- **Feature/content requirements** (blog, testimonials, case studies, etc.)
- **Style signals** (e.g., "modern", "minimalist", "bold" inform later component selection)

### Language Support
The prompt can be in 20+ languages, and the entire generation pipeline (sitemap labels, wireframe copywriting) will output in that language.

---

## 3. Stage 2: AI Sitemap Generation

### Architecture Model
The sitemap is a **hierarchical tree** with the following structure:

```
Homepage (root)
├── Primary Nav Pages (Tier 1)
│   ├── Sub-pages (Tier 2)
│   │   └── Detail pages (Tier 3)
│   └── ...
├── Utility Pages (separate group)
│   ├── Privacy Policy
│   ├── Terms of Service
│   ├── 404
│   └── ...
└── Folder-only nav items (grouping nodes with no content)
```

### How the LLM Generates the Sitemap
1. The LLM analyzes the prompt and identifies the **website category** (there are well-established patterns for SaaS, e-commerce, portfolio, agency, real estate, restaurants, etc.)
2. It generates a **recommended page set** based on:
   - Pages explicitly requested in the prompt
   - Pages standard for the identified industry/category (trained on thousands of professional websites)
   - Logical information architecture (parent-child relationships, navigation depth)
3. **Progressive generation**: The Home page is generated first and displayed to the user immediately. This lets the user validate the AI's direction before continuing. Clicking "continue generating pages" produces the remaining pages.

### Per-Page Data Model
Each page in the sitemap contains:
- **Page name** (e.g., "Features", "Pricing")
- **Page route/URL slug**
- **Section list** — an ordered list of sections, each with:
  - **Section title** (acts as a prompt for component selection, e.g., "Hero with product demo video")
  - **Section description** (additional context for component matching, e.g., "Showcase 3 pricing tiers with annual/monthly toggle")
  - **Color coding** (visual-only, for organizational grouping in the UI — does not affect export)
- **Global section markers** — sections marked as "global" (header, footer, CTA banner) are reused across pages and exported as shared components

### Sitemap Variants
Users can generate **multiple sitemap variants** side-by-side, compare them, and promote the best one to "primary." This is essentially running the LLM inference multiple times with the same prompt to get different valid architectures.

### Import Existing Site
Users can paste a URL of an existing website, and Relume will crawl/import up to 50 pages, extracting their hierarchy, page titles, and meta descriptions into the Site Builder format as a starting point.

---

## 4. Stage 3: AI Wireframe Generation (The Core Technical Innovation)

This is the most technically sophisticated stage. The AI converts each page's section list into **fully assembled wireframes** using real components from Relume's library.

### The Component Library (Foundation)

- **1,000+ human-designed components** (marketing: hero headers, features, CTAs, pricing, testimonials, FAQs, footers, etc.; application: card headers, stacked lists, grid lists, etc.)
- **3,000+ total variants** when counting layout variations
- Each component is:
  - **Categorized by section type** (Hero, Header, Feature, CTA, Comparison, Pricing, Testimonial, etc.)
  - **Identified by a numbered ID** (e.g., "Header 78", "Layout 422")
  - **Tagged with metadata**: content count (e.g., "3-column layout"), style attributes (e.g., "overlapping", "card-based"), placement hints
  - **Built with Client-First naming conventions** for Webflow compatibility (e.g., `section_layout192 > layout192_content > layout192_image-wrapper`)
  - **Designed as responsive** — each component has desktop, tablet, and mobile breakpoints
- Components have **pairing rules** (e.g., "Level 2 Sidebar pairs with Level 1 Topbar")
- **Variants system**: each component has multiple layout variants that users can swap between in the wireframe view

### The AI Component Selection Algorithm (Wireframing 2.0)

This is Relume's core competitive moat. The algorithm uses **5 dimensions of intelligence**:

#### Dimension 1: Industry/Style Matching
The AI maps the business type from the prompt to appropriate visual styles:
- Agency → off-grid, overlapping layouts
- SaaS → clean card-based layouts
- E-commerce → product grid layouts
- Portfolio → image-heavy, minimal text layouts

#### Dimension 2: Content-Count Awareness
Section titles AND descriptions are parsed for numerical content signals:
- "3 pricing tiers" → selects a 3-column pricing component
- "2 team members" → selects a 2-person team layout
- (Old system only looked at titles and defaulted to generic counts like always-3)

#### Dimension 3: Position/Placement Awareness
The algorithm considers where each section falls in the page sequence:
- Alternates layout direction (left-right-left rhythm)
- Varies visual weight to create "narrative flow" down the page
- Avoids consecutive sections that look too similar
- (Old system had no position awareness — sections were independent)

#### Dimension 4: Cross-Page Coherence
Components are intentionally **reused across pages** where appropriate:
- Consistent header/footer/CTA patterns
- Similar feature sections maintain visual consistency
- Creates a unified "design system" feel across the whole site
- (Old system: no cross-page awareness)

#### Dimension 5: Library Coverage Optimization
Wireframing 2.0 draws from **~70% of marketing components** (up from ~25% in v1.0). The model was trained/tuned to be more adventurous in component selection while maintaining quality.

### AI Model Evolution
| Version | Model | Library Coverage | Context |
|---------|-------|-----------------|---------|
| Wireframing 1.0 | GPT-3.5 | ~25% of components | Single section |
| Wireframing 2.0 | Undisclosed (smarter) | ~70% of components | Full page |
| Copywriting 1.0 | GPT-3.5 mini | ~10K char window (1 section) | Section-only |
| Copywriting 1.5 | Anthropic Claude | Full page context | Entire page |

### Copywriting Generation
Once components are selected, the AI generates **real copy** (not lorem ipsum):
- Headlines, subheadlines, body text, button labels, testimonial quotes
- Powered by **Anthropic's Claude** model
- Operates with **full-page context** — sees all sections simultaneously to ensure:
  - Consistent tone/voice across the page
  - No repeated phrases between sections
  - Natural narrative flow from section to section
  - Copy that's contextually appropriate to each component's purpose

### The Assembly Process (Per Page)
```
For each page in sitemap:
  1. Read page name, route, and section list
  2. For each section:
     a. Parse section title + description → extract intent, content count, style signals
     b. Query component library with multi-dimensional matching:
        - Filter by section type (hero, feature, CTA, etc.)
        - Score by style match (agency vs SaaS vs ecommerce patterns)
        - Score by content count match
        - Score by position appropriateness (placement in page)
        - Score by cross-page coherence (consistency with other pages)
     c. Select highest-scoring component + variant
     d. Generate copywriting for that component using Claude (with full page context)
  3. Assemble ordered component list → wireframe
```

---

## 5. Stage 4: Style Guide Generation

After wireframes are complete, the AI generates a **design system**:

- **Color palette** — chosen based on the business type/industry from the prompt (not random)
- **Typography** — font pairings appropriate to the brand
- **UI elements** — buttons, form fields, badges, tags styled consistently
- **Powered by LLMs** — replaced an older random-shuffling system. Now makes brand-aware decisions.

### Design View (Beta)
A rapid styling tool that applies the style guide across all wireframes, giving a visual preview of the fully styled site directly in Relume before any export. Gets ~80% to final design.

---

## 6. Export Pipeline

### Figma Export (via Plugin)
- Imports wireframes as actual Figma frames with proper layers
- Syncs with existing Figma variables
- Imports style guide as Figma variables (colors, typography)
- Components come in with proper auto-layout and responsive settings
- AI-generated copy flows into text layers

### Webflow Export (via Chrome Extension / App)
- Creates all pages in Webflow automatically
- Imports sections as real Webflow components with Client-First class naming
- Global sections become Webflow reusable components
- Imports copywriting into CMS or static fields
- Known issue: occasional class name duplicates reported by community

### React Export
- Exports entire sitemap as React components with Tailwind CSS
- Each section becomes multiple files (component + styles + content)
- Cannot copy-paste individual pages (must export full sitemap)
- Currently being refactored to work with Style Guide Builder
- Community feedback led to planned "scaled-down JSX with hardcoded props" option

---

## 7. Technical Architecture Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                            │
│  Prompt Input → Sitemap Editor → Wireframe Editor → Style Guide │
└──────────────┬───────────────────────────────────────┬──────────┘
               │                                       │
    ┌──────────▼──────────┐              ┌─────────────▼────────────┐
    │   AI INFERENCE LAYER │              │    EXPORT PIPELINE       │
    │                      │              │                          │
    │  Sitemap Gen (LLM)   │              │  Figma Plugin            │
    │  Wireframe Gen (LLM  │              │  Webflow App/Extension   │
    │    + component match) │              │  React Code Generator    │
    │  Copywriting (Claude) │              │                          │
    │  Style Guide (LLM)   │              │  Output: Frames, Comps,  │
    └──────────┬───────────┘              │  Classes, Variables,     │
               │                          │  Pages, Routes           │
    ┌──────────▼──────────┐              └──────────────────────────┘
    │  COMPONENT LIBRARY   │
    │                      │
    │  1,000+ components   │
    │  3,000+ variants     │
    │  Categorized by type │
    │  Tagged with metadata│
    │  Client-First naming │
    │  Responsive layouts  │
    │  Pairing rules       │
    └──────────────────────┘
```

### Key Technical Differentiators
1. **Human-designed, AI-assembled** — Components are hand-crafted by designers; AI only selects and arranges them. This avoids the "AI-generated look" problem.
2. **Multi-dimensional component matching** — Not just keyword matching, but style, count, position, and cross-page coherence scoring.
3. **Full-page context copywriting** — Claude sees the entire page to write cohesive copy, not disconnected per-section snippets.
4. **Progressive/iterative generation** — Users can intervene at every stage, making it a human-AI collaborative workflow rather than a black-box generator.
5. **Platform-agnostic export** — The same sitemap/wireframe data model exports to Figma, Webflow, and React, meaning the internal representation is format-independent.

---

## 8. The intelligentoperations.ai Ecosystem Architecture

### 8.1 Vision

**intelligentoperations.ai** becomes the Relume equivalent — but instead of a standalone SaaS, it's an integrated platform that:

1. **Pulls context from Notion** (knowledge base, business data, content) instead of relying on a freeform prompt
2. **Assembles pages using IBM Carbon Design System** components instead of a proprietary library
3. **Publishes directly to GitHub Pages** to make sites/pages live at custom domains (e.g., thinkmachine-tools on GitHub Pages, or any other repo in the ecosystem)

The key insight: **Relume starts from a blank prompt. intelligentoperations.ai starts from your existing knowledge.** Notion databases already contain the business descriptions, service offerings, case studies, team bios, product specs, pricing tiers, and brand guidelines that would otherwise need to be typed into a prompt. This makes generation faster, more accurate, and keeps content in sync with a single source of truth.

### 8.2 End-to-End Pipeline

```
┌────────────────────────────────────────────────────────────────────────────┐
│                      intelligentoperations.ai                              │
│                                                                            │
│  ┌─────────────┐   ┌──────────────┐   ┌────────────┐   ┌───────────────┐  │
│  │   NOTION     │──▶│  AI ENGINE   │──▶│  CARBON    │──▶│  GITHUB       │  │
│  │  Knowledge   │   │  (Claude)    │   │  Assembly  │   │  Pages        │  │
│  │  Base        │   │              │   │            │   │  Publish      │  │
│  └─────────────┘   └──────────────┘   └────────────┘   └───────────────┘  │
│                                                                            │
│  Notion databases  Sitemap gen       Component        git commit + push   │
│  → structured      Wireframe gen     selection        → GitHub Actions    │
│    context         Copywriting       Props hydration  → live site         │
│  Page content      Theme gen         Static build     → custom domain     │
│  → rich text                                                               │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. Notion as the Knowledge Base (Input Layer)

### 9.1 Why Notion Instead of a Prompt

| Relume Approach | intelligentoperations.ai Approach |
|-----------------|-----------------------------------|
| User types a 2-5 sentence prompt | System reads from Notion databases with hundreds of structured data points |
| AI infers business type, services, features | AI reads exact business type, services, features from Notion properties |
| AI generates placeholder copy | AI generates copy grounded in real business data |
| No content sync — regenerate to update | Notion is the source of truth — re-publish to sync changes |
| One-shot context | Persistent, evolving knowledge base |

### 9.2 Notion Database Architecture for Site Generation

The Notion workspace should be structured with databases that map to website content needs:

#### Database: Site Configuration
| Property | Type | Purpose |
|----------|------|---------|
| Site Name | Title | Primary site identifier |
| Domain | URL | Target domain (e.g., `thinkmachine-tools`) |
| GitHub Repo | Text | Target repo (e.g., `TommySaunders-ai/thinkmachine-tools`) |
| Business Type | Select | `SaaS`, `Agency`, `E-commerce`, `Portfolio`, etc. |
| Brand Description | Rich Text | 2-3 paragraph business description |
| Target Audience | Multi-select | Audience segments |
| Primary Color | Text | Hex code → maps to Carbon theme token |
| Theme | Select | `White`, `G10`, `G90`, `G100` (Carbon themes) |
| Status | Select | `Draft`, `Building`, `Published` |

#### Database: Pages
| Property | Type | Purpose |
|----------|------|---------|
| Page Name | Title | e.g., "Features", "Pricing", "About" |
| Site | Relation | → Site Configuration |
| Route | Text | URL slug (e.g., `/tools/ai-mindmap-generator`) |
| Page Type | Select | `Landing`, `Detail`, `Utility`, `Blog Post` |
| Parent Page | Relation | → self (for hierarchy) |
| Nav Order | Number | Position in navigation |
| Is Global | Checkbox | Whether this is a nav/footer page |
| Sections | Relation | → Sections database |
| Status | Select | `Draft`, `Ready`, `Published` |
| SEO Title | Text | Meta title override |
| SEO Description | Text | Meta description |
| **Page Body** | Rich Text (blocks) | Free-form Notion content for the page |

#### Database: Sections
| Property | Type | Purpose |
|----------|------|---------|
| Section Name | Title | e.g., "Hero with product demo" |
| Page | Relation | → Pages |
| Section Type | Select | `Hero`, `Feature`, `CTA`, `Pricing`, `Testimonial`, `FAQ`, etc. |
| Carbon Component | Text | Override: specific component ID (e.g., `leadspace-01`) |
| Order | Number | Position on the page |
| Is Global | Checkbox | Shared across pages (header, footer) |
| Content Source | Relation | → any other database for dynamic content |
| **Section Body** | Rich Text (blocks) | Notion content blocks that become section copy |

#### Database: Services / Products
| Property | Type | Purpose |
|----------|------|---------|
| Name | Title | Service/product name |
| Description | Rich Text | Detailed description |
| Icon | Files | Icon image |
| Pricing | Number | Price point |
| Features | Multi-select | Feature tags |
| CTA Label | Text | Button text |
| CTA Link | URL | Button destination |

#### Database: Testimonials
| Property | Type | Purpose |
|----------|------|---------|
| Quote | Title | Testimonial text |
| Author | Text | Person name |
| Role | Text | Job title / company |
| Avatar | Files | Photo |
| Rating | Number | Star rating |

#### Database: Team Members
| Property | Type | Purpose |
|----------|------|---------|
| Name | Title | Full name |
| Role | Text | Job title |
| Bio | Rich Text | Biography |
| Photo | Files | Headshot |
| LinkedIn | URL | Profile link |

### 9.3 Notion API Integration

The system uses the Notion API to extract structured content:

```
Extraction Pipeline:
1. GET site config       → POST /v1/databases/{sites_db}/query
2. GET pages for site    → POST /v1/databases/{pages_db}/query
                            filter: { site: { relation: { contains: site_id } } }
3. GET sections per page → POST /v1/databases/{sections_db}/query
                            filter: { page: { relation: { contains: page_id } } }
4. GET page content      → GET /v1/blocks/{page_id}/children
                            (recursive for has_children blocks)
5. GET related content   → Query Services, Testimonials, Team databases
                            based on section Content Source relations
```

**Content Extraction Format:**
```json
{
  "site": {
    "name": "ThinkMachine Tools",
    "domain": "tommysaunders-ai.github.io/thinkmachine-tools",
    "repo": "TommySaunders-ai/thinkmachine-tools",
    "businessType": "SaaS",
    "brandDescription": "AI-powered mindmap tools that transform...",
    "theme": "G100",
    "primaryColor": "#6366f1"
  },
  "pages": [
    {
      "name": "Home",
      "route": "/",
      "type": "Landing",
      "sections": [
        {
          "name": "Hero — Transform any content into visual mindmaps",
          "type": "Hero",
          "order": 1,
          "content": "extracted rich text blocks...",
          "contentSource": {
            "type": "Services",
            "items": [ /* 6 tools from Services database */ ]
          }
        }
      ]
    }
  ]
}
```

### 9.4 Two Modes of Operation

#### Mode A: Full Sitemap Generation (Relume-style)
- **Input:** Site Configuration database entry (business type, description, audience)
- **Process:** Claude generates a complete sitemap (page tree + sections per page), just like Relume
- **Enhancement:** Claude has access to ALL Notion databases as context, so the sitemap reflects real services/products/team size, not guesses
- **Output:** Populates the Pages and Sections databases in Notion with the generated plan

#### Mode B: Individual Page/Section Generation
- **Input:** A single Page or Section entry in Notion
- **Process:** Claude selects the appropriate Carbon component and generates copy using Notion context
- **Output:** The generated HTML/component code, ready to publish
- **Use case:** Adding a new page to an existing site, or updating a section

### 9.5 Notion as the Editing Interface

After AI generation, Notion becomes the **editing interface** — replacing Relume's built-in wireframe editor:

- Users review and edit section descriptions in Notion
- Users reorder sections by changing the `Order` property
- Users add/remove pages by creating/archiving Notion entries
- Users update copy by editing rich text blocks
- Users swap components by changing the `Carbon Component` override property
- When ready, users trigger a re-publish (re-extract → rebuild → push to GitHub)

This means **no custom wireframe editor UI needs to be built** — Notion IS the editor.

---

## 10. IBM Carbon Design System (Component Layer)

### 10.1 Carbon Component Library as the Foundation

Carbon provides the building blocks at three tiers:

| Tier | Package | What It Provides | Relume Equivalent |
|------|---------|-------------------|-------------------|
| **Core UI** | `@carbon/react` (30+ components) | Buttons, Forms, DataTables, Modals, Tabs, Accordions, Tiles, Tags, Notifications, UI Shell | Relume's atomic UI primitives (embedded within section components) |
| **IBM.com Sections** | `@carbon/ibmdotcom-web-components` (37+ layout components) | LeadSpace, ContentBlock, ContentGroup, CTABlock, CTASection, FeatureSection, CardSection, CalloutQuote, LogoGrid, LinkListSection, TableOfContents, Masthead, Footer | **Direct equivalent** of Relume's section-level components (Hero, Feature, CTA, Testimonial, etc.) |
| **IBM Products** | `@carbon/ibm-products` | Side panels, Page headers, Cascade views, Datagrid, Full-page patterns | Application-level patterns (dashboards, CRUD pages) |

### 10.2 Mapping Relume Section Categories → Carbon Components

| Relume Section Type | Carbon for IBM.com Component |
|---------------------|------------------------------|
| Hero Header | `<c4d-leadspace>`, `<c4d-lead-space-block>`, `<c4d-lead-space-search>` |
| Feature Section | `<c4d-feature-section>`, `<c4d-content-block-media>` |
| Content Block | `<c4d-content-block-simple>`, `<c4d-content-block-segmented>`, `<c4d-content-block-mixed>` |
| Content Group | `<c4d-content-group-simple>`, `<c4d-content-group-cards>`, `<c4d-content-group-pictograms>` |
| CTA / Call-to-Action | `<c4d-cta-block>`, `<c4d-cta-section>` |
| Testimonial / Quote | `<c4d-callout-quote>`, `<c4d-callout-media>` |
| Card Grid / Catalog | `<c4d-card-section-simple>`, `<c4d-card-section-carousel>`, `<c4d-card-section-images>`, `<c4d-card-section-offset>` |
| Pricing | Custom composition using `<cds-structured-list>` + `<cds-tile>` |
| Logo Wall | `<c4d-logo-grid>` |
| Navigation / Header | `<c4d-masthead>` (with L0, L1, mega menu variants) |
| Footer | `<c4d-footer>` (short, default, micro variants) |
| FAQ / Accordion | `<cds-accordion>` within `<c4d-content-section>` |
| Table of Contents | `<c4d-table-of-contents>` |
| Link Lists | `<c4d-link-list-section>` |

### 10.3 Component Metadata Schema for AI Selection

Each Carbon component is wrapped in a **metadata registry** that enables Relume-style AI matching:

```json
{
  "id": "leadspace-01",
  "carbonComponent": "c4d-leadspace",
  "category": "hero",
  "variant": "centered",
  "contentSlots": {
    "heading": { "type": "text", "maxLength": 60 },
    "description": { "type": "text", "maxLength": 200 },
    "primaryCTA": { "type": "button", "label": true, "href": true },
    "secondaryCTA": { "type": "button", "label": true, "href": true },
    "backgroundImage": { "type": "image", "optional": true }
  },
  "tags": ["hero", "landing", "centered", "image-background"],
  "suitableFor": ["saas", "enterprise", "product", "marketing"],
  "contentCount": null,
  "placementHint": "page-top",
  "pairingRules": {
    "followedBy": ["feature-section", "content-block", "card-section"],
    "neverFollowedBy": ["leadspace", "masthead"]
  }
}
```

The AI queries this registry using 5-dimensional scoring:
1. **Category match** → filter by `category`
2. **Industry/style match** → score by `suitableFor` and `tags`
3. **Content count match** → match `contentCount` against Notion section data
4. **Position match** → use `placementHint` + `pairingRules`
5. **Cross-page coherence** → track component IDs across all pages in the site

### 10.4 Theming: Carbon Tokens → Brand Customization

Carbon's token system enables **programmatic theming from Notion data**:

- The `Primary Color` and `Theme` properties from the Notion Site Configuration database map directly to Carbon theme token overrides
- **52 universal color tokens** per theme → AI generates a custom theme by remapping tokens from the brand color
- **4 built-in themes** (White, G10, G90, G100) → user selects base theme in Notion
- **CSS custom properties** → applied at build time from Notion config
- **Design tokens for spacing, type, motion** → the AI style guide maps directly to Carbon's `$spacing`, `$type`, `$motion` tokens

The "Style Guide Generation" stage outputs a **Carbon theme override file**, and every component automatically picks up the theme.

---

## 11. GitHub Pages Publishing (Output Layer)

### 11.1 Current State: ThinkMachine Tools

The existing `thinkmachine-tools` repo demonstrates the target deployment model:
- **Pure static site** (HTML/CSS/JS, no build tools, no framework)
- **Deployed to GitHub Pages** via GitHub Actions (`.github/workflows/static.yml`)
- **Custom design tokens** in `css/tokens.css` (will be replaced by Carbon tokens)
- **7 pages** following a consistent section pattern (hero, features, how-it-works, use-cases, CTA, footer)
- **Currently at** `tommysaunders-ai.github.io/thinkmachine-tools/`

### 11.2 Publish Pipeline

```
┌───────────┐     ┌───────────────┐     ┌──────────────┐     ┌──────────────┐
│  Notion    │────▶│  AI Engine    │────▶│  Static Site  │────▶│  GitHub      │
│  (trigger) │     │  (generate)   │     │  (build)      │     │  Pages       │
└───────────┘     └───────────────┘     └──────────────┘     └──────────────┘

Step 1: Extract          Step 2: Generate           Step 3: Build       Step 4: Deploy
─────────────────       ──────────────────         ─────────────────   ────────────────
Notion API query        Sitemap → page tree        Assemble HTML/CSS   git add + commit
→ site config           Sections → component       from Carbon comps   git push to main
→ pages + sections        selection                 Apply theme tokens  GitHub Actions
→ content blocks        Copy → slot hydration      Generate sitemap    → deploy-pages
→ related data          Theme → token overrides     Generate robots.txt → live at domain
```

### 11.3 Static Site Generation Strategy

Two approaches, depending on complexity:

#### Approach A: Pure Static HTML (current pattern, simplest)
- Generate standalone `.html` files per page (matching the existing thinkmachine-tools pattern)
- Inline Carbon components as Web Components (`@carbon/ibmdotcom-web-components`)
- Load Carbon CSS via CDN or bundled stylesheet
- No build step required — GitHub Actions just deploys the directory
- **Best for:** Simple marketing sites, landing pages

#### Approach B: Next.js Static Export
- Generate a Next.js project with Carbon React components
- Use `next export` to produce static HTML/CSS/JS
- GitHub Actions runs `npm run build` then deploys the `out/` directory
- **Best for:** Complex sites with routing, dynamic content patterns, many pages

### 11.4 Publishing Workflow

```
User Action in Notion                  System Response
──────────────────────                 ──────────────────────
1. User sets Page status              → Page queued for generation
   to "Ready"

2. User sets Site status              → Full site extraction begins
   to "Building"                      → AI generates all pages
                                      → Static build runs
                                      → Git commit with descriptive message
                                      → Git push to repo's main branch
                                      → GitHub Actions deploys to Pages

3. GitHub Actions completes           → Notion Site status updated
                                        to "Published"
                                      → Notion Page statuses updated
                                        to "Published"

4. Site is live at domain             → User can verify at
                                        their GitHub Pages URL
```

### 11.5 Incremental Publishing

Not every change requires a full site rebuild:

| Change Type | Scope | Action |
|-------------|-------|--------|
| Edit copy on one page | Single page | Re-extract that page's Notion blocks → regenerate that HTML file → commit + push |
| Add a new page | Single page + nav | Generate new page HTML + update navigation in header/footer → commit + push |
| Reorder sections | Single page | Re-extract section order → regenerate that page → commit + push |
| Change theme | Full site | Regenerate Carbon theme tokens → rebuild all pages → commit + push |
| New section type | Single section | Select component → hydrate with content → inject into page → commit + push |

### 11.6 Generated File Structure

The publishing system produces a file structure matching the existing thinkmachine-tools pattern:

```
{repo-root}/
├── .github/
│   └── workflows/
│       └── static.yml           (GitHub Actions — deploy to Pages)
├── assets/
│   ├── favicon.svg              (from Notion Site Config)
│   └── images/                  (downloaded from Notion file blocks)
├── css/
│   ├── carbon-theme.css         (generated Carbon token overrides)
│   └── custom.css               (any additional styles)
├── js/
│   └── main.js                  (navigation, interactions)
├── tools/                       (or whatever route structure)
│   ├── page-one.html
│   ├── page-two.html
│   └── ...
├── index.html                   (homepage)
├── sitemap.xml                  (auto-generated from page list)
├── robots.txt                   (auto-generated)
└── CNAME                        (custom domain, from Notion config)
```

### 11.7 SEO Generation

The system auto-generates SEO assets from Notion data:

- **`sitemap.xml`** — built from the Pages database (routes, last modified dates, priorities based on page hierarchy)
- **`robots.txt`** — standard allow-all with sitemap reference
- **OpenGraph / Twitter Card meta tags** — from Page SEO Title + SEO Description properties
- **JSON-LD structured data** — `WebSite` schema on homepage, `WebApplication` or `Article` on subpages
- **Canonical URLs** — derived from Site domain + Page route

---

## 12. Full System Architecture

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                          intelligentoperations.ai                                 │
│                                                                                   │
│  ┌─────────────────────┐                                                         │
│  │  NOTION WORKSPACE    │  Source of Truth                                       │
│  │                      │                                                         │
│  │  Sites DB ──────────────▶ Site name, repo, domain, theme, brand              │
│  │  Pages DB ──────────────▶ Page hierarchy, routes, SEO, status                │
│  │  Sections DB ───────────▶ Section types, order, component overrides          │
│  │  Services DB ───────────▶ Products/services content                          │
│  │  Testimonials DB ───────▶ Quotes, authors, ratings                           │
│  │  Team DB ───────────────▶ Bios, photos, roles                                │
│  │  Blog Posts DB ─────────▶ Articles, categories, authors                      │
│  └──────────┬──────────┘                                                         │
│             │ Notion API (extract)                                                │
│             ▼                                                                     │
│  ┌──────────────────────┐                                                         │
│  │  AI ENGINE (Claude)   │  Intelligence Layer                                   │
│  │                       │                                                        │
│  │  ┌─────────────────┐  │                                                        │
│  │  │ Sitemap Gen     │  │  Notion context → page tree + sections               │
│  │  │ Component Select│  │  Section type + context → Carbon component ID         │
│  │  │ Copy Gen        │  │  Notion data + component slots → polished copy       │
│  │  │ Theme Gen       │  │  Notion brand config → Carbon token overrides        │
│  │  │ SEO Gen         │  │  Page data → meta tags, sitemap.xml, JSON-LD        │
│  │  └─────────────────┘  │                                                        │
│  └──────────┬────────────┘                                                        │
│             │                                                                     │
│             ▼                                                                     │
│  ┌──────────────────────┐                                                         │
│  │  CARBON COMPONENT     │  Design Layer                                         │
│  │  REGISTRY             │                                                        │
│  │                       │                                                        │
│  │  67+ components with  │  Each has: category, tags, content slots,             │
│  │  metadata wrappers    │  pairing rules, placement hints, variants             │
│  │                       │                                                        │
│  │  @carbon/react        │                                                        │
│  │  @carbon/ibmdotcom    │                                                        │
│  │  @carbon/ibm-products │                                                        │
│  │  Custom compositions  │                                                        │
│  └──────────┬────────────┘                                                        │
│             │                                                                     │
│             ▼                                                                     │
│  ┌──────────────────────┐                                                         │
│  │  STATIC SITE          │  Build Layer                                          │
│  │  GENERATOR            │                                                        │
│  │                       │                                                        │
│  │  Component assembly   │  Props hydration from Notion content                  │
│  │  HTML generation      │  Carbon Web Components or React SSG                   │
│  │  Theme application    │  Carbon token override stylesheet                     │
│  │  Asset pipeline       │  Images from Notion, favicon, fonts                   │
│  │  SEO generation       │  sitemap.xml, robots.txt, meta tags                   │
│  └──────────┬────────────┘                                                        │
│             │                                                                     │
│             ▼                                                                     │
│  ┌──────────────────────┐                                                         │
│  │  GITHUB PUBLISHER     │  Deploy Layer                                         │
│  │                       │                                                        │
│  │  git add/commit/push  │  Descriptive commit messages                          │
│  │  → GitHub Actions     │  .github/workflows/static.yml                         │
│  │  → GitHub Pages       │  Static deploy to configured domain                   │
│  │  → Live site          │  CNAME, SSL, CDN handled by GitHub                    │
│  │                       │                                                        │
│  │  Notion status sync   │  Update Site/Page status to "Published"               │
│  └───────────────────────┘                                                        │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 13. What Needs to Be Built (Implementation Roadmap)

### Phase 1: Foundation
| Component | Description | Priority |
|-----------|-------------|----------|
| Notion Integration Service | API client to extract site config, pages, sections, and content blocks from Notion databases | P0 |
| Carbon Component Registry | JSON metadata file mapping all usable Carbon components with categories, tags, content slots, and pairing rules | P0 |
| Static HTML Generator | Template engine that assembles Carbon Web Components into standalone HTML pages with token-based theming | P0 |
| GitHub Publisher | Git operations: clone repo, write generated files, commit, push to trigger GitHub Pages deploy | P0 |

### Phase 2: AI Intelligence
| Component | Description | Priority |
|-----------|-------------|----------|
| Sitemap Generator | Claude prompt that takes Notion site config → generates page tree with sections (writes back to Notion) | P1 |
| Component Selector | 5-dimensional scoring algorithm that maps section type + context to the best Carbon component | P1 |
| Copy Generator | Claude prompt with full-page context + Notion data → generates polished copy for each component's content slots | P1 |
| Theme Generator | Claude prompt that maps Notion brand config (colors, style) → Carbon theme token overrides | P1 |
| SEO Generator | Generates sitemap.xml, robots.txt, meta tags, and JSON-LD from page database properties | P1 |

### Phase 3: Polish & Scale
| Component | Description | Priority |
|-----------|-------------|----------|
| Incremental Publishing | Detect which Notion pages changed → regenerate only affected HTML files → minimal git diff | P2 |
| Notion Status Sync | After publish, update Notion database entries to reflect "Published" status | P2 |
| Custom Component Compositions | Additional section variants beyond Carbon's 37 dotcom components (pricing tables, comparison grids, portfolio galleries) | P2 |
| Multi-Site Support | Manage multiple sites from a single Notion workspace, each publishing to different GitHub repos/domains | P2 |
| Notion Webhook Listener | Auto-trigger rebuild when Notion pages are updated (via Notion webhooks or polling) | P3 |

### Key Advantages Over Relume

1. **Knowledge-driven, not prompt-driven** — Notion databases provide structured, rich context that produces better results than a 2-sentence prompt
2. **Notion IS the editor** — No need to build a wireframe editor; users edit in the tool they already use
3. **Open source components** — Carbon Design System, Apache 2.0, no vendor lock-in
4. **Enterprise accessibility** — WCAG 2.1 AA compliance from Carbon out of the box
5. **Git-native publishing** — Full version history, branch-based previews, rollback via git revert
6. **Free hosting** — GitHub Pages with custom domain, SSL, and CDN at zero cost
7. **Ecosystem integration** — Lives alongside other intelligentoperations.ai tools (ThinkMachine, etc.)

---

## Sources

- [Relume Official Site](https://www.relume.io/)
- [Building a Sitemap with AI — Relume Docs](https://www.relume.io/resources/docs/building-a-sitemap-with-ai)
- [Relume AI Tutorial — WebPlacide](https://webplacide.com/blog/relume-ai-tutorial-generate-sitemaps-and-wireframes-in-seconds/)
- [Relume AI Walkthrough — UXPilot](https://uxpilot.ai/blogs/relume-ai)
- [Relume Sept 2025 Release (Wireframing 2.0 + Copywriting 1.5)](https://www.relume.io/whats-new/september-2025-release)
- [Relume July 2025 Release (Design View + Style Guide)](https://www.relume.io/whats-new/july-2025-release)
- [Relume Component Library](https://www.relume.io/components)
- [Why Relume Uses Client-First](https://www.relume.io/resources/docs/why-relume-uses-client-first)
- [Relume React Components](https://www.relume.io/react/components)
- [Relume Figma Plugin](https://www.figma.com/community/plugin/1245615905217691936/relume)
- [Relume Webflow App](https://webflow.com/apps/detail/relume)
- [Import Existing Site — Relume Docs](https://www.relume.io/resources/docs/import-an-existing-site-into-the-relume-site-builder)
- [Export to React — Relume Docs](https://www.relume.io/resources/docs/how-to-export-site-builder-wireframes-to-react)
- [Relume TechRadar Review](https://www.techradar.com/reviews/relume-website-builder)
- [Relume — TheCodeBeast](https://thecodebeast.com/relume-the-ai-powered-platform-revolutionizing-website-design/)
- [Best AI Tools — Relume Review 2026](https://www.bestaitools.com/tool/relume/)
- [Design a Website with Relume AI — Medium](https://medium.com/design-bootcamp/design-a-website-with-relume-ai-8e484554c048)

### IBM Carbon Design System
- [Carbon Design System — Official Site](https://carbondesignsystem.com/)
- [Carbon GitHub Repository](https://github.com/carbon-design-system/carbon)
- [Carbon React Components (Storybook)](https://react.carbondesignsystem.com/)
- [Carbon Components Overview](https://carbondesignsystem.com/components/overview/components/)
- [Carbon Themes — Overview](https://carbondesignsystem.com/elements/themes/overview/)
- [Carbon Themes — Code](https://carbondesignsystem.com/elements/themes/code/)
- [Carbon 2x Grid](https://carbondesignsystem.com/elements/2x-grid/overview/)
- [Carbon Patterns Overview](https://carbondesignsystem.com/patterns/overview/)
- [Carbon for IBM.com — GitHub](https://github.com/carbon-design-system/carbon-for-ibm-dotcom)
- [Carbon for IBM.com Web Components](https://carbon-design-system.github.io/carbon-for-ibm-dotcom/next/web-components/)
- [Carbon for IBM.com — npm](https://www.npmjs.com/package/@carbon/ibmdotcom-web-components)
- [IBM Products Library — GitHub](https://github.com/carbon-design-system/ibm-products)
- [Carbon Community Component Index (v10)](https://v10.carbondesignsystem.com/community/component-index/)
- [Carbon Figma Kit (All Themes)](https://www.figma.com/community/file/1091064745039642284/ibm-carbon-design-system-white-g10-g90-g100-all-themes)
- [Carbon Design System — Practical Example (Medium)](https://medium.com/@mats_44589/carbon-design-system-a-practical-example-8dcad5261ba5)
- [Carbon Design System Overview — Motiff](https://motiff.com/design-system-wiki/design-systems-overview/carbon-design-system-overview-ibm-framework-consistent-scalable-ui-ux)

### Notion API
- [Notion Docs: Working with Page Content](https://developers.notion.com/guides/data-apis/working-with-page-content)
- [Notion Docs: Working with Databases](https://developers.notion.com/docs/working-with-databases)
- [Notion API: Start Building](https://developers.notion.com/docs/getting-started)
- [Notion API Reference 2026 — NotionSender](https://www.notionsender.com/blog/post/notion-api-doc)
- [Notion API as Low-Code CMS — Rowy](https://www.rowy.io/blog/notion-api)
