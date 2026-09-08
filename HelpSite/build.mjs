import { mkdir, readFile, rm, writeFile, readdir, stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { config, url } from './config.mjs'
import { loadContent, helpRoot } from './lib/content.mjs'
import { renderArticle, toPlainText } from './lib/render.mjs'
import { articlePage, homePage, notFoundPage } from './lib/templates.mjs'
import { iconSvg } from './src/mark.mjs'
import { validate } from './lib/validate.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const dist = path.join(here, 'dist')
const src = path.join(here, 'src')

// The favicon is the brand board's application icon: the mark in mint on an
// ink tile, drawn from the same geometry as everything else.
const favicon = iconSvg()

export async function build({ quiet = false } = {}) {
  const log = (...args) => {
    if (!quiet) console.log(...args)
  }

  const content = await loadContent()
  log(`Reading ${content.articles.length} articles from ${path.relative(here, helpRoot)}`)

  // Render every article once; the result feeds the pages, the search index
  // and the validation, so nothing is parsed twice.
  const rendered = new Map()
  for (const article of content.articles) {
    const output = renderArticle(article)
    const plain = toPlainText(article.markdown)
    article.summary = summarise(plain, article.title)
    rendered.set(article.slug, { ...output, plain })
  }

  // What the image tree actually holds, so validation can fail on an article
  // that points at a screenshot nobody has taken.
  content.images = await collectImages(path.join(helpRoot, 'images'))

  const problems = validate(content, rendered)
  if (problems.length) {
    console.error(`\nBuild validation failed with ${problems.length} problem(s):\n`)
    for (const problem of problems) console.error('  -', problem)
    throw new Error('help site validation failed')
  }

  await rm(dist, { recursive: true, force: true })
  await mkdir(path.join(dist, 'assets'), { recursive: true })

  const pages = []

  // Home.
  pages.push(['index.html', homePage(content.sections, content)])

  // Articles, each at its own clean directory route.
  for (const article of content.articles) {
    pages.push([
      path.join(article.slug, 'index.html'),
      articlePage(article, rendered.get(article.slug), content.sections),
    ])
  }

  // Not found. Written to 404.html, which every common static host picks up.
  pages.push(['404.html', notFoundPage(content.sections)])

  for (const [route, html] of pages) {
    const target = path.join(dist, route)
    await mkdir(path.dirname(target), { recursive: true })
    await writeFile(target, html, 'utf8')
  }

  // The search index. Only Help content goes in: nothing from the repository,
  // the engineering README, the tests or the app source.
  const index = content.articles.map((article) => {
    // The title is shown above the snippet, so it is trimmed off the indexed
    // body rather than repeated back to the reader in every result.
    const full = rendered.get(article.slug).plain
    const plain = full.startsWith(article.title) ? full.slice(article.title.length).trim() : full
    return {
      t: article.title,
      s: article.section,
      u: `${article.slug}/`,
      p: plain.slice(0, 1200),
    }
  })
  await writeFile(path.join(dist, 'assets', 'search-index.json'), JSON.stringify(index), 'utf8')

  // Screenshots and other illustrations, mirrored from the documents so an
  // article's relative image link resolves without anything being renamed.
  const imageCount = await copyImages(path.join(helpRoot, 'images'), path.join(dist, 'images'))
  if (imageCount) log(`Copied ${imageCount} image(s)`)

  await writeFile(path.join(dist, 'assets', 'theme.css'), await readFile(path.join(src, 'theme.css')))
  await writeFile(path.join(dist, 'assets', 'site.js'), await readFile(path.join(src, 'site.js')))
  await writeFile(path.join(dist, 'favicon.svg'), favicon, 'utf8')
  // While the site is in Preview it is reachable by URL but not offered to
  // search engines, and the sitemap is not advertised.
  const robots = config.allowIndexing
    ? `User-agent: *\nAllow: /\n${config.origin ? `Sitemap: ${config.origin.replace(/\/$/, '')}${url('sitemap.xml')}\n` : ''}`
    : 'User-agent: *\nDisallow: /\n'
  await writeFile(path.join(dist, 'robots.txt'), robots, 'utf8')

  if (config.origin && config.allowIndexing) {
    const urls = pages
      .filter(([route]) => route.endsWith('index.html'))
      .map(([route]) => route.replace(/index\.html$/, ''))
      .map((route) => `  <url><loc>${config.origin.replace(/\/$/, '')}${url(route)}</loc></url>`)
    await writeFile(
      path.join(dist, 'sitemap.xml'),
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`,
      'utf8',
    )
  }

  const size = await directorySize(dist)
  log(`Built ${pages.length} pages into ${path.relative(here, dist)}/ (${(size / 1024).toFixed(0)} KB)`)
  return { content, rendered, pages, size }
}

/** The first substantial sentence or two, for the page description. */
/**
 * The site routes of every publishable image under `Docs/Help/images`.
 */
async function collectImages(from, prefix = 'images') {
  const allowed = new Set(['.png', '.webp', '.jpg', '.jpeg', '.svg', '.gif'])
  const found = new Set()
  let entries
  try {
    entries = await readdir(from, { withFileTypes: true })
  } catch {
    return found
  }
  for (const entry of entries) {
    const route = `${prefix}/${entry.name}`
    if (entry.isDirectory()) {
      for (const nested of await collectImages(path.join(from, entry.name), route)) found.add(nested)
    } else if (allowed.has(path.extname(entry.name).toLowerCase())) {
      found.add(url(route))
    }
  }
  return found
}

/**
 * Copies the image tree verbatim. Only real image files travel: a stray
 * document or note left in the folder stays out of the published site.
 */
async function copyImages(from, to) {
  const allowed = new Set(['.png', '.webp', '.jpg', '.jpeg', '.svg', '.gif'])
  let copied = 0
  let entries
  try {
    entries = await readdir(from, { withFileTypes: true })
  } catch {
    return 0
  }
  await mkdir(to, { recursive: true })
  for (const entry of entries) {
    const source = path.join(from, entry.name)
    const target = path.join(to, entry.name)
    if (entry.isDirectory()) {
      copied += await copyImages(source, target)
    } else if (allowed.has(path.extname(entry.name).toLowerCase())) {
      await writeFile(target, await readFile(source))
      copied += 1
    }
  }
  return copied
}

function summarise(plain, title) {
  const withoutTitle = plain.startsWith(title) ? plain.slice(title.length).trim() : plain
  const trimmed = withoutTitle.slice(0, 240)
  const stop = trimmed.lastIndexOf('. ')
  const text = stop > 90 ? trimmed.slice(0, stop + 1) : trimmed
  return text.length < withoutTitle.length && !text.endsWith('.') ? `${text.trim()}…` : text.trim()
}

async function directorySize(dir) {
  let total = 0
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) total += await directorySize(full)
    else total += (await stat(full)).size
  }
  return total
}

/* -------------------------------------------------------- local preview */

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
}

/**
 * A preview server for development only. It serves the built directory and
 * nothing else, on localhost. It is never part of the deployed site.
 */
function serve(port = 4321) {
  const server = createServer(async (request, response) => {
    const requested = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
    const base = config.basePath.replace(/\/$/, '')
    const relative = base && requested.startsWith(base) ? requested.slice(base.length) : requested
    let target = path.join(dist, relative)

    try {
      if ((await stat(target)).isDirectory()) target = path.join(target, 'index.html')
    } catch {
      target = path.join(dist, '404.html')
      response.statusCode = 404
    }

    // Never serve outside the built directory.
    if (!path.resolve(target).startsWith(path.resolve(dist))) {
      response.statusCode = 403
      response.end('Forbidden')
      return
    }

    try {
      const body = await readFile(target)
      response.setHeader('Content-Type', MIME[path.extname(target)] ?? 'application/octet-stream')
      response.end(body)
    } catch {
      response.statusCode = 404
      response.setHeader('Content-Type', 'text/html; charset=utf-8')
      response.end(await readFile(path.join(dist, '404.html')).catch(() => 'Not found'))
    }
  })
  server.listen(port, '127.0.0.1', () => {
    console.log(`\nOnceaway Help running at http://localhost:${port}${config.basePath}`)
    console.log('Press Ctrl+C to stop.\n')
  })
  return server
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = new Set(process.argv.slice(2))
  await build()

  if (args.has('--watch')) {
    const { watch } = await import('node:fs')
    let pending = null
    watch(helpRoot, { recursive: true }, () => {
      clearTimeout(pending)
      pending = setTimeout(() => build().catch((error) => console.error(error.message)), 120)
    })
    watch(src, { recursive: true }, () => {
      clearTimeout(pending)
      pending = setTimeout(() => build().catch((error) => console.error(error.message)), 120)
    })
    console.log('Watching Docs/Help and src for changes.')
  }
  if (args.has('--serve')) serve(Number(process.env.PORT) || 4321)
}
