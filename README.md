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

プレビューではGitHub Flavored Markdownをサポートしています。安全のため、生HTMLは初期状態ではレンダリングしません。
