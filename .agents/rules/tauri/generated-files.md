# Tauri設定と生成物

- Tauriのワークフロー上、生成物のコミットが明確に必要な場合を除き、
  生成されたschemaを手作業で編集しないこと。
- `tauri.conf.json`、capability、Cargo依存関係の変更は、必要な機能と同じ
  変更単位に含めること。
- `Cargo.toml` を変更した場合は、必要に応じて `Cargo.lock` の更新を含めること。
- 生成コマンドを実行した結果、依頼範囲外の大きな差分が生じた場合は、
  内容を確認せずにコミットしないこと。
- RustコードまたはTauri設定の変更後に必要な検証は、
  `.agents/rules/verification.md` に従うこと。
