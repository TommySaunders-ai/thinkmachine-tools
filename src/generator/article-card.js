/**
 * Article Card Component
 *
 * Renders article preview cards for area landing pages and the Areas home.
 * Uses Carbon Design System card patterns.
 */

export function renderArticleCard(article, tokens, options = {}) {
  const { showArea = false, linkBase = '' } = options;
  const slug = article.urlSlug || article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const href = linkBase ? `${linkBase}/${slug}` : slug;

  return `<div class="bx--article-card" style="background:${tokens.surface};border:1px solid ${tokens.border};border-radius:4px;overflow:hidden;transition:box-shadow 0.15s">
  ${article.thumbnailImage || article.featuredImage
    ? `<div style="height:180px;overflow:hidden"><img src="${esc(article.thumbnailImage || article.featuredImage)}" alt="${esc(article.title)}" style="width:100%;height:100%;object-fit:cover"></div>`
    : `<div style="height:180px;background:${tokens.interactive}11;display:flex;align-items:center;justify-content:center"><span style="font-size:2rem;opacity:0.3">${esc((article.areaOfIO || '').charAt(0) || 'IO')}</span></div>`}
  <div style="padding:1.25rem">
    ${showArea && article.areaOfIO ? `<span style="color:${tokens.interactive};font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em">${esc(article.areaOfIO)}</span>` : ''}
    <h3 style="font-size:1.125rem;font-weight:600;margin:0.25rem 0 0.5rem;color:${tokens.text}">
      <a href="${esc(href)}" style="color:inherit;text-decoration:none">${esc(article.title)}</a>
    </h3>
    ${article.primaryDefinition ? `<p style="font-size:0.875rem;color:${tokens.text};opacity:0.8;margin-bottom:0.75rem;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden">${esc(article.primaryDefinition)}</p>` : ''}
    <div style="display:flex;gap:1rem;font-size:0.75rem;color:${tokens.text};opacity:0.6">
      ${article.readingTime ? `<span>${article.readingTime} min</span>` : ''}
      ${article.difficulty ? `<span>${esc(article.difficulty)}</span>` : ''}
      ${article.contentType ? `<span>${esc(article.contentType)}</span>` : ''}
    </div>
  </div>
</div>`;
}

/**
 * Render a grid of article cards.
 */
export function renderArticleCardGrid(articles, tokens, options = {}) {
  if (!articles || articles.length === 0) {
    return `<p style="color:${tokens.text};opacity:0.6;text-align:center;padding:3rem 0">No articles yet. Content is coming soon.</p>`;
  }
  const cards = articles.map(a => renderArticleCard(a, tokens, options)).join('\n');
  return `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.5rem">
${cards}
</div>`;
}

function esc(text) {
  return String(text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
