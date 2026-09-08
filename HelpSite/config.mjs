/**
 * Everything about this site that a person might reasonably want to change
 * without touching the build. Nothing here is secret and nothing is sent
 * anywhere.
 */
export const config = {
  siteName: 'Onceaway Help',
  productName: 'Onceaway',
  /** The wordmark after the mark, which stands in for its leading "o". */
  wordmarkTail: 'nceaway',
  tagline: 'Make repeated work go away.',

  /**
   * Where the site will eventually live. Used only for canonical URLs and
   * Open Graph tags. Left empty until a domain actually exists — the site
   * works perfectly well without it, and inventing one would put a
   * fictional address into every page.
   */
  origin: process.env.HELP_SITE_ORIGIN ?? '',

  /**
   * Path the site is served from. `/` for a dedicated host such as a
   * help subdomain; `/help/` to hang it off an existing site. Every
   * generated link runs through this, so switching is a one-line change.
   */
  basePath: process.env.HELP_SITE_BASE ?? '/',

  /**
   * Whether search engines are invited to index the site.
   *
   * False while Onceaway is in Preview: the Help site is reachable by URL for
   * testers, but it is not promoted to search engines, and it describes a test
   * build whose details will change. Revisit this at public launch.
   */
  allowIndexing: process.env.HELP_SITE_INDEXING === 'true',

  /**
   * The site-wide note about which build the articles describe. Set
   * `show: false` when the docs no longer describe a test build — one
   * change here rather than an edit to 56 articles.
   */
  banner: {
    show: true,
    label: 'Onceaway Preview',
    text: 'These articles currently describe the Onceaway 0.5.0 test build. Some setup details may change before public release.',
  },

  /**
   * Section order in the sidebar and on the home page. Articles order
   * themselves from their own front matter; only the sections need saying,
   * because a folder name cannot express a learning sequence.
   */
  sectionOrder: [
    'Getting Started',
    'How Onceaway Works',
    'Privacy & Security',
    'Observation',
    'AI',
    'Using Onceaway',
    'Troubleshooting',
    'Account & Plans',
    'Release Notes',
  ],

  /** One line per section for the home page cards. */
  sectionBlurbs: {
    'Getting Started': 'Set up Onceaway and understand what happens first.',
    'How Onceaway Works': 'Patterns, Opportunities, Recommendations, Insights and Assist.',
    'Privacy & Security': 'What Onceaway observes — and what it deliberately does not.',
    Observation: 'Apps, files and browser context, and why something might be missing.',
    AI: 'Providers, API keys and exactly what is sent.',
    'Using Onceaway': 'Reviewing, deciding, reading Insights and using Assist.',
    Troubleshooting: 'Fix common setup and usage problems.',
    'Account & Plans': 'Preview access and what is planned later.',
    'Release Notes': "What changed, and what to know about the current build.",
  },

  /**
   * The six cards shown on the home page, in this order. Sections not
   * listed still appear in the sidebar and in search.
   */
  homeCards: [
    'Getting Started',
    'Privacy & Security',
    'How Onceaway Works',
    'AI',
    'Troubleshooting',
    'Account & Plans',
  ],

  /**
   * Deliberately chosen starting points, not a popularity chart. There are
   * no analytics, so nothing here could honestly be called "most read".
   */
  usefulStartingPoints: [
    'getting-started/what-is-onceaway',
    'privacy-security/what-does-onceaway-observe',
    'privacy-security/what-onceaway-never-records',
    'observation/why-hasnt-onceaway-noticed-anything-yet',
    'how-onceaway-works/what-is-a-pattern',
    'ai/is-ai-required',
    'ai/what-does-onceaway-send-to-ai',
    'using-onceaway/using-assist-safely',
  ],

  /** Articles given the quieter, more considered treatment. */
  philosophyArticles: [
    'privacy-security/why-privacy-comes-before-observation',
    'privacy-security/why-onceaway-doesnt-score-your-productivity',
    'ai/why-onceaway-keeps-ai-optional',
    'using-onceaway/why-onceaway-asks-before-it-acts',
  ],
}

/** Joins a site-relative path onto the configured base path. */
export function url(path = '') {
  const base = config.basePath.endsWith('/') ? config.basePath : `${config.basePath}/`
  const clean = String(path).replace(/^\/+/, '')
  return `${base}${clean}`
}
