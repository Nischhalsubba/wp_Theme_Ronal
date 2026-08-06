#!/bin/sh
set -eu

rm -rf dist .site-work
mkdir -p dist .site-work

cat .site-v2/part-*.b64 | base64 -d > .site-work/portfolio.tar.gz
tar -xzf .site-work/portfolio.tar.gz -C dist
rm -rf .site-work

# Preserve repository-visible images from the original WordPress portfolio.
if [ -d ../assets/img ]; then
  mkdir -p dist/legacy-theme/images
  cp -R ../assets/img/. dist/legacy-theme/images/
fi

mkdir -p dist/legacy-theme/images

# Keep the original profile image available to legacy pages.
if [ -s portrait/ronal-chhetri.png ]; then
  cp portrait/ronal-chhetri.png dist/legacy-theme/images/profile_pic.png
fi

# Reconstruct the exact portrait supplied for the hero from text-safe chunks.
if ls portrait/ronal-chhetri-hero.part-*.b64 >/dev/null 2>&1; then
  cat portrait/ronal-chhetri-hero.part-*.b64 \
    | base64 -d \
    > dist/legacy-theme/images/ronal-chhetri-hero.webp
fi

# Insert the portrait into the generated HTML itself. Runtime DOM guessing caused
# the blank-card regressions, so the hero now owns a real image element.
node <<'NODE'
const fs = require('fs');
const file = 'dist/index.html';
let html = fs.readFileSync(file, 'utf8');

if (!html.includes('ronal-hero-portrait')) {
  const framePattern = /<([a-z][\w:-]*)\b([^>]*\bclass\s*=\s*(["'])([^"']*\bportrait-frame\b[^"']*)\3[^>]*)>/i;
  const match = html.match(framePattern);

  if (!match) {
    throw new Error('Could not find the portrait-frame element in index.html');
  }

  const openingTag = match[0];
  const quote = match[3];
  const classes = match[4];
  let upgradedTag = openingTag;

  if (!/\bronal-portrait-card\b/.test(classes)) {
    const escapedClasses = classes.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const classPattern = new RegExp(`class\\s*=\\s*${quote}${escapedClasses}${quote}`);
    const updatedClasses = `${classes} ronal-portrait-card`.replace(/\s+/g, ' ').trim();
    upgradedTag = openingTag.replace(classPattern, `class=${quote}${updatedClasses}${quote}`);
  }

  const portrait = '<img class="ronal-hero-portrait" src="/legacy-theme/images/ronal-chhetri-hero.webp?v=__RONAL_ASSET_VERSION__" alt="Ronal Chhetri" width="512" height="512" fetchpriority="high" decoding="async">';
  html = html.replace(openingTag, `${upgradedTag}${portrait}`);
  fs.writeFileSync(file, html);
}
NODE

cat >> dist/assets/css/site.css <<'CSS'

/* Exact uploaded portrait embedded directly in the original hero frame */
.portrait-frame.ronal-portrait-card {
  position: relative !important;
  isolation: isolate !important;
  overflow: hidden !important;
}

.portrait-frame.ronal-portrait-card::before,
.portrait-frame.ronal-portrait-card::after {
  z-index: 1 !important;
}

.portrait-frame.ronal-portrait-card > .ronal-hero-portrait {
  position: absolute !important;
  inset: 0 !important;
  z-index: 2 !important;
  display: block !important;
  width: 100% !important;
  height: 100% !important;
  max-width: none !important;
  max-height: none !important;
  margin: 0 !important;
  object-fit: contain !important;
  object-position: center bottom !important;
  opacity: 1 !important;
  visibility: visible !important;
  transform: none !important;
  clip-path: none !important;
  filter: none !important;
  pointer-events: none !important;
}

.portrait-frame.ronal-portrait-card img[src*="profile_pic.png"] {
  opacity: 0 !important;
  visibility: hidden !important;
}

.portrait-frame.ronal-portrait-card > :not(.ronal-hero-portrait) {
  z-index: 3 !important;
}

.portrait-frame.ronal-portrait-card :is(h1, h2, h3, h4, h5, h6, p, span, small, strong) {
  position: relative;
  z-index: 4 !important;
}

@media (max-width: 48rem) {
  .portrait-frame.ronal-portrait-card > .ronal-hero-portrait {
    width: 96% !important;
    height: 96% !important;
    left: 2% !important;
    top: 4% !important;
  }
}
CSS

# Version generated assets so browsers cannot reuse a previous hero layout.
asset_version="${COMMIT_REF:-local}"
asset_version=$(printf '%s' "$asset_version" | cut -c1-12)
sed -i "s|__RONAL_ASSET_VERSION__|$asset_version|g" dist/index.html

for page in dist/*.html; do
  sed -i \
    -e "s|site\.css|site.css?v=$asset_version|g" \
    -e "s|site\.js|site.js?v=$asset_version|g" \
    "$page"
done

# Fail early when a core page or asset is missing.
test -s dist/index.html
test -s dist/resume.html
test -s dist/assets/css/site.css
test -s dist/assets/js/site.js
test -s dist/legacy-theme/images/ronal-chhetri-hero.webp
grep -q 'class="ronal-hero-portrait"' dist/index.html
grep -q 'portrait-frame ronal-portrait-card' dist/index.html

printf '%s\n' 'Ronal Chhetri portfolio built in portfolio/dist/'
