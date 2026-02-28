/**
 * Creative IO — Evergreen Article Sections Library
 * Complete section library with 349 section definitions across 20 groups,
 * 14 content types with inclusion rules, and 22 Areas of IO.
 * Section Numbering Convention: SEC-[GROUP]-[NUMBER]
 * Storage Tiers: core_property (~50 props), page_body (headings), linked_database
 */

// ============================================================================
// GROUP DEFINITIONS (20 Groups)
// ============================================================================
export const GROUPS = {
  FND: { id: 'FND', name: 'Foundation & Definition', count: 20, description: 'Core definitions, taxonomy, and foundational knowledge' },
  FNC: { id: 'FNC', name: 'Function & Mechanics', count: 20, description: 'How things work, mechanisms, and functional details' },
  FTR: { id: 'FTR', name: 'Features & Capabilities', count: 20, description: 'Feature sets, capabilities, and what it can do' },
  BEN: { id: 'BEN', name: 'Benefits & Value', count: 15, description: 'Value propositions, benefits, and ROI' },
  USE: { id: 'USE', name: 'Use Cases & Applications', count: 15, description: 'Real-world applications and use case scenarios' },
  USR: { id: 'USR', name: 'User & Stakeholder', count: 15, description: 'User personas, stakeholder perspectives, and audience' },
  OUT: { id: 'OUT', name: 'Outcomes & Impact', count: 15, description: 'Measurable outcomes, KPIs, and business impact' },
  STR: { id: 'STR', name: 'Strategy & Approach', count: 15, description: 'Strategic frameworks, methodologies, and approaches' },
  CMP: { id: 'CMP', name: 'Comparison & Differentiation', count: 20, description: 'Competitive analysis, comparisons, and differentiators' },
  PRC: { id: 'PRC', name: 'Process & Implementation', count: 20, description: 'Step-by-step processes, implementation guides' },
  BST: { id: 'BST', name: 'Best Practices & Optimization', count: 20, description: 'Best practices, optimization tips, and guidelines' },
  FUT: { id: 'FUT', name: 'Future & Trends', count: 10, description: 'Future outlook, emerging trends, and predictions' },
  RSK: { id: 'RSK', name: 'Risks & Challenges', count: 15, description: 'Risk factors, challenges, and mitigation strategies' },
  ECO: { id: 'ECO', name: 'Ecosystem & Integrations', count: 10, description: 'Ecosystem mapping, integrations, and partnerships' },
  'PRC$': { id: 'PRC$', name: 'Pricing & Economics', count: 10, description: 'Pricing models, cost analysis, and economic factors' },
  TEC: { id: 'TEC', name: 'Technical & Architecture', count: 15, description: 'Technical specifications, architecture, and infrastructure' },
  SEO: { id: 'SEO', name: 'SEO & Search Optimization', count: 25, description: 'SEO elements, search optimization, and discoverability' },
  DAT: { id: 'DAT', name: 'Structured Data & Markup', count: 15, description: 'Schema.org markup, JSON-LD, and structured data' },
  QST: { id: 'QST', name: 'User Search Questions', count: 22, description: 'PAA-style questions, search intent matching' },
  META: { id: 'META', name: 'Article Metadata & Management', count: 32, description: 'Publishing metadata, workflow status, and management' },
};

// ============================================================================
// AREAS OF IO (22 Areas)
// ============================================================================
export const AREAS = [
  { id: 'notion-io', name: 'Notion IO', slug: '/areas/notion-io', description: 'Notion workspace management and automation' },
  { id: 'website-io', name: 'Website IO', slug: '/areas/website-io', description: 'Website development, hosting, and optimization' },
  { id: 'content-io', name: 'Content IO', slug: '/areas/content-io', description: 'Content creation, management, and distribution' },
  { id: 'working-io', name: 'Working IO', slug: '/areas/working-io', description: 'Productivity, workflows, and work management' },
  { id: 'toolkits-io', name: 'Toolkits IO', slug: '/areas/toolkits-io', description: 'Tool selection, integration, and management' },
  { id: 'brand-io', name: 'Brand IO', slug: '/areas/brand-io', description: 'Brand strategy, identity, and management' },
  { id: 'real-estate-io', name: 'Real-Estate IO', slug: '/areas/real-estate-io', description: 'Real estate operations and technology' },
  { id: 'github-io', name: 'Github IO', slug: '/areas/github-io', description: 'GitHub workflows, actions, and development ops' },
  { id: 'revenue-io', name: 'Revenue IO', slug: '/areas/revenue-io', description: 'Revenue generation, monetization, and growth' },
  { id: 'acquisition-io', name: 'Acquisition IO', slug: '/areas/acquisition-io', description: 'Customer acquisition, lead generation, and funnels' },
  { id: 'products-io', name: 'Products IO', slug: '/areas/products-io', description: 'Product development, management, and launch' },
  { id: 'articles-io', name: 'Articles IO', slug: '/areas/articles-io', description: 'Article publishing, SEO content, and editorial' },
  { id: 'data-io', name: 'Data IO', slug: '/areas/data-io', description: 'Data management, analytics, and intelligence' },
  { id: 'connections-io', name: 'Connections IO', slug: '/areas/connections-io', description: 'Networking, partnerships, and relationship management' },
  { id: 'author-io', name: 'Author IO', slug: '/areas/author-io', description: 'Author profiles, bylines, and contributor management' },
  { id: 'design-system-io', name: 'Design System IO', slug: '/areas/design-system-io', description: 'Design systems, component libraries, and UI/UX' },
  { id: 'communications-io', name: 'Communications IO', slug: '/areas/communications-io', description: 'Internal/external communications and messaging' },
  { id: 'ai-entity-io', name: 'AI Entity IO', slug: '/areas/ai-entity-io', description: 'AI entities, models, and intelligent agents' },
  { id: 'ai-agents-io', name: 'AI Agents IO', slug: '/areas/ai-agents-io', description: 'AI agent development, orchestration, and deployment' },
  { id: 'search-io', name: 'Search IO', slug: '/areas/search-io', description: 'Search optimization, discovery, and ranking' },
  { id: 'governance', name: 'Governance', slug: '/areas/governance', description: 'Governance, compliance, and policy management' },
  { id: 'experience-io', name: 'Experience IO', slug: '/areas/experience-io', description: 'User experience, customer experience, and CX design' },
];

// ============================================================================
// CONTENT TYPES (14 Types) — CT-01 through CT-14
// ============================================================================
export const CONTENT_TYPES = {
  'CT-01': { id: 'CT-01', name: 'Deep Dive / Pillar', description: 'Comprehensive authoritative articles (3000-5000+ words)', wordRange: [3000, 5000] },
  'CT-02': { id: 'CT-02', name: 'How-To / Tutorial', description: 'Step-by-step instructional content', wordRange: [1500, 3000] },
  'CT-03': { id: 'CT-03', name: 'Comparison / Versus', description: 'Side-by-side analysis of alternatives', wordRange: [2000, 3500] },
  'CT-04': { id: 'CT-04', name: 'Listicle / Roundup', description: 'Curated lists of tools, tips, or resources', wordRange: [1500, 2500] },
  'CT-05': { id: 'CT-05', name: 'Case Study', description: 'Real-world implementation stories with outcomes', wordRange: [1500, 3000] },
  'CT-06': { id: 'CT-06', name: 'News / Update', description: 'Timely industry news and product updates', wordRange: [500, 1500] },
  'CT-07': { id: 'CT-07', name: 'Opinion / Thought Leadership', description: 'Expert perspectives and strategic insights', wordRange: [1000, 2500] },
  'CT-08': { id: 'CT-08', name: 'Review / Analysis', description: 'In-depth product or service evaluations', wordRange: [1500, 3000] },
  'CT-09': { id: 'CT-09', name: 'Glossary / Definition', description: 'Term definitions and concept explanations', wordRange: [300, 1000] },
  'CT-10': { id: 'CT-10', name: 'FAQ / Q&A', description: 'Question-answer formatted content', wordRange: [500, 1500] },
  'CT-11': { id: 'CT-11', name: 'Resource / Tool Guide', description: 'Tool documentation and resource guides', wordRange: [1000, 2500] },
  'CT-12': { id: 'CT-12', name: 'Strategy / Framework', description: 'Strategic frameworks and methodology guides', wordRange: [2000, 4000] },
  'CT-13': { id: 'CT-13', name: 'Technical / Developer', description: 'Technical documentation and developer guides', wordRange: [1500, 4000] },
  'CT-14': { id: 'CT-14', name: 'Emerging / Trend', description: 'Emerging technology and future trend analysis', wordRange: [1000, 2500] },
};

export const STORAGE_TIERS = { core_property: 'core_property', page_body: 'page_body', linked_database: 'linked_database' };

