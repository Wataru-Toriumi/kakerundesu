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
