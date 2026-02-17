---
title: 【TypeScript】field-guardでフィールドレベルのアクセス制御を型安全に実現する
pubDate: 2026-02-17
categories: ["TypeScript"]
---

こんにちは、フリーランスエンジニアの太田雅昭です。

今回は、TypeScript向けのフィールドレベルアクセスコントロールライブラリ「field-guard」をご紹介します。

https://www.npmjs.com/package/field-guard

## 背景

### アクセス制御

ライブラリを使わずにアクセス制御をしようとなると、その場でロジックを書いていく必要があります。少数なら問題ありませんが、膨大になってくると一箇所で書いて管理したいといった需要が発生します。この時、いかに楽に見やすく書けるかがポイントになります。プロジェクトに応じた独自実装でも良いのですが、ライブラリといった共通基盤のあるほうが、ありがたいのは明白です。

### 既存ライブラリからの脱却

既存のアクセス制御にはCASLなどがあります。canメソッドで構築していくスタイルで設定しやすく、しばらく使っていましたが型の弱さが気になりました。これは構築方法に由来するもので、単なる拡張で型を完全に安全にするのは難しそうです。

Prismaなど対応ORMでないと恩恵が少ないように感じ、Drizzleユーザーの私には向かないと判断しました。そこでDrizzleユーザー向けに一から自作しようと思い立った次第です。もちろん、Drizzleユーザー以外でも汎用的に使えるようにしています。

## 特徴

APIやサービス層で「このユーザーにはこのフィールドを見せたくない」という要件はよくあります。自分のプロフィールならemailを見れるが、他人のプロフィールではidとnameだけ返したい、といったケースです。

field-guardは、**誰が・どのフィールドを見れるか**を型安全に定義・評価できるライブラリです。

## インストール

```bash
npm install field-guard
```

## 基本的な使い方

### 1. Guardを定義する

```ts
import { defineGuard } from "field-guard";

type Ctx = { userId: string; role: "admin" | "user" };

const userGuard = defineGuard<"owner" | "other", Ctx>()({
  fields: ["id", "email", "name"],
  policy: {
    owner: true,                     // 全フィールド許可
    other: { id: true, name: true }, // idとnameだけ許可
  },
});
```

`policy`には以下の4パターンを指定できます。

- `true` — 全フィールド許可
- `false` — 全フィールド拒否
- ホワイトリスト `{ id: true, name: true }` — 明示したフィールドのみ許可
- ブラックリスト `{ secretField: false }` — 指定フィールド以外を許可

trueを含むオブジェクトはホワイトリスト、falseのみのオブジェクトはブラックリストとして自動判定されます。

### 2. チェック関数を追加する

`.withCheck<T>()`で、コンテキストと対象オブジェクトからアクセスレベルを解決するロジックを書きます。

```ts
type User = { id: string; email: string; name: string };

const userGuard = defineGuard<"owner" | "other", Ctx>()({
  fields: ["id", "email", "name"],
  policy: {
    owner: true,
    other: { id: true, name: true },
  },
}).withCheck<User>()(({ ctx, target, verdictMap }) => {
  const level = ctx.userId === target.id ? "owner" : "other";
  return verdictMap[level];
});
```

### 3. 評価する

```ts
const guard = userGuard.for({ userId: "1", role: "user" });

// 自分自身 => 全フィールド見れる
const v1 = guard.check({ id: "1", email: "me@example.com", name: "Me" });
v1.allowedFields; // ["id", "email", "name"]

// 他人 => idとnameだけ
const v2 = guard.check({ id: "2", email: "other@example.com", name: "Other" });
v2.allowedFields; // ["id", "name"]
```

### 4. Verdictのヘルパー

返却される`FieldVerdict`には便利メソッドがあります。

```ts
verdict.coversAll(["id", "name"]);  // true: 指定フィールド全て許可されている
verdict.coversSome(["email"]);      // true: 指定フィールドのいずれかが許可されている
```

## 応用的な使い方

### 派生プロパティの追加

`.withDerive()`で、コンテキストから追加のプロパティを計算できます。

```ts
const guard = defineGuard<"public", Ctx>()({
  fields: ["id", "email"],
  policy: { public: true },
}).withDerive(({ ctx }) => ({
  isAdmin: ctx.role === "admin",
}));

const g = guard.for({ userId: "1", role: "admin" });
g.isAdmin; // true
```

### 複数Guardの統合

`combineGuards`で複数リソースのGuardをまとめて、コンテキストを一度だけバインドできます。

```ts
import { combineGuards } from "field-guard";

const guards = combineGuards<Ctx>()({
  users: userGuard,
  posts: postGuard,
});

const g = guards.for({ userId: "1", role: "user" });
g.users.check({ id: "1", email: "a@b.com", name: "A" });
g.posts.check({ id: "p1", content: "hello", authorId: "1" });
```

### Verdictのマージ

複数のVerdictを`union`（OR）や`intersection`（AND）で合成できます。

```ts
import { mergeFieldVerdicts } from "field-guard";

// いずれかが許可していればOK
mergeFieldVerdicts("union", [verdictA, verdictB], fields);

// 全てが許可している場合のみOK
mergeFieldVerdicts("intersection", [verdictA, verdictB], fields);
```


https://github.com/mohhh-ok/field-guard
