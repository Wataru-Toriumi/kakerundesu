import { Brand } from "@/components/app/Brand";
import { SettingsButton } from "@/components/app/SettingsButton";
import { Topbar } from "@/components/app/Topbar";
import { ViewModeSelector } from "@/components/app/ViewModeSelector";
import { Inline } from "@/components/layout/Inline";
import type { ViewMode } from "@/hooks/useViewMode";

type HeaderProps = {
  fileName: string;
  isDirty: boolean;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  onOpenSettings: () => void;
};

export function Header({
  fileName,
  isDirty,
  viewMode,
  onChangeViewMode,
  onOpenSettings,
}: HeaderProps) {
  return (
    <Topbar>
      <Brand fileName={fileName} isDirty={isDirty} />
      <Inline align="center" gap="3" flexShrink="0">
        <ViewModeSelector value={viewMode} onChange={onChangeViewMode} />
        <SettingsButton onClick={onOpenSettings} />
      </Inline>
    </Topbar>
  );
}
