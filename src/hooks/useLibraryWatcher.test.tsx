// @vitest-environment jsdom

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useLibraryWatcher } from "@/hooks/useLibraryWatcher";

const mocks = vi.hoisted(() => ({
  listenToLibraryChanges: vi.fn<(onChange: () => void) => Promise<() => void>>(),
  watchMarkdownFolder: vi.fn<(folder: string) => Promise<void>>(),
}));

vi.mock("@/lib/markdownClient", () => ({
  listenToLibraryChanges: mocks.listenToLibraryChanges,
  watchMarkdownFolder: mocks.watchMarkdownFolder,
}));

type HarnessProps = {
  libraryFolder: string | null;
  onChange: () => void;
  onMessage: (message: string) => void;
};

function WatcherHarness(props: HarnessProps) {
  useLibraryWatcher(props);
  return null;
}

describe("useLibraryWatcher", () => {
  let root: Root | undefined;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean })
      .IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(async () => {
    if (root) await act(() => root?.unmount());
    root = undefined;
    vi.useRealTimers();
  });

  it("debounces changes and stops listening on cleanup", async () => {
    const unlisten = vi.fn<() => void>();
    const onChange = vi.fn<() => void>();
    const onMessage = vi.fn<(message: string) => void>();
    let notifyChange: (() => void) | undefined;
    mocks.listenToLibraryChanges.mockImplementation(async (listener) => {
      notifyChange = listener;
      return unlisten;
    });
    mocks.watchMarkdownFolder.mockResolvedValue(undefined);

    root = createRoot(document.createElement("div"));
    await act(async () => {
      root?.render(
        <WatcherHarness
          libraryFolder="/notes"
          onChange={onChange}
          onMessage={onMessage}
        />,
      );
    });

    expect(mocks.watchMarkdownFolder).toHaveBeenCalledWith("/notes");
    expect(notifyChange).toBeTypeOf("function");

    act(() => {
      notifyChange?.();
      notifyChange?.();
      vi.advanceTimersByTime(249);
    });
    expect(onChange).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(1));
    expect(onChange).toHaveBeenCalledOnce();

    await act(() => root?.unmount());
    root = undefined;
    expect(unlisten).toHaveBeenCalledOnce();
  });

  it("reports setup failures", async () => {
    const onMessage = vi.fn<(message: string) => void>();
    mocks.listenToLibraryChanges.mockRejectedValue(new Error("listen failed"));
    mocks.watchMarkdownFolder.mockRejectedValue(new Error("watch failed"));

    root = createRoot(document.createElement("div"));
    await act(async () => {
      root?.render(
        <WatcherHarness
          libraryFolder="/notes"
          onChange={() => undefined}
          onMessage={onMessage}
        />,
      );
    });

    expect(onMessage).toHaveBeenCalledWith(
      "変更通知を受信できませんでした: Error: listen failed",
    );
    expect(onMessage).toHaveBeenCalledWith(
      "フォルダを監視できませんでした: Error: watch failed",
    );
  });
});
