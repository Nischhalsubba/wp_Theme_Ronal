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

# Fail early when a core page or asset is missing.
test -s dist/index.html
test -s dist/resume.html
test -s dist/assets/css/site.css
test -s dist/assets/js/site.js

printf '%s\n' 'Ronal Chhetri portfolio built in portfolio/dist/'
