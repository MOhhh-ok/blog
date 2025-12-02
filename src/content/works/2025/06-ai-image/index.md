---
title: AIアバター生成サービスのPoC
startDate: 2025-06
endDate: 2025-09
techs: ["Python"]
---

同一人物のアバター生成サービスのPoCを作成

## 概要

- ModalのGPUを使用してクラウド環境で学習・生成
- FLUX.1-devモデルをベースにLoRA（Low-Rank Adaptation）で fine-tuning
- 特定人物の顔画像を学習し、同じ顔での複数バリエーション画像を生成
