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

# The original hero composition allocated only a shallow crop for the portrait.
# Promote the image into the full arch card at runtime so Ronal's complete
# upper-body portrait remains visible at desktop and mobile sizes.
cat >> dist/assets/css/site.css <<'CSS'

/* Full portrait composition */
.ronal-full-portrait-host {
  position: relative !important;
  overflow: hidden !important;
  isolation: isolate;
}

.ronal-full-portrait-host > .ronal-full-portrait {
  position: absolute !important;
  z-index: 1 !important;
  left: 48% !important;
  right: auto !important;
  top: auto !important;
  bottom: 0 !important;
  display: block !important;
  width: min(122%, 34rem) !important;
  height: auto !important;
  max-width: none !important;
  max-height: 96% !important;
  object-fit: contain !important;
  object-position: center bottom !important;
  transform: translateX(-50%) !important;
  clip-path: none !important;
  opacity: 1 !important;
  filter: none !important;
  pointer-events: none;
}

.ronal-full-portrait-host > :not(.ronal-full-portrait) {
  z-index: 2;
}

@media (max-width: 48rem) {
  .ronal-full-portrait-host > .ronal-full-portrait {
    left: 50% !important;
    width: min(116%, 29rem) !important;
    max-height: 94% !important;
  }
}
CSS

cat >> dist/assets/js/site.js <<'JS'

/* Move Ronal's portrait out of the old head-only crop and into the full hero arch. */
(() => {
  const placeFullPortrait = () => {
    const portrait = Array.from(document.images).find((image) =>
      /(?:^|\/)profile_pic\.png(?:\?|$)/.test(image.currentSrc || image.src)
    );

    if (!portrait || portrait.dataset.fullPortraitApplied === 'true') return;

    const ancestors = [];
    let node = portrait.parentElement;
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
      return rect.width >= 240 && rect.height >= 340;
    });

    if (!host) return;

    const previousParent = portrait.parentElement;
    portrait.dataset.fullPortraitApplied = 'true';
    portrait.classList.add('ronal-full-portrait');
    host.classList.add('ronal-full-portrait-host');
    host.prepend(portrait);

    Array.from(host.children).forEach((child) => {
      if (child === portrait) return;
      if (getComputedStyle(child).position === 'static') child.style.position = 'relative';
      child.style.zIndex = '2';
    });

    if (previousParent && previousParent !== host && previousParent.children.length === 0) {
      previousParent.hidden = true;
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', placeFullPortrait, { once: true });
  } else {
    placeFullPortrait();
  }
})();
JS

# Fail early when a core page or asset is missing.
test -s dist/index.html
test -s dist/resume.html
test -s dist/assets/css/site.css
test -s dist/assets/js/site.js
test -s dist/legacy-theme/images/profile_pic.png

printf '%s\n' 'Ronal Chhetri portfolio built in portfolio/dist/'
