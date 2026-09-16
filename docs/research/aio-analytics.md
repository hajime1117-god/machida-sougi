# AIO（AI検索最適化）実態調査レポート

作成日: 2026-09-15 / 全出典の確認日: 2026-09-15

本レポートは「町田市 おすすめ 葬儀社」「町田市 家族葬 費用」等のローカルYMYL領域を想定し、AI Overview / AI Mode / ChatGPT / Gemini / Perplexity 等が地域事業者情報をどう扱うかについて、SEO業界記事・Google公式情報を基にWeb検索（WebSearch）で収集した内容をまとめたもの。**WebFetchは本タスクでは未実行**（WebSearchの要約のみで収集、個別記事の全文突合はしていない）ため、数値等は「一次情報未確認・二次情報（SEO業界メディアの記事要約）」である点に注意。すべての事実は出典URLと共に「確認日: 2026-09-15」を付す。

---

## 1. 町田市の葬儀関連キーワードでのAI検索の実態

「町田市 おすすめ 葬儀社」「町田市 家族葬 費用」で直接WebSearchを行った結果、Google AI Overviewの引用元に関する**個別の観察記事は見つからず**、代わりに通常のオーガニック検索結果（葬儀社の地域ページ）が上位に表示された。AI Overviewが当該クエリでどのソースを具体的に引用しているかは**未確認**（今回の検索では検出できなかった）。

