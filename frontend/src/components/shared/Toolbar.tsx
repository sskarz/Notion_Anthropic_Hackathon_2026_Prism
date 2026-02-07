export default function Toolbar() {
  return (
    <div className="flex h-12 shrink-0 items-center border-b border-border-primary bg-bg-secondary px-4">
      <div className="flex items-center gap-2.5">
        <img src="/prism-logo.png" alt="Prism" className="h-6 w-6 rounded" />
        <span className="font-mono text-sm font-semibold tracking-wide text-text-primary">
          Prism
        </span>
      </div>

      <div className="flex-1 text-center">
        <span className="text-sm font-medium text-text-secondary">
          Onboarding Experience Research
        </span>
      </div>

      <div className="flex items-center gap-4">
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
