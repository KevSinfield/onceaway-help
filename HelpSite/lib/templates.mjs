import { config, url } from '../config.mjs'
import { markSvg } from '../src/mark.mjs'

export const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

/**
 * The Onceaway mark, from the shared geometry in `src/mark.mjs`. On light
 * surfaces the ring is ink and the dot is mint; on dark the ring becomes mint.
 * `currentColor` lets the stylesheet make that swap.
 */
export const mark = (size = 22) => markSvg({ size })

const lockup = () => `
<a class="lockup" href="${url('')}">
  ${mark(24)}
  <span class="lockup__text"><strong>${escapeHtml(config.wordmarkTail)}</strong> Help</span>
</a>`

const themeToggle = () => `
<button class="icon-button theme-toggle" type="button" id="theme-toggle"
        aria-label="Switch between light and dark appearance">
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" class="theme-toggle__sun">
    <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <g stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
      <path d="M12 2.6v2.6M12 18.8v2.6M2.6 12h2.6M18.8 12h2.6M5.4 5.4l1.8 1.8M16.8 16.8l1.8 1.8M18.6 5.4l-1.8 1.8M7.2 16.8l-1.8 1.8"/>
    </g>
  </svg>
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" class="theme-toggle__moon">
    <path d="M20 14.2A8.4 8.4 0 0 1 9.8 4a8.4 8.4 0 1 0 10.2 10.2Z" fill="none"
          stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
  </svg>
  <span class="theme-toggle__label" aria-hidden="true"></span>
</button>`

const searchTrigger = () => `
<button class="search-trigger" type="button" id="search-trigger"
        aria-label="Search help" aria-haspopup="dialog">
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <circle cx="10.8" cy="10.8" r="6.2" fill="none" stroke="currentColor" stroke-width="1.9"/>
    <path d="m15.6 15.6 4 4" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>
  </svg>
  <span class="search-trigger__label">Search help</span>
  <kbd class="search-trigger__key"><span class="key-mod">⌘</span>K</kbd>
</button>`

/** The search dialog. Everything it needs is already in the page. */
const searchDialog = () => `
<div class="search-overlay" id="search-overlay" hidden>
  <div class="search-panel" role="dialog" aria-modal="true" aria-label="Search help">
    <div class="search-panel__field">
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="10.8" cy="10.8" r="6.2" fill="none" stroke="currentColor" stroke-width="1.9"/>
        <path d="m15.6 15.6 4 4" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>
      </svg>
      <input type="search" id="search-input" autocomplete="off" spellcheck="false"
             placeholder="Search help" aria-label="Search help"
             aria-controls="search-results" aria-describedby="search-hint">
      <button class="icon-button search-panel__close" type="button" id="search-close"
              aria-label="Close search">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="m6.6 6.6 10.8 10.8M17.4 6.6 6.6 17.4" stroke="currentColor"
                stroke-width="1.9" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
    <p class="search-panel__hint" id="search-hint">
      Searching happens in your browser. Nothing you type is sent anywhere.
    </p>
    <div class="search-results" id="search-results" role="listbox"
         aria-label="Search results"></div>
  </div>
</div>`

const banner = () => {
  if (!config.banner.show) return ''
  return `
<div class="banner" id="preview-banner">
  <p class="banner__text">
    <span class="banner__label">${escapeHtml(config.banner.label)}</span>
    ${escapeHtml(config.banner.text)}
  </p>
  <button class="icon-button banner__close" type="button" id="banner-close"
          aria-label="Hide this notice for now">
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="m6.6 6.6 10.8 10.8M17.4 6.6 6.6 17.4" stroke="currentColor"
            stroke-width="1.9" stroke-linecap="round"/>
    </svg>
  </button>
</div>`
}

const sidebar = (sections, currentSlug) => `
<nav class="sidebar" id="sidebar" aria-label="Help sections">
  ${sections
    .map((section) => {
      const open = section.articles.some((a) => a.slug === currentSlug)
      return `
  <section class="nav-group">
    <h2 class="nav-group__title">${escapeHtml(section.name)}</h2>
    <ul class="nav-list">
      ${section.articles
        .map((article) => {
          const current = article.slug === currentSlug
          return `<li><a class="nav-link${current ? ' is-current' : ''}"
             href="${url(`${article.slug}/`)}"${current ? ' aria-current="page"' : ''}
             >${escapeHtml(article.title)}</a></li>`
        })
        .join('\n      ')}
    </ul>
  </section>`
    })
    .join('\n  ')}
</nav>`

