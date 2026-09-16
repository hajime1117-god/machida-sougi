# 技術選定調査(2026-09-15 時点)

- 調査日: 2026-09-15
- 対象: 町田の葬儀社向け日本語 SEO 静的サイト(Astro / SSG)
- 前提環境: macOS arm64 / Node.js v24.21.0 / npm 11 / Xcode Command Line Tools なし / Google Chrome インストール済み / `git` コマンド使用不可
- 凡例: 「確認日」は当日 WebFetch / WebSearch / curl で確認した日付。確認できなかった事項は **未確認** と明記。

---

## 0. 結論サマリー

| 項目 | 結論 | 根拠(詳細は各章) |
|---|---|---|
| Astro | **7.3.2** が npm `latest`(2026-09-08 リリース)。Node `>=22.12.0` 必須で Node 24.21.0 は要件を満たす | §1, §2 |
| 画像処理 | `sharp 0.35.4` は macOS ARM64 向けプリビルドバイナリ(`@img/sharp-darwin-arm64`)を optionalDependencies で配布。**プリビルドがある環境ではコンパイラ不要**なので Xcode CLT なしで動く見込み | §2 |
| Lighthouse | `lighthouse 13.4.1`(Node `>=22.19`)。`CHROME_PATH` でローカル Chrome を指定し `--chrome-flags="--headless=new"`。モバイルは既定、デスクトップは `--preset=desktop` | §3 |
| LHCI | `@lhci/cli 0.15.1` は内部で **lighthouse 12.6.1** を固定依存。CLI 単体の 13.x とスコアがずれ得る | §2, §3 |
| 計測タグ | GA4 は公式 `async` スニペットをそのまま `<head>` 直後に。Consent Mode は Google の EU ユーザー同意ポリシー対象(EEA/UK/CH)向けで、日本向けサイトでは必須ではない。日本は外部送信規律(電気通信事業法)の整理が必要だが、総務省 FAQ 1-18 でコーポレートサイトは規制対象役務外 | §4 |
| ホスティング | **Cloudflare Pages(Git 連携)を第一候補**。Vercel Hobby は「非商用・個人利用限定」と明記されており、事業サイトは Pro が必要 | §5 |
| フォント | 第一候補は **システムフォントスタック(Web フォント不使用)**。Noto Sans JP を使う場合は Google Fonts CDN の unicode-range スライス配信(2 ウェイトで 248 個の `@font-face`、全て woff2 / `font-display: swap`)か Astro Fonts API(6.0 で安定版) | §6 |
| 画像なしデザイン | LCP 候補はテキストブロック / `<img>` / `<svg>` 内 `<image>` / `url()` 背景画像のみ。インライン `<svg>` や CSS グラデーションは LCP 候補外なので、ヒーローの見出しテキストを LCP にする設計が有効 | §7 |

---

## 1. Astro 最新安定版と SSG 推奨構成

### 1.1 バージョンと要件

| 事実 | 出典 | 確認日 |
|---|---|---|
| `astro` の npm `latest` は **7.3.2**。`engines.node: ">=22.12.0"`, `npm: ">=9.6.5"`。`optionalDependencies.sharp: "^0.35.4"` | https://registry.npmjs.org/astro/latest | 2026-09-15 |
| GitHub Releases 上の最新は `astro@7.3.2`(Sep 8)。直近: 7.3.1 / 7.3.0(Sep 3)、7.2.10(Aug 31) | https://github.com/withastro/astro/releases | 2026-09-15 |
| Astro 7 は 2026-06-22 リリース。Rust 製コンパイラ、Sätteri(Rust 製 Markdown/MDX 処理)、Vite 8(Rolldown)採用。ビルド時間 15–61% 改善を主張 | https://astro.build/blog/astro-7/ | 2026-09-15 |
| Astro 6 は 2026-03-10 リリース。Fonts API 安定化、Vite 7、Node 22 必須化、CSP 安定化、Live Content Collections 安定化 | https://astro.build/blog/astro-6/ | 2026-09-15 |
| 公式インストール要件: Node.js v22.12.0 以上。「v23 のような奇数バージョンは非対応」 | https://docs.astro.build/en/install-and-setup/ | 2026-09-15 |

→ **Node.js v24.21.0(偶数・LTS 系)は Astro 7 の要件を満たす。**

### 1.2 v6 / v7 の破壊的変更で静的サイトに影響するもの

| 変更 | 影響 | 出典 | 確認日 |
|---|---|---|---|
| (v7) `.astro` コンパイラが Rust 製に。**非 void 要素の閉じタグ必須**、不正なネストを自動修正しない | 手書き HTML の閉じ忘れがビルドエラーになる | https://docs.astro.build/en/guides/upgrade-to/v7/ | 2026-09-15 |
| (v7) Markdown 処理が remark/rehype から Sätteri に。remark/rehype プラグインを使うには `@astrojs/markdown-remark` を明示インストール | プラグイン非依存なら影響なし | 同上 | 2026-09-15 |
| (v7) `compressHTML` の既定が `true` → `'jsx'`(インライン要素間の空白を JSX ルールで除去) | 日本語文中の `<strong>` 等の前後空白の扱いに注意。必要なら `compressHTML: true` に戻す | 同上 / https://docs.astro.build/en/reference/configuration-reference/ | 2026-09-15 |
| (v7) `src/fetch.ts` が予約ファイル名に | 同名ファイルを作らない | https://docs.astro.build/en/guides/upgrade-to/v7/ | 2026-09-15 |
| (v7) `@astrojs/db` はメンテナンス終了 | 未使用なら影響なし | 同上 | 2026-09-15 |
| (v6) レガシー Content Collections 削除。Content Layer API(`src/content.config.ts` + loader)のみ | 新規なら最初から Content Layer で書く | https://docs.astro.build/en/guides/upgrade-to/v6/ | 2026-09-15 |
| (v6) 画像は既定でクロップ、アップスケールしない、SVG ラスタライズ対応(制限あり) | `<Image>` の挙動前提を更新 | 同上 | 2026-09-15 |
| (v6) `Astro.glob()` 削除、`<ViewTransitions />` は `<ClientRouter />` に置換 | View Transitions 不要方針なので影響なし | 同上 | 2026-09-15 |
| (v6) `import.meta.env` の値は常にインライン化(型変換なし) | `PUBLIC_*` の文字列比較で判定する | 同上 | 2026-09-15 |

### 1.3 推奨構成(日本語 SEO / SSG / i18n 不要 / View Transitions 不要)

