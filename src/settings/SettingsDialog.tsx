import { SettingsPanel } from "@/components/settings/SettingsPanel";
import { ThemeSelector } from "@/components/settings/ThemeSelector";
import { Dialog, DialogTitle } from "@/components/ui/dialog";
import type { Theme } from "@/hooks/useTheme";

type SettingsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
};

export function SettingsDialog({ open, onOpenChange, theme, onThemeChange }: SettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <SettingsPanel>
        <DialogTitle>設定</DialogTitle>
        <ThemeSelector value={theme} onChange={onThemeChange} />
      </SettingsPanel>
    </Dialog>
  );
}
