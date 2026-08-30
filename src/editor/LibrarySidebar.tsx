import { FolderCog, FolderOpen } from "lucide-react";
import { ChooseFolderButton } from "@/components/editor/ChooseFolderButton";
import { EmptyLibrary } from "@/components/editor/EmptyLibrary";
import { FileList } from "@/components/editor/FileList";
import { LibraryFolder } from "@/components/editor/LibraryFolder";
import { LibraryLayout } from "@/components/editor/LibraryLayout";
import { PaneTitle } from "@/components/editor/PaneTitle";
import { TruncatedText } from "@/components/editor/TruncatedText";
import { FileTree } from "@/editor/FileTree";
import type { TreeNode } from "@/lib/markdownLibrary";

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
    <LibraryLayout>
      <PaneTitle title="FILES" meta={isLoading ? "読み込み中" : `${fileCount}件`} library />
      <LibraryFolder title={libraryFolder ?? "フォルダ未設定"}>
        <FolderOpen />
        <TruncatedText>{libraryName}</TruncatedText>
      </LibraryFolder>
      <FileList>
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
        {libraryFolder && !isLoading && nodes.length === 0 && <EmptyLibrary>フォルダは空です</EmptyLibrary>}
        {!libraryFolder && <EmptyLibrary>表示するフォルダを設定してください</EmptyLibrary>}
      </FileList>
      <ChooseFolderButton onClick={onChooseFolder}>
        <FolderCog />フォルダを設定
      </ChooseFolderButton>
    </LibraryLayout>
  );
}
