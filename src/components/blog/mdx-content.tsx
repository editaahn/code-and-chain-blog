import type { MDXComponents } from "mdx/types";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { highlight } from "sugar-high";

const components = {
  a: ({ href, rel, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isExternalLink = Boolean(href && /^(https?:)?\/\//.test(href));
    const safeRel = rel ? `${rel} noopener noreferrer` : "noopener noreferrer";

    return (
      <a
        href={href}
        target={isExternalLink ? "_blank" : undefined}
        rel={isExternalLink ? safeRel : rel}
        {...props}
      />
    );
  },
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
  table: ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="mdx-table-wrap my-8 overflow-x-auto rounded-xl border border-border bg-card/40 shadow-sm ring-1 ring-border/60 dark:bg-card/30 dark:ring-border/40">
      <table
        className="w-full min-w-[min(100%,42rem)] border-collapse text-[0.9375rem] leading-snug"
        {...props}
      >
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className="border-b border-border bg-muted/70 dark:bg-muted/50" {...props}>
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <tbody className="[&_tr:last-child_td]:border-b-0" {...props}>
      {children}
    </tbody>
  ),
  tr: ({ children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr {...props}>{children}</tr>
  ),
  th: ({ children, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th
      className="px-4 py-3.5 text-left align-top text-sm font-semibold tracking-tight text-foreground first:pl-5 last:pr-5"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td
      className="border-b border-border/70 px-4 py-3.5 align-top text-foreground/90 first:pl-5 last:pr-5 [&_strong]:font-semibold [&_strong]:text-foreground"
      {...props}
    >
      {children}
    </td>
  ),
} satisfies MDXComponents;

interface MDXContentProps {
  content: string;
}

export async function MDXContent({ content }: MDXContentProps) {
  return (
    <div className="mdx-content">
      <MDXRemote
        source={content}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
          },
        }}
      />
    </div>
  );
}
