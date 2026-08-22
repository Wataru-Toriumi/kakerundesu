import { useMemo } from "react";
import { markdown } from "@codemirror/lang-markdown";
import { oneDark } from "@codemirror/theme-one-dark";
import CodeMirror from "@uiw/react-codemirror";
import { EditorSurface } from "@/components/editor/EditorSurface";
import { Pane } from "@/components/editor/Pane";
import { PaneTitle } from "@/components/editor/PaneTitle";

type EditorPaneProps = {
  content: string;
  theme: "light" | "dark";
  onChange: (content: string) => void;
};

export function EditorPane({ content, theme, onChange }: EditorPaneProps) {
  const extensions = useMemo(() => [markdown()], []);

  return (
    <Pane kind="editor">
      <PaneTitle title="MARKDOWN" meta={`${content.length.toLocaleString()} 文字`} />
      <EditorSurface>
        <CodeMirror
          value={content}
          height="100%"
          extensions={extensions}
          theme={theme === "dark" ? oneDark : "light"}
          onChange={onChange}
          basicSetup={{ lineNumbers: true, foldGutter: true, highlightActiveLine: true }}
        />
      </EditorSurface>
    </Pane>
  );
}
