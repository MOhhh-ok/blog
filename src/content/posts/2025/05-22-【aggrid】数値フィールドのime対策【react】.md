---
title: "【AgGrid】数値フィールドのIME対策【React】"
pubDate: 2025-05-22
categories: ["React"]
tags: []
---

こんにちは、フリーランスエンジニアの太田雅昭です。

## AgGridの数値フィールド

AgGridでは、テーブルを直接編集する機能があります。編集のためのコンポーネントはtext, numberなどを指定できます。

このnumberでのフィールドでIMEをオンにして入力すると、

なんと

それまでのデータ含め値が消えます

## 対策

値が消える時にはnullになるため、nullになった時に前の値を復活させます。大抵はこれで大丈夫かと思います。

```typescript
{
    editable: true,
    cellEditor: 'agNumberCellEditor',
    onCellValueChanged: (params) => {
      const field = params.colDef.field as string as keyof T;
      if (!params.data) return;
      const value = params.data[field];

      // IMEで入力した場合、valueがnullになるため、oldValueを設定する
      if (value === null)
        params.data[field] = params.oldValue
    },
  }
```