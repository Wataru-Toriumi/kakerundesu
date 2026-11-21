import { useEffect, useState } from "react";

export type ViewMode = "markdown" | "split" | "preview";

const storageKey = "kakerundesu-view-mode";

export function useViewMode() {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved === "markdown" || saved === "preview" ? saved : "split";
  });

  useEffect(() => {
    localStorage.setItem(storageKey, viewMode);
  }, [viewMode]);

  return { viewMode, setViewMode };
}
