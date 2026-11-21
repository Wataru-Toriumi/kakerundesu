// @vitest-environment jsdom

import { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, it, vi } from "vitest";
import { WorkspaceLayout } from "@/components/editor/WorkspaceLayout";
import type { ViewMode } from "@/hooks/useViewMode";

it("keeps the editor mounted across all view modes and only splits when both panes are visible", async () => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  vi.stubGlobal("ResizeObserver", class {
    observe() {}
    disconnect() {}
  });
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  }));
  const container = document.body.appendChild(document.createElement("div"));
  const root = createRoot(container);
  async function show(viewMode: ViewMode) {
    await act(() => root.render(
      <WorkspaceLayout
        viewMode={viewMode}
        sidebar={<nav />}
        editor={<textarea />}
        preview={<article />}
      />,
    ));
  }

  try {
    await show("split");
    const editor = container.querySelector("textarea")!;
    editor.value = "draft";
    expect(container.querySelectorAll('[role="separator"]')).toHaveLength(2);

    await show("markdown");
    expect(container.querySelector("article")).toBeNull();
    expect(container.querySelectorAll('[role="separator"]')).toHaveLength(1);

    await show("preview");
    expect(editor.closest("[hidden]")).toBeTruthy();
    expect(container.querySelector("article")).toBeTruthy();
    expect(container.querySelectorAll('[role="separator"]')).toHaveLength(1);

    await show("split");
    expect(container.querySelector("textarea")).toBe(editor);
    expect(editor.closest("[hidden]")).toBeNull();
    expect(editor.value).toBe("draft");
    expect(container.querySelector("article")).toBeTruthy();
    expect(container.querySelectorAll('[role="separator"]')).toHaveLength(2);
  } finally {
    await act(() => root.unmount());
    container.remove();
    vi.unstubAllGlobals();
  }
});
