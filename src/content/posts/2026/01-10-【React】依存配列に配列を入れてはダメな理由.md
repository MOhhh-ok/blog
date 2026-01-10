---
title: 【React】依存配列に配列やオブジェクトを入れてはダメな理由【Maximum update depth exceeded】
---

こんにちは、フリーランスエンジニアの太田雅昭です。

## Reactの依存配列

Reactは状態管理がとても優れています。それを支えている一つが依存配列です。

以下は正常なコードです。

```tsx
import { useEffect, useState } from "react";

export default function App() {
  const [dummy, setDummy] = useState(0);

  useEffect(() => {
    setDummy(d => d + 1); // useEffect内で状態更新
  }, [1]); // 依存配列に固定値1を入れている

  return dummy;
}
```

`1`は固定値で変化しないため、比較関数は`1===1`で常にtrueとなり、useEffect内の関数は１度だけ呼ばれます。

## 依存配列に配列を入れる

続いて依存配列に配列を入れてみます。

```tsx
import { useEffect, useState } from "react";

export default function App() {
  const [dummy, setDummy] = useState(0);

  useEffect(() => {
    setDummy(d => d + 1); // useEffect内で状態更新
  }, [[1]]); // 依存配列に固定値1を入れている

  return dummy;
}
```

すると以下のエラーになります。

```
Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.
```

これは依存配列に配列を入れたことで、`[1]===[1]`が常にfalseとなり、useEffect内の関数が無限ループしてしまうためです。

## 依存配列にオブジェクトを入れる


同様に、オブジェクトを入れても同じ結果となります。

```tsx
import { useEffect, useState } from "react";

export default function App() {
  const [dummy, setDummy] = useState(0);

  useEffect(() => {
    setDummy(d => d + 1); // useEffect内で状態更新
  }, [[1]]); // 依存配列に固定値1を入れている

  return dummy;
}
```

これは依存配列にオブジェクトを入れたことで、`{a:1}==={a:1}`が常にfalseとなるためです。
