import { useEffect, useRef } from "react";
import { Check, FileText, Folder, X } from "lucide-react";
import { NewItemAction } from "@/components/editor/NewItemAction";
import { NewItemForm } from "@/components/editor/NewItemForm";
import { NewItemInput } from "@/components/editor/NewItemInput";

type LibraryItemCreationFormProps = {
  kind: "file" | "directory";
  depth: number;
  name: string;
  onChangeName: (name: string) => void;
  onSubmit: () => void | Promise<void>;
  onCancel: () => void;
};

export function LibraryItemCreationForm({
  kind,
  depth,
  name,
  onChangeName,
  onSubmit,
  onCancel,
}: LibraryItemCreationFormProps) {
  const isFile = kind === "file";
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <NewItemForm depth={depth} onSubmit={onSubmit}>
      {isFile ? <FileText /> : <Folder />}
      <NewItemInput
        ref={inputRef}
        value={name}
        onChange={(event) => onChangeName(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") onCancel();
        }}
        aria-label={isFile ? "新しいファイル名" : "新しいフォルダ名"}
      />
      <NewItemAction type="submit" label="作成"><Check /></NewItemAction>
      <NewItemAction type="button" onClick={onCancel} label="キャンセル"><X /></NewItemAction>
    </NewItemForm>
  );
}
