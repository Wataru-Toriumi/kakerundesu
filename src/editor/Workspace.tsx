import { WorkspaceLayout } from "@/components/editor/WorkspaceLayout";
import { EditorPane } from "@/editor/EditorPane";
import { LibrarySidebar } from "@/editor/LibrarySidebar";
import { PreviewPane } from "@/editor/PreviewPane";
import type { LibraryCreation } from "@/hooks/useLibraryCreation";
import type { MarkdownLibrary } from "@/hooks/useMarkdownLibrary";

type WorkspaceProps = {
  content: string;
  theme: "light" | "dark";
  onChangeContent: (content: string) => void;
  activePath: string | null;
  onOpenFile: (path: string) => void;
  library: MarkdownLibrary;
  libraryCreation: LibraryCreation;
};

export function Workspace({
  content,
  theme,
  onChangeContent,
  activePath,
  onOpenFile,
  library,
  libraryCreation,
}: WorkspaceProps) {
  return (
    <WorkspaceLayout>
      <LibrarySidebar
        library={library}
        creation={libraryCreation}
        activePath={activePath}
        onOpenFile={onOpenFile}
      />
      <EditorPane content={content} theme={theme} onChange={onChangeContent} />
      <PreviewPane content={content} />
    </WorkspaceLayout>
  );
}
