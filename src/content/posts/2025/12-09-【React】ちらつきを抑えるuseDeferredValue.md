---
title: 【React】ちらつきを抑えるuseDeferredValue
pubDate: 2025-12-09
categories: ["React"]
---

こんにちは、フリーランスエンジニアの太田雅昭です。

## ちらつき

Reactは状態が変化すると再描画が走ります。この状態の変化が頻繁にあると、ちらついてしまう場合があります。具体的にはスクロールで状態が変化する場合などですね。

これをuseDeferredValueが解決してくれます。

## useDeferredValue

React18から導入された機能で、一部の更新を遅延させるためのフックです。下記のような仕様が想定されています。

- 新しいコンテンツが読み込まれている間、古いコンテンツを表示する
- コンテンツが古いことをインジケータで表示する
- UI の一部分の再レンダーを遅延させる


## 簡単な例

検索フィルターでちらつきを抑える例です。

```tsx
import { useState, useDeferredValue, useMemo } from 'react';

const items = Array.from({ length: 10000 }, (_, i) => `アイテム ${i + 1}`);

function SearchList() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  const filteredItems = useMemo(() => {
    return items.filter(item => item.includes(deferredQuery));
  }, [deferredQuery]);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="検索..."
      />
      <ul style={{ opacity: isStale ? 0.5 : 1 }}>
        {filteredItems.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
