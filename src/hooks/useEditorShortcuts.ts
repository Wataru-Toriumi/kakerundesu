import { useEffect } from "react";

type EditorShortcuts = {
  onNewDocument: () => void;
  onOpenDocument: () => void | Promise<void>;
  onSaveDocument: () => void | Promise<void>;
};

export function useEditorShortcuts({ onNewDocument, onOpenDocument, onSaveDocument }: EditorShortcuts) {
  useEffect(() => {
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
  }, [onNewDocument, onOpenDocument, onSaveDocument]);
}
