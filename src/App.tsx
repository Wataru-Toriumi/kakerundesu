import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Footer } from "@/Footer";
import { Header } from "@/Header";
import { Workspace } from "@/editor/Workspace";
import { useEditorShortcuts } from "@/hooks/useEditorShortcuts";
import { useMarkdownDocument } from "@/hooks/useMarkdownDocument";
import { useMarkdownLibrary } from "@/hooks/useMarkdownLibrary";
import { useTheme } from "@/hooks/useTheme";

function App() {
  const [message, setMessage] = useState("新しい文書");
  const documentState = useMarkdownDocument(setMessage);
  const library = useMarkdownLibrary({
    confirmDiscard: documentState.confirmDiscard,
    onCreateFile: documentState.createDocumentAtPath,
    onMessage: setMessage,
  });
  const { theme, toggleTheme } = useTheme();

  useEditorShortcuts({
    onNewDocument: documentState.newDocument,
    onOpenDocument: documentState.openDocument,
    onSaveDocument: documentState.saveDocument,
  });

  return (
    <AppShell>
      <Header
        fileName={documentState.currentFileName}
        isDirty={documentState.isDirty}
        theme={theme}
        onNewDocument={documentState.newDocument}
        onOpenDocument={documentState.openDocument}
        onSaveDocument={documentState.saveDocument}
        onToggleTheme={toggleTheme}
      />
      <Workspace
        content={documentState.content}
        theme={theme}
        onChangeContent={documentState.setContent}
        activePath={documentState.filePath}
        onOpenFile={documentState.loadDocument}
        library={library}
      />
      <Footer isDirty={documentState.isDirty} message={message} />
    </AppShell>
  );
}

export default App;
