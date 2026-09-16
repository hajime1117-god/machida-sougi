# アクセス解析・計測設計（GA4 / Search Console / Clarity）

このサイトの計測は `src/scripts/analytics.ts`（全ページ共通、依存ライブラリなし・約3KB）で行います。
測定IDは環境変数で切り替え、未設定の場合は外部スクリプトを読み込まず、イベントはブラウザ内のキュー（`window.__analyticsEvents`）にだけ記録します。

## 1. 設定方法

### 環境変数（`.env` / Cloudflare Pages・Vercel の環境変数）

| 変数 | 内容 | 例 |
|---|---|---|
| `SITE_URL` | 本番URL（canonical / sitemap / OGP に使用） | `https://machida-kotonoha.pages.dev` |
| `PUBLIC_GA4_ID` | GA4 測定ID | `G-XXXXXXXXXX` |
| `PUBLIC_CLARITY_ID` | Microsoft Clarity プロジェクトID | `abcdefghij` |
| `PUBLIC_GSC_VERIFICATION` | Search Console HTMLタグの content 値（DNS/ファイル検証なら不要） | |
| `PUBLIC_FORM_ENDPOINT` | フォーム送信先（Formspree 等）。未設定なら送信せず完了ページへ遷移 | `https://formspree.io/f/xxxx` |
| `PUBLIC_ANALYTICS_DEBUG` | `true` で console 出力 + GA4 DebugView 用 `debug_mode` を付与 | `false` |

`.env.example` をコピーして `.env` を作成してください。ビルド時に埋め込まれるため、変更後は再ビルド（再デプロイ）が必要です。

### GA4 の設定手順

