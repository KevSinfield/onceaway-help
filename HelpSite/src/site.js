/*
 * Onceaway Help — everything the site does in the browser.
 *
 * Search runs entirely here, against an index built at build time. No query,
 * no page view and nothing else about the reader is sent anywhere: there is
 * no analytics, no external search service and no network call after the page
 * has loaded. The only thing stored is a theme preference, which is not
 * personal and never leaves the browser.
 */
;(() => {
  'use strict'

  const THEME_KEY = 'onceaway-help-theme'
  const root = document.documentElement
  const base = document.currentScript
    ? document.currentScript.src.replace(/assets\/site\.js.*$/, '')
    : '/'

  /* ------------------------------------------------------------- theme */

  const themeToggle = document.getElementById('theme-toggle')

  const currentTheme = () => {
    if (root.dataset.theme) return root.dataset.theme
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  const describeToggle = () => {
    if (!themeToggle) return
    const next = currentTheme() === 'dark' ? 'light' : 'dark'
    themeToggle.setAttribute('aria-label', `Switch to ${next} appearance`)
    themeToggle.setAttribute('title', `Switch to ${next} appearance`)
  }

  if (themeToggle) {
    describeToggle()
    themeToggle.addEventListener('click', () => {
      const next = currentTheme() === 'dark' ? 'light' : 'dark'
      root.dataset.theme = next
      try {
        localStorage.setItem(THEME_KEY, next)
      } catch (e) {
        /* Private browsing, or site data blocked. The choice simply does not persist. */
      }
      describeToggle()
    })
  }

  /* ------------------------------------------------------------ banner */

  const banner = document.getElementById('preview-banner')
  const bannerClose = document.getElementById('banner-close')
  if (banner && bannerClose) {
    try {
      if (sessionStorage.getItem('onceaway-help-banner') === 'hidden') banner.hidden = true
    } catch (e) {}
    bannerClose.addEventListener('click', () => {
      banner.hidden = true
      // Session only: it comes back next visit, and nothing is tracked.
      try {
        sessionStorage.setItem('onceaway-help-banner', 'hidden')
      } catch (e) {}
    })
  }

  /* ------------------------------------------------------- mobile nav */

  const sidebar = document.getElementById('sidebar')
  const navToggle = document.getElementById('nav-toggle')
  const navScrim = document.getElementById('nav-scrim')

  const closeNav = () => {
    if (!sidebar) return
    sidebar.classList.remove('is-open')
    if (navScrim) navScrim.hidden = true
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false')
  }

  if (navToggle && sidebar) {
    navToggle.addEventListener('click', () => {
      const open = sidebar.classList.toggle('is-open')
      navToggle.setAttribute('aria-expanded', String(open))
      if (navScrim) navScrim.hidden = !open
      if (open) {
        const first = sidebar.querySelector('a')
        if (first) first.focus()
      }
    })
  }
  if (navScrim) navScrim.addEventListener('click', closeNav)

  /* ------------------------------------------------------------ search */

  const overlay = document.getElementById('search-overlay')
  const input = document.getElementById('search-input')
  const results = document.getElementById('search-results')
  let index = null
  let indexPromise = null
  let activeIndex = -1

  const loadIndex = () => {
    if (index) return Promise.resolve(index)
    if (!indexPromise) {
      indexPromise = fetch(`${base}assets/search-index.json`)
        .then((response) => response.json())
        .then((data) => {
          // The lower-cased forms search matches against are derived here
          // rather than shipped, which halves the index the reader downloads.
          for (const doc of data) {
            doc.n = doc.t.toLowerCase().replace(/[’']/g, '')
            doc.sn = doc.s.toLowerCase()
            doc.b = doc.p.toLowerCase().replace(/[’']/g, '')
            doc.lede = doc.b.slice(0, 220)
          }
          index = data
          return index
        })
        .catch(() => {
          index = []
          return index
        })
    }
    return indexPromise
  }

  const openSearch = () => {
    if (!overlay || !input) return
    closeNav()
    overlay.hidden = false
    input.focus()
    input.select()
    loadIndex().then(() => {
      if (input.value.trim()) render(input.value)
    })
  }

  const closeSearch = () => {
    if (!overlay) return
    overlay.hidden = true
    activeIndex = -1
    const trigger = document.getElementById('search-trigger')
    if (trigger) trigger.focus()
  }

  const normalise = (value) =>
    value
      .toLowerCase()
      .replace(/[’']/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim()

  /**
   * Ranking, in order of weight: an exact title match, then title terms, then
   * the section name, then the body. Deliberately simple and predictable —
   * a reader should be able to guess why a result came first.
   */
  const search = (query) => {
    const terms = normalise(query).split(' ').filter(Boolean)
    if (!terms.length) return []

    const scored = []
    for (const doc of index) {
      const title = doc.n
      const section = doc.sn
      const body = doc.b
      let score = 0
      let matchedAll = true

      if (title === normalise(query)) score += 1000

      for (const term of terms) {
        let termScore = 0
        if (title.includes(term)) {
          termScore += title.startsWith(term) ? 90 : 60
          // A whole word in the title beats a fragment of one.
          if (new RegExp(`\\b${term}\\b`).test(title)) termScore += 40
        }
        if (section.includes(term)) termScore += 25
        if (body.includes(term)) {
          termScore += 10
          if (new RegExp(`\\b${term}\\b`).test(body)) termScore += 6
          // Every article opens with its short answer, so a term appearing in
          // the opening lines is a much better signal than one buried later.
          if (doc.lede.includes(term)) termScore += 22
        }
        if (termScore === 0) matchedAll = false
        score += termScore
      }

      // Everything asked for should appear somewhere, so two-word queries do
      // not match documents containing only the commoner word.
      if (!matchedAll || score === 0) continue
      scored.push({ doc, score })
    }

    return scored.sort((a, b) => b.score - a.score || a.doc.t.localeCompare(b.doc.t)).slice(0, 12)
  }

  const escapeHtml = (value) =>
    value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

  /** A snippet around the first matching term, with the term marked. */
  const snippetFor = (doc, terms) => {
    const text = doc.p
    const lower = doc.b
    let at = -1
    let hit = ''
    for (const term of terms) {
      const found = lower.indexOf(term)
      if (found !== -1 && (at === -1 || found < at)) {
        at = found
        hit = term
      }
    }
    if (at === -1) return escapeHtml(text.slice(0, 150)) + (text.length > 150 ? '…' : '')

    const start = Math.max(0, at - 60)
    const end = Math.min(text.length, at + 110)
    let piece = text.slice(start, end)
    if (start > 0) piece = `…${piece}`
    if (end < text.length) piece = `${piece}…`

    const safe = escapeHtml(piece)
    const pattern = new RegExp(`(${hit.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig')
    return safe.replace(pattern, '<mark>$1</mark>')
  }

  const render = (query) => {
    if (!results) return
    const trimmed = query.trim()
    activeIndex = -1

    if (!trimmed) {
      results.innerHTML = ''
      return
    }

    const found = search(trimmed)
    if (!found.length) {
      results.innerHTML = `
        <div class="search-empty">
          <p>No help articles found for “${escapeHtml(trimmed)}”.</p>
          <ul>
            <li>Try fewer words, or a different word.</li>
            <li>Or browse the categories in the sidebar.</li>
          </ul>
        </div>`
      return
    }

    const terms = normalise(trimmed).split(' ').filter(Boolean)
    results.innerHTML = found
      .map(
        ({ doc }, i) => `
      <a class="search-result" role="option" id="search-result-${i}" aria-selected="false"
         href="${base}${doc.u}">
        <span class="search-result__section">${escapeHtml(doc.s)}</span>
        <span class="search-result__title">${escapeHtml(doc.t)}</span>
        <span class="search-result__snippet">${snippetFor(doc, terms)}</span>
      </a>`,
      )
      .join('')
  }

  const moveActive = (delta) => {
    if (!results) return
    const items = [...results.querySelectorAll('.search-result')]
    if (!items.length) return
    if (activeIndex >= 0 && items[activeIndex]) {
      items[activeIndex].classList.remove('is-active')
      items[activeIndex].setAttribute('aria-selected', 'false')
    }
    activeIndex = (activeIndex + delta + items.length) % items.length
    const active = items[activeIndex]
    active.classList.add('is-active')
    active.setAttribute('aria-selected', 'true')
    active.scrollIntoView({ block: 'nearest' })
    if (input) input.setAttribute('aria-activedescendant', active.id)
  }

  if (input) {
    input.addEventListener('input', () => {
      loadIndex().then(() => render(input.value))
    })
    input.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        moveActive(1)
      } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        moveActive(-1)
      } else if (event.key === 'Enter') {
        const items = results ? [...results.querySelectorAll('.search-result')] : []
        const target = activeIndex >= 0 ? items[activeIndex] : items[0]
        if (target) {
          event.preventDefault()
          window.location.href = target.getAttribute('href')
        }
      } else if (event.key === 'Escape') {
        event.preventDefault()
        closeSearch()
      }
    })
  }

  for (const id of ['search-trigger', 'hero-search', 'notfound-search']) {
    const element = document.getElementById(id)
    if (element) element.addEventListener('click', openSearch)
  }
  const searchClose = document.getElementById('search-close')
  if (searchClose) searchClose.addEventListener('click', closeSearch)
  if (overlay) {
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) closeSearch()
    })
  }

  document.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault()
      if (overlay && overlay.hidden) openSearch()
      else closeSearch()
      return
    }
    if (event.key === 'Escape') {
      if (overlay && !overlay.hidden) closeSearch()
      else if (sidebar && sidebar.classList.contains('is-open')) closeNav()
    }
  })

  // Warm the index once the page is idle, so the first keystroke is instant.
  if ('requestIdleCallback' in window) requestIdleCallback(() => loadIndex())
  else setTimeout(loadIndex, 1200)

  /* --------------------------------------------------------- on this page */

  const tocLinks = [...document.querySelectorAll('.toc__item a')]
  if (tocLinks.length && 'IntersectionObserver' in window) {
    const byId = new Map(tocLinks.map((link) => [link.getAttribute('href').slice(1), link]))
    const headings = [...byId.keys()]
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    let visible = new Set()
    const highlight = () => {
      const first = headings.find((h) => visible.has(h.id))
      for (const link of tocLinks) link.classList.remove('is-active')
      if (first) {
        const link = byId.get(first.id)
        if (link) link.classList.add('is-active')
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }
        highlight()
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 },
    )
    for (const heading of headings) observer.observe(heading)
  }
})()
