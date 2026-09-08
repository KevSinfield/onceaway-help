import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { config } from '../config.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
export const helpRoot = path.resolve(here, '../../Docs/Help')

/**
 * Reads every article under Docs/Help and returns the model the whole site is
 * built from. The Markdown is the only source: nothing here duplicates a
 * title, a body or an ordering that already exists in a document.
 */
export async function loadContent() {
  const files = await markdownFiles(helpRoot)
  const articles = []

  for (const file of files) {
    const relative = path.relative(helpRoot, file)
    // The index is the table of contents for the repository, not an article.
    // The site builds its own home page, so it is read for nothing.
    if (relative === 'README.md') continue

    const raw = await readFile(file, 'utf8')
    const { front, body } = splitFrontMatter(raw, relative)
    const slug = relative.replace(/\.md$/, '')

    articles.push({
      slug,
      sourcePath: relative,
      dir: path.dirname(relative),
      title: front.title ?? firstHeading(body) ?? slug,
      section: front.section ?? sectionFromDirectory(path.dirname(relative)),
      order: Number.isFinite(Number(front.order)) ? Number(front.order) : 999,
      markdown: body,
    })
  }

  const sections = groupIntoSections(articles)
  // Reading order across the whole site, for previous/next.
  const reading = sections.flatMap((section) => section.articles)
  reading.forEach((article, index) => {
    article.previous = reading[index - 1] ?? null
    article.next = reading[index + 1] ?? null
  })

  return { articles, sections, bySlug: new Map(articles.map((a) => [a.slug, a])) }
}

async function markdownFiles(dir) {
  const found = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) found.push(...(await markdownFiles(full)))
    else if (entry.name.endsWith('.md')) found.push(full)
  }
  return found.sort()
}

/**
 * Front matter is a handful of `key: value` lines. A YAML parser would be a
 * dependency to read three keys, so this reads those three keys.
 */
function splitFrontMatter(raw, label) {
  if (!raw.startsWith('---\n')) return { front: {}, body: raw }
  const end = raw.indexOf('\n---', 4)
  if (end === -1) throw new Error(`${label}: front matter is not closed`)

  const front = {}
  for (const line of raw.slice(4, end).split('\n')) {
    if (!line.trim()) continue
    const colon = line.indexOf(':')
    if (colon === -1) continue
    front[line.slice(0, colon).trim()] = line.slice(colon + 1).trim()
  }
  return { front, body: raw.slice(end + 4).replace(/^\n+/, '') }
}

function firstHeading(body) {
  const match = body.match(/^#\s+(.+)$/m)
  return match ? match[1].trim() : null
}

function sectionFromDirectory(dir) {
  return dir
    .split('/')
    .pop()
    .split('-')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Sections come out in the configured order, and articles inside them in the
 * order their own front matter asks for. Alphabetical ordering would destroy
 * a deliberate learning sequence, so it is never used as a primary key.
 */
function groupIntoSections(articles) {
  const byName = new Map()
  for (const article of articles) {
    if (!byName.has(article.section)) byName.set(article.section, [])
    byName.get(article.section).push(article)
  }

  const known = config.sectionOrder.filter((name) => byName.has(name))
  const unknown = [...byName.keys()].filter((name) => !config.sectionOrder.includes(name)).sort()

  return [...known, ...unknown].map((name) => ({
    name,
    slug: byName.get(name)[0].dir,
    blurb: config.sectionBlurbs[name] ?? '',
    articles: byName.get(name).sort((a, b) => a.order - b.order || a.title.localeCompare(b.title)),
  }))
}
