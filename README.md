# Onceaway Help

The published Help site for [Onceaway](https://github.com/KevSinfield/onceaway-help),
a Mac app that notices work you repeat and helps you decide what is worth
reducing.

**Read it here:** https://kevsinfield.github.io/onceaway-help/

## About this repository

It holds the Help articles and the small static site generator that turns them
into the published site. Pushing a change to `Docs/Help/` rebuilds and
republishes it through GitHub Actions.

- `Docs/Help/` — the articles, as plain Markdown.
- `HelpSite/` — the static site build. See `HelpSite/README.md`.

## A note on the current articles

These articles describe the Onceaway 0.5.0 test build. Some setup details will
change before public release, and anything marked *Planned* or *Not available
yet* is exactly that.

## Building it yourself

```bash
cd HelpSite
npm install
npm run dev     # http://localhost:4321
```

Requires Node 20 or later.
