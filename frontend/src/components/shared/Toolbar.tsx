interface ToolbarProps {
  onLogoClick?: () => void;
  connected: boolean;
  interviewCount: number;
}

export default function Toolbar({ onLogoClick, connected, interviewCount }: ToolbarProps) {
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
        <div className="flex items-center gap-1.5">
          <div className={`h-2 w-2 rounded-full ${connected ? 'bg-success' : 'bg-error'}`} />
          <span className="text-xs text-text-secondary">{connected ? 'Connected' : 'Disconnected'}</span>
        </div>
        <div className="rounded bg-bg-tertiary px-2 py-0.5 text-xs text-text-secondary">
          {interviewCount} interview{interviewCount !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}
