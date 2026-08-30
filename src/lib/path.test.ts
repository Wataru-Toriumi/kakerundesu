import { describe, expect, it } from "vitest";
import { fileName } from "@/lib/path";

describe("fileName", () => {
  it("returns the default name when no file is selected", () => {
    expect(fileName(null)).toBe("無題.md");
  });

  it.each([
    ["/Users/example/notes/guide.md", "guide.md"],
    ["C:\\Users\\example\\notes\\guide.md", "guide.md"],
  ])("extracts the file name from %s", (path, expected) => {
    expect(fileName(path)).toBe(expected);
  });
});
