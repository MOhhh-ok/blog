---
title: "【CSS】スマホ実機でTable横スクロールが効かない時"
pubDate: 2023-11-16
categories: ["HTML/CSS"]
tags: []
---

こんにちは、フリーランスエンジニアの太田雅昭です。

## 実機でスクロールが効かない

Tableの横が長い場合、それをwrapperで囲ってスクロール可能にしていました。

```markup
<div class="table-wrapper">
  <table ...
```

```css
.table-wrapper {
  overflow-x: auto;
}
```

これでPCではちゃんと横スクロールできていたのですが、スマホ iPhone8 の実機（あるいはXCodeのシミュレータ）ではなぜかスクロールできない。。。

## スクロールを効かせるために

以下のようにすると、スクロールが効きました。

```css
.table-wrapper {
  overflow-x: auto;
  white-space: nowrap;
}


```

## 小話

そろそろiPhone8のバッテリーの減りが最高潮です。最大容量が73%。そろそろ買い替え時でしょうか。

ではでは。