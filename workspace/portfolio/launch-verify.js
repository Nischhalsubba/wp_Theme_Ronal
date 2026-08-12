'use strict';

const fs = require('fs');
const html = fs.readFileSync('dist/index.html', 'utf8');
const resume = fs.readFileSync('dist/resume.html', 'utf8');
const sitemap = fs.readFileSync('dist/sitemap.xml', 'utf8');
const robots = fs.readFileSync('dist/robots.txt', 'utf8');

function requireMatch(value, pattern, message) {
  if (!pattern.test(value)) throw new Error(message);
}

requireMatch(html, /<html\b[^>]*\blang=["']en["']/i, 'Homepage language is missing');
requireMatch(html, /<title>Ronal Chhetri \| Senior SEO Specialist and Technical SEO Analyst<\/title>/i, 'Homepage title is incorrect');
requireMatch(html, /<meta\s+name=["']description["'][^>]*>/i, 'Homepage description is missing');
requireMatch(html, /<link\s+rel=["']canonical["']\s+href=["']https:\/\/ronalchettri\.netlify\.app\/["']>/i, 'Homepage canonical is incorrect');
requireMatch(html, /id=["']launch-mobile-drawer["']/i, 'Mobile drawer markup is missing');
requireMatch(html, /class=["'][^"']*launch-mobile-toggle/i, 'Mobile menu button is missing');
requireMatch(html, /aria-controls=["']launch-mobile-drawer["']/i, 'Mobile menu ARIA control is missing');
requireMatch(html, /id=["']services["']/i, 'SEO services content is missing');
requireMatch(html, /src=["']https:\/\/i\.imgur\.com\/5N1j1Ie\.png["']/i, 'Requested hero image is missing');
requireMatch(resume, /<link\s+rel=["']canonical["']\s+href=["']https:\/\/ronalchettri\.netlify\.app\/resume["']>/i, 'Resume canonical is incorrect');
requireMatch(sitemap, /<loc>https:\/\/ronalchettri\.netlify\.app\/<\/loc>/, 'Homepage is missing from sitemap');
requireMatch(sitemap, /<loc>https:\/\/ronalchettri\.netlify\.app\/resume<\/loc>/, 'Resume is missing from sitemap');
requireMatch(robots, /Sitemap: https:\/\/ronalchettri\.netlify\.app\/sitemap\.xml/, 'Robots sitemap declaration is missing');

const h1Count = (html.match(/<h1\b/gi) || []).length;
if (h1Count !== 1) throw new Error(`Expected exactly one homepage H1, found ${h1Count}`);

const description = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
if (!description || description[1].length < 120 || description[1].length > 170) {
  throw new Error('Homepage description length is outside the launch range');
}

const drawer = html.match(/<nav\b[^>]*id=["']launch-mobile-drawer["'][^>]*>([\s\S]*?)<\/nav>/i);
if (!drawer || (drawer[1].match(/<a\b/gi) || []).length < 5) {
  throw new Error('Mobile drawer does not contain the expected navigation links');
}

const scripts = Array.from(html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi));
if (!scripts.length) throw new Error('Structured data is missing');
const graph = scripts.map((match) => JSON.parse(match[1])).find((item) => Array.isArray(item['@graph']));
if (!graph) throw new Error('Structured data graph is missing');
const types = graph['@graph'].map((item) => item['@type']);
for (const type of ['WebSite', 'ProfilePage', 'Person']) {
  if (!types.includes(type)) throw new Error(`Structured data type ${type} is missing`);
}

if (/<meta\b[^>]*name=["']keywords["']/i.test(html)) {
  throw new Error('Obsolete keywords meta tag should not be present');
}

console.log('Launch validation passed: mobile navigation, metadata, schema, sitemap and crawl rules.');
