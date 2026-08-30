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
        nodes={library.nodes}
        fileCount={library.fileCount}
        isLoading={library.isLoading}
        libraryFolder={library.libraryFolder}
        libraryName={library.libraryName}
        collapsedFolders={library.collapsedFolders}
        activePath={activePath}
        onToggleFolder={library.toggleFolder}
        onOpenFile={onOpenFile}
        creatingFolder={libraryCreation.creatingFolder}
        newFileName={libraryCreation.newFileName}
        onStartCreate={libraryCreation.startCreatingFile}
        onChangeNewFileName={libraryCreation.setNewFileName}
        onSubmitNewFile={libraryCreation.createFile}
        onCancelCreate={libraryCreation.cancelCreatingFile}
        creatingDirectory={libraryCreation.creatingDirectory}
        newDirectoryName={libraryCreation.newDirectoryName}
        onStartCreateDirectory={libraryCreation.startCreatingDirectory}
        onChangeNewDirectoryName={libraryCreation.setNewDirectoryName}
        onSubmitNewDirectory={libraryCreation.createDirectory}
        onCancelCreateDirectory={libraryCreation.cancelCreatingDirectory}
        onChooseFolder={library.chooseFolder}
      />
      <EditorPane content={content} theme={theme} onChange={onChangeContent} />
      <PreviewPane content={content} />
    </WorkspaceLayout>
  );
}
