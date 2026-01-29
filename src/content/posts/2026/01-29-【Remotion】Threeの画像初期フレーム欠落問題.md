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

Remotionは、Reactコンポーネントを使って動画を作成できるライブラリです。従来の動画編集ソフトとは異なり、コードベースで動画を生成できるため、プログラマブルに動画制作が可能です。フレームごとにReactコンポーネントがレンダリングされ、それを連結することで動画が完成するという仕組みです。

## 画像フィルタの選択肢

### Remotion + Context2Dのフィルター

Canvas 2D APIには`filter`プロパティが存在し、`blur()`や`brightness()`などのフィルタを適用できます。しかし2026年1月29日現在このContext2Dのフィルターは**Safari未対応**となっています。サーバーサイドでのレンダリングのみを行う場合は問題ありませんが、Remotion Playerを使用してブラウザ上でプレビューを確認する際には、この互換性の問題がネックとなってしまいます。

### Remotion + Pixi.js

Remotion + Pixi.jsの選択肢もあるかと思います。ただこちらはRemotionの正式なライブラリがないことから、かなり難航します。どうしてもフィルタ+画像レンダリングまで至れなかったため、Remotionが公式に対応しているThree.jsを使用することにしました。

### Remotion + Three.js

RemotionはThree.jsとの統合を公式にサポートしており、`@remotion/three`パッケージが提供されています。このパッケージには`ThreeCanvas`コンポーネントが含まれており、Remotionのフレームレンダリングと同期した3D描画が可能となります。WebGLで複雑なフィルタ処理を実現できる上に、React Three Fiberのエコシステムも活用できるため、非常に強力な選択肢となります。

## 初期フレーム欠落問題

Remotion + Three.jsの構成で挑みましたが、初期フレームがどうしても欠落する問題がありました。理論的には、初期時にdelayRenderでストップし、TextureLoaderで読み込んだ後にcontinueRenderを呼び出す事で、正確に画像が表示されるはずですが、実際には0.5秒ほど欠落します。Threeのキャンバス描画タイミングが、どうしても合いませんでした。

## Suspense + useLoaderを使用

SuspenseとuseLoaderを使用する事で解決しました。以下のようにします。見通しのためプロパティなどは省略しています。

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
      <planeGeometry />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}
```

useLoaderは画像が読み込まれるまでSuspendするため、それをSuspenseで待機する形ですね。これで初期フレーム欠落がなくなりました。
