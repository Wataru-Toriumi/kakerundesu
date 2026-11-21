# UIコンポーネントの開発

UI部品にはshadcn/uiを使い、Tailwind CSSでスタイルを指定します。コンポーネントを追加するときは、リポジトリのルートで次のコマンドを実行します。以下はダイアログを追加する例です。

```bash
pnpm dlx shadcn@latest add dialog
```

生成された部品は [src/components/ui](../../src/components/ui/) に配置されます。アプリ固有の見た目は、これらの部品を組み合わせるコンポーネントに持たせます。条件に応じてTailwindのクラス名を組み合わせるときは、既存の [cn 関数](../../src/lib/utils.ts) を使います。

レイアウト部品の使い分けやスタイルの配置は、[コンポーネントとスタイルの規約](../../.agents/rules/frontend/components.md)を参照してください。
