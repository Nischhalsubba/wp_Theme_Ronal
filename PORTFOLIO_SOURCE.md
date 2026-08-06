# Ronal Chhetri static portfolio

The production Netlify portfolio is assembled by `build.sh` from the four Base64 archive parts in `.portfolio-src/`.

The archive contains the complete static website:

- responsive portfolio homepage
- full print-ready professional profile
- accessible light and dark themes
- structured data, sitemap, robots file, and social metadata
- Netlify contact form and confirmation page
- custom CSS, JavaScript, icons, and error page

The original WordPress theme, PHP templates, Sass source, JavaScript workflow, and media library remain in this repository unchanged. During the Netlify build, the original `assets/img` directory is also copied to `dist/legacy-theme/images` so the legacy visual content remains available in the deployed artifact.

To inspect the portfolio source locally:

```sh
mkdir -p /tmp/ronal-portfolio
cat .portfolio-src/part-*.b64 | base64 -d > /tmp/ronal-portfolio/site.tar.gz
tar -xzf /tmp/ronal-portfolio/site.tar.gz -C /tmp/ronal-portfolio
```

To run the production build:

```sh
sh build.sh
python3 -m http.server 8000 --directory dist
```
