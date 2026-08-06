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

# Reconstruct the locally preserved portrait as a fallback if the requested
# external Imgur asset is temporarily unavailable.
if ls portrait/ronal-chhetri-hero.part-*.b64 >/dev/null 2>&1; then
  cat portrait/ronal-chhetri-hero.part-*.b64 \
    | base64 -d \
    > dist/legacy-theme/images/ronal-chhetri-hero.webp
fi

# Insert the requested Imgur portrait into the generated HTML itself. The image
# is a direct child of the hero frame and does not depend on runtime DOM search.
node <<'NODE'
const fs = require('fs');
const file = 'dist/index.html';
let html = fs.readFileSync(file, 'utf8');

if (!html.includes('ronal-hero-portrait')) {
  const framePattern = /<([a-z][\w:-]*)\b([^>]*\bclass\s*=\s*(["'])([^"']*\bportrait-frame\b[^"']*)\3[^>]*)>/i;
  const match = html.match(framePattern);

  if (!match) throw new Error('Could not find the portrait-frame element in index.html');

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

  const portrait = `<img class="ronal-hero-portrait" src="https://i.imgur.com/5N1j1Ie.png" alt="Ronal Chhetri, Senior SEO Specialist and Analyst" width="1024" height="1024" loading="eager" fetchpriority="high" decoding="async" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='/legacy-theme/images/ronal-chhetri-hero.webp?v=__RONAL_ASSET_VERSION__'">`;
  html = html.replace(openingTag, `${upgradedTag}${portrait}`);
  fs.writeFileSync(file, html);
}
NODE

# Apply launch-ready navigation, on-page content, metadata, schema and crawl files.
node launch-enhancements.js

cat >> dist/assets/css/site.css <<'CSS'

/* Requested Imgur portrait embedded directly in the original hero frame */
.portrait-frame.ronal-portrait-card {
  position: relative !important;
  isolation: isolate !important;
  overflow: hidden !important;
}

.portrait-frame.ronal-portrait-card::before,
.portrait-frame.ronal-portrait-card::after { z-index: 1 !important; }

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

.portrait-frame.ronal-portrait-card > :not(.ronal-hero-portrait) { z-index: 3 !important; }
.portrait-frame.ronal-portrait-card :is(h1,h2,h3,h4,h5,h6,p,span,small,strong) {
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

cat launch-enhancements.css >> dist/assets/css/site.css
cat launch-navigation.js >> dist/assets/js/site.js

# Version generated assets so browsers cannot reuse a previous layout or script.
asset_version="${COMMIT_REF:-local}"
asset_version=$(printf '%s' "$asset_version" | cut -c1-12)
sed -i "s|__RONAL_ASSET_VERSION__|$asset_version|g" dist/index.html

for page in dist/*.html; do
  sed -i \
    -e "s|site\.css|site.css?v=$asset_version|g" \
    -e "s|site\.js|site.js?v=$asset_version|g" \
    "$page"
done

# Fail early when a core page, asset, menu, or SEO requirement is missing.
test -s dist/index.html
test -s dist/resume.html
test -s dist/assets/css/site.css
test -s dist/assets/js/site.js
test -s dist/legacy-theme/images/ronal-chhetri-hero.webp
test -s dist/robots.txt
test -s dist/sitemap.xml
node --check dist/assets/js/site.js
node launch-verify.js

printf '%s\n' 'Ronal Chhetri launch build passed mobile navigation and SEO validation.'
