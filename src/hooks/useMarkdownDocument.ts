import { useCallback, useEffect, useState } from "react";
import { open, save } from "@tauri-apps/plugin-dialog";
import { readMarkdownFile, writeMarkdownFile } from "@/lib/markdownClient";
import { fileName } from "@/lib/path";

const initialMarkdown = `# かけるんです

軽やかに書ける、デスクトップMarkdownエディタです。

## はじめかた

- 左側でMarkdownを編集
- 右側でプレビューを確認
- \`⌘S\` または \`Ctrl+S\` で保存

> 「開く」から既存の.mdファイルも編集できます。
`;

type DocumentState = {
  content: string;
  savedContent: string;
  filePath: string | null;
};

const initialDocument: DocumentState = {
  content: initialMarkdown,
  savedContent: initialMarkdown,
  filePath: null,
};

export function useMarkdownDocument(onMessage: (message: string) => void) {
  const [document, setDocument] = useState(initialDocument);
  const { content, savedContent, filePath } = document;
  const isDirty = content !== savedContent;

  const setContent = useCallback((nextContent: string) => {
    setDocument((current) => ({ ...current, content: nextContent }));
  }, []);

  const replaceDocument = useCallback((nextContent: string, nextFilePath: string | null) => {
    setDocument({
      content: nextContent,
      savedContent: nextContent,
      filePath: nextFilePath,
    });
  }, []);

  const confirmDiscard = useCallback(() => (
    !isDirty || window.confirm("保存されていない変更を破棄しますか？")
  ), [isDirty]);

  const newDocument = useCallback(() => {
    if (!confirmDiscard()) return;
    replaceDocument("", null);
    onMessage("新しい文書を作成しました");
  }, [confirmDiscard, onMessage, replaceDocument]);

  const loadDocument = useCallback(async (path: string) => {
    if (!confirmDiscard()) return;
    try {
      const text = await readMarkdownFile(path);
      replaceDocument(text, path);
      onMessage(`${fileName(path)} を開きました`);
    } catch (error) {
      onMessage(`開けませんでした: ${String(error)}`);
    }
  }, [confirmDiscard, onMessage, replaceDocument]);

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
      await writeMarkdownFile({ path: destination, content });
      setDocument((current) => ({
        ...current,
        savedContent: content,
        filePath: destination,
      }));
      onMessage(`${fileName(destination)} を保存しました`);
    } catch (error) {
      onMessage(`保存できませんでした: ${String(error)}`);
    }
  }, [content, filePath, onMessage]);

  const createDocumentAtPath = useCallback((path: string) => {
    replaceDocument("", path);
    onMessage(`${fileName(path)} を作成しました`);
  }, [onMessage, replaceDocument]);

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
