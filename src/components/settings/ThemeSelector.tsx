import { Moon, Sun } from "lucide-react";
import { Grid } from "@/components/layout/Grid";
import type { Theme } from "@/hooks/useTheme";

type ThemeSelectorProps = {
  value: Theme;
  onChange: (theme: Theme) => void;
};

const themes = [
  { value: "light", label: "ライト", icon: Sun },
  { value: "dark", label: "ダーク", icon: Moon },
] as const;

export function ThemeSelector({ value: theme, onChange }: ThemeSelectorProps) {
  return (
    <Grid asChild columns="1fr 1fr">
      <fieldset className="gap-2">
        <legend className="mb-2 text-sm font-semibold">外観テーマ</legend>
        {themes.map(({ value, label, icon: Icon }) => (
          <label
            key={value}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--line)] px-3 py-3 has-checked:border-[var(--app-accent)] has-checked:bg-[var(--code)]"
          >
            <Icon aria-hidden="true" className="size-4" />
            {label}
            <input
              className="ml-auto accent-[var(--app-accent)]"
              type="radio"
              name="appearance-theme"
              value={value}
              checked={theme === value}
              onChange={() => onChange(value)}
            />
          </label>
        ))}
      </fieldset>
    </Grid>
  );
}
