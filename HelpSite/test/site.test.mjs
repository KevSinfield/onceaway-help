import { test, describe, before } from 'node:test'
import assert from 'node:assert/strict'
import { readFile, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from '../build.mjs'
import { config, url } from '../config.mjs'
import { rewriteLink, toPlainText, slugifyHeading } from '../lib/render.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const dist = path.resolve(here, '../dist')

let result

before(async () => {
  result = await build({ quiet: true })
})

const read = (route) => readFile(path.join(dist, route), 'utf8')

describe('content', () => {
  test('every article in Docs/Help becomes a page', async () => {
    const sourceCount = await countMarkdown(path.resolve(here, '../../Docs/Help'))
    // The repository index is not an article; the site builds its own home.
    assert.equal(result.content.articles.length, sourceCount - 1)
    assert.ok(result.content.articles.length >= 50, 'expected the full article set')
  })

  test('the Markdown is the only source of a title', () => {
    for (const article of result.content.articles) {
      assert.ok(article.title.length > 0, `${article.sourcePath} has no title`)
      assert.ok(article.section.length > 0, `${article.sourcePath} has no section`)
    }
  })

  test('sections appear in the configured order, articles in their own', () => {
    const names = result.content.sections.map((section) => section.name)
    const expected = config.sectionOrder.filter((name) => names.includes(name))
    assert.deepEqual(names, expected)

    for (const section of result.content.sections) {
      const orders = section.articles.map((article) => article.order)
      assert.deepEqual([...orders].sort((a, b) => a - b), orders, `${section.name} is out of order`)
    }
  })

  test('previous and next link the whole reading sequence together', () => {
    const reading = result.content.sections.flatMap((section) => section.articles)
    assert.equal(reading[0].previous, null)
    assert.equal(reading.at(-1).next, null)
    for (let i = 1; i < reading.length; i += 1) {
      assert.equal(reading[i].previous.slug, reading[i - 1].slug)
      assert.equal(reading[i - 1].next.slug, reading[i].slug)
    }
  })
})

describe('routes', () => {
  test('every article is written to a clean directory route', async () => {
    for (const article of result.content.articles) {
      const file = path.join(dist, article.slug, 'index.html')
      assert.ok((await stat(file)).isFile(), `${article.slug} did not build`)
    }
  })

  test('routes are unique', () => {
    const routes = result.content.articles.map((article) => article.slug)
    assert.equal(new Set(routes).size, routes.length)
  })

  test('routes carry no .html and no capitals', () => {
    for (const article of result.content.articles) {
      assert.doesNotMatch(article.slug, /\.html$/)
      assert.match(article.slug, /^[a-z0-9/-]+$/)
    }
  })

  test('home and not-found pages exist', async () => {
    assert.match(await read('index.html'), /How can we help\?/)
    assert.match(await read('404.html'), /We couldn't find that help article\./)
  })
})

describe('markdown link mapping', () => {
  test('a sibling link becomes a sibling route', () => {
    const article = { dir: 'ai', slug: 'ai/is-ai-required' }
    assert.equal(rewriteLink('what-does-onceaway-send-to-ai.md', article), url('ai/what-does-onceaway-send-to-ai/'))
  })

  test('a parent-relative link crosses sections', () => {
    const article = { dir: 'ai', slug: 'ai/is-ai-required' }
    assert.equal(
      rewriteLink('../privacy-security/where-is-my-data-stored.md', article),
      url('privacy-security/where-is-my-data-stored/'),
    )
  })

  test('anchors survive the rewrite', () => {
    const article = { dir: 'ai', slug: 'ai/is-ai-required' }
    assert.equal(
      rewriteLink('../observation/browser-context.md#what-it-does', article),
      `${url('observation/browser-context/')}#what-it-does`,
    )
  })

  test('external, mail and pure-anchor links are left alone', () => {
    const article = { dir: 'ai', slug: 'ai/is-ai-required' }
    for (const href of ['https://example.com', 'mailto:someone@example.com', '#section']) {
      assert.equal(rewriteLink(href, article), href)
    }
  })

  test('every rewritten link in the built HTML points at a real page', async () => {
    const routes = new Set(result.content.articles.map((article) => url(`${article.slug}/`)))
    routes.add(url(''))
    for (const article of result.content.articles) {
      const html = await read(path.join(article.slug, 'index.html'))
      for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
        if (/^(https?:|mailto:|#)/.test(href)) continue
        if (href.includes('assets/') || href.endsWith('favicon.svg')) continue
        const withoutHash = href.split('#')[0]
        assert.ok(routes.has(withoutHash), `${article.slug} links to missing route ${href}`)
      }
    }
  })
})

describe('article pages', () => {
  test('the title appears once, as a heading, and not repeated in the prose', async () => {
    const html = await read('privacy-security/what-onceaway-never-records/index.html')
    const h1s = [...html.matchAll(/<h1[^>]*>/g)]
    assert.equal(h1s.length, 1)
    const prose = html.slice(html.indexOf('<div class="prose">'))
    assert.doesNotMatch(prose, /What does Onceaway never record\?/)
  })

  test('headings get stable anchors', async () => {
    const html = await read('ai/what-does-onceaway-send-to-ai/index.html')
    assert.match(html, /<h2 id="interpretation"/)
    assert.match(html, /<h2 id="reduction-ideas"/)
    assert.equal(slugifyHeading('What comes back'), 'what-comes-back')
  })

  test('the on-this-page rail lists the article headings', async () => {
    const html = await read('ai/what-does-onceaway-send-to-ai/index.html')
    assert.match(html, /On this page/)
    assert.match(html, /href="#interpretation"/)
  })

  test('breadcrumbs name the section', async () => {
    const html = await read('ai/is-ai-required/index.html')
    assert.match(html, /Breadcrumb/)
    assert.match(html, />\s*AI\s*</)
  })

  test('previous and next appear on an interior article', async () => {
    const html = await read('ai/is-ai-required/index.html')
    assert.match(html, /pager__link--prev/)
    assert.match(html, /pager__link--next/)
  })

  test('related links from the Markdown are rendered as links', async () => {
    const html = await read('privacy-security/what-onceaway-never-records/index.html')
    assert.match(html, /Related articles/)
    assert.match(html, new RegExp(url('privacy-security/what-does-onceaway-observe/')))
  })

  test('planned capability is chipped, and still says the word', async () => {
    const html = await read('account-plans/what-is-planned-beyond-preview/index.html')
    assert.match(html, /chip--planned/)
    assert.match(html, /Planned/)
  })

  test('page titles and descriptions are set', async () => {
    const html = await read('how-onceaway-works/what-is-a-pattern/index.html')
    assert.match(html, /<title>What is a Pattern\? — Onceaway Help<\/title>/)
    assert.match(html, /<meta name="description" content="[^"]{20,}"/)
  })
})

describe('search index', () => {
  let index

  before(async () => {
    index = JSON.parse(await read('assets/search-index.json'))
  })

  test('every article is searchable', () => {
    assert.equal(index.length, result.content.articles.length)
    for (const entry of index) {
      assert.ok(entry.t && entry.s && entry.u && entry.p, 'incomplete search entry')
    }
  })

  test('snippets carry no Markdown syntax', () => {
    for (const entry of index) {
      assert.doesNotMatch(entry.p, /^#{1,6}\s/m, `${entry.t} has a raw heading`)
      assert.doesNotMatch(entry.p, /\]\(/, `${entry.t} has a raw link`)
      assert.doesNotMatch(entry.p, /\*\*/, `${entry.t} has raw emphasis`)
    }
  })

  test('the index carries only Help content', () => {
    const routes = new Set(result.content.articles.map((article) => `${article.slug}/`))
    for (const entry of index) assert.ok(routes.has(entry.u), `unexpected entry ${entry.u}`)
  })

  test('expected queries find the right article first', () => {
    const expectations = [
      ['password', 'How are passwords protected?'],
      ['API key', 'How do I add an API key?'],
      ['nothing noticed', "Why hasn't Onceaway noticed anything yet?"],
      ['productivity', "Why Onceaway doesn't score your productivity"],
    ]
    for (const [query, expected] of expectations) {
      const [top] = rank(index, query)
      assert.ok(top, `no result for "${query}"`)
      assert.equal(top.t, expected, `"${query}" ranked ${top.t} first`)
    }
  })

  test('a query about moving files reaches Assist', () => {
    const titles = rank(index, 'file move').map((doc) => doc.t)
    assert.ok(
      titles.some((title) => title.includes('Assist')),
      `expected Assist content, got ${titles.slice(0, 4).join(', ')}`,
    )
  })

  test('an unmatched query returns nothing rather than something irrelevant', () => {
    assert.equal(rank(index, 'kubernetes helm chart').length, 0)
  })
})

describe('theme and shell', () => {
  test('the theme is applied before first paint', async () => {
    const html = await read('index.html')
    const headEnd = html.indexOf('</head>')
    const script = html.indexOf('onceaway-help-theme')
    assert.ok(script !== -1 && script < headEnd, 'theme script is not in the head')
  })

  test('light and dark are both defined, and neither only inside a media query', async () => {
    const css = await read('assets/theme.css')
    assert.match(css, /:root\s*\{[^}]*--canvas:\s*#f4f3ef/i)
    assert.match(css, /:root\[data-theme="dark"\]\s*\{[^}]*--canvas:\s*#14171c/i)
    assert.match(css, /prefers-color-scheme:\s*dark/)
  })

  test('reduced motion is respected', async () => {
    assert.match(await read('assets/theme.css'), /prefers-reduced-motion:\s*reduce/)
  })

  test('accessibility basics are present on every page', async () => {
    for (const route of ['index.html', '404.html', 'ai/is-ai-required/index.html']) {
      const html = await read(route)
      assert.match(html, /class="skip-link"/, `${route} has no skip link`)
      assert.match(html, /<html lang="en">/, `${route} has no language`)
      assert.match(html, /aria-label="Search help"/, `${route} search is unlabelled`)
      assert.match(html, /id="theme-toggle"[^>]*aria-label=/, `${route} theme toggle is unlabelled`)
      assert.match(html, /<main class="content"/, `${route} has no main landmark`)
    }
  })

  test('the preview banner is configurable from one place', async () => {
    const html = await read('index.html')
    assert.equal(html.includes(config.banner.text), config.banner.show)
    assert.match(html, /id="preview-banner"/)
  })
})

describe('nothing internal escapes into the site', () => {
  test('generated HTML carries no engineering terms', async () => {
    const forbidden = [
      'ProjectObserver',
      'Project Observer',
      'PatternStructuralKey',
      'ActivityEvent',
      'FSEvents',
      'user_version',
      'Levenshtein',
      'com.projectobserver',
      '/Users/',
      'node_modules',
    ]
    for (const file of await htmlFiles(dist)) {
      const html = await readFile(file, 'utf8')
      for (const term of forbidden) {
        assert.ok(!html.includes(term), `${path.relative(dist, file)} contains "${term}"`)
      }
      assert.doesNotMatch(html, /\bTask\s+\d+\b/, `${path.relative(dist, file)} names an internal task`)
    }
  })

  test('nothing is loaded from an external origin', async () => {
    for (const file of await htmlFiles(dist)) {
      const html = await readFile(file, 'utf8')
      for (const [, attribute] of html.matchAll(/(?:src|href)="(https?:\/\/[^"]+)"/g)) {
        assert.fail(`${path.relative(dist, file)} loads external resource ${attribute}`)
      }
    }
    const js = await read('assets/site.js')
    assert.doesNotMatch(js, /https?:\/\/(?!localhost)/, 'site.js references an external origin')
  })

  test('there is no analytics, tracking or chatbot', async () => {
    const js = await read('assets/site.js')
    // Comments are stripped first: the file says in prose that it contains no
    // analytics, and that promise should not fail the test that enforces it.
    const code = js
      .replace(/\/\*[\s\S]*?\*\//g, ' ')
      .replace(/^\s*\/\/.*$/gm, ' ')
      .toLowerCase()
    for (const term of ['gtag', 'analytics', 'plausible', 'posthog', 'mixpanel', 'chatbot', 'openai', 'anthropic']) {
      assert.ok(!code.includes(term), `site.js references ${term}`)
    }
    // The only network call is for the locally built search index.
    const fetches = [...js.matchAll(/fetch\(([^)]*)\)/g)].map((m) => m[1])
    assert.equal(fetches.length, 1)
    assert.match(fetches[0], /search-index\.json/)
  })
})

/* ------------------------------------------------------------- helpers */

/** The same ranking the browser uses, so the tests check the real thing. */
function rank(index, query) {
  const norm = (value) =>
    value.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, ' ').trim()
  const terms = norm(query).split(' ').filter(Boolean)
  const scored = []

  for (const doc of index) {
    const title = norm(doc.t)
    const section = doc.s.toLowerCase()
    const body = norm(doc.p)
    const lede = body.slice(0, 220)
    let score = 0
    let matchedAll = true

    if (title === norm(query)) score += 1000
    for (const term of terms) {
      let termScore = 0
      if (title.includes(term)) {
        termScore += title.startsWith(term) ? 90 : 60
        if (new RegExp(`\\b${term}\\b`).test(title)) termScore += 40
      }
      if (section.includes(term)) termScore += 25
      if (body.includes(term)) {
        termScore += 10
        if (new RegExp(`\\b${term}\\b`).test(body)) termScore += 6
        if (lede.includes(term)) termScore += 22
      }
      if (termScore === 0) matchedAll = false
      score += termScore
    }
    if (matchedAll && score) scored.push({ ...doc, score })
  }
  return scored.sort((a, b) => b.score - a.score || a.t.localeCompare(b.t))
}

async function countMarkdown(dir) {
  let count = 0
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) count += await countMarkdown(full)
    else if (entry.name.endsWith('.md')) count += 1
  }
  return count
}

async function htmlFiles(dir) {
  const found = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) found.push(...(await htmlFiles(full)))
    else if (entry.name.endsWith('.html')) found.push(full)
  }
  return found
}

describe('plain text extraction', () => {
  test('strips the syntax a snippet should never show', () => {
    const plain = toPlainText('## Heading\n\nSome **bold** and [a link](x.md) and `code`.\n\n- item\n')
    assert.equal(plain, 'Heading Some bold and a link and code. item')
  })
})
