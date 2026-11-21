import { useEffect, useId, useState } from "react";
import type { Theme } from "@/hooks/useTheme";

type DiagramResult = {
  source: string;
  theme: Theme;
  image: string | null;
};

export function useMermaidDiagram(source: string, theme: Theme) {
  const diagramId = useId();
  const [result, setResult] = useState<DiagramResult>();

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const { default: mermaid } = await import("mermaid");
        if (cancelled) return;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          suppressErrorRendering: true,
          htmlLabels: false,
          theme: theme === "dark" ? "dark" : "default",
        });

        const { svg } = await mermaid.render(`mermaid-${diagramId}`, source);
        if (!cancelled) {
          setResult({ source, theme, image: `data:image/svg+xml,${encodeURIComponent(svg)}` });
        }
      } catch {
        if (!cancelled) setResult({ source, theme, image: null });
      }
    }

    const timer = window.setTimeout(() => void render(), 150);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [diagramId, source, theme]);

  return result?.source === source && result.theme === theme ? result.image : undefined;
}
