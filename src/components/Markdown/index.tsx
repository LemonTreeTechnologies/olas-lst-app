import React from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { Components } from "react-markdown";

export interface MarkdownRendererProps {
  content: string;
}

const components: Components = {
  h1: (props) => (
    <h1 className="text-3xl font-bold mt-8 mb-4 text-primary" {...props} />
  ),
  h2: (props) => (
    <h2 className="text-2xl font-bold mt-6 mb-3 text-primary" {...props} />
  ),
  h3: (props) => (
    <h3 className="text-xl font-semibold mt-4 mb-2 text-primary" {...props} />
  ),
  hr: () => (
    <div className="my-8 border-t border-neutral-300 w-full opacity-60" />
  ),
  a: (props) => <a className="underline" {...props} />,
  // Extend with more customizations as needed
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
}) => (
  <ReactMarkdown components={components} remarkPlugins={[remarkBreaks]}>
    {content}
  </ReactMarkdown>
);

export default MarkdownRenderer;
