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

# Keep the original hero card and overlays intact. The source bundle crops the
# portrait inside a shallow wrapper, so clone the same image into a full-card
# presentation layer while leaving the original layout element in place.
cat >> dist/assets/css/site.css <<'CSS'

/* Full portrait inside the original hero card */
.ronal-portrait-host {
  position: relative !important;
  isolation: isolate;
  overflow: hidden !important;
}

.ronal-portrait-layer {
  position: absolute !important;
  inset: 0 !important;
  z-index: 1 !important;
  display: flex !important;
  align-items: flex-end !important;
  justify-content: center !important;
  overflow: hidden !important;
  pointer-events: none !important;
}

.ronal-portrait-layer .ronal-full-portrait {
  display: block !important;
  flex: none !important;
  width: min(118%, 34rem) !important;
  height: auto !important;
  max-width: none !important;
  max-height: 96% !important;
  margin: 0 !important;
  object-fit: contain !important;
  object-position: center bottom !important;
  transform: none !important;
  clip-path: none !important;
  opacity: 1 !important;
  visibility: visible !important;
  filter: none !important;
}

.ronal-portrait-host > :not(.ronal-portrait-layer) {
  position: relative;
  z-index: 2;
}

@media (max-width: 48rem) {
  .ronal-portrait-layer .ronal-full-portrait {
    width: min(112%, 29rem) !important;
    max-height: 94% !important;
  }
}
CSS

cat >> dist/assets/js/site.js <<'JS'

/* Preserve the old hero design while replacing its shallow head crop. */
(() => {
  const installFullPortrait = () => {
    const source = Array.from(document.images).find((image) => {
      const src = image.getAttribute('src') || image.currentSrc || image.src || '';
      return /(?:^|\/)profile_pic\.png(?:\?|$)/.test(src);
    });

    if (!source || source.dataset.fullPortraitSource === 'true') return;

    const sourceFrame = source.parentElement;
    if (!sourceFrame) return;

    const ancestors = [];
    let node = sourceFrame.parentElement;
    while (node && node !== document.body) {
      ancestors.push(node);
      node = node.parentElement;
    }

    const host = ancestors.find((element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      const radius = Math.max(
        parseFloat(style.borderTopLeftRadius) || 0,
        parseFloat(style.borderTopRightRadius) || 0
      );
      return rect.width >= 240 && rect.height >= 340 && rect.height > rect.width && radius >= 32;
    }) || ancestors.find((element) => {
      const rect = element.getBoundingClientRect();
      return rect.width >= 240 && rect.height >= 340 && rect.height > rect.width;
    });

    if (!host) return;

    source.dataset.fullPortraitSource = 'true';
    source.style.visibility = 'hidden';

    const layer = document.createElement('div');
    layer.className = 'ronal-portrait-layer';
    layer.setAttribute('aria-hidden', 'true');

    const portrait = source.cloneNode(true);
    portrait.removeAttribute('id');
    portrait.removeAttribute('style');
    portrait.removeAttribute('width');
    portrait.removeAttribute('height');
    portrait.removeAttribute('loading');
    portrait.className = 'ronal-full-portrait';
    portrait.alt = '';
    portrait.dataset.fullPortraitClone = 'true';

    layer.appendChild(portrait);
    host.classList.add('ronal-portrait-host');
    host.appendChild(layer);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', installFullPortrait, { once: true });
  } else {
    installFullPortrait();
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
