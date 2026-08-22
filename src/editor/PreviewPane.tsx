import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MarkdownBody } from "@/components/editor/MarkdownBody";
import { Pane } from "@/components/editor/Pane";
import { PaneTitle } from "@/components/editor/PaneTitle";

type PreviewPaneProps = {
  content: string;
};

export function PreviewPane({ content }: PreviewPaneProps) {
  return (
    <Pane kind="preview">
      <PaneTitle title="PREVIEW" meta="GFM" />
      <MarkdownBody>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </MarkdownBody>
    </Pane>
  );
}
