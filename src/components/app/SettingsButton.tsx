import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function SettingsButton({ onClick }: { onClick: () => void }) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={(
          <Button
            variant="outline"
            size="icon"
            className="h-[34px] border-[var(--line)] bg-transparent text-inherit hover:bg-[var(--code)] hover:text-inherit max-[720px]:size-9"
            onClick={onClick}
            aria-label="設定"
          />
        )}
      >
        <Settings className="size-4" />
      </TooltipTrigger>
      <TooltipContent>設定</TooltipContent>
    </Tooltip>
  );
}
