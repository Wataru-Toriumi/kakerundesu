import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function FolderAction({ children, label, title, onClick }: { children: ReactNode; label: string; title: string; onClick: () => void }) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={(
          <Button
            variant="ghost"
            size="icon"
            className="size-6 text-[var(--app-muted)] hover:bg-[var(--panel)] hover:text-[var(--app-accent)] [&_svg]:size-[13px]"
            onClick={onClick}
            aria-label={label}
          />
        )}
      >
        {children}
      </TooltipTrigger>
      <TooltipContent>{title}</TooltipContent>
    </Tooltip>
  );
}
