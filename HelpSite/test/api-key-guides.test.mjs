import { test, describe, before } from 'node:test'
import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from '../build.mjs'
import { config, url } from '../config.mjs'

/**
 * The two provider guides, and the article that sends people to them.
 *
 * These pages walk somebody through a website we do not control, towards a
 * secret they will paste into Onceaway. The things worth testing are the
 * things that would quietly go wrong: a route that moves, a link that leaves
 * the official domains, a screenshot that never arrives, or a real key
 * committed by accident.
 */
const here = path.dirname(fileURLToPath(import.meta.url))
const dist = path.resolve(here, '../dist')
const helpRoot = path.resolve(here, '../../Docs/Help')

const anthropic = 'ai/get-an-anthropic-api-key/index.html'
const openai = 'ai/get-an-openai-api-key/index.html'
const central = 'ai/adding-an-api-key/index.html'

let result

before(async () => {
  result = await build({ quiet: true })
})

const read = (route) => readFile(path.join(dist, route), 'utf8')

/**
 * A phrase, matched across the line breaks the prose wraps at. Markdown keeps
 * a paragraph's source newlines, so a sentence written over two lines does not
 * contain itself as a plain substring — the mistake this helper exists to stop
 * anybody making twice.
 */
const phrase = (words) => new RegExp(words.split(' ').map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\s+'))
const guides = () => Promise.all([read(anthropic), read(openai)])

describe('routes', () => {
  /**
   * The native app deep-links to this one. Moving it would break a button in
   * a build that is already with a tester.
   */
  test('the existing Adding an API key route is unchanged', async () => {
    const html = await read(central)
    assert.match(html, /How do I add an API key\?/)
    const swift = await readFile(
      path.resolve(here, '../../ProjectObserver/Configuration/OnceawayHelpLinks.swift'),
      'utf8',
    ).catch(() => '')
    if (swift) {
      assert.match(swift, /ai\/adding-an-api-key/, 'the app no longer deep-links to this route')
    }
  })

  test('both provider guides are published', async () => {
    for (const route of [anthropic, openai]) {
      const html = await read(route)
      assert.ok(html.length > 2000, `${route} is too short to be the guide`)
    }
  })

  test('the guides are in the AI section, after Adding an API key', () => {
    const ai = result.content.sections.find((section) => section.name === 'AI')
    assert.ok(ai, 'no AI section')
    const slugs = ai.articles.map((article) => article.slug)
    const adding = slugs.indexOf('ai/adding-an-api-key')
    assert.ok(adding >= 0)
    assert.equal(slugs[adding + 1], 'ai/get-an-anthropic-api-key')
    assert.equal(slugs[adding + 2], 'ai/get-an-openai-api-key')
  })
})

describe('the guides lead somewhere', () => {
  test('the central article offers both routes to a key', async () => {
    const html = await read(central)
    assert.match(html, /Do you already have a key\?/)
    assert.match(html, new RegExp(url('ai/get-an-anthropic-api-key/')))
    assert.match(html, new RegExp(url('ai/get-an-openai-api-key/')))
  })

  test('each guide links back to the central article', async () => {
    for (const html of await guides()) {
      assert.match(html, new RegExp(url('ai/adding-an-api-key/')), 'a guide does not link back')
      assert.match(html, new RegExp(url('ai/what-does-onceaway-send-to-ai/')))
      assert.match(html, new RegExp(url('ai/is-ai-required/')))
    }
  })

  test('each guide finishes in Onceaway, not on the provider website', async () => {
    for (const html of await guides()) {
      assert.match(html, /Settings/, 'a guide never mentions Settings')
      assert.match(html, /Save to Keychain/, 'a guide does not say how to save the key')
      assert.match(html, /AI provider/, 'a guide does not name the provider control')
    }
  })

  /**
   * Only labels that exist. A guide that names a button the app does not have
   * is worse than no guide.
   */
  test('every Onceaway control a guide names exists in the app', async () => {
    const view = await readFile(
      path.resolve(here, '../../ProjectObserver/Settings/AISettingsView.swift'),
      'utf8',
    ).catch(() => '')
    if (!view) return // the app source is not published alongside the Help site
    for (const label of ['AI provider', 'Save to Keychain', 'Model']) {
      assert.ok(view.includes(`"${label}"`), `the app has no "${label}" control`)
    }
    for (const html of await guides()) {
      for (const invented of ['Test Connection', 'Verify key', 'Sign in to Onceaway', 'Connect account']) {
        assert.ok(!html.includes(invented), `a guide invents a control: ${invented}`)
      }
    }
  })
})

describe('subscriptions, billing and safety', () => {
  test('each guide says a chat subscription is not API access', async () => {
    const [anthropicHtml, openaiHtml] = await guides()
    assert.match(anthropicHtml, phrase('Claude Pro or Max'))
    assert.match(anthropicHtml, phrase('does not include API access'))
    assert.match(openaiHtml, phrase('ChatGPT Plus or Pro'))
    assert.match(openaiHtml, phrase('does not include API access'))
  })

  test('each guide explains that API use is paid for separately', async () => {
    for (const html of await guides()) {
      assert.match(html, phrase('paid for separately'), 'a guide does not explain billing')
    }
  })

  test('each guide has the key-security advice', async () => {
    for (const html of await guides()) {
      assert.match(html, phrase('Treat the key like a password'))
      assert.match(html, /Keychain/)
      assert.match(html, phrase('create another'))
    }
  })

  /**
   * Adding a key does not start anything. Task 35 established that the AI
   * transports run only on an explicit action, and the guides must not leave
   * the opposite impression.
   */
  test('each guide says a key does not start continuous AI use', async () => {
    for (const html of await guides()) {
      assert.match(html, phrase('only when you press a button'))
      assert.match(html, new RegExp(url('ai/what-does-onceaway-send-to-ai/')))
    }
  })

  test('neither guide turns into developer documentation', async () => {
    for (const html of await guides()) {
      for (const term of ['curl', 'Bearer', 'environment variable', 'SDK', 'endpoint', 'JSON', 'Python']) {
        assert.ok(!html.includes(term), `a guide explains ${term}, which the reader does not need`)
      }
    }
  })

  test('neither guide recommends a model', async () => {
    for (const html of await guides()) {
      assert.ok(!/claude-[a-z0-9-]+\d/.test(html), 'a guide names a Claude model')
      assert.ok(!/gpt-[0-9]/.test(html), 'a guide names a GPT model')
      assert.match(html, phrase('Leave the'), 'a guide does not tell the reader to leave the model alone')
      assert.match(html, phrase('setting alone unless you have a reason to change it'))
    }
  })
})

describe('screenshots', () => {
  test('each guide has enough illustrations to be led by them', async () => {
    for (const [name, html] of [['anthropic', (await guides())[0]], ['openai', (await guides())[1]]]) {
      const slots = (html.match(/<figure class="shot/g) ?? []).length
      assert.ok(slots >= 4 && slots <= 9, `${name} has ${slots} screenshot slots`)
    }
  })

  test('every screenshot slot says what it should show', async () => {
    for (const html of await guides()) {
      for (const [, caption] of html.matchAll(/<figcaption class="shot__caption">([\s\S]*?)<\/figcaption>/g)) {
        assert.ok(caption.trim().length > 12, `a screenshot slot has no useful description: "${caption}"`)
      }
    }
  })

  /**
   * A real image, once one exists, must resolve and must describe itself.
   */
  test('any published image resolves and has alt text', async () => {
    const files = new Set()
    const walk = async (dir, prefix = '') => {
      let entries = []
      try {
        entries = await readdir(dir, { withFileTypes: true })
      } catch {
        return
      }
      for (const entry of entries) {
        if (entry.isDirectory()) await walk(path.join(dir, entry.name), `${prefix}${entry.name}/`)
        else files.add(`${prefix}${entry.name}`)
      }
    }
    await walk(path.join(dist, 'images'))

    for (const route of [anthropic, openai, central]) {
      const html = await read(route)
      for (const [tag, src] of html.matchAll(/<img\b[^>]*src="([^"]+)"[^>]*>/g)) {
        assert.match(tag, /\balt="[^"]+"/, `${route} has an image with no alt text`)
        const relative = src.replace(url('images/'), '')
        assert.ok(files.has(relative), `${route} points at a missing image: ${src}`)
      }
    }
  })
})

describe('safety of what is published', () => {
  test('no provider secret is anywhere in the source or the site', async () => {
    const patterns = [/sk-ant-[A-Za-z0-9_-]{10,}/, /sk-proj-[A-Za-z0-9_-]{10,}/, /\bsk-[A-Za-z0-9]{32,}/]
    const sources = await Promise.all(
      ['ai/get-an-anthropic-api-key.md', 'ai/get-an-openai-api-key.md', 'ai/adding-an-api-key.md'].map((name) =>
        readFile(path.join(helpRoot, name), 'utf8'),
      ),
    )
    for (const text of [...sources, ...(await guides()), await read(central)]) {
      for (const pattern of patterns) {
        assert.doesNotMatch(text, pattern, 'something shaped like an API key is published')
      }
    }
  })

  test('nothing account-shaped is published', async () => {
    for (const html of [...(await guides()), await read(central)]) {
      assert.doesNotMatch(html, /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/, 'an email address is published')
      assert.doesNotMatch(html, /\borg-[A-Za-z0-9]{8,}/, 'an organisation identifier is published')
      assert.doesNotMatch(html, /\bproj_[A-Za-z0-9]{8,}/, 'a project identifier is published')
      assert.doesNotMatch(html, /wrkspc_[A-Za-z0-9]{8,}/, 'a workspace identifier is published')
    }
  })

  test('the guides only send people to official provider pages', async () => {
    const allowed = new Set(config.officialLinkHosts)
    for (const html of await guides()) {
      const hosts = [...html.matchAll(/href="(https?:\/\/[^"]+)"/g)].map(([, href]) => new URL(href).hostname)
      assert.ok(hosts.length >= 3, 'a guide barely links to its provider')
      for (const host of hosts) assert.ok(allowed.has(host), `a guide links to ${host}`)
    }
  })

  /**
   * Task 35 removed the claim that Onceaway detects password fields, because
   * it does not. Nothing added here may quietly put it back.
   */
  test('no guide reintroduces the secure-input claim', async () => {
    for (const html of [...(await guides()), await read(central)]) {
      for (const claim of ['secure input', 'secure-input', 'typing into a password field', 'password field creates']) {
        assert.ok(!html.toLowerCase().includes(claim), `a guide claims: ${claim}`)
      }
    }
  })
})

describe('search', () => {
  test('somebody looking for a key finds a guide', async () => {
    const index = JSON.parse(await read('assets/search-index.json'))
    const find = (term) =>
      index.filter((entry) => `${entry.t} ${entry.s} ${entry.p ?? ''}`.toLowerCase().includes(term.toLowerCase()))

    for (const term of ['API key', 'Anthropic', 'OpenAI', 'Claude', 'Claude Pro', 'ChatGPT', 'ChatGPT Plus']) {
      const hits = find(term)
      assert.ok(hits.length > 0, `search finds nothing for "${term}"`)
    }
    for (const [term, slug] of [
      ['Anthropic API key', 'ai/get-an-anthropic-api-key/'],
      ['OpenAI API key', 'ai/get-an-openai-api-key/'],
    ]) {
      assert.ok(find(term).some((entry) => entry.u === slug), `search does not surface ${slug} for "${term}"`)
    }
  })
})
