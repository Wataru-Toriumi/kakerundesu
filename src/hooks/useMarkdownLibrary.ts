import { useCallback, useEffect, useMemo, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { open } from "@tauri-apps/plugin-dialog";
import { fileName } from "@/lib/path";
import {
  buildFileTree,
  type LibraryFolder,
  type MarkdownFile,
} from "@/lib/markdownLibrary";

type LibraryListing = { files: MarkdownFile[]; folders: LibraryFolder[] };

type MarkdownLibraryOptions = {
  confirmDiscard: () => boolean;
  onCreateFile: (path: string) => void;
  onMessage: (message: string) => void;
};

export function useMarkdownLibrary({ confirmDiscard, onCreateFile, onMessage }: MarkdownLibraryOptions) {
  const [libraryFolder, setLibraryFolder] = useState<string | null>(() =>
    localStorage.getItem("kakerundesu-library-folder"),
  );
  const [libraryFiles, setLibraryFiles] = useState<MarkdownFile[]>([]);
  const [libraryFolders, setLibraryFolders] = useState<LibraryFolder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [collapsedFolders, setCollapsedFolders] = useState<Set<string>>(() => new Set());
  const [creatingFolder, setCreatingFolder] = useState<string | null>(null);
  const [newFileName, setNewFileName] = useState("無題.md");
  const [creatingDirectory, setCreatingDirectory] = useState<string | null>(null);
  const [newDirectoryName, setNewDirectoryName] = useState("新しいフォルダ");

  const expandFolder = useCallback((key: string) => {
    setCollapsedFolders((current) => {
      const next = new Set(current);
      next.delete(key);
      return next;
    });
  }, []);

  const refreshLibrary = useCallback(async (folder = libraryFolder) => {
    if (!folder) {
      setLibraryFiles([]);
      setLibraryFolders([]);
      return;
    }

    setIsLoading(true);
    try {
      const listing = await invoke<LibraryListing>("list_markdown_files", { folder });
      setLibraryFiles(listing.files);
      setLibraryFolders(listing.folders);
      onMessage(`${listing.files.length}件のMarkdownファイルを読み込みました`);
    } catch (error) {
      setLibraryFiles([]);
      setLibraryFolders([]);
      onMessage(`フォルダを読み込めませんでした: ${String(error)}`);
    } finally {
      setIsLoading(false);
    }
  }, [libraryFolder, onMessage]);

  const chooseFolder = useCallback(async () => {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
        defaultPath: libraryFolder ?? undefined,
      });
      if (!selected) return;
      setLibraryFolder(selected);
      localStorage.setItem("kakerundesu-library-folder", selected);
      await refreshLibrary(selected);
    } catch (error) {
      onMessage(`フォルダを設定できませんでした: ${String(error)}`);
    }
  }, [libraryFolder, onMessage, refreshLibrary]);

  const startCreatingFile = useCallback((relativeFolder: string) => {
    if (!libraryFolder || !confirmDiscard()) return;
    expandFolder(relativeFolder);
    setNewFileName("無題.md");
    setCreatingDirectory(null);
    setCreatingFolder(relativeFolder);
  }, [confirmDiscard, expandFolder, libraryFolder]);

  const createFile = useCallback(async (relativeFolder: string) => {
    if (!libraryFolder || !newFileName.trim()) return;
    try {
      const path = await invoke<string>("create_markdown_file", {
        root: libraryFolder,
        relativeFolder,
        fileName: newFileName,
      });
      onCreateFile(path);
      setCreatingFolder(null);
      expandFolder(relativeFolder);
      await refreshLibrary();
    } catch (error) {
      onMessage(`ファイルを作成できませんでした: ${String(error)}`);
    }
  }, [expandFolder, libraryFolder, newFileName, onCreateFile, onMessage, refreshLibrary]);

  const startCreatingDirectory = useCallback((relativeParent: string) => {
    if (!libraryFolder) return;
    expandFolder(relativeParent);
    setNewDirectoryName("新しいフォルダ");
    setCreatingFolder(null);
    setCreatingDirectory(relativeParent);
  }, [expandFolder, libraryFolder]);

  const createDirectory = useCallback(async (relativeParent: string) => {
    if (!libraryFolder || !newDirectoryName.trim()) return;
    try {
      await invoke("create_folder", {
        root: libraryFolder,
        relativeParent,
        folderName: newDirectoryName,
      });
      setCreatingDirectory(null);
      onMessage(`${newDirectoryName.trim()} を作成しました`);
      await refreshLibrary();
    } catch (error) {
      onMessage(`フォルダを作成できませんでした: ${String(error)}`);
    }
  }, [libraryFolder, newDirectoryName, onMessage, refreshLibrary]);

  const toggleFolder = useCallback((key: string) => {
    setCollapsedFolders((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  useEffect(() => {
    void refreshLibrary();
  }, [refreshLibrary]);

  useEffect(() => {
    if (!libraryFolder) return;

    let refreshTimer: ReturnType<typeof setTimeout> | undefined;
    let disposed = false;
    let stopListening: (() => void) | undefined;

    void listen("library-changed", () => {
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => void refreshLibrary(), 250);
    }).then((unlisten) => {
      if (disposed) unlisten();
      else stopListening = unlisten;
    });

    void invoke("watch_markdown_folder", { folder: libraryFolder }).catch((error) => {
      onMessage(`フォルダを監視できませんでした: ${String(error)}`);
    });

    return () => {
      disposed = true;
      clearTimeout(refreshTimer);
      stopListening?.();
    };
  }, [libraryFolder, onMessage, refreshLibrary]);

  const nodes = useMemo(
    () => buildFileTree(libraryFiles, libraryFolders),
    [libraryFiles, libraryFolders],
  );

  return {
    nodes,
    fileCount: libraryFiles.length,
    isLoading,
    libraryFolder,
    libraryName: libraryFolder ? fileName(libraryFolder) : "フォルダ未設定",
    collapsedFolders,
    toggleFolder,
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
    chooseFolder,
  };
}

export type MarkdownLibrary = ReturnType<typeof useMarkdownLibrary>;
