import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';

interface AnalysisPanelProps {
  analysis: string | null;
  loading: boolean;
  error: string | null;
}

const mdComponents: Components = {
  h2: ({ children }) => (
    <h3 className="mb-2 mt-4 text-sm font-semibold text-accent-cyan first:mt-0">{children}</h3>
  ),
  h3: ({ children }) => (
    <h4 className="mb-1 mt-3 text-xs font-semibold text-text-primary">{children}</h4>
  ),
  p: ({ children }) => (
    <p className="text-xs leading-relaxed text-text-secondary">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-text-primary">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="text-text-secondary italic">{children}</em>
  ),
  ul: ({ children }) => (
    <ul className="ml-3 space-y-1 text-xs text-text-secondary">{children}</ul>
  ),
  li: ({ children }) => (
    <li className="leading-relaxed before:mr-1.5 before:content-['•']">{children}</li>
  ),
  hr: () => <hr className="my-3 border-border-primary" />,
  table: ({ children }) => (
    <div className="my-2 overflow-x-auto">
      <table className="w-full text-xs">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead>{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => (
    <tr className="border-b border-border-primary/50">{children}</tr>
  ),
  th: ({ children }) => (
    <th className="px-2 py-1.5 text-left font-medium text-text-secondary">{children}</th>
  ),
  td: ({ children }) => (
    <td className="px-2 py-1.5 text-text-secondary">{children}</td>
  ),
  code: ({ children }) => (
    <code className="rounded bg-bg-primary/80 px-1 py-0.5 font-mono text-[11px] text-accent-cyan">{children}</code>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-accent-cyan/40 pl-3 text-xs italic text-text-secondary">
      {children}
    </blockquote>
  ),
};

export default function AnalysisPanel({ analysis, loading, error }: AnalysisPanelProps) {
  if (loading) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent-cyan/30 border-t-accent-cyan" />
        <p className="text-xs text-text-secondary">Analyzing interview transcript...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2">
        <p className="text-xs text-error">{error}</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="space-y-3">
        <div className="rounded border border-border-primary bg-bg-tertiary p-3">
          <p className="text-xs text-text-secondary">Complete an interview to see analysis here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
        {analysis}
      </ReactMarkdown>
    </div>
  );
}
