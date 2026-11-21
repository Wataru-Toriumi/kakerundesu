// @vitest-environment jsdom

import { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, it, vi } from "vitest";
import { MermaidDiagram } from "@/components/editor/MermaidDiagram";

const { renderDiagram } = vi.hoisted(() => ({
  renderDiagram: vi.fn<(id: string, source: string) => Promise<{ svg: string }>>(),
}));

vi.mock("mermaid", () => ({
  default: { initialize: vi.fn<() => void>(), render: renderDiagram },
}));

it("keeps the current diagram when an earlier render finishes after an edit", async () => {
  vi.useFakeTimers();
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  const container = document.createElement("div");
  const root = createRoot(container);
  try {
    let finishFirst!: (result: { svg: string }) => void;
    renderDiagram.mockImplementationOnce(() => new Promise(resolve => { finishFirst = resolve; }));
    renderDiagram.mockResolvedValueOnce({ svg: "<svg>updated</svg>" });

    async function edit(source: string) {
      await act(() => root.render(<MermaidDiagram source={source} theme="light" />));
      await act(() => vi.runAllTimersAsync());
      await act(() => vi.dynamicImportSettled());
    }

    await edit("graph LR; A-->B");
    expect(renderDiagram).toHaveBeenCalledTimes(1);
    await edit("graph LR; A-->C");
    await act(() => finishFirst({ svg: "<svg>original</svg>" }));

    expect(decodeURIComponent(container.querySelector("img")?.src ?? "")).toContain("<svg>updated</svg>");
  } finally {
    await act(() => root.unmount());
    vi.useRealTimers();
    vi.unstubAllGlobals();
  }
});
