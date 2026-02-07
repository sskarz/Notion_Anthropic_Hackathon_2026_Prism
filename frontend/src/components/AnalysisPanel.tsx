interface AnalysisPanelProps {
  analysis: string | null;
  loading: boolean;
  error: string | null;
}

function MarkdownSection({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('## ')) {
      elements.push(
        <h3 key={i} className="mb-2 mt-4 text-sm font-semibold text-accent-cyan first:mt-0">
          {line.slice(3)}
        </h3>
      );
    } else if (line.startsWith('| ')) {
      // Collect all table lines
      const tableLines: string[] = [line];
      while (i + 1 < lines.length && lines[i + 1].startsWith('|')) {
        i++;
        tableLines.push(lines[i]);
      }
      const headerCells = tableLines[0].split('|').filter(c => c.trim());
      const dataRows = tableLines.slice(2); // skip header + separator
      elements.push(
        <div key={i} className="my-2 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border-primary">
                {headerCells.map((cell, ci) => (
                  <th key={ci} className="px-2 py-1.5 text-left font-medium text-text-secondary">
                    {cell.trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataRows.map((row, ri) => {
                const cells = row.split('|').filter(c => c.trim());
                return (
                  <tr key={ri} className="border-b border-border-primary/50">
                    {cells.map((cell, ci) => (
                      <td key={ci} className="px-2 py-1.5 text-text-secondary">
                        {cell.trim()}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    } else if (line.startsWith('- ')) {
      elements.push(
        <p key={i} className="ml-3 text-xs leading-relaxed text-text-secondary before:mr-1.5 before:content-['•']">
          {line.slice(2)}
        </p>
      );
    } else if (line.trim() === '---') {
      elements.push(<hr key={i} className="my-3 border-border-primary" />);
    } else if (line.trim()) {
      elements.push(
        <p key={i} className="text-xs leading-relaxed text-text-secondary">
          {line}
        </p>
      );
    }
  }

  return <>{elements}</>;
}

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
      <MarkdownSection content={analysis} />
    </div>
  );
}
