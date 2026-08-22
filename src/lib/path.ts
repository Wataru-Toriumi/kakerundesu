export function fileName(path: string | null) {
  if (!path) return "無題.md";
  return path.split(/[\\/]/).at(-1) ?? path;
}
