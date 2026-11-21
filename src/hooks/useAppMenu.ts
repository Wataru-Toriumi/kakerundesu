import { useEffect, useEffectEvent } from "react";
import { isTauri } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";

type MenuAction = "open-settings" | "open-document";

type AppMenuOptions = {
  onOpenSettings: () => void;
  onOpenDocument: () => void;
  onMessage: (message: string) => void;
};

export function useAppMenu({ onOpenSettings, onOpenDocument, onMessage }: AppMenuOptions) {
  const onAction = useEffectEvent((action: MenuAction) => {
    if (action === "open-settings") onOpenSettings();
    if (action === "open-document") onOpenDocument();
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
