# かけるんです

Tauri 2、React、TypeScriptで作ったデスクトップMarkdownエディタです。

## ドキュメント

- [外部仕様](docs/spec/README.md)
- [UIコンポーネントの開発](docs/development/ui-components.md)

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

## 検証

```bash
mise run check
```

フロントエンドだけを検証する場合は `pnpm check`、テストだけを実行する場合は
`pnpm test`を使用します。開発中にテストを監視する場合は`pnpm test:watch`、
Oxlintだけを実行する場合は`pnpm lint`を使用します。自動修正可能なlint違反には
`pnpm lint:fix`を使用できます。
