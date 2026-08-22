export function Brand({ fileName, isDirty }: { fileName: string; isDirty: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <span className="grid size-[34px] place-items-center rounded-[10px] bg-[var(--app-accent)] font-extrabold text-white">か</span>
      <div>
        <strong className="block text-sm tracking-[.02em]">かけるんです</strong>
        <span className="mt-0.5 block max-w-[42vw] overflow-hidden text-ellipsis whitespace-nowrap text-[11px] text-[var(--app-muted)]">
          {fileName}{isDirty ? " •" : ""}
        </span>
      </div>
    </div>
  );
}
