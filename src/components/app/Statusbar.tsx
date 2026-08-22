export function Statusbar({ isDirty, message }: { isDirty: boolean; message: string }) {
  return (
    <footer className="flex items-center justify-between border-t border-[var(--line)] bg-[var(--panel)] px-3 text-[10px] text-[var(--app-muted)]">
      <span className={isDirty ? "text-[var(--app-accent)]" : "text-[#4b8c5a]"}>
        {isDirty ? "未保存の変更があります" : "保存済み"}
      </span>
      <span>{message}</span>
    </footer>
  );
}
