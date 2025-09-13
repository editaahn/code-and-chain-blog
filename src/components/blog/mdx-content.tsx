"use client";

import { MDXRemote } from "next-mdx-remote/rsc";
import { highlight } from "sugar-high";

const components = {
  pre: ({ children, ...props }: React.HTMLProps<HTMLPreElement>) => {
    return (
      <pre className="overflow-x-auto rounded-lg bg-muted p-4" {...props}>
        {children}
      </pre>
    );
  },
  code: ({
    children,
    ...props
  }: React.HTMLProps<HTMLElement> & { children: string }) => {
    const codeHTML = highlight(children);
    return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />;
  },
};

interface MDXContentProps {
  content: string;
}

export function MDXContent({ content }: MDXContentProps) {
  return (
    <div className="mdx-content">
      <MDXRemote source={content} components={components} />
    </div>
  );
}
