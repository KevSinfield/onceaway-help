import { test, describe, before } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from '../build.mjs'
import { geometry, brand, markSvg, iconSvg } from '../src/mark.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const dist = path.resolve(here, '../dist')
const swiftSource = path.resolve(here, '../../ProjectObserver/Product/OnceawayLogo.swift')

/**
 * The app's source is deliberately not published alongside the Help site, so
 * these two checks only run where both live: the private repository. Skipping
 * is explicit rather than silent, and the guard still fires wherever it can
 * actually do its job.
 */
const appSourcePresent = existsSync(swiftSource)
const needsAppSource = appSourcePresent
  ? false
  : 'the app source is not part of this repository'

before(async () => {
  await build({ quiet: true })
})

const read = (route) => readFile(path.join(dist, route), 'utf8')

describe('brand colours', () => {
  test('are exactly the ones the brand asset brief defines', () => {
    assert.equal(brand.ink, '#0F1218')
    assert.equal(brand.surface, '#171C25')
    assert.equal(brand.border, '#262D3A')
    assert.equal(brand.signalGreen, '#4FD6A6')
    assert.equal(brand.offWhite, '#E9ECF1')
    assert.equal(brand.greenText, '#1F9F74')
    assert.equal(brand.muted, '#7D8594')
  })

  test('are available to the stylesheet as their own tokens', async () => {
    const css = await read('assets/theme.css')
    assert.match(css, /--brand-signal-green:\s*#4fd6a6/i)
    assert.match(css, /--brand-ink:\s*#0f1218/i)
    assert.match(css, /--brand-surface:\s*#171c25/i)
    assert.match(css, /--brand-border:\s*#262d3a/i)
    assert.match(css, /--brand-off-white:\s*#e9ecf1/i)
    assert.match(css, /--brand-green-text:\s*#1f9f74/i)
    assert.match(css, /--brand-muted:\s*#7d8594/i)
  })

  test('the identity is kept separate from the interface accent', async () => {
    const css = await read('assets/theme.css')
    // The interface still has its own accent; the brand has not eaten it.
    assert.match(css, /--accent:\s*#1f5f5b/i)
  })

  test('the mark keeps its green on both grounds', async () => {
    // The brief is explicit: the mark keeps the signal green on light and
    // dark alike, so nothing in the theme recolours it.
    const css = await read('assets/theme.css')
    assert.doesNotMatch(css, /--mark-ring/)
    for (const route of ['index.html', 'ai/is-ai-required/index.html']) {
      const html = await read(route)
      assert.ok(html.includes(`stroke="${brand.signalGreen}"`), `${route} mark is not signal green`)
    }
  })
})

describe('one geometry, shared with the app', () => {
  test('the web geometry matches the Swift source exactly', { skip: needsAppSource }, async () => {
    const swift = await readFile(swiftSource, 'utf8')
    // The Swift side stores the same numbers as fractions of the 48 box.
    const fraction = (name) => {
      const match = swift.match(new RegExp(`static let ${name}: CGFloat = ([0-9.]+) / 48.0`))
      assert.ok(match, `${name} is not declared as a fraction of the box`)
      return Number(match[1])
    }
    assert.equal(geometry.dotCentreX, fraction('dotCentreX'))
    assert.equal(geometry.dotCentreY, fraction('dotCentreY'))
    assert.equal(geometry.strokeWidthLarge, fraction('strokeWidthLarge'))
    assert.equal(geometry.strokeWidthSmall, fraction('strokeWidthSmall'))
    assert.equal(geometry.dotRadiusLarge, fraction('dotRadiusLarge'))
    assert.equal(geometry.dotRadiusSmall, fraction('dotRadiusSmall'))
    assert.match(swift, /static let designBox: CGFloat = 48/)
    assert.equal(geometry.designBox, 48)

    // And the arc: the brief's path, and the angles Swift derives from it.
    assert.equal(geometry.arcPath, 'M32.5 9.3 A17 17 0 1 0 38.7 15.5')
    assert.match(swift, /M32\.5 9\.3 A17 17 0 1 0 38\.7 15\.5/)
    assert.match(swift, /static let arcStart: CGFloat = 60/)
    assert.match(swift, /static let arcEnd: CGFloat = 390/)
  })

  test('the Swift palette matches the web palette', { skip: needsAppSource }, async () => {
    const swift = await readFile(swiftSource, 'utf8')
    for (const [name, hex] of [
      ['signalGreenHex', brand.signalGreen],
      ['inkHex', brand.ink],
      ['surfaceHex', brand.surface],
      ['borderHex', brand.border],
      ['offWhiteHex', brand.offWhite],
      ['greenTextHex', brand.greenText],
      ['mutedHex', brand.muted],
    ]) {
      assert.match(swift, new RegExp(`${name} = "${hex.slice(1)}"`), `${name} has drifted`)
    }
  })

  test('the mark is one arc and one detached dot', () => {
    const svg = markSvg()
    const d = svg.match(/ d="([^"]+)"/)[1]
    assert.equal(d, geometry.arcPath, 'the path was redrawn rather than used')
    assert.equal((d.match(/A/g) ?? []).length, 1, 'the mark is a single arc')
    assert.equal((svg.match(/<circle/g) ?? []).length, 1)
    assert.match(svg, /stroke-linecap="round"/, 'square caps ruin the mark')
  })

  test('the dot has left the circle', () => {
    // Distance from the circle's centre exceeds its radius: the dot is
    // outside, not tucked back against the arc.
    const dx = geometry.dotCentreX - 24
    const dy = 24 - geometry.dotCentreY
    assert.ok(Math.hypot(dx, dy) > 17, 'the dot must sit outside the ring')
    assert.ok(dx > 0 && dy > 0, 'the dot sits in the upper right')
  })

  test('small sizes use the heavier stroke', () => {
    assert.match(markSvg({ size: 16 }), /stroke-width="9"/)
    assert.match(markSvg({ size: 16 }), /r="5"/)
    assert.match(markSvg({ size: 64 }), /stroke-width="7.5"/)
    assert.match(markSvg({ size: 64 }), /r="4"/)
  })
})

describe('branded surfaces', () => {
  test('the header lockup uses the mark as the word’s leading letter', async () => {
    const html = await read('index.html')
    assert.match(html, /class="lockup"/)
    assert.match(html, /<strong>nceaway<\/strong>/)
    assert.doesNotMatch(html, /<strong>Onceaway<\/strong>\s*Help/)
  })

  test('every page carries the mark, and it is the shared one', async () => {
    for (const route of ['index.html', '404.html', 'ai/is-ai-required/index.html']) {
      const html = await read(route)
      assert.match(html, /class="mark"/, `${route} has no mark`)
      assert.ok(html.includes(`fill="${brand.signalGreen}"`), `${route} mark has no signal-green dot`)
    }
  })

  test('the favicon is the dark tile with the signal-green mark', async () => {
    const svg = await read('favicon.svg')
    assert.ok(svg.includes(`fill="${brand.surface}"`), 'the tile is not the brand surface')
    assert.ok(svg.includes(`stroke="${brand.border}"`), 'the tile has no hairline border')
    assert.ok(svg.includes(`stroke="${brand.signalGreen}"`), 'the mark is not signal green')
    assert.equal(svg, iconSvg(), 'the favicon is not the shared icon')
  })

  test('no superseded mark remains anywhere in the output', async () => {
    for (const route of ['index.html', 'assets/theme.css', 'favicon.svg']) {
      const text = await read(route)
      assert.doesNotMatch(text, /\beye\b/i, `${route} references an eye`)
    }
    // The superseded hand-written ring paths are gone.
    const html = await read('index.html')
    assert.doesNotMatch(html, /M23\.4 6\.9/, 'a superseded mark path is still being emitted')
    assert.doesNotMatch(html, /A11\.034/, 'a superseded mark path is still being emitted')
  })
})
