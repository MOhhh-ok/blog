---
title: AIでLPを自動生成するツールのPoC
startDate: 2025-01
endDate: 2025-01
techs: ["Laravel","React", "XServer"]
---

Claude APIを利用した、LP自動生成ツールのPoCを作成。

# 特徴

- ユーザー入力をプロンプト化し、Claude APIに送信
- 処理中画面から、ポーリングで取得状況の表示と自動遷移
- Claudeの返答からデータをHTML, CSS, 画像ファイルに分解
- ファイルを適切に配置し、それぞれのリンクを機能させる
- 結果をZIPファイルでダウンロード
