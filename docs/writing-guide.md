# ページ執筆ガイド（Astro 実装用）

このサイトのページは `src/pages/**/*.astro` に置き、`ArticleLayout` を使って書きます。手本は `src/pages/plans/kazokuso.astro`（家族葬）と `src/pages/plans/index.astro`（比較）です。**必ず手本を読んでから書いてください。**

## 1. ページの雛形

```astro
---
import ArticleLayout from '../../layouts/ArticleLayout.astro'; // 階層に応じて '../' を調整
import NextLink from '../../components/NextLink.astro';
import Source from '../../components/Source.astro';
import Cta from '../../components/Cta.astro';
import Faq from '../../components/Faq.astro';
import Icon from '../../components/Icon.astro';

const title = '（title タグ用。ブランド名は自動付与。全角30〜40字）';
const h1 = '（H1。主要キーワードを前方に。titleと同一でなくてよい）';
const description = '（meta description。全角80〜120字。数値・固有名詞を含める）';
const toc = [ { id: 'sec1', label: '見出し1' }, ... ];          // H2 の id と一致させる
const related = [ { href: '/cost/', label: '葬儀費用', note: '一言' }, ... ]; // 4〜6件
const faqs = [ { q: '質問？', a: '<p>結論から。</p>' }, ... ]; // 任意（3〜5件）
---
<ArticleLayout {title} {h1} {description} {toc} {related} pageType="cost" lastReviewed=""
  lead="（リード文。何が分かるページか、2〜3文）"
  crumbs={[{ href: '/cost/', label: '葬儀費用' }]}
  bottomCtaPosition="cost" bottomCtaTitle="（CTA見出し）" bottomCtaLead="（CTA説明）">

  <h2 id="sec1">質問形または名詞句の見出し</h2>
  <div class="answer"><p>直接回答。<strong>数値・条件</strong>を含めて2〜4文。</p></div>
  <p>理由・条件・具体例。</p>
  <div class="table-wrap">   <!-- 列が4つ以上なら table-wrap--wide も付ける -->
    <table>
      <caption>何の表か（税込/税抜・前提条件・確認日）</caption>
      <thead><tr><th scope="col">…</th></tr></thead>
      <tbody><tr><th scope="row">…</th><td class="num">50,000円</td></tr></tbody>
    </table>
  </div>
  <Source items={[{ label: '出典名', href: 'https://…' }]} />
  <NextLink href="/subsidy/" label="次に読む" title="葬祭費・補助金の申請方法" />

  ...（H2 を 5〜8 個）...

  <Cta position="middle" variant="inline" telText="電話で相談" contactText="メールで相談" />  <!-- 本文中CTAは最大2か所 -->

  <h2 id="faq">よくある質問</h2>
  <Faq items={faqs} group="cost" />   <!-- withSchema は /faq/ 以外では付けない -->
</ArticleLayout>
```

- `lastReviewed=""` を渡すと `src/config/site.ts` の全体確認日が表示されます。個別の日付を入れる場合は `"2026-09-15"` 形式。行政・料金・施設情報を含むページは必ず表示する。
- `pageType` は `plan | cost | local | hall | area | flow | subsidy | faq | column | about | other`。
- `bottomCtaPosition` は `plan | cost | hall | flow | faq | middle`。
- コラム（`/column/*`）は `ogType="article"` と `datePublished="2026-09-15"` `dateModified="2026-09-15"` を渡し、`jsonLd` に Article を渡す（手本: 後述）。
- 実在施設の行に `data-track-view="hall" data-item="施設名"`、プランの要素に `data-track-view="plan" data-item="家族葬"` を付けると表示計測される（`<tr>` や `<section>` に付けてよい）。

## 2. 文章ルール

1. **H2 直後は `.answer` で直接回答。** 「〜について説明します」などの前置きを書かない。
2. **数値・固有名詞・条件で書く。** 「安心」「充実」「丁寧」などの抽象語で埋めない。町田市固有の情報（南多摩斎場、市民課104窓口、市民センター、まちそう、町田市民病院、各エリア名）を必ず含める。
3. **出典と確認日。** 金額・期限・施設情報の直後に `<Source>`。数値は出典の表記のまま（税込/税抜、年度を明記）。出典で確認できない数値は書かない。「目安」「一例」と明記する推定は可。
4. **架空の実績を書かない。** 口コミ・件数・満足度・受賞・スタッフ・創業年・「多くのお客様」などは禁止。当サイトの方針（「〜します」）は可。プラン料金は `docs/strategy.md` の設定価格（家族葬 528,000円 / 一日葬 396,000円 / 火葬式 198,000円、税込）を使い、「本サイト（検証用）の設定価格」と注記する。
5. **実在施設は事実のみ。** 名称・所在地（町名）・運営主体・公式URLは調査レポート（`docs/research/`）で確認できたものだけ。提携・運営しているかのような記述は不可。
6. **用語の初出に説明。**（例: 安置（火葬までご遺体を保管すること））
7. **AI的な文体を避ける。** 「〜と言えるでしょう」「いかがでしたか」「まとめ」の見出し、同じ結論の繰り返し、箇条書きの乱用、過剰な敬語を禁止。段落は3〜5文。箇条書きは手順・チェックリストに限る。
8. **内部リンク。** 本文中に `<NextLink>` を2〜4か所、関連ページを4〜6件。リンク先は `docs/strategy.md` の URL 一覧にあるものだけ（存在しないURLを作らない）。
9. **文章量。** 主要ページ 3,000〜5,000字、エリア・コラム 2,000〜3,500字。
10. **HTML。** `<table>` には `<caption>`、`<th scope>`。強調は `<strong>`。`<br>` で改行しない。画像は使わない（必要なら SVG をインラインで）。

## 3. コラム（Article）の JSON-LD 例

```astro
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: h1,
  description,
  datePublished: '2026-09-15',
  dateModified: '2026-09-15',
  inLanguage: 'ja',
  author: { '@type': 'Organization', name: '町田ことのは葬祭 編集部' },
  publisher: { '@id': 'https://example.com/#organization' },   // SITE.url を使う: import { SITE } from '../../config/site'
  mainEntityOfPage: `${SITE.url}/column/xxx/`,
};
```

## 4. ビルド確認

書き終えたら必ず次を実行してコンパイルエラーがないことを確認する（並行作業のため出力先を分ける）:

```bash
export PATH="$HOME/.local/node/bin:$PATH" && cd /Users/d-16/Desktop/Claude/machida-sogi-site && npx astro build --outDir /tmp/astro-build-$$ 2>&1 | grep -E "error|Error|page\(s\)"
```
