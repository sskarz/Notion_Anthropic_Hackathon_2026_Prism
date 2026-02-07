export default function StatusBar() {
  return (
    <div className="flex h-7 shrink-0 items-center justify-between border-t border-border-primary bg-bg-secondary px-4 text-xs text-text-tertiary">
      <div className="flex items-center gap-1.5">
        <div className="h-1.5 w-1.5 rounded-full bg-success" />
        <span>Notion Connected</span>
      </div>

      <span>Last sync: 2s ago</span>

      <span>3 interviews completed</span>
    </div>
  );
}