const footer = () => `
<footer class="footer">
  <div class="footer__inner">
    <p class="footer__brand">${mark(18)} <strong>${escapeHtml(config.wordmarkTail)}</strong> Help</p>
    <p class="footer__tagline">${escapeHtml(config.tagline)}</p>
  </div>
</footer>`

/**
 * The page shell. The theme is applied by a tiny inline script before the body
 * paints, so a reader who prefers dark never gets a white flash.
 */
export function page({ title, description, bodyClass = '', main, sections, currentSlug, route }) {
  const fullTitle = title === config.siteName ? config.siteName : `${title} — ${config.siteName}`
  const canonical = config.origin ? `${config.origin.replace(/\/$/, '')}${url(route)}` : ''

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(fullTitle)}</title>
<meta name="description" content="${escapeHtml(description)}">
${canonical ? `<link rel="canonical" href="${escapeHtml(canonical)}">` : ''}
<meta property="og:type" content="article">
<meta property="og:site_name" content="${escapeHtml(config.siteName)}">
<meta property="og:title" content="${escapeHtml(fullTitle)}">
<meta property="og:description" content="${escapeHtml(description)}">
${canonical ? `<meta property="og:url" content="${escapeHtml(canonical)}">` : ''}
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#F4F3EF" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#14171C" media="(prefers-color-scheme: dark)">
<link rel="icon" href="${url('favicon.svg')}" type="image/svg+xml">
<link rel="stylesheet" href="${url('assets/theme.css')}">
<script>
  // Applied before first paint so dark never flashes white.
  try {
    var saved = localStorage.getItem('onceaway-help-theme')
    if (saved === 'dark' || saved === 'light') document.documentElement.dataset.theme = saved
  } catch (e) {}
</script>
</head>
<body class="${bodyClass}">
<a class="skip-link" href="#main">Skip to content</a>
${banner()}
<header class="header">
  <div class="header__inner">
    ${lockup()}
    <div class="header__actions">
      ${searchTrigger()}
      ${themeToggle()}
      <button class="icon-button nav-toggle" type="button" id="nav-toggle"
              aria-label="Browse help" aria-expanded="false" aria-controls="sidebar">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M4.5 7h15M4.5 12h15M4.5 17h15" stroke="currentColor"
                stroke-width="1.9" stroke-linecap="round"/>
        </svg>
        <span class="nav-toggle__label">Browse help</span>
      </button>
    </div>
  </div>
</header>
${searchDialog()}
<div class="canvas">
  <div class="workspace">
    ${sections ? sidebar(sections, currentSlug) : ''}
    <main class="content" id="main" tabindex="-1">
${main}
    </main>
  </div>
</div>
${footer()}
<div class="nav-scrim" id="nav-scrim" hidden></div>
<script src="${url('assets/site.js')}" defer></script>
</body>
</html>
`
}

/** Breadcrumb trail: Help / Section / Article. */
const breadcrumbs = (article) => `
<nav class="breadcrumbs" aria-label="Breadcrumb">
  <ol>
    <li><a href="${url('')}">Help</a></li>
    <li><span aria-hidden="true">/</span> ${escapeHtml(article.section)}</li>
    <li class="breadcrumbs__current"><span aria-hidden="true">/</span>
      <span aria-current="page">${escapeHtml(article.title)}</span></li>
  </ol>
</nav>`

const tableOfContents = (headings) => {
  if (headings.length < 2) return ''
  return `
<aside class="toc" aria-labelledby="toc-title">
  <h2 class="toc__title" id="toc-title">On this page</h2>
  <ul class="toc__list">
    ${headings
      .map(
        (h) =>
          `<li class="toc__item toc__item--h${h.level}"><a href="#${h.id}">${escapeHtml(h.text)}</a></li>`,
      )
      .join('\n    ')}
  </ul>
</aside>`
}

const pager = (article) => {
  if (!article.previous && !article.next) return ''
  const link = (target, direction, label) =>
    target
      ? `<a class="pager__link pager__link--${direction}" href="${url(`${target.slug}/`)}">
        <span class="pager__label">${label}</span>
        <span class="pager__title">${escapeHtml(target.title)}</span>
      </a>`
      : '<span></span>'
  return `
