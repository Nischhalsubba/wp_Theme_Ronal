# Ronal Chhetri static portfolio

Netlify builds the production portfolio from the isolated `portfolio/` base directory. This prevents Netlify from detecting and installing the legacy WordPress theme's root `package.json`, while preserving every original PHP, Sass, JavaScript, image, and build-tool file.

The static site is assembled by `portfolio/build.sh` from the four Base64 archive parts in `portfolio/.portfolio-src/`.

The archive contains:

- responsive portfolio homepage
- full print-ready professional profile
- accessible light and dark themes
- structured data, sitemap, robots file, and social metadata
- Netlify contact form and confirmation page
- custom CSS, JavaScript, icons, and error page

During the Netlify build, the original `assets/img` directory is copied to `portfolio/dist/legacy-theme/images` so the legacy visual content remains available in the deployed artifact.

To run the production build locally:

```sh
cd portfolio
sh build.sh
python3 -m http.server 8000 --directory dist
```
