import { useCallback, useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { open, save } from "@tauri-apps/plugin-dialog";
import { fileName } from "@/lib/path";

const initialMarkdown = `# かけるんです

軽やかに書ける、デスクトップMarkdownエディタです。

## はじめかた

- 左側でMarkdownを編集
- 右側でプレビューを確認
- \`⌘S\` または \`Ctrl+S\` で保存

> 「開く」から既存の.mdファイルも編集できます。
`;

export function useMarkdownDocument(onMessage: (message: string) => void) {
  const [content, setContent] = useState(initialMarkdown);
  const [savedContent, setSavedContent] = useState(initialMarkdown);
  const [filePath, setFilePath] = useState<string | null>(null);
  const isDirty = content !== savedContent;

  const confirmDiscard = useCallback(() => (
    !isDirty || window.confirm("保存されていない変更を破棄しますか？")
  ), [isDirty]);

  const newDocument = useCallback(() => {
    if (!confirmDiscard()) return;
    setContent("");
    setSavedContent("");
    setFilePath(null);
    onMessage("新しい文書を作成しました");
  }, [confirmDiscard, onMessage]);

  const loadDocument = useCallback(async (path: string) => {
    if (!confirmDiscard()) return;
    try {
      const text = await invoke<string>("read_markdown_file", { path });
      setContent(text);
      setSavedContent(text);
      setFilePath(path);
      onMessage(`${fileName(path)} を開きました`);
    } catch (error) {
      onMessage(`開けませんでした: ${String(error)}`);
    }
  }, [confirmDiscard, onMessage]);

  const openDocument = useCallback(async () => {
    try {
      const selected = await open({
        multiple: false,
        filters: [{ name: "Markdown", extensions: ["md", "markdown", "mdx"] }],
      });
      if (selected) await loadDocument(selected);
    } catch (error) {
      onMessage(`開けませんでした: ${String(error)}`);
    }
  }, [loadDocument, onMessage]);

  const saveDocument = useCallback(async () => {
    try {
      let destination = filePath;
      if (!destination) {
        destination = await save({
          defaultPath: "無題.md",
          filters: [{ name: "Markdown", extensions: ["md"] }],
        });
      }
      if (!destination) return;
      await invoke("write_markdown_file", { path: destination, content });
      setFilePath(destination);
      setSavedContent(content);
      onMessage(`${fileName(destination)} を保存しました`);
    } catch (error) {
      onMessage(`保存できませんでした: ${String(error)}`);
    }
  }, [content, filePath, onMessage]);

  const createDocumentAtPath = useCallback((path: string) => {
    setContent("");
    setSavedContent("");
    setFilePath(path);
    onMessage(`${fileName(path)} を作成しました`);
  }, [onMessage]);

  useEffect(() => {
    const preventClose = (event: BeforeUnloadEvent) => {
      if (isDirty) event.preventDefault();
    };
    window.addEventListener("beforeunload", preventClose);
    return () => window.removeEventListener("beforeunload", preventClose);
  }, [isDirty]);

  return {
    content,
    setContent,
    filePath,
    currentFileName: fileName(filePath),
    isDirty,
    confirmDiscard,
    newDocument,
    loadDocument,
    openDocument,
    saveDocument,
    createDocumentAtPath,
  };
}
