import { FolderCog, FolderOpen } from "lucide-react";
import { ChooseFolderButton } from "@/components/editor/ChooseFolderButton";
import { EmptyLibrary } from "@/components/editor/EmptyLibrary";
import { FileList } from "@/components/editor/FileList";
import { LibraryFolder } from "@/components/editor/LibraryFolder";
import { LibraryLayout } from "@/components/editor/LibraryLayout";
import { PaneTitle } from "@/components/editor/PaneTitle";
import { TruncatedText } from "@/components/editor/TruncatedText";
import { FileTree } from "@/editor/FileTree";
import type { LibraryCreation } from "@/hooks/useLibraryCreation";
import type { MarkdownLibrary } from "@/hooks/useMarkdownLibrary";

export type LibrarySidebarProps = {
  library: MarkdownLibrary;
  creation: LibraryCreation;
  activePath: string | null;
  onOpenFile: (path: string) => void;
};

export function LibrarySidebar({
  library,
  creation,
  activePath,
  onOpenFile,
}: LibrarySidebarProps) {
  return (
    <LibraryLayout>
      <PaneTitle
        title="FILES"
        meta={library.isLoading ? "読み込み中" : `${library.fileCount}件`}
        library
      />
      <LibraryFolder title={library.libraryFolder ?? "フォルダ未設定"}>
        <FolderOpen />
        <TruncatedText>{library.libraryName}</TruncatedText>
      </LibraryFolder>
      <FileList>
        <FileTree
          nodes={library.nodes}
          collapsedFolders={library.collapsedFolders}
          activePath={activePath}
          onToggleFolder={library.toggleFolder}
          onOpenFile={onOpenFile}
          creation={creation}
        />
        {library.libraryFolder && !library.isLoading && library.nodes.length === 0 && (
          <EmptyLibrary>フォルダは空です</EmptyLibrary>
        )}
        {!library.libraryFolder && (
          <EmptyLibrary>表示するフォルダを設定してください</EmptyLibrary>
        )}
      </FileList>
      <ChooseFolderButton onClick={library.chooseFolder}>
        <FolderCog />フォルダを設定
      </ChooseFolderButton>
    </LibraryLayout>
  );
}