1. [Google アナリティクス](https://analytics.google.com/) でプロパティを作成 → 「ウェブ」データストリームを追加し、測定ID（G-…）を取得
2. 測定IDを `PUBLIC_GA4_ID` に設定して再デプロイ
3. **拡張計測機能**：データストリーム設定で「スクロール数」を **オフ** にする（本サイトは 25/50/75/90/100% を独自イベントで送るため、拡張計測の `scroll`（90%のみ）と重複しないようにする）。「ページビュー」「離脱クリック」「フォームの操作」は任意（フォームは独自イベント `form_start` / `form_submit` があるためオフ推奨）
4. **カスタムディメンション**（管理 → カスタム定義）を作成。イベントスコープで以下を登録するとレポートで内訳が見られる

   | ディメンション名 | イベントパラメータ |
   |---|---|
   | CTA種別 | `cta_type` |
   | CTA位置 | `cta_position` |
   | CTA文言 | `cta_text` |
   | リンク先 | `link_url` |
   | リンク文言 | `link_text` |
   | リンク位置 | `link_position` |
   | ページ種別 | `page_type` |
   | デバイス種別 | `device_type` |
   | FAQ質問 | `faq_question` |
   | 表示アイテム | `item_name` |
   | フォーム名 | `form_name` |
   | フォーム件名 | `form_subject` |
   | スクロール率 | `percent_scrolled`（指標として登録してもよい） |

5. **キーイベント（コンバージョン）**：`tel_click` / `contact_click` / `form_submit` をキーイベントに指定
6. **AI検索からの流入を識別**：管理 → データの表示 → チャネルグループ → 新しいチャネルグループを作成し、以下の条件で「AI検索」チャネルを追加（参照元ドメインの正規表現）

   ```
   chatgpt\.com|openai\.com|gemini\.google\.com|perplexity\.ai|copilot\.microsoft\.com|claude\.ai|bing\.com/chat|you\.com|felo\.ai|genspark\.ai
   ```

   Google AI Overviews / AI Mode からのクリックは参照元が `google` のまま Organic Search に含まれ、GA4 側では区別できません（Search Console 側でも AI Overviews のクリックは通常の検索クリックに合算されます）。
7. **DebugView**：`PUBLIC_ANALYTICS_DEBUG=true` でビルドすると全イベントに `debug_mode: true` が付き、管理 → DebugView にリアルタイムで表示されます

### Search Console の登録手順

1. [Search Console](https://search.google.com/search-console) で「URLプレフィックス」プロパティを追加（`SITE_URL` と同じURL）
2. 所有権の確認：HTMLタグ方式なら content 値を `PUBLIC_GSC_VERIFICATION` に設定して再デプロイ。GA4 連携済みなら「Google アナリティクス」方式でも可
3. 「サイトマップ」に `sitemap-index.xml` を送信（`robots.txt` にも記載済み）
4. 公開後、「URL検査」でトップページと主要ページのインデックス登録をリクエスト
5. 「検索パフォーマンス」で「町田市 葬儀」「町田市 家族葬」のクエリ別クリック・表示回数・掲載順位を追跡。GA4 と連携（管理 → Search Console のリンク）すると GA4 上でもランディングページ別のオーガニック指標が見られる

### Microsoft Clarity の設定手順

1. [Clarity](https://clarity.microsoft.com/) でプロジェクトを作成し、プロジェクトIDを取得
2. `PUBLIC_CLARITY_ID` に設定して再デプロイ
3. Clarity は GA4 と連携できる（設定 → 統合 → Google Analytics）。連携するとセッション録画に GA4 のセッションが紐づく
4. 独自イベントは `clarity('event', name)` でも送信しているため、Clarity のフィルタ「カスタムイベント」で `tel_click` などのセッションだけを録画で確認できる

## 2. 計測イベント一覧

すべてのイベントに共通パラメータ `page_path`（パス）・`page_type`（ページ種別）・`device_type`（mobile / tablet / desktop）が付きます。

| イベント名 | 発火条件 | 固有パラメータ |
|---|---|---|
| `page_view` | ページ表示（gtag の自動送信） | — |
| `scroll_25` `scroll_50` `scroll_75` `scroll_90` `scroll_100` | ページ高さに対する表示位置がその割合に達したとき、各1回。短いページは初期表示で到達分を送信 | `percent_scrolled` |
| `cta_click` | `data-cta` 属性を持つ要素（電話・問い合わせ・フォーム送信ボタン等）のクリック | `cta_type`（tel / contact / form）、`cta_position`、`cta_text`、`link_url` |
| `tel_click` | `tel:` リンクのクリック（`cta_click` と同時に発火） | 同上 |
| `contact_click` | `data-cta="contact"`（問い合わせページへのリンク）のクリック（`cta_click` と同時に発火） | 同上 |
| `internal_link_click` | 本文・関連リンク・パンくず等、同一オリジンへのCTA以外のリンククリック | `link_url`、`link_text`、`link_position`（body / related / breadcrumb / toc / nav / footer など `data-region` の値） |
| `plan_view` | プラン要素（`data-track-view="plan"`）が画面に50%以上表示されたとき、各1回 | `item_name`（家族葬 など）、`item_position` |
| `hall_view` | 斎場・火葬場要素（`data-track-view="hall"`）が画面に50%以上表示されたとき | `item_name`、`item_position` |
| `faq_open` | FAQ（`details[data-faq]`）を開いたとき | `faq_question`、`faq_group` |
| `form_start` | 問い合わせフォームの入力欄に初めてフォーカス/入力したとき（1ページ1回） | `form_name` |
| `form_submit` | フォームのバリデーション通過後、送信時 | `form_name`、`form_subject`（相談内容の選択値） |

### CTA位置（`cta_position`）の値

| 値 | 場所 |
|---|---|
| `header` | ヘッダー右上の電話・相談ボタン、モバイルメニュー内の電話ボタン |
| `hero` | ファーストビュー内 |
| `middle` | 本文途中（料金表・形式説明・式場情報の直後など） |
| `plan` / `cost` / `hall` / `flow` / `faq` | それぞれプラン・費用・式場・流れ・FAQセクション直後のCTA |
| `sidebar` | PC の追従サイドバー |
| `floating` | モバイル下部固定CTA |
| `footer` | フッターのCTA帯 |

### 指標の作り方（GA4 探索レポート）

| 知りたいこと | 計算 |
|---|---|
| CTAクリック率 | `cta_click` のセッション数 ÷ セッション数（セグメント：ページ種別） |
| 電話ボタンタップ率（モバイル） | `tel_click`（device_type=mobile）÷ モバイルセッション数 |
| 問い合わせボタンクリック率 | `contact_click` ÷ セッション数 |
| フォーム到達率 | `/contact/` の `page_view` セッション ÷ 全セッション |
| フォーム入力開始率 | `form_start` ÷ `/contact/` の `page_view` |
| フォーム送信率 | `form_submit` ÷ `form_start` |
| ページ別CV率 | ランディングページ別に `tel_click` + `form_submit` のセッション ÷ セッション |
| スクロール率 | `scroll_50` 等の到達ユーザー ÷ `page_view` ユーザー（ページ別） |
| 回遊 | `internal_link_click` の `link_url` 別集計、セッションあたりのページビュー数 |
| 離脱ページ | 「ページとスクリーン」レポートの離脱数 |

## 3. 動作確認

- 開発時：`PUBLIC_ANALYTICS_DEBUG=true npm run dev` で console にイベントが出ます
- 自動テスト：`npm run test:analytics` が Playwright（インストール済みの Chrome を利用）で主要ページを開き、`window.__analyticsEvents` の内容を検証します
- 本番：GA4 の DebugView、またはリアルタイムレポートで確認

## 4. 実装上の注意

- 計測スクリプトは `type="module"` で読み込まれ、レンダリングをブロックしません。gtag.js は `async` で追加読込します
- Cookie 同意バナーは設置していません（日本国内向け・個人情報保護法上、利用目的の公表で足りるとの整理。プライバシーポリシーに GA4 / Clarity の利用とオプトアウト方法を記載）。EU 向けに公開する場合は Consent Mode の導入を検討してください
- `tel:` リンクは `data-cta="tel"` を付けなくても `tel_click` が記録されます（本文中の電話番号リンク対策）

## 5. AI検索流入の計測に関する補足（2026-09-16 追記）

- 業界報道では 2026年5月に GA4 のデフォルトチャネルグループへ「AI Assistants」が追加されたとされます（Google 公式リリースノートでは未確認）。GA4 管理画面の「チャネルグループ」でデフォルト定義を確認し、存在すればカスタムチャネルは補助として使ってください。
- ChatGPT アプリなどリファラを渡さない経路は `direct / (none)` に混ざるため、GA4 で観測できる AI 流入は下限値です。
- Search Console の「生成AI パフォーマンスレポート」は表示回数のみで、クリック数・クエリは提供されません（2026年9月時点の業界報道）。AI Overviews 経由のクリックは通常の検索パフォーマンスに合算されます。
- 詳細と出典: `docs/research/aio-analytics.md`
