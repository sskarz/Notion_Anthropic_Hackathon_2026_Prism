interface ToolbarProps {
  onLogoClick?: () => void;
}

export default function Toolbar({ onLogoClick }: ToolbarProps) {
  return (
    <div className="flex h-12 shrink-0 items-center border-b border-border-primary bg-bg-secondary px-4">
      <button
        type="button"
        onClick={onLogoClick}
        className="flex items-center gap-2.5 rounded px-1 py-0.5 transition-colors hover:bg-bg-tertiary"
      >
        <img src="/prism-logo.png" alt="Prism" className="h-6 w-6 rounded" />
        <span className="font-mono text-sm font-semibold tracking-wide text-text-primary">
          Prism
        </span>
      </button>

      <div className="flex-1 text-center">
        <span className="text-sm font-medium text-text-secondary">
          Notion PM User Research - Custom Agents
        </span>
      </div>
    </div>
  );
}
