---
title: 【Web開発】実機テストを楽にするngrok
pubDate: 2026-01-11
categories: ["開発"]
---

こんにちは、フリーランスエンジニアの太田雅昭です。

## Web開発での実機テスト

通常のWeb開発では、PCを対象としたテストは簡単です。開発環境を立ち上げて、そのままChromeや各種ブラウザーでテストすればいいだけです。ですがスマホなどだとひと工夫が必要です。例えばiPhoneやandroidなどの各種端末のシミュレータを使用してテストする方法もありますが、これはマウスでスマホやタブレットを操作したり、いつもと違うキーボード配列で文字を打ったりとなかなか大変です。

そこで実機テストとなります。実機テストは手持ちの実機でしかテストできないというデメリットもありますが、メリットもあります。

- シミュレータでは再現できない部分でも確実なテストができる
- 操作性が良い
- パフォーマンスが良い

ということでWeb開発における実機テストの方法として、ngrokを使用してみます。

## ngrok

ngrokを使用すると、開発サーバーをそのまま楽に公開できます。

https://ngrok.com/

アカウント登録した後、指示に従ってインストールします。

```sh
brew update
brew install ngrok
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

実行します。

```sh
ngrok http 80
```

以下の表示になりました。

```sh
ngrok                                                                                                                     (Ctrl+C to quit)
                                                                                                                                          
🚪 One gateway for every AI model. Available in early access *now*: https://ngrok.com/r/ai                                                
                                                                                                                                          
Session Status                online                                                                                                      
Account                       YOUR_ACCOUNT (Plan: Free)                                                                          
Version                       3.34.1                                                                                                      
Region                        Japan (jp)                                                                                                  
Latency                       22ms                                                                                                        
Web Interface                 http://127.0.0.1:4040                                                                                       
Forwarding                    https://bellowslike-transportedly-britney.ngrok-free.dev -> http://localhost:80                             
                                                                                                                                          
Connections                   ttl     opn     rt1     rt5     p50     p90                                                                 
                              0       0       0.00    0.00    0.00    0.00                                                 
```

一時的に割り当てられたURLが、ローカルのポート80万につながっています。
