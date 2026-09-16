// Lighthouse を mobile / desktop 両方で実行し、結果を lighthouse-reports/ に保存して要約を表示する。
// 使い方: node tools/lighthouse.mjs [baseUrl] [path1,path2,...]
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const base = process.argv[2] || 'http://localhost:4173';
const paths = (process.argv[3] || '/,/plans/kazokuso/,/cost/,/machida/,/halls/crematorium/,/first-steps/,/faq/,/contact/').split(',');
const outDir = path.resolve('lighthouse-reports');
fs.mkdirSync(outDir, { recursive: true });
const chrome = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const rows = [];
for (const p of paths) {
  for (const preset of ['mobile', 'desktop']) {
    const slug = (p === '/' ? 'top' : p.replace(/^\/|\/$/g, '').replace(/\//g, '-')) + '-' + preset;
    const out = path.join(outDir, slug + '.json');
    const args = [
      base + p,
      '--output=json', `--output-path=${out}`, '--quiet',
      '--chrome-flags=--headless=new --no-sandbox',
      '--only-categories=performance,accessibility,best-practices,seo',
    ];
    if (preset === 'desktop') args.push('--preset=desktop');
    const r = spawnSync('npx', ['lighthouse', ...args], { env: { ...process.env, CHROME_PATH: chrome }, stdio: 'inherit' });
    if (r.status !== 0 || !fs.existsSync(out)) { rows.push({ path: p, preset, error: 'failed' }); continue; }
    const j = JSON.parse(fs.readFileSync(out, 'utf8'));
    const c = j.categories, a = j.audits;
    rows.push({
      path: p, preset,
      perf: Math.round(c.performance.score * 100), a11y: Math.round(c.accessibility.score * 100),
      bp: Math.round(c['best-practices'].score * 100), seo: Math.round(c.seo.score * 100),
      LCP: a['largest-contentful-paint'].displayValue, CLS: a['cumulative-layout-shift'].displayValue, TBT: a['total-blocking-time'].displayValue,
    });
  }
}
console.table(rows);
fs.writeFileSync(path.join(outDir, 'summary.json'), JSON.stringify(rows, null, 2));
const bad = rows.filter((r) => r.error || r.perf < 90 || r.a11y < 90 || r.bp < 90 || r.seo < 90);
if (bad.length) { console.error('Below threshold:', bad.map((b) => `${b.path} ${b.preset}`).join(', ')); process.exitCode = 1; }
