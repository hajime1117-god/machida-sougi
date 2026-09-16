/**
 * サイト共通の計測スクリプト（GA4 / Microsoft Clarity）
 *
 * - 測定IDは環境変数（PUBLIC_GA4_ID / PUBLIC_CLARITY_ID）から受け取る。未設定なら外部スクリプトを読み込まず、
 *   イベントはローカルのキュー（window.__analyticsEvents）にだけ記録する（自動テスト・開発用）。
 * - 依存ライブラリなし。gtag.js は async で遅延読込し、レンダリングをブロックしない。
 * - イベント仕様は docs/analytics.md を参照。
 */

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
    __analyticsEvents: { name: string; params: Params; ts: number }[];
    __analyticsConfig: { ga4Id: string; clarityId: string; debug: boolean };
  }
}

const cfg = window.__analyticsConfig || { ga4Id: '', clarityId: '', debug: false };
const DEBUG = cfg.debug;
window.__analyticsEvents = window.__analyticsEvents || [];

/* ---------- 共通パラメータ ---------- */

function deviceType(): 'mobile' | 'tablet' | 'desktop' {
  const w = window.innerWidth;
  const coarse = matchMedia('(pointer: coarse)').matches;
  if (w < 768 && coarse) return 'mobile';
  if (w < 1024 && coarse) return 'tablet';
  return 'desktop';
}

function pagePath(): string {
  return location.pathname;
}

function pageType(): string {
  return document.body.dataset.pageType || 'other';
}

function baseParams(): Params {
  return {
    page_path: pagePath(),
    page_type: pageType(),
    device_type: deviceType(),
  };
}

/* ---------- 送信 ---------- */

export function track(name: string, params: Params = {}): void {
  const merged: Params = { ...baseParams(), ...params };
  if (DEBUG) merged.debug_mode = true;
  window.__analyticsEvents.push({ name, params: merged, ts: Date.now() });
  if (DEBUG) console.info('[analytics]', name, merged);
  if (typeof window.gtag === 'function') window.gtag('event', name, merged);
  if (typeof window.clarity === 'function') {
    try {
      window.clarity('event', name);
    } catch {
      /* noop */
    }
  }
}

/* ---------- GA4 / Clarity の読込 ---------- */

function loadGa4(id: string): void {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  // page_view は gtag config が自動送信。send_page_view は既定 true。
  window.gtag('config', id, {
    page_path: pagePath(),
    page_type: pageType(),
    device_type: deviceType(),
    ...(DEBUG ? { debug_mode: true } : {}),
  });
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);
}

