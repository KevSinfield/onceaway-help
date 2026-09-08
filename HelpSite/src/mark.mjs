/**
 * The Onceaway mark, for the web.
 *
 * The mark is the letter O of "Onceaway" opened up, with a piece leaving it:
 * a single arc, and a detached dot outside the circle. The gap and the
 * departed dot are the whole idea.
 *
 * The path data below is the brand asset brief's artwork, used verbatim. It is
 * not redrawn or re-traced, and the same numbers appear in
 * `ProjectObserver/Product/OnceawayLogo.swift`; a test checks the two agree so
 * the site and the app cannot drift apart.
 */
export const geometry = {
  /** The brief's artboard. */
  designBox: 48,
  /** The arc, exactly as given. */
  arcPath: 'M32.5 9.3 A17 17 0 1 0 38.7 15.5',
  /** The detached dot, outside the circle. */
  dotCentreX: 43,
  dotCentreY: 5,
  /** Regular sizes. */
  strokeWidthLarge: 7.5,
  dotRadiusLarge: 4,
  /** Below this size the mark needs a heavier stroke or it disappears. */
  smallSizeThreshold: 24,
  strokeWidthSmall: 9,
  dotRadiusSmall: 5,
}

/** The palette, exactly as the brand asset brief defines it. */
export const brand = {
  ink: '#0F1218',
  surface: '#171C25',
  border: '#262D3A',
  signalGreen: '#4FD6A6',
  offWhite: '#E9ECF1',
  greenText: '#1F9F74',
  muted: '#7D8594',
}

const strokeWidth = (size) =>
  size < geometry.smallSizeThreshold ? geometry.strokeWidthSmall : geometry.strokeWidthLarge

const dotRadius = (size) =>
  size < geometry.smallSizeThreshold ? geometry.dotRadiusSmall : geometry.dotRadiusLarge

/**
 * The mark as inline SVG.
 *
 * The mark keeps its signal green on light and dark grounds alike, so the
 * colour does not change with the theme. Round caps are required: square caps
 * ruin it.
 */
export function markSvg({ size = 32, colour = brand.signalGreen, className = 'mark' } = {}) {
  const box = geometry.designBox
  return `<svg class="${className}" width="${size}" height="${size}" viewBox="0 0 ${box} ${box}" fill="none" aria-hidden="true" focusable="false">
  <path d="${geometry.arcPath}" stroke="${colour}" stroke-width="${strokeWidth(size)}" stroke-linecap="round"/>
  <circle cx="${geometry.dotCentreX}" cy="${geometry.dotCentreY}" r="${dotRadius(size)}" fill="${colour}"/>
</svg>`
}

/**
 * The application icon as an SVG document: the mark in signal green on the
 * dark tile, matching the Mac icon. Used for the favicon, where the brief asks
 * for a smaller corner radius because it renders much smaller.
 */
export function iconSvg({ cornerRadius = 0.2 } = {}) {
  const box = 48
  const markScale = 0.68
  const offset = (box - box * markScale) / 2
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${box} ${box}" fill="none">
  <rect width="${box}" height="${box}" rx="${(box * cornerRadius).toFixed(2)}" fill="${brand.surface}"/>
  <rect x="0.5" y="0.5" width="${box - 1}" height="${box - 1}" rx="${(box * cornerRadius - 0.5).toFixed(2)}" stroke="${brand.border}"/>
  <g transform="translate(${offset.toFixed(2)} ${offset.toFixed(2)}) scale(${markScale})">
    <path d="${geometry.arcPath}" stroke="${brand.signalGreen}" stroke-width="${geometry.strokeWidthSmall}" stroke-linecap="round"/>
    <circle cx="${geometry.dotCentreX}" cy="${geometry.dotCentreY}" r="${geometry.dotRadiusSmall}" fill="${brand.signalGreen}"/>
  </g>
</svg>
`
}