| 事実 | 出典URL | 確認日 |
|---|---|---|
| 町田市の家族葬関連で上位表示されるのは「小さなお葬式」「ティア」「イオンのお葬式」等の全国チェーンの地域ページ、および地域葬儀社の個別サイト | [小さなお葬式 町田市](https://www.osohshiki.jp/area/tokyo/machida-shi/top-c/) | 2026-09-15 |
| 同上（ティア） | [ティア 町田市](https://www.tear.co.jp/tokyo/machida-shi) | 2026-09-15 |
| 同上（イオンのお葬式） | [イオンのお葬式 町田市](https://www.aeonlife.jp/hallguide/%E6%9D%B1%E4%BA%AC%E9%83%BD_%E7%94%BA%E7%94%B0%E5%B8%82) | 2026-09-15 |
| 費用解説記事の例（東横メモリアル、多摩福祉葬祭、プレミア葬祭など地域密着型サイトも検索結果に登場） | [東横メモリアル](https://toyokomemorial.co.jp/column/funeral-costs/) | 2026-09-15 |

**未確認事項**: 上記クエリでGoogle AI Overview / AI Modeが実際に表示されるか、表示される場合にどのサイトを引用文として選ぶかは、本調査のWebSearch結果からは直接観察できなかった。専用のAI Overview監視ツール（例: yoriaiSEO等）による実クエリのスクリーンショット・引用元記録が必要（下記4節参照）。

---

## 2. AI Overview全般の引用傾向（業界記事ベース、2025〜2026年）

| 事実（要約） | 出典URL | 確認日 |
|---|---|---|
| AI Overviewsに引用される情報源のうち52%はGoogle検索結果の上位10位以内のページであり、1位・2位のサイトは引用率40%以上とされる（業界調査記事の要約、一次データ未確認） | [NEXER: AI Overviewとは](https://nexer.co.jp/blog/ai-overview) | 2026-09-15 |
| 2026年時点でゼロクリック検索が全検索の約65%に達しているとの観測（推測含む業界記事） | [Bridge: AI OverviewとSEO](https://www.bridge-world.jp/seo/column/ai-overview/) | 2026-09-15 |
| 2026年4月に47%だったAI Overviews表示率が3〜4カ月で72.1%まで拡大したとする観測 | [バクリ株式会社: AI Overview対策](https://www.bakuri.co.jp/aio-lab/ai-overview/) | 2026-09-15 |
| 比較検討・体験談・独自データ・専門的な深掘り解説など「AIが要約しきれない情報」を持つページはAI Overviewに引用されやすいとする分析 | [advertisingplanet: 生成AI SEO対策ガイド](https://advertisingplanet.co.jp/media/2026/03/09/%E3%80%902026%E5%B9%B4%E6%9C%80%E6%96%B0%E7%89%88%E3%80%91ai-seo%E5%AF%BE%E7%AD%96%E3%81%AE%E5%AE%8C%E5%85%A8%E3%81%BE%E3%81%A8%E3%82%81%EF%BD%9C%E7%94%9F%E6%88%90ai%E6%99%82%E4%BB%A3%E3%81%AB/) | 2026-09-15 |
| AI検索時代のLLMO（Large Language Model Optimization）概念の解説（シュワット） | [シュワット: AI Overviewsとは](https://shwat.jp/ultra/marketing-aix/ai-overviews/) | 2026-09-15 |

**注記**: 上記の数値（52%、65%、72.1%等）はいずれもSEO業界メディア発の二次情報であり、一次データ（Googleやサードパーティ調査会社の生データ）には未到達（WebFetch未実施）。数値は「業界記事の主張」として扱い、断定的に引用しない。

---

## 3. AI検索エンジンが参照しやすいサイト構造・要素

### 3-1. llms.txt

| 事実 | 出典URL | 確認日 |
|---|---|---|
| llms.txtはサイトルートに配置するプレーンテキストファイルで、AIシステム向けにサイトの要約・重要コンテンツへのリンクを提示するもの | [MarTechLab: llms.txt 2026年版](https://martechlab.gaprise.jp/archives/mtl/llms.txt-in-2026-the-full-guide) | 2026-09-15 |
| 効果は賛否両論。「well-curated llms.txtはAnthropicとPerplexityでの引用率にわずかだが測定可能な向上をもたらす」とする分析がある一方、SE Rankingが30万ドメインを分析した結果「llms.txtの有無とAI引用頻度に相関なし」との結果も報告されている | [LLM Pulse: llms.txt Complete 2026 Guide](https://llmpulse.ai/blog/llms-txt-guide/) | 2026-09-15 |
| 2026年4月時点で欧米の主要AIプラットフォームで部分的サポートが存在し、技術志向企業では標準的な取り組みの一つになっている | [Presenc AI: State of llms.txt 2026](https://presenc.ai/research/state-of-llms-txt-2026) | 2026-09-15 |
| llms.txt単体では引用の可否を保証しない、という慎重な見解 | [unType: llms.txtとは何か 2026年の現実](https://www.untype.jp/blog/llms-txt-guide-2026/) | 2026-09-15 |

**評価（推測）**: llms.txtは「設置すれば確実に効果が出る」ものではなく、構造化データやFAQ・表形式コンテンツなど従来型のオンページ施策と併用する補助的施策と位置づけるのが妥当（推測）。

### 3-2. FAQ構造・Q→A直答構造

| 事実 | 出典URL | 確認日 |
|---|---|---|
| Googleは2026年5月7日、FAQリッチリザルトのサポートを完全終了。2023年8月時点で政府・医療系サイト以外への表示は大幅縮小されていたが、2026年5月7日以降は政府・医療系サイトを含む**全サイトで表示されなくなった** | [growthseed: GoogleがFAQリッチリザルトのサポートを終了](https://growthseed.jp/experts/seo/google-faq-rich-results-support-end/) | 2026-09-15 |
| 廃止は段階的で、2026年6月にリッチリザルトレポート・テストのサポート終了、2026年8月にSearch Console APIでのFAQリッチリザルトサポートも終了予定と明記されている | [一創: FAQリッチリザルトとは？2026年の廃止で何が変わったか](https://www.issoh.co.jp/column/details/4874/) | 2026-09-15 |
| FAQ構造化データ自体は「検索エンジンとAIがページを理解する意味の層」として引き続き有効であり、削除は不要という見解（SEOメディアの推奨） | [seo.codequest.work: FAQリッチリザルト廃止｜構造化データは削除不要（Google公式）](https://seo.codequest.work/ja/blog/faq-schema-deprecation-aio-report) | 2026-09-15 |
| AI検索時代にFAQ構造化データが再注目される理由の解説記事 | [sego.jp: FAQ構造化データはもう不要？](https://sego.jp/blog/faq-structured-data) | 2026-09-15 |

**重要な訂正**: タスク文中の前提「FAQPageリッチリザルトの制限（政府/医療サイト限定）」は**2023年8月時点の状態**であり、2026年5月7日以降は政府・医療サイトも含めて**リッチリザルト表示自体が完全終了**している。ただし構造化データマークアップ自体（JSON-LDでのFAQPage記述）はAIの理解補助として残す価値があるという業界見解がある（Googleの検索結果上の見た目は変わらないが、AIクローラーが機械可読な形でQ&Aを把握しやすくなる、という論理。これは推測を含む）。

### 3-3. 表・更新日・著者情報・引用可能な数値

上記の各種2026年版ガイド記事（llms.txt、構造化データ完全ガイド）で共通して言及される要素として、以下が挙げられている（要約）。

- Article構造化データでは `reviewedBy`（監修者）、`wordCount`、`dateModified`（更新日）が効果の高いプロパティとして挙げられている（[Tufe Company: 構造化データ完全ガイド2026年版](https://tufecompany.co.jp/guides/structured-data-complete-2026)、確認日2026-09-15）。
- Organizationでは `sameAs`（公式SNS等への相互リンク）が権威性シグナルとして重要とされる（同上）。
- BreadcrumbListは階層の深いサイトで特に有効とされ、2026年時点でも有効なリッチリザルトとして継続（[テクニカルSEO BLOG: パンくずリストの構造化データ](https://technical-seo.jp/structured-data-for-breadcrumb/)、確認日2026-09-15）。
- 最小実装としてArticle・BreadcrumbList・Organizationの3種が推奨されるという見解（[snap-lynk: 構造化データの基本](https://snap-lynk.co.jp/2026/06/24/structured-data-basics/)、確認日2026-09-15）。

**未確認**: 「表形式データ」「引用可能な統計数値」がAI引用率に与える定量的効果を示す一次データは本調査では確認できなかった（業界記事内での定性的言及にとどまる）。

### 3-4. Bingインデックス（ChatGPT検索の基盤）

**未確認**: 「ChatGPT検索がBing依存である」という技術的説明について、公式のOpenAI/Microsoft文書を今回のWebSearchでは直接確認できなかった。この点はSEO業界で広く語られる通説だが、本調査では一次情報の裏取りができていないため「未確認（業界内の一般的認識）」として扱う。別途Bing Webmaster Toolsへの登録・インデックス確認を行うことを推奨する。

### 3-5. robots.txtにおけるAIクローラーの扱い（GPTBot / ClaudeBot / Google-Extended / PerplexityBot）

| 事実 | 出典URL | 確認日 |
|---|---|---|
| GPTBotはOpenAIのモデル学習用クロール、OAI-SearchBotはChatGPT検索のインデックス用クロールと役割が分かれる。ClaudeBotは学習用、Claude-SearchBotはAnthropicの検索取得用。Google-ExtendedはGeminiモデル学習へのデータ利用可否を制御。PerplexityBotは回答生成のための取得（検索的）クローラーとされる | [Anagram: AI Crawlers Explained 2026](https://www.anagram.ai/blog/ai-crawlers-explained-gptbot-claudebot-perplexitybot-and-how-to-let-them-in-2026) | 2026-09-15 |
| 2026年時点の実務上のベストプラクティスとして「学習用クローラー（GPTBot, Google-Extended, ClaudeBot等）はブロックしつつ、検索・引用用クローラー（OAI-SearchBot, Claude-SearchBot, PerplexityBot等）は許可する」という選択的設定が推奨される傾向にあり、大手サイトの約30%がこの方式を採用しているとの分析 | [technologychecker.io: robots.txt AI Crawlers Blocking Report (2026年9月版)](https://technologychecker.io/blog/robots-txt-ai-crawlers-blocking-report) | 2026-09-15 |
| robots.txtはRFC 9309で標準化された任意の要請であり法的強制力を持たない。Cloudflareは2025年8月、Perplexityがrobots.txtを無視する未申告クローラー（User-Agent・IP・ASNをローテーションさせる）を使用している証拠を公表したと報告されている | [dataimpulse: Robots.txt & AI Crawlers in 2026](https://dataimpulse.com/blog/robots-txt-ai-crawlers/) | 2026-09-15 |

**実務上の示唆（本サイトへの提案・推測含む）**: 集客目的（AI検索経由の指名検索・問い合わせ流入）を重視するローカル葬儀社サイトであれば、OAI-SearchBot・Claude-SearchBot・PerplexityBot・Googlebot（Google-Extendedとは別物で通常検索に必須）はすべて許可し、学習専用のGPTBot・ClaudeBot・Google-Extendedをブロックするかどうかは事業判断（学習データ提供によるブランド言及増加effect vs コンテンツ保護）による。ただしPerplexity等一部クローラーはrobots.txtを守らない可能性がある点は留意（未確認情報だが複数記事が言及）。

---

## 4. GA4でのAI検索流入の識別

| 事実 | 出典URL | 確認日 |
|---|---|---|
| GA4のカスタムチャネルグループは「管理」→「データの表示」→「チャネルグループ」から作成でき、参照元ドメインへの正規表現でAIサービスをまとめて判定できる。例: `.*(chatgpt\.com\|chat\.openai\.com\|perplexity\.ai\|gemini\.google\.com\|copilot\.microsoft\.com\|claude\.ai\|deepseek\.com\|grok\.com).*` | [トキカネ: 生成AI流入をGA4で計測する方法](https://tokikane.biz/llmo-tactics/generative-ai-traffic-ga4/) | 2026-09-15 |
| 2026年5月にGA4へ「AI Assistants」というデフォルトチャネルが追加され、設定なしでChatGPT・Perplexity等からの参照を自動分類できるようになったとする報告 | [仁頼: GA4でAI検索の流入を計測する3つの設定【2026】](https://jinrai.co.jp/blog/2026/07/22/ga4-ai-search-traffic/) | 2026-09-15 |
| ChatGPTアプリ等、リファラを渡さない経路の流入はdirect/(none)に混ざるため、GA4で観測できる生成AI流入は「実際の下限値」にとどまるという注意点 | [GMO TECH: AI検索からの流入をGA4で計測する方法](https://gmotech.jp/semlabo/seo/blog/ga4-ai-traffic/) | 2026-09-15 |
| 生成AI流入のチャネル設計・BigQuery連携によるCV貢献可視化の解説 | [真策堂: 生成AI流入をGA4で計測するチャネル設計](https://shinsakudo.com/blog/analytics/ga4-generative-ai-traffic-channel-design/) | 2026-09-15 |
| GA4によるAI経由流入の集計をいつから始めるべきかという実務的考察 | [note: いつからGA4によるAI経由の流入集計と分析を始めたらよいか](https://note.com/mktg_arekore/n/na7ddf17836b2) | 2026-09-15 |

### 想定される参照元ドメイン一覧（業界記事に基づく整理）

- `chatgpt.com`, `chat.openai.com`（ChatGPT）
- `gemini.google.com`（Gemini）
- `perplexity.ai`（Perplexity）
- `copilot.microsoft.com`（Microsoft Copilot）
- `claude.ai`（Claude）
- `bing.com/chat`（Bing Chat、現Copilot統合。**個別の一次情報での現行URL確認は未実施**）
- `deepseek.com`, `grok.com`（言及はあるが、日本のローカル葬儀社集客での重要性は相対的に低いと考えられる=推測）

**未確認**: 「AI Assistants」デフォルトチャネルの正式名称・GA4管理画面での具体的な表示位置・適用開始日については、Google公式のGA4リリースノートでの一次確認ができていない（業界記事の記述のみに依拠）。GA4管理画面を直接確認するか、Google公式ヘルプ（support.google.com/analytics）での裏取りを推奨する。

### Search ConsoleにおけるAI Overviewsクリックの扱い

| 事実 | 出典URL | 確認日 |
|---|---|---|
| Search Consoleの「生成AI（Generative AI）パフォーマンスレポート」は表示回数（インプレッション）・ページ・国・デバイス・日付の5指標を提供するが、**クリック数とクエリは現時点で含まれていない** | [鈴木謙一氏ブログ: Google AI Overviewの表示回数と検索順位、クリックはSearch Consoleにどのようにレポートされるのか？](https://www.suzukikenichi.com/blog/google-how-ai-overviews-are-logged-in-search-console/) | 2026-09-15 |
| 通常の検索パフォーマンスレポートはクリック数・表示回数・CTR・平均掲載順位を表示するが、生成AIレポートはインプレッションのみに限定されている | [仁頼: Search Console生成AIレポートとは【2026年版】](https://jinrai.co.jp/blog/2026/08/09/search-console-generative-ai-report/) | 2026-09-15 |
| Googleは将来的な指標追加の方針を示しているが、クリックデータ提供の具体的な時期は公表されていない | [スワール: Search Consoleに「生成AIパフォーマンスレポート」登場](https://swirl.co.jp/topics/marketing/entry-604.html) | 2026-09-15 |
| Google公式ヘルプにもAI Overviewsに関する記述が検索パフォーマンスレポートのヘルプ記事内に追加されている、との言及（**Google公式ヘルプページ自体はWebFetch未実施のため文言は未確認**） | 鈴木謙一氏ブログ（上記と同一） | 2026-09-15 |

**未確認**: Google公式ヘルプ（support.google.com/webmasters または support.google.com/searchconsole）における「生成AIパフォーマンスレポート」の正式な説明文言・仕様は、WebFetchでの直接確認ができていない。上記はいずれもSEO専門家・業界メディアによる二次情報である。正確な仕様確認には、Search Console公式ヘルプページの直接閲覧が必要。

---

## 5. Google構造化データガイドラインの要点（2025〜2026年）

### 5-1. FAQPageリッチリザルトの制限・廃止の時系列（訂正済み）

タスク前提の「政府/医療サイト限定」という制限は**2023年8月時点の状態**であり、その後さらに厳格化が進んでいる。

| 時期 | 内容 | 出典 | 確認日 |
|---|---|---|---|
| 2023年8月 | 政府・医療系サイト以外のFAQリッチリザルト表示を大幅縮小 | [growthseed](https://growthseed.jp/experts/seo/google-faq-rich-results-support-end/) | 2026-09-15 |
| 2026年5月7日 | 政府・医療系サイトを含む**全サイト**でFAQリッチリザルト表示が完全終了 | [growthseed](https://growthseed.jp/experts/seo/google-faq-rich-results-support-end/)、[一創](https://www.issoh.co.jp/column/details/4874/) | 2026-09-15 |
| 2026年6月 | リッチリザルトレポート・リッチリザルトテストでのFAQ関連サポート終了 | [一創](https://www.issoh.co.jp/column/details/4874/) | 2026-09-15 |
| 2026年8月 | Search Console APIにおけるFAQリッチリザルトのサポート終了 | [一創](https://www.issoh.co.jp/column/details/4874/) | 2026-09-15 |

**推奨対応（業界見解、推測含む）**: FAQPage構造化データそのものはリッチリザルト目的では効果を失ったが、AIクローラーがページ内容をQ&A形式で機械的に把握する助けにはなり得るため、削除は不要という意見が複数記事で一致している（[seo.codequest.work](https://seo.codequest.work/ja/blog/faq-schema-deprecation-aio-report)、[sego.jp](https://sego.jp/blog/faq-structured-data)、確認日いずれも2026-09-15）。ただしこれは「AIがJSON-LDのFAQPageを直接優先的に読む」という一次的な検証結果ではなく、業界の合理的推測にとどまる点に注意。

### 5-2. LocalBusinessを架空企業に使うことの問題

**未確認**: 「架空企業へのLocalBusiness構造化データ使用」を直接扱ったGoogle公式ガイドラインの明文規定は、今回のWebSearchでは確認できなかった（検索結果は主にLocalBusinessの実装方法や、Googleビジネスプロフィールのガイドライン違反に関する一般的なコミュニティQ&Aにとどまった）。

ただし、一般的なGoogle検索の基本方針として、構造化データガイドライン（Google検索セントラル）には「実際のコンテンツと一致しない、誤解を招く、または虚偽の構造化データはスパムポリシー違反となり得る」という趣旨の一般原則があることが広く知られている（**この一般原則自体も本調査ではWebFetchで一次確認できていないため、確認済みとはしない**）。したがって、架空の企業名・架空の住所・架空の電話番号でLocalBusinessスキーマを実装することは、以下の理由から**推奨されない（推測に基づく強い注意喚起）**:

1. LocalBusinessスキーマには`name`, `address`, `telephone`等の実在確認可能な情報が期待されており、虚偽記載はGoogleのスパムポリシー（誤解を招くコンテンツ）に抵触するリスクが高いと考えられる（推測）。
2. Googleビジネスプロフィールと連携しない実店舗のないLocalBusinessは、リッチリザルト表示対象外となる可能性がある（推測、未確認）。
3. YMYL領域（葬儀）で架空の実在性を装うことは、E-E-A-Tの「信頼性」を著しく損ない、Google・AI双方からの評価低下リスクがある（推測）。

**本調査での結論**: 本サイト（machida-sogi-site）が架空の葬儀社紹介サイトである場合、LocalBusinessスキーマを実装する際は、実在しない特定の店舗を装う情報（架空の住所・電話番号・代表者名など）を含めるべきではない。用途に応じ、「情報サイトである」ことを明示した上でOrganizationスキーマ（自サイト運営者情報）に留めるか、実在の外部葬儀社情報を紹介する場合はその出典を明記する設計が安全（推測に基づく提案）。

### 5-3. Organization / WebSite / BreadcrumbList / Article の推奨プロパティ

| スキーマ | 推奨プロパティ（業界記事の要約） | 出典URL | 確認日 |
|---|---|---|---|
| Article | `reviewedBy`（監修者）、`wordCount`、`dateModified`（更新日）が効果的とされる | [Tufe Company](https://tufecompany.co.jp/guides/structured-data-complete-2026) | 2026-09-15 |
| Organization | `sameAs`（公式SNS等の相互リンク）が権威性シグナルとして重視される | [Tufe Company](https://tufecompany.co.jp/guides/structured-data-complete-2026) | 2026-09-15 |
| BreadcrumbList | 階層の深いサイト構造で有効。JSON-LD形式が推奨される | [テクニカルSEO BLOG](https://technical-seo.jp/structured-data-for-breadcrumb/) | 2026-09-15 |
| 最小実装セット | Article・BreadcrumbList・Organizationの3種を最小構成として推奨 | [snap-lynk](https://snap-lynk.co.jp/2026/06/24/structured-data-basics/) | 2026-09-15 |
| AIO対策で効果が高いとされる10種のスキーマの一覧記事（詳細な優先順位は個別記事参照） | [0120.co.jp: 構造化データ実装優先順位2026年版](https://0120.co.jp/blog/aio-65/) | 2026-09-15 |

**未確認**: 上記はいずれもSEO業界メディアによる二次的な解釈記事であり、Google検索セントラル公式ドキュメント（developers.google.com/search/docs）の原文でのプロパティ必須/推奨区分は、本調査ではWebFetchでの直接確認ができていない。正式な実装前には公式ドキュメントの該当ページ（Article, Organization, BreadcrumbList各スキーマの構造化データガイドライン）を直接参照することを強く推奨する。

---

## 6. YMYL（葬儀・行政手続き）のE-E-A-T要件と、架空サイトが虚偽なく満たせる要素

| 事実 | 出典URL | 確認日 |
|---|---|---|
| 葬儀サービスはYMYL（Your Money or Your Life）領域に該当し、GoogleはE-E-A-T評価基準を特に厳格に適用するとされる | [trilia: 葬儀社に必要なLLMO対策とは？](https://trilia.co.jp/funeral-company-llmo/) | 2026-09-15 |
| 葬祭ディレクターの資格・経験・実績、正確な価格情報が信頼性のために重要であり、AIシステムはこれらの信頼性シグナルを示す葬儀会社を引用しやすいとされる | 同上 | 2026-09-15 |
| 遺言作成・相続関連情報などの行政手続き・法律関連情報もYMYL領域に含まれるという整理 | [enfactory: YMYLとは？](https://enfactory.co.jp/media/ymyl/) | 2026-09-15 |
| YMYL領域での上位表示対策として、監修者の明示（監修表記）や信頼性の高い情報源の活用が有効とされる | [willgate: SEOにおける「権威性」の重要性](https://www.willgate.co.jp/promonista/authoritativeness/) | 2026-09-15 |

### 架空サイト（machida-sogi-site）が虚偽なく満たせる要素の整理（推測を含む実務提案）

本サイトが「特定の実在葬儀社になりすます」ものではなく「地域の葬儀に関する一般情報・比較情報を提供する情報サイト」という位置づけであることを前提に、以下は虚偽なく実装可能と考えられる要素（推測に基づく提案であり、法的助言ではない）:

1. **出典明示**: 費用相場・制度情報（例: 葬祭費給付金制度など）は、各市区町村・厚生労働省等の一次情報へのリンクを明記する。
2. **最終確認日の表示**: 各ページに「最終確認日: YYYY-MM-DD」を明記し、情報の鮮度をユーザー・AIクローラー双方に示す。
3. **監修表記の扱い**: 実在しない資格者を「監修者」として偽装することは不可。行う場合は、実在する専門家に実際の監修を依頼するか、「編集ポリシー」「情報収集方法」を明示し、個人の実在資格を騙らない形にする（例:「本サイトは公開情報を基に編集部が作成」等の正直な表記）。
4. **免責事項**: 「本サイトは特定の葬儀社を保証するものではなく、情報提供を目的とする」旨の免責文言、および「実際の依頼前に各社に直接確認してください」という注意喚起を明記する。
5. **架空の実在性の回避**: LocalBusinessスキーマ・電話番号・住所等、実在する店舗であるかのような表示は行わない（5-2節参照）。
6. **著者・運営者情報**: 運営者情報（会社概要に相当する情報）を明示し、Organizationスキーマの`sameAs`等で実在するアカウント（もしあれば）と紐付ける。実在しないSNSアカウント等を紐付けない。

**未確認**: 上記6項目は業界一般論とGoogle公式方針の一般的理解から導いた推測ベースの実務提案であり、Google検索品質評価ガイドライン（Search Quality Rater Guidelines）原文および構造化データ公式ガイドラインの該当箇所は本調査でWebFetch未実施のため一次確認していない。本格実装前に公式文書（Search Quality Rater Guidelines PDF、developers.google.com/search配下の該当ページ）の直接参照を推奨する。

---

## 未確認事項まとめ（重要）

- 町田市の実際の葬儀関連クエリでAI Overview/AI Modeが表示されるか、表示される場合の具体的な引用元サイトの実例（本調査では直接観察できず）。
- AI Overview引用率52%等、業界記事が挙げる各種統計の一次データソース。
- ChatGPT検索のBingインデックス依存に関する公式（OpenAI/Microsoft）の説明文言。
- GA4「AI Assistants」デフォルトチャネルの正式名称・仕様・適用開始日についてのGoogle公式リリースノート。
- Search Console公式ヘルプページにおける生成AIパフォーマンスレポートの正式な説明文言。
- Google構造化データガイドライン公式ページにおける「架空企業へのLocalBusiness使用」の明文規定の有無。
- Article/Organization/BreadcrumbListの必須・推奨プロパティの公式区分（Google検索セントラル原文）。
- Google Search Quality Rater GuidelinesにおけるYMYL・E-E-A-Tの最新（2025〜2026年版）記述内容。

これらはいずれも、SEO業界メディアの記事（二次情報）による言及はあるが、Google/OpenAI/Microsoft等の一次情報源への直接アクセス（WebFetch）による裏取りができていないため、「未確認」として明記する。本サイトの実装方針を最終決定する前に、可能であれば以下の公式情報源への直接アクセスを推奨する:

- Google検索セントラル: https://developers.google.com/search/docs
- Google Search Console公式ヘルプ: https://support.google.com/webmasters
- Google Search Quality Rater Guidelines（PDF）
- OpenAI / Anthropic / Perplexity 各社の公式クローラー情報ページ
