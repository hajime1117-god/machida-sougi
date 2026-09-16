// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';

const { SITE_URL } = loadEnv(process.env.NODE_ENV || 'production', process.cwd(), '');

// 優先順: SITE_URL（.env / ホスティングの環境変数）→ Cloudflare Pages の自動環境変数 → 既定値
// CF_PAGES_URL はデプロイごとに固有のサブドメイン（https://<hash>.<project>.pages.dev）なので、
// 本番ブランチ(main)では <project>.pages.dev に正規化する。カスタムドメインを使う場合は SITE_URL を設定すること。
function cloudflareSite() {
  const url = process.env.CF_PAGES_URL;
  if (!url) return '';
  const m = url.match(/^https:\/\/[a-z0-9]+\.([a-z0-9-]+\.pages\.dev)$/i);
  if (m && process.env.CF_PAGES_BRANCH === 'main') return 'https://' + m[1];
  return url;
}
const site = (SITE_URL || process.env.SITE_URL || cloudflareSite() || 'https://example.com').replace(/\/$/, '');

// https://astro.build/config
export default defineConfig({
  site,
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  compressHTML: true,
  integrations: [
    sitemap({
      filter: (page) => !/\/(thanks|404)\/?$/.test(page),
      changefreq: 'weekly',
      lastmod: new Date(),
    }),
  ],
  image: { service: { entrypoint: 'astro/assets/services/sharp' } },
  prefetch: false,
});
