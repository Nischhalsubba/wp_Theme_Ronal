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
# This avoids binary upload limitations while preserving the transparent image.
if ls portrait/ronal-chhetri-hero.part-*.b64 >/dev/null 2>&1; then
  cat portrait/ronal-chhetri-hero.part-*.b64 \
    | base64 -d \
    > dist/legacy-theme/images/ronal-chhetri-hero.webp
fi

cat >> dist/assets/css/site.css <<'CSS'

/* Exact uploaded portrait in the original hero card */
.ronal-portrait-card {
  position: relative !important;
  isolation: isolate !important;
  overflow: hidden !important;
}

.ronal-portrait-card::after {
  content: "";
  position: absolute !important;
  inset: 0 !important;
  z-index: 2147483000 !important;
  display: block !important;
  background-image: url('/legacy-theme/images/ronal-chhetri-hero.webp?v=__RONAL_ASSET_VERSION__') !important;
  background-repeat: no-repeat !important;
  background-position: center bottom !important;
  background-size: contain !important;
  pointer-events: none !important;
}

.ronal-original-portrait {
  opacity: 0 !important;
  visibility: hidden !important;
}

.ronal-portrait-label {
  position: relative !important;
  z-index: 2147483001 !important;
}

@media (max-width: 48rem) {
  .ronal-portrait-card::after {
    background-size: 96% auto !important;
  }
}
CSS

cat >> dist/assets/js/site.js <<'JS'

/* Bind the exact uploaded portrait to the content-bearing hero card. */
(() => {
  const normalize = (value) => String(value || '').replace(/\s+/g, ' ').trim().toLowerCase();

  const installPortrait = () => {
    const requiredText = ['senior seo specialist', 'innovate nepal group'];
    const candidates = Array.from(document.querySelectorAll('div, article, section, figure'))
      .filter((element) => {
        const text = normalize(element.textContent);
        const rect = element.getBoundingClientRect();
        return requiredText.every((needle) => text.includes(needle)) &&
          rect.width >= 220 && rect.height >= 300;
      })
      .sort((a, b) => {
        const aRect = a.getBoundingClientRect();
        const bRect = b.getBoundingClientRect();
        return (aRect.width * aRect.height) - (bRect.width * bRect.height);
      });

    const card = candidates[0];
    if (!card) return;

    card.classList.add('ronal-portrait-card');

    Array.from(card.querySelectorAll('img')).forEach((image) => {
      const src = image.currentSrc || image.getAttribute('src') || image.src || '';
      if (/(?:^|\/)profile_pic\.png(?:\?|$)/.test(src)) {
        image.classList.add('ronal-original-portrait');
      }
    });

    Array.from(card.querySelectorAll('*')).forEach((element) => {
      const text = normalize(element.textContent);
      if (requiredText.some((needle) => text === needle || text.includes(needle))) {
        element.classList.add('ronal-portrait-label');
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', installPortrait, { once: true });
  } else {
    installPortrait();
  }
})();
JS

# Version generated assets so browsers cannot reuse a previous hero layout.
asset_version="${COMMIT_REF:-local}"
asset_version=$(printf '%s' "$asset_version" | cut -c1-12)
sed -i "s|__RONAL_ASSET_VERSION__|$asset_version|g" dist/assets/css/site.css

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

printf '%s\n' 'Ronal Chhetri portfolio built in portfolio/dist/'
