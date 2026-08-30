import { useCallback, useState } from "react";
import { createFolder, createMarkdownFile } from "@/lib/markdownClient";

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
  const [creatingFolder, setCreatingFolder] = useState<string | null>(null);
  const [newFileName, setNewFileName] = useState("無題.md");
  const [creatingDirectory, setCreatingDirectory] = useState<string | null>(null);
  const [newDirectoryName, setNewDirectoryName] = useState("新しいフォルダ");

  const startCreatingFile = useCallback((relativeFolder: string) => {
    if (!libraryFolder || !confirmDiscard()) return;
    onExpandFolder(relativeFolder);
    setNewFileName("無題.md");
    setCreatingDirectory(null);
    setCreatingFolder(relativeFolder);
  }, [confirmDiscard, libraryFolder, onExpandFolder]);

  const createFile = useCallback(async (relativeFolder: string) => {
    if (!libraryFolder || !newFileName.trim()) return;
    try {
      const path = await createMarkdownFile({
        root: libraryFolder,
        relativeFolder,
        fileName: newFileName,
      });
      onCreateFile(path);
      setCreatingFolder(null);
      onExpandFolder(relativeFolder);
      await onRefreshLibrary();
    } catch (error) {
      onMessage(`ファイルを作成できませんでした: ${String(error)}`);
    }
  }, [libraryFolder, newFileName, onCreateFile, onExpandFolder, onMessage, onRefreshLibrary]);

  const startCreatingDirectory = useCallback((relativeParent: string) => {
    if (!libraryFolder) return;
    onExpandFolder(relativeParent);
    setNewDirectoryName("新しいフォルダ");
    setCreatingFolder(null);
    setCreatingDirectory(relativeParent);
  }, [libraryFolder, onExpandFolder]);

  const createDirectory = useCallback(async (relativeParent: string) => {
    if (!libraryFolder || !newDirectoryName.trim()) return;
    try {
      await createFolder({
        root: libraryFolder,
        relativeParent,
        folderName: newDirectoryName,
      });
      setCreatingDirectory(null);
      onMessage(`${newDirectoryName.trim()} を作成しました`);
      await onRefreshLibrary();
    } catch (error) {
      onMessage(`フォルダを作成できませんでした: ${String(error)}`);
    }
  }, [libraryFolder, newDirectoryName, onMessage, onRefreshLibrary]);

  return {
    creatingFolder,
    newFileName,
    startCreatingFile,
    setNewFileName,
    createFile,
    cancelCreatingFile: () => setCreatingFolder(null),
    creatingDirectory,
    newDirectoryName,
    startCreatingDirectory,
    setNewDirectoryName,
    createDirectory,
    cancelCreatingDirectory: () => setCreatingDirectory(null),
  };
}

export type LibraryCreation = ReturnType<typeof useLibraryCreation>;
