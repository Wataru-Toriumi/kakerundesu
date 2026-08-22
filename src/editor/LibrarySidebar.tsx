import { FolderCog, FolderOpen } from "lucide-react";
import { FileTree, type TreeNode } from "@/editor/FileTree";

export type LibrarySidebarProps = {
  nodes: TreeNode[];
  fileCount: number;
  isLoading: boolean;
  libraryFolder: string | null;
  libraryName: string;
  collapsedFolders: Set<string>;
  activePath: string | null;
  onToggleFolder: (key: string) => void;
  onOpenFile: (path: string) => void;
  creatingFolder: string | null;
  newFileName: string;
  onStartCreate: (relativeFolder: string) => void;
  onChangeNewFileName: (name: string) => void;
  onSubmitNewFile: (relativeFolder: string) => void;
  onCancelCreate: () => void;
  creatingDirectory: string | null;
  newDirectoryName: string;
  onStartCreateDirectory: (relativeParent: string) => void;
  onChangeNewDirectoryName: (name: string) => void;
  onSubmitNewDirectory: (relativeParent: string) => void;
  onCancelCreateDirectory: () => void;
  onChooseFolder: () => void;
};

export function LibrarySidebar({
  nodes,
  fileCount,
  isLoading,
  libraryFolder,
  libraryName,
  collapsedFolders,
  activePath,
  onToggleFolder,
  onOpenFile,
  creatingFolder,
  newFileName,
  onStartCreate,
  onChangeNewFileName,
  onSubmitNewFile,
  onCancelCreate,
  creatingDirectory,
  newDirectoryName,
  onStartCreateDirectory,
  onChangeNewDirectoryName,
  onSubmitNewDirectory,
  onCancelCreateDirectory,
  onChooseFolder,
}: LibrarySidebarProps) {
  return (
    <aside className="library">
      <div className="pane-title library-title">
        <span>FILES</span>
        <span>{isLoading ? "読み込み中" : `${fileCount}件`}</span>
      </div>
      <div className="library-folder" title={libraryFolder ?? "フォルダ未設定"}>
        <FolderOpen />
        <span>{libraryName}</span>
      </div>
      <div className="file-list">
        <FileTree
          nodes={nodes}
          collapsedFolders={collapsedFolders}
          activePath={activePath}
          onToggleFolder={onToggleFolder}
          onOpenFile={onOpenFile}
          creatingFolder={creatingFolder}
          newFileName={newFileName}
          onStartCreate={onStartCreate}
          onChangeNewFileName={onChangeNewFileName}
          onSubmitNewFile={onSubmitNewFile}
          onCancelCreate={onCancelCreate}
          creatingDirectory={creatingDirectory}
          newDirectoryName={newDirectoryName}
          onStartCreateDirectory={onStartCreateDirectory}
          onChangeNewDirectoryName={onChangeNewDirectoryName}
          onSubmitNewDirectory={onSubmitNewDirectory}
          onCancelCreateDirectory={onCancelCreateDirectory}
        />
        {libraryFolder && !isLoading && nodes.length === 0 && <p>フォルダは空です</p>}
        {!libraryFolder && <p>表示するフォルダを設定してください</p>}
      </div>
      <button className="choose-folder" onClick={onChooseFolder}>
        <FolderCog />フォルダを設定
      </button>
    </aside>
  );
}
