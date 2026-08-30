// @vitest-environment jsdom

import { act, useEffect } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useMarkdownLibrary, type MarkdownLibrary } from "@/hooks/useMarkdownLibrary";
import type { LibraryListing } from "@/lib/markdownClient";

const mocks = vi.hoisted(() => ({
  open: vi.fn<() => Promise<string | null>>(),
  listenToLibraryChanges: vi.fn<() => Promise<() => void>>(),
  listMarkdownFiles: vi.fn<(folder: string) => Promise<LibraryListing>>(),
  watchMarkdownFolder: vi.fn<() => Promise<void>>(),
}));

vi.mock("@tauri-apps/plugin-dialog", () => ({ open: mocks.open }));
vi.mock("@/lib/markdownClient", () => ({
  listenToLibraryChanges: mocks.listenToLibraryChanges,
  listMarkdownFiles: mocks.listMarkdownFiles,
  watchMarkdownFolder: mocks.watchMarkdownFolder,
}));

type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T) => void;
};

function deferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise;
  });
  return { promise, resolve };
}

type HarnessProps = {
  onMessage: (message: string) => void;
  onUpdate: (library: MarkdownLibrary) => void;
};

function LibraryHarness({ onMessage, onUpdate }: HarnessProps) {
  const library = useMarkdownLibrary({
    onMessage,
  });

  useEffect(() => onUpdate(library), [library, onUpdate]);
  return null;
}

describe("useMarkdownLibrary refresh", () => {
  let root: Root | undefined;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mocks.listenToLibraryChanges.mockResolvedValue(vi.fn<() => void>());
    mocks.watchMarkdownFolder.mockResolvedValue(undefined);
    (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean })
      .IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(async () => {
    if (root) await act(() => root?.unmount());
    root = undefined;
  });

  it("loads a selected folder once and ignores an older response", async () => {
    const oldListing = deferred<LibraryListing>();
    const newListing = deferred<LibraryListing>();
    const onMessage = vi.fn<(message: string) => void>();
    let library: MarkdownLibrary | undefined;
    const getLibrary = () => {
      if (!library) throw new Error("Library state is not available");
      return library;
    };

    localStorage.setItem("kakerundesu-library-folder", "/notes/old");
    mocks.listMarkdownFiles.mockImplementation((folder) => (
      folder === "/notes/old" ? oldListing.promise : newListing.promise
    ));
    mocks.open.mockResolvedValue("/notes/new");

    const container = document.createElement("div");
    root = createRoot(container);
    await act(() => {
      root?.render(<LibraryHarness onMessage={onMessage} onUpdate={(next) => { library = next; }} />);
    });

    expect(mocks.listMarkdownFiles).toHaveBeenCalledTimes(1);
    expect(mocks.listMarkdownFiles).toHaveBeenLastCalledWith("/notes/old");

    await act(async () => {
      await getLibrary().chooseFolder();
    });

    expect(mocks.listMarkdownFiles).toHaveBeenCalledTimes(2);
    expect(mocks.listMarkdownFiles).toHaveBeenLastCalledWith("/notes/new");

    await act(() => {
      newListing.resolve({
        files: [{ name: "new.md", path: "/notes/new/new.md", relativePath: "new.md" }],
        folders: [],
      });
    });

    expect(getLibrary().libraryFolder).toBe("/notes/new");
    expect(getLibrary().fileCount).toBe(1);
    expect(getLibrary().nodes[0]?.name).toBe("new.md");
    expect(getLibrary().isLoading).toBe(false);
    expect(onMessage).toHaveBeenCalledTimes(1);

    await act(() => {
      oldListing.resolve({
        files: [
          { name: "old-a.md", path: "/notes/old/old-a.md", relativePath: "old-a.md" },
          { name: "old-b.md", path: "/notes/old/old-b.md", relativePath: "old-b.md" },
        ],
        folders: [],
      });
    });

    expect(getLibrary().fileCount).toBe(1);
    expect(getLibrary().nodes[0]?.name).toBe("new.md");
    expect(onMessage).toHaveBeenCalledTimes(1);
  });
});
