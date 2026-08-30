// @vitest-environment jsdom

import { act, useEffect } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  useLibraryCreation,
  type LibraryCreation,
} from "@/hooks/useLibraryCreation";

const mocks = vi.hoisted(() => ({
  createFolder: vi.fn<() => Promise<void>>(),
  createMarkdownFile: vi.fn<() => Promise<string>>(),
}));

vi.mock("@/lib/markdownClient", () => ({
  createFolder: mocks.createFolder,
  createMarkdownFile: mocks.createMarkdownFile,
}));

type HarnessProps = {
  onCreateFile: (path: string) => void;
  onExpandFolder: (key: string) => void;
  onMessage: (message: string) => void;
  onRefreshLibrary: () => Promise<void>;
  onUpdate: (creation: LibraryCreation) => void;
};

function CreationHarness({
  onCreateFile,
  onExpandFolder,
  onMessage,
  onRefreshLibrary,
  onUpdate,
}: HarnessProps) {
  const creation = useLibraryCreation({
    libraryFolder: "/notes",
    confirmDiscard: () => true,
    onCreateFile,
    onExpandFolder,
    onMessage,
    onRefreshLibrary,
  });

  useEffect(() => onUpdate(creation), [creation, onUpdate]);
  return null;
}

describe("useLibraryCreation", () => {
  let root: Root | undefined;

  beforeEach(() => {
    vi.clearAllMocks();
    (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean })
      .IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(async () => {
    if (root) await act(() => root?.unmount());
    root = undefined;
  });

  function renderCreation() {
    const onCreateFile = vi.fn<(path: string) => void>();
    const onExpandFolder = vi.fn<(key: string) => void>();
    const onMessage = vi.fn<(message: string) => void>();
    const onRefreshLibrary = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);
    let creation: LibraryCreation | undefined;
    const getCreation = () => {
      if (!creation) throw new Error("Library creation state is not available");
      return creation;
    };

    root = createRoot(document.createElement("div"));
    act(() => {
      root?.render(
        <CreationHarness
          onCreateFile={onCreateFile}
          onExpandFolder={onExpandFolder}
          onMessage={onMessage}
          onRefreshLibrary={onRefreshLibrary}
          onUpdate={(next) => { creation = next; }}
        />,
      );
    });

    return { getCreation, onCreateFile, onExpandFolder, onMessage, onRefreshLibrary };
  }

  it("creates a Markdown file and refreshes the library", async () => {
    const callbacks = renderCreation();
    mocks.createMarkdownFile.mockResolvedValue("/notes/drafts/post.md");

    act(() => callbacks.getCreation().startCreatingFile("drafts"));
    act(() => callbacks.getCreation().setNewFileName("post.md"));
    await act(() => callbacks.getCreation().createFile("drafts"));

    expect(mocks.createMarkdownFile).toHaveBeenCalledWith({
      root: "/notes",
      relativeFolder: "drafts",
      fileName: "post.md",
    });
    expect(callbacks.onCreateFile).toHaveBeenCalledWith("/notes/drafts/post.md");
    expect(callbacks.onExpandFolder).toHaveBeenCalledWith("drafts");
    expect(callbacks.onRefreshLibrary).toHaveBeenCalledOnce();
    expect(callbacks.getCreation().creatingFolder).toBeNull();
  });

  it("creates a directory and reports its completion", async () => {
    const callbacks = renderCreation();
    mocks.createFolder.mockResolvedValue(undefined);

    act(() => callbacks.getCreation().startCreatingDirectory("archive"));
    act(() => callbacks.getCreation().setNewDirectoryName("2026"));
    await act(() => callbacks.getCreation().createDirectory("archive"));

    expect(mocks.createFolder).toHaveBeenCalledWith({
      root: "/notes",
      relativeParent: "archive",
      folderName: "2026",
    });
    expect(callbacks.onMessage).toHaveBeenCalledWith("2026 を作成しました");
    expect(callbacks.onRefreshLibrary).toHaveBeenCalledOnce();
    expect(callbacks.getCreation().creatingDirectory).toBeNull();
  });
});
