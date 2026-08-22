import { FilePlus2, FolderOpen, Moon, Save, Sun } from "lucide-react";

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
    <header className="topbar">
      <div className="brand">
        <span className="brand-mark">か</span>
        <div>
          <strong>かけるんです</strong>
          <span className="file-name">{fileName}{isDirty ? " •" : ""}</span>
        </div>
      </div>
      <nav className="actions" aria-label="ファイル操作">
        <button onClick={onNewDocument} title="新規作成 (⌘/Ctrl+N)"><FilePlus2 />新規</button>
        <button onClick={onOpenDocument} title="開く (⌘/Ctrl+O)"><FolderOpen />開く</button>
        <button className="primary" onClick={onSaveDocument} title="保存 (⌘/Ctrl+S)"><Save />保存</button>
        <button className="icon-button" onClick={onToggleTheme} aria-label="テーマを切り替える">
          {theme === "light" ? <Moon /> : <Sun />}
        </button>
      </nav>
    </header>
  );
}
