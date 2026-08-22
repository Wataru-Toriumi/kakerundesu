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

export type MarkdownFile = { name: string; path: string; relativePath: string };
export type LibraryFolder = { relativePath: string };

type FileNode = { type: "file"; name: string; file: MarkdownFile };
type FolderNode = { type: "folder"; name: string; key: string; children: TreeNode[] };
export type TreeNode = FileNode | FolderNode;

export function buildFileTree(files: MarkdownFile[], folders: LibraryFolder[]): TreeNode[] {
  const root: FolderNode = { type: "folder", name: "", key: "", children: [] };

  const ensureFolder = (parts: string[]) => {
    let parent = root;
    for (const [index, part] of parts.entries()) {
      const key = parts.slice(0, index + 1).join("/");
      let folder = parent.children.find(
        (node): node is FolderNode => node.type === "folder" && node.name === part,
      );
      if (!folder) {
        folder = { type: "folder", name: part, key, children: [] };
        parent.children.push(folder);
      }
      parent = folder;
    }
    return parent;
  };

  for (const folder of folders) {
    ensureFolder(folder.relativePath.split(/[\\/]/).filter(Boolean));
  }

  for (const file of files) {
    const parts = file.relativePath.split(/[\\/]/).filter(Boolean);
    const name = parts.pop() ?? file.name;
    ensureFolder(parts).children.push({ type: "file", name, file });
  }

  const sortNodes = (nodes: TreeNode[]) => {
    nodes.sort((a, b) => {
      if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
      return a.name.localeCompare(b.name, "ja", { sensitivity: "base" });
    });
    for (const node of nodes) if (node.type === "folder") sortNodes(node.children);
  };
  sortNodes(root.children);
  return root.children;
}

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
        <div className="tree-folder" key={node.key}>
          <div className="folder-line">
            <button className="tree-row folder-row" style={{ paddingLeft: 8 + depth * 14 }} onClick={() => onToggleFolder(node.key)}>
              <ChevronRight className={collapsed ? "" : "expanded"} />
              {collapsed ? <Folder /> : <FolderOpen />}
              <span>{node.name}</span>
            </button>
            <div className="folder-actions">
              <button onClick={() => onStartCreate(node.key)} aria-label={`${node.name}に新規ファイルを作成`} title="新規ファイル"><Plus /></button>
              <button onClick={() => onStartCreateDirectory(node.key)} aria-label={`${node.name}に新規フォルダを作成`} title="新規フォルダ"><FolderPlus /></button>
            </div>
          </div>
          {creatingFolder === node.key && (
            <form className="new-file-form" style={{ paddingLeft: 24 + (depth + 1) * 14 }} onSubmit={(event) => { event.preventDefault(); onSubmitNewFile(node.key); }}>
              <FileText />
              <input
                autoFocus
                value={newFileName}
                onChange={(event) => onChangeNewFileName(event.target.value)}
                onKeyDown={(event) => { if (event.key === "Escape") onCancelCreate(); }}
                aria-label="新しいファイル名"
              />
              <button type="submit" aria-label="作成"><Check /></button>
              <button type="button" onClick={onCancelCreate} aria-label="キャンセル"><X /></button>
            </form>
          )}
          {creatingDirectory === node.key && (
            <form className="new-file-form" style={{ paddingLeft: 24 + (depth + 1) * 14 }} onSubmit={(event) => { event.preventDefault(); onSubmitNewDirectory(node.key); }}>
              <Folder />
              <input
                autoFocus
                value={newDirectoryName}
                onChange={(event) => onChangeNewDirectoryName(event.target.value)}
                onKeyDown={(event) => { if (event.key === "Escape") onCancelCreateDirectory(); }}
                aria-label="新しいフォルダ名"
              />
              <button type="submit" aria-label="作成"><Check /></button>
              <button type="button" onClick={onCancelCreateDirectory} aria-label="キャンセル"><X /></button>
            </form>
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
        </div>
      );
    }

    return (
      <button
        key={node.file.path}
        className={`tree-row file-row${node.file.path === activePath ? " active" : ""}`}
        style={{ paddingLeft: 24 + depth * 14 }}
        onClick={() => onOpenFile(node.file.path)}
        title={node.file.relativePath}
      >
        <FileText />
        <span>{node.name}</span>
      </button>
    );
  });
}
