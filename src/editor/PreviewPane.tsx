import { isValidElement } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { MarkdownBody } from "@/components/editor/MarkdownBody";
import { MermaidDiagram } from "@/components/editor/MermaidDiagram";
import { Pane } from "@/components/editor/Pane";
import { PaneTitle } from "@/components/editor/PaneTitle";
import type { Theme } from "@/hooks/useTheme";

type PreviewPaneProps = {
  content: string;
  theme: Theme;
};

function componentsForTheme(theme: Theme): Components {
  return {
    pre({ children }) {
      if (
        isValidElement<{ className?: string; children?: string }>(children)
        && children.type === "code"
        && children.props.className?.toLowerCase() === "language-mermaid"
        && typeof children.props.children === "string"
      ) {
        return <MermaidDiagram source={children.props.children} theme={theme} />;
      }
      return <pre>{children}</pre>;
    },
  };
}

const components = {
  light: componentsForTheme("light"),
  dark: componentsForTheme("dark"),
};

export function PreviewPane({ content, theme }: PreviewPaneProps) {
  return (
    <Pane kind="preview">
      <PaneTitle title="PREVIEW" meta="GFM · Mermaid" />
      <MarkdownBody>
        <ReactMarkdown components={components[theme]} remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </MarkdownBody>
    </Pane>
  );
}
