---
title: "Gyokan (行間)"
personal: true
startDate: 2026-07
endDate: 2026-07
techs: ["WXT", "React", "TypeScript", "IndexedDB", "Anthropic API", "Zod", "Vitest"]
summary: 日本語話者向け外国語学習の Chrome 拡張。ページ上で選択した文の行間に日本語のグロス(訳・構文・語義・例文)を差し込み、TTS と履歴で定着まで担う。BYOK。
heroImage: ./hero.webp
---

Chrome Web Store: <https://chromewebstore.google.com/detail/gyokan/fgjhmphkcdecagclfegdaommbfgeladd>

紹介ページ: <https://moh-tech.net/gyokan/>

## 概要

ウェブページ上で英文を選択すると、その場に日本語の解説を開く。読むのを止めずに、全文訳・構文のポイント・単語カード(意味・発音記号・語源・例文)・熟語カードまでを一枚のパネルで返す。解説内の単語をクリックすると掘り下げられ、覚えたい語での例文追加生成・英作文の採点・読み上げ・タイピング練習・履歴も同居している。

対象言語は選択テキストから自動判定する(解説言語は日本語固定)。

## 設計上のポイント

- **BYOK**。ユーザー自身の Anthropic API キーを設定して動作する。開発者側にサーバーはなく、選択テキストはユーザーのキーで Anthropic に直接送信される。API キー・履歴・設定は端末内(chrome.storage.local / IndexedDB)のみに保存
- **単一用途**。すべての機能は「選択した英文の学習用解説を表示する」目的から派生している。Chrome Web Store の単一目的ポリシーに正面から乗る形にした
- **無料・Non-Trader 宣言**。収益化するとストア掲載に住所・電話が公開される(EU DSA + 特商法) — 学習ツールとして配るのに割に合わないので寄付リンクも置いていない
- 対象言語のホワイトリストは持たず、検出コードをそのまま通す。品質は LLM 側に依存するので、enum を持つと「増やす作業」だけが増える判断
- 構造化出力は Zod スキーマで縛り、ターゲット言語も EXPLAIN 出力の `targetLang` で確定

## 経緯

ローカル Next.js アプリとして先に作った `glossai` の配布版。「glossai」は同名の既存企業(Series A)と衝突していたため、名前を「行間を読む = 選択テキストの行間に注を差す」から取り直した。
