# Onceaway Help site

The public Help site, built from the Markdown in `Docs/Help/`.

## Purpose

`Docs/Help/` is the single source of truth for user-facing Help. This directory
turns it into a branded static website. Editing a document means editing one
Markdown file; nothing here holds a second copy of a title, a body or an
ordering.

```
Docs/Help/*.md  →  HelpSite build  →  HelpSite/dist/  →  any static host
```

## Commands

```bash
cd HelpSite
npm install          # once; installs one dependency
npm run dev          # build, watch Docs/Help and src, serve on :4321
npm run build        # production build into dist/
npm test             # content, routing, search and output checks
```

`npm run dev` serves <http://localhost:4321>. The preview server is a
development convenience only — it serves `dist/` on localhost and is never part
of the deployed site.

Requires **Node 20 or later** (developed on 22). Nothing needs to be installed
globally.

## Architecture

| File | Responsibility |
| --- | --- |
| `config.mjs` | Site name, base path, origin, banner, section order, home-page cards |
| `lib/content.mjs` | Reads `Docs/Help`, parses front matter, builds the section and reading model |
| `lib/render.mjs` | Markdown → HTML, heading anchors, link rewriting, plain text for search |
| `lib/templates.mjs` | The page shell, home, article and not-found templates |
| `lib/validate.mjs` | Build-time checks; the build fails rather than shipping a broken site |
| `src/theme.css` | The Onceaway visual system |
| `src/site.js` | Search, theme, mobile drawer, on-this-page highlighting |
| `build.mjs` | Orchestrates the build, writes `dist/`, and hosts the dev preview |

### Why a small custom build

The alternatives considered were Astro, Eleventy, VitePress and Docusaurus. All
would work, and all bring a framework, a plugin system and a large dependency
tree to solve problems this site does not have: there are 56 documents, one
layout, no components and no interactivity beyond search.

A small build script keeps the dependency list at **one package**
(`markdown-it`), ships **no framework JavaScript to the reader**, and leaves
the design entirely under our control — which is what makes the site feel like
Onceaway rather than a themed template. The cost is that we own about 400 lines
of build code, which is less than the configuration a generator would need.

### Content and routing

Front matter (`title`, `section`, `order`) drives navigation. Sections appear in
the order set in `config.mjs`; articles order themselves within a section from
their own `order`, so the deliberate learning sequence is never alphabetised
away.

Relative Markdown links are rewritten to site routes at build time:

```
../ai/is-ai-required.md          →  /ai/is-ai-required/
browser-context.md#what-it-does  →  /observation/browser-context/#what-it-does
```

Routes are clean directories with no `.html`, so every article is directly
linkable and deep links work without visiting the home page first.

### Theme

Light is defined on `:root`; dark redefines the same tokens under both
`prefers-color-scheme: dark` and `[data-theme="dark"]`, so no colour has its
only definition inside a media query. The default follows the system; the
toggle overrides it and stores the choice in `localStorage`. A tiny inline
script in `<head>` applies a stored choice before first paint, so dark never
flashes white.

### Search

The index is generated at build time from the Markdown — titles, sections and
plain-text bodies with the syntax stripped. Only Help content enters it; nothing
from the repository, the engineering README, the tests or the app source.

It runs entirely in the browser. There is no search service, no query logging
and no network call except fetching the index file itself. Ranking is
deliberately simple and predictable: exact title, then title terms, then the
section, then the body, with a bonus for terms appearing in an article's opening
lines — every article leads with its short answer, so that is a strong signal.

`⌘K` / `Ctrl+K` opens it, arrows move through results, Enter opens, Escape
closes.

### Security

Raw HTML is disabled in the Markdown parser, so no document can inject markup
into a page. There is nothing to sanitise because nothing untrusted is parsed
as HTML.

### Privacy

No analytics, no tracking, no cookies, no external requests, no fonts from a
CDN, no chatbot. The only things stored in the browser are a theme preference
and a per-session flag for whether the preview banner was dismissed. Neither is
personal and neither leaves the browser.

## Where it is published

**https://kevsinfield.github.io/onceaway-help/**

A temporary GitHub Pages host while Onceaway is in Preview. It is reachable by
anyone with the link and is deliberately not offered to search engines — see
*Indexing* below.

### How it is deployed

