// @vitest-environment jsdom

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LibraryItemCreationForm } from "@/editor/LibraryItemCreationForm";

describe("LibraryItemCreationForm", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean })
      .IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(async () => {
    await act(() => root.unmount());
    container.remove();
  });

  it("focuses the file name and handles cancel and submit", () => {
    const onCancel = vi.fn<() => void>();
    const onSubmit = vi.fn<() => void>();

    act(() => {
      root.render(
        <LibraryItemCreationForm
          kind="file"
          depth={1}
          name="post.md"
          onChangeName={() => undefined}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />,
      );
    });

    const input = container.querySelector("input");
    const form = container.querySelector("form");
    expect(input?.getAttribute("aria-label")).toBe("新しいファイル名");
    expect(document.activeElement).toBe(input);

    act(() => input?.dispatchEvent(new KeyboardEvent("keydown", {
      bubbles: true,
      key: "Escape",
    })));
    expect(onCancel).toHaveBeenCalledOnce();

    act(() => form?.dispatchEvent(new Event("submit", {
      bubbles: true,
      cancelable: true,
    })));
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it("labels a directory name input", () => {
    act(() => {
      root.render(
        <LibraryItemCreationForm
          kind="directory"
          depth={0}
          name="archive"
          onChangeName={() => undefined}
          onSubmit={() => undefined}
          onCancel={() => undefined}
        />,
      );
    });

    expect(container.querySelector("input")?.getAttribute("aria-label"))
      .toBe("新しいフォルダ名");
  });
});
