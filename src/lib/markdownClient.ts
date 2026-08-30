import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import type { LibraryFolder, MarkdownFile } from "@/lib/markdownLibrary";

export type LibraryListing = { files: MarkdownFile[]; folders: LibraryFolder[] };

type WriteMarkdownFilePayload = {
  path: string;
  content: string;
};

type CreateMarkdownFilePayload = {
  root: string;
  relativeFolder: string;
  fileName: string;
};

type CreateFolderPayload = {
  root: string;
  relativeParent: string;
  folderName: string;
};

export function readMarkdownFile(path: string) {
  return invoke<string>("read_markdown_file", { path });
}

export function writeMarkdownFile(payload: WriteMarkdownFilePayload) {
  return invoke<void>("write_markdown_file", payload);
}

export function listMarkdownFiles(folder: string) {
  return invoke<LibraryListing>("list_markdown_files", { folder });
}

export function createMarkdownFile(payload: CreateMarkdownFilePayload) {
  return invoke<string>("create_markdown_file", payload);
}

export function createFolder(payload: CreateFolderPayload) {
  return invoke<void>("create_folder", payload);
}

export function watchMarkdownFolder(folder: string) {
  return invoke<void>("watch_markdown_folder", { folder });
}

export function listenToLibraryChanges(onChange: () => void) {
  return listen("library-changed", onChange);
}
