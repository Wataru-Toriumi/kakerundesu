// @vitest-environment jsdom

import { act, useEffect } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useMarkdownDocument } from "@/hooks/useMarkdownDocument";

const mocks = vi.hoisted(() => ({
  open: vi.fn<() => Promise<string | null>>(),
  readMarkdownFile: vi.fn<(path: string) => Promise<string>>(),
  save: vi.fn<() => Promise<string | null>>(),
  writeMarkdownFile: vi.fn<() => Promise<void>>(),
}));

vi.mock("@tauri-apps/plugin-dialog", () => ({
  open: mocks.open,
  save: mocks.save,
}));
vi.mock("@/lib/markdownClient", () => ({
  readMarkdownFile: mocks.readMarkdownFile,
  writeMarkdownFile: mocks.writeMarkdownFile,
}));

type MarkdownDocument = ReturnType<typeof useMarkdownDocument>;

type Deferred = {
  promise: Promise<void>;
  resolve: () => void;
};

function deferred(): Deferred {
  let resolve!: () => void;
  const promise = new Promise<void>((resolvePromise) => {
    resolve = resolvePromise;
  });
  return { promise, resolve };
}

type HarnessProps = {
  onMessage: (message: string) => void;
  onUpdate: (document: MarkdownDocument) => void;
};

function DocumentHarness({ onMessage, onUpdate }: HarnessProps) {
  const document = useMarkdownDocument(onMessage);
  useEffect(() => onUpdate(document), [document, onUpdate]);
  return null;
}

describe("useMarkdownDocument", () => {
  let root: Root | undefined;

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.open.mockResolvedValue(null);
    mocks.save.mockResolvedValue(null);
    mocks.writeMarkdownFile.mockResolvedValue(undefined);
    (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean })
      .IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(async () => {
    if (root) await act(() => root?.unmount());
    root = undefined;
    vi.restoreAllMocks();
  });

  function renderDocument(onMessage = vi.fn<(message: string) => void>()) {
    let documentState: MarkdownDocument | undefined;
    const getDocument = () => {
      if (!documentState) throw new Error("Markdown document state is not available");
      return documentState;
    };

    root = createRoot(document.createElement("div"));
    act(() => {
      root?.render(
        <DocumentHarness
          onMessage={onMessage}
          onUpdate={(next) => { documentState = next; }}
        />,
      );
    });
    return { getDocument, onMessage };
  }

  it("replaces related state when creating and loading documents", async () => {
    const { getDocument, onMessage } = renderDocument();
    vi.spyOn(window, "confirm").mockReturnValue(true);

    act(() => getDocument().setContent("draft"));
    expect(getDocument().isDirty).toBe(true);

    act(() => getDocument().newDocument());
    expect(getDocument().content).toBe("");
    expect(getDocument().filePath).toBeNull();
    expect(getDocument().isDirty).toBe(false);

    mocks.readMarkdownFile.mockResolvedValue("# Loaded");
    await act(() => getDocument().loadDocument("/notes/loaded.md"));
    expect(getDocument().content).toBe("# Loaded");
    expect(getDocument().filePath).toBe("/notes/loaded.md");
    expect(getDocument().currentFileName).toBe("loaded.md");
    expect(getDocument().isDirty).toBe(false);
    expect(onMessage).toHaveBeenLastCalledWith("loaded.md を開きました");
  });

  it("keeps edits made while a save is in progress", async () => {
    const pendingWrite = deferred();
    const { getDocument, onMessage } = renderDocument();
    mocks.save.mockResolvedValue("/notes/draft.md");
    mocks.writeMarkdownFile.mockReturnValue(pendingWrite.promise);

    act(() => getDocument().setContent("first draft"));
    let savePromise!: Promise<void>;
    await act(async () => {
      savePromise = getDocument().saveDocument();
      await Promise.resolve();
    });
    expect(mocks.writeMarkdownFile).toHaveBeenCalledWith({
      path: "/notes/draft.md",
      content: "first draft",
    });

    act(() => getDocument().setContent("edited while saving"));
    await act(async () => {
      pendingWrite.resolve();
      await savePromise;
    });

    expect(getDocument().content).toBe("edited while saving");
    expect(getDocument().filePath).toBe("/notes/draft.md");
    expect(getDocument().isDirty).toBe(true);
    expect(onMessage).toHaveBeenLastCalledWith("draft.md を保存しました");
  });
});
