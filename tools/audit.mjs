// dist/ の全HTMLを静的に監査する。ビルド後に実行: node tools/audit.mjs
// チェック: title重複/長さ, description有無/長さ, H1数, canonical, OGP, 画像alt, JSON-LD妥当性, 内部リンク切れ, パンくず, lang
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('dist');
const files = [];
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); fs.statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') && files.push(p); } })(root);

const issues = [];
const titles = new Map();
const descs = new Map();
const pages = [];
const urlOf = (f) => '/' + path.relative(root, f).replace(/index\.html$/, '').replace(/\\/g, '/');
const exists = (href) => {
  const p = href.split('#')[0].split('?')[0];
  if (!p.startsWith('/')) return true;
  const cand = [path.join(root, p), path.join(root, p, 'index.html'), path.join(root, p.replace(/\/$/, '') + '.html')];
  return cand.some((c) => fs.existsSync(c) && fs.statSync(c).isFile());
};

for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  const url = urlOf(f);
  const is404 = url === '/404.html' || /404\.html$/.test(f);
  const get = (re) => (html.match(re) || [])[1];
  const title = get(/<title>([^<]*)<\/title>/);
  const desc = get(/<meta name="description" content="([^"]*)"/);
  const canonical = get(/<link rel="canonical" href="([^"]*)"/);
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  const lang = get(/<html lang="([^"]*)"/);
  const og = /property="og:title"/.test(html) && /property="og:image"/.test(html);
  const imgs = html.match(/<img\b[^>]*>/g) || [];
  const noAlt = imgs.filter((i) => !/\balt=/.test(i));
  const lds = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const ldTypes = [];
  for (const ld of lds) { try { const j = JSON.parse(ld); ldTypes.push(j['@type']); } catch { issues.push({ url, type: 'jsonld-invalid' }); } }
  const links = [...html.matchAll(/<a\b[^>]*href="([^"]*)"/g)].map((m) => m[1]);
  const broken = links.filter((h) => h.startsWith('/') && !exists(h));
  const hasBreadcrumb = ldTypes.includes('BreadcrumbList');
  const noindex = /name="robots" content="noindex/.test(html);

  pages.push({ url, title, h1s, ldTypes: ldTypes.join(','), noindex });
  if (!title) issues.push({ url, type: 'title-missing' });
  else { if (title.length > 60) issues.push({ url, type: 'title-long', detail: `${title.length} chars` }); if (!noindex) titles.set(title, [...(titles.get(title) || []), url]); }
  if (!desc) issues.push({ url, type: 'description-missing' });
  else { if (!noindex && (desc.length < 50 || desc.length > 160)) issues.push({ url, type: 'description-length', detail: `${desc.length} chars` }); if (!noindex) descs.set(desc, [...(descs.get(desc) || []), url]); }
  if (h1s !== 1) issues.push({ url, type: 'h1-count', detail: String(h1s) });
  if (!canonical) issues.push({ url, type: 'canonical-missing' });
  else if (!is404 && !canonical.endsWith(url)) issues.push({ url, type: 'canonical-mismatch', detail: canonical });
  if (lang !== 'ja') issues.push({ url, type: 'lang', detail: lang });
  if (!og) issues.push({ url, type: 'ogp-missing' });
  if (noAlt.length) issues.push({ url, type: 'img-alt-missing', detail: noAlt.map((i) => i.slice(0, 80)).join(' | ') });
  if (!is404 && url !== '/' && !noindex && !hasBreadcrumb) issues.push({ url, type: 'breadcrumb-missing' });
  for (const b of broken) issues.push({ url, type: 'broken-link', detail: b });
}
for (const [t, urls] of titles) if (urls.length > 1) issues.push({ url: urls.join(', '), type: 'title-duplicate', detail: t });
for (const [d, urls] of descs) if (urls.length > 1) issues.push({ url: urls.join(', '), type: 'description-duplicate', detail: d.slice(0, 60) });

// sitemap / robots
const sm = fs.existsSync(path.join(root, 'sitemap-index.xml')) && fs.existsSync(path.join(root, 'sitemap-0.xml'));
if (!sm) issues.push({ url: '/', type: 'sitemap-missing' });
else {
  const smx = fs.readFileSync(path.join(root, 'sitemap-0.xml'), 'utf8');
  const locs = [...smx.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  const indexable = pages.filter((p) => !p.noindex && p.url !== '/404.html').map((p) => p.url);
  for (const u of indexable) if (!locs.includes(u)) issues.push({ url: u, type: 'sitemap-missing-url' });
  for (const l of locs) if (!indexable.includes(l)) issues.push({ url: l, type: 'sitemap-extra-url' });
}
if (!fs.existsSync(path.join(root, 'robots.txt'))) issues.push({ url: '/', type: 'robots-missing' });

console.log(`${pages.length} pages audited`);
console.table(pages.map((p) => ({ url: p.url, h1: p.h1s, title: (p.title || '').slice(0, 48), ld: p.ldTypes })));
if (issues.length) { console.table(issues); console.error(`${issues.length} issue(s)`); process.exit(1); }
console.log('No issues found.');
