import { useMemo } from "react";
import { markdown } from "@codemirror/lang-markdown";
import { oneDark } from "@codemirror/theme-one-dark";
import CodeMirror from "@uiw/react-codemirror";

type EditorPaneProps = {
  content: string;
  theme: "light" | "dark";
  onChange: (content: string) => void;
};

export function EditorPane({ content, theme, onChange }: EditorPaneProps) {
  const extensions = useMemo(() => [markdown()], []);

  return (
    <section className="pane editor-pane">
      <div className="pane-title">
        <span>MARKDOWN</span>
        <span>{content.length.toLocaleString()} 文字</span>
      </div>
      <CodeMirror
        value={content}
        height="100%"
        extensions={extensions}
        theme={theme === "dark" ? oneDark : "light"}
        onChange={onChange}
        basicSetup={{ lineNumbers: true, foldGutter: true, highlightActiveLine: true }}
      />
    </section>
  );
}
