---
title: 【Sharp】HDRのAVIF読み込みでBitstream not supported by this decoder
pubDate: 2026-01-01
categories: ["TypeScript"]
---

こんにちは、フリーランスエンジニアの太田雅昭です。

## SharpでAVIF読み込みエラー

SharpでAVIFを読み込んで処理しようとしたところ、エラーとなりました。調査のためコードを書くと、以下の結果となりました。メタデータは読めるものの、変換するとエラーとなっています。

```ts
import sharp from "sharp";

const TEST_FILE = "test.avif";

async function test() {
  try {
    const metadata = await sharp(TEST_FILE).metadata();
    console.log("Metadata:", metadata);
    // 念の為読み込み直すがエラーは変わらず
    await sharp(TEST_FILE).resize(100, 100).toFile("converted.avif");
    console.log("変換完了");
  } catch (error) {
    console.error(error);
  }
}

test();
```

```js
Metadata: {
  format: "heif",
  width: 416,
  height: 740,
  space: "rgb16",
  channels: 3,
  depth: "ushort",
  isProgressive: false,
  isPalette: false,
  bitsPerSample: 10,
  pages: 1,
  pagePrimary: 0,
  compression: "av1",
  hasProfile: false,
  hasAlpha: false,
  autoOrient: {
    width: 416,
    height: 740,
  },
}
```

```sh
error: test.avif: bad seek to 13948
test.avif: bad seek to 13921
test.avif: bad seek to 13917
heif: Invalid input: Unspecified: Bitstream not supported by this decoder (2.0)
```

## Sharpは10-bit未対応

下記を参考にしました。

https://github.com/lovell/sharp/issues/2688

コマンドを打ってみます。

```sh
% heif-info -d test.avif | grep bit
| | | bits_per_channel: 10,10,10
| | | high_bitdepth: 1
| | | twelve_bit: 0
```

10-bitのAVIFイメージであることが確認できました。Sharpはv0.28.0以降、8-bit depth対応とのことなので、これが原因のようです。

> Prebuilt binaries limit AVIF support to the most common 8-bit depth.

https://sharp.pixelplumbing.com/changelog/v0.28.0/

これは困りました。

## 対応

FFmpegやImageMagickは10-bitに対応しているようです。今回はFFmpegで対処することにします。
