import {
  ChevronRight,
  FileText,
  Folder,
  FolderOpen,
  FolderPlus,
  Plus,
} from "lucide-react";
import { FolderAction } from "@/components/editor/FolderAction";
import { FolderActions } from "@/components/editor/FolderActions";
import { FolderChevron } from "@/components/editor/FolderChevron";
import { FolderLine } from "@/components/editor/FolderLine";
import { TreeFolder } from "@/components/editor/TreeFolder";
import { TreeRow } from "@/components/editor/TreeRow";
import { LibraryItemCreationForm } from "@/editor/LibraryItemCreationForm";
import type { LibraryCreation } from "@/hooks/useLibraryCreation";
import type { TreeNode } from "@/lib/markdownLibrary";

type FileTreeProps = {
  nodes: TreeNode[];
  depth?: number;
  collapsedFolders: Set<string>;
  activePath: string | null;
  onToggleFolder: (key: string) => void;
  onOpenFile: (path: string) => void;
  creation: LibraryCreation;
};

export function FileTree({
  nodes,
  depth = 0,
  collapsedFolders,
  activePath,
  onToggleFolder,
  onOpenFile,
  creation,
}: FileTreeProps) {
  return nodes.map((node) => {
    if (node.type === "folder") {
      const collapsed = collapsedFolders.has(node.key);
      return (
        <TreeFolder key={node.key}>
          <FolderLine>
            <TreeRow depth={depth} kind="folder" onClick={() => onToggleFolder(node.key)}>
              <FolderChevron expanded={!collapsed}><ChevronRight /></FolderChevron>
              {collapsed ? <Folder /> : <FolderOpen />}
              <span>{node.name}</span>
            </TreeRow>
            <FolderActions>
              <FolderAction onClick={() => creation.startCreatingFile(node.key)} label={`${node.name}に新規ファイルを作成`} title="新規ファイル"><Plus /></FolderAction>
              <FolderAction onClick={() => creation.startCreatingDirectory(node.key)} label={`${node.name}に新規フォルダを作成`} title="新規フォルダ"><FolderPlus /></FolderAction>
            </FolderActions>
          </FolderLine>
          {creation.creatingFolder === node.key && (
            <LibraryItemCreationForm
              kind="file"
              depth={depth}
              name={creation.newFileName}
              onChangeName={creation.setNewFileName}
              onSubmit={() => creation.createFile(node.key)}
              onCancel={creation.cancelCreatingFile}
            />
          )}
          {creation.creatingDirectory === node.key && (
            <LibraryItemCreationForm
              kind="directory"
              depth={depth}
              name={creation.newDirectoryName}
              onChangeName={creation.setNewDirectoryName}
              onSubmit={() => creation.createDirectory(node.key)}
              onCancel={creation.cancelCreatingDirectory}
            />
          )}
          {!collapsed && (
            <FileTree
              nodes={node.children}
              depth={depth + 1}
              collapsedFolders={collapsedFolders}
              activePath={activePath}
              onToggleFolder={onToggleFolder}
              onOpenFile={onOpenFile}
              creation={creation}
            />
          )}
        </TreeFolder>
      );
    }

    return (
      <TreeRow
        key={node.file.path}
        depth={depth}
        kind="file"
        active={node.file.path === activePath}
        onClick={() => onOpenFile(node.file.path)}
        title={node.file.relativePath}
      >
        <FileText />
        <span>{node.name}</span>
      </TreeRow>
    );
  });
}
