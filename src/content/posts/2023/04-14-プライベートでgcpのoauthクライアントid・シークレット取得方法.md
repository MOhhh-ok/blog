---
title: "プライベートでGCPのOAuthクライアントID・シークレット取得方法"
pubDate: 2023-04-14
categories: ["Google Cloud"]
tags: []
---

GCPでのOAuthクライアントIDおよびクライアントシークレットの取得方法を解説させて頂きます。公開する必要のないプライベート環境、テストユーザーでの使用を想定しています。

## プロジェクトの作成

下記URLからプロジェクトを新規作成します。プロジェクト名はお好きな名前を入れてください。

[https://console.cloud.google.com/projectcreate](https://console.cloud.google.com/projectcreate)

![](http://35.221.87.155/wp-content/uploads/2023/04/スクリーンショット-2023-04-14-9.28.35.png)

作成したプロジェクトを選択します。

![](http://35.221.87.155/wp-content/uploads/2023/04/スクリーンショット-2023-04-14-9.29.35.png)

## APIの有効化

下記URLより、該当するAPIを有効化します。

・Youtube Analytics

[https://console.cloud.google.com/marketplace/product/google/youtubeanalytics.googleapis.com](https://console.cloud.google.com/marketplace/product/google/youtubeanalytics.googleapis.com)

・Youtube Data API v3

[https://console.cloud.google.com/marketplace/product/google/youtube.googleapis.com](https://console.cloud.google.com/marketplace/product/google/youtube.googleapis.com)

## 認証情報を作成

### OAuth同意画面

下記リンクより、同意画面を作成します。

[https://console.cloud.google.com/apis/credentials/consent](https://console.cloud.google.com/apis/credentials/consent)

外部を選択

![](http://35.221.87.155/wp-content/uploads/2023/04/スクリーンショット-2023-04-14-9.34.43.png)

アプリ名、ユーザーサポートメールを入力。

![](http://35.221.87.155/wp-content/uploads/2023/04/スクリーンショット-2023-04-14-9.36.53.png)

デベロッパーの連絡先情報を入力

![](http://35.221.87.155/wp-content/uploads/2023/04/スクリーンショット-2023-04-14-9.37.13.png)

スコープを追加します。

![](http://35.221.87.155/wp-content/uploads/2023/04/スクリーンショット-2023-04-14-9.38.27.png)

今回は、Youtube Analytics APIとYoutube Data API v3を選択します。

![](http://35.221.87.155/wp-content/uploads/2023/04/スクリーンショット-2023-04-14-9.40.10.png)

テストユーザーを追加します。

![](http://35.221.87.155/wp-content/uploads/2023/04/スクリーンショット-2023-04-14-9.40.25.png)

## 認証情報を作成

下記リンクより、認証情報を作成します。

[https://console.cloud.google.com/apis/credentials/oauthclient](https://console.cloud.google.com/apis/credentials/oauthclient)

![](http://35.221.87.155/wp-content/uploads/2023/04/スクリーンショット-2023-04-14-9.44.27.png)

完了したら、下記画像ボタンよりクライアントIDとクライアントシークレットを取得してください。お疲れ様でした。

![](http://35.221.87.155/wp-content/uploads/2023/04/スクリーンショット-2023-04-14-9.50.41-1024x86.png)