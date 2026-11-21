import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Footer } from "@/Footer";
import { Header } from "@/Header";
import { Workspace } from "@/editor/Workspace";
import { useEditorShortcuts } from "@/hooks/useEditorShortcuts";
import { useLibraryCreation } from "@/hooks/useLibraryCreation";
import { useMarkdownDocument } from "@/hooks/useMarkdownDocument";
import { useMarkdownLibrary } from "@/hooks/useMarkdownLibrary";
import { useAppMenu } from "@/hooks/useAppMenu";
import { useTheme } from "@/hooks/useTheme";
import { useViewMode } from "@/hooks/useViewMode";
import { SettingsDialog } from "@/settings/SettingsDialog";

function App() {
  const [message, setMessage] = useState("新しい文書");
  const documentState = useMarkdownDocument(setMessage);
  const library = useMarkdownLibrary({
    onMessage: setMessage,
  });
  const libraryCreation = useLibraryCreation({
    libraryFolder: library.libraryFolder,
    confirmDiscard: documentState.confirmDiscard,
    onCreateFile: documentState.createDocumentAtPath,
    onExpandFolder: library.expandFolder,
    onMessage: setMessage,
    onRefreshLibrary: library.refreshLibrary,
  });
  const { theme, setTheme } = useTheme();
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const { viewMode, setViewMode } = useViewMode();

  const documentActions = {
    enabled: !isSettingsOpen,
    onNewDocument: documentState.newDocument,
    onOpenDocument: documentState.openDocument,
    onSaveDocument: documentState.saveDocument,
  };
  useEditorShortcuts(documentActions);
  useAppMenu({ ...documentActions, onOpenSettings: () => setSettingsOpen(true), onMessage: setMessage });

  return (
    <AppShell>
      <Header
        fileName={documentState.currentFileName}
        isDirty={documentState.isDirty}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        onOpenSettings={() => setSettingsOpen(true)}
      />
      <Workspace
        viewMode={viewMode}
        content={documentState.content}
        theme={theme}
        onChangeContent={documentState.setContent}
        activePath={documentState.filePath}
        onOpenFile={documentState.loadDocument}
        library={library}
        libraryCreation={libraryCreation}
      />
      <SettingsDialog
        open={isSettingsOpen}
        onOpenChange={setSettingsOpen}
        theme={theme}
        onThemeChange={setTheme}
      />
      <Footer isDirty={documentState.isDirty} message={message} />
    </AppShell>
  );
}

export default App;
