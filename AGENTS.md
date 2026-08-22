# プロジェクト指示

このファイルは短く保つこと。詳細なルールは `.agents/rules/` 配下に置き、
対象範囲のファイルを変更する前に読むこと。

## ルールの振り分け

- `src/**`、`index.html`、`components.json`、`package.json`、
  `pnpm-lock.yaml`、`tsconfig*.json`、`vite.config.ts` を変更する前に、
  `.agents/rules/frontend/README.md` を読み、そこから該当する詳細ルールを
  読むこと。
- `src-tauri/**` を変更する前に `.agents/rules/tauri/README.md` を読み、
  そこから該当する詳細ルールを読むこと。
- テストを追加・変更する前、および実装作業の完了を報告する前に、
  `.agents/rules/verification.md` を読むこと。
- ステージ、コミット、push、Pull Requestの作成を行う前に、
  `.agents/rules/git.md` を読むこと。

複数の対象範囲に該当する場合は、関連するルールファイルをすべて読むこと。
ユーザーからより具体的な指示がある場合は、そちらを優先すること。
