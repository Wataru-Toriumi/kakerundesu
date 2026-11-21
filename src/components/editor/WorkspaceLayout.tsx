import { useEffect, useState, type ReactNode } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

type WorkspaceLayoutProps = {
  sidebar: ReactNode;
  editor: ReactNode;
  preview: ReactNode;
};

const narrowScreen = "(max-width: 720px)";
const panelSizes = {
  horizontal: {
    sidebar: { defaultSize: "18%", minSize: "12%" },
    document: { defaultSize: "41%", minSize: "20%" },
  },
  vertical: {
    sidebar: { defaultSize: "25%", minSize: "15%" },
    document: { defaultSize: "37.5%", minSize: "15%" },
  },
};

export function WorkspaceLayout({ sidebar, editor, preview }: WorkspaceLayoutProps) {
  const [isNarrow, setIsNarrow] = useState(() => window.matchMedia(narrowScreen).matches);

  useEffect(() => {
    const media = window.matchMedia(narrowScreen);
    const update = () => setIsNarrow(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const orientation = isNarrow ? "vertical" : "horizontal";
  const sizes = panelSizes[orientation];

  return (
    <ResizablePanelGroup orientation={orientation} className="min-h-0">
      <ResizablePanel {...sizes.sidebar}>{sidebar}</ResizablePanel>
      <ResizableHandle />
      <ResizablePanel {...sizes.document}>{editor}</ResizablePanel>
      <ResizableHandle />
      <ResizablePanel {...sizes.document}>{preview}</ResizablePanel>
    </ResizablePanelGroup>
  );
}
