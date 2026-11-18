# Ronal portfolio v2

The production site is stored as a compressed, zero-dependency static bundle in `.site-v2/` so Netlify can build without installing the preserved WordPress theme's obsolete Node and Gulp dependencies.

The bundle contains accessible HTML, CSS, JavaScript, SVG assets, a complete print resume, structured data, a sitemap, a web manifest, Netlify Forms markup, an archived legacy-content page, and custom error/confirmation pages.

Build and inspect locally:

```sh
sh build.sh
python3 -m http.server 8000 --directory dist
```

The original WordPress PHP, Sass, JavaScript, media, and package files remain unchanged at repository root. The build copies the original image library to `dist/legacy-theme/images/` for archival continuity.
