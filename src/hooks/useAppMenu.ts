import { useEffect, useEffectEvent } from "react";
import { isTauri } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";

import type { DocumentActions } from "@/hooks/useEditorShortcuts";

type MenuAction = "open-settings" | "new-document" | "open-document" | "save-document";

type AppMenuOptions = DocumentActions & {
  onOpenSettings: () => void;
  onMessage: (message: string) => void;
};

export function useAppMenu({ enabled, onOpenSettings, onNewDocument, onOpenDocument, onSaveDocument, onMessage }: AppMenuOptions) {
  const onAction = useEffectEvent((action: MenuAction) => {
    if (action === "open-settings") onOpenSettings();
    if (!enabled) return;
    if (action === "new-document") onNewDocument();
    if (action === "open-document") void onOpenDocument();
    if (action === "save-document") void onSaveDocument();
  });

  useEffect(() => {
    if (!isTauri()) return;
    let disposed = false;
    let unlisten: (() => void) | undefined;
    void listen<MenuAction>("app-menu", ({ payload }) => {
      if (!disposed) onAction(payload);
    }).then((stop) => {
      if (disposed) stop();
      else unlisten = stop;
    }).catch((error) => {
      if (!disposed) onMessage(`メニューの初期化に失敗しました: ${String(error)}`);
    });
    return () => {
      disposed = true;
      unlisten?.();
    };
  }, [onMessage]);
}
