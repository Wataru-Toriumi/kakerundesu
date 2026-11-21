import { FilePlus2, FolderOpen, Save, Settings } from "lucide-react";
import { Brand } from "@/components/app/Brand";
import { HeaderAction } from "@/components/app/HeaderAction";
import { HeaderActions } from "@/components/app/HeaderActions";
import { Topbar } from "@/components/app/Topbar";
import { ViewModeSelector } from "@/components/app/ViewModeSelector";
import { Inline } from "@/components/layout/Inline";
import type { ViewMode } from "@/hooks/useViewMode";

type HeaderProps = {
  fileName: string;
  isDirty: boolean;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  onNewDocument: () => void;
  onOpenDocument: () => void;
  onSaveDocument: () => void;
  onOpenSettings: () => void;
};

export function Header({
  fileName,
  isDirty,
  viewMode,
  onChangeViewMode,
  onNewDocument,
  onOpenDocument,
  onSaveDocument,
  onOpenSettings,
}: HeaderProps) {
  return (
    <Topbar>
      <Brand fileName={fileName} isDirty={isDirty} />
      <Inline align="center" gap="3" flexShrink="0">
        <ViewModeSelector value={viewMode} onChange={onChangeViewMode} />
        <HeaderActions>
          <HeaderAction icon={FilePlus2} label="新規" onClick={onNewDocument} title="新規作成 (⌘/Ctrl+N)" />
          <HeaderAction icon={FolderOpen} label="開く" onClick={onOpenDocument} title="開く (⌘/Ctrl+O)" />
          <HeaderAction icon={Save} label="保存" onClick={onSaveDocument} title="保存 (⌘/Ctrl+S)" primary />
          <HeaderAction icon={Settings} label="設定" onClick={onOpenSettings} iconOnly />
        </HeaderActions>
      </Inline>
    </Topbar>
  );
}
