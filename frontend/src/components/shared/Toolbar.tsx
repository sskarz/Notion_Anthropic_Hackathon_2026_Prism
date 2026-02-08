import { Play } from 'lucide-react';

interface ToolbarProps {
  onLogoClick?: () => void;
  onSimulate?: () => void;
}

export default function Toolbar({ onLogoClick, onSimulate }: ToolbarProps) {
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
          Onboarding Experience Research
        </span>
      </div>

      <div className="flex items-center gap-4">
        {onSimulate && (
          <button
            onClick={onSimulate}
            className="flex items-center gap-1.5 rounded border border-accent-cyan/30 bg-accent-cyan/10 px-2.5 py-1 text-xs font-medium text-accent-cyan transition-colors hover:bg-accent-cyan/20"
          >
            <Play size={12} />
            Simulate Interview
          </button>
        )}
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-success" />
          <span className="text-xs text-text-secondary">Connected</span>
        </div>
        <div className="rounded bg-bg-tertiary px-2 py-0.5 text-xs text-text-secondary">
          3 interviews
        </div>
      </div>
    </div>
  );
}
