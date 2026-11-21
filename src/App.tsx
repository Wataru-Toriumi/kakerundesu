import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { SettingsDialog } from "@/components/app/SettingsDialog";
import { Footer } from "@/Footer";
import { Header } from "@/Header";
import { Workspace } from "@/editor/Workspace";
import { useEditorShortcuts } from "@/hooks/useEditorShortcuts";
import { useLibraryCreation } from "@/hooks/useLibraryCreation";
import { useMarkdownDocument } from "@/hooks/useMarkdownDocument";
import { useMarkdownLibrary } from "@/hooks/useMarkdownLibrary";
import { useSettingsDialog } from "@/hooks/useSettingsDialog";
import { useTheme } from "@/hooks/useTheme";
import { useViewMode } from "@/hooks/useViewMode";

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
  const settings = useSettingsDialog(setMessage);
  const { viewMode, setViewMode } = useViewMode();

  useEditorShortcuts({
    enabled: !settings.isOpen,
    onNewDocument: documentState.newDocument,
    onOpenDocument: documentState.openDocument,
    onSaveDocument: documentState.saveDocument,
  });

  return (
    <AppShell>
      <Header
        fileName={documentState.currentFileName}
        isDirty={documentState.isDirty}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        onNewDocument={documentState.newDocument}
        onOpenDocument={documentState.openDocument}
        onSaveDocument={documentState.saveDocument}
        onOpenSettings={() => settings.setOpen(true)}
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
        open={settings.isOpen}
        onOpenChange={settings.setOpen}
        theme={theme}
        onThemeChange={setTheme}
      />
      <Footer isDirty={documentState.isDirty} message={message} />
    </AppShell>
  );
}

export default App;
