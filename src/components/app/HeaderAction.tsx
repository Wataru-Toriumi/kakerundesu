import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type HeaderActionProps = {
  icon: LucideIcon;
  label: string;
  title?: string;
  primary?: boolean;
  iconOnly?: boolean;
  onClick: () => void;
};

export function HeaderAction({ icon: Icon, label, title, primary, iconOnly, onClick }: HeaderActionProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={(
          <Button
            variant={primary ? "default" : "outline"}
            size={iconOnly ? "icon" : "sm"}
            className={cn(
              "h-[34px] border-[var(--line)] bg-transparent text-inherit hover:bg-[var(--code)] hover:text-inherit max-[720px]:size-9 max-[720px]:px-0",
              primary && "border-[var(--app-accent)] bg-[var(--app-accent)] text-white hover:bg-[var(--accent-hover)] hover:text-white",
            )}
            onClick={onClick}
            aria-label={iconOnly ? label : undefined}
          />
        )}
      >
        <Icon className="size-4" />
        {!iconOnly && <span className="max-[720px]:hidden">{label}</span>}
      </TooltipTrigger>
      <TooltipContent>{title ?? label}</TooltipContent>
    </Tooltip>
  );
}
