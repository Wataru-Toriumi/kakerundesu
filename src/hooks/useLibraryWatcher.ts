import { useEffect } from "react";
import {
  listenToLibraryChanges,
  watchMarkdownFolder,
} from "@/lib/markdownClient";

type LibraryWatcherOptions = {
  libraryFolder: string | null;
  onChange: () => void | Promise<void>;
  onMessage: (message: string) => void;
};

export function useLibraryWatcher({
  libraryFolder,
  onChange,
  onMessage,
}: LibraryWatcherOptions) {
  useEffect(() => {
    if (!libraryFolder) return;

    let refreshTimer: ReturnType<typeof setTimeout> | undefined;
    let disposed = false;
    let stopListening: (() => void) | undefined;

    void listenToLibraryChanges(() => {
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => void onChange(), 250);
    }).then((unlisten) => {
      if (disposed) unlisten();
      else stopListening = unlisten;
    }).catch((error) => {
      if (!disposed) {
        onMessage(`変更通知を受信できませんでした: ${String(error)}`);
      }
    });

    void watchMarkdownFolder(libraryFolder).catch((error) => {
      if (!disposed) {
        onMessage(`フォルダを監視できませんでした: ${String(error)}`);
      }
    });

    return () => {
      disposed = true;
      clearTimeout(refreshTimer);
      stopListening?.();
    };
  }, [libraryFolder, onChange, onMessage]);
}
