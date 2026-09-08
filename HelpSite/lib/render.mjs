import MarkdownIt from 'markdown-it'
import { url } from '../config.mjs'

/**
 * Markdown rendering.
 *
 * Raw HTML is disabled outright (`html: false`). The articles are plain
 * Markdown and have no need for it, and turning it off means no document can
 * inject markup into a page — the simplest possible answer to sanitising.
 */
const md = new MarkdownIt({
  html: false,
  linkify: false,
  typographer: true,
  breaks: false,
})

/** Words that stay lower case in a heading anchor without becoming noise. */
export function slugifyHeading(text) {
  return text
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Turns an article's Markdown into the HTML the page renders, and collects
 * the headings for the "On this page" rail on the way through.
 *
 * Relative links between documents (`../ai/is-ai-required.md`) are rewritten
 * to site routes, so Task 26's link structure keeps working without editing a
 * single source file.
 */
export function renderArticle(article) {
  const env = {}
  const parsed = md.parse(article.markdown, env)

  // The H1 is rendered by the page template as the article title, so its
  // tokens are removed rather than hidden: markdown-it's inline renderer does
  // not honour `hidden`, so hiding the heading would leave its text behind as
  // a stray paragraph.
  const tokens = []
  for (let i = 0; i < parsed.length; i += 1) {
    if (parsed[i].type === 'heading_open' && parsed[i].tag === 'h1') {
      i += 2
      continue
    }
    tokens.push(parsed[i])
  }

  const headings = []
  const used = new Map()

  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i]

    if (token.type === 'heading_open') {
      const text = tokens[i + 1]?.content ?? ''
      const level = Number(token.tag.slice(1))
      let id = slugifyHeading(text)
      if (used.has(id)) {
        const next = used.get(id) + 1
        used.set(id, next)
        id = `${id}-${next}`
      } else {
        used.set(id, 1)
      }
      token.attrSet('id', id)
      token.attrJoin('class', 'heading')
      if (level === 2 || level === 3) headings.push({ id, text, level })
    }

    if (token.type === 'inline' && token.children) {
      for (const child of token.children) {
        if (child.type === 'image') {
          child.attrSet('src', rewriteAsset(child.attrGet('src'), article))
          child.attrSet('loading', 'lazy')
          child.attrSet('decoding', 'async')
          continue
        }
        if (child.type !== 'link_open') continue
        const href = child.attrGet('href')
        child.attrSet('href', rewriteLink(href, article))
        if (/^https?:/i.test(href)) {
          child.attrSet('rel', 'noopener noreferrer')
        }
      }
    }
  }

  let html = md.renderer.render(tokens, md.options, env)
  html = decorateStatusChips(html)
  html = markScreenshotPlaceholders(html)
  html = wrapScreenshots(html)
  return { html, headings }
}

/**
 * `../ai/is-ai-required.md` → `/ai/is-ai-required`, with the site's base path
 * applied. External links, anchors and mail links are left alone.
 */
export function rewriteLink(href, article) {
  if (!href || /^(https?:|mailto:|#)/i.test(href)) return href

  const [target, hash] = href.split('#')
  if (!target) return href

  const from = article.dir === '.' ? '' : article.dir
  const joined = new URL(target, `file:///${from}/`).pathname.replace(/^\/+/, '')
  const route = joined.replace(/\.md$/, '').replace(/\/README$/, '')

  // A link to the index means the home page.
  const path = route === 'README' || route === '' ? '' : `${route}/`
  return url(path) + (hash ? `#${hash}` : '')
}

/**
 * `../images/ai/anthropic/keys.png` → `/images/ai/anthropic/keys.png`, with the
 * site's base path applied. Unlike an article link this keeps the extension
 * and gains no trailing slash: it is a file, not a route.
 */
export function rewriteAsset(src, article) {
  if (!src || /^(https?:|data:)/i.test(src)) return src
  const from = article.dir === '.' ? '' : article.dir
  const joined = new URL(src, `file:///${from}/`).pathname.replace(/^\/+/, '')
  return url(joined)
}

/**
 * A screenshot that has not been taken yet.
 *
 * Written in the Markdown as `> **Screenshot:** what it should show`, so the
 * source stays plain Markdown and reads sensibly on its own. It renders as a
 * labelled slot rather than a broken image, which is honest about the state of
 * the guide: the words are complete, the picture is not.
 *
 * When a real capture arrives the line becomes an ordinary Markdown image and
 * this stops applying to it.
 */
function markScreenshotPlaceholders(html) {
  return html.replace(
    /<blockquote>\s*<p><strong>Screenshot:<\/strong>([\s\S]*?)<\/p>\s*<\/blockquote>/g,
    (_match, description) =>
      `<figure class="shot shot--pending"><div class="shot__frame" aria-hidden="true">` +
      `<span class="shot__label">Screenshot to come</span></div>` +
      `<figcaption class="shot__caption">${description.trim()}</figcaption></figure>`,
  )
}

/**
 * The articles mark future capability in bold — **Planned**, **Not available
 * yet**. Those become quiet chips so a reader scanning the page cannot mistake
 * a planned feature for a live one. The text is left exactly as written, so
 * the meaning never depends on the styling arriving.
 */
function decorateStatusChips(html) {
  return html.replace(
    /<strong>(Planned|Not available yet)([.:]?)<\/strong>/g,
    (_match, label, trailing) =>
      `<strong class="chip chip--planned"><span class="chip__dot" aria-hidden="true"></span>${label}</strong>${trailing}`,
  )
}

/**
 * A standalone image in an article is a step illustration: it gets a frame and
 * its alt text becomes the caption, so the picture and its description travel
 * together.
 */
function wrapScreenshots(html) {
  return html.replace(
    /<p>(<img [^>]*alt="([^"]*)"[^>]*>)<\/p>/g,
    (_match, image, alt) =>
      `<figure class="shot"><div class="shot__frame">${image}</div>` +
      (alt ? `<figcaption class="shot__caption">${alt}</figcaption>` : '') +
      `</figure>`,
  )
}

/**
 * Plain text for the search index: Markdown syntax removed so a result
 * snippet never shows `###` or a raw link.
 */
export function toPlainText(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s{0,3}>\s?/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/^\s*\|.*\|\s*$/gm, (row) => row.replace(/\|/g, ' ').replace(/^[\s-]+$/, ''))
    .replace(/^\s*[-:| ]+\s*$/gm, ' ')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/^---$/gm, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export { md }
