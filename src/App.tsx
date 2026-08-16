import { useCallback, useEffect, useMemo, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { oneDark } from "@codemirror/theme-one-dark";
import { open, save } from "@tauri-apps/plugin-dialog";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { FilePlus2, FolderOpen, Moon, Save, Sun } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const initialMarkdown = `# かけるんです

軽やかに書ける、デスクトップMarkdownエディタです。

## はじめかた

- 左側でMarkdownを編集
- 右側でプレビューを確認
- \`⌘S\` または \`Ctrl+S\` で保存

> 「開く」から既存の.mdファイルも編集できます。
`;

type Theme = "light" | "dark";

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

  const isDirty = content !== savedContent;

  const newDocument = useCallback(() => {
    if (isDirty && !window.confirm("保存されていない変更を破棄しますか？")) return;
    setContent("");
    setSavedContent("");
    setFilePath(null);
    setMessage("新しい文書を作成しました");
  }, [isDirty]);

  const openDocument = useCallback(async () => {
    if (isDirty && !window.confirm("保存されていない変更を破棄しますか？")) return;
    try {
      const selected = await open({
        multiple: false,
        filters: [{ name: "Markdown", extensions: ["md", "markdown", "mdx", "txt"] }],
      });
      if (!selected) return;
      const text = await readTextFile(selected);
      setContent(text);
      setSavedContent(text);
      setFilePath(selected);
      setMessage(`${fileName(selected)} を開きました`);
    } catch (error) {
      setMessage(`開けませんでした: ${String(error)}`);
    }
  }, [isDirty]);

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
      await writeTextFile(destination, content);
      setFilePath(destination);
      setSavedContent(content);
      setMessage(`${fileName(destination)} を保存しました`);
    } catch (error) {
      setMessage(`保存できませんでした: ${String(error)}`);
    }
  }, [content, filePath]);

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

  const editorExtensions = useMemo(() => [markdown()], []);

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">か</span>
          <div>
            <strong>かけるんです</strong>
            <span className="file-name">{fileName(filePath)}{isDirty ? " •" : ""}</span>
          </div>
        </div>
        <nav className="actions" aria-label="ファイル操作">
          <button onClick={newDocument} title="新規作成 (⌘/Ctrl+N)"><FilePlus2 />新規</button>
          <button onClick={() => void openDocument()} title="開く (⌘/Ctrl+O)"><FolderOpen />開く</button>
          <button className="primary" onClick={() => void saveDocument()} title="保存 (⌘/Ctrl+S)"><Save />保存</button>
          <button className="icon-button" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label="テーマを切り替える">
            {theme === "light" ? <Moon /> : <Sun />}
          </button>
        </nav>
      </header>

      <section className="workspace">
        <section className="pane editor-pane">
          <div className="pane-title"><span>MARKDOWN</span><span>{content.length.toLocaleString()} 文字</span></div>
          <CodeMirror
            value={content}
            height="100%"
            extensions={editorExtensions}
            theme={theme === "dark" ? oneDark : "light"}
            onChange={setContent}
            basicSetup={{ lineNumbers: true, foldGutter: true, highlightActiveLine: true }}
          />
        </section>

        <section className="pane preview-pane">
          <div className="pane-title"><span>PREVIEW</span><span>GFM</span></div>
          <article className="markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </article>
        </section>
      </section>

      <footer className="statusbar">
        <span className={isDirty ? "dirty" : "saved"}>{isDirty ? "未保存の変更があります" : "保存済み"}</span>
        <span>{message}</span>
      </footer>
    </main>
  );
}

export default App;
