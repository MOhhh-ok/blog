---
title: "【Git】よく使うGitコマンド（随時更新）"
pubDate: 2024-04-01
pudatedDate: 2025-01-03
categories: ["開発"]
---

こんにちは、フリーランスエンジニアの太田雅昭です。

## Gitコマンド

Gitは多人数で作業する方は多くのコマンドを使用することと思います。ただ私は基本的に一人で開発しているため、それほどGitに詳しくありません。せいぜいCursorのUIでプッシュする程度です。それでも必要なときにはGitコマンドを打つことがあり、GPT4に聞いています。ただ毎回聞いて確認してコマンドを打つのも非効率ですので、ここにメモも兼ねて書かせていただきます。このページは随時更新する予定です。

### リセット

.gitignoreを途中で書き換えたりした場合、コミットするときに以前のファイルを参照しようとして警告が出てきます。放っておいてもいいのですが、以下のコマンドを使用することでリセットすることができます。

```
git rm -r --cached dist
git commit -m "distディレクトリをGitの追跡対象から削除"
git push
```

全てをリセットするだけなら、以下の様にもできます。.gitignoreを編集した後などに実行します。

```
git rm -r --cached .
git add .
```

### リベース

push前の複数コミットをまとめたりする場合に使用します。インタラクションモードで行うには-iフラグを用います。

```sh
git rebase -i
```

ここでpickあるいはsquashするコミットを指定します。一つにまとめるには一番上をpickにして残りをsquashにします。ところが間違えて全てsquashにしてしまい、コミットが消えてしまいました。ですが大丈夫です。下記のようにしてリセットできます。

```sh
git rebase --abort
```



## シェルスクリプト

以下は、gitコマンドに関連するシェルスクリプトです。ほとんど自分の備忘用ですが、お役に立つこともあるかと思います。

### ビルドとプッシュ

以下はビルドにturboを使用した例です。コメントメッセージを渡して使用します。ビルドが成功すれば、そのままプッシュします。

```
if [ $# -eq 0 ]; then
    echo "コミットメッセージを入力してください"
    exit 1
fi

commit_message="$1"

if turbo run build; then # ビルドコマンド
    git add .
    git commit -m "$commit_message"
    git push
else
    echo "Build failed"
fi
```

### タグ付け

最新のタグを表示した後、新しくつけるタグを入力すれば、それをプッシュします。

```
# 最新のタグを取得
latest_tag=$(git describe --tags `git rev-list --tags --max-count=1`)

echo "最新のタグ: $latest_tag"

# 新しいタグを入力
read -p "新しいタグを入力してください: " new_tag

if [ -z "$new_tag" ]; then
    echo "タグを入力してください"
    exit 1
fi

# 新しいタグを作成してプッシュ
git tag "$new_tag"
git push origin "$new_tag"
```
