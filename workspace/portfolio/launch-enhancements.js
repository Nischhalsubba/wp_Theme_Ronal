'use strict';

const fs = require('fs');

const SITE = 'https://ronalchettri.netlify.app';
const PORTRAIT = 'https://i.imgur.com/5N1j1Ie.png';
const LINKEDIN = 'https://www.linkedin.com/in/ronal-chhetri/';
const MODIFIED = '2026-08-06';

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function insertIntoHead(doc, markup) {
  if (!/<\/head>/i.test(doc)) throw new Error('Missing closing head element');
  return doc.replace(/<\/head>/i, `  ${markup}\n</head>`);
}

function setTitle(doc, title) {
  const tag = `<title>${title}</title>`;
  return /<title\b[^>]*>[\s\S]*?<\/title>/i.test(doc)
    ? doc.replace(/<title\b[^>]*>[\s\S]*?<\/title>/i, tag)
    : insertIntoHead(doc, tag);
}

function setMeta(doc, attribute, key, content) {
  const pattern = new RegExp(`<meta\\b(?=[^>]*\\b${attribute}\\s*=\\s*["']${escapeRegex(key)}["'])[^>]*>`, 'i');
  const tag = `<meta ${attribute}="${escapeAttr(key)}" content="${escapeAttr(content)}">`;
  return pattern.test(doc) ? doc.replace(pattern, tag) : insertIntoHead(doc, tag);
}

function removeMeta(doc, name) {
  const pattern = new RegExp(`\\s*<meta\\b(?=[^>]*\\bname\\s*=\\s*["']${escapeRegex(name)}["'])[^>]*>`, 'ig');
  return doc.replace(pattern, '');
}

