import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import {
  listenToLibraryChanges,
  listMarkdownFiles,
  watchMarkdownFolder,
} from "@/lib/markdownClient";
import {
  buildFileTree,
  type LibraryFolder,
  type MarkdownFile,
} from "@/lib/markdownLibrary";
import { fileName } from "@/lib/path";

type MarkdownLibraryOptions = {
  onMessage: (message: string) => void;
};

export function useMarkdownLibrary({ onMessage }: MarkdownLibraryOptions) {
  const [libraryFolder, setLibraryFolder] = useState<string | null>(() =>
    localStorage.getItem("kakerundesu-library-folder"),
  );
  const [libraryFiles, setLibraryFiles] = useState<MarkdownFile[]>([]);
  const [libraryFolders, setLibraryFolders] = useState<LibraryFolder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [collapsedFolders, setCollapsedFolders] = useState<Set<string>>(() => new Set());
  const activeLibraryFolder = useRef(libraryFolder);
  const latestRefreshId = useRef(0);

  const expandFolder = useCallback((key: string) => {
    setCollapsedFolders((current) => {
      const next = new Set(current);
      next.delete(key);
      return next;
    });
  }, []);

  const refreshLibrary = useCallback(async (folder: string | null) => {
    if (folder !== activeLibraryFolder.current) return;
    const refreshId = ++latestRefreshId.current;
    if (!folder) {
      setLibraryFiles([]);
      setLibraryFolders([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const listing = await listMarkdownFiles(folder);
      if (refreshId !== latestRefreshId.current || folder !== activeLibraryFolder.current) return;
      setLibraryFiles(listing.files);
      setLibraryFolders(listing.folders);
      onMessage(`${listing.files.length}件のMarkdownファイルを読み込みました`);
    } catch (error) {
      if (refreshId !== latestRefreshId.current || folder !== activeLibraryFolder.current) return;
      setLibraryFiles([]);
      setLibraryFolders([]);
      onMessage(`フォルダを読み込めませんでした: ${String(error)}`);
    } finally {
      if (refreshId === latestRefreshId.current && folder === activeLibraryFolder.current) {
        setIsLoading(false);
      }
    }
  }, [onMessage]);

  const chooseFolder = useCallback(async () => {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
        defaultPath: libraryFolder ?? undefined,
      });
      if (!selected) return;
      activeLibraryFolder.current = selected;
      latestRefreshId.current += 1;
      setLibraryFolder(selected);
      localStorage.setItem("kakerundesu-library-folder", selected);
    } catch (error) {
      onMessage(`フォルダを設定できませんでした: ${String(error)}`);
    }
  }, [libraryFolder, onMessage]);

  const toggleFolder = useCallback((key: string) => {
    setCollapsedFolders((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  useEffect(() => {
    void refreshLibrary(libraryFolder);
  }, [libraryFolder, refreshLibrary]);

  useEffect(() => {
    if (!libraryFolder) return;

    let refreshTimer: ReturnType<typeof setTimeout> | undefined;
    let disposed = false;
    let stopListening: (() => void) | undefined;

    void listenToLibraryChanges(() => {
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => void refreshLibrary(libraryFolder), 250);
    }).then((unlisten) => {
      if (disposed) unlisten();
      else stopListening = unlisten;
    });

    void watchMarkdownFolder(libraryFolder).catch((error) => {
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

  const refreshCurrentLibrary = useCallback(
    () => refreshLibrary(libraryFolder),
    [libraryFolder, refreshLibrary],
  );

  return {
    nodes,
    fileCount: libraryFiles.length,
    isLoading,
    libraryFolder,
    libraryName: libraryFolder ? fileName(libraryFolder) : "フォルダ未設定",
    collapsedFolders,
    toggleFolder,
    expandFolder,
    refreshLibrary: refreshCurrentLibrary,
    chooseFolder,
  };
}

export type MarkdownLibrary = ReturnType<typeof useMarkdownLibrary>;
