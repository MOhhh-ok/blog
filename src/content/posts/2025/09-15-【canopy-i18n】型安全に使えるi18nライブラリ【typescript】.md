---
title: "【canopy-i18n】型安全に使えるi18nライブラリ【TypeScript】"
pubDate: 2025-09-15
categories: ["TypeScript"]
tags: []
---

こんにちは、フリーランスエンジニアの太田雅昭です。

Node.js/TypeScriptでのi18n、型ズレや初期設定の重さに悩まされがちです。この記事では、最小限のAPIで型安全に使える「canopy-i18n」を紹介します。

## i18nライブラリへの不満点

現在数々のi18nライブラリがあります。用途によって使いやすさは変わってくるかと思いますが、最近のモノレポ, TypeScriptなどでのコーディングスタイルに合っているものがないように思います。具体的には以下のようなことがあります。

*   **型安全性が弱い**: 翻訳キーのタイポや引数不足が実行時まで発覚しない。
*   **初期設定が煩雑**: 設定ファイルやプラグインが多く、導入に腰が重い。
*   **テンプレート制約**: 独自タグや制限付き構文で表現力が足りない。
*   **深いデータ適用が面倒**: ネストしたオブジェクト/配列にロケールを一括適用しづらい。
*   **フォールバック粒度が粗い**: 画面単位でしかフォールバックできず、細かい制御が難しい。

## canopy-i18nで解決できること

canopy-i18nは、下記のような特徴があります。

*   **型安全なロケール/キー**: 許可ロケールを固定し、コンパイル時に検出。
*   **メッセージ単位のフォールバック**: 欠落時はフォールバックロケールへ退避。
*   **自由なテンプレート**: ただの関数（または文字列）なので、条件分岐や外部フォーマッタもそのまま使える。
*   **深い適用を一発**: 定義ツリー全体にロケール適用。
*   **軽量・シンプル**: 小さなAPI面と実装で、学習・保守コストが低い。

## 使い方（最小セット）

インストール

```
npm i canopy-i18n

# or

pnpm add canopy-i18n
```

メッセージ定義と利用

```typescript
import { createMessageBuilder, applyLocaleDeep } from 'canopy-i18n';


// 1) ロケール宣言（フォールバック: ja）
const builder = createMessageBuilder(['ja', 'en'] as const, 'ja');


// 2) メッセージ定義（文字列 or 関数テンプレート）
const title = builder({
  ja: 'タイトルテスト',
  en: 'Title Test',
});

const greet = builder<{ name: string; age: number }>({
  ja: c => `こんにちは、${c.name}さん。あなたは${c.age}歳です。`,
  en: c => `Hello, ${c.name}. You are ${c.age} years old.`,
});


// 3) メッセージツリーを組み立て
const messages = {
  title,
  nested: { hello: builder({ ja: 'こんにちは', en: 'Hello' }) },
  greet,
};


// 4) ツリー全体にロケール適用して利用

const m = applyLocaleDeep(messages, 'en');

console.log(m.title.render()); // "Title Test"
console.log(m.nested.hello.render()); // "Hello"
console.log(m.greet.render({ name: 'Tanaka', age: 20 }));
```

## Next.jsでの使用例

Next.jsでのサンプルを試すこともできます。

```bash
git clone https://github.com/mohhh-ok/canopy-i18n
cd canopy-i18n/examples/next-app
pnpm install
pnpm dev
```

## リンク

*   [npm](https://www.npmjs.com/package/canopy-i18n)
*   [github](https://github.com/MOhhh-ok/canopy-i18n)
