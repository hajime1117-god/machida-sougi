# 町田ことのは葬祭 — 町田市 葬儀・家族葬 SEO/AIO 検証サイト

東京都町田市を対象とした **架空の葬儀社** サイトです。「町田市 葬儀」「町田市 家族葬」を中心とする検索クエリでの自然検索・AI検索（ChatGPT / Gemini / Google AI Overviews / AI Mode）からの流入獲得と、GA4 / Search Console / Microsoft Clarity によるユーザー行動計測の検証を目的としています。

> 実在の葬儀社ではありません。葬儀の受注・施行は行わず、電話番号はダミーです（`src/config/site.ts` で変更可能）。架空の口コミ・実績・資格・スタッフ・創業年などは一切掲載していません。

## 技術構成と選定理由

| 項目 | 採用 | 理由 |
|---|---|---|
| フレームワーク | **Astro 7**（静的生成 / SSG） | 全ページが静的HTMLで出力され、既定でクライアントJSがゼロ。Core Web Vitals（LCP / CLS / INP）と Lighthouse Performance 90+ を情報量を削らずに達成しやすい。ページ数（約30）・更新頻度（低〜中）・無料ホスティング（Cloudflare Pages / Vercel）との相性が良い。Next.js は SSR/ISR・大きなランタイムが不要なため見送り |
| スタイル | 素の CSS（Astro のスコープ付き `<style>` + `src/styles/global.css`） | Tailwind 等のビルド依存を増やさず、CSS は自動でインライン化。デザイントークンは CSS 変数で一元管理 |
| フォント | システムフォント（Hiragino Sans / Noto Sans JP / BIZ UDPGothic フォールバック） | 日本語 Web フォントは数百KB〜MB になり、LCP・CLS の主因になる。読みやすさを損なわないシステムフォントで統一 |
| 画像 | SVG（アイコン・図） + `sharp` による OGP 生成 | 写真素材を使わずクリーンなデザインを成立させ、LCP 要素をテキストにする。写真を追加する場合は `astro:assets` の `<Image>` で WebP/AVIF 変換・遅延読込・サイズ指定（CLS 防止）を行う |
| 計測 | 自前の軽量スクリプト（`src/scripts/analytics.ts`、依存なし） | GTM（約100KB）を使わず gtag.js を非同期読込。CTA 位置・文言・リンク先などをパラメータ化したカスタムイベントを送信。仕様は [docs/analytics.md](docs/analytics.md) |
| 構造化データ | JSON-LD（WebSite / Organization / WebPage / BreadcrumbList / FAQPage / Article） | ページ内に実在する情報のみをマークアップ。架空企業のため `LocalBusiness`（住所・営業時間・レビュー）は使わない |
| サイトマップ | `@astrojs/sitemap` | `sitemap-index.xml` を自動生成し、`robots.txt` から参照 |
| テスト | Playwright（インストール済み Chrome を利用）/ Lighthouse CLI / linkinator / 自前 HTML 監査 | ブラウザのダウンロード不要で、イベント発火・SEO 要素・リンク切れ・パフォーマンスを自動検証 |
| ホスティング | Cloudflare Pages（推奨）または Vercel | 無料枠で静的サイトを公開可能。`public/_headers` でキャッシュ・セキュリティヘッダーを設定済み |

## ディレクトリ構成

```
src/
  config/site.ts        ブランド名・電話番号・計測IDなどの設定（電話番号はここだけ変更）
  layouts/BaseLayout.astro  共通レイアウト（title / description / canonical / OGP / JSON-LD / 計測）
  components/           Header / Footer / FixedCta / Cta / Faq / Breadcrumb / NextLink / LastReviewed / Source
                        MachidaMap（町田市の概略図 SVG）/ PlanPictogram（形式の日程図）/ CostBar（費用構成バー）/ Glance（プラン要約パネル）
  assets/machida-map.json  町田市境界の簡略ポリゴン（OpenStreetMap 由来、位置は概略）
  pages/                各ページ（URL = ディレクトリ構造）
  scripts/analytics.ts  GA4 / Clarity 計測
  styles/global.css     デザイントークン・基本スタイル
docs/
  analytics.md          計測イベント仕様と GA4 / Search Console / Clarity 設定手順
  writing-guide.md      ページ執筆ガイド（雛形・文章ルール・ビルド確認）
  design-guide.md       デザインガイド（視覚部品の使い方・ページ別方針・禁止事項）
  strategy.md           SERP・競合・検索意図分析、キーワードマップ、サイト構造、コンテンツ設計
  research/             調査レポート（競合分析・一次情報・出典）
tools/                  serve / lighthouse / audit / test-analytics スクリプト
public/                 robots.txt(動的生成) / OGP画像 / favicon / _headers
```

## セットアップ

Node.js 24 系（`.nvmrc` 参照）。

