---
title: 【CASL】TypeScriptで安全なフィールドを定義する
pubDate: 2026-01-01
categories: ["TypeScript"]
---

こんにちは、フリーランスエンジニアの太田雅昭です。

## CASL

CASLは権限管理を行うライブラリです。

https://casl.js.org

## フィールド定義でつまづいた

CASLは対象データを渡して判定させる機能があるのですが、ここを型安全にする方法がわからずすったもんだしていました。Prisma前提のサンプルはあったのですが、独自フィールドで生成するものがなく。なんとか実装できたのですが、同じくお困りの方もいるはずだと思い共有させていただきます。

## まるっと型安全にする

独自フィールドで型安全にするには、下記のようにForcedSubjectを使用します。


```ts
import { AbilityBuilder, createMongoAbility, type ForcedSubject, type MongoAbility, subject } from "@casl/ability";

// ユーザー定義
type UserRole = "user" | "admin";
type User = { id: string; roles: UserRole[] };

// アクション定義
const ACTIONS = ["create", "read", "update", "delete", "manage"] as const;
type Action = typeof ACTIONS[number];

// サブジェクト定義
const SUBJECT_NAMES = ["post", "comment", "all"] as const;
type SubjectName = typeof SUBJECT_NAMES[number];

// フィールド定義
type Post = {
  authorId: string;
  approved: boolean;
} & ForcedSubject<"post">;

type Comment = {
  something: any;
} & ForcedSubject<"comment">;

type AppSubjects = Post | Comment | SubjectName;
type AppAbility = MongoAbility<[Action, AppSubjects]>;

// アビリティ
export function defineAbilityFor(user: User | undefined) {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

  // 全ユーザー
  can("read", "post", { approved: true }); // 型安全!
  can("read", "comment"); // 型安全!

  if (user) {
    // ログイン済み
    can("create", ["post", "comment"]);
    can("manage", "post", { authorId: user.id }); // 型安全!

    // 管理者
    if (user.roles.includes("admin")) {
      can("manage", "all"); // 型安全!
    }
  }

  return build();
}

const notLoggedIn = defineAbilityFor(undefined);
const user = defineAbilityFor({ id: "1", roles: ["user"] }); // 型安全!
const admin = defineAbilityFor({ id: "2", roles: ["admin"] }); // 型安全!

[notLoggedIn, user, admin].forEach(ability => {
  console.log(
    ability.can(
      "read",
      subject("post", {
        authorId: "1",
        approved: false,
      }), // 型安全!
    ),
  );
});
// false, true, true
```
