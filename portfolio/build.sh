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

# Use the supplied, background-isolated portrait in the generated portfolio.
# The archived WordPress media at repository root remains unchanged.
if [ -s portrait/ronal-chhetri.png ]; then
  mkdir -p dist/legacy-theme/images
  cp portrait/ronal-chhetri.png dist/legacy-theme/images/profile_pic.png
fi

# Render the full supplied portrait as a stable layer inside the existing hero
# card. The card is identified by its actual content rather than by dimensions,
# border radii, or DOM relocation guesses.
cat >> dist/assets/css/site.css <<'CSS'

/* Ronal full portrait in the original hero card */
.ronal-portrait-card {
  position: relative !important;
  isolation: isolate !important;
  overflow: hidden !important;
}

.ronal-portrait-card > .ronal-portrait-layer {
  position: absolute !important;
  inset: 0 !important;
  z-index: 50 !important;
  display: flex !important;
  align-items: flex-end !important;
  justify-content: center !important;
  overflow: hidden !important;
  pointer-events: none !important;
}

.ronal-portrait-card > .ronal-portrait-layer > img {
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
}

.ronal-original-portrait {
  opacity: 0 !important;
  visibility: hidden !important;
}

.ronal-portrait-label {
  position: relative !important;
  z-index: 60 !important;
}

@media (max-width: 48rem) {
  .ronal-portrait-card > .ronal-portrait-layer > img {
    width: 96% !important;
    height: 96% !important;
  }
}
CSS

cat >> dist/assets/js/site.js <<'JS'

/* Attach Ronal's full portrait to the known hero card without moving its DOM. */
(() => {
  const normalize = (value) => String(value || '').replace(/\s+/g, ' ').trim().toLowerCase();

  const installPortrait = () => {
    if (document.querySelector('.ronal-portrait-layer')) return;

    const source = Array.from(document.images).find((image) => {
      const src = image.currentSrc || image.getAttribute('src') || image.src || '';
      return /(?:^|\/)profile_pic\.png(?:\?|$)/.test(src);
    });

    if (!source) return;

    const requiredText = ['senior seo specialist', 'innovate nepal group'];
    const ancestors = [];
    let node = source.parentElement;

    while (node && node !== document.body) {
      ancestors.push(node);
      node = node.parentElement;
    }

    const matchesCard = (element) => {
      const text = normalize(element.textContent);
      const rect = element.getBoundingClientRect();
      return requiredText.every((needle) => text.includes(needle)) &&
        rect.width >= 220 && rect.height >= 300;
    };

    let card = ancestors.find(matchesCard);

    if (!card) {
      const candidates = Array.from(document.querySelectorAll('div, article, section, figure'))
        .filter(matchesCard)
        .sort((a, b) => {
          const aRect = a.getBoundingClientRect();
          const bRect = b.getBoundingClientRect();
          return (aRect.width * aRect.height) - (bRect.width * bRect.height);
        });
      card = candidates[0];
    }

    if (!card) return;

    const layer = document.createElement('div');
    layer.className = 'ronal-portrait-layer';
    layer.setAttribute('aria-hidden', 'true');

    const portrait = document.createElement('img');
    portrait.src = source.currentSrc || source.src;
    portrait.alt = '';
    portrait.decoding = 'async';
    portrait.fetchPriority = 'high';

    layer.appendChild(portrait);
    card.classList.add('ronal-portrait-card');
    card.appendChild(layer);
    source.classList.add('ronal-original-portrait');

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

# Version generated assets with the Netlify commit SHA so browsers cannot reuse
# an older immutable CSS, JavaScript, or portrait response after deployment.
asset_version="${COMMIT_REF:-local}"
asset_version=$(printf '%s' "$asset_version" | cut -c1-12)
for page in dist/*.html; do
  sed -i \
    -e "s|site\.css|site.css?v=$asset_version|g" \
    -e "s|site\.js|site.js?v=$asset_version|g" \
    -e "s|profile_pic\.png|profile_pic.png?v=$asset_version|g" \
    "$page"
done

# Fail early when a core page or asset is missing.
test -s dist/index.html
test -s dist/resume.html
test -s dist/assets/css/site.css
test -s dist/assets/js/site.js
test -s dist/legacy-theme/images/profile_pic.png

printf '%s\n' 'Ronal Chhetri portfolio built in portfolio/dist/'