function loadClarity(id: string): void {
  // 公式スニペットと等価（依存なしで記述）
  const w = window as unknown as Record<string, unknown>;
  const c = 'clarity';
  const fn = function (...args: unknown[]) {
    ((fn as unknown as { q: unknown[] }).q = (fn as unknown as { q: unknown[] }).q || []).push(args);
  };
  if (!w[c]) w[c] = fn;
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.clarity.ms/tag/${encodeURIComponent(id)}`;
  document.head.appendChild(s);
}

/* ---------- スクロール率 ---------- */

function setupScrollDepth(): void {
  const marks = [25, 50, 75, 90, 100];
  const fired = new Set<number>();
  let ticking = false;
  const check = () => {
    ticking = false;
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - window.innerHeight;
    const pct = scrollable <= 0 ? 100 : Math.min(100, Math.round(((window.scrollY + window.innerHeight) / doc.scrollHeight) * 100));
    for (const m of marks) {
      if (pct >= m && !fired.has(m)) {
        fired.add(m);
        track(`scroll_${m}`, { percent_scrolled: m });
      }
    }
  };
  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(check);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  // 初期表示で既に到達している閾値（短いページ）も記録
  requestAnimationFrame(check);
}

/* ---------- クリック計測（CTA / 電話 / 問い合わせ / 内部リンク） ---------- */

function linkText(el: HTMLElement): string {
  const t = (el.getAttribute('data-cta-text') || el.getAttribute('aria-label') || el.textContent || '').replace(/\s+/g, ' ').trim();
  return t.slice(0, 100);
}

function positionOf(el: HTMLElement): string {
  const explicit = el.getAttribute('data-cta-position');
  if (explicit) return explicit;
  const region = el.closest('[data-region]') as HTMLElement | null;
  return region?.dataset.region || 'body';
}

function setupClicks(): void {
  document.addEventListener(
    'click',
    (e) => {
      const target = (e.target as HTMLElement).closest('a, button') as HTMLElement | null;
      if (!target) return;
      const href = target.getAttribute('href') || '';
      const ctaType = target.getAttribute('data-cta');

      if (ctaType) {
        const common: Params = {
          cta_type: ctaType,
          cta_position: positionOf(target),
          cta_text: linkText(target),
          link_url: href,
        };
        track('cta_click', common);
        if (ctaType === 'tel' || href.startsWith('tel:')) track('tel_click', common);
        if (ctaType === 'contact') track('contact_click', common);
        return;
      }

      if (href.startsWith('tel:')) {
        track('tel_click', { cta_type: 'tel', cta_position: positionOf(target), cta_text: linkText(target), link_url: href });
        return;
      }

      // 内部リンク（同一オリジン、main 内、CTA以外）
      if (target.tagName === 'A' && href && !href.startsWith('#') && !href.startsWith('mailto:')) {
        let url: URL;
        try {
          url = new URL(href, location.href);
        } catch {
          return;
        }
        if (url.origin !== location.origin) return;
        const region = (target.closest('[data-region]') as HTMLElement | null)?.dataset.region || 'body';
        track('internal_link_click', {
          link_url: url.pathname,
          link_text: linkText(target),
          link_position: region,
        });
      }
    },
    { capture: true },
  );
}

/* ---------- 表示計測（プラン / 式場） ---------- */

function setupViewTracking(): void {
  const els = document.querySelectorAll<HTMLElement>('[data-track-view]');
  if (!els.length || !('IntersectionObserver' in window)) return;
  const seen = new WeakSet<Element>();
  const io = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        if (!en.isIntersecting || seen.has(en.target)) continue;
        seen.add(en.target);
        const el = en.target as HTMLElement;
        const kind = el.dataset.trackView; // plan | hall
        track(`${kind}_view`, { item_name: el.dataset.item || '', item_position: positionOf(el) });
        io.unobserve(el);
      }
    },
    { threshold: 0.5 },
  );
  els.forEach((el) => io.observe(el));
}

/* ---------- FAQ 開閉 ---------- */

function setupFaq(): void {
  document.querySelectorAll<HTMLDetailsElement>('details[data-faq]').forEach((d) => {
    d.addEventListener('toggle', () => {
      if (d.open) {
        const q = d.querySelector('summary')?.textContent?.replace(/\s+/g, ' ').trim() || '';
        track('faq_open', { faq_question: q.slice(0, 100), faq_group: d.dataset.faq || '' });
      }
    });
  });
}

/* ---------- フォーム ---------- */

function setupForms(): void {
  document.querySelectorAll<HTMLFormElement>('form[data-form]').forEach((form) => {
    const name = form.dataset.form || 'form';
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      track('form_start', { form_name: name });
    };
    form.addEventListener('focusin', (e) => {
      const t = e.target as HTMLElement;
      if (t.matches('input, textarea, select')) start();
    });
    form.addEventListener('input', start, { once: true });
    form.addEventListener('submit', () => {
      const subject = (form.querySelector<HTMLSelectElement>('[name="subject"]')?.value || '').slice(0, 50);
      track('form_submit', { form_name: name, form_subject: subject });
    });
  });
}

/* ---------- 起動 ---------- */

function init(): void {
  if (cfg.ga4Id) loadGa4(cfg.ga4Id);
  if (cfg.clarityId) loadClarity(cfg.clarityId);
  // page_view: gtag が自動送信。ローカルキューにも記録して検証可能にする。
  window.__analyticsEvents.push({ name: 'page_view', params: baseParams(), ts: Date.now() });
  if (DEBUG) console.info('[analytics] page_view', baseParams());
  setupScrollDepth();
  setupClicks();
  setupViewTracking();
  setupFaq();
  setupForms();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
