type FooterProps = {
  isDirty: boolean;
  message: string;
};

export function Footer({ isDirty, message }: FooterProps) {
  return (
    <footer className="statusbar">
      <span className={isDirty ? "dirty" : "saved"}>
        {isDirty ? "未保存の変更があります" : "保存済み"}
      </span>
      <span>{message}</span>
    </footer>
  );
}
