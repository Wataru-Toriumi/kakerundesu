import { useMermaidDiagram } from "@/hooks/useMermaidDiagram";
import type { Theme } from "@/hooks/useTheme";

export function MermaidDiagram({ source, theme }: { source: string; theme: Theme }) {
  const image = useMermaidDiagram(source, theme);
  if (image) return <img src={image} alt="Mermaidの図" className="my-4 h-auto max-w-full" />;

  return (
    <>
      {image === null && <p>Mermaidの図を描画できませんでした。</p>}
      <pre><code>{source}</code></pre>
    </>
  );
}
