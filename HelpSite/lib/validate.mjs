import { config, url } from '../config.mjs'
import { rewriteLink } from './render.mjs'

/**
 * Build-time checks. The build fails rather than publishing a site with a
 * broken link, a duplicate route, an orphaned article, or an engineering term
 * that should never have reached a reader.
 */
export function validate(content, rendered) {
  const problems = []
  const { articles, sections, bySlug } = content

  if (!articles.length) problems.push('no articles were found under Docs/Help')

  /* Routes are unique and well formed. */
  const routes = new Map()
  for (const article of articles) {
    const route = `${article.slug}/`
    if (routes.has(route)) {
      problems.push(`duplicate route ${route} from ${article.sourcePath} and ${routes.get(route)}`)
    }
    routes.set(route, article.sourcePath)

    if (!/^[a-z0-9/-]+$/.test(article.slug)) {
      problems.push(`${article.sourcePath}: route "${article.slug}" is not URL friendly`)
    }
  }

  /* Titles are unique enough to tell apart in search results. */
  const titles = new Map()
  for (const article of articles) {
    const key = article.title.toLowerCase()
    if (titles.has(key)) {
      problems.push(`duplicate title "${article.title}" in ${article.sourcePath} and ${titles.get(key)}`)
    }
    titles.set(key, article.sourcePath)
  }

  /* Every article belongs to a section that appears in the navigation. */
  const navSlugs = new Set(sections.flatMap((s) => s.articles.map((a) => a.slug)))
  for (const article of articles) {
    if (!navSlugs.has(article.slug)) {
      problems.push(`${article.sourcePath} is orphaned: it appears in no navigation section`)
    }
    if (!article.section) problems.push(`${article.sourcePath} has no section`)
    if (!article.title) problems.push(`${article.sourcePath} has no title`)
  }

  /* Configured routes point at articles that exist. */
  for (const slug of [...config.usefulStartingPoints, ...config.philosophyArticles]) {
    if (!bySlug.has(slug)) problems.push(`config references a missing article: ${slug}`)
  }

  /* Every internal link resolves to a real route after rewriting. */
  const valid = new Set([...routes.keys()].map((route) => url(route)))
  valid.add(url(''))
  for (const article of articles) {
    for (const href of internalLinks(article)) {
      const rewritten = rewriteLink(href, article).split('#')[0]
      if (!valid.has(rewritten)) {
        problems.push(`${article.sourcePath}: link "${href}" does not resolve (became "${rewritten}")`)
      }
    }
  }

  /* Anchor links point at a heading that exists in the target article. */
  const headingsBySlug = new Map(
    [...rendered.entries()].map(([slug, output]) => [slug, new Set(output.headings.map((h) => h.id))]),
  )
  for (const article of articles) {
    for (const href of internalLinks(article)) {
      const [target, hash] = href.split('#')
      if (!hash) continue
      const route = rewriteLink(target || './', article)
      const slug = [...routes.keys()].find((r) => url(r) === route)
      if (!slug) continue
      const headings = headingsBySlug.get(slug.replace(/\/$/, ''))
      if (headings && !headings.has(hash)) {
        problems.push(`${article.sourcePath}: anchor "#${hash}" does not exist in ${slug}`)
      }
    }
  }

  /* Every article reaches the search index. */
  for (const article of articles) {
    const output = rendered.get(article.slug)
    if (!output) problems.push(`${article.sourcePath} produced no rendered output`)
    else if (!output.plain.trim()) problems.push(`${article.sourcePath} has no searchable text`)
  }

  /* Nothing internal to the project may appear in a page a reader can open. */
  const FORBIDDEN = [
    'ProjectObserver',
    'PatternStructuralKey',
    'ActivityEvent',
    'FSEvents',
    'user_version',
    'Levenshtein',
    'com.projectobserver',
    '/Users/',
    'Project Observer',
  ]
  const TASK_REFERENCE = /\bTask\s+\d+\b/
  for (const article of articles) {
    const html = rendered.get(article.slug)?.html ?? ''
    const haystack = `${article.title}\n${html}`
    for (const term of FORBIDDEN) {
      if (haystack.includes(term)) {
        problems.push(`${article.sourcePath}: generated page contains internal term "${term}"`)
      }
    }
    if (TASK_REFERENCE.test(haystack)) {
      problems.push(`${article.sourcePath}: generated page references an internal task number`)
    }
  }

  return problems
}

/** Relative Markdown links in an article, excluding external and pure anchors. */
function internalLinks(article) {
  const found = []
  const pattern = /\[[^\]]*\]\(([^)\s]+)\)/g
  let match
  while ((match = pattern.exec(article.markdown))) {
    const href = match[1]
    if (/^(https?:|mailto:|#)/i.test(href)) continue
    found.push(href)
  }
  return found
}