function setCanonical(doc, href) {
  const pattern = /<link\b(?=[^>]*\brel\s*=\s*["']canonical["'])[^>]*>/i;
  const tag = `<link rel="canonical" href="${escapeAttr(href)}">`;
  return pattern.test(doc) ? doc.replace(pattern, tag) : insertIntoHead(doc, tag);
}

function addHeadMarkup(doc, marker, markup) {
  return doc.includes(marker) ? doc : insertIntoHead(doc, markup);
}

function setHtmlLang(doc, language) {
  if (!/<html\b/i.test(doc)) throw new Error('Missing html element');
  return /<html\b[^>]*\blang\s*=/i.test(doc)
    ? doc.replace(/(<html\b[^>]*\blang\s*=\s*)["'][^"']*["']/i, `$1"${language}"`)
    : doc.replace(/<html\b/i, `<html lang="${language}"`);
}

function addClass(openingTag, className) {
  const match = openingTag.match(/\bclass\s*=\s*(["'])([^"']*)\1/i);
  if (!match) return openingTag.replace(/>$/, ` class="${className}">`);
  const classes = new Set(match[2].split(/\s+/).filter(Boolean));
  classes.add(className);
  return openingTag.replace(match[0], `class=${match[1]}${Array.from(classes).join(' ')}${match[1]}`);
}

function setAttribute(openingTag, name, value) {
  const pattern = new RegExp(`\\s${escapeRegex(name)}\\s*=\\s*(["'])[^"']*\\1`, 'i');
  return pattern.test(openingTag)
    ? openingTag.replace(pattern, ` ${name}="${escapeAttr(value)}"`)
    : openingTag.replace(/>$/, ` ${name}="${escapeAttr(value)}">`);
}

function installNavigation(doc) {
  if (doc.includes('id="launch-mobile-drawer"')) return doc;

  const matches = Array.from(doc.matchAll(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi));
  if (!matches.length) throw new Error('Could not find a navigation element in index.html');

  const scored = matches.map((match) => {
    const block = match[0];
    const lower = block.toLowerCase();
    const anchorCount = (block.match(/<a\b/gi) || []).length;
    let score = anchorCount;
    ['#work', '#expertise', '#experience', '#contact'].forEach((needle) => {
      if (lower.includes(needle)) score += 10;
    });
    return { match, block, score };
  }).sort((a, b) => b.score - a.score);

  const selected = scored[0];
  if (selected.score < 4) throw new Error('Could not identify the primary navigation');

  let desktopNav = selected.block;
  const opening = desktopNav.match(/^<nav\b[^>]*>/i)[0];
  let upgradedOpening = addClass(opening, 'launch-desktop-nav');
  upgradedOpening = setAttribute(upgradedOpening, 'aria-label', 'Primary navigation');
  desktopNav = desktopNav.replace(opening, upgradedOpening);

  if (!/href\s*=\s*["'][^"']*#services/i.test(desktopNav)) {
    const servicesLink = '<a href="#services">Services</a>';
    const contactPattern = /<a\b[^>]*href\s*=\s*(["'])[^"']*#contact[^"']*\1[^>]*>/i;
    desktopNav = contactPattern.test(desktopNav)
      ? desktopNav.replace(contactPattern, `${servicesLink}$&`)
      : desktopNav.replace(/<\/nav>/i, `${servicesLink}</nav>`);
  }

  const anchors = desktopNav.match(/<a\b[^>]*>[\s\S]*?<\/a>/gi) || [];
  if (anchors.length < 4) throw new Error('Primary navigation has too few links');

  const mobileLinks = anchors.map((anchor) => {
    let clean = anchor.replace(/\s+id\s*=\s*(["'])[^"']*\1/ig, '');
    const tag = clean.match(/^<a\b[^>]*>/i)[0];
    clean = clean.replace(tag, addClass(tag, 'launch-mobile-link'));
    return clean;
  }).join('\n');

  const button = '<button class="launch-mobile-toggle" type="button" aria-controls="launch-mobile-drawer" aria-expanded="false" aria-label="Open navigation menu"><span></span><span></span><span></span></button>';
  const drawer = `<nav id="launch-mobile-drawer" class="launch-mobile-drawer" aria-label="Mobile navigation" aria-hidden="true" tabindex="-1">${mobileLinks}</nav>`;
  const backdrop = '<div class="launch-nav-backdrop" aria-hidden="true"></div>';
  const replacement = `${button}${desktopNav}${drawer}${backdrop}`;

  return doc.slice(0, selected.match.index) + replacement + doc.slice(selected.match.index + selected.block.length);
}

function installServices(doc) {
  if (/\bid\s*=\s*["']services["']/i.test(doc)) return doc;

  const section = `
<section id="services" class="launch-services" aria-labelledby="launch-services-title">
  <div class="launch-services__inner">
    <p class="launch-services__eyebrow">SEO SERVICES</p>
    <div class="launch-services__intro">
      <h2 id="launch-services-title">SEO strategy that teams can actually ship.</h2>
      <p>As a Nepal-based Senior SEO Specialist and Analyst, Ronal turns technical findings, search intent and performance data into clear priorities that developers, writers and stakeholders can implement.</p>
    </div>
    <div class="launch-services__grid">
      <article class="launch-services__card">
        <span>01</span>
        <h3>Technical SEO and site architecture</h3>
        <p>Crawlability, indexation, internal linking, structured data and site architecture are reviewed as one connected search system rather than a pile of isolated warnings.</p>
      </article>
      <article class="launch-services__card">
        <span>02</span>
        <h3>Keyword and content strategy</h3>
        <p>Keyword research, intent mapping and content planning connect audience demand with useful pages, stronger information architecture and realistic publishing priorities.</p>
      </article>
      <article class="launch-services__card">
        <span>03</span>
        <h3>Measurement and implementation</h3>
        <p>Search reporting translates visibility, engagement and conversion signals into decisions, implementation briefs and a practical roadmap for continuous improvement.</p>
      </article>
    </div>
    <div class="launch-services__actions">
      <a class="launch-services__primary" href="#contact">Discuss an SEO project</a>
      <a class="launch-services__secondary" href="/resume">Review experience</a>
    </div>
  </div>
</section>`;

  const contact = doc.match(/<section\b[^>]*\bid\s*=\s*["']contact["'][^>]*>/i);
  if (contact) return doc.replace(contact[0], `${section}\n${contact[0]}`);
  if (/<\/main>/i.test(doc)) return doc.replace(/<\/main>/i, `${section}\n</main>`);
  return doc.replace(/<\/body>/i, `${section}\n</body>`);
}

function applyPageMetadata(doc, config) {
  doc = setHtmlLang(doc, 'en');
  doc = removeMeta(doc, 'keywords');
  doc = setTitle(doc, config.title);
  doc = setMeta(doc, 'name', 'description', config.description);
  doc = setMeta(doc, 'name', 'robots', config.robots);
  doc = setMeta(doc, 'name', 'author', 'Ronal Chhetri');
  doc = setMeta(doc, 'name', 'theme-color', '#0d120e');
  doc = setCanonical(doc, config.canonical);
  doc = setMeta(doc, 'property', 'og:locale', 'en_NP');
  doc = setMeta(doc, 'property', 'og:type', config.ogType || 'profile');
  doc = setMeta(doc, 'property', 'og:title', config.title);
  doc = setMeta(doc, 'property', 'og:description', config.description);
  doc = setMeta(doc, 'property', 'og:url', config.canonical);
  doc = setMeta(doc, 'property', 'og:site_name', 'Ronal Chhetri');
  doc = setMeta(doc, 'property', 'og:image', PORTRAIT);
  doc = setMeta(doc, 'property', 'og:image:width', '1024');
  doc = setMeta(doc, 'property', 'og:image:height', '1024');
  doc = setMeta(doc, 'property', 'og:image:alt', 'Portrait of Ronal Chhetri');
  doc = setMeta(doc, 'name', 'twitter:card', 'summary_large_image');
  doc = setMeta(doc, 'name', 'twitter:title', config.title);
  doc = setMeta(doc, 'name', 'twitter:description', config.description);
  doc = setMeta(doc, 'name', 'twitter:image', PORTRAIT);
  doc = setMeta(doc, 'name', 'twitter:image:alt', 'Portrait of Ronal Chhetri');
  doc = addHeadMarkup(doc, 'href="https://i.imgur.com"', '<link rel="preconnect" href="https://i.imgur.com" crossorigin>');
  doc = addHeadMarkup(doc, 'rel="me"', `<link rel="me" href="${LINKEDIN}">`);
  return doc;
}

let index = fs.readFileSync('dist/index.html', 'utf8');
index = installNavigation(index);
index = installServices(index);
index = applyPageMetadata(index, {
  title: 'Ronal Chhetri | Senior SEO Specialist and Technical SEO Analyst',
  description: 'Ronal Chhetri is a Nepal-based Senior SEO Specialist helping brands improve technical SEO, content strategy, keyword visibility, structured data and reporting.',
  canonical: `${SITE}/`,
  robots: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
  ogType: 'profile'
});

index = index.replace(/\s*<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/ig, '');
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE}/#website`,
      url: `${SITE}/`,
      name: 'Ronal Chhetri - Senior SEO Specialist',
      inLanguage: 'en',
      publisher: { '@id': `${SITE}/#person` }
    },
    {
      '@type': 'ProfilePage',
      '@id': `${SITE}/#profilepage`,
      url: `${SITE}/`,
      name: 'Ronal Chhetri - Senior SEO Specialist and Analyst',
      isPartOf: { '@id': `${SITE}/#website` },
      mainEntity: { '@id': `${SITE}/#person` },
      dateModified: MODIFIED,
      inLanguage: 'en'
    },
    {
      '@type': 'Person',
      '@id': `${SITE}/#person`,
      name: 'Ronal Chhetri',
      url: `${SITE}/`,
      image: { '@type': 'ImageObject', url: PORTRAIT, width: 1024, height: 1024 },
      jobTitle: 'Senior SEO Specialist and Analyst',
      worksFor: { '@type': 'Organization', name: 'Innovate Nepal Group' },
      sameAs: [LINKEDIN],
      knowsAbout: [
        'Technical SEO',
        'SEO strategy',
        'Keyword research',
        'Content strategy',
        'Structured data',
        'Search analytics',
        'Search performance reporting'
      ],
      address: { '@type': 'PostalAddress', addressCountry: 'NP' }
    }
  ]
};
index = insertIntoHead(index, `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`);
fs.writeFileSync('dist/index.html', index);

if (fs.existsSync('dist/resume.html')) {
  let resume = fs.readFileSync('dist/resume.html', 'utf8');
  resume = applyPageMetadata(resume, {
    title: 'Ronal Chhetri Resume | Senior SEO Specialist and Analyst',
    description: 'Review Ronal Chhetri\'s SEO experience, technical expertise, content strategy background, professional credentials and career history.',
    canonical: `${SITE}/resume`,
    robots: 'index,follow,max-image-preview:large',
    ogType: 'profile'
  });
  fs.writeFileSync('dist/resume.html', resume);
}

for (const [file, directive] of [
  ['dist/legacy.html', 'noindex,follow'],
  ['dist/thanks.html', 'noindex,nofollow'],
  ['dist/404.html', 'noindex,nofollow']
]) {
  if (!fs.existsSync(file)) continue;
  let page = fs.readFileSync(file, 'utf8');
  page = setHtmlLang(page, 'en');
  page = setMeta(page, 'name', 'robots', directive);
  fs.writeFileSync(file, page);
}

fs.writeFileSync('dist/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
fs.writeFileSync('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE}/</loc>
    <lastmod>${MODIFIED}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE}/resume</loc>
    <lastmod>${MODIFIED}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
`);
