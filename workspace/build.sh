#!/bin/sh
set -eu

rm -rf dist .portfolio-work
mkdir -p dist .portfolio-work

cat .portfolio-src/part-*.b64 | base64 -d > .portfolio-work/site.tar.gz
tar -xzf .portfolio-work/site.tar.gz -C dist --strip-components=1
rm -rf .portfolio-work

# Preserve the original WordPress theme image library in the deployed artifact.
# The legacy theme files remain untouched on master while the modern static site
# avoids depending on the obsolete PHP/Gulp runtime.
if [ -d assets/img ]; then
  mkdir -p dist/legacy-theme
  cp -R assets/img dist/legacy-theme/images
fi

printf '%s\n' 'Ronal Chhetri portfolio assembled in dist/'
