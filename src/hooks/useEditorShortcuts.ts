import { useEffect } from "react";
import { isTauri } from "@tauri-apps/api/core";

type EditorShortcuts = {
  enabled: boolean;
  onNewDocument: () => void;
  onOpenDocument: () => void | Promise<void>;
  onSaveDocument: () => void | Promise<void>;
};

export function useEditorShortcuts({ enabled, onNewDocument, onOpenDocument, onSaveDocument }: EditorShortcuts) {
  useEffect(() => {
    if (!enabled) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (!event.metaKey && !event.ctrlKey) return;

      const key = event.key.toLowerCase();
      if (key === "s") {
        event.preventDefault();
        void onSaveDocument();
      } else if (key === "o" && !isTauri()) {
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
