import { Children, Fragment, useEffect, useState, type ReactNode } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

export function WorkspaceLayout({ children }: { children: ReactNode }) {
  const [isNarrow, setIsNarrow] = useState(() => window.matchMedia("(max-width: 720px)").matches);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 720px)");
    const update = () => setIsNarrow(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const panels = Children.toArray(children);

  return (
    <ResizablePanelGroup orientation={isNarrow ? "vertical" : "horizontal"} className="min-h-0">
      {panels.map((panel, index) => (
        <Fragment key={index}>
          {index > 0 && <ResizableHandle />}
          <ResizablePanel defaultSize={isNarrow ? (index === 0 ? "25%" : "37.5%") : (index === 0 ? "18%" : "41%")} minSize={isNarrow ? "15%" : index === 0 ? "12%" : "20%"}>
            {panel}
          </ResizablePanel>
        </Fragment>
      ))}
    </ResizablePanelGroup>
  );
}
