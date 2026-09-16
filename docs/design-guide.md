# デザインガイド（2026-09-16 改修版）

目的: 「文章中心」から「一目で分かる」へ。**既存のテキスト・見出し・内部リンク・出典・計測属性は維持**したまま、情報の優先順位を視覚化する。要素を増やすのではなく、既存情報を図・表・カードに「置き換える」。

## 1. 原則

- **スマホ最優先。** 横スクロールが必要な表は使わない（比較表は `.cmp` で縦積みに変換）。
- **1セクション1メッセージ。** H2 → `.answer`（結論）→ 図/表 → 補足 → `NextLink` の順。
- **カードは「比較・選択」にだけ使う。** 説明文をカードにしない。角丸・影・グラデーション・アニメーションは追加しない。
- **アイコンは節度。** `Icon` の `check / info / clock / pin / arrow / chevron / phone / mail / doc` のみ。装飾目的で置かない。
- **数字は大きく、単位は小さく。** 価格は `<span class="num">528,000</span>` + 単位を別要素に。
- **「未確認」は消さない。** 図にした場合も注記・出典（`<Source>`）を残す。
- **色**: 青緑（`--c-primary`）= 情報・選択、暖色（`--c-accent`）= 電話・注意。他の色を足さない。

## 2. 使える部品（すべて実装済み。import パスはページの階層に合わせる）

### `MachidaMap`（町田市の概略図）
```astro
import MachidaMap from '../components/MachidaMap.astro';
<figure class="map-figure"><MachidaMap variant="crematoriums" title="…" /><figcaption>◆ 火葬場　● 主な駅（位置は概略）</figcaption></figure>
```
- `variant`: `simple`（輪郭+主要駅+南多摩斎場）/ `areas`（全駅）/ `crematoriums`（火葬場3か所を強調）。
- 使いどころ: エリア index、火葬場ページ、各エリアページの冒頭（1ページ1回まで）。`.map-figure` のスタイルは各ページの `<style>` で `index.astro` と同じ定義を置く（`margin:0 0 1rem; background: var(--c-bg); border:1px solid var(--c-line); border-radius: var(--radius-lg); padding:1rem 1rem .7rem;` + figcaption 小文字）。

### `PlanPictogram`（形式の日程ピクトグラム）
```astro
import PlanPictogram from '../../components/PlanPictogram.astro';
<PlanPictogram plan="ichinichiso" size="md" />   <!-- kazokuso | ichinichiso | kasoshiki, size sm|md|lg -->
```
- 使いどころ: プラン詳細ページの冒頭「ひと目で分かる」パネル、比較セクション。

### `CostBar`（総額の構成バー）
```astro
import CostBar from '../../components/CostBar.astro';
<CostBar rows={[{ name: '家族葬（20名）', note: 'お布施別', href: '/plans/kazokuso/', segs: [{ label: 'プラン料金', value: 528000 }, { label: '式場使用料', value: 50000 }, { label: '飲食・返礼品', value: 240000 }], total: '約82万円' }]} max={818000} />
```
- 数値は既存ページの試算と同じ値だけを使う。

### 比較表（PC: 表 / SP: 縦積みカード）
```astro
<div class="table-wrap table-wrap--wide">
  <table class="cmp">
    <caption>…</caption>
    <thead><tr><th scope="col">項目</th>…</tr></thead>
    <tbody><tr><th scope="row">南多摩斎場</th><td data-label="火葬料">無料</td>…</tr></tbody>
  </table>
</div>
```
- **既存の表に `class="cmp"` と各 `<td data-label="列名">` を付けるだけ**で変換される。行見出し（`<th scope="row">`）が SP でカードのタイトルになる。列が4つ以上ある比較表・施設一覧には必ず適用する。2列の「項目/内容」表（縦長の定義表）には適用しない。

### ステップ（流れ）
```html
<ol class="stepper stepper--h">  <!-- 全体像。PC横並び/SP縦。stepper--h を外すと常に縦 -->
  <li><span class="stepper__t">逝去・搬送・安置</span><span class="stepper__d">当日。…</span></li>
</ol>

<section class="step-card" id="step1">
  <div class="step-card__head"><span class="step-card__num">STEP<strong>1</strong></span><h3 class="step-card__title">逝去・搬送・安置</h3><span class="step-card__when">当日</span></div>
  <div class="step-card__body">
    <p>（既存の説明文）</p>
    <ul class="step-card__facets">
      <li><b>今すること</b><span>…</span></li>
      <li><b>誰が</b><span>…</span></li>
      <li><b>決めること</b><span>…</span></li>
      <li class="is-warn"><b>注意</b><span>…</span></li>
      <li class="is-help"><b>困ったら</b><span>…（電話で相談できる旨＋<a href="/contact/">相談フォーム</a>）</span></li>
    </ul>
  </div>
</section>
```
- H3 の文言は既存のまま使う（見出し構造を変えない）。`step-card__title` が H3。

