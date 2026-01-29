---
title: 【Remotion】Threeの画像初期フレーム欠落問題
pubDate: 2026-01-29
categories: ["React"]
---

こんにちは、フリーランスエンジニアの太田雅昭です。Remotionでの画像フィルタに関して書かせていただきます。

## 目的

- 動画作成ライブラリであるRemotion内で、画像に複雑なフィルタをかけたい。
- WebGLを直書きするよりは、できるだけシンプルに実装したい。

## Remotion

<!--Remotionの簡単な説明-->

## 画像フィルタの選択肢

### Remotion + Context2Dのフィルター

<!-- Context2Dのフィルターは現在Safari未対応。サーバーレンダリングのみなら問題ないが、Playerを使用してブラウザ上で確認する場合はこれがネックになる-->

### Remotion + Pixi.js

Remotion + Pixi.jsの選択肢もあるかと思います。ただこちらはRemotionの正式なライブラリがないことから、かなり難航します。どうしてもフィルタ+画像レンダリングまで至れなかったため、Remotionが公式に対応しているThree.jsを使用することにしました。

### Remotion + Three.js

<!-- Remotion + Threeの相性について。@remotion/threeの存在 -->

## 初期フレーム欠落問題

Remotion + Three.jsの構成で挑みましたが、初期フレームがどうしても欠落する問題がありました。THREE.TextureLoaderを使用し、Remotion APIであるdelayRender, continueRenderを駆使するも、なぜか0.5秒ほど画像のない時間が発生してしまいます。レンダリングは１フレームずつ処理されますが、canvasの描画タイミングがどうしても合いませんでした。

## Suspense + useLoaderを使用

SuspenseとuseLoaderを使用する事で解決しました。見通しのためプロパティなどは省略しています。

```tsx
import { useLoader } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import { Suspense } from "react";
import { AbsoluteFill } from "remotion";
import * as THREE from "three";

export function ImageBackground() {
  // ...
  return (
    <AbsoluteFill>
      <Suspense fallback={null}>
        <ThreeCanvas>
          <ambientLight intensity={1} />
          <ImageMesh />
        </ThreeCanvas>
      </Suspense>
    </AbsoluteFill>
  );
}

function ImageMesh() {
  const texture = useLoader(THREE.TextureLoader, src);

  return (
    <mesh>
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}
```

useLoaderは画像が読み込まれるまでSuspendするため、それをSuspenceでキャッチする形ですね。これで初期フレーム欠落がなくなりました。