<nav class="pager" aria-label="Article navigation">
  ${link(article.previous, 'prev', 'Previous')}
  ${link(article.next, 'next', 'Next')}
</nav>`
}

/** An article page. */
export function articlePage(article, rendered, sections) {
  const isPhilosophy = config.philosophyArticles.includes(article.slug)
  const main = `
${breadcrumbs(article)}
<div class="article-layout">
  <article class="article${isPhilosophy ? ' article--essay' : ''}">
    <header class="article__header">
      <p class="article__eyebrow">${escapeHtml(article.section)}</p>
      <h1 class="article__title">${escapeHtml(article.title)}</h1>
    </header>
    <div class="prose">
${rendered.html}
    </div>
    ${pager(article)}
  </article>
  ${tableOfContents(rendered.headings)}
</div>`

  return page({
    title: article.title,
    description: article.summary,
    bodyClass: 'page-article',
    main,
    sections,
    currentSlug: article.slug,
    route: `${article.slug}/`,
  })
}

/** The home page. */
export function homePage(sections, content) {
  const cards = config.homeCards
    .map((name) => sections.find((section) => section.name === name))
    .filter(Boolean)

  const starting = config.usefulStartingPoints
    .map((slug) => content.bySlug.get(slug))
    .filter(Boolean)

  const main = `
<div class="home">
  <section class="hero">
    <h1 class="hero__title">How can we help?</h1>
    <p class="hero__subtitle">Find answers about setup, privacy, Patterns, AI, Insights and Assist.</p>
    <button class="hero__search" type="button" id="hero-search" aria-label="Search help">
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="10.8" cy="10.8" r="6.2" fill="none" stroke="currentColor" stroke-width="1.9"/>
        <path d="m15.6 15.6 4 4" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>
      </svg>
      <span>Search help</span>
      <kbd><span class="key-mod">⌘</span>K</kbd>
    </button>
    <p class="hero__note">${escapeHtml(config.tagline)} ${escapeHtml(config.productName)} notices work
      you repeat and helps you understand what might be worth reducing.</p>
  </section>

  <section class="cards" aria-labelledby="browse-title">
    <h2 class="section-title" id="browse-title">Browse help</h2>
    <div class="cards__grid">
      ${cards
        .map(
          (section) => `
      <a class="card" href="${url(`${section.articles[0].slug}/`)}">
        <h3 class="card__title">${escapeHtml(section.name)}</h3>
        <p class="card__blurb">${escapeHtml(section.blurb)}</p>
        <p class="card__count">${section.articles.length} article${section.articles.length === 1 ? '' : 's'}</p>
      </a>`,
        )
        .join('')}
    </div>
  </section>

  <section class="starting" aria-labelledby="starting-title">
    <h2 class="section-title" id="starting-title">Useful starting points</h2>
    <ul class="starting__list">
      ${starting
        .map(
          (article) => `
      <li><a class="starting__link" href="${url(`${article.slug}/`)}">
        <span class="starting__title">${escapeHtml(article.title)}</span>
        <span class="starting__section">${escapeHtml(article.section)}</span>
      </a></li>`,
        )
        .join('')}
    </ul>
  </section>
</div>`

  return page({
    title: config.siteName,
    description:
      'Help and answers for Onceaway: setup, privacy, Patterns, Opportunities, AI, Insights and Assist.',
    bodyClass: 'page-home',
    main,
    sections,
    currentSlug: null,
    route: '',
  })
}

/** The not-found page. */
export function notFoundPage(sections) {
  const main = `
<div class="notfound">
  <h1 class="notfound__title">We couldn't find that help article.</h1>
  <p class="notfound__text">It may have moved, or the link may be incomplete.</p>
  <div class="notfound__actions">
    <button class="button button--primary" type="button" id="notfound-search">Search help</button>
    <a class="button" href="${url('')}">Back to Help home</a>
  </div>
</div>`

  return page({
    title: 'Page not found',
    description: 'That help article could not be found.',
    bodyClass: 'page-notfound',
    main,
    sections,
    currentSlug: null,
    route: '404.html',
  })
}
