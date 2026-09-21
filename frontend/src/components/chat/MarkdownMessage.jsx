import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MarkdownMessage = ({ content }) => {
  return (
    <div className="markdown-content text-sm leading-7 text-slate-300">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mb-4 mt-6 text-2xl font-bold text-white">
              {children}
            </h1>
          ),

          h2: ({ children }) => (
            <h2 className="mb-3 mt-5 text-xl font-bold text-white">
              {children}
            </h2>
          ),

          h3: ({ children }) => (
            <h3 className="mb-2 mt-4 text-lg font-semibold text-white">
              {children}
            </h3>
          ),

          p: ({ children }) => (
            <p className="mb-4 last:mb-0">
              {children}
            </p>
          ),

          ul: ({ children }) => (
            <ul className="mb-4 ml-5 list-disc space-y-1">
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol className="mb-4 ml-5 list-decimal space-y-1">
              {children}
            </ol>
          ),

          li: ({ children }) => (
            <li>{children}</li>
          ),

          blockquote: ({ children }) => (
            <blockquote className="my-4 border-l-4 border-slate-600 pl-4 italic text-slate-400">
              {children}
            </blockquote>
          ),

          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline hover:text-blue-300"
            >
              {children}
            </a>
          ),

          code: ({
            className,
            children,
            ...props
          }) => {
            const match =
              /language-(\w+)/.exec(
                className || ""
              );

            const codeText =
              String(children).replace(
                /\n$/,
                ""
              );

            const isBlock =
              Boolean(match) ||
              codeText.includes("\n");

            if (!isBlock) {
              return (
                <code
                  className="rounded-md bg-slate-800 px-1.5 py-1 font-mono text-[13px] text-slate-200"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <div className="my-4 overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
                {match?.[1] && (
                  <div className="border-b border-slate-800 bg-slate-900 px-4 py-2 text-xs text-slate-500">
                    {match[1]}
                  </div>
                )}

                <pre className="overflow-x-auto p-4">
                  <code
                    className="font-mono text-[13px] leading-6 text-slate-200"
                    {...props}
                  >
                    {codeText}
                  </code>
                </pre>
              </div>
            );
          },

          table: ({ children }) => (
            <div className="my-4 overflow-x-auto">
              <table className="min-w-full border-collapse border border-slate-700 text-sm">
                {children}
              </table>
            </div>
          ),

          th: ({ children }) => (
            <th className="border border-slate-700 bg-slate-900 px-3 py-2 text-left font-semibold text-white">
              {children}
            </th>
          ),

          td: ({ children }) => (
            <td className="border border-slate-700 px-3 py-2">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownMessage;