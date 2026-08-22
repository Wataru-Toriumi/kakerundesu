import { useCallback, useEffect, useMemo, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { open, save } from "@tauri-apps/plugin-dialog";
import {
  buildFileTree,
  type LibraryFolder,
  type MarkdownFile,
} from "@/editor/FileTree";
import { Footer } from "@/Footer";
import { Header } from "@/Header";
import { Workspace } from "@/editor/Workspace";

const initialMarkdown = `# かけるんです

軽やかに書ける、デスクトップMarkdownエディタです。

## はじめかた

- 左側でMarkdownを編集
- 右側でプレビューを確認
- \`⌘S\` または \`Ctrl+S\` で保存

> 「開く」から既存の.mdファイルも編集できます。
`;

type Theme = "light" | "dark";
type LibraryListing = { files: MarkdownFile[]; folders: LibraryFolder[] };

function fileName(path: string | null) {
  if (!path) return "無題.md";
  return path.split(/[\\/]/).at(-1) ?? path;
}

function App() {
  const [content, setContent] = useState(initialMarkdown);
  const [savedContent, setSavedContent] = useState(initialMarkdown);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>(() =>
    localStorage.getItem("kakerundesu-theme") === "dark" ? "dark" : "light",
  );
  const [message, setMessage] = useState("新しい文書");
  const [libraryFolder, setLibraryFolder] = useState<string | null>(() =>
    localStorage.getItem("kakerundesu-library-folder"),
  );
  const [libraryFiles, setLibraryFiles] = useState<MarkdownFile[]>([]);
  const [libraryFolders, setLibraryFolders] = useState<LibraryFolder[]>([]);
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);
  const [collapsedFolders, setCollapsedFolders] = useState<Set<string>>(() => new Set());
  const [creatingFolder, setCreatingFolder] = useState<string | null>(null);
  const [newFileName, setNewFileName] = useState("無題.md");
  const [creatingDirectory, setCreatingDirectory] = useState<string | null>(null);
  const [newDirectoryName, setNewDirectoryName] = useState("新しいフォルダ");

  const isDirty = content !== savedContent;

  const newDocument = useCallback(() => {
    if (isDirty && !window.confirm("保存されていない変更を破棄しますか？")) return;
    setContent("");
    setSavedContent("");
    setFilePath(null);
    setMessage("新しい文書を作成しました");
  }, [isDirty]);

  const loadDocument = useCallback(async (path: string) => {
    if (isDirty && !window.confirm("保存されていない変更を破棄しますか？")) return;
    try {
      const text = await invoke<string>("read_markdown_file", { path });
      setContent(text);
      setSavedContent(text);
      setFilePath(path);
      setMessage(`${fileName(path)} を開きました`);
    } catch (error) {
      setMessage(`開けませんでした: ${String(error)}`);
    }
  }, [isDirty]);

  const openDocument = useCallback(async () => {
    try {
      const selected = await open({
        multiple: false,
        filters: [{ name: "Markdown", extensions: ["md", "markdown", "mdx"] }],
      });
      if (!selected) return;
      await loadDocument(selected);
    } catch (error) {
      setMessage(`開けませんでした: ${String(error)}`);
    }
  }, [loadDocument]);

  const refreshLibrary = useCallback(async (folder = libraryFolder) => {
    if (!folder) {
      setLibraryFiles([]);
      setLibraryFolders([]);
      return;
    }
    setIsLoadingLibrary(true);
    try {
      const listing = await invoke<LibraryListing>("list_markdown_files", { folder });
      setLibraryFiles(listing.files);
      setLibraryFolders(listing.folders);
      setMessage(`${listing.files.length}件のMarkdownファイルを読み込みました`);
    } catch (error) {
      setLibraryFiles([]);
      setLibraryFolders([]);
      setMessage(`フォルダを読み込めませんでした: ${String(error)}`);
    } finally {
      setIsLoadingLibrary(false);
    }
  }, [libraryFolder]);

  const chooseLibraryFolder = useCallback(async () => {
    try {
      const selected = await open({ directory: true, multiple: false, defaultPath: libraryFolder ?? undefined });
      if (!selected) return;
      setLibraryFolder(selected);
      localStorage.setItem("kakerundesu-library-folder", selected);
      await refreshLibrary(selected);
    } catch (error) {
      setMessage(`フォルダを設定できませんでした: ${String(error)}`);
    }
  }, [libraryFolder, refreshLibrary]);

  const startCreatingFile = useCallback((relativeFolder: string) => {
    if (!libraryFolder) return;
    if (isDirty && !window.confirm("保存されていない変更を破棄しますか？")) return;
    setCollapsedFolders((current) => {
      const next = new Set(current);
      next.delete(relativeFolder);
      return next;
    });
    setNewFileName("無題.md");
    setCreatingDirectory(null);
    setCreatingFolder(relativeFolder);
  }, [isDirty, libraryFolder]);

  const createFileInFolder = useCallback(async (relativeFolder: string) => {
    if (!libraryFolder || !newFileName.trim()) return;
    try {
      const path = await invoke<string>("create_markdown_file", {
        root: libraryFolder,
        relativeFolder,
        fileName: newFileName,
      });
      setContent("");
      setSavedContent("");
      setFilePath(path);
      setCreatingFolder(null);
      setMessage(`${fileName(path)} を作成しました`);
      setCollapsedFolders((current) => {
        const next = new Set(current);
        next.delete(relativeFolder);
        return next;
      });
      await refreshLibrary();
    } catch (error) {
      setMessage(`ファイルを作成できませんでした: ${String(error)}`);
    }
  }, [libraryFolder, newFileName, refreshLibrary]);

  const startCreatingDirectory = useCallback((relativeParent: string) => {
    if (!libraryFolder) return;
    setCollapsedFolders((current) => {
      const next = new Set(current);
      next.delete(relativeParent);
      return next;
    });
    setNewDirectoryName("新しいフォルダ");
    setCreatingFolder(null);
    setCreatingDirectory(relativeParent);
  }, [libraryFolder]);

  const createDirectory = useCallback(async (relativeParent: string) => {
    if (!libraryFolder || !newDirectoryName.trim()) return;
    try {
      await invoke("create_folder", {
        root: libraryFolder,
        relativeParent,
        folderName: newDirectoryName,
      });
      setCreatingDirectory(null);
      setMessage(`${newDirectoryName.trim()} を作成しました`);
      await refreshLibrary();
    } catch (error) {
      setMessage(`フォルダを作成できませんでした: ${String(error)}`);
    }
  }, [libraryFolder, newDirectoryName, refreshLibrary]);

  const saveDocument = useCallback(async () => {
    try {
      let destination = filePath;
      if (!destination) {
        destination = await save({
          defaultPath: "無題.md",
          filters: [{ name: "Markdown", extensions: ["md"] }],
        });
      }
      if (!destination) return;
      await invoke("write_markdown_file", { path: destination, content });
      setFilePath(destination);
      setSavedContent(content);
      setMessage(`${fileName(destination)} を保存しました`);
    } catch (error) {
      setMessage(`保存できませんでした: ${String(error)}`);
    }
  }, [content, filePath]);

  useEffect(() => {
    void refreshLibrary();
  }, [refreshLibrary]);

  useEffect(() => {
    if (!libraryFolder) return;

    let refreshTimer: ReturnType<typeof setTimeout> | undefined;
    let disposed = false;
    let stopListening: (() => void) | undefined;

    void listen("library-changed", () => {
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => void refreshLibrary(), 250);
    }).then((unlisten) => {
      if (disposed) unlisten();
      else stopListening = unlisten;
    });

    void invoke("watch_markdown_folder", { folder: libraryFolder }).catch((error) => {
      setMessage(`フォルダを監視できませんでした: ${String(error)}`);
    });

    return () => {
      disposed = true;
      clearTimeout(refreshTimer);
      stopListening?.();
    };
  }, [libraryFolder, refreshLibrary]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("kakerundesu-theme", theme);
  }, [theme]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        void saveDocument();
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "o") {
        event.preventDefault();
        void openDocument();
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "n") {
        event.preventDefault();
        newDocument();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [newDocument, openDocument, saveDocument]);

  useEffect(() => {
    const preventClose = (event: BeforeUnloadEvent) => {
      if (isDirty) event.preventDefault();
    };
    window.addEventListener("beforeunload", preventClose);
    return () => window.removeEventListener("beforeunload", preventClose);
  }, [isDirty]);

  const fileTree = useMemo(
    () => buildFileTree(libraryFiles, libraryFolders),
    [libraryFiles, libraryFolders],
  );
  const toggleFolder = useCallback((key: string) => {
    setCollapsedFolders((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  return (
    <main className="app-shell">
      <Header
        fileName={fileName(filePath)}
        isDirty={isDirty}
        theme={theme}
        onNewDocument={newDocument}
        onOpenDocument={() => void openDocument()}
        onSaveDocument={() => void saveDocument()}
        onToggleTheme={() => setTheme(theme === "light" ? "dark" : "light")}
      />

      <Workspace
        content={content}
        theme={theme}
        onChangeContent={setContent}
        nodes={fileTree}
        fileCount={libraryFiles.length}
        isLoading={isLoadingLibrary}
        libraryFolder={libraryFolder}
        libraryName={libraryFolder ? fileName(libraryFolder) : "フォルダ未設定"}
        collapsedFolders={collapsedFolders}
        activePath={filePath}
        onToggleFolder={toggleFolder}
        onOpenFile={(path) => void loadDocument(path)}
        creatingFolder={creatingFolder}
        newFileName={newFileName}
        onStartCreate={startCreatingFile}
        onChangeNewFileName={setNewFileName}
        onSubmitNewFile={(relativeFolder) => void createFileInFolder(relativeFolder)}
        onCancelCreate={() => setCreatingFolder(null)}
        creatingDirectory={creatingDirectory}
        newDirectoryName={newDirectoryName}
        onStartCreateDirectory={startCreatingDirectory}
        onChangeNewDirectoryName={setNewDirectoryName}
        onSubmitNewDirectory={(relativeParent) => void createDirectory(relativeParent)}
        onCancelCreateDirectory={() => setCreatingDirectory(null)}
        onChooseFolder={() => void chooseLibraryFolder()}
      />

      <Footer isDirty={isDirty} message={message} />
    </main>
  );
}

export default App;
