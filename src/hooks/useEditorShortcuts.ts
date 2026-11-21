import { useEffect } from "react";
import { isTauri } from "@tauri-apps/api/core";

export type DocumentActions = {
  enabled: boolean;
  onNewDocument: () => void;
  onOpenDocument: () => void | Promise<void>;
  onSaveDocument: () => void | Promise<void>;
};

export function useEditorShortcuts({ enabled, onNewDocument, onOpenDocument, onSaveDocument }: DocumentActions) {
  useEffect(() => {
    if (!enabled || isTauri()) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (!event.metaKey && !event.ctrlKey) return;

      const key = event.key.toLowerCase();
      if (key === "s") {
        event.preventDefault();
        void onSaveDocument();
      } else if (key === "o") {
        event.preventDefault();
        void onOpenDocument();
      } else if (key === "n") {
        event.preventDefault();
        onNewDocument();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enabled, onNewDocument, onOpenDocument, onSaveDocument]);
}
