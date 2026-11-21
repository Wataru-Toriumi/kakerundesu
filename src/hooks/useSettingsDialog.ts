import { useEffect, useState } from "react";
import { isTauri } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";

export function useSettingsDialog(onMessage: (message: string) => void) {
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    if (!isTauri()) return;
    let disposed = false;
    let unlisten: (() => void) | undefined;
    void listen("open-settings", () => {
      if (!disposed) setOpen(true);
    }).then((stop) => {
      if (disposed) stop();
      else unlisten = stop;
    }).catch((error) => {
      if (!disposed) onMessage(`設定メニューの初期化に失敗しました: ${String(error)}`);
    });
    return () => {
      disposed = true;
      unlisten?.();
    };
  }, [onMessage]);

  return { isOpen, setOpen };
}
