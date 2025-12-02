---
title: GASによるYouTube動画分析ツール
startDate: 2024-07
endDate: 2024-07
techs: ["ChatGPT", "GAS", "Python", "Google Sheets","YouTube Data API"]
---

# 概要

Google SpreadSheetに記載された検索ワードから、該当のYouTube動画を検索、内容を要約・分類。ChatGPT APIとYouTube Data APIを使用

# 主な機能

- 検索機能: 指定のキーワードに基づき、再生回数が3000回以上の動画を検索。検索結果数はプルダウンメニューで最大500件まで指定可能。
- ChatGPTによる自動マッチング: あらかじめ用意された27種類のカテゴリに動画を自動分類。動画内容に基づき、該当するカテゴリを複数選択して転記。
- 柔軟なカテゴリ管理: カテゴリリストは簡単に追加・削除・修正が可能。
- 要約・文字起こし機能: 動画内容をChatGPTで要約し、詳細情報として文字起こしも取得。
