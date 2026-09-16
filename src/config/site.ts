/**
 * サイト全体の設定（ブランド名・電話番号・計測ID など）
 * 電話番号は必ずここだけを変更すれば全ページに反映される。
 */

export const BRAND = {
  /** 正式名称 */
  name: '町田ことのは葬祭',
  /** 読み */
  reading: 'まちだことのはそうさい',
  /** 短縮名（ヘッダー等） */
  short: 'ことのは葬祭',
  /** キャッチコピー */
  tagline: '町田市の家族葬・一日葬・火葬式',
} as const;

export const PHONE = {
  /** 表示用（ハイフン区切り） */
  display: '000-0000-0000',
  /** tel: リンク用 */
  tel: 'tel:0000000000',
  /** 受付時間の表記 */
  hours: '24時間365日受付',
  /** 検証用ダミーである旨（本番では空文字にする） */
  note: '※検証用のダミー番号です（発信されません）',
} as const;

export const SITE = {
  /** 本番URL。astro.config の site と同じ値（末尾スラッシュなし） */
  url: (import.meta.env.SITE || 'https://example.com').replace(/\/$/, ''),
  /** 対象エリア */
  area: '東京都町田市',
  /** サイト全体の「最終確認日」。ページ側で個別に上書き可能 */
  lastReviewed: '2026-09-15',
  /** 運営者情報ページで検証用サイトであることを明記 */
  isDemo: true,
  locale: 'ja_JP',
} as const;

export const ANALYTICS = {
  ga4Id: import.meta.env.PUBLIC_GA4_ID || '',
  clarityId: import.meta.env.PUBLIC_CLARITY_ID || '',
  gscVerification: import.meta.env.PUBLIC_GSC_VERIFICATION || '',
  formEndpoint: import.meta.env.PUBLIC_FORM_ENDPOINT || '',
  debug: String(import.meta.env.PUBLIC_ANALYTICS_DEBUG || '').toLowerCase() === 'true',
} as const;
