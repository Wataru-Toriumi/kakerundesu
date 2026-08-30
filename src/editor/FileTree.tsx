import {
  Check,
  ChevronRight,
  FileText,
  Folder,
  FolderOpen,
  FolderPlus,
  Plus,
  X,
} from "lucide-react";
import { FolderAction } from "@/components/editor/FolderAction";
import { FolderActions } from "@/components/editor/FolderActions";
import { FolderChevron } from "@/components/editor/FolderChevron";
import { FolderLine } from "@/components/editor/FolderLine";
import { NewItemAction } from "@/components/editor/NewItemAction";
import { NewItemForm } from "@/components/editor/NewItemForm";
import { NewItemInput } from "@/components/editor/NewItemInput";
import { TreeFolder } from "@/components/editor/TreeFolder";
import { TreeRow } from "@/components/editor/TreeRow";
import type { TreeNode } from "@/lib/markdownLibrary";

type FileTreeProps = {
  nodes: TreeNode[];
  depth?: number;
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
};

export function FileTree({
  nodes,
  depth = 0,
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
              <FolderAction onClick={() => onStartCreate(node.key)} label={`${node.name}に新規ファイルを作成`} title="新規ファイル"><Plus /></FolderAction>
              <FolderAction onClick={() => onStartCreateDirectory(node.key)} label={`${node.name}に新規フォルダを作成`} title="新規フォルダ"><FolderPlus /></FolderAction>
            </FolderActions>
          </FolderLine>
          {creatingFolder === node.key && (
            <NewItemForm depth={depth} onSubmit={() => onSubmitNewFile(node.key)}>
              <FileText />
              <NewItemInput
                autoFocus
                value={newFileName}
                onChange={(event) => onChangeNewFileName(event.target.value)}
                onKeyDown={(event) => { if (event.key === "Escape") onCancelCreate(); }}
                aria-label="新しいファイル名"
              />
              <NewItemAction type="submit" label="作成"><Check /></NewItemAction>
              <NewItemAction type="button" onClick={onCancelCreate} label="キャンセル"><X /></NewItemAction>
            </NewItemForm>
          )}
          {creatingDirectory === node.key && (
            <NewItemForm depth={depth} onSubmit={() => onSubmitNewDirectory(node.key)}>
              <Folder />
              <NewItemInput
                autoFocus
                value={newDirectoryName}
                onChange={(event) => onChangeNewDirectoryName(event.target.value)}
                onKeyDown={(event) => { if (event.key === "Escape") onCancelCreateDirectory(); }}
                aria-label="新しいフォルダ名"
              />
              <NewItemAction type="submit" label="作成"><Check /></NewItemAction>
              <NewItemAction type="button" onClick={onCancelCreateDirectory} label="キャンセル"><X /></NewItemAction>
            </NewItemForm>
          )}
          {!collapsed && (
            <FileTree
              nodes={node.children}
              depth={depth + 1}
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
