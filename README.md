# かけるんです

Tauri 2、React、TypeScriptで作ったデスクトップMarkdownエディタです。

## 開発

```bash
mise install
mise run install
mise run dev
```

## ビルド

```bash
mise run build
```

Node.js、pnpm、Rustのバージョンは `.mise.toml` で固定しています。miseを有効化したシェルでは、直接 `pnpm tauri dev` も実行できます。

## キーボードショートカット

- `Cmd/Ctrl + N`: 新規作成
- `Cmd/Ctrl + O`: ファイルを開く
- `Cmd/Ctrl + S`: 保存

左側の「フォルダを設定」からMarkdownを保存しているフォルダを選ぶと、空フォルダを含むサブフォルダを展開・折りたたみできるツリーとして表示できます。設定したフォルダは次回起動時にも復元され、ファイルやフォルダの追加・削除・名前変更はリアルタイムに反映されます。

フォルダ行に表示される操作ボタンから、そのフォルダ直下へ新しいMarkdownファイルやサブフォルダを作成できます。

プレビューではGitHub Flavored Markdownをサポートしています。安全のため、生HTMLは初期状態ではレンダリングしません。
