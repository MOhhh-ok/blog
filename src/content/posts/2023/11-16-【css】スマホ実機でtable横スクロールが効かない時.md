---
title: "【CSS】スマホ実機でTable横スクロールが効かない時"
pubDate: 2023-11-16
updatedDate: 2026-01-12
categories: ["HTML"]
---

こんにちは、フリーランスエンジニアの太田雅昭です。

## 実機でスクロールが効かない

Web開発でPCとスマホとで表示を確認するのは重要です。PCでは意図した表示になっており、ブラウザのDevツールで横幅をスマホに合わせても問題なし。しかしスマホ実機で表示がズレる。そうしたことは日常茶飯事です。

今回Tableの横を長くし、wrapperで囲ってスクロール可能にしていました。

```markup
<div class="table-wrapper">
  <table ...
```

```css
.table-wrapper {
  overflow-x: auto;
}
```

しかしスマホ iPhone8 の実機（あるいはXCodeのシミュレータ）ではなぜかスクロールできない。。。

## スクロールを効かせるために

以下のようにすると、スクロールが効きました。

```css
.table-wrapper {
  overflow-x: auto;
  white-space: nowrap;
}
```

あるいは

```css
.table-wrapper {
  overflow-x: auto;
  minWidth: "max-content";
}
```
