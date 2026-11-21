import { Columns2, Eye, FileCode2 } from "lucide-react";
import { Inline } from "@/components/layout/Inline";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { ViewMode } from "@/hooks/useViewMode";

const options = [
  { value: "markdown", label: "Markdownのみ", description: "Markdownのみ表示", icon: FileCode2 },
  { value: "split", label: "並列", description: "Markdownとプレビューを並べて表示", icon: Columns2 },
  { value: "preview", label: "プレビューのみ", description: "プレビューのみ表示", icon: Eye },
] as const;

type ViewModeSelectorProps = {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
};

export function ViewModeSelector({ value, onChange }: ViewModeSelectorProps) {
  return (
    <Inline asChild align="center" flexShrink="0">
      <fieldset aria-label="表示モード" className="rounded-lg border border-[var(--line)] bg-[var(--canvas)] p-0.5">
        {options.map(({ value: mode, label, description, icon: Icon }) => (
          <Tooltip key={mode}>
            <TooltipTrigger
              render={(
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label={label}
                  aria-pressed={value === mode}
                  onClick={() => onChange(mode)}
                  className="rounded-md text-[var(--app-muted)] aria-pressed:bg-[var(--panel)] aria-pressed:text-foreground aria-pressed:shadow-sm"
                />
              )}
            >
              <Icon aria-hidden="true" />
            </TooltipTrigger>
            <TooltipContent side="bottom">{description}</TooltipContent>
          </Tooltip>
        ))}
      </fieldset>
    </Inline>
  );
}