// ============================================================================
// ALL 349 SECTION DEFINITIONS
// ============================================================================
export const SECTIONS = [
  // GROUP 1: FND — Foundation & Definition (20)
  { id: 'SEC-FND-001', name: 'Primary Definition', group: 'FND', description: 'Core definition of the topic in 1-2 sentences', storageTier: 'core_property', propertyType: 'rich_text', contentFormat: 'short_text', renderComponent: 'DefinitionBlock' },
  { id: 'SEC-FND-002', name: 'Extended Definition', group: 'FND', description: 'Detailed 2-3 paragraph explanation', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-FND-003', name: 'Etymology & Origin', group: 'FND', description: 'Word origin, historical context, term evolution', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-FND-004', name: 'Historical Timeline', group: 'FND', description: 'Key milestones and evolution over time', storageTier: 'page_body', propertyType: null, contentFormat: 'timeline', renderComponent: 'TimelineBlock' },
  { id: 'SEC-FND-005', name: 'Category / Taxonomy', group: 'FND', description: 'Where this sits within broader classification', storageTier: 'core_property', propertyType: 'select', contentFormat: 'taxonomy', renderComponent: 'TaxonomyBlock' },
  { id: 'SEC-FND-006', name: 'Subcategories', group: 'FND', description: 'Breakdown of subtypes within the topic', storageTier: 'page_body', propertyType: null, contentFormat: 'list', renderComponent: 'ListBlock' },
  { id: 'SEC-FND-007', name: 'Key Terminology', group: 'FND', description: 'Essential terms and jargon defined', storageTier: 'page_body', propertyType: null, contentFormat: 'definition_list', renderComponent: 'GlossaryBlock' },
  { id: 'SEC-FND-008', name: 'Core Principles', group: 'FND', description: 'Fundamental principles that underpin the topic', storageTier: 'page_body', propertyType: null, contentFormat: 'numbered_list', renderComponent: 'PrinciplesBlock' },
  { id: 'SEC-FND-009', name: 'Common Misconceptions', group: 'FND', description: 'Myths and corrections about the topic', storageTier: 'page_body', propertyType: null, contentFormat: 'myth_fact', renderComponent: 'MythFactBlock' },
  { id: 'SEC-FND-010', name: 'Importance Statement', group: 'FND', description: 'Why this topic matters — relevance and significance', storageTier: 'core_property', propertyType: 'rich_text', contentFormat: 'short_text', renderComponent: 'HighlightBlock' },
  { id: 'SEC-FND-011', name: 'Scope & Boundaries', group: 'FND', description: 'What this article covers and does not cover', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-FND-012', name: 'Prerequisites & Requirements', group: 'FND', description: 'What the reader needs before engaging', storageTier: 'page_body', propertyType: null, contentFormat: 'checklist', renderComponent: 'ChecklistBlock' },
  { id: 'SEC-FND-013', name: 'Related Topics', group: 'FND', description: 'Adjacent topics and cross-references', storageTier: 'core_property', propertyType: 'relation', contentFormat: 'link_list', renderComponent: 'RelatedLinksBlock' },
  { id: 'SEC-FND-014', name: 'Industry Context', group: 'FND', description: 'How this fits within the current industry landscape', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-FND-015', name: 'Regulatory Landscape', group: 'FND', description: 'Relevant regulations and compliance requirements', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-FND-016', name: 'Key Statistics', group: 'FND', description: 'Important data points, market size, adoption rates', storageTier: 'page_body', propertyType: null, contentFormat: 'stat_cards', renderComponent: 'StatCardsBlock' },
  { id: 'SEC-FND-017', name: 'Expert Quotes', group: 'FND', description: 'Notable quotes from industry thought leaders', storageTier: 'page_body', propertyType: null, contentFormat: 'blockquotes', renderComponent: 'QuoteBlock' },
  { id: 'SEC-FND-018', name: 'Visual Overview', group: 'FND', description: 'Diagram or infographic of the topic', storageTier: 'page_body', propertyType: null, contentFormat: 'media', renderComponent: 'MediaBlock' },
  { id: 'SEC-FND-019', name: 'TL;DR Summary', group: 'FND', description: 'Quick executive summary for scanners', storageTier: 'core_property', propertyType: 'rich_text', contentFormat: 'bullet_summary', renderComponent: 'TldrBlock' },
  { id: 'SEC-FND-020', name: 'Reading Guide', group: 'FND', description: 'How to navigate this article', storageTier: 'page_body', propertyType: null, contentFormat: 'navigation', renderComponent: 'ReadingGuideBlock' },
  // GROUP 2: FNC — Function & Mechanics (20)
  { id: 'SEC-FNC-001', name: 'How It Works', group: 'FNC', description: 'Core mechanism or process explained', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-FNC-002', name: 'Technical Architecture', group: 'FNC', description: 'System architecture and tech stack', storageTier: 'page_body', propertyType: null, contentFormat: 'diagram', renderComponent: 'ArchitectureBlock' },
  { id: 'SEC-FNC-003', name: 'Core Components', group: 'FNC', description: 'Key building blocks and their roles', storageTier: 'page_body', propertyType: null, contentFormat: 'component_list', renderComponent: 'ComponentListBlock' },
  { id: 'SEC-FNC-004', name: 'Data Flow', group: 'FNC', description: 'How data moves through the system', storageTier: 'page_body', propertyType: null, contentFormat: 'flow_diagram', renderComponent: 'FlowBlock' },
  { id: 'SEC-FNC-005', name: 'Input / Output', group: 'FNC', description: 'Inputs, outputs, and transformations', storageTier: 'page_body', propertyType: null, contentFormat: 'io_table', renderComponent: 'IOTableBlock' },
  { id: 'SEC-FNC-006', name: 'Algorithms & Logic', group: 'FNC', description: 'Underlying algorithms and decision trees', storageTier: 'page_body', propertyType: null, contentFormat: 'code_block', renderComponent: 'CodeBlock' },
  { id: 'SEC-FNC-007', name: 'APIs & Interfaces', group: 'FNC', description: 'Available APIs and interface specs', storageTier: 'page_body', propertyType: null, contentFormat: 'api_reference', renderComponent: 'APIBlock' },
  { id: 'SEC-FNC-008', name: 'Configuration Options', group: 'FNC', description: 'Configurable parameters and settings', storageTier: 'page_body', propertyType: null, contentFormat: 'config_table', renderComponent: 'ConfigTableBlock' },
  { id: 'SEC-FNC-009', name: 'Dependencies & Requirements', group: 'FNC', description: 'System dependencies and compatibility', storageTier: 'page_body', propertyType: null, contentFormat: 'dependency_list', renderComponent: 'DependencyBlock' },
  { id: 'SEC-FNC-010', name: 'Performance Characteristics', group: 'FNC', description: 'Speed, throughput, and benchmarks', storageTier: 'page_body', propertyType: null, contentFormat: 'benchmark_table', renderComponent: 'BenchmarkBlock' },
  { id: 'SEC-FNC-011', name: 'Scaling Behavior', group: 'FNC', description: 'How the system scales', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-FNC-012', name: 'Security Model', group: 'FNC', description: 'Auth, encryption, and security layers', storageTier: 'page_body', propertyType: null, contentFormat: 'security_matrix', renderComponent: 'SecurityBlock' },
  { id: 'SEC-FNC-013', name: 'Error Handling', group: 'FNC', description: 'Error detection, reporting, recovery', storageTier: 'page_body', propertyType: null, contentFormat: 'error_table', renderComponent: 'ErrorTableBlock' },
  { id: 'SEC-FNC-014', name: 'Logging & Monitoring', group: 'FNC', description: 'Observability and monitoring setup', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-FNC-015', name: 'State Management', group: 'FNC', description: 'How state is stored and synchronized', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-FNC-016', name: 'Concurrency Model', group: 'FNC', description: 'Threading, async, parallel processing', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-FNC-017', name: 'Caching Strategy', group: 'FNC', description: 'Cache layers and invalidation', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-FNC-018', name: 'Versioning & Migration', group: 'FNC', description: 'Version compatibility and migration paths', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-FNC-019', name: 'Testing Approach', group: 'FNC', description: 'How to test and validate functionality', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-FNC-020', name: 'Debugging Guide', group: 'FNC', description: 'Common issues and troubleshooting steps', storageTier: 'page_body', propertyType: null, contentFormat: 'troubleshoot_list', renderComponent: 'TroubleshootBlock' },
  // GROUP 3: FTR — Features & Capabilities (20)
  { id: 'SEC-FTR-001', name: 'Feature Overview', group: 'FTR', description: 'High-level summary of all major features', storageTier: 'page_body', propertyType: null, contentFormat: 'feature_grid', renderComponent: 'FeatureGridBlock' },
  { id: 'SEC-FTR-002', name: 'Core Features', group: 'FTR', description: 'Primary features that define the product', storageTier: 'page_body', propertyType: null, contentFormat: 'feature_cards', renderComponent: 'FeatureCardsBlock' },
  { id: 'SEC-FTR-003', name: 'Advanced Features', group: 'FTR', description: 'Power-user and enterprise capabilities', storageTier: 'page_body', propertyType: null, contentFormat: 'feature_cards', renderComponent: 'FeatureCardsBlock' },
  { id: 'SEC-FTR-004', name: 'Unique Differentiators', group: 'FTR', description: 'Features that set this apart from competitors', storageTier: 'core_property', propertyType: 'rich_text', contentFormat: 'bullet_list', renderComponent: 'DifferentiatorBlock' },
  { id: 'SEC-FTR-005', name: 'Feature Comparison Matrix', group: 'FTR', description: 'Feature-by-feature comparison across alternatives', storageTier: 'page_body', propertyType: null, contentFormat: 'comparison_table', renderComponent: 'ComparisonTableBlock' },
  { id: 'SEC-FTR-006', name: 'New & Upcoming Features', group: 'FTR', description: 'Recently added and planned capabilities', storageTier: 'page_body', propertyType: null, contentFormat: 'roadmap', renderComponent: 'RoadmapBlock' },
  { id: 'SEC-FTR-007', name: 'Feature Deep Dive', group: 'FTR', description: 'Detailed exploration of a standout feature', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-FTR-008', name: 'Customization Options', group: 'FTR', description: 'How features can be customized or extended', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-FTR-009', name: 'Automation Capabilities', group: 'FTR', description: 'Built-in automation and triggers', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-FTR-010', name: 'Collaboration Features', group: 'FTR', description: 'Multi-user and team capabilities', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-FTR-011', name: 'Reporting & Analytics', group: 'FTR', description: 'Built-in dashboards and analytics', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-FTR-012', name: 'Mobile & Cross-Platform', group: 'FTR', description: 'Mobile app and cross-platform support', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-FTR-013', name: 'Accessibility Features', group: 'FTR', description: 'WCAG compliance and accessibility', storageTier: 'page_body', propertyType: null, contentFormat: 'checklist', renderComponent: 'ChecklistBlock' },
  { id: 'SEC-FTR-014', name: 'Internationalization', group: 'FTR', description: 'Multi-language and localization support', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-FTR-015', name: 'Import & Export', group: 'FTR', description: 'Data import/export formats and tools', storageTier: 'page_body', propertyType: null, contentFormat: 'format_list', renderComponent: 'FormatListBlock' },
  { id: 'SEC-FTR-016', name: 'Template Library', group: 'FTR', description: 'Pre-built templates and examples', storageTier: 'page_body', propertyType: null, contentFormat: 'gallery', renderComponent: 'GalleryBlock' },
  { id: 'SEC-FTR-017', name: 'Plugin / Extension System', group: 'FTR', description: 'Plugin architecture and extensibility', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-FTR-018', name: 'AI / ML Capabilities', group: 'FTR', description: 'AI-powered features and smart automation', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-FTR-019', name: 'Offline Support', group: 'FTR', description: 'Offline mode and local-first capabilities', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-FTR-020', name: 'Feature Limitations', group: 'FTR', description: 'Known limitations and workarounds', storageTier: 'page_body', propertyType: null, contentFormat: 'limitation_list', renderComponent: 'LimitationsBlock' },
  // GROUP 4: BEN — Benefits & Value (15)
  { id: 'SEC-BEN-001', name: 'Primary Benefits', group: 'BEN', description: 'Top 3-5 benefits for decision makers', storageTier: 'core_property', propertyType: 'rich_text', contentFormat: 'bullet_list', renderComponent: 'BenefitsBlock' },
  { id: 'SEC-BEN-002', name: 'Business Value', group: 'BEN', description: 'Revenue impact, cost savings, business outcomes', storageTier: 'page_body', propertyType: null, contentFormat: 'value_cards', renderComponent: 'ValueCardsBlock' },
  { id: 'SEC-BEN-003', name: 'ROI Analysis', group: 'BEN', description: 'Return on investment and payback period', storageTier: 'page_body', propertyType: null, contentFormat: 'roi_calculator', renderComponent: 'ROIBlock' },
  { id: 'SEC-BEN-004', name: 'Time Savings', group: 'BEN', description: 'Efficiency gains and productivity boost', storageTier: 'page_body', propertyType: null, contentFormat: 'stat_cards', renderComponent: 'StatCardsBlock' },
  { id: 'SEC-BEN-005', name: 'Cost Reduction', group: 'BEN', description: 'Direct and indirect cost savings', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-BEN-006', name: 'Quality Improvement', group: 'BEN', description: 'Output quality and reliability improvements', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-BEN-007', name: 'Competitive Advantage', group: 'BEN', description: 'Strategic market advantages from adoption', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-BEN-008', name: 'User Satisfaction', group: 'BEN', description: 'Impact on user satisfaction and engagement', storageTier: 'page_body', propertyType: null, contentFormat: 'testimonials', renderComponent: 'TestimonialBlock' },
  { id: 'SEC-BEN-009', name: 'Scalability Benefits', group: 'BEN', description: 'Growth without proportional cost increase', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-BEN-010', name: 'Risk Reduction', group: 'BEN', description: 'Mitigation of business and technical risks', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-BEN-011', name: 'Innovation Enablement', group: 'BEN', description: 'How it enables experimentation', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-BEN-012', name: 'Team Empowerment', group: 'BEN', description: 'Self-service capabilities for teams', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-BEN-013', name: 'Long-term Value', group: 'BEN', description: 'Compounding benefits and strategic value', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-BEN-014', name: 'Environmental / Social Impact', group: 'BEN', description: 'Sustainability and ESG benefits', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-BEN-015', name: 'Benefits Summary Table', group: 'BEN', description: 'Consolidated benefits by stakeholder', storageTier: 'page_body', propertyType: null, contentFormat: 'summary_table', renderComponent: 'SummaryTableBlock' },
  // GROUP 5: USE — Use Cases & Applications (15)
  { id: 'SEC-USE-001', name: 'Primary Use Cases', group: 'USE', description: 'Top 3-5 most common scenarios', storageTier: 'core_property', propertyType: 'multi_select', contentFormat: 'use_case_cards', renderComponent: 'UseCaseCardsBlock' },
  { id: 'SEC-USE-002', name: 'Industry Applications', group: 'USE', description: 'How different industries apply this', storageTier: 'page_body', propertyType: null, contentFormat: 'industry_grid', renderComponent: 'IndustryGridBlock' },
  { id: 'SEC-USE-003', name: 'Enterprise Use Cases', group: 'USE', description: 'Large-scale enterprise scenarios', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-USE-004', name: 'SMB Use Cases', group: 'USE', description: 'Small and medium business scenarios', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-USE-005', name: 'Individual / Creator Use Cases', group: 'USE', description: 'Solo practitioner workflows', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-USE-006', name: 'Real-World Examples', group: 'USE', description: 'Specific named examples with outcomes', storageTier: 'page_body', propertyType: null, contentFormat: 'example_cards', renderComponent: 'ExampleCardsBlock' },
  { id: 'SEC-USE-007', name: 'Success Stories', group: 'USE', description: 'Mini case studies with results', storageTier: 'page_body', propertyType: null, contentFormat: 'case_studies', renderComponent: 'CaseStudyBlock' },
  { id: 'SEC-USE-008', name: 'Workflow Integration', group: 'USE', description: 'How it fits into existing workflows', storageTier: 'page_body', propertyType: null, contentFormat: 'workflow_diagram', renderComponent: 'WorkflowBlock' },
  { id: 'SEC-USE-009', name: 'Creative Applications', group: 'USE', description: 'Unconventional ways to apply the topic', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-USE-010', name: 'Automation Scenarios', group: 'USE', description: 'Automation workflows and triggers', storageTier: 'page_body', propertyType: null, contentFormat: 'automation_flows', renderComponent: 'AutomationBlock' },
  { id: 'SEC-USE-011', name: 'Integration Scenarios', group: 'USE', description: 'Combining with other tools/platforms', storageTier: 'page_body', propertyType: null, contentFormat: 'integration_list', renderComponent: 'IntegrationBlock' },
  { id: 'SEC-USE-012', name: 'Anti-Patterns', group: 'USE', description: 'How NOT to use it — common misapplications', storageTier: 'page_body', propertyType: null, contentFormat: 'warning_list', renderComponent: 'AntiPatternBlock' },
  { id: 'SEC-USE-013', name: 'Emerging Use Cases', group: 'USE', description: 'New and emerging application areas', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-USE-014', name: 'Cross-Functional Use Cases', group: 'USE', description: 'How different departments leverage it', storageTier: 'page_body', propertyType: null, contentFormat: 'department_grid', renderComponent: 'DepartmentGridBlock' },
  { id: 'SEC-USE-015', name: 'Use Case Decision Matrix', group: 'USE', description: 'Framework for deciding which use case fits', storageTier: 'page_body', propertyType: null, contentFormat: 'decision_matrix', renderComponent: 'DecisionMatrixBlock' },
  // GROUP 6: USR — User & Stakeholder (15)
  { id: 'SEC-USR-001', name: 'Target Audience', group: 'USR', description: 'Primary and secondary audience personas', storageTier: 'core_property', propertyType: 'multi_select', contentFormat: 'persona_cards', renderComponent: 'PersonaCardsBlock' },
  { id: 'SEC-USR-002', name: 'User Personas', group: 'USR', description: 'Detailed persona profiles with goals and pain points', storageTier: 'page_body', propertyType: null, contentFormat: 'persona_profiles', renderComponent: 'PersonaProfileBlock' },
  { id: 'SEC-USR-003', name: 'Decision Maker View', group: 'USR', description: 'C-suite and executive perspective', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-USR-004', name: 'Practitioner View', group: 'USR', description: 'Hands-on implementer perspective', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-USR-005', name: 'Developer View', group: 'USR', description: 'Technical developer perspective', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-USR-006', name: 'Beginner Guide', group: 'USR', description: 'Getting started for newcomers', storageTier: 'page_body', propertyType: null, contentFormat: 'step_guide', renderComponent: 'StepGuideBlock' },
  { id: 'SEC-USR-007', name: 'Expert Path', group: 'USR', description: 'Advanced mastery track', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-USR-008', name: 'Pain Points Addressed', group: 'USR', description: 'Problems and frustrations this solves', storageTier: 'page_body', propertyType: null, contentFormat: 'pain_solution', renderComponent: 'PainSolutionBlock' },
  { id: 'SEC-USR-009', name: 'User Journey Map', group: 'USR', description: 'End-to-end user journey with touchpoints', storageTier: 'page_body', propertyType: null, contentFormat: 'journey_map', renderComponent: 'JourneyMapBlock' },
  { id: 'SEC-USR-010', name: 'Adoption Barriers', group: 'USR', description: 'What prevents adoption and how to overcome', storageTier: 'page_body', propertyType: null, contentFormat: 'barrier_list', renderComponent: 'BarrierBlock' },
  { id: 'SEC-USR-011', name: 'Training Requirements', group: 'USR', description: 'Skills needed and learning curve', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-USR-012', name: 'Community & Support', group: 'USR', description: 'Community resources and support channels', storageTier: 'page_body', propertyType: null, contentFormat: 'resource_list', renderComponent: 'ResourceListBlock' },
  { id: 'SEC-USR-013', name: 'Certification & Credentials', group: 'USR', description: 'Available certifications and badges', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-USR-014', name: 'Team Roles & Responsibilities', group: 'USR', description: 'Which roles need to be involved', storageTier: 'page_body', propertyType: null, contentFormat: 'role_matrix', renderComponent: 'RoleMatrixBlock' },
  { id: 'SEC-USR-015', name: 'Stakeholder Buy-in', group: 'USR', description: 'How to build organizational support', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  // GROUP 7: OUT — Outcomes & Impact (15)
  { id: 'SEC-OUT-001', name: 'Key Metrics', group: 'OUT', description: 'Primary KPIs and success metrics', storageTier: 'core_property', propertyType: 'rich_text', contentFormat: 'metric_cards', renderComponent: 'MetricCardsBlock' },
  { id: 'SEC-OUT-002', name: 'Expected Outcomes', group: 'OUT', description: 'Realistic 30/60/90 day outcomes', storageTier: 'page_body', propertyType: null, contentFormat: 'timeline', renderComponent: 'TimelineBlock' },
  { id: 'SEC-OUT-003', name: 'Measurable Results', group: 'OUT', description: 'Quantified results from implementations', storageTier: 'page_body', propertyType: null, contentFormat: 'stat_cards', renderComponent: 'StatCardsBlock' },
  { id: 'SEC-OUT-004', name: 'Before & After', group: 'OUT', description: 'Side-by-side before/after comparison', storageTier: 'page_body', propertyType: null, contentFormat: 'before_after', renderComponent: 'BeforeAfterBlock' },
  { id: 'SEC-OUT-005', name: 'Impact Assessment', group: 'OUT', description: 'Comprehensive impact on business/team/tech', storageTier: 'page_body', propertyType: null, contentFormat: 'impact_matrix', renderComponent: 'ImpactMatrixBlock' },
  { id: 'SEC-OUT-006', name: 'Quick Wins', group: 'OUT', description: 'Low-effort high-impact actions', storageTier: 'page_body', propertyType: null, contentFormat: 'quick_win_list', renderComponent: 'QuickWinBlock' },
  { id: 'SEC-OUT-007', name: 'Long-term Impact', group: 'OUT', description: 'Strategic long-term compounding benefits', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-OUT-008', name: 'Industry Benchmarks', group: 'OUT', description: 'Comparison to industry averages', storageTier: 'page_body', propertyType: null, contentFormat: 'benchmark_table', renderComponent: 'BenchmarkBlock' },
  { id: 'SEC-OUT-009', name: 'Customer Outcomes', group: 'OUT', description: 'Outcomes reported by actual users', storageTier: 'page_body', propertyType: null, contentFormat: 'testimonials', renderComponent: 'TestimonialBlock' },
  { id: 'SEC-OUT-010', name: 'Revenue Impact', group: 'OUT', description: 'Direct and indirect revenue effects', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-OUT-011', name: 'Operational Impact', group: 'OUT', description: 'Effects on operational efficiency', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-OUT-012', name: 'Cultural Impact', group: 'OUT', description: 'Effects on team culture and morale', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-OUT-013', name: 'Failure Case Studies', group: 'OUT', description: 'When it did not work and lessons learned', storageTier: 'page_body', propertyType: null, contentFormat: 'case_studies', renderComponent: 'CaseStudyBlock' },
  { id: 'SEC-OUT-014', name: 'Success Criteria', group: 'OUT', description: 'How to define and measure success', storageTier: 'page_body', propertyType: null, contentFormat: 'criteria_list', renderComponent: 'CriteriaBlock' },
  { id: 'SEC-OUT-015', name: 'Outcome Dashboard', group: 'OUT', description: 'Visual dashboard template for tracking', storageTier: 'page_body', propertyType: null, contentFormat: 'dashboard', renderComponent: 'DashboardBlock' },
  // GROUP 8: STR — Strategy & Approach (15)
  { id: 'SEC-STR-001', name: 'Strategic Framework', group: 'STR', description: 'Overarching strategic framework', storageTier: 'page_body', propertyType: null, contentFormat: 'framework_diagram', renderComponent: 'FrameworkBlock' },
  { id: 'SEC-STR-002', name: 'Adoption Strategy', group: 'STR', description: 'Phased rollout and adoption roadmap', storageTier: 'page_body', propertyType: null, contentFormat: 'roadmap', renderComponent: 'RoadmapBlock' },
  { id: 'SEC-STR-003', name: 'Quick Start Strategy', group: 'STR', description: 'Fastest path to first value', storageTier: 'page_body', propertyType: null, contentFormat: 'step_guide', renderComponent: 'StepGuideBlock' },
  { id: 'SEC-STR-004', name: 'Enterprise Strategy', group: 'STR', description: 'Large-scale deployment and governance', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-STR-005', name: 'Build vs Buy Analysis', group: 'STR', description: 'When to build vs purchase', storageTier: 'page_body', propertyType: null, contentFormat: 'comparison_table', renderComponent: 'ComparisonTableBlock' },
  { id: 'SEC-STR-006', name: 'Migration Strategy', group: 'STR', description: 'How to migrate from existing solutions', storageTier: 'page_body', propertyType: null, contentFormat: 'step_guide', renderComponent: 'StepGuideBlock' },
  { id: 'SEC-STR-007', name: 'Change Management', group: 'STR', description: 'Managing organizational change', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-STR-008', name: 'Resource Planning', group: 'STR', description: 'Team, budget, and resource requirements', storageTier: 'page_body', propertyType: null, contentFormat: 'resource_table', renderComponent: 'ResourceTableBlock' },
  { id: 'SEC-STR-009', name: 'Risk Mitigation Plan', group: 'STR', description: 'Identifying and mitigating key risks', storageTier: 'page_body', propertyType: null, contentFormat: 'risk_matrix', renderComponent: 'RiskMatrixBlock' },
  { id: 'SEC-STR-010', name: 'Governance Model', group: 'STR', description: 'Decision-making and accountability framework', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-STR-011', name: 'Vendor Selection Criteria', group: 'STR', description: 'How to evaluate vendors', storageTier: 'page_body', propertyType: null, contentFormat: 'criteria_list', renderComponent: 'CriteriaBlock' },
  { id: 'SEC-STR-012', name: 'Pilot Program Design', group: 'STR', description: 'How to run a proof-of-concept', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-STR-013', name: 'Maturity Model', group: 'STR', description: 'Progression from beginner to advanced', storageTier: 'page_body', propertyType: null, contentFormat: 'maturity_levels', renderComponent: 'MaturityBlock' },
  { id: 'SEC-STR-014', name: 'Success Playbook', group: 'STR', description: 'Proven playbook of actions for success', storageTier: 'page_body', propertyType: null, contentFormat: 'playbook', renderComponent: 'PlaybookBlock' },
  { id: 'SEC-STR-015', name: 'Exit Strategy', group: 'STR', description: 'Plan for transitioning or sunsetting', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  // GROUP 9: CMP — Comparison & Differentiation (20)
  { id: 'SEC-CMP-001', name: 'Competitive Landscape', group: 'CMP', description: 'Overview of competitive market and key players', storageTier: 'page_body', propertyType: null, contentFormat: 'landscape_map', renderComponent: 'LandscapeBlock' },
  { id: 'SEC-CMP-002', name: 'Head-to-Head Comparison', group: 'CMP', description: 'Direct comparison between two alternatives', storageTier: 'page_body', propertyType: null, contentFormat: 'versus_table', renderComponent: 'VersusBlock' },
  { id: 'SEC-CMP-003', name: 'Multi-Product Comparison', group: 'CMP', description: 'Feature matrix across 3+ alternatives', storageTier: 'page_body', propertyType: null, contentFormat: 'comparison_table', renderComponent: 'ComparisonTableBlock' },
  { id: 'SEC-CMP-004', name: 'Pricing Comparison', group: 'CMP', description: 'Price comparison across alternatives', storageTier: 'page_body', propertyType: null, contentFormat: 'pricing_table', renderComponent: 'PricingTableBlock' },
  { id: 'SEC-CMP-005', name: 'Pros & Cons', group: 'CMP', description: 'Balanced pros and cons analysis', storageTier: 'page_body', propertyType: null, contentFormat: 'pros_cons', renderComponent: 'ProsConsBlock' },
  { id: 'SEC-CMP-006', name: 'Market Position', group: 'CMP', description: 'Magic quadrant or market map position', storageTier: 'page_body', propertyType: null, contentFormat: 'quadrant', renderComponent: 'QuadrantBlock' },
  { id: 'SEC-CMP-007', name: 'Switching Costs', group: 'CMP', description: 'Cost and effort for switching', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-CMP-008', name: 'Integration Comparison', group: 'CMP', description: 'Ecosystem and integration capabilities', storageTier: 'page_body', propertyType: null, contentFormat: 'comparison_table', renderComponent: 'ComparisonTableBlock' },
  { id: 'SEC-CMP-009', name: 'Performance Comparison', group: 'CMP', description: 'Performance benchmarks compared', storageTier: 'page_body', propertyType: null, contentFormat: 'benchmark_table', renderComponent: 'BenchmarkBlock' },
  { id: 'SEC-CMP-010', name: 'User Experience Comparison', group: 'CMP', description: 'UX and usability compared', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-CMP-011', name: 'Support & Community Comparison', group: 'CMP', description: 'Support quality and community compared', storageTier: 'page_body', propertyType: null, contentFormat: 'comparison_table', renderComponent: 'ComparisonTableBlock' },
  { id: 'SEC-CMP-012', name: 'Scalability Comparison', group: 'CMP', description: 'How alternatives scale under load', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-CMP-013', name: 'Security Comparison', group: 'CMP', description: 'Security features and certifications', storageTier: 'page_body', propertyType: null, contentFormat: 'comparison_table', renderComponent: 'ComparisonTableBlock' },
  { id: 'SEC-CMP-014', name: 'Ideal Customer Profile', group: 'CMP', description: 'Which solution fits which customer', storageTier: 'page_body', propertyType: null, contentFormat: 'profile_match', renderComponent: 'ProfileMatchBlock' },
  { id: 'SEC-CMP-015', name: 'Migration Difficulty', group: 'CMP', description: 'Difficulty of switching from each', storageTier: 'page_body', propertyType: null, contentFormat: 'difficulty_matrix', renderComponent: 'DifficultyBlock' },
  { id: 'SEC-CMP-016', name: 'Verdict / Recommendation', group: 'CMP', description: 'Final recommendation based on analysis', storageTier: 'core_property', propertyType: 'rich_text', contentFormat: 'verdict', renderComponent: 'VerdictBlock' },
  { id: 'SEC-CMP-017', name: 'Alternative Solutions', group: 'CMP', description: 'Other approaches worth considering', storageTier: 'page_body', propertyType: null, contentFormat: 'alternative_list', renderComponent: 'AlternativeBlock' },
  { id: 'SEC-CMP-018', name: 'Technology Stack Comparison', group: 'CMP', description: 'Underlying technology compared', storageTier: 'page_body', propertyType: null, contentFormat: 'tech_comparison', renderComponent: 'TechComparisonBlock' },
  { id: 'SEC-CMP-019', name: 'Total Cost of Ownership', group: 'CMP', description: 'Full lifecycle cost comparison', storageTier: 'page_body', propertyType: null, contentFormat: 'tco_table', renderComponent: 'TCOBlock' },
  { id: 'SEC-CMP-020', name: 'Decision Framework', group: 'CMP', description: 'Structured framework for choosing', storageTier: 'page_body', propertyType: null, contentFormat: 'decision_tree', renderComponent: 'DecisionTreeBlock' },
  // GROUP 10: PRC — Process & Implementation (20)
  { id: 'SEC-PRC-001', name: 'Getting Started', group: 'PRC', description: 'First steps — setup, installation, config', storageTier: 'page_body', propertyType: null, contentFormat: 'step_guide', renderComponent: 'StepGuideBlock' },
  { id: 'SEC-PRC-002', name: 'Step-by-Step Guide', group: 'PRC', description: 'Complete numbered walkthrough', storageTier: 'page_body', propertyType: null, contentFormat: 'numbered_steps', renderComponent: 'StepByStepBlock' },
  { id: 'SEC-PRC-003', name: 'Prerequisites Checklist', group: 'PRC', description: 'Everything needed before starting', storageTier: 'page_body', propertyType: null, contentFormat: 'checklist', renderComponent: 'ChecklistBlock' },
  { id: 'SEC-PRC-004', name: 'Installation Guide', group: 'PRC', description: 'Detailed installation instructions', storageTier: 'page_body', propertyType: null, contentFormat: 'code_steps', renderComponent: 'CodeStepsBlock' },
  { id: 'SEC-PRC-005', name: 'Configuration Guide', group: 'PRC', description: 'Settings and preferences configuration', storageTier: 'page_body', propertyType: null, contentFormat: 'config_guide', renderComponent: 'ConfigGuideBlock' },
  { id: 'SEC-PRC-006', name: 'Integration Steps', group: 'PRC', description: 'How to connect with other systems', storageTier: 'page_body', propertyType: null, contentFormat: 'numbered_steps', renderComponent: 'StepByStepBlock' },
  { id: 'SEC-PRC-007', name: 'Data Migration', group: 'PRC', description: 'How to migrate existing data', storageTier: 'page_body', propertyType: null, contentFormat: 'migration_guide', renderComponent: 'MigrationBlock' },
  { id: 'SEC-PRC-008', name: 'Testing & Validation', group: 'PRC', description: 'How to verify implementation', storageTier: 'page_body', propertyType: null, contentFormat: 'test_checklist', renderComponent: 'TestChecklistBlock' },
  { id: 'SEC-PRC-009', name: 'Deployment Process', group: 'PRC', description: 'How to deploy to production', storageTier: 'page_body', propertyType: null, contentFormat: 'deployment_steps', renderComponent: 'DeploymentBlock' },
  { id: 'SEC-PRC-010', name: 'Rollback Plan', group: 'PRC', description: 'How to safely roll back', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-PRC-011', name: 'Monitoring Setup', group: 'PRC', description: 'How to set up monitoring', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-PRC-012', name: 'Maintenance Schedule', group: 'PRC', description: 'Ongoing maintenance tasks and cadence', storageTier: 'page_body', propertyType: null, contentFormat: 'schedule_table', renderComponent: 'ScheduleBlock' },
  { id: 'SEC-PRC-013', name: 'Upgrade Process', group: 'PRC', description: 'How to upgrade to newer versions', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-PRC-014', name: 'Backup & Recovery', group: 'PRC', description: 'Backup strategies and disaster recovery', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-PRC-015', name: 'Team Onboarding', group: 'PRC', description: 'How to onboard team members', storageTier: 'page_body', propertyType: null, contentFormat: 'onboarding_plan', renderComponent: 'OnboardingBlock' },
  { id: 'SEC-PRC-016', name: 'Documentation Requirements', group: 'PRC', description: 'What documentation to create', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-PRC-017', name: 'Workflow Templates', group: 'PRC', description: 'Ready-to-use workflow templates', storageTier: 'page_body', propertyType: null, contentFormat: 'template_list', renderComponent: 'TemplateListBlock' },
  { id: 'SEC-PRC-018', name: 'Automation Recipes', group: 'PRC', description: 'Pre-built automation flows', storageTier: 'page_body', propertyType: null, contentFormat: 'recipe_cards', renderComponent: 'RecipeCardsBlock' },
  { id: 'SEC-PRC-019', name: 'Troubleshooting Guide', group: 'PRC', description: 'Common problems and solutions', storageTier: 'page_body', propertyType: null, contentFormat: 'troubleshoot_list', renderComponent: 'TroubleshootBlock' },
  { id: 'SEC-PRC-020', name: 'Implementation Timeline', group: 'PRC', description: 'Realistic timeline for implementation', storageTier: 'page_body', propertyType: null, contentFormat: 'gantt_timeline', renderComponent: 'GanttBlock' },
  // GROUP 11: BST — Best Practices & Optimization (20)
  { id: 'SEC-BST-001', name: 'Top Best Practices', group: 'BST', description: 'Highest-impact best practices (top 5-10)', storageTier: 'page_body', propertyType: null, contentFormat: 'best_practice_cards', renderComponent: 'BestPracticeBlock' },
  { id: 'SEC-BST-002', name: 'Dos and Donts', group: 'BST', description: 'Clear rules of what to do and avoid', storageTier: 'page_body', propertyType: null, contentFormat: 'dos_donts', renderComponent: 'DosdontsBlock' },
  { id: 'SEC-BST-003', name: 'Performance Optimization', group: 'BST', description: 'Speed, efficiency, and performance tips', storageTier: 'page_body', propertyType: null, contentFormat: 'optimization_tips', renderComponent: 'OptimizationBlock' },
  { id: 'SEC-BST-004', name: 'Cost Optimization', group: 'BST', description: 'Reduce costs while maintaining quality', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-BST-005', name: 'Security Best Practices', group: 'BST', description: 'Security hardening and data protection', storageTier: 'page_body', propertyType: null, contentFormat: 'security_checklist', renderComponent: 'SecurityChecklistBlock' },
  { id: 'SEC-BST-006', name: 'Scalability Practices', group: 'BST', description: 'How to design for scale', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-BST-007', name: 'Code Quality', group: 'BST', description: 'Coding standards and quality gates', storageTier: 'page_body', propertyType: null, contentFormat: 'code_standards', renderComponent: 'CodeStandardsBlock' },
  { id: 'SEC-BST-008', name: 'Documentation Standards', group: 'BST', description: 'Effective documentation practices', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-BST-009', name: 'Testing Strategy', group: 'BST', description: 'Test pyramid and coverage goals', storageTier: 'page_body', propertyType: null, contentFormat: 'test_strategy', renderComponent: 'TestStrategyBlock' },
  { id: 'SEC-BST-010', name: 'Monitoring Best Practices', group: 'BST', description: 'What to monitor and alerting thresholds', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-BST-011', name: 'Team Practices', group: 'BST', description: 'Team workflows and collaboration patterns', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-BST-012', name: 'Common Mistakes', group: 'BST', description: 'Frequently made mistakes and how to avoid', storageTier: 'page_body', propertyType: null, contentFormat: 'mistake_list', renderComponent: 'MistakeBlock' },
  { id: 'SEC-BST-013', name: 'Cheat Sheet', group: 'BST', description: 'Quick reference of essential commands', storageTier: 'page_body', propertyType: null, contentFormat: 'cheat_sheet', renderComponent: 'CheatSheetBlock' },
  { id: 'SEC-BST-014', name: 'Naming Conventions', group: 'BST', description: 'Recommended naming patterns', storageTier: 'page_body', propertyType: null, contentFormat: 'convention_table', renderComponent: 'ConventionBlock' },
  { id: 'SEC-BST-015', name: 'Architecture Patterns', group: 'BST', description: 'Recommended patterns and anti-patterns', storageTier: 'page_body', propertyType: null, contentFormat: 'pattern_cards', renderComponent: 'PatternCardsBlock' },
  { id: 'SEC-BST-016', name: 'Data Management', group: 'BST', description: 'Data governance and quality practices', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-BST-017', name: 'Compliance Checklist', group: 'BST', description: 'Regulatory compliance requirements', storageTier: 'page_body', propertyType: null, contentFormat: 'compliance_checklist', renderComponent: 'ComplianceBlock' },
  { id: 'SEC-BST-018', name: 'Optimization Checklist', group: 'BST', description: 'Step-by-step optimization audit', storageTier: 'page_body', propertyType: null, contentFormat: 'audit_checklist', renderComponent: 'AuditChecklistBlock' },
  { id: 'SEC-BST-019', name: 'Review Cadence', group: 'BST', description: 'When and how to review practices', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-BST-020', name: 'Expert Tips', group: 'BST', description: 'Advanced tips from practitioners', storageTier: 'page_body', propertyType: null, contentFormat: 'tip_cards', renderComponent: 'TipCardsBlock' },
  // GROUP 12: FUT — Future & Trends (10)
  { id: 'SEC-FUT-001', name: 'Current Trends', group: 'FUT', description: 'What is happening now in this space', storageTier: 'page_body', propertyType: null, contentFormat: 'trend_cards', renderComponent: 'TrendCardsBlock' },
  { id: 'SEC-FUT-002', name: 'Emerging Technologies', group: 'FUT', description: 'New technologies that will impact this', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-FUT-003', name: 'Market Predictions', group: 'FUT', description: 'Market forecasts and growth projections', storageTier: 'page_body', propertyType: null, contentFormat: 'prediction_cards', renderComponent: 'PredictionBlock' },
  { id: 'SEC-FUT-004', name: 'Industry Roadmap', group: 'FUT', description: 'Where the industry is heading 1-5 years', storageTier: 'page_body', propertyType: null, contentFormat: 'roadmap', renderComponent: 'RoadmapBlock' },
  { id: 'SEC-FUT-005', name: 'Innovation Opportunities', group: 'FUT', description: 'Gaps and whitespace for innovation', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-FUT-006', name: 'Disruption Risks', group: 'FUT', description: 'What could disrupt the current landscape', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-FUT-007', name: 'Regulatory Outlook', group: 'FUT', description: 'Upcoming regulations and policy changes', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-FUT-008', name: 'Skills of the Future', group: 'FUT', description: 'What skills will be needed going forward', storageTier: 'page_body', propertyType: null, contentFormat: 'skill_list', renderComponent: 'SkillListBlock' },
  { id: 'SEC-FUT-009', name: 'Investment Outlook', group: 'FUT', description: 'Where money is flowing — VC, budgets, R&D', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-FUT-010', name: 'Future Scenarios', group: 'FUT', description: 'Best case, worst case, likely case', storageTier: 'page_body', propertyType: null, contentFormat: 'scenario_cards', renderComponent: 'ScenarioBlock' },
  // GROUP 13: RSK — Risks & Challenges (15)
  { id: 'SEC-RSK-001', name: 'Key Risks', group: 'RSK', description: 'Top risks with likelihood and impact', storageTier: 'core_property', propertyType: 'multi_select', contentFormat: 'risk_matrix', renderComponent: 'RiskMatrixBlock' },
  { id: 'SEC-RSK-002', name: 'Technical Challenges', group: 'RSK', description: 'Technical obstacles and complexity', storageTier: 'page_body', propertyType: null, contentFormat: 'challenge_list', renderComponent: 'ChallengeBlock' },
  { id: 'SEC-RSK-003', name: 'Business Risks', group: 'RSK', description: 'Business model and financial risks', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-RSK-004', name: 'Security Risks', group: 'RSK', description: 'Vulnerabilities and attack vectors', storageTier: 'page_body', propertyType: null, contentFormat: 'threat_model', renderComponent: 'ThreatModelBlock' },
  { id: 'SEC-RSK-005', name: 'Compliance Risks', group: 'RSK', description: 'Regulatory gaps and legal risks', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-RSK-006', name: 'Vendor Lock-in', group: 'RSK', description: 'Dependency on specific vendors', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-RSK-007', name: 'Scalability Risks', group: 'RSK', description: 'What breaks at scale', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-RSK-008', name: 'Data Privacy Concerns', group: 'RSK', description: 'GDPR/CCPA and data handling', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-RSK-009', name: 'Adoption Risks', group: 'RSK', description: 'Low adoption and change resistance', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-RSK-010', name: 'Integration Risks', group: 'RSK', description: 'Risks when integrating with existing systems', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-RSK-011', name: 'Cost Overrun Risks', group: 'RSK', description: 'Where costs can spiral', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-RSK-012', name: 'Ethical Considerations', group: 'RSK', description: 'Ethical implications and responsible use', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-RSK-013', name: 'Mitigation Strategies', group: 'RSK', description: 'Strategies to mitigate each risk', storageTier: 'page_body', propertyType: null, contentFormat: 'mitigation_plan', renderComponent: 'MitigationBlock' },
  { id: 'SEC-RSK-014', name: 'Contingency Plans', group: 'RSK', description: 'Backup plans for worst-case scenarios', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-RSK-015', name: 'Risk Register', group: 'RSK', description: 'Comprehensive risk log with ownership', storageTier: 'page_body', propertyType: null, contentFormat: 'risk_register', renderComponent: 'RiskRegisterBlock' },
  // GROUP 14: ECO — Ecosystem & Integrations (10)
  { id: 'SEC-ECO-001', name: 'Ecosystem Overview', group: 'ECO', description: 'Map of surrounding ecosystem', storageTier: 'page_body', propertyType: null, contentFormat: 'ecosystem_map', renderComponent: 'EcosystemMapBlock' },
  { id: 'SEC-ECO-002', name: 'Key Integrations', group: 'ECO', description: 'Most important integrations', storageTier: 'core_property', propertyType: 'multi_select', contentFormat: 'integration_cards', renderComponent: 'IntegrationCardsBlock' },
  { id: 'SEC-ECO-003', name: 'API Ecosystem', group: 'ECO', description: 'Available APIs and developer tools', storageTier: 'page_body', propertyType: null, contentFormat: 'api_list', renderComponent: 'APIListBlock' },
  { id: 'SEC-ECO-004', name: 'Partner Network', group: 'ECO', description: 'Key partners and agencies', storageTier: 'page_body', propertyType: null, contentFormat: 'partner_grid', renderComponent: 'PartnerGridBlock' },
  { id: 'SEC-ECO-005', name: 'Marketplace / App Store', group: 'ECO', description: 'Available plugins and extensions', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-ECO-006', name: 'Data Connectors', group: 'ECO', description: 'Data sources and ETL connectors', storageTier: 'page_body', propertyType: null, contentFormat: 'connector_list', renderComponent: 'ConnectorBlock' },
  { id: 'SEC-ECO-007', name: 'Platform Dependencies', group: 'ECO', description: 'Upstream dependencies and risks', storageTier: 'page_body', propertyType: null, contentFormat: 'dependency_map', renderComponent: 'DependencyMapBlock' },
  { id: 'SEC-ECO-008', name: 'Community Resources', group: 'ECO', description: 'Forums, user groups, and OSS projects', storageTier: 'page_body', propertyType: null, contentFormat: 'resource_list', renderComponent: 'ResourceListBlock' },
  { id: 'SEC-ECO-009', name: 'Certification Programs', group: 'ECO', description: 'Training and learning paths', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-ECO-010', name: 'Ecosystem Maturity', group: 'ECO', description: 'How mature the ecosystem is', storageTier: 'page_body', propertyType: null, contentFormat: 'maturity_levels', renderComponent: 'MaturityBlock' },
  // GROUP 15: PRC$ — Pricing & Economics (10)
  { id: 'SEC-PRC$-001', name: 'Pricing Overview', group: 'PRC$', description: 'Current pricing tiers and plans', storageTier: 'page_body', propertyType: null, contentFormat: 'pricing_table', renderComponent: 'PricingTableBlock' },
  { id: 'SEC-PRC$-002', name: 'Free vs Paid', group: 'PRC$', description: 'What is free vs requires payment', storageTier: 'page_body', propertyType: null, contentFormat: 'comparison_table', renderComponent: 'ComparisonTableBlock' },
  { id: 'SEC-PRC$-003', name: 'Cost Calculator', group: 'PRC$', description: 'Formula-based cost estimation', storageTier: 'page_body', propertyType: null, contentFormat: 'calculator', renderComponent: 'CalculatorBlock' },
  { id: 'SEC-PRC$-004', name: 'Hidden Costs', group: 'PRC$', description: 'Costs beyond list price', storageTier: 'page_body', propertyType: null, contentFormat: 'cost_breakdown', renderComponent: 'CostBreakdownBlock' },
  { id: 'SEC-PRC$-005', name: 'Budget Planning', group: 'PRC$', description: 'How to budget all cost categories', storageTier: 'page_body', propertyType: null, contentFormat: 'budget_template', renderComponent: 'BudgetBlock' },
  { id: 'SEC-PRC$-006', name: 'Discount & Negotiation', group: 'PRC$', description: 'How to get better pricing', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-PRC$-007', name: 'Pricing Model Analysis', group: 'PRC$', description: 'Per-seat vs usage-based vs flat-rate', storageTier: 'page_body', propertyType: null, contentFormat: 'model_comparison', renderComponent: 'ModelComparisonBlock' },
  { id: 'SEC-PRC$-008', name: 'Enterprise Pricing', group: 'PRC$', description: 'Enterprise SLAs and custom agreements', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-PRC$-009', name: 'Economic Impact', group: 'PRC$', description: 'Broader economic impact', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-PRC$-010', name: 'Value for Money Rating', group: 'PRC$', description: 'Overall value-for-money assessment', storageTier: 'core_property', propertyType: 'select', contentFormat: 'rating', renderComponent: 'RatingBlock' },
  // GROUP 16: TEC — Technical & Architecture (15)
  { id: 'SEC-TEC-001', name: 'Technology Stack', group: 'TEC', description: 'Complete technology stack and frameworks', storageTier: 'page_body', propertyType: null, contentFormat: 'tech_stack', renderComponent: 'TechStackBlock' },
  { id: 'SEC-TEC-002', name: 'Architecture Diagram', group: 'TEC', description: 'High-level system architecture', storageTier: 'page_body', propertyType: null, contentFormat: 'diagram', renderComponent: 'ArchitectureBlock' },
  { id: 'SEC-TEC-003', name: 'Infrastructure Requirements', group: 'TEC', description: 'Server, cloud, and infra needs', storageTier: 'page_body', propertyType: null, contentFormat: 'requirements_table', renderComponent: 'RequirementsBlock' },
  { id: 'SEC-TEC-004', name: 'Database Design', group: 'TEC', description: 'Data model and schema design', storageTier: 'page_body', propertyType: null, contentFormat: 'schema_diagram', renderComponent: 'SchemaBlock' },
  { id: 'SEC-TEC-005', name: 'API Documentation', group: 'TEC', description: 'API endpoints and usage examples', storageTier: 'page_body', propertyType: null, contentFormat: 'api_docs', renderComponent: 'APIDocsBlock' },
  { id: 'SEC-TEC-006', name: 'Code Examples', group: 'TEC', description: 'Working code examples', storageTier: 'page_body', propertyType: null, contentFormat: 'code_snippets', renderComponent: 'CodeSnippetsBlock' },
  { id: 'SEC-TEC-007', name: 'SDKs & Libraries', group: 'TEC', description: 'Available SDKs and language support', storageTier: 'page_body', propertyType: null, contentFormat: 'sdk_list', renderComponent: 'SDKListBlock' },
  { id: 'SEC-TEC-008', name: 'Deployment Architecture', group: 'TEC', description: 'CI/CD and deployment topology', storageTier: 'page_body', propertyType: null, contentFormat: 'deployment_diagram', renderComponent: 'DeploymentDiagramBlock' },
  { id: 'SEC-TEC-009', name: 'Performance Specs', group: 'TEC', description: 'Latency, throughput, SLAs', storageTier: 'page_body', propertyType: null, contentFormat: 'spec_table', renderComponent: 'SpecTableBlock' },
  { id: 'SEC-TEC-010', name: 'Security Architecture', group: 'TEC', description: 'Security layers and key management', storageTier: 'page_body', propertyType: null, contentFormat: 'security_architecture', renderComponent: 'SecurityArchBlock' },
  { id: 'SEC-TEC-011', name: 'Compliance & Certifications', group: 'TEC', description: 'SOC2, ISO, HIPAA certifications', storageTier: 'page_body', propertyType: null, contentFormat: 'cert_list', renderComponent: 'CertListBlock' },
  { id: 'SEC-TEC-012', name: 'Data Flow Diagram', group: 'TEC', description: 'How data flows through architecture', storageTier: 'page_body', propertyType: null, contentFormat: 'flow_diagram', renderComponent: 'FlowBlock' },
  { id: 'SEC-TEC-013', name: 'Disaster Recovery', group: 'TEC', description: 'DR strategy, RPO, RTO, failover', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-TEC-014', name: 'Technical Debt', group: 'TEC', description: 'Known tech debt and remediation', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: 'ContentBlock' },
  { id: 'SEC-TEC-015', name: 'Technical Glossary', group: 'TEC', description: 'Technical term definitions', storageTier: 'page_body', propertyType: null, contentFormat: 'definition_list', renderComponent: 'GlossaryBlock' },
  // GROUP 17: SEO — SEO & Search Optimization (25)
  { id: 'SEC-SEO-001', name: 'Primary Keyword', group: 'SEO', description: 'Main target keyword', storageTier: 'core_property', propertyType: 'rich_text', contentFormat: 'keyword', renderComponent: null },
  { id: 'SEC-SEO-002', name: 'Secondary Keywords', group: 'SEO', description: 'Supporting keywords (3-5)', storageTier: 'core_property', propertyType: 'rich_text', contentFormat: 'keyword_list', renderComponent: null },
  { id: 'SEC-SEO-003', name: 'Long-tail Keywords', group: 'SEO', description: 'Long-tail keyword variations (5-10)', storageTier: 'page_body', propertyType: null, contentFormat: 'keyword_list', renderComponent: null },
  { id: 'SEC-SEO-004', name: 'SEO Title', group: 'SEO', description: 'Optimized title tag (50-60 chars)', storageTier: 'core_property', propertyType: 'rich_text', contentFormat: 'title_tag', renderComponent: null },
  { id: 'SEC-SEO-005', name: 'Meta Description', group: 'SEO', description: 'Meta description (150-160 chars)', storageTier: 'core_property', propertyType: 'rich_text', contentFormat: 'meta_description', renderComponent: null },
  { id: 'SEC-SEO-006', name: 'H1 Tag', group: 'SEO', description: 'Primary H1 heading', storageTier: 'core_property', propertyType: 'rich_text', contentFormat: 'heading', renderComponent: null },
  { id: 'SEC-SEO-007', name: 'URL Slug', group: 'SEO', description: 'SEO-friendly URL slug', storageTier: 'core_property', propertyType: 'rich_text', contentFormat: 'slug', renderComponent: null },
  { id: 'SEC-SEO-008', name: 'Canonical URL', group: 'SEO', description: 'Canonical URL for dedup', storageTier: 'core_property', propertyType: 'url', contentFormat: 'url', renderComponent: null },
  { id: 'SEC-SEO-009', name: 'Open Graph Title', group: 'SEO', description: 'OG title for social sharing', storageTier: 'core_property', propertyType: 'rich_text', contentFormat: 'og_title', renderComponent: null },
  { id: 'SEC-SEO-010', name: 'Open Graph Description', group: 'SEO', description: 'OG description for social', storageTier: 'core_property', propertyType: 'rich_text', contentFormat: 'og_description', renderComponent: null },
  { id: 'SEC-SEO-011', name: 'Open Graph Image', group: 'SEO', description: 'OG image URL', storageTier: 'core_property', propertyType: 'url', contentFormat: 'og_image', renderComponent: null },
  { id: 'SEC-SEO-012', name: 'Twitter Card Type', group: 'SEO', description: 'Twitter card format', storageTier: 'core_property', propertyType: 'select', contentFormat: 'twitter_card', renderComponent: null },
  { id: 'SEC-SEO-013', name: 'Search Intent', group: 'SEO', description: 'Primary search intent classification', storageTier: 'core_property', propertyType: 'select', contentFormat: 'intent', renderComponent: null },
  { id: 'SEC-SEO-014', name: 'Content Cluster', group: 'SEO', description: 'Topic cluster for pillar strategy', storageTier: 'core_property', propertyType: 'select', contentFormat: 'cluster', renderComponent: null },
  { id: 'SEC-SEO-015', name: 'Internal Links', group: 'SEO', description: 'Planned internal links', storageTier: 'page_body', propertyType: null, contentFormat: 'link_plan', renderComponent: null },
  { id: 'SEC-SEO-016', name: 'External Links', group: 'SEO', description: 'Authoritative external links', storageTier: 'page_body', propertyType: null, contentFormat: 'link_plan', renderComponent: null },
  { id: 'SEC-SEO-017', name: 'Image Alt Text', group: 'SEO', description: 'Alt text for all images', storageTier: 'page_body', propertyType: null, contentFormat: 'alt_text_list', renderComponent: null },
  { id: 'SEC-SEO-018', name: 'Keyword Density Target', group: 'SEO', description: 'Target density and placement', storageTier: 'page_body', propertyType: null, contentFormat: 'density_plan', renderComponent: null },
  { id: 'SEC-SEO-019', name: 'Featured Snippet Target', group: 'SEO', description: 'Content for featured snippet', storageTier: 'page_body', propertyType: null, contentFormat: 'snippet_format', renderComponent: null },
  { id: 'SEC-SEO-020', name: 'People Also Ask Targets', group: 'SEO', description: 'PAA questions to answer', storageTier: 'page_body', propertyType: null, contentFormat: 'paa_list', renderComponent: null },
  { id: 'SEC-SEO-021', name: 'Content Freshness Signal', group: 'SEO', description: 'Date signals and freshness strategy', storageTier: 'core_property', propertyType: 'date', contentFormat: 'date', renderComponent: null },
  { id: 'SEC-SEO-022', name: 'Readability Score Target', group: 'SEO', description: 'Target readability score', storageTier: 'core_property', propertyType: 'number', contentFormat: 'score', renderComponent: null },
  { id: 'SEC-SEO-023', name: 'Word Count Target', group: 'SEO', description: 'Target word count from SERP analysis', storageTier: 'core_property', propertyType: 'number', contentFormat: 'number', renderComponent: null },
  { id: 'SEC-SEO-024', name: 'Competitor SERP Analysis', group: 'SEO', description: 'Top 10 SERP results analysis', storageTier: 'page_body', propertyType: null, contentFormat: 'serp_analysis', renderComponent: null },
  { id: 'SEC-SEO-025', name: 'Backlink Strategy', group: 'SEO', description: 'Plan for earning backlinks', storageTier: 'page_body', propertyType: null, contentFormat: 'paragraphs', renderComponent: null },
  // GROUP 18: DAT — Structured Data & Markup (15)
  { id: 'SEC-DAT-001', name: 'Article Schema', group: 'DAT', description: 'Schema.org Article JSON-LD', storageTier: 'linked_database', propertyType: null, contentFormat: 'jsonld', renderComponent: 'SchemaBlock' },
  { id: 'SEC-DAT-002', name: 'FAQ Schema', group: 'DAT', description: 'FAQPage schema markup', storageTier: 'linked_database', propertyType: null, contentFormat: 'jsonld', renderComponent: 'SchemaBlock' },
  { id: 'SEC-DAT-003', name: 'HowTo Schema', group: 'DAT', description: 'HowTo schema for steps', storageTier: 'linked_database', propertyType: null, contentFormat: 'jsonld', renderComponent: 'SchemaBlock' },
  { id: 'SEC-DAT-004', name: 'Review Schema', group: 'DAT', description: 'Review/Rating schema', storageTier: 'linked_database', propertyType: null, contentFormat: 'jsonld', renderComponent: 'SchemaBlock' },
  { id: 'SEC-DAT-005', name: 'Product Schema', group: 'DAT', description: 'Product schema for tools', storageTier: 'linked_database', propertyType: null, contentFormat: 'jsonld', renderComponent: 'SchemaBlock' },
  { id: 'SEC-DAT-006', name: 'Comparison Schema', group: 'DAT', description: 'ItemList schema for comparisons', storageTier: 'linked_database', propertyType: null, contentFormat: 'jsonld', renderComponent: 'SchemaBlock' },
  { id: 'SEC-DAT-007', name: 'BreadcrumbList Schema', group: 'DAT', description: 'BreadcrumbList navigation', storageTier: 'linked_database', propertyType: null, contentFormat: 'jsonld', renderComponent: 'SchemaBlock' },
  { id: 'SEC-DAT-008', name: 'Organization Schema', group: 'DAT', description: 'Organization schema for publisher', storageTier: 'linked_database', propertyType: null, contentFormat: 'jsonld', renderComponent: 'SchemaBlock' },
  { id: 'SEC-DAT-009', name: 'Person Schema', group: 'DAT', description: 'Person schema for authors', storageTier: 'linked_database', propertyType: null, contentFormat: 'jsonld', renderComponent: 'SchemaBlock' },
  { id: 'SEC-DAT-010', name: 'WebPage Schema', group: 'DAT', description: 'WebPage with speakable', storageTier: 'linked_database', propertyType: null, contentFormat: 'jsonld', renderComponent: 'SchemaBlock' },
  { id: 'SEC-DAT-011', name: 'VideoObject Schema', group: 'DAT', description: 'VideoObject for embedded videos', storageTier: 'linked_database', propertyType: null, contentFormat: 'jsonld', renderComponent: 'SchemaBlock' },
  { id: 'SEC-DAT-012', name: 'ImageObject Schema', group: 'DAT', description: 'ImageObject for key images', storageTier: 'linked_database', propertyType: null, contentFormat: 'jsonld', renderComponent: 'SchemaBlock' },
  { id: 'SEC-DAT-013', name: 'Table Schema', group: 'DAT', description: 'Table schema for data tables', storageTier: 'linked_database', propertyType: null, contentFormat: 'jsonld', renderComponent: 'SchemaBlock' },
  { id: 'SEC-DAT-014', name: 'SpeakableSpecification', group: 'DAT', description: 'Speakable for voice assistants', storageTier: 'linked_database', propertyType: null, contentFormat: 'jsonld', renderComponent: 'SchemaBlock' },
  { id: 'SEC-DAT-015', name: 'Custom Schema', group: 'DAT', description: 'Custom JSON-LD for topic-specific data', storageTier: 'linked_database', propertyType: null, contentFormat: 'jsonld', renderComponent: 'SchemaBlock' },
  // GROUP 19: QST — User Search Questions (22)
  { id: 'SEC-QST-001', name: 'What Is', group: 'QST', description: '"What is [topic]?" definitional query', storageTier: 'linked_database', propertyType: null, contentFormat: 'qa_pair', renderComponent: 'QABlock' },
  { id: 'SEC-QST-002', name: 'How Does', group: 'QST', description: '"How does [topic] work?" mechanism query', storageTier: 'linked_database', propertyType: null, contentFormat: 'qa_pair', renderComponent: 'QABlock' },
  { id: 'SEC-QST-003', name: 'Why Should', group: 'QST', description: '"Why should I use [topic]?" value query', storageTier: 'linked_database', propertyType: null, contentFormat: 'qa_pair', renderComponent: 'QABlock' },
  { id: 'SEC-QST-004', name: 'How To', group: 'QST', description: '"How to [action] with [topic]?" instruction', storageTier: 'linked_database', propertyType: null, contentFormat: 'qa_pair', renderComponent: 'QABlock' },
  { id: 'SEC-QST-005', name: 'What Are Benefits', group: 'QST', description: '"What are the benefits?" benefit query', storageTier: 'linked_database', propertyType: null, contentFormat: 'qa_pair', renderComponent: 'QABlock' },
  { id: 'SEC-QST-006', name: 'What Are Risks', group: 'QST', description: '"What are the risks?" risk query', storageTier: 'linked_database', propertyType: null, contentFormat: 'qa_pair', renderComponent: 'QABlock' },
  { id: 'SEC-QST-007', name: 'How Much Does', group: 'QST', description: '"How much does it cost?" pricing query', storageTier: 'linked_database', propertyType: null, contentFormat: 'qa_pair', renderComponent: 'QABlock' },
  { id: 'SEC-QST-008', name: 'Versus', group: 'QST', description: '"[A] vs [B]?" comparison query', storageTier: 'linked_database', propertyType: null, contentFormat: 'qa_pair', renderComponent: 'QABlock' },
  { id: 'SEC-QST-009', name: 'Best For', group: 'QST', description: '"Best [topic] for [use case]?" recommendation', storageTier: 'linked_database', propertyType: null, contentFormat: 'qa_pair', renderComponent: 'QABlock' },
  { id: 'SEC-QST-010', name: 'Is It Worth', group: 'QST', description: '"Is [topic] worth it?" evaluation', storageTier: 'linked_database', propertyType: null, contentFormat: 'qa_pair', renderComponent: 'QABlock' },
  { id: 'SEC-QST-011', name: 'When To Use', group: 'QST', description: '"When should I use [topic]?" timing', storageTier: 'linked_database', propertyType: null, contentFormat: 'qa_pair', renderComponent: 'QABlock' },
  { id: 'SEC-QST-012', name: 'Who Uses', group: 'QST', description: '"Who uses [topic]?" audience', storageTier: 'linked_database', propertyType: null, contentFormat: 'qa_pair', renderComponent: 'QABlock' },
  { id: 'SEC-QST-013', name: 'Where To Start', group: 'QST', description: '"Where to start?" beginner query', storageTier: 'linked_database', propertyType: null, contentFormat: 'qa_pair', renderComponent: 'QABlock' },
  { id: 'SEC-QST-014', name: 'Can It', group: 'QST', description: '"Can [topic] do [action]?" capability', storageTier: 'linked_database', propertyType: null, contentFormat: 'qa_pair', renderComponent: 'QABlock' },
  { id: 'SEC-QST-015', name: 'Does It Work With', group: 'QST', description: '"Does it work with [tool]?" compatibility', storageTier: 'linked_database', propertyType: null, contentFormat: 'qa_pair', renderComponent: 'QABlock' },
  { id: 'SEC-QST-016', name: 'What Are Alternatives', group: 'QST', description: '"What are alternatives?" alternatives', storageTier: 'linked_database', propertyType: null, contentFormat: 'qa_pair', renderComponent: 'QABlock' },
  { id: 'SEC-QST-017', name: 'How Long Does', group: 'QST', description: '"How long does it take?" time query', storageTier: 'linked_database', propertyType: null, contentFormat: 'qa_pair', renderComponent: 'QABlock' },
  { id: 'SEC-QST-018', name: 'What Are Examples', group: 'QST', description: '"What are examples?" example query', storageTier: 'linked_database', propertyType: null, contentFormat: 'qa_pair', renderComponent: 'QABlock' },
  { id: 'SEC-QST-019', name: 'How To Measure', group: 'QST', description: '"How to measure success?" measurement', storageTier: 'linked_database', propertyType: null, contentFormat: 'qa_pair', renderComponent: 'QABlock' },
  { id: 'SEC-QST-020', name: 'What Is Future', group: 'QST', description: '"What is the future?" outlook query', storageTier: 'linked_database', propertyType: null, contentFormat: 'qa_pair', renderComponent: 'QABlock' },
  { id: 'SEC-QST-021', name: 'How To Choose', group: 'QST', description: '"How to choose?" selection query', storageTier: 'linked_database', propertyType: null, contentFormat: 'qa_pair', renderComponent: 'QABlock' },
  { id: 'SEC-QST-022', name: 'What Are Best Practices', group: 'QST', description: '"What are best practices?" best practice', storageTier: 'linked_database', propertyType: null, contentFormat: 'qa_pair', renderComponent: 'QABlock' },
  // GROUP 20: META — Article Metadata & Management (32)
  { id: 'SEC-META-001', name: 'Article Title', group: 'META', description: 'Display title of the article', storageTier: 'core_property', propertyType: 'title', contentFormat: 'title', renderComponent: null },
  { id: 'SEC-META-002', name: 'Article Subtitle', group: 'META', description: 'Supporting subtitle or tagline', storageTier: 'core_property', propertyType: 'rich_text', contentFormat: 'subtitle', renderComponent: null },
  { id: 'SEC-META-003', name: 'Content Type', group: 'META', description: 'CT-01 through CT-14 classification', storageTier: 'core_property', propertyType: 'select', contentFormat: 'content_type', renderComponent: null },
  { id: 'SEC-META-004', name: 'Area of IO', group: 'META', description: 'Which Area of IO this belongs to', storageTier: 'core_property', propertyType: 'select', contentFormat: 'area', renderComponent: null },
  { id: 'SEC-META-005', name: 'Author', group: 'META', description: 'Primary author(s)', storageTier: 'core_property', propertyType: 'people', contentFormat: 'author', renderComponent: null },
  { id: 'SEC-META-006', name: 'Publish Status', group: 'META', description: 'Draft/Review/Approved/Published/Archived', storageTier: 'core_property', propertyType: 'select', contentFormat: 'status', renderComponent: null },
  { id: 'SEC-META-007', name: 'Publish Date', group: 'META', description: 'Scheduled or actual publish date', storageTier: 'core_property', propertyType: 'date', contentFormat: 'date', renderComponent: null },
  { id: 'SEC-META-008', name: 'Last Updated', group: 'META', description: 'Date of last content update', storageTier: 'core_property', propertyType: 'date', contentFormat: 'date', renderComponent: null },
  { id: 'SEC-META-009', name: 'Review Date', group: 'META', description: 'Next scheduled review date', storageTier: 'core_property', propertyType: 'date', contentFormat: 'date', renderComponent: null },
  { id: 'SEC-META-010', name: 'Tags', group: 'META', description: 'Topic tags for filtering', storageTier: 'core_property', propertyType: 'multi_select', contentFormat: 'tags', renderComponent: null },
  { id: 'SEC-META-011', name: 'Priority', group: 'META', description: 'Content priority (P0-P4)', storageTier: 'core_property', propertyType: 'select', contentFormat: 'priority', renderComponent: null },
  { id: 'SEC-META-012', name: 'Difficulty Level', group: 'META', description: 'Beginner/Intermediate/Advanced/Expert', storageTier: 'core_property', propertyType: 'select', contentFormat: 'difficulty', renderComponent: null },
  { id: 'SEC-META-013', name: 'Reading Time', group: 'META', description: 'Estimated reading time in minutes', storageTier: 'core_property', propertyType: 'number', contentFormat: 'minutes', renderComponent: null },
  { id: 'SEC-META-014', name: 'Word Count', group: 'META', description: 'Actual word count', storageTier: 'core_property', propertyType: 'number', contentFormat: 'number', renderComponent: null },
  { id: 'SEC-META-015', name: 'Featured Image', group: 'META', description: 'Hero image URL', storageTier: 'core_property', propertyType: 'url', contentFormat: 'image_url', renderComponent: null },
  { id: 'SEC-META-016', name: 'Thumbnail Image', group: 'META', description: 'Card thumbnail URL', storageTier: 'core_property', propertyType: 'url', contentFormat: 'image_url', renderComponent: null },
  { id: 'SEC-META-017', name: 'Published URL', group: 'META', description: 'Live URL after publishing (write-back)', storageTier: 'core_property', propertyType: 'url', contentFormat: 'url', renderComponent: null },
  { id: 'SEC-META-018', name: 'Build Status', group: 'META', description: 'Queued/Building/Deployed/Failed', storageTier: 'core_property', propertyType: 'select', contentFormat: 'build_status', renderComponent: null },
  { id: 'SEC-META-019', name: 'Build Timestamp', group: 'META', description: 'When last build completed', storageTier: 'core_property', propertyType: 'date', contentFormat: 'datetime', renderComponent: null },
  { id: 'SEC-META-020', name: 'Version', group: 'META', description: 'Content version number', storageTier: 'core_property', propertyType: 'number', contentFormat: 'version', renderComponent: null },
  { id: 'SEC-META-021', name: 'Edit History', group: 'META', description: 'Change log of major edits', storageTier: 'page_body', propertyType: null, contentFormat: 'changelog', renderComponent: null },
  { id: 'SEC-META-022', name: 'Reviewer', group: 'META', description: 'Assigned content reviewer', storageTier: 'core_property', propertyType: 'people', contentFormat: 'reviewer', renderComponent: null },
  { id: 'SEC-META-023', name: 'Approval Notes', group: 'META', description: 'Notes from review/approval', storageTier: 'page_body', propertyType: null, contentFormat: 'notes', renderComponent: null },
  { id: 'SEC-META-024', name: 'Content Source', group: 'META', description: 'Original source if adapted', storageTier: 'core_property', propertyType: 'url', contentFormat: 'url', renderComponent: null },
  { id: 'SEC-META-025', name: 'Related Articles', group: 'META', description: 'Related article links', storageTier: 'core_property', propertyType: 'relation', contentFormat: 'relation', renderComponent: null },
  { id: 'SEC-META-026', name: 'Parent Pillar', group: 'META', description: 'Parent pillar article', storageTier: 'core_property', propertyType: 'relation', contentFormat: 'relation', renderComponent: null },
  { id: 'SEC-META-027', name: 'Child Articles', group: 'META', description: 'Child/cluster articles', storageTier: 'core_property', propertyType: 'relation', contentFormat: 'relation', renderComponent: null },
  { id: 'SEC-META-028', name: 'Content Score', group: 'META', description: 'Quality/completeness score (0-100)', storageTier: 'core_property', propertyType: 'number', contentFormat: 'score', renderComponent: null },
  { id: 'SEC-META-029', name: 'SEO Score', group: 'META', description: 'SEO optimization score (0-100)', storageTier: 'core_property', propertyType: 'number', contentFormat: 'score', renderComponent: null },
  { id: 'SEC-META-030', name: 'Batch ID', group: 'META', description: 'Bulk publish batch identifier', storageTier: 'core_property', propertyType: 'rich_text', contentFormat: 'batch_id', renderComponent: null },
  { id: 'SEC-META-031', name: 'Generation Prompt', group: 'META', description: 'AI prompt used to generate article', storageTier: 'page_body', propertyType: null, contentFormat: 'prompt', renderComponent: null },
  { id: 'SEC-META-032', name: 'Notes', group: 'META', description: 'Internal notes and reminders', storageTier: 'page_body', propertyType: null, contentFormat: 'notes', renderComponent: null },
];

// ============================================================================
// INCLUSION RULES MATRIX — Content Type → Group → Level
// R=required, RC=recommended, O=optional, N=not_applicable
// ============================================================================
const R = 'required', RC = 'recommended', O = 'optional', N = 'not_applicable';

export const INCLUSION_RULES = {
  'CT-01': { FND: R, FNC: R, FTR: RC, BEN: R, USE: R, USR: RC, OUT: RC, STR: RC, CMP: O, PRC: RC, BST: R, FUT: RC, RSK: RC, ECO: O, 'PRC$': O, TEC: RC, SEO: R, DAT: R, QST: R, META: R },
  'CT-02': { FND: RC, FNC: RC, FTR: O, BEN: O, USE: RC, USR: O, OUT: O, STR: O, CMP: N, PRC: R, BST: R, FUT: N, RSK: O, ECO: O, 'PRC$': N, TEC: RC, SEO: R, DAT: R, QST: R, META: R },
  'CT-03': { FND: RC, FNC: RC, FTR: R, BEN: RC, USE: RC, USR: RC, OUT: O, STR: O, CMP: R, PRC: O, BST: O, FUT: O, RSK: O, ECO: RC, 'PRC$': R, TEC: RC, SEO: R, DAT: R, QST: R, META: R },
  'CT-04': { FND: RC, FNC: O, FTR: R, BEN: RC, USE: RC, USR: O, OUT: O, STR: N, CMP: RC, PRC: O, BST: RC, FUT: O, RSK: N, ECO: O, 'PRC$': RC, TEC: O, SEO: R, DAT: R, QST: RC, META: R },
  'CT-05': { FND: O, FNC: O, FTR: O, BEN: RC, USE: R, USR: R, OUT: R, STR: RC, CMP: O, PRC: R, BST: RC, FUT: O, RSK: RC, ECO: O, 'PRC$': O, TEC: O, SEO: R, DAT: R, QST: RC, META: R },
  'CT-06': { FND: RC, FNC: O, FTR: RC, BEN: O, USE: O, USR: O, OUT: O, STR: N, CMP: O, PRC: N, BST: N, FUT: RC, RSK: O, ECO: O, 'PRC$': O, TEC: O, SEO: R, DAT: R, QST: O, META: R },
  'CT-07': { FND: RC, FNC: O, FTR: O, BEN: O, USE: O, USR: RC, OUT: O, STR: R, CMP: O, PRC: O, BST: RC, FUT: R, RSK: RC, ECO: O, 'PRC$': N, TEC: O, SEO: R, DAT: R, QST: RC, META: R },
  'CT-08': { FND: RC, FNC: RC, FTR: R, BEN: RC, USE: RC, USR: RC, OUT: RC, STR: O, CMP: R, PRC: RC, BST: O, FUT: O, RSK: RC, ECO: RC, 'PRC$': R, TEC: RC, SEO: R, DAT: R, QST: R, META: R },
  'CT-09': { FND: R, FNC: RC, FTR: O, BEN: O, USE: O, USR: O, OUT: N, STR: N, CMP: O, PRC: N, BST: N, FUT: N, RSK: N, ECO: O, 'PRC$': N, TEC: O, SEO: R, DAT: R, QST: R, META: R },
  'CT-10': { FND: RC, FNC: O, FTR: O, BEN: O, USE: O, USR: O, OUT: N, STR: N, CMP: O, PRC: O, BST: O, FUT: N, RSK: O, ECO: N, 'PRC$': O, TEC: O, SEO: R, DAT: R, QST: R, META: R },
  'CT-11': { FND: RC, FNC: RC, FTR: R, BEN: RC, USE: R, USR: RC, OUT: O, STR: O, CMP: RC, PRC: R, BST: R, FUT: O, RSK: O, ECO: R, 'PRC$': R, TEC: RC, SEO: R, DAT: R, QST: R, META: R },
  'CT-12': { FND: R, FNC: RC, FTR: O, BEN: R, USE: R, USR: R, OUT: R, STR: R, CMP: O, PRC: R, BST: R, FUT: RC, RSK: RC, ECO: O, 'PRC$': O, TEC: O, SEO: R, DAT: R, QST: R, META: R },
  'CT-13': { FND: RC, FNC: R, FTR: R, BEN: O, USE: RC, USR: RC, OUT: O, STR: O, CMP: O, PRC: R, BST: R, FUT: O, RSK: RC, ECO: RC, 'PRC$': O, TEC: R, SEO: R, DAT: R, QST: R, META: R },
  'CT-14': { FND: R, FNC: RC, FTR: RC, BEN: O, USE: O, USR: O, OUT: O, STR: RC, CMP: O, PRC: O, BST: O, FUT: R, RSK: R, ECO: RC, 'PRC$': O, TEC: RC, SEO: R, DAT: R, QST: R, META: R },
};

// ============================================================================
// COMPUTED TIER FILTERS
// ============================================================================
export const CORE_PROPERTY_SECTIONS = SECTIONS.filter(s => s.storageTier === 'core_property');
export const PAGE_BODY_SECTIONS = SECTIONS.filter(s => s.storageTier === 'page_body');
export const LINKED_DB_SECTIONS = SECTIONS.filter(s => s.storageTier === 'linked_database');

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
export function getSection(sectionId) {
  return SECTIONS.find(s => s.id === sectionId);
}

export function getSectionsByGroup(groupId) {
  return SECTIONS.filter(s => s.group === groupId);
}

export function getSectionsForContentType(contentTypeId, levels = ['required', 'recommended', 'optional']) {
  const rules = INCLUSION_RULES[contentTypeId];
  if (!rules) return [];
  const result = [];
  for (const [groupId, level] of Object.entries(rules)) {
    if (levels.includes(level)) {
      for (const section of getSectionsByGroup(groupId)) {
        result.push({ ...section, inclusionLevel: level });
      }
    }
  }
  return result;
}

export function getRequiredSections(contentTypeId) {
  return getSectionsForContentType(contentTypeId, ['required']);
}

export function getRecommendedSections(contentTypeId) {
  return getSectionsForContentType(contentTypeId, ['recommended']);
}

export function getNotionPropertySchema() {
  const schema = {};
  for (const section of CORE_PROPERTY_SECTIONS) {
    const propName = section.name;
    switch (section.propertyType) {
      case 'title': schema[propName] = { title: {} }; break;
      case 'rich_text': schema[propName] = { rich_text: {} }; break;
      case 'select': schema[propName] = { select: { options: [] } }; break;
      case 'multi_select': schema[propName] = { multi_select: { options: [] } }; break;
      case 'number': schema[propName] = { number: { format: 'number' } }; break;
      case 'date': schema[propName] = { date: {} }; break;
      case 'url': schema[propName] = { url: {} }; break;
      case 'people': schema[propName] = { people: {} }; break;
      case 'relation': schema[propName] = { relation: { database_id: null, single_property: {} } }; break;
      default: schema[propName] = { rich_text: {} };
    }
  }
  return schema;
}

export function getPageBodyTemplate(contentTypeId) {
  const sections = getSectionsForContentType(contentTypeId, ['required', 'recommended']);
  const bodyOnly = sections.filter(s => s.storageTier === 'page_body');
  const grouped = {};
  for (const section of bodyOnly) {
    if (!grouped[section.group]) grouped[section.group] = [];
    grouped[section.group].push(section);
  }
  return grouped;
}

export function getArea(areaId) { return AREAS.find(a => a.id === areaId); }
export function getContentType(contentTypeId) { return CONTENT_TYPES[contentTypeId]; }

export function countByTier() {
  return {
    core_property: CORE_PROPERTY_SECTIONS.length,
    page_body: PAGE_BODY_SECTIONS.length,
    linked_database: LINKED_DB_SECTIONS.length,
    total: SECTIONS.length,
  };
}

export function validateContentType(contentTypeId) {
  const rules = INCLUSION_RULES[contentTypeId];
  if (!rules) return { valid: false, error: `Unknown content type: ${contentTypeId}` };
  const warnings = [];
  for (const [groupId, level] of Object.entries(rules)) {
    if (level === 'required') {
      if (!GROUPS[groupId]) warnings.push(`Missing group definition: ${groupId}`);
      if (getSectionsByGroup(groupId).length === 0) warnings.push(`No sections for required group: ${groupId}`);
    }
  }
  return { valid: warnings.length === 0, warnings };
}

export function getLibrarySummary() {
  return {
    totalSections: SECTIONS.length,
    totalGroups: Object.keys(GROUPS).length,
    totalContentTypes: Object.keys(CONTENT_TYPES).length,
    totalAreas: AREAS.length,
    tierBreakdown: countByTier(),
    groups: Object.entries(GROUPS).map(([id, g]) => ({ id, name: g.name, expected: g.count, actual: getSectionsByGroup(id).length })),
  };
}
