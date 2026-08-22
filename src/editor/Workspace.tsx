import { EditorPane } from "@/editor/EditorPane";
import { LibrarySidebar, type LibrarySidebarProps } from "@/editor/LibrarySidebar";
import { PreviewPane } from "@/editor/PreviewPane";

type WorkspaceProps = LibrarySidebarProps & {
  content: string;
  theme: "light" | "dark";
  onChangeContent: (content: string) => void;
};

export function Workspace({ content, theme, onChangeContent, ...libraryProps }: WorkspaceProps) {
  return (
    <section className="workspace">
      <LibrarySidebar {...libraryProps} />
      <EditorPane content={content} theme={theme} onChange={onChangeContent} />
      <PreviewPane content={content} />
    </section>
  );
}