This repository has no git remote: it lives only on the development machine
and nothing in it is published, the app source least of all. Only the Help
documents and this site's source are mirrored into a separate public
repository, which builds and serves the site.

```
this repository (local only)
  Docs/Help + HelpSite
        │
        │  Scripts/publish-help-site.sh
        ▼
KevSinfield/onceaway-help (public)
        │
        │  .github/workflows/deploy-help.yml
        ▼
GitHub Pages
```

The public repository was created with clean history: none of this
repository's commits were pushed into it.

### Publishing a change

1. Edit the article in `Docs/Help/`.
2. Commit it here.
3. Run `Scripts/publish-help-site.sh`.

The script validates the documents, runs the site tests, mirrors the sources
and pushes. GitHub Actions then rebuilds and redeploys, taking about a minute.
Nothing is edited by hand in the public repository and no file is ever uploaded
through a web interface.

### The workflow

`.github/workflows/deploy-help.yml` in the public repository runs on a push
touching `Docs/Help/**`, `HelpSite/**` or the workflow itself, and on manual
dispatch. It checks out, installs Node 22, runs the document validator, runs
`npm ci`, runs the site tests, builds, then uploads and deploys the Pages
artifact.

It needs no secret: the built-in Pages token is enough, so no personal access
token exists. Permissions are `contents: read`, `pages: write`,
`id-token: write` and nothing else. Deployments are serialised with a
concurrency group.

### Build settings used in deployment

| Setting | Value | Why |
| --- | --- | --- |
| `HELP_SITE_BASE` | `/onceaway-help/` | A GitHub project page is served from a repository-named path |
| `HELP_SITE_ORIGIN` | `https://kevsinfield.github.io` | Canonical and Open Graph URLs; lower-cased to match the hostname people actually reach |
| `HELP_SITE_INDEXING` | `false` | Preview: `robots.txt` disallows crawling and no sitemap is advertised |

### Indexing

While Onceaway is in Preview, `robots.txt` is:

```
User-agent: *
Disallow: /
```

The site is public by URL but not promoted to search engines, because it
describes a test build whose details will change. Revisit this at public
launch by setting `HELP_SITE_INDEXING=true`, which also emits a sitemap.

## Output and deployment portability

`npm run build` writes `HelpSite/dist/` — plain HTML, one stylesheet, one
script, a search index and an SVG favicon. It is ordinary static output and
needs no server-side anything, so it can equally be served by Cloudflare Pages,
Netlify, Vercel, S3 with CloudFront, or a plain web server.

### Moving to a custom domain later

Every generated link runs through `basePath`, so moving hosts is a build
setting rather than a content change. None of the 56 articles would need
editing.

To move to something like `help.example.com`:

1. Build with `HELP_SITE_BASE=/` and `HELP_SITE_ORIGIN=https://help.example.com`.
2. Point the DNS record at the host.
3. On GitHub Pages, add the custom domain and let it issue a certificate.

No domain has been chosen and no DNS is configured.

### Hosting at a different path or origin

Two environment variables, read at build time:

```bash
HELP_SITE_BASE=/help/ npm run build              # hang it off an existing site
HELP_SITE_ORIGIN=https://example.com npm run build   # canonical URLs and sitemap
```

`HELP_SITE_BASE` rewrites every generated link. `HELP_SITE_ORIGIN` is optional
and only adds canonical tags, Open Graph URLs and a sitemap; it is left empty
until a real domain exists, rather than inventing one.

For a host that does not automatically serve `404.html`, point its not-found
handler at that file.

### Linking from the desktop app

Routes are stable and predictable, so the app's Help section can later link to
individual articles:

```
In-app AI Help          →  <origin>/ai/what-does-onceaway-send-to-ai/
In-app Privacy Help     →  <origin>/privacy-security/what-onceaway-never-records/
In-app Assist Help      →  <origin>/using-onceaway/using-assist-safely/
```

Nothing in the app has been changed to do this yet.

## Validation

`npm test` covers content loading, ordering, routes, Markdown link mapping,
article rendering, the search index and its ranking, theme setup, accessibility
basics, and sweeps the generated HTML for engineering terms and external
resources.

The build itself also fails on a broken internal link, a duplicate route or
title, an orphaned article, a missing anchor, or an internal term reaching a
page.

`Scripts/check-help-docs.sh` at the repository root still validates the Markdown
independently, and is unaffected by this site.
