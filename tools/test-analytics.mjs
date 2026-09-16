// Playwright（インストール済み Chrome）で主要ページを開き、計測イベントとSEO要素を検証する。
// 使い方: node tools/serve.mjs & → node tools/test-analytics.mjs [baseUrl]
import { chromium } from 'playwright-core';

const base = process.argv[2] || 'http://localhost:4173';
const results = [];
const ok = (name, cond, detail = '') => { results.push({ name, ok: !!cond, detail }); if (!cond) console.error('✗', name, detail); else console.log('✓', name); };

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
let expect404 = false;
page.on('console', (m) => { if (m.type() === 'error' && !(expect404 && m.text().includes('404'))) errors.push(m.text()); });
const events = async () => page.evaluate(() => window.__analyticsEvents || []);
const names = async () => (await events()).map((e) => e.name);

// --- TOP: page_view, scroll, cta/tel click, plan_view ---
await page.goto(base + '/', { waitUntil: 'load' });
ok('top: page_view recorded', (await names()).includes('page_view'));
ok('top: single H1', (await page.locator('h1').count()) === 1);
ok('top: canonical present', (await page.locator('link[rel=canonical]').count()) === 1);
ok('top: description present', !!(await page.getAttribute('meta[name=description]', 'content')));
ok('top: BreadcrumbList/Organization JSON-LD', (await page.locator('script[type="application/ld+json"]').count()) >= 2);
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(400);
const n1 = await names();
ok('top: scroll_25..100 fired', ['scroll_25', 'scroll_50', 'scroll_75', 'scroll_90', 'scroll_100'].every((s) => n1.includes(s)), n1.filter((n) => n.startsWith('scroll')).join(','));
ok('top: plan_view fired', n1.includes('plan_view'));
await page.evaluate(() => window.scrollTo(0, 0));
// tel: へのナビゲーションを抑止（headless Chrome では tel: 遷移の試行後にページ内リンクが動かなくなるため）。計測リスナーは capture で先に登録済みなので発火は妨げない
await page.evaluate(() => document.addEventListener('click', (e) => { const a = e.target.closest('a[href^="tel:"]'); if (a) e.preventDefault(); }, true));
const heroTel = page.locator('[data-region="hero"] a[data-cta="tel"], a[data-cta="tel"][data-cta-position="hero"]').first();
await heroTel.click({ noWaitAfter: true });
await page.waitForTimeout(200);
const ev = await events();
const tel = ev.find((e) => e.name === 'tel_click');
ok('top: tel_click fired', !!tel);
ok('top: tel_click has cta_position/cta_text/page_path/device_type', tel && tel.params.cta_position && tel.params.cta_text && tel.params.page_path && tel.params.device_type, JSON.stringify(tel?.params));
ok('top: cta_click fired with tel', ev.some((e) => e.name === 'cta_click' && e.params.cta_type === 'tel'));
const floatingContact = page.locator('.fixed-cta a[data-cta="contact"]');
ok('top: floating CTA visible on mobile', await floatingContact.isVisible());
await floatingContact.click();
await page.waitForURL('**/contact/');
ok('floating contact_click navigates to /contact/', page.url().endsWith('/contact/'));

// --- Contact: form_start / form_submit ---
await page.goto(base + '/contact/', { waitUntil: 'load' });
await page.fill('#f-name', 'テスト太郎');
ok('contact: form_start fired', (await names()).includes('form_start'));
await page.fill('#f-email', 'test@example.com');
await page.selectOption('#f-subject', '費用について');
await page.check('#f-agree');
await page.click('button[type=submit]');
await page.waitForURL('**/contact/thanks/', { timeout: 5000 }).catch(() => {});
ok('contact: navigated to thanks page', page.url().endsWith('/contact/thanks/'));
ok('thanks: noindex', (await page.getAttribute('meta[name=robots]', 'content'))?.includes('noindex'));

// --- FAQ: faq_open ---
await page.goto(base + '/faq/', { waitUntil: 'load' });
await page.locator('details[data-faq] summary').first().click();
await page.waitForTimeout(150);
const faqEv = (await events()).find((e) => e.name === 'faq_open');
ok('faq: faq_open fired with faq_question', !!faqEv && !!faqEv.params.faq_question, JSON.stringify(faqEv?.params));
ok('faq: FAQPage JSON-LD present', (await page.locator('script[type="application/ld+json"]').allTextContents()).some((t) => t.includes('FAQPage')));

// --- Internal link click ---
await page.goto(base + '/cost/', { waitUntil: 'load' });
const link = page.locator('main a[href^="/"]:not([data-cta])').first();
const href = await link.getAttribute('href');
await link.click();
await page.waitForLoadState('load');
ok('cost: internal_link_click navigates', page.url().includes(href.replace(/\/$/, '')), href);

// --- Halls: hall_view ---
await page.goto(base + '/halls/crematorium/', { waitUntil: 'load' });
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(400);
ok('crematorium: hall_view fired', (await names()).includes('hall_view'));

// --- 404 ---
expect404 = true;
const res = await page.goto(base + '/no-such-page/', { waitUntil: 'load' });
ok('404: status 404', res.status() === 404);
ok('404: has H1', (await page.locator('h1').count()) === 1);
expect404 = false;

// --- Desktop: header CTA & nav visible, fixed CTA hidden ---
const dctx = await browser.newContext({ viewport: { width: 1366, height: 900 } });
const dpage = await dctx.newPage();
await dpage.goto(base + '/', { waitUntil: 'load' });
ok('desktop: nav visible', await dpage.locator('.site-nav__list').isVisible());
ok('desktop: fixed CTA hidden', !(await dpage.locator('.fixed-cta').isVisible()));
ok('desktop: header contact button visible', await dpage.locator('.site-header__contact').isVisible());
ok('desktop: no horizontal scroll', await dpage.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
ok('mobile: no horizontal scroll', await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));

ok('no console/page errors', errors.length === 0, errors.join(' | '));
await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
if (failed.length) process.exit(1);
