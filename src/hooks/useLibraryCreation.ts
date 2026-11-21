import { useCallback, useState } from "react";
import { createFolder, createMarkdownFile } from "@/lib/markdownClient";

type CreationDraft = {
  kind: "file" | "directory";
  parentPath: string;
  name: string;
};

type LibraryCreationOptions = {
  libraryFolder: string | null;
  confirmDiscard: () => boolean;
  onCreateFile: (path: string) => void;
  onExpandFolder: (key: string) => void;
  onMessage: (message: string) => void;
  onRefreshLibrary: () => Promise<void>;
};

export function useLibraryCreation({
  libraryFolder,
  confirmDiscard,
  onCreateFile,
  onExpandFolder,
  onMessage,
  onRefreshLibrary,
}: LibraryCreationOptions) {
  const [draft, setDraft] = useState<CreationDraft | null>(null);

  const startCreating = useCallback((kind: CreationDraft["kind"], parentPath: string) => {
    if (!libraryFolder || (kind === "file" && !confirmDiscard())) return;
    onExpandFolder(parentPath);
    setDraft({ kind, parentPath, name: kind === "file" ? "無題.md" : "新しいフォルダ" });
  }, [confirmDiscard, libraryFolder, onExpandFolder]);

  const setName = (name: string) => {
    setDraft((current) => current && { ...current, name });
  };

  const submit = async () => {
    if (!libraryFolder || !draft || !draft.name.trim()) return;
    const { kind, parentPath, name } = draft;
    const closeSubmittedDraft = () => setDraft((current) => current === draft ? null : current);

    try {
      if (kind === "file") {
        const path = await createMarkdownFile({
          root: libraryFolder,
          relativeFolder: parentPath,
          fileName: name,
        });
        onCreateFile(path);
        closeSubmittedDraft();
        onExpandFolder(parentPath);
      } else {
        await createFolder({ root: libraryFolder, relativeParent: parentPath, folderName: name });
        closeSubmittedDraft();
        onMessage(`${name.trim()} を作成しました`);
      }
      await onRefreshLibrary();
    } catch (error) {
      const item = kind === "file" ? "ファイル" : "フォルダ";
      onMessage(`${item}を作成できませんでした: ${String(error)}`);
    }
  };

  return { draft, startCreating, setName, submit, cancel: () => setDraft(null) };
}

export type LibraryCreation = ReturnType<typeof useLibraryCreation>;
