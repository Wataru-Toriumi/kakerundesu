import { describe, expect, it } from "vitest";
import { buildFileTree } from "@/lib/markdownLibrary";

describe("buildFileTree", () => {
  it("builds nested folders and sorts folders before files", () => {
    const files = [
      { name: "root.md", path: "/notes/root.md", relativePath: "root.md" },
      { name: "intro.md", path: "/notes/guides/intro.md", relativePath: "guides/intro.md" },
    ];
    const folders = [
      { relativePath: "guides" },
      { relativePath: "empty" },
    ];

    expect(buildFileTree(files, folders)).toEqual([
      { type: "folder", name: "empty", key: "empty", children: [] },
      {
        type: "folder",
        name: "guides",
        key: "guides",
        children: [
          { type: "file", name: "intro.md", file: files[1] },
        ],
      },
      { type: "file", name: "root.md", file: files[0] },
    ]);
  });

  it("normalizes Windows separators in node keys", () => {
    const files = [
      {
        name: "idea.md",
        path: "C:\\notes\\drafts\\idea.md",
        relativePath: "drafts\\idea.md",
      },
    ];
    const folders = [{ relativePath: "drafts\\empty" }];

    expect(buildFileTree(files, folders)).toEqual([
      {
        type: "folder",
        name: "drafts",
        key: "drafts",
        children: [
          { type: "folder", name: "empty", key: "drafts/empty", children: [] },
          { type: "file", name: "idea.md", file: files[0] },
        ],
      },
    ]);
  });
});
