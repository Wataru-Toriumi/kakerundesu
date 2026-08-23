import { WorkspaceLayout } from "@/components/editor/WorkspaceLayout";
import { EditorPane } from "@/editor/EditorPane";
import { LibrarySidebar } from "@/editor/LibrarySidebar";
import { PreviewPane } from "@/editor/PreviewPane";
import type { MarkdownLibrary } from "@/hooks/useMarkdownLibrary";

type WorkspaceProps = {
  content: string;
  theme: "light" | "dark";
  onChangeContent: (content: string) => void;
  activePath: string | null;
  onOpenFile: (path: string) => void;
  library: MarkdownLibrary;
};

export function Workspace({
  content,
  theme,
  onChangeContent,
  activePath,
  onOpenFile,
  library,
}: WorkspaceProps) {
  return (
    <WorkspaceLayout>
      <LibrarySidebar
        nodes={library.nodes}
        fileCount={library.fileCount}
        isLoading={library.isLoading}
        libraryFolder={library.libraryFolder}
        libraryName={library.libraryName}
        collapsedFolders={library.collapsedFolders}
        activePath={activePath}
        onToggleFolder={library.toggleFolder}
        onOpenFile={onOpenFile}
        creatingFolder={library.creatingFolder}
        newFileName={library.newFileName}
        onStartCreate={library.startCreatingFile}
        onChangeNewFileName={library.setNewFileName}
        onSubmitNewFile={library.createFile}
        onCancelCreate={library.cancelCreatingFile}
        creatingDirectory={library.creatingDirectory}
        newDirectoryName={library.newDirectoryName}
        onStartCreateDirectory={library.startCreatingDirectory}
        onChangeNewDirectoryName={library.setNewDirectoryName}
        onSubmitNewDirectory={library.createDirectory}
        onCancelCreateDirectory={library.cancelCreatingDirectory}
        onChooseFolder={library.chooseFolder}
      />
      <EditorPane content={content} theme={theme} onChange={onChangeContent} />
      <PreviewPane content={content} />
    </WorkspaceLayout>
  );
}