### 判断ガイド（「自分はどれ」「どこを使えば」）
```html
<ul class="choice choice--2">
  <li><span class="choice__q">費用を抑えたい</span><span class="choice__a"><strong>南多摩斎場の第二・第三式場</strong>（組織市住民 50,000円）。火葬場併設で移動も不要</span><a href="/halls/crematorium/" class="btn btn--outline">南多摩斎場を見る</a></li>
</ul>
```

### 施設カード（重要施設の要約）
```html
<div class="facility" data-track-view="hall" data-item="南多摩斎場">
  <div class="facility__head"><h3 class="facility__name">南多摩斎場</h3><span class="facility__sub">公営（南多摩斎場組合）・町田市上小山田町</span></div>
  <div class="facility__grid">
    <div class="facility__cell"><span class="facility__label">特徴</span><p>…</p></div>
    <div class="facility__cell"><span class="facility__label">料金</span><p class="facility__big">無料<small>町田市民の火葬料（市外 80,000円）</small></p></div>
    <div class="facility__cell"><span class="facility__label">アクセス</span><p>…</p></div>
    <div class="facility__cell"><span class="facility__label">向いている人</span><p>…</p></div>
    <div class="facility__cell facility__cell--warn facility__cell--wide"><span class="facility__label">注意点</span><p>…</p></div>
  </div>
</div>
```
- 既に `data-track-view="hall"` を付けている `<tr>` がある場合は、施設カード側には付けない（二重計測を避ける）。

### バッジ・事実リスト
```html
<span class="badge">公営</span> <span class="badge badge--accent">市外料金</span>
<ul class="fact-list"><li><Icon name="check" /><span>…</span></li></ul>
```

## 3. ページ別の方針

| ページ | 追加する視覚要素 | 維持するもの |
|---|---|---|
| プラン詳細（家族葬・一日葬・火葬式） | 冒頭に「ひと目で分かる」パネル（PlanPictogram + 価格 + 日数/人数/式場 + 向いている人 + 含まれる/含まれない要約）。既存の表は `.cmp` 化 | 全H2・本文・FAQ・CTA |
| 斎場・葬儀場 | 冒頭に判断ガイド（`.choice`）、公営/民営の違いを2列比較（`.incl` 風の2カラム or `.cmp`）、南多摩斎場の施設カード、民営式場一覧は `.cmp` 化＋各行に `badge`（公営/民営・駅近 等はレポートで確認できる事実のみ） | 施設名・所在地・出典・未確認注記 |
| 火葬場 | 南多摩斎場の施設カード、`MachidaMap variant="crematoriums"`、市外火葬場の比較表を `.cmp` 化、エリア別使い分けを `.choice` に | 使用料表（公式値）・休場日・出典 |
| 葬儀の流れ | 冒頭に `.stepper--h` の全体像、各H3を `.step-card`（今すること/誰が/決めること/注意/困ったら）に、形式別の違いは `.cmp` | H2/H3の文言・用語集・手続き表 |
| 最初にすること | 冒頭の番号リストを `.stepper`（縦）に、ケース別（病院/自宅/施設）を `.choice` 風の3ブロック、タイムライン表を `.cmp` | 緊急CTA・窓口情報 |
| 費用・葬祭費・町田市ガイド・エリア | 横に長い表を `.cmp` 化、制度比較を `.cmp`、エリア index に `MachidaMap variant="areas"` | 本文 |

## 4. やってはいけないこと

- 見出し（H1/H2/H3）の文言・順序の変更、内部リンクの削除、`<Source>`・「未確認」注記の削除、`data-cta`・`data-track-view` の削除
- 画像内テキストだけに重要情報を置くこと（SVGは装飾でなく図として `role="img"` + `aria-label`）
- 新しい色・フォント・角丸の追加、外部ライブラリの追加、JS の追加
