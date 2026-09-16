import type { APIRoute } from 'astro';

/**
 * robots.txt
 * - 全クローラー許可。AI系クローラー（GPTBot / ClaudeBot / PerplexityBot / Google-Extended 等）も
 *   AI検索で引用されることを目的に明示的に許可する。
 */
export const GET: APIRoute = ({ site }) => {
  const base = (site?.toString() || 'https://example.com').replace(/\/$/, '');
  const body = `User-agent: *
Allow: /
Disallow: /contact/thanks/

# AI 検索・生成AI クローラー（引用元として参照されるため許可）
User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Claude-SearchBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: Bingbot
Allow: /

Sitemap: ${base}/sitemap-index.xml
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
