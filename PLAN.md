# Social Media Templates — Implementation Plan

## Overview

Add a new **Social Media Templates** tool page to ThinkMachine Tools that provides downloadable visual design templates (as SVG previews + Figma links) for all major social media platforms. Templates integrate with ThinkMachine workflows — users brainstorm content via mind maps, then use these templates to format and publish.

---

## Deliverables

### 1. New Tool Page: `tools/social-media-templates.html`
Follows the exact same structure as the existing 6 tool pages (hero → gallery → features → how-it-works → CTA).

**Sections:**
- **Hero** — Title, description, platform filter bar
- **Template Gallery** — Filterable grid of template cards organized by platform
- **Platform Specs Reference** — Dimensions, safe zones, file types for each platform
- **How It Works** — 5-step workflow (Brainstorm → Pick Template → Customize → Export → Publish)
- **Features** — Why use ThinkMachine for social content
- **CTA** — Links to ThinkMachine app + Figma community

### 2. Platform Coverage (All 7 Major Platforms)

Each platform gets visual design template cards with correct dimensions:

| Platform | Templates | Key Dimensions |
|----------|-----------|----------------|
| **Instagram** | Post (1080×1080), Story (1080×1920), Reel Cover (1080×1920), Carousel (1080×1080) | Square + 9:16 |
| **Facebook** | Post (1200×630), Cover (820×312), Story (1080×1920), Event (1920×1005) | 1.91:1 + 9:16 |
| **X / Twitter** | Post (1600×900), Header (1500×500), Card (800×418) | 16:9 + 3:1 |
| **LinkedIn** | Post (1200×627), Article Cover (1200×644), Company Banner (1128×191), Carousel (1080×1080) | 1.91:1 |
| **TikTok** | Video Cover (1080×1920), Profile (200×200) | 9:16 |
| **YouTube** | Thumbnail (1280×720), Channel Banner (2560×1440), Community Post (1200×675) | 16:9 |
| **Pinterest** | Pin (1000×1500), Idea Pin (1080×1920), Board Cover (600×600) | 2:3 + 9:16 |

### 3. Template Card Design

Each template card in the gallery includes:
- **SVG preview** — Scaled-down visual showing the template layout with placeholder zones (headline, image area, CTA, logo placement)
- **Platform badge** — Color-coded platform identifier
- **Template name** — e.g., "Instagram Post — Quote Card"
- **Dimensions** — e.g., "1080 × 1080 px"
- **Download button** — Links to Figma community template
- **Use with ThinkMachine** — Deep-link that opens ThinkMachine app with social media content prompt

### 4. Figma Integration

- Each template card links to a Figma community URL placeholder (to be populated with actual Figma links)
- A "Design System Kit" download section exports the ThinkMachine design tokens (colors, typography, spacing) as a Figma-ready reference
- Token export displayed as a reference table on the page

### 5. ThinkMachine Workflow Integration

Templates connect to the ThinkMachine app via the existing URL parameter system:
- "Plan Content" button → `app.thinkmachine.com/new?text=Social+Media+Content+Plan+for+Instagram&mindmap=true`
- "Brainstorm Ideas" → Opens AI mindmap generator with social-media-related prompts
- Example prompts provided for each platform

---

## Files to Create

| File | Purpose |
|------|---------|
| `tools/social-media-templates.html` | New tool page (HTML) |
| `css/templates.css` | Template gallery styles, platform badges, filter bar, spec tables |
| `js/templates.js` | Platform filtering, template card interactions |
| `assets/templates/` | Directory for SVG template preview thumbnails |

## Files to Modify

| File | Change |
|------|--------|
| `index.html` | Add 7th tool card to tools grid, update "6 ways" → "7 ways" heading |
| `css/home.css` | (if needed) Adjust grid for 7 cards |
| `tools/*.html` (all 6) | Add "Social Media Templates" to dropdown nav + mobile nav + footer |

---

## Implementation Steps

### Step 1: Create `css/templates.css`
New styles for:
- `.template-filter` — Platform filter bar (horizontal pill buttons)
- `.template-gallery` — Responsive card grid (1 → 2 → 3 columns)
- `.template-card` — Individual template card with preview, info, actions
- `.template-card__preview` — SVG preview container with aspect ratio
- `.template-card__platform` — Color-coded platform badge
- `.template-card__actions` — Download + ThinkMachine buttons
- `.platform-specs` — Reference table for dimensions
- `.design-kit` — Design system export section
- Platform color tokens (Instagram gradient, Facebook blue, X black, LinkedIn blue, TikTok pink/cyan, YouTube red, Pinterest red)

### Step 2: Create SVG template previews (`assets/templates/`)
Inline SVG previews for each template type showing:
- Safe zone boundaries
- Placeholder regions (headline, body text, image, logo, CTA)
- Platform-specific layout guides
- Built with ThinkMachine design tokens (indigo accents, dark theme)

### Step 3: Create `js/templates.js`
- Platform filter functionality (show/hide cards by platform)
- "All" filter to reset
- Active filter state management
- Download tracking (optional analytics hook)

### Step 4: Create `tools/social-media-templates.html`
Full tool page following existing pattern:
- SEO meta tags (OpenGraph, Twitter Card, JSON-LD)
- Header + mobile nav (with all 7 tools)
- Hero section with platform filter
- Template gallery grid
- Platform specs reference section
- How It Works (5 steps)
- Features section (3 tiles)
- Design System Kit section
- CTA section
- Footer

### Step 5: Update navigation across all pages
- `index.html` — header dropdown, mobile nav, footer
- All 6 `tools/*.html` — header dropdown, mobile nav, footer
- Add "Social Media Templates" link to every navigation instance

### Step 6: Update `index.html` tools grid
- Add 7th tool card for Social Media Templates
- Update section heading "6 ways to build mind maps" → "7 ways to create with mind maps"
- New card uses a grid/layout icon and "Templates" tag

---

## Design Decisions

1. **No backend required** — Everything is static HTML/CSS/JS, consistent with the existing architecture
2. **Figma links as placeholders** — Template download buttons link to `#figma` placeholders that can be updated with real Figma community URLs
3. **SVG inline previews** — Lightweight, scalable, themeable with CSS variables, no external image dependencies
4. **ThinkMachine deep-links** — Use existing `?text=...&mindmap=true` URL params to connect templates to the brainstorming workflow
5. **Platform filtering** — Simple JS toggle (no framework), consistent with vanilla JS approach in `embed.js`
6. **Responsive grid** — Same breakpoints as existing tool pages (672px, 1056px)
