import { FilePlus2, FolderOpen, Moon, Save, Sun } from "lucide-react";
import { Brand } from "@/components/app/Brand";
import { HeaderAction } from "@/components/app/HeaderAction";
import { HeaderActions } from "@/components/app/HeaderActions";
import { Topbar } from "@/components/app/Topbar";

type HeaderProps = {
  fileName: string;
  isDirty: boolean;
  theme: "light" | "dark";
  onNewDocument: () => void;
  onOpenDocument: () => void;
  onSaveDocument: () => void;
  onToggleTheme: () => void;
};

export function Header({
  fileName,
  isDirty,
  theme,
  onNewDocument,
  onOpenDocument,
  onSaveDocument,
  onToggleTheme,
}: HeaderProps) {
  return (
    <Topbar>
      <Brand fileName={fileName} isDirty={isDirty} />
      <HeaderActions>
        <HeaderAction icon={FilePlus2} label="新規" onClick={onNewDocument} title="新規作成 (⌘/Ctrl+N)" />
        <HeaderAction icon={FolderOpen} label="開く" onClick={onOpenDocument} title="開く (⌘/Ctrl+O)" />
        <HeaderAction icon={Save} label="保存" onClick={onSaveDocument} title="保存 (⌘/Ctrl+S)" primary />
        <HeaderAction icon={theme === "light" ? Moon : Sun} label="テーマを切り替える" onClick={onToggleTheme} iconOnly />
      </HeaderActions>
    </Topbar>
  );
}
