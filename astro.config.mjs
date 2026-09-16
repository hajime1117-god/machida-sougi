// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';

const { SITE_URL } = loadEnv(process.env.NODE_ENV || 'production', process.cwd(), '');
const site = (SITE_URL || process.env.SITE_URL || 'https://example.com').replace(/\/$/, '');

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