設定リファレンスの既定値(出典: https://docs.astro.build/en/reference/configuration-reference/ 確認日 2026-09-15):

- `output`: 既定 `'static'`(`'static' | 'server'` のみ)
- `site`: 既定なし。**sitemap と canonical URL 生成に必須**
- `trailingSlash`: 既定 `'ignore'`。`'always' | 'never' | 'ignore'`
- `build.format`: 既定 `'directory'`(`/about/index.html`)
- `compressHTML`: v7 から既定 `'jsx'`
- `image.service`: 既定 sharp(`astro/assets/services/sharp`)
- `image.layout`: `'constrained' | 'fixed' | 'full-width'`(既定なし)、`image.responsiveStyles`: 既定 `false`

```js
// astro.config.mjs(推奨の最小構成)
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://example.com',      // 本番ドメイン(必須)
  output: 'static',                 // 既定値だが明示
  trailingSlash: 'always',          // build.format 'directory' と組み合わせて URL を /path/ に統一
  build: { format: 'directory' },
  integrations: [sitemap()],
  image: {
    layout: 'constrained',          // <Image> に srcset/sizes を自動付与
    responsiveStyles: true,
  },
});
```

補足(根拠):

- `trailingSlash` を `'always'` にする理由: Cloudflare(Pages / Workers static assets)の既定 `auto-trailing-slash` は `/about/index.html` を `/about/` で配信し `/about.html` は `/about` にリダイレクトするため、`directory` 形式 + 末尾スラッシュ統一が最も摩擦が少ない(出典: https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/ 確認日 2026-09-15)。Vercel も `trailingSlash: true` で `/about` → `/about/` に 308 リダイレクトできる(出典: https://vercel.com/docs/project-configuration/vercel-json 確認日 2026-09-15)。
- `@astrojs/sitemap`: `site` 必須。ビルド時に `sitemap-index.xml` と `sitemap-0.xml` を生成。`<link rel="sitemap" href="/sitemap-index.xml" />` を `<head>` に、`robots.txt` に `Sitemap: https://.../sitemap-index.xml` を記載。`filter()` / `customPages` / `serialize()` で調整可能。`changefreq` / `priority` は Google が無視(出典: https://docs.astro.build/en/guides/integrations-guide/sitemap/ 確認日 2026-09-15)。
- `robots.txt` は `src/pages/robots.txt.ts` のエンドポイントで `site` から動的生成する例が公式にある(同上)。
- Content Collections(Content Layer): `src/content.config.ts` に `defineCollection()` + `glob()` loader、`astro/zod` の schema、`getCollection()` / `getEntry()` / `render()`。コレクションは自動でルートにならず `getStaticPaths()` でページ化する(出典: https://docs.astro.build/en/guides/content-collections/ 確認日 2026-09-15)。
- 画像: `astro:assets` の `<Image />` / `<Picture />`。sharp が既定サービスで、`layout` 指定で `srcset` / `sizes` を自動生成(5.10.0 追加)。`public/` 直下の `<img>` は最適化されない。`inferSize` で CLS 回避(出典: https://docs.astro.build/en/guides/images/ 確認日 2026-09-15)。
- カスタム 404: `src/pages/404.astro` が `/404.html` にビルドされ「多くのデプロイ先で自動利用」(出典: https://docs.astro.build/en/basics/astro-pages/ 確認日 2026-09-15)。
- 型チェック: `@astrojs/check 0.9.10`(peer: TypeScript `^5.0.0 || ^6.0.0`)(出典: https://registry.npmjs.org/@astrojs/check/latest 確認日 2026-09-15)。

---

## 2. npm registry の最新版(実測)

全て `https://registry.npmjs.org/<pkg>/latest` を WebFetch(確認日 2026-09-15)。

| パッケージ | latest | engines / 依存メモ | 出典 |
|---|---|---|---|
| astro | **7.3.2** | node `>=22.12.0`, npm `>=9.6.5`; optionalDeps `sharp ^0.35.4`; peer(optional) `@astrojs/markdown-remark ^7.3.0` | https://registry.npmjs.org/astro/latest |
| @astrojs/sitemap | **3.7.4** | deps `sitemap ^9.0.0`, `zod ^4.3.6`; peerDependencies 記載なし | https://registry.npmjs.org/@astrojs/sitemap/latest |
| @astrojs/check | **0.9.10** | peer `typescript ^5.0.0 \|\| ^6.0.0` | https://registry.npmjs.org/@astrojs/check/latest |
| sharp | **0.35.4** | node `>=20.9.0`; `config.libvips >=8.18.6`; optionalDeps に `@img/sharp-darwin-arm64 0.35.4`, `@img/sharp-libvips-darwin-arm64 1.3.3` 等(darwin/linux/win32 各種 + wasm32) | https://registry.npmjs.org/sharp/latest |
| @img/sharp-darwin-arm64 | **0.35.4** | os `darwin`, cpu `arm64`, node `>=20.9.0`; optionalDep `@img/sharp-libvips-darwin-arm64 1.3.3` | https://registry.npmjs.org/@img/sharp-darwin-arm64/latest |
| lighthouse | **13.4.1** | node `>=22.19` | https://registry.npmjs.org/lighthouse/latest |
| @lhci/cli | **0.15.1** | engines 記載なし; **deps `lighthouse: 12.6.1`(固定)** | https://registry.npmjs.org/@lhci/cli/latest |
| playwright | **1.63.0** | node `>=20` | https://registry.npmjs.org/playwright/latest |
| playwright-core | **1.63.0** | node `>=20` | https://registry.npmjs.org/playwright-core/latest |
| @playwright/test | **1.63.0** | node `>=20` | https://registry.npmjs.org/@playwright/test/latest |
| linkinator | **8.1.0** | node `>=22`; `"type": "module"` | https://registry.npmjs.org/linkinator/latest |
| @microsoft/clarity | **1.0.2** | MIT; npm 経由で `Clarity.init(projectId)` を使う選択肢 | https://registry.npmjs.org/@microsoft/clarity/latest |

### 2.1 sharp は Xcode CLT なしで動くか

| 事実 | 出典 | 確認日 |
|---|---|---|
| 前提: Node-API v9 互換ランタイム = Node.js `>=20.9.0`。**macOS ARM64 向けプリビルドバイナリを提供**。「プリビルドが使える場合コンパイラは不要」。ソースビルドが必要になるのは `npm explore sharp -- npm run build` を明示実行した場合等で、その際は C++17 コンパイラ + node-addon-api + node-gyp が要る。`SHARP_IGNORE_GLOBAL_LIBVIPS` でグローバル libvips 検出をスキップ可能 | https://sharp.pixelplumbing.com/install/ | 2026-09-15 |
| プリビルドは npm の optionalDependencies(`@img/sharp-darwin-arm64` + `@img/sharp-libvips-darwin-arm64`)として配布される | https://registry.npmjs.org/sharp/latest | 2026-09-15 |
| sharp v0.35.4 は 2026-08-26 リリース(GitHub Releases の相対日付「26 Aug」より) | https://github.com/lovell/sharp/releases | 2026-09-15 |

→ **判断: Node 24.21.0 / arm64 / Xcode CLT なしでも `npm install` でプリビルドが入り動作する見込み。** 注意点:
- `.npmrc` に `omit=optional` / `--no-optional` があるとプリビルドが入らない(optionalDependencies 経由のため)。
- Homebrew 等でグローバル libvips が入っていると検出されソースビルドを試みる可能性がある。`SHARP_IGNORE_GLOBAL_LIBVIPS=1 npm install` で回避(公式 install ページ記載の環境変数)。
- 動作確認コマンド例: `node -e "import('sharp').then(m=>console.log(m.default.versions))"`。
- **未確認**: sharp の changelog 本文(v0.35.0 の libvips 版数や Node 24 への言及)は取得できず(sharp.pixelplumbing.com/changelog はリダイレクトのみ、GitHub の changelog.md は 404)。

---

## 3. Lighthouse CLI をローカル Chrome で実行する手順

### 3.1 Chrome の指定(`CHROME_PATH`)

| 事実 | 出典 | 確認日 |
|---|---|---|
| Lighthouse は chrome-launcher を使い、検出順は (1) `chromePath` オプション → (2) **`CHROME_PATH` 環境変数** → (3) Chrome Canary → (4) Chrome Stable。`LIGHTHOUSE_CHROMIUM_PATH` は非推奨 | https://github.com/GoogleChrome/chrome-launcher/blob/main/README.md | 2026-09-15 |
| CLI README: `--chrome-flags` は空白区切りで Chrome に渡す。`CHROME_PATH` 環境変数で使用する Chrome バイナリを指定可(Chromium 66+)。例 `lighthouse <url> --quiet --chrome-flags="--headless"` | https://github.com/GoogleChrome/lighthouse/blob/main/readme.md | 2026-09-15 |
| headless ドキュメント: `lighthouse --chrome-flags="--headless" https://github.com`。`--headless=new` は「旧 headless で省略されていた機能を含む」新モード。Node 22 LTS 以降が必要 | https://github.com/GoogleChrome/lighthouse/blob/main/docs/headless-chrome.md | 2026-09-15 |
| Chrome 132 で旧 headless はバイナリから削除され、`--headless` も `--headless=new` も**新 headless** を起動する(どちらも有効) | https://developer.chrome.com/blog/removing-headless-old-from-chrome | 2026-09-15 |

### 3.2 実行コマンド例(macOS)

```bash
# ローカル Chrome を明示(chrome-launcher の検出順 2 位)
export CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# モバイル(既定プリセット: formFactor=mobile, 412x823 / DSF 1.75)
npx lighthouse@13 http://localhost:4321/ \
  --chrome-flags="--headless=new" \
  --output=html --output=json --output-path=./reports/mobile \
  --only-categories=performance,accessibility,best-practices,seo --quiet

# デスクトップ(--preset=desktop: formFactor=desktop, 1350x940 / DSF 1)
npx lighthouse@13 http://localhost:4321/ --preset=desktop \
  --chrome-flags="--headless=new" \
  --output=html --output-path=./reports/desktop.html --quiet
```

| 事実 | 出典 | 確認日 |
|---|---|---|
| `--preset` は `perf` / `experimental` / `desktop`。`--form-factor` は `mobile` / `desktop`(スコアリングとモバイル専用監査の有無に影響)。`--screenEmulation.disabled` や width/height/deviceScaleFactor を個別指定可。`--output` は `json` / `html` / `csv`、`--output-path`、`--only-categories`、`--quiet` | https://github.com/GoogleChrome/lighthouse/blob/main/readme.md | 2026-09-15 |
| 既定設定は `formFactor: 'mobile'`、screenEmulation mobile = 412×823 / DSF 1.75、desktop = 1350×940 / DSF 1。既定スロットリングは `mobileSlow4G`(数値は Lantern モジュール側にあり本調査では**未確認**) | https://github.com/GoogleChrome/lighthouse/blob/main/core/config/constants.js | 2026-09-15 |
| `desktop-config.js` は `formFactor: 'desktop'`, `throttling: desktopDense4G`, `screenEmulation: desktop`, `emulatedUserAgent: desktop` | https://github.com/GoogleChrome/lighthouse/blob/main/core/config/desktop-config.js | 2026-09-15 |
| カスタム設定は `lighthouse --config-path=path/to/custom-config.js <url>` | https://github.com/GoogleChrome/lighthouse/blob/main/docs/configuration.md | 2026-09-15 |
| ばらつき対策: 「5 回の中央値は 1 回の 2 倍安定」。中央値/90 パーセンタイルで評価、2 コア/4GB 以上、同時実行を避ける、simulated throttling が最も安定 | https://github.com/GoogleChrome/lighthouse/blob/main/docs/variability.md | 2026-09-15 |
| lighthouse 13.4.1 は Node `>=22.19`(13.0.0 で最小 Node を 22.19 に引き上げ) | https://registry.npmjs.org/lighthouse/latest / https://github.com/GoogleChrome/lighthouse/releases | 2026-09-15 |

- Node 24.21.0 は要件を満たす。
- **未確認**: GitHub Releases ページから読み取った各リリース日付は相対表記で年が判別できず、本書では採用しない(バージョン番号と Node 要件のみ採用)。

### 3.3 Lighthouse CI(`@lhci/cli`)で dist を一括計測

```js
// lighthouserc.cjs
module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',            // 静的ファイルをローカルサーバで配信
      url: ['http://localhost/', 'http://localhost/kazokuso/'],
      numberOfRuns: 3,
      settings: { preset: 'desktop', chromeFlags: '--headless=new' },
      // chromePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    },
    assert: { preset: 'lighthouse:recommended' },
    upload: { target: 'filesystem', outputDir: './reports/lhci' },
  },
};
```

| 事実 | 出典 | 確認日 |
|---|---|---|
| `npm install -g @lhci/cli@0.15.x` → `lhci autorun`。`collect.staticDistDir` で静的サイトを配信して計測。Chrome の場所は `export CHROME_PATH=...` で指定(Jenkins 例) | https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/getting-started.md | 2026-09-15 |
| `collect`: `staticDistDir` / `url` / `numberOfRuns`(既定 3)/ `settings`(例 `preset: "desktop"`)/ `chromePath`。`assert.preset`: `lighthouse:all` / `lighthouse:recommended` / `lighthouse:no-pwa`。`upload.target`: `temporary-public-storage` / `lhci` / `filesystem` | https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md | 2026-09-15 |
| `@lhci/cli 0.15.1` の依存は `lighthouse 12.6.1` 固定 | https://registry.npmjs.org/@lhci/cli/latest | 2026-09-15 |

→ **注意: LHCI は Lighthouse 12.6.1 を同梱**するため、CLI 単体の 13.4.1 と監査内容・スコアが一致しない可能性がある。最終確認は `npx lighthouse@13` 側を正とし、LHCI は回帰検知用と割り切る。

### 3.4 その他ツール(ローカル Chrome 前提)

| 事実 | 出典 | 確認日 |
|---|---|---|
| Playwright は `channel: 'chrome'` でマシンにインストール済みの Google Chrome を使える(`npx playwright install` によるブラウザ DL 不要)。`chromium.launch({ channel: 'chrome' })`、`executablePath` も指定可。playwright-core も同 API | https://playwright.dev/docs/browsers , https://playwright.dev/docs/api/class-browsertype | 2026-09-15 |
| linkinator: `npx linkinator ./dist --recurse`(ローカルフォルダ)/ `npx linkinator https://example.com`。`--skip` 正規表現、`--format JSON/CSV`、`--timeout`、`--concurrency`(既定 100)、`--verbosity`、`--check-fragments`、`linkinator.config.json` | https://github.com/JustinBeckwith/linkinator/blob/main/README.md | 2026-09-15 |

---

## 4. GA4 gtag.js / Microsoft Clarity / 環境変数切り替え

### 4.1 GA4(gtag.js)の公式スニペットと配置

| 事実 | 出典 | 確認日 |
|---|---|---|
| 公式スニペットは `<script async src="https://www.googletagmanager.com/gtag/js?id=TAG_ID"></script>` + `dataLayer` / `gtag('js', new Date())` / `gtag('config','TAG_ID')`。「計測する全ページの `<head>` 開始タグ直後に配置」 | https://developers.google.com/tag-platform/gtagjs/install | 2026-09-15 |
| 測定 ID は 管理 > データストリーム > ウェブ から取得(`G-` で始まる)。「`<head>` の直後に貼り付け」。反映まで最大 30 分、Realtime で確認 | https://support.google.com/analytics/answer/9304153 | 2026-09-15 |
| web.dev: 早めに実行したいスクリプト(アナリティクス等)は `async`、後回しでよいものは `defer`。重要なサードパーティ origin には `preconnect`(未使用接続は 10 秒で閉じるので乱用しない) | https://web.dev/articles/efficiently-load-third-party-javascript | 2026-09-15 |

→ **方針: Google 提供の `async` スニペットを改変せず使う(`defer` / Partytown は使わない)。** `async` は HTML パースをブロックしないため静的サイトでの追加コストは小さい。preconnect は任意(`https://www.googletagmanager.com`)。

### 4.2 Consent Mode の要否(日本向け)

| 事実 | 出典 | 確認日 |
|---|---|---|
| Google の EU ユーザー同意ポリシーは **EEA / UK / スイスのエンドユーザー**に適用され、それ以外の地域のユーザーには適用されない。対象は Cookie 等のローカルストレージ利用と広告パーソナライズ向け個人データ | https://www.google.com/about/company/user-consent-policy/ | 2026-09-15 |
| Consent Mode は同意状態を Google タグに伝える仕組み。`gtag('consent','default',{...})` を `region: ['ES','US-AK']` のように**同意バナーを出す地域に限定**するのがベストプラクティス。2023-11 更新は EEA トラフィック向け | https://developers.google.com/tag-platform/security/guides/consent | 2026-09-15 |
| GA ヘルプ / Google 広告ヘルプの Consent Mode 解説は EEA/CH/UK の地域差に触れるが、それ以外の地域で必須とは書いていない | https://support.google.com/analytics/answer/9976101 , https://support.google.com/google-ads/answer/10000067 | 2026-09-15 |
| 日本: 電気通信事業法の外部送信規律(2023-06-16 施行)。利用者情報を外部送信する際、送信される情報の内容・送信先・利用目的の通知/公表等が必要。アクセス解析タグも対象例に含まれる | https://www.soumu.go.jp/main_sosiki/joho_tsusin/d_syohi/gaibusoushin_kiritsu.html | 2026-09-15 |
| 総務省 FAQ: **FAQ 1-18 でサービス提供企業のコーポレートサイトは規制対象役務の対象外**(ただし規制対象役務へのリンク先は別途判断)。FAQ 1-3 で利用者を識別できない情報の送信は確認措置不要 | https://www.soumu.go.jp/main_sosiki/joho_tsusin/d_syohi/gaibusoushin_kiritsu_00002.html | 2026-09-15 |

→ **判断: 日本国内向け・EEA/UK/CH の訪問者を想定しないサイトでは Consent Mode は必須ではない。** ただし外部送信規律の趣旨に沿い、プライバシーポリシーに GA4 / Clarity の送信先・送信情報・利用目的を明記しておく(コーポレートサイトは FAQ 上「対象外」だが、記載しておくのが安全側)。
- **未確認**: 葬儀社サイト(問い合わせ / 資料請求フォーム付き)が「規制対象役務」に該当しないかの法的判断は本調査の範囲外。必要なら FAQ 原文と弁護士確認を推奨。

### 4.3 Microsoft Clarity

| 事実 | 出典 | 確認日 |
|---|---|---|
| 設置は「Settings → Setup → Install manually → Get tracking code」でコードを取得し **`<head>` に貼り付け**。データは即時反映。既定で機微コンテンツはマスク。18 歳未満向けサイトには使用不可。GTM 連携 / npm(`@microsoft/clarity`)も可 | https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-setup | 2026-09-15 |
| 2025-10-31 以降、**EEA / UK / CH 発のアクセスには同意シグナルを必須化**。これらの地域は Consent Mode が既定で有効。Consent Mode を全体で有効にするには Settings → Setup の Cookies を OFF | https://learn.microsoft.com/en-us/clarity/setup-and-installation/consent-mode | 2026-09-15 |
| 同意 API v2: `window.clarity('consentv2', { ad_Storage: 'granted'\|'denied', analytics_Storage: 'granted'\|'denied' })`。旧 `clarity('consent', true)` は非推奨予定 | https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-consent-api-v2 | 2026-09-15 |
| CSP を使う場合は `default-src 'self' https://*.clarity.ms https://c.bing.com 'unsafe-inline';` 等を許可(`www.clarity.ms`, `[a-z].clarity.ms`, `c.bing.com`) | https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-csp | 2026-09-15 |
| スニペット本文(公式ページでは画像掲載のため、第三者ページの転記で確認): `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "PROJECT_ID");` | https://codesnippets.pro/doc/microsoft-clarity/ (二次情報) | 2026-09-15 |

→ Clarity スニペットも `async` でスクリプトを挿入する形式。**実装時は必ず Clarity ダッシュボードから最新コードをコピーする**(上記は二次情報)。

### 4.4 Astro での環境変数切り替え(`PUBLIC_GA4_ID` / `PUBLIC_CLARITY_ID`)

| 事実 | 出典 | 確認日 |
|---|---|---|
| `PUBLIC_` 接頭辞の変数のみクライアント側に公開。`.env` / `.env.production` を読み、`import.meta.env.PUBLIC_XXX` でアクセス。`astro:env` では `envField.string({ context: 'client', access: 'public' })` で型安全に定義 | https://docs.astro.build/en/guides/environment-variables/ | 2026-09-15 |
| `<script is:inline>` は Astro の処理(バンドル / TS / import 解決)を受けずそのまま出力。外部 URL の `src` に使う。`define:vars` を `<script>` に付けると **自動的に `is:inline` 扱い**になり、フロントマターの値を JSON.stringify で注入できる | https://docs.astro.build/en/reference/directives-reference/ , https://docs.astro.build/en/guides/client-side-scripts/ | 2026-09-15 |
| v6 以降 `import.meta.env` は常にインライン化(型変換なし) | https://docs.astro.build/en/guides/upgrade-to/v6/ | 2026-09-15 |

実装例(`src/components/Analytics.astro`。`<head>` の先頭付近で `<Analytics />`):

```astro
---
// 未設定(空文字)なら何も出力しない → ローカル/プレビューでは計測しない
const ga4 = import.meta.env.PUBLIC_GA4_ID ?? '';
const clarity = import.meta.env.PUBLIC_CLARITY_ID ?? '';
---
{ga4 && (
  <>
    <script is:inline async src={`https://www.googletagmanager.com/gtag/js?id=${ga4}`}></script>
    <script is:inline define:vars={{ ga4 }}>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', ga4);
    </script>
  </>
)}
{clarity && (
  <script is:inline define:vars={{ clarity }}>
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", clarity);
  </script>
)}
```

運用:
- ローカル `.env` には書かない(=無効)。本番は Cloudflare / Vercel の環境変数に `PUBLIC_GA4_ID=G-XXXXXXXXXX`、`PUBLIC_CLARITY_ID=xxxxxxxxxx` を設定してビルド(値はビルド時にインライン化される)。
- 型安全にしたい場合は `astro.config.mjs` の `env.schema` に `PUBLIC_GA4_ID: envField.string({ context: 'client', access: 'public', optional: true })` を定義し `import { PUBLIC_GA4_ID } from 'astro:env/client'` を使う(`optional` の可否は上記ドキュメントの `envField` 節を参照。本調査では `optional` オプションの存在を**未確認**)。

---

## 5. Cloudflare Pages と Vercel での無料公開(GitHub 連携)

### 5.1 Cloudflare — 2 つの選択肢(Pages / Workers static assets)

| 事実 | 出典 | 確認日 |
|---|---|---|
| Astro 公式デプロイガイドは「Cloudflare は新規プロジェクトに Workers を推奨」と記載。静的サイトはアダプタ不要、`npx astro build`、`wrangler.jsonc` に `assets.directory: "./dist"`、カスタム 404 は `assets.not_found_handling: "404-page"` | https://docs.astro.build/en/guides/deploy/cloudflare/ | 2026-09-15 |
| Cloudflare の Pages→Workers 移行ガイド: Pages は非推奨ではなく引き続きサポート。両者とも `_headers` / `_redirects` / カスタム 404 / プレビュー URL / Git 連携 / ロールバックに対応。Pages のみ: Early Hints、ファイルベースルーティング、Cloudflare ゾーン外カスタムドメイン等 | https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/ | 2026-09-15 |

#### (A) Cloudflare Pages(Git 連携)— 本件の第一候補

| 設定 / 事実 | 値 | 出典 | 確認日 |
|---|---|---|---|
| 手順 | Workers & Pages → Create application → Pages → Connect to Git → GitHub 認可 → リポジトリ選択 → Framework preset / Build command / Build output directory / 環境変数(例 `NODE_VERSION`)→ Save and Deploy。Git 連携で作ると後から Direct Upload に切替不可 | https://developers.cloudflare.com/pages/get-started/git-integration/ | 2026-09-15 |
| Astro プリセット | Build command `npm run build`、Build output directory `dist`、Production branch `main` | https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/ | 2026-09-15 |
| Node バージョン | v3 ビルドイメージの既定は **Node.js 22.16.0**(npm 10.9.2)。`NODE_VERSION` 環境変数、または `.nvmrc` / `.node-version` で上書き。`package.json` の engines からのパッケージマネージャ検出は非対応 | https://developers.cloudflare.com/pages/configuration/build-image/ | 2026-09-15 |
| 無料枠 | 500 ビルド/月、同時 1 ビルド、ビルド 20 分タイムアウト、20,000 ファイル/サイト、25 MiB/ファイル、プレビューデプロイ無制限、100 プロジェクト/アカウント。`_headers` 100 ルール、`_redirects` 静的 2,000 + 動的 100 | https://developers.cloudflare.com/pages/platform/limits/ | 2026-09-15 |
| 静的アセットの配信 | 「静的アセットへのリクエストは無料・無制限」。Functions は Workers Free と合算 100,000 リクエスト/日 | https://developers.cloudflare.com/pages/functions/pricing/ | 2026-09-15 |
| 商用利用 | コミュニティ回答では「無料プランで商用サイトを運用可(SLA・直接サポートなし)」とされる。**公式規約での明文はページ取得不可(403)のため未確認** | https://community.cloudflare.com/t/is-cloudflare-pages-workers-free-plan-free-for-commercial-use/291741 (WebSearch スニペット) | 2026-09-15 |
| `_headers` | 出力ルート(Astro なら `public/_headers` → `dist/_headers`)。書式は `/path` 行 + インデントしたヘッダ行。`*` / `:placeholder`、100 ルール、1 行 2,000 文字。Functions のレスポンスには適用されない | https://developers.cloudflare.com/pages/configuration/headers/ | 2026-09-15 |
| `_redirects` | `[source] [destination] [code?]`、対応コード 301/302/303/307/308(既定 302)、`*`→`:splat`、`:name`。静的 2,000 + 動的 100、1 件 1,000 文字。**redirects は headers より先に評価** | https://developers.cloudflare.com/pages/configuration/redirects/ | 2026-09-15 |
| 404 / HTML 正規化 | 最も近い `404.html` を探索し最終的に `/404.html`。**トップに `404.html` が無いと SPA と見なして全パスを `/` にフォールバック**。`/contact.html` → `/contact`、`/about/index.html` → `/about/` にリダイレクト | https://developers.cloudflare.com/pages/configuration/serving-pages/ | 2026-09-15 |

`public/_headers` の例:

```
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
/_astro/*
  Cache-Control: public, max-age=31536000, immutable
```

`public/_redirects` の例:

```
/old-page/  /new-page/  301
```

推奨: Cloudflare 側の `NODE_VERSION` を `24`(ローカルと一致)または `22` に明示。`src/pages/404.astro` を必ず用意(SPA フォールバック回避)。

#### (B) Workers static assets(Workers Builds)

| 設定 / 事実 | 値 | 出典 | 確認日 |
|---|---|---|---|
| wrangler 設定 | `assets.directory: "./dist"`、`not_found_handling: "404-page"`(または `single-page-application`)、`run_worker_first` で一部パスだけ Worker 実行 | https://developers.cloudflare.com/workers/static-assets/ | 2026-09-15 |
| HTML 正規化 | `html_handling` 既定 `auto-trailing-slash`: `/about/index.html` → `/about/`(200)、`/about.html` → `/about`(307)。`force-trailing-slash` / `drop-trailing-slash` / `none` | https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/ | 2026-09-15 |
| `_headers` / `_redirects` | アセットディレクトリに配置(Astro なら `public/`)。Pages と同書式・同上限。**Worker コードが生成したレスポンスには適用されない** | https://developers.cloudflare.com/workers/static-assets/headers/ , https://developers.cloudflare.com/workers/static-assets/redirects/ | 2026-09-15 |
| Workers Builds | build command(例 `npm run build`)→ deploy command(既定 `npx wrangler deploy`、非本番ブランチは `npx wrangler versions upload`)。Root directory / 環境変数設定可 | https://developers.cloudflare.com/workers/ci-cd/builds/configuration/ | 2026-09-15 |
| ビルドイメージの Node | 既定 **Node.js 24.18.0**(22.23.2 もプリインストール)。`NODE_VERSION` / `.nvmrc` / `.node-version` で上書き。npm 10.9.2 / yarn 4.9.1 / pnpm 10.11.1 / Bun 1.2.15 | https://developers.cloudflare.com/workers/ci-cd/builds/build-image/ | 2026-09-15 |
| Workers Builds 無料枠 | 3,000 ビルド分/月、同時 1、タイムアウト 20 分 | https://developers.cloudflare.com/workers/ci-cd/builds/limits-and-pricing/ | 2026-09-15 |
| 静的アセット課金/上限 | 静的アセットへのリクエストは無料・無制限(Workers のリクエスト上限に数えない)。20,000 ファイル(Free)/ 100,000(Paid)、25 MiB/ファイル。Workers Free はスクリプト実行 100,000 req/日・CPU 10ms | https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/ , https://developers.cloudflare.com/workers/platform/limits/ | 2026-09-15 |

### 5.2 Vercel

| 設定 / 事実 | 値 | 出典 | 確認日 |
|---|---|---|---|
| 静的 Astro | 「Astro を自動検出し適切な設定を行う」。**静的サイトにアダプタ(`@astrojs/vercel`)は不要**。GitHub に push → Vercel で Import → 以後 push ごとにプレビュー、本番ブランチで本番デプロイ | https://docs.astro.build/en/guides/deploy/vercel/ | 2026-09-15 |
| Vercel 側ドキュメント | 「静的 Astro はゼロコンフィグでデプロイ可」。Web Analytics / Image Optimization を使う場合のみアダプタが必要。注: 同ページの例に `output: 'hybrid'` があるが、現行 Astro の `output` は `'static' \| 'server'` のみ(設定リファレンス)で古い記述 | https://vercel.com/docs/frameworks/astro , https://docs.astro.build/en/reference/configuration-reference/ | 2026-09-15 |
| Framework preset | ダッシュボード Settings → Build and Deployment で Framework Preset(Astro あり)、Build Command、Output Directory、Install Command を上書き可。検出時は自動設定 | https://vercel.com/docs/builds/configure-a-build | 2026-09-15 |
| Build command / Output directory の既定文字列 | **未確認**(Vercel ドキュメントは「自動設定」とだけ記載)。Astro の既定出力は `dist` なので、手動指定する場合は `npm run build` / `dist` | — | 2026-09-15 |
| Node バージョン | 新規プロジェクトの既定は **24.x**(他に 22.x / 20.x)。Settings → Build and Deployment → Node.js Version、または `package.json` の `engines.node: "24.x"` で上書き。Node 20 は 2026-10-01 に非推奨予定(changelog 見出し) | https://vercel.com/docs/functions/runtimes/node-js/node-js-versions | 2026-09-15 |
| `vercel.json` headers | `{"headers":[{"source":"/(.*)","headers":[{"key":"X-Content-Type-Options","value":"nosniff"}]}]}` 形式 | https://vercel.com/docs/project-configuration/vercel-json | 2026-09-15 |
| `vercel.json` redirects | `{"source":"/old","destination":"/new","permanent":true}`(`permanent: true` → 308、`false` → 307。`statusCode` で 301/302/303 指定可、`permanent` と併用不可)。`/blog/:path*` 形式のパターン可 | 同上 | 2026-09-15 |
| `cleanUrls` / `trailingSlash` | `cleanUrls` 既定 `false`(true で `.html` を除去)。`trailingSlash` 既定 `undefined`、`true` で `/about` → `/about/` に 308、`false` で逆 | 同上 | 2026-09-15 |
| ルート数上限 | headers / redirects / rewrites の各 1 件が「Route」として数えられ、上限 2,048/デプロイ | https://vercel.com/docs/limits | 2026-09-15 |
| カスタム 404 | 「Output Directory に `404.html` を出力すればルート不一致時に 404 ページとして配信」。別ファイル名にしたい場合は `routes` で `{ "handle": "filesystem" }` + `{ "src": "/(.*)", "status": 404, "dest": "/other-404.html" }` | https://vercel.com/kb/guide/custom-404-page | 2026-09-15 |
| Hobby 制限 | 200 プロジェクト、100 デプロイ/日、ビルド 45 分、同時 1 ビルド、ソースアップロード 100 MB、Fast Data Transfer 100 GB/月、Hobby は **Git 組織(Organization)所有リポジトリを接続不可** | https://vercel.com/docs/limits , https://vercel.com/docs/limits/fair-use-guidelines | 2026-09-15 |
| **商用利用** | 「Hobby チームは非商用・個人利用に限定。全ての商用利用は Pro または Enterprise が必要」。商用の定義に「商品・サービスの販売広告」「サイト作成/更新/ホスティングの対価受領」を含む | https://vercel.com/docs/limits/fair-use-guidelines | 2026-09-15 |

`vercel.json` の例(静的 Astro / `trailingSlash: 'always'` 前提):

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "trailingSlash": true,
  "headers": [
    { "source": "/(.*)", "headers": [
      { "key": "X-Content-Type-Options", "value": "nosniff" },
      { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
    ]},
    { "source": "/_astro/(.*)", "headers": [
      { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
    ]}
  ],
  "redirects": [
    { "source": "/old-page/", "destination": "/new-page/", "statusCode": 301 }
  ]
}
```

### 5.3 ホスティング判断

- 葬儀社の集客サイトは Vercel の定義上「商用」に該当するため **Vercel Hobby は規約違反**になる。無料で運用するなら **Cloudflare Pages(または Workers static assets)** を採用し、Vercel は Pro 契約時のみ選択肢とする。
- Cloudflare Pages と Workers のどちらでも `public/_headers` / `public/_redirects` / `src/pages/404.astro` の構成はそのまま使える。まずは設定項目が少ない **Pages(Git 連携、Astro プリセット、`NODE_VERSION=24`)** から始め、必要なら Workers に移行する。

---

## 6. 日本語 Web フォント最適化と CLS 対策

### 6.1 Noto Sans JP の配信実態(実測)

| 事実 | 出典 | 確認日 |
|---|---|---|
| Google Fonts CSS(`family=Noto+Sans+JP:wght@400;700&display=swap`)を Chrome UA で取得すると **`@font-face` 248 個**(2 ウェイト × 124 スライス)。全て `format('woff2')`、`font-display: swap`、各ブロックに `unicode-range` が付与(頻度ベースの分割) | https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap (curl, Chrome UA) | 2026-09-15 |
| 同 URL を UA なしで取得すると `unicode-range` なしの TTF 2 ブロックが返る(UA 別に CSS を生成する仕様) | 同上(WebFetch) / https://developers.google.com/fonts/docs/technical_considerations | 2026-09-15 |
| Fontsource API: `noto-sans-jp` v56、subsets = cyrillic / japanese / latin / latin-ext / vietnamese、weights 100–900、variable 対応、`unicodeRange` に番号付きキー **[0]–[119](120 個)** + 5 つの名前付きサブセット | https://api.fontsource.org/v1/fonts/noto-sans-jp | 2026-09-15 |
| Fontsource の可変フォントパッケージは `@fontsource-variable/noto-sans-jp`(`import '@fontsource-variable/noto-sans-jp/wght.css'`) | https://fontsource.org/fonts/noto-sans-jp/install | 2026-09-15 |

→ CJK フォントは丸ごと自己ホストすると数 MB 級になるため、**使うなら「スライス配信(Google Fonts CDN)」か「Fontsource / Astro Fonts API で unicode-range 付き自己ホスト」**のどちらかにする。

### 6.2 定石(web.dev / Chrome)

| 定石 | 出典 | 確認日 |
|---|---|---|
| 自己ホストが常に速いわけではない(Web Almanac ではサードパーティフォントの方が速い例が多い)。自己ホストが勝つのは CDN + HTTP/2 前提で、サブセット化 + WOFF2 が必須。CJK は 1 万字超で特に難しい | https://web.dev/articles/font-best-practices | 2026-09-15 |
| Google Fonts 利用時は `fonts.googleapis.com` と `fonts.gstatic.com` の両方に `preconnect`。`@font-face` 宣言は外部 CSS より `<head>` インラインの方が発見が早い。`preload` は乱用しない | 同上 | 2026-09-15 |
| `font-display`: 性能優先なら `optional`、見た目と性能の両立なら `swap`(+早期配信)。いずれも swap 時のレイアウトシフトの可能性があり、`size-adjust` / `ascent-override` でフォールバックのメトリクスを合わせる | 同上 | 2026-09-15 |
| フォールバックフォント側 `@font-face` に `size-adjust` / `ascent-override` / `descent-override` / `line-gap-override` を指定して Web フォントとメトリクスを揃えるとシフトを削減できる(例: `src: local("Arial"); size-adjust: 60.85%; ...`) | https://developer.chrome.com/blog/font-fallbacks | 2026-09-15 |
| CLS 一般: 画像に `width` / `height` または `aspect-ratio`、遅延コンテンツの領域を `min-height` で確保、フォントは `font-display: optional` + preload + メトリクス上書き、アニメーションは `transform` のみ、bfcache 対応 | https://web.dev/articles/optimize-cls | 2026-09-15 |

### 6.3 Astro Fonts API(v6.0 で安定)

| 事実 | 出典 | 確認日 |
|---|---|---|
| `astro.config` の `fonts: [{ provider: fontProviders.google() \| fontsource() \| local(), name, cssVariable, weights, styles, subsets, unicodeRange, display, fallbacks, optimizedFallbacks, formats, preload }]`。`<Font cssVariable="--font-x" preload />` を `<head>` に置く。フォントは `_astro/fonts` に自己ホストされ、フォールバックフォントを自動最適化(`optimizedFallbacks: false` で無効化) | https://docs.astro.build/en/guides/fonts/ | 2026-09-15 |
| Fonts API は Astro 6.0 で安定版(experimental ではない) | https://astro.build/blog/astro-6/ , https://docs.astro.build/en/reference/experimental-flags/fonts/ | 2026-09-15 |

- **未確認**: `fontProviders.google()` で `subsets: ['japanese']` を指定した場合に Google Fonts と同じ 120 スライスの `unicode-range` が再現されるか(=フル CJK を 1 ファイルで落とさないか)は本調査で検証していない。採用前に `dist/_astro/fonts` のファイル数とサイズを実測すること。

### 6.4 システムフォントで済ませる案の評価

| 事実 | 出典 | 確認日 |
|---|---|---|
| `system-ui` は Windows で「Yu Gothic UI」になり細く読みにくい、として著者は不採用。Windows 10/11 には Noto Sans JP が既定で入っている(著者の主張)ため `sans-serif` のみでも綺麗に見える、とし、推奨は `"Hiragino Sans", "Noto Sans JP", "Noto Sans CJK JP", sans-serif`(2026-03-17 公開) | https://zenn.dev/neos21/articles/0b7de5d05fe7ea | 2026-09-15 |
| 複数の日本語記事で、Windows の `system-ui` → Yu Gothic UI は字幅が詰まり長文に不向き、「Yu Gothic」は 700 未満の weight が最細で描画される等の問題が指摘されている | WebSearch 結果(https://jeffreyfrancesco.org/weblog/2025022001/ , https://www.bugbugnow.net/2020/02/font-family.html など、二次情報) | 2026-09-15 |
| Microsoft の Yu Gothic フォントファミリーの公式ページ | https://learn.microsoft.com/ja-jp/typography/font-list/yu-gothic | 2026-09-15 |

評価:
- **メリット**: フォント転送 0 バイト、swap によるレイアウトシフトなし、テキスト LCP が即描画(§7 と相性が良い)、外部接続なし(外部送信の論点も減る)。
- **デメリット**: OS ごとに字形・太さが変わる(macOS/iOS: ヒラギノ、Windows: Yu Gothic / Meiryo / (環境により) Noto Sans JP、Android: Noto Sans CJK JP)。ブランド統一感は Web フォントに劣る。
- **本件の推奨**: 地域密着の情報サイトで LCP/CLS を最優先するなら **システムフォントを既定**にし、ブランド要件が出た段階で Noto Sans JP(Google Fonts CDN or Astro Fonts API)へ切替。
- **未確認**: 「Windows 10/11 に Noto Sans JP が既定で含まれる」は Zenn 記事の主張であり、Microsoft 公式ドキュメントでは確認していない。

推奨スタック(案):

```css
:root {
  font-family: "Hiragino Sans", "Hiragino Kaku Gothic ProN",
               "Noto Sans JP", "Noto Sans CJK JP",
               "Yu Gothic Medium", "Yu Gothic", Meiryo, sans-serif;
  /* system-ui は Windows で Yu Gothic UI になるため先頭に置かない */
}
```

- `"Yu Gothic Medium"` を `"Yu Gothic"` より前に置くのは、通常ウェイトが細く描画される問題への一般的な回避策(上記二次情報に基づく。**公式根拠は未確認**)。

Web フォントを使う場合の最小セット:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap" rel="stylesheet">
```

---

## 7. 写真素材を使わず SVG / CSS のみで作る場合の注意

### 7.1 LCP の候補要素(何が LCP になるか)

| 事実 | 出典 | 確認日 |
|---|---|---|
| LCP 候補: `<img>`、`<svg>` 内の `<image>`、`<video>`(poster / 先頭フレーム)、`url()` の CSS 背景画像(**グラデーションは対象外**)、テキストノードを含むブロック要素。**インライン `<svg>` 全体は対象外**(内部の `<image>` のみ)。除外ヒューリスティック: `opacity: 0`、ビューポート全面を覆う要素(背景扱い)、低エントロピー(プレースホルダ的)画像 | https://web.dev/articles/lcp | 2026-09-15 |
| LCP 改善: `<head>` の同期スクリプトを避ける、レンダーブロック CSS を減らす/インライン化、SSR/SSG で追加リクエストなしに発見可能にする、テキスト LCP では `font-display` を `auto` / `block` 以外にして常に表示、長いタスクを分割 | https://web.dev/articles/optimize-lcp | 2026-09-15 |

### 7.2 設計上の指針(上記に基づく)

1. **ヒーローの `<h1>`(とリード文)を LCP 要素にする。** 装飾はインライン `<svg>`(LCP 候補外)や CSS グラデーション(LCP 候補外)で行い、大きなラスタ画像を置かない。テキストはシステムフォント(§6)または `font-display: swap/optional` で即描画させる。
2. 装飾 SVG を `<img src="hero.svg">` で置く場合は `width` / `height` を必ず指定(CLS)。ファイルサイズに対して描画面積が大きい SVG は「低エントロピー」として LCP から除外され得るため、LCP が意図せず別要素に移ることがある(Chrome のヒューリスティックによる。web.dev の記述に基づく推定)。
3. **背景に `url()` の画像を使わない**(使うと LCP 候補になり、かつ preload しないと発見が遅れる)。CSS グラデーションは候補外なので安全。
4. ビューポート全面を覆う要素は背景扱いで LCP から除外されるため、ヒーローを全画面にしても LCP はその中のテキストになる。
5. CLS: すべての `<svg>` / `<img>` に寸法を与える、`aspect-ratio` でカード内の図版領域を固定、Web フォント swap を避ける(システムフォント)またはメトリクス上書き、アニメーションは `transform` のみ(出典: https://web.dev/articles/optimize-cls 確認日 2026-09-15)。
6. アクセシビリティ/SEO: 装飾 SVG は `aria-hidden="true"`、意味のある SVG は `role="img"` + `<title>`。OG 画像(SNS 用)はラスタが必要なので、sharp(§2)でビルド時生成するか、Playwright(`channel: 'chrome'` でローカル Chrome を使用、§3.4)でスクリーンショット生成する。
7. Astro 6 以降は SVG のラスタライズを `<Image>` がサポート(制限あり)(出典: https://docs.astro.build/en/guides/upgrade-to/v6/ 確認日 2026-09-15)。OG 画像生成に流用できるかは**未確認**。

---

## 8. 未確認事項(要フォローアップ)

| # | 事項 | 状況 |
|---|---|---|
| 1 | sharp v0.35.0 の changelog(libvips 版数、Node 24 への明示的言及) | 公式 changelog ページ取得不可(リダイレクト/404)。npm の engines `>=20.9.0` とプリビルド配布は確認済み |
| 2 | Lighthouse 各バージョンのリリース年月日 | GitHub Releases の相対日付のみで年が不明。バージョンと Node 要件のみ採用 |
| 3 | Lighthouse 既定スロットリング(`mobileSlow4G` / `desktopDense4G`)の数値 | Lantern モジュール側にあり未取得 |
| 4 | Vercel の Astro プリセットが設定する Build Command / Output Directory の既定文字列 | 「自動設定」とのみ記載 |
| 5 | Cloudflare 無料プランでの商用利用可否の**公式規約上の明文** | コミュニティ回答(可)のみ。community ページは 403 |
| 6 | Astro Fonts API `google()` provider が日本語で Google Fonts 同等の unicode-range スライスを生成するか | 未検証。採用前に実測 |
| 7 | `astro:env` の `envField.string({ optional: true })` の可否 | ドキュメント該当節を未確認(`import.meta.env` 方式なら不要) |
| 8 | 「Windows 10/11 に Noto Sans JP が標準搭載」 | Zenn 記事の主張。Microsoft 公式未確認 |
| 9 | Clarity スニペットの公式テキスト | 公式ページは画像掲載。二次情報で本文確認。実装時はダッシュボードからコピー |
| 10 | 葬儀社サイト(フォーム付き)が外部送信規律の「規制対象役務」に該当しないことの法的判断 | FAQ 1-18(コーポレートサイトは対象外)を確認済み。個別判断は専門家へ |

---

## 9. 出典一覧(確認日はすべて 2026-09-15)

### npm registry
- https://registry.npmjs.org/astro/latest
- https://registry.npmjs.org/@astrojs/sitemap/latest
- https://registry.npmjs.org/@astrojs/check/latest
- https://registry.npmjs.org/sharp/latest
- https://registry.npmjs.org/@img/sharp-darwin-arm64/latest
- https://registry.npmjs.org/lighthouse/latest
- https://registry.npmjs.org/@lhci/cli/latest
- https://registry.npmjs.org/playwright/latest
- https://registry.npmjs.org/playwright-core/latest
- https://registry.npmjs.org/@playwright/test/latest
- https://registry.npmjs.org/linkinator/latest
- https://registry.npmjs.org/@microsoft/clarity/latest

### Astro
- https://astro.build/blog/astro-7/
- https://astro.build/blog/astro-6/
- https://github.com/withastro/astro/releases
- https://docs.astro.build/en/install-and-setup/
- https://docs.astro.build/en/guides/upgrade-to/v7/
- https://docs.astro.build/en/guides/upgrade-to/v6/
- https://docs.astro.build/en/reference/configuration-reference/
- https://docs.astro.build/en/guides/integrations-guide/sitemap/
- https://docs.astro.build/en/guides/images/
- https://docs.astro.build/en/guides/content-collections/
- https://docs.astro.build/en/basics/astro-pages/
- https://docs.astro.build/en/guides/environment-variables/
- https://docs.astro.build/en/reference/directives-reference/
- https://docs.astro.build/en/guides/client-side-scripts/
- https://docs.astro.build/en/guides/fonts/
- https://docs.astro.build/en/reference/experimental-flags/fonts/
- https://docs.astro.build/en/guides/deploy/cloudflare/
- https://docs.astro.build/en/guides/deploy/vercel/

### sharp
- https://sharp.pixelplumbing.com/install/
- https://github.com/lovell/sharp/releases

### Lighthouse / LHCI / Chrome
- https://github.com/GoogleChrome/lighthouse/blob/main/readme.md
- https://github.com/GoogleChrome/lighthouse/blob/main/docs/headless-chrome.md
- https://github.com/GoogleChrome/lighthouse/blob/main/docs/configuration.md
- https://github.com/GoogleChrome/lighthouse/blob/main/docs/variability.md
- https://github.com/GoogleChrome/lighthouse/blob/main/core/config/constants.js
- https://github.com/GoogleChrome/lighthouse/blob/main/core/config/desktop-config.js
- https://github.com/GoogleChrome/lighthouse/releases
- https://github.com/GoogleChrome/chrome-launcher/blob/main/README.md
- https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/getting-started.md
- https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md
- https://developer.chrome.com/blog/removing-headless-old-from-chrome
- https://playwright.dev/docs/browsers
- https://playwright.dev/docs/api/class-browsertype
- https://github.com/JustinBeckwith/linkinator/blob/main/README.md

### GA4 / Consent / Clarity / 日本法令
- https://developers.google.com/tag-platform/gtagjs/install
- https://support.google.com/analytics/answer/9304153
- https://developers.google.com/tag-platform/security/guides/consent
- https://support.google.com/analytics/answer/9976101
- https://support.google.com/google-ads/answer/10000067
- https://www.google.com/about/company/user-consent-policy/
- https://web.dev/articles/efficiently-load-third-party-javascript
- https://www.soumu.go.jp/main_sosiki/joho_tsusin/d_syohi/gaibusoushin_kiritsu.html
- https://www.soumu.go.jp/main_sosiki/joho_tsusin/d_syohi/gaibusoushin_kiritsu_00002.html
- https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-setup
- https://learn.microsoft.com/en-us/clarity/setup-and-installation/consent-mode
- https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-consent-api-v2
- https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-csp
- https://learn.microsoft.com/en-us/clarity/third-party-integrations/google-tag-manager
- https://codesnippets.pro/doc/microsoft-clarity/ (二次情報)

### Cloudflare
- https://developers.cloudflare.com/pages/get-started/git-integration/
- https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/
- https://developers.cloudflare.com/pages/configuration/build-image/
- https://developers.cloudflare.com/pages/configuration/headers/
- https://developers.cloudflare.com/pages/configuration/redirects/
- https://developers.cloudflare.com/pages/configuration/serving-pages/
- https://developers.cloudflare.com/pages/platform/limits/
- https://developers.cloudflare.com/pages/functions/pricing/
- https://developers.cloudflare.com/workers/static-assets/
- https://developers.cloudflare.com/workers/static-assets/headers/
- https://developers.cloudflare.com/workers/static-assets/redirects/
- https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/
- https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/
- https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/
- https://developers.cloudflare.com/workers/ci-cd/builds/configuration/
- https://developers.cloudflare.com/workers/ci-cd/builds/build-image/
- https://developers.cloudflare.com/workers/ci-cd/builds/limits-and-pricing/
- https://developers.cloudflare.com/workers/platform/limits/
- https://community.cloudflare.com/t/is-cloudflare-pages-workers-free-plan-free-for-commercial-use/291741 (スニペットのみ、ページは 403)

### Vercel
- https://vercel.com/docs/frameworks/astro
- https://vercel.com/docs/builds/configure-a-build
- https://vercel.com/docs/functions/runtimes/node-js/node-js-versions
- https://vercel.com/docs/project-configuration
- https://vercel.com/docs/project-configuration/vercel-json
- https://vercel.com/kb/guide/custom-404-page
- https://vercel.com/docs/limits
- https://vercel.com/docs/limits/fair-use-guidelines

### フォント / Web パフォーマンス
- https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap (curl, Chrome UA で実測)
- https://developers.google.com/fonts/docs/technical_considerations
- https://api.fontsource.org/v1/fonts/noto-sans-jp
- https://fontsource.org/fonts/noto-sans-jp/install
- https://web.dev/articles/font-best-practices
- https://developer.chrome.com/blog/font-fallbacks
- https://web.dev/articles/optimize-cls
- https://web.dev/articles/lcp
- https://web.dev/articles/optimize-lcp
- https://zenn.dev/neos21/articles/0b7de5d05fe7ea
- https://learn.microsoft.com/ja-jp/typography/font-list/yu-gothic
