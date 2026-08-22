import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type PreviewPaneProps = {
  content: string;
};

export function PreviewPane({ content }: PreviewPaneProps) {
  return (
    <section className="pane preview-pane">
      <div className="pane-title">
        <span>PREVIEW</span>
        <span>GFM</span>
      </div>
      <article className="markdown-body">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </article>
    </section>
  );
}
