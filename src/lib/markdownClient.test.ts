import { beforeEach, describe, expect, it, vi } from "vitest";

const tauri = vi.hoisted(() => ({
  invoke: vi.fn<(command: string, payload?: Record<string, unknown>) => Promise<unknown>>(),
  listen: vi.fn<(event: string, handler: () => void) => Promise<() => void>>(),
}));

vi.mock("@tauri-apps/api/core", () => ({ invoke: tauri.invoke }));
vi.mock("@tauri-apps/api/event", () => ({ listen: tauri.listen }));

import {
  createFolder,
  createMarkdownFile,
  listenToLibraryChanges,
  listMarkdownFiles,
  readMarkdownFile,
  watchMarkdownFolder,
  writeMarkdownFile,
} from "@/lib/markdownClient";

describe("markdownClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("maps document operations to their Tauri commands", async () => {
    tauri.invoke.mockResolvedValueOnce("# Document");

    await expect(readMarkdownFile("/notes/guide.md")).resolves.toBe("# Document");
    await writeMarkdownFile({ path: "/notes/guide.md", content: "# Updated" });

    expect(tauri.invoke).toHaveBeenNthCalledWith(1, "read_markdown_file", {
      path: "/notes/guide.md",
    });
    expect(tauri.invoke).toHaveBeenNthCalledWith(2, "write_markdown_file", {
      path: "/notes/guide.md",
      content: "# Updated",
    });
  });

  it("maps library listing and creation operations to their Tauri commands", async () => {
    const listing = { files: [], folders: [] };
    tauri.invoke.mockResolvedValueOnce(listing).mockResolvedValueOnce("/notes/new.md");

    await expect(listMarkdownFiles("/notes")).resolves.toBe(listing);
    await expect(createMarkdownFile({
      root: "/notes",
      relativeFolder: "drafts",
      fileName: "new.md",
    })).resolves.toBe("/notes/new.md");
    await createFolder({
      root: "/notes",
      relativeParent: "drafts",
      folderName: "ideas",
    });

    expect(tauri.invoke).toHaveBeenNthCalledWith(1, "list_markdown_files", {
      folder: "/notes",
    });
    expect(tauri.invoke).toHaveBeenNthCalledWith(2, "create_markdown_file", {
      root: "/notes",
      relativeFolder: "drafts",
      fileName: "new.md",
    });
    expect(tauri.invoke).toHaveBeenNthCalledWith(3, "create_folder", {
      root: "/notes",
      relativeParent: "drafts",
      folderName: "ideas",
    });
  });

  it("maps folder watching to its Tauri command", async () => {
    await watchMarkdownFolder("/notes");

    expect(tauri.invoke).toHaveBeenCalledWith("watch_markdown_folder", {
      folder: "/notes",
    });
  });

  it("subscribes to library change events", async () => {
    const onChange = vi.fn<() => void>();
    const unlisten = vi.fn<() => void>();
    tauri.listen.mockResolvedValueOnce(unlisten);

    await expect(listenToLibraryChanges(onChange)).resolves.toBe(unlisten);
    expect(tauri.listen).toHaveBeenCalledWith("library-changed", onChange);
  });
});