```bash
npm install
cp .env.example .env   # SITE_URL・PUBLIC_GA4_ID などを設定
npm run dev            # http://localhost:4321
npm run build          # dist/ に静的出力
```

## 検証

```bash
npm run build && npm run serve &        # dist/ を http://localhost:4173 で配信
npm run audit                            # title重複・H1・canonical・alt・JSON-LD・内部リンク・sitemap
npm run test:analytics                   # Playwright で計測イベント・CTA・フォーム・404・レスポンシブを検証
npm run test:links                       # linkinator でリンク切れ
npm run lighthouse                       # Mobile / Desktop の Lighthouse（lighthouse-reports/ に保存）
```

## 公開手順（Cloudflare Pages）

1. このディレクトリを GitHub リポジトリに push
2. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git
3. ビルド設定：Framework preset **Astro**、Build command `npm run build`、Build output directory `dist`
4. 環境変数：`SITE_URL`（本番URL）、`PUBLIC_GA4_ID`、`PUBLIC_CLARITY_ID`、必要なら `PUBLIC_GSC_VERIFICATION` / `PUBLIC_FORM_ENDPOINT`。`NODE_VERSION=24` も設定
5. デプロイ後、Search Console にプロパティを追加し `sitemap-index.xml` を送信（詳細は docs/analytics.md）

Vercel の場合も同様に Framework preset を Astro にし、環境変数を設定するだけで公開できます。

## 情報の正確性について

行政制度（葬祭費・死亡届）、火葬場・式場の料金や所在地は、町田市・東京都・南多摩斎場組合などの一次情報を確認し、各ページに出典と「情報の最終確認日」を表示しています。年度更新で変わる可能性があるため、公開運用時は定期的に `src/config/site.ts` の `lastReviewed` と各ページの記載を見直してください。

## 検証結果（2026-09-16）

| 項目 | 結果 |
|---|---|
| ページ数 | 29（うち noindex 2: 送信完了・404） |
| HTML 監査（`npm run audit`） | title重複・description重複・H1数・canonical・OGP・alt・JSON-LD・パンくず・内部リンク切れ・sitemap 整合: 問題なし |
| 計測テスト（`npm run test:analytics`） | 27/27 合格（page_view / scroll_25〜100 / cta_click / tel_click / contact_click / internal_link_click / plan_view / hall_view / faq_open / form_start / form_submit、404、レスポンシブ、console エラーなし） |
| リンクチェック（`npm run test:links`） | 全リンク 200 |
| Lighthouse（主要12ページ × Mobile/Desktop） | Performance 100 / Accessibility 100 / Best Practices 100 / SEO 100、CLS 0、TBT 0ms、LCP モバイル 1.1〜1.3s |
| GA4 / Clarity 注入 | 環境変数設定時に gtag.js・clarity.ms が読み込まれ、collect リクエストを確認 |

`lighthouse-reports/summary.json` に最新の計測値を保存しています。

## 2026-09-16 デザイン・UX改修

- TOP のファーストビューを「利用者ベネフィット → 対応形式（家族葬・一日葬・火葬式の料金と日数）→ 町田市の概略図（南多摩斎場の位置）→ 電話/費用CTA → 緊急導線」の構成に再設計
- 形式の違いを日程ピクトグラム（通夜／告別式／火葬）で図示、費用は構成バーで可視化、火葬場・エリアは概略図で位置関係を表示
- 比較表はPCで表、スマホで縦積みカードに自動変換（`.cmp` + `data-label`）。横スクロールの表を廃止
- 葬儀の流れはステップカード（今すること／誰が／決めること／注意／困ったら）、斎場・火葬場は判断ガイドと施設カード
- 見出し・本文・内部リンク・出典・計測属性・構造化データは維持（レビューで欠落なしを確認）。Lighthouse は全ページ Mobile/Desktop とも 4カテゴリ 100 を維持
- Cloudflare Pages で `SITE_URL` 未設定の場合は `CF_PAGES_URL` を canonical に使用

### 第2弾（地域密着型サイト7件の分析を反映）

- FV: 家族葬のイメージイラスト＋「南多摩斎場対応（町田市民は火葬料無料）／追加費用を先に説明／24時間365日・搬送だけの依頼可」の具体的な強み＋「今すぐ搬送について相談」CTA＋「ご希望から選ぶ」（希望→該当ページ）＋対応エリア
- プラン: 「〜したい方」を先出しした3プランのカード（イラスト・日程図・人数・価格）、詳細ページの要約パネルにもイラストを追加
- 斎場・火葬場: 南多摩斎場の施設カードにイラスト、「町田市民なら」のポイント、状況別CTA「斎場について相談」
- 流れ: 「逝去から安置／打ち合わせから火葬／葬儀後」の3段階バー＋ステップ
- 参考サイト分析: `docs/research/regional-fv-analysis.md`
